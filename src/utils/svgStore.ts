export interface SavedSvg {
  id: string;
  name: string;
  svg: string;
  createdAt: number;
}

const KEY = 'sf:saved-svgs';

export function getSavedSvgs(): SavedSvg[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function saveSvg(svg: string, name?: string): SavedSvg {
  const items = getSavedSvgs();
  const entry: SavedSvg = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: name ?? `Chart ${new Date().toLocaleDateString('de-DE')}`,
    svg,
    createdAt: Date.now(),
  };
  localStorage.setItem(KEY, JSON.stringify([entry, ...items]));
  return entry;
}

export function deleteSavedSvg(id: string) {
  const items = getSavedSvgs().filter((s) => s.id !== id);
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function clearSavedSvgs() {
  localStorage.removeItem(KEY);
}
