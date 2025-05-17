let audioContext;
let micStream;
let source;
const audioPlayer = document.getElementById("audioPlayer");

const inputSelect = document.getElementById("inputSelect");
const outputSelect = document.getElementById("outputSelect");

async function getDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  inputSelect.innerHTML = '';
  outputSelect.innerHTML = '';

  devices.forEach(device => {
    const option = new Option(device.label || `${device.kind} - ${device.deviceId}`, device.deviceId);
    if (device.kind === 'audioinput') inputSelect.appendChild(option);
    if (device.kind === 'audiooutput') outputSelect.appendChild(option);
  });
}

async function startMic() {
  const deviceId = inputSelect.value;
  const constraints = {
    audio: {
      deviceId: deviceId ? { exact: deviceId } : undefined
    }
  };

  audioContext = new AudioContext();
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  micStream = stream;

  source = audioContext.createMediaStreamSource(stream);
  source.connect(audioContext.destination);
}

function stopMic() {
  if (micStream) {
    micStream.getTracks().forEach(track => track.stop());
  }
  if (audioContext) {
    audioContext.close();
  }
}

function playMusic() {
  const fileInput = document.getElementById("fileInput");
  const urlInput = document.getElementById("urlInput");

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    audioPlayer.src = URL.createObjectURL(file);
  } else if (urlInput.value.trim()) {
    audioPlayer.src = urlInput.value.trim();
  }

  audioPlayer.play();
}

function setOutputDevice() {
  const selectedDeviceId = outputSelect.value;
  if (typeof audioPlayer.setSinkId !== 'undefined') {
    audioPlayer.setSinkId(selectedDeviceId).then(() => {
      console.log("Çıkış cihazı ayarlandı:", selectedDeviceId);
    }).catch(e => console.error("Hoparlör seçimi desteklenmiyor:", e));
  }
}

document.getElementById("startMic").addEventListener("click", startMic);
document.getElementById("stopMic").addEventListener("click", stopMic);
document.getElementById("playMusic").addEventListener("click", playMusic);
outputSelect.addEventListener("change", setOutputDevice);

// Sayfa yüklenince cihazları al
getDevices();
