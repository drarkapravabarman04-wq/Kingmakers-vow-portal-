let currentArc = 1;

let showingDossier = false;

function switchTab(targetTabId) {
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active', 'text-gold-500', 'border-b-2', 'border-gold-500'); b.classList.add('text-slate-400'); });
  const tabPane = document.getElementById(targetTabId);
  if (tabPane) tabPane.classList.remove('hidden');
  const activeBtn = document.getElementById(`tab-${targetTabId.split('-')[1]}`);
  if (activeBtn) { activeBtn.classList.add('active', 'text-gold-500', 'border-b-2', 'border-gold-500'); activeBtn.classList.remove('text-slate-400'); }
}

function addConsoleLog(message) {
  const screen = document.getElementById('diagnostics-log');
  if (!screen) return;
  const row = document.createElement('div');
  row.textContent = `> ${message}`;
  screen.appendChild(row);
  screen.scrollTop = screen.scrollHeight;
}

function applyArcTheme(arcNumber) {
  document.body.classList.remove('arc-theme-1', 'arc-theme-2');
  document.body.classList.add(ARC_DATA[arcNumber].theme);
  const cover = document.getElementById('dash-cover-image');
  if (cover) cover.src = ARC_DATA[arcNumber].cover;
}

function selectArc(arcNumber) {
  currentArc = arcNumber;
  const arc = ARC_DATA[arcNumber];
  const slider = document.getElementById('slider-spoiler');
  const minLabel = document.getElementById('slider-min-label');
  const maxLabel = document.getElementById('slider-max-label');
  const desc = document.getElementById('arc-description');
  const readTitle = document.getElementById('arc-read-title');
  const readBadge = document.getElementById('arc-read-badge');
  const readDesc = document.getElementById('arc-read-desc');
  const arc1Btn = document.getElementById('arc-1-btn');
  const arc2Btn = document.getElementById('arc-2-btn');

  applyArcTheme(arcNumber);

  if (slider) { slider.min = arc.min; slider.max = arc.max; slider.value = arc.min; }
  if (minLabel) minLabel.textContent = `Ch. ${arc.min}`;
  if (maxLabel) maxLabel.textContent = `Ch. ${arc.max}`;
  if (desc) desc.textContent = arc.desc;
  if (readTitle) readTitle.textContent = arc.title;
  if (readBadge) readBadge.textContent = arc.badge;
  if (readDesc) readDesc.textContent = arc.read;
  if (arc1Btn && arc2Btn) {
    arc1Btn.classList.toggle('active', arcNumber === 1);
    arc2Btn.classList.toggle('active', arcNumber === 2);
    arc1Btn.classList.toggle('text-gold-500', arcNumber === 1);
    arc2Btn.classList.toggle('text-gold-500', arcNumber === 2);
    arc1Btn.classList.toggle('text-slate-400', arcNumber !== 1);
    arc2Btn.classList.toggle('text-slate-400', arcNumber !== 2);
  }
  handleSpoilerAdjustment(arc.min);
  resizeCoverCanvases();
}

function handleSpoilerAdjustment(val) {
  const ch = parseFloat(val);
  const label = document.getElementById('label-spoiler-chapter');
  const chapter = Math.max(1, Math.floor(ch));
  const chapterData = CHAPTER_CHRONOLOGY.find(x => x.ch === chapter);
  if (label) label.innerText = chapterData ? `Ch. ${chapter} - ${chapterData.title}` : `Ch. ${chapter}`;
  renderActiveSuiteData(ch);
}

function renderActiveSuiteData(limitChapter) {
  const charsContainer = document.getElementById('characters-list');
  const loreContainer = document.getElementById('lore-list');
  const timelineContainer = document.getElementById('timeline-list');
  if (charsContainer) charsContainer.innerHTML = '';
  if (loreContainer) loreContainer.innerHTML = '';
  if (timelineContainer) timelineContainer.innerHTML = '';

  NOVEL_CHARACTERS.filter(c => c.minCh <= limitChapter).forEach(c => {
    if (!charsContainer) return;
    const card = document.createElement('div');
    card.className = 'glass-panel p-4 rounded-lg hover:border-gold-500/30 transition-all duration-300';
    card.innerHTML = `<div class="text-gold-500 font-bold font-mono text-xs uppercase mb-1">${c.name}</div><div class="text-[11px] text-slate-400 mb-2">${c.role}</div><div class="text-xs text-slate-300 leading-relaxed">${c.desc}</div><div class="mt-3 pt-3 border-t border-gold-500/10 text-[10px] text-gold-400/80 font-mono uppercase tracking-wider">Vow Type: ${c.vowType}</div><div class="mt-2 text-[11px] text-slate-400 italic">“${c.quote.replace(/^“|”$/g, '')}”</div>`;
    charsContainer.appendChild(card);
  });

  NOVEL_LORE.filter(l => l.minCh <= limitChapter).forEach(l => {
    if (!loreContainer) return;
    const item = document.createElement('div');
    item.className = 'glass-panel p-4 rounded-lg hover:border-gold-500/30 transition-all duration-300';
    item.innerHTML = `<div class="text-gold-500 font-bold font-mono text-xs uppercase mb-1">${l.title}</div><div class="text-xs text-slate-300 mb-2">${l.summary}</div><ul class="list-disc pl-4 space-y-1 text-[11px] text-slate-400">${l.rules.map(r => `<li>${r}</li>`).join('')}</ul>`;
    loreContainer.appendChild(item);
  });

  CHAPTER_CHRONOLOGY.filter(t => t.ch <= limitChapter).forEach(t => {
    if (!timelineContainer) return;
    const item = document.createElement('div');
    item.className = 'glass-panel p-4 rounded-lg hover:border-gold-500/30 transition-all duration-300';
    item.innerHTML = `<div class="flex items-center justify-between mb-1"><span class="text-gold-500 font-bold font-mono text-xs uppercase">Chapter ${t.ch}</span><span class="text-[10px] text-slate-500">${t.title}</span></div><div class="text-xs text-slate-300">${t.summary}</div>`;
    timelineContainer.appendChild(item);
  });
}

function showChaptersList() { switchTab('pane-timeline'); }
function beginStory() {
    window.open(
        "https://www.royalroad.com/fiction/151082/the-threshold/chapter/3002483/the-dream-that-doesnt-matter",
        "_blank"
    );
}

function toggleArchiveCard() {

    const title =
        document.getElementById("archive-card-title");

    const content =
        document.getElementById("archive-card-content");

    if (!showingDossier) {

        const dossier =
            ARC_DOSSIERS[currentArc];

        title.textContent =
            dossier.title;

        content.innerHTML = `
            <p class="text-slate-300 text-xs md:text-sm leading-loose font-mono">
                ${dossier.text}
            </p>
        `;

        showingDossier = true;

    } else {

        title.textContent =
            "Archive Abstract";

        content.innerHTML = `
            <p class="text-slate-300 text-xs md:text-sm leading-loose font-mono">
                A boy who wasted his first life is reborn into a world where
                <span class="text-gold-500">power is born from promises.</span>
            </p>

            <p class="text-slate-400 text-xs mt-3 leading-loose font-mono">
                Every vow grants strength. Every broken promise erases futures.
                Armed with knowledge from a ruined future, Krish Laran seeks
                to master the art of Sankalp and reshape the destiny of kingdoms.
            </p>
        `;

        showingDossier = false;
    }
}
