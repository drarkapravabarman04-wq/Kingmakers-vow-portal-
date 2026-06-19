// Global System Anomaly/Exception Handler
window.onerror = function(msg, src, line) {
  const diagnosticLog = document.getElementById('diagnostics-log');
  if (diagnosticLog) {
    const item = document.createElement('div');
    item.className = "text-red-500 font-bold";
    item.textContent = `[ANOMALY] > Matrix Exception: ${msg} on Line ${line}`;
    diagnosticLog.appendChild(item);
    diagnosticLog.scrollTop = diagnosticLog.scrollHeight;
  }
};

// Lifecycle Orchestration Loop
window.addEventListener('load', () => {
  initCanvasLayers();
  
  const muteBtn = document.getElementById('btn-audio-mute');
  if (muteBtn) muteBtn.addEventListener('click', toggleAudioState);
  
  const enterButton = document.getElementById('btn-prune-enter');
  if (enterButton) enterButton.addEventListener('click', () => {
    if (isPruning) return;
    isPruning = true;
    initAudio();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    if (transCanvas) {
      transCanvas.classList.remove('hidden');
      transCanvas.width = window.innerWidth;
      transCanvas.height = window.innerHeight;
      transCanvas.style.zIndex = '60';
    }
    executeTimelinePruningAnimation();
  });

  // Initialization Defaults
  selectArc(1);
  renderActiveSuiteData(1);
});
