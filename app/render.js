// Rendering for Platinum Road: the trophy list, the detail panel, the
// roadmap and the progress bar. All text comes from data/trophies.json,
// data/roadmap.json and data/sources.json; nothing here fetches the network.
const HIDDEN_NAME = 'Hidden trophy';
const HIDDEN_DESC = 'Story trophy — its name and description stay hidden until you earn it.';

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export function kindLabel(category) {
  const labels = {
    story: 'Story',
    missable: 'Missable',
    collectible: 'Collectibles',
    activity: 'Activities',
    side: 'Strangers & side',
    heist: 'Heists',
    secret: 'Secret',
    completion: 'Completion',
    platinum: 'Platinum',
  };
  return labels[category] ?? category;
}

// A trophy is shown masked while spoiler mode is on and it is not earned yet.
export function isMasked(trophy, spoilerOn, earned) {
  return spoilerOn && trophy.spoiler && !earned.has(trophy.id);
}

export function trophyMatches(trophy, filters, earned) {
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.kind === 'missable') {
    if (!trophy.missable) return false;
  } else if (filters.kind !== 'all' && trophy.category !== filters.kind) {
    return false;
  }
  if (filters.earned === 'earned' && !earned.has(trophy.id)) return false;
  if (filters.earned === 'unearned' && earned.has(trophy.id)) return false;
  if (filters.search) {
    const hay = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!hay.includes(filters.search)) return false;
  }
  return true;
}

function badge(text, cls) {
  const span = document.createElement('span');
  span.className = `badge ${cls}`;
  span.textContent = text;
  return span;
}

function sourceLine(trophy, sources) {
  const line = document.createElement('p');
  line.className = 'src';
  line.textContent = 'Sources: ';
  trophy.sources.forEach((key, index) => {
    if (index > 0) line.append(document.createTextNode(' · '));
    const info = sources[key];
    if (info) {
      const a = document.createElement('a');
      a.href = info.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = info.name;
      line.append(a);
    } else {
      line.append(document.createTextNode(key));
    }
  });
  return line;
}

export function renderList(listEl, trophies, sources, state, onToggle, onSelect) {
  listEl.replaceChildren();
  const visible = trophies.filter((t) => trophyMatches(t, state.filters, state.earned));
  for (const trophy of visible) {
    const item = document.createElement('li');
    item.className = 'trophy' + (state.earned.has(trophy.id) ? ' earned' : '') + (state.selectedId === trophy.id ? ' selected' : '');
    const masked = isMasked(trophy, state.spoilerOn, state.earned);

    const top = document.createElement('div');
    top.className = 'trophy-top';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = state.earned.has(trophy.id);
    box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
    box.addEventListener('change', () => onToggle(trophy.id, box.checked));
    box.addEventListener('click', (event) => event.stopPropagation());
    top.append(box);

    const text = document.createElement('div');
    const name = document.createElement('p');
    name.className = 'trophy-name';
    name.textContent = masked ? HIDDEN_NAME : trophy.name;
    const desc = document.createElement('p');
    desc.className = 'trophy-desc';
    desc.textContent = masked ? HIDDEN_DESC : trophy.description;
    text.append(name, desc);

    const badges = document.createElement('div');
    badges.className = 'badges';
    badges.append(badge(gradeLabel(trophy.grade), trophy.grade));
    if (kindLabel(trophy.category) !== gradeLabel(trophy.grade)) badges.append(badge(kindLabel(trophy.category), 'kind'));
    if (trophy.missable) badges.append(badge('Missable', 'missable'));
    if (trophy.oneshot) badges.append(badge('One-shot', 'oneshot'));
    text.append(badges);
    top.append(text);
    item.append(top);

    if (!masked) {
      const guide = document.createElement('p');
      guide.className = 'trophy-guide';
      guide.textContent = trophy.guide;
      item.append(guide);
    }
    item.addEventListener('click', () => onSelect(trophy.id));
    listEl.append(item);
  }
  return visible.length;
}

export function renderDetail(detailEl, trophies, sources, state) {
  detailEl.replaceChildren();
  const trophy = trophies.find((t) => t.id === state.selectedId);
  if (!trophy) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'Pick a trophy from the list to read its full guide, its sources and when it can be missed.';
    detailEl.append(empty);
    return;
  }
  const masked = isMasked(trophy, state.spoilerOn, state.earned);
  const title = document.createElement('h2');
  title.textContent = masked ? HIDDEN_NAME : trophy.name;
  detailEl.append(title);

  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = masked ? HIDDEN_DESC : `“${trophy.description}” — ${gradeLabel(trophy.grade)} trophy, as reported.`;
  detailEl.append(official);

  const badges = document.createElement('div');
  badges.className = 'badges';
  badges.append(badge(gradeLabel(trophy.grade), trophy.grade));
  if (kindLabel(trophy.category) !== gradeLabel(trophy.grade)) badges.append(badge(kindLabel(trophy.category), 'kind'));
  if (trophy.missable) badges.append(badge('Missable', 'missable'));
  if (trophy.oneshot) badges.append(badge('One-shot', 'oneshot'));
  detailEl.append(badges);

  if (masked) {
    const note = document.createElement('p');
    note.textContent = 'Turn off “Hide story spoilers” or tick this trophy earned to reveal its guide.';
    detailEl.append(note);
    return;
  }

  const guideHeading = document.createElement('h3');
  guideHeading.textContent = 'Guide';
  const guide = document.createElement('p');
  guide.textContent = trophy.guide;
  detailEl.append(guideHeading, guide);

  const whenHeading = document.createElement('h3');
  whenHeading.textContent = 'When it can be missed';
  const when = document.createElement('p');
  when.textContent = trophy.missable
    ? 'Missable: this is the guide’s one missable trophy. Do it as you explore — see Phase 2 of the roadmap.'
    : trophy.oneshot
      ? 'One-shot: a single-attempt moment. Make a manual save first — see Phase 3 of the roadmap.'
      : 'Not missable. It stays available until you earn it.';
  detailEl.append(whenHeading, when);

  const roadHeading = document.createElement('h3');
  roadHeading.textContent = 'Roadmap stage';
  const road = document.createElement('p');
  road.textContent = `Phase ${trophy.phase} of the roadmap to the platinum.`;
  detailEl.append(roadHeading, road);

  const srcHeading = document.createElement('h3');
  srcHeading.textContent = 'Sources';
  detailEl.append(srcHeading, sourceLine(trophy, sources));
}

export function renderRoadmap(listEl, roadmap, trophies) {
  listEl.replaceChildren();
  const byId = new Map(trophies.map((t) => [t.id, t]));
  for (const phase of roadmap.phases) {
    const item = document.createElement('li');
    item.className = 'phase';
    const title = document.createElement('h3');
    title.textContent = phase.title;
    const goal = document.createElement('p');
    goal.className = 'goal';
    goal.textContent = phase.goal;
    const desc = document.createElement('p');
    desc.textContent = phase.description;
    const tip = document.createElement('p');
    tip.className = 'tip';
    tip.textContent = `Tip: ${phase.tip}`;
    const names = document.createElement('p');
    names.className = 'phase-trophies';
    names.textContent = `Trophies: ${phase.trophyIds.map((id) => byId.get(id)?.name ?? id).join(' · ')}`;
    item.append(title, goal, desc, tip, names);
    listEl.append(item);
  }
}

export function renderProgress(fillEl, textEl, earned, total) {
  const pct = total === 0 ? 0 : Math.round((earned.size / total) * 100);
  fillEl.style.width = `${pct}%`;
  textEl.textContent = `${earned.size} of ${total} earned · ${pct}%`;
}

export function renderSources(listEl, sources) {
  listEl.replaceChildren();
  for (const info of Object.values(sources)) {
    const item = document.createElement('li');
    const a = document.createElement('a');
    a.href = info.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = info.name;
    item.append(a);
    listEl.append(item);
  }
}
