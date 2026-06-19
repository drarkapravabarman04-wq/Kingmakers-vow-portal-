let audioCtx = null, ambientDroneNode1 = null, ambientDroneNode2 = null;

function initAudio() {
  if (audioCtx) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    ambientDroneNode1 = audioCtx.createOscillator();
    ambientDroneNode1.type = 'triangle';
    ambientDroneNode1.frequency.setValueAtTime(55, audioCtx.currentTime);
    ambientDroneNode2 = audioCtx.createOscillator();
    ambientDroneNode2.type = 'sine';
    ambientDroneNode2.frequency.setValueAtTime(110, audioCtx.currentTime);
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, audioCtx.currentTime);
    filter.Q.setValueAtTime(5, audioCtx.currentTime);
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    ambientDroneNode1.connect(filter);
    ambientDroneNode2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    ambientDroneNode1.start();
    ambientDroneNode2.start();
    addConsoleLog("Diagnostic Audio: Temporal drone hum successfully initialized.");
  } catch (e) { console.error(e); }
}

function toggleAudioState() {
  if (!audioCtx) { initAudio(); return; }
  if (audioCtx.state === 'running') audioCtx.suspend(); else audioCtx.resume();
  const audioText = document.getElementById('audio-text');
  if (audioText) audioText.textContent = audioCtx.state === 'running' ? 'IMMERSIVE HUM: ON' : 'IMMERSIVE HUM: OFF';
}
