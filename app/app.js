// Platinum Road — bootstrap. Loads the trophy data, the roadmap and the
// source list, then wires the tracker, the filters, the spoiler setting, the
// tabs and the detail panel. Everything it loads is a file under app/.
import { loadProgress, saveProgress, exportProgress, importProgress } from './tracker.js';
import { renderList, renderDetail, renderRoadmap, renderProgress, renderSources } from './render.js';

const trophyData = await (await fetch('data/trophies.json')).json();
const roadmap = await (await fetch('data/roadmap.json')).json();
const sources = await (await fetch('data/sources.json')).json();
const trophies = trophyData.trophies;

const state = {
  earned: loadProgress(trophies.map((t) => t.id)),
  spoilerOn: true,
  selectedId: null,
  view: 'guide',
  filters: { search: '', grade: 'all', kind: 'all', earned: 'all' },
};

const listEl = document.getElementById('trophyList');
const detailEl = document.getElementById('detail');
const countEl = document.getElementById('countLine');
const fillEl = document.getElementById('progressFill');
const progressTextEl = document.getElementById('progressText');
const viewGuide = document.getElementById('viewGuide');
const viewRoadmap = document.getElementById('viewRoadmap');
const tabGuide = document.getElementById('tabGuide');
const tabRoadmap = document.getElementById('tabRoadmap');

document.getElementById('honestyNote').textContent = trophyData.list_status;
document.getElementById('roadmapTitle').textContent = roadmap.title;
document.getElementById('roadmapIntro').textContent = roadmap.intro;
renderRoadmap(document.getElementById('roadmapList'), roadmap, trophies);
renderSources(document.getElementById('sourceList'), sources);

function renderAll() {
  const shown = renderList(listEl, trophies, sources, state, onToggle, onSelect);
  countEl.textContent = `Showing ${shown} of ${trophies.length} trophies · ${state.earned.size} earned`;
  renderDetail(detailEl, trophies, sources, state);
  renderProgress(fillEl, progressTextEl, state.earned, trophies.length);
}

function onToggle(id, checked) {
  if (checked) state.earned.add(id);
  else state.earned.delete(id);
  saveProgress(state.earned);
  renderAll();
}

function onSelect(id) {
  state.selectedId = id;
  renderAll();
  detailEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showView(view) {
  state.view = view;
  const guide = view === 'guide';
  viewGuide.hidden = !guide;
  viewRoadmap.hidden = guide;
  tabGuide.classList.toggle('active', guide);
  tabRoadmap.classList.toggle('active', !guide);
  tabGuide.setAttribute('aria-selected', String(guide));
  tabRoadmap.setAttribute('aria-selected', String(!guide));
}

function applyHash() {
  const hash = location.hash;
  const trophyMatch = hash.match(/^#\/trophy\/(\d+)$/);
  if (trophyMatch) {
    const id = Number(trophyMatch[1]);
    if (trophies.some((t) => t.id === id)) state.selectedId = id;
    showView('guide');
  } else if (hash === '#/roadmap') {
    showView('roadmap');
  } else {
    showView('guide');
  }
  renderAll();
}

document.getElementById('search').addEventListener('input', (event) => {
  state.filters.search = event.target.value.trim().toLowerCase();
  renderAll();
});
document.getElementById('gradeFilter').addEventListener('change', (event) => {
  state.filters.grade = event.target.value;
  renderAll();
});
document.getElementById('kindFilter').addEventListener('change', (event) => {
  state.filters.kind = event.target.value;
  renderAll();
});
document.getElementById('earnedFilter').addEventListener('change', (event) => {
  state.filters.earned = event.target.value;
  renderAll();
});
document.getElementById('spoilerToggle').addEventListener('change', (event) => {
  state.spoilerOn = event.target.checked;
  renderAll();
});
document.getElementById('exportBtn').addEventListener('click', () => exportProgress(state.earned));
document.getElementById('importFile').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imported = await importProgress(file, trophies.map((t) => t.id));
    if (!imported) throw new Error('not a progress file');
    state.earned = imported;
    saveProgress(state.earned);
    renderAll();
  } catch {
    alert('That file is not a Platinum Road progress export.');
  }
  event.target.value = '';
});
tabGuide.addEventListener('click', () => { location.hash = '#/'; });
tabRoadmap.addEventListener('click', () => { location.hash = '#/roadmap'; });
window.addEventListener('hashchange', applyHash);

applyHash();
