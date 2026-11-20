// Progress state for Platinum Road: which trophies are earned, saved in the
// browser's localStorage and exportable to / importable from a JSON file.
export const STORAGE_KEY = 'platinum-road-progress-v1';

// Load the earned set. Anything that is not a known trophy id is dropped.
export function loadProgress(knownIds) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    const ids = Array.isArray(parsed) ? parsed : parsed.earned;
    if (!Array.isArray(ids)) return new Set();
    const known = new Set(knownIds);
    return new Set(ids.filter((id) => known.has(id)));
  } catch {
    return new Set();
  }
}

export function saveProgress(earned) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, earned: [...earned].sort((a, b) => a - b) }));
  } catch {
    // Storage may be unavailable (private mode): progress still works in memory.
  }
}

export function exportProgress(earned) {
  const blob = new Blob(
    [JSON.stringify({ app: 'platinum-road', version: 1, exportedAt: new Date().toISOString(), earned: [...earned].sort((a, b) => a - b) }, null, 2)],
    { type: 'application/json' },
  );
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'platinum-road-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

// Read an exported progress file and return a cleaned Set of earned ids, or
// null when the file is not a progress export.
export async function importProgress(file, knownIds) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const ids = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(ids)) return null;
  const known = new Set(knownIds);
  return new Set(ids.filter((id) => known.has(id)));
}
