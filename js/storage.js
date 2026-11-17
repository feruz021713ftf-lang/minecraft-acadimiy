// Small wrapper around localStorage with safe parsing and namespacing.
const NS = 'mca:';

function safeParse(raw, fallback) {
  if (raw == null) return fallback;
  try {
    const val = JSON.parse(raw);
    return val ?? fallback;
  } catch {
    return fallback;
  }
}

export function read(key, fallback = null) {
  try {
    return safeParse(localStorage.getItem(NS + key), fallback);
  } catch {
    return fallback;
  }
}

export function write(key, value) {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function remove(key) {
  try { localStorage.removeItem(NS + key); } catch {}
}

export function clearProgress() {
  ['progress', 'session'].forEach(remove);
}

const DEFAULT_SETTINGS = { reduceMotion: false, compact: false, theme: 'emerald' };

export function getSettings() {
  return { ...DEFAULT_SETTINGS, ...read('settings', {}) };
}

export function saveSettings(partial) {
  const merged = { ...getSettings(), ...partial };
  write('settings', merged);
  return merged;
}

// Apply settings to the current document
export function applySettings() {
  const s = getSettings();
  document.body.classList.toggle('reduce-motion', !!s.reduceMotion);
  document.body.classList.toggle('compact', !!s.compact);
  document.documentElement.dataset.accent = s.theme || 'emerald';
}