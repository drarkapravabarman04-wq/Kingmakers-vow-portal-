const portalCanvas = document.getElementById('portal-canvas');
const pCtx = portalCanvas ? portalCanvas.getContext('2d') : null;
const dashCanvas = document.getElementById('dash-cover-canvas');
let dCtx = null, particles = [], ancestralGlyphs = [];

class Particle { 
  constructor(canvasObj) { this.canvas = canvasObj; this.reset(); } 
  reset() { this.x = Math.random() * this.canvas.width; this.y = this.canvas.height + Math.random() * 20; this.size = 0.5 + Math.random() * 2.2; this.speedY = 0.2 + Math.random() * 0.8; this.speedX = (Math.random() - 0.5) * 0.3; this.alpha = 0.1 + Math.random() * 0.7; this.color = Math.random() > 0.55 ? 'rgba(212, 175, 55,' : 'rgba(5, 150, 105,'; } 
  update() { this.y -= this.speedY; this.x += this.speedX; if (this.y < 0 || this.x < 0 || this.x > this.canvas.width) this.reset(); } 
  draw(context) { if (!context) return; context.fillStyle = `${this.color}${this.alpha})`; context.beginPath(); context.arc(this.x, this.y, this.size, 0, Math.PI * 2); context.fill(); } 
}

class GlyphFragment { 
  constructor(canvasObj) { this.canvas = canvasObj; this.reset(); } 
  reset() { this.x = Math.random() * this.canvas.width; this.y = this.canvas.height + Math.random() * 40; this.char = brahmiAncestralGlyphs[Math.floor(Math.random() * brahmiAncestralGlyphs.length)]; this.fontSize = 9 + Math.random() * 7; this.speedY = 0.15 + Math.random() * 0.35; this.speedX = (Math.random() - 0.5) * 0.15; this.alpha = 0.05 + Math.random() * 0.25; } 
  update() { this.y -= this.speedY; this.x += this.speedX; if (this.y < -20) this.reset(); } 
  draw(context) { if (!context) return; context.font = `${this.fontSize}px serif`; context.fillStyle = `rgba(212, 175, 55, ${this.alpha})`; context.fillText(this.char, this.x, this.y); } 
}

function resizeCoverCanvases() {
  const portalFrame = document.getElementById('portal-cover-frame');
  if (portalFrame && portalCanvas) { portalCanvas.width = portalFrame.clientWidth; portalCanvas.height = portalFrame.clientHeight; }
  const dashFrame = document.getElementById('dash-cover-frame');
  const dashSuite = document.getElementById('dashboard-suite');
  if (dashFrame && dashCanvas && dashSuite && !dashSuite.classList.contains('hidden')) {
    dashCanvas.width = dashFrame.clientWidth || 280;
    dashCanvas.height = dashFrame.clientHeight || 420;
  }
}

function initCanvasLayers() {
  if (dashCanvas) dCtx = dashCanvas.getContext('2d');
  resizeCoverCanvases();
  window.addEventListener('resize', resizeCoverCanvases);
  if (portalCanvas) {
    for (let i = 0; i < 50; i++) particles.push(new Particle(portalCanvas));
    for (let i = 0; i < 15; i++) ancestralGlyphs.push(new GlyphFragment(portalCanvas));
  }
  runCoverAnimations();
}

function runCoverAnimations() {
  if (pCtx && portalCanvas && portalCanvas.width > 0) {
    pCtx.clearRect(0, 0, portalCanvas.width, portalCanvas.height);
    particles.forEach(p => { p.update(); p.draw(pCtx); });
    ancestralGlyphs.forEach(g => { g.update(); g.draw(pCtx); });
  }
  const dashSuite = document.getElementById('dashboard-suite');
  if (dCtx && dashCanvas && dashCanvas.width > 0 && dashSuite && !dashSuite.classList.contains('hidden')) {
    dCtx.clearRect(0, 0, dashCanvas.width, dashCanvas.height);
    particles.slice(0, 25).forEach(p => p.draw(dCtx));
    ancestralGlyphs.slice(0, 8).forEach(g => g.draw(dCtx));
  }
  requestAnimationFrame(runCoverAnimations);
}
