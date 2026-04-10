export type ShapeCategory = 'basic' | 'arrows' | 'badges' | 'decorative';

export interface Shape {
  id: string;
  name: string;
  category: ShapeCategory;
  svg: string;
}

export const SHAPE_CATEGORIES: { id: ShapeCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Alle' },
  { id: 'basic', label: 'Formen' },
  { id: 'arrows', label: 'Pfeile' },
  { id: 'badges', label: 'Badges' },
  { id: 'decorative', label: 'Deko' },
];

export const SHAPES: Shape[] = [
  // ── Basic Shapes ──────────────────────────────────────────────
  {
    id: 'rect-rounded',
    name: 'Rechteck',
    category: 'basic',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60"><rect x="2" y="2" width="96" height="56" rx="8" ry="8" fill="currentColor"/></svg>`,
  },
  {
    id: 'circle',
    name: 'Kreis',
    category: 'basic',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="currentColor"/></svg>`,
  },
  {
    id: 'triangle-up',
    name: 'Dreieck',
    category: 'basic',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90"><polygon points="50,4 96,86 4,86" fill="currentColor"/></svg>`,
  },
  {
    id: 'triangle-down',
    name: 'Dreieck unten',
    category: 'basic',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90"><polygon points="50,86 4,4 96,4" fill="currentColor"/></svg>`,
  },
  {
    id: 'diamond',
    name: 'Raute',
    category: 'basic',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,4 96,50 50,96 4,50" fill="currentColor"/></svg>`,
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    category: 'basic',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,4 93,27 93,73 50,96 7,73 7,27" fill="currentColor"/></svg>`,
  },
  {
    id: 'star-5',
    name: 'Stern 5',
    category: 'basic',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="currentColor"/></svg>`,
  },
  {
    id: 'star-4',
    name: 'Stern 4',
    category: 'basic',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,5 60,40 95,50 60,60 50,95 40,60 5,50 40,40" fill="currentColor"/></svg>`,
  },
  {
    id: 'pentagon',
    name: 'Pentagon',
    category: 'basic',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,4 96,37 79,91 21,91 4,37" fill="currentColor"/></svg>`,
  },
  {
    id: 'oval',
    name: 'Oval',
    category: 'basic',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 70"><ellipse cx="60" cy="35" rx="58" ry="33" fill="currentColor"/></svg>`,
  },

  // ── Arrows ────────────────────────────────────────────────────
  {
    id: 'arrow-right-filled',
    name: 'Pfeil rechts',
    category: 'arrows',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60"><polygon points="0,15 60,15 60,0 100,30 60,60 60,45 0,45" fill="currentColor"/></svg>`,
  },
  {
    id: 'arrow-up-filled',
    name: 'Pfeil oben',
    category: 'arrows',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 100"><polygon points="15,100 15,40 0,40 30,0 60,40 45,40 45,100" fill="currentColor"/></svg>`,
  },
  {
    id: 'chevron-right',
    name: 'Chevron',
    category: 'arrows',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 100"><polyline points="10,5 50,50 10,95" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    id: 'double-arrow',
    name: 'Doppelpfeil',
    category: 'arrows',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60"><polygon points="0,30 30,5 30,20 90,20 90,5 120,30 90,55 90,40 30,40 30,55" fill="currentColor"/></svg>`,
  },
  {
    id: 'arrow-curved',
    name: 'Gebogener Pfeil',
    category: 'arrows',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80"><path d="M10,70 Q10,10 70,10" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/><polygon points="70,10 55,0 85,0" fill="currentColor"/></svg>`,
  },
  {
    id: 'arrow-cycle',
    name: 'Kreispfeil',
    category: 'arrows',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50,10 A40,40 0 1,1 15,65" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/><polygon points="15,65 5,45 28,52" fill="currentColor"/></svg>`,
  },
  {
    id: 'arrow-right-thin',
    name: 'Pfeil (Linie)',
    category: 'arrows',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40"><line x1="0" y1="20" x2="85" y2="20" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><polygon points="85,20 65,8 65,32" fill="currentColor"/></svg>`,
  },

  // ── Badges ────────────────────────────────────────────────────
  {
    id: 'pill',
    name: 'Pill / Tag',
    category: 'badges',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 50"><rect x="2" y="2" width="116" height="46" rx="23" ry="23" fill="currentColor"/></svg>`,
  },
  {
    id: 'shield',
    name: 'Shield',
    category: 'badges',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 100"><path d="M40,4 L76,18 L76,52 C76,74 40,96 40,96 C40,96 4,74 4,52 L4,18 Z" fill="currentColor"/></svg>`,
  },
  {
    id: 'ribbon',
    name: 'Banner',
    category: 'badges',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 50"><polygon points="0,0 120,0 120,50 60,38 0,50" fill="currentColor"/></svg>`,
  },
  {
    id: 'tag-shape',
    name: 'Preis-Etikett',
    category: 'badges',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80"><path d="M4,4 L60,4 L96,40 L60,76 L4,76 Z" fill="currentColor"/><circle cx="22" cy="22" r="6" fill="white"/></svg>`,
  },
  {
    id: 'speech-bubble',
    name: 'Sprechblase',
    category: 'badges',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90"><path d="M4,4 Q4,4 96,4 Q96,4 96,60 Q96,70 86,70 L35,70 L15,90 L20,70 L14,70 Q4,70 4,60 Z" fill="currentColor"/></svg>`,
  },
  {
    id: 'badge-hexagon',
    name: 'Hex Badge',
    category: 'badges',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 112"><polygon points="50,4 96,29 96,83 50,108 4,83 4,29" fill="currentColor"/></svg>`,
  },
  {
    id: 'starburst',
    name: 'Starburst',
    category: 'badges',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,2 56,38 90,20 72,50 96,68 60,66 62,100 50,70 38,100 40,66 4,68 28,50 10,20 44,38" fill="currentColor"/></svg>`,
  },

  // ── Decorative ────────────────────────────────────────────────
  {
    id: 'divider-line',
    name: 'Trennlinie',
    category: 'decorative',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 10"><line x1="0" y1="5" x2="200" y2="5" stroke="currentColor" stroke-width="2"/></svg>`,
  },
  {
    id: 'divider-dots',
    name: 'Punkte-Reihe',
    category: 'decorative',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 12"><circle cx="10" cy="6" r="4" fill="currentColor"/><circle cx="30" cy="6" r="4" fill="currentColor"/><circle cx="50" cy="6" r="4" fill="currentColor"/><circle cx="70" cy="6" r="4" fill="currentColor"/><circle cx="90" cy="6" r="4" fill="currentColor"/><circle cx="110" cy="6" r="4" fill="currentColor"/></svg>`,
  },
  {
    id: 'divider-wave',
    name: 'Welle',
    category: 'decorative',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 20"><path d="M0,10 C25,0 50,20 75,10 C100,0 125,20 150,10 C175,0 200,20 200,10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'plus',
    name: 'Plus',
    category: 'decorative',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><rect x="22" y="4" width="16" height="52" rx="4" fill="currentColor"/><rect x="4" y="22" width="52" height="16" rx="4" fill="currentColor"/></svg>`,
  },
  {
    id: 'cross',
    name: 'Kreuz / X',
    category: 'decorative',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><line x1="6" y1="6" x2="54" y2="54" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><line x1="54" y1="6" x2="6" y2="54" stroke="currentColor" stroke-width="10" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'burst',
    name: 'Burst / Strahl',
    category: 'decorative',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><line x1="50" y1="4" x2="50" y2="96" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><line x1="4" y1="50" x2="96" y2="50" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><line x1="15" y1="15" x2="85" y2="85" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><line x1="85" y1="15" x2="15" y2="85" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'dots-grid',
    name: 'Punkt-Raster',
    category: 'decorative',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><circle cx="10" cy="10" r="3" fill="currentColor"/><circle cx="30" cy="10" r="3" fill="currentColor"/><circle cx="50" cy="10" r="3" fill="currentColor"/><circle cx="10" cy="30" r="3" fill="currentColor"/><circle cx="30" cy="30" r="3" fill="currentColor"/><circle cx="50" cy="30" r="3" fill="currentColor"/><circle cx="10" cy="50" r="3" fill="currentColor"/><circle cx="30" cy="50" r="3" fill="currentColor"/><circle cx="50" cy="50" r="3" fill="currentColor"/></svg>`,
  },
  {
    id: 'corner-accent',
    name: 'Ecken-Akzent',
    category: 'decorative',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path d="M4,30 L4,4 L30,4" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M56,30 L56,56 L30,56" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
];
