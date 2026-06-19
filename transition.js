const transCanvas = document.getElementById('transition-canvas');
const tCtx = transCanvas ? transCanvas.getContext('2d') : null;
let isPruning = false;

function executeTimelinePruningAnimation() {
  if (!transCanvas || !tCtx) { completePhaseTransition(); return; }
  const branches = [
    { sx: 0, sy: 0, color: 'rgba(212, 175, 55, 0.4)' },
    { sx: transCanvas.width, sy: 0, color: 'rgba(5, 150, 105, 0.4)' },
    { sx: 0, sy: transCanvas.height, color: 'rgba(184, 115, 51, 0.4)' },
    { sx: transCanvas.width, sy: transCanvas.height, color: 'rgba(212, 175, 55, 0.4)' }
  ];
  const startTime = Date.now();
  const duration = 1600;

  function animateCollapse() {
    const now = Date.now();
    const progress = Math.min((now - startTime) / duration, 1);
    const centerX = transCanvas.width / 2;
    const centerY = transCanvas.height / 2;

    tCtx.fillStyle = 'rgba(5, 8, 20, 0.25)';
    tCtx.fillRect(0, 0, transCanvas.width, transCanvas.height);

    branches.forEach(b => {
      const currentX = b.sx + (centerX - b.sx) * progress;
      const currentY = b.sy + (centerY - b.sy) * progress;
      tCtx.strokeStyle = b.color;
      tCtx.lineWidth = 2 * (1 - progress) + 0.5;
      tCtx.beginPath();
      tCtx.moveTo(b.sx, b.sy);
      tCtx.lineTo(currentX, currentY);
      tCtx.stroke();
    });

    tCtx.fillStyle = '#d4af37';
    tCtx.shadowColor = '#d4af37';
    tCtx.shadowBlur = 15;
    tCtx.beginPath();
    tCtx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    tCtx.fill();
    tCtx.shadowBlur = 0;

    if (progress < 1) requestAnimationFrame(animateCollapse);
    else setTimeout(completePhaseTransition, 120);
  }
  requestAnimationFrame(animateCollapse);
}

function completePhaseTransition() {
  const portal = document.getElementById('landing-portal');
  const dash = document.getElementById('dashboard-suite');
  if (portal) { portal.classList.add('opacity-0', 'pointer-events-none'); setTimeout(() => portal.classList.add('hidden'), 1000); }
  if (dash) { dash.classList.remove('hidden'); dash.classList.add('flex'); requestAnimationFrame(() => { dash.classList.remove('opacity-0'); dash.classList.add('opacity-100'); resizeCoverCanvases(); }); }
  if (transCanvas) setTimeout(() => transCanvas.classList.add('hidden'), 1400);
  renderActiveSuiteData(parseFloat(document.getElementById('slider-spoiler').value || '1'));
  isPruning = false;
}
