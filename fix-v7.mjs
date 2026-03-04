import fs from 'fs';

const FILE = './public/presentation.json';
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

function getEl(sid, eid) {
  return data.slides.find(s => s.id === sid)?.elements.find(e => e.id === eid);
}

// ══════════════════════════════════════════════════
// PART 1: FIX S06 CARD ALIGNMENT
// Badge and text should both be left-aligned, same width
// ══════════════════════════════════════════════════

const COL1 = 8, COL2 = 37, COL3 = 66;
const CW = 26, PAD = 3, IW = 20;

for (const [col, key] of [[COL1, 'duration'], [COL2, 'grundbuch'], [COL3, 'kosten'], [COL1, 'ende'], [COL2, 'eigentum']]) {
  const badge = getEl('s06', `s06-card-${key}-badge`);
  if (badge) {
    badge.x = col + PAD;
    badge.width = IW;        // same width as text
    badge.style.textAlign = 'left';  // left-aligned like text
  }
  const text = getEl('s06', `s06-card-${key}-text`);
  if (text) {
    text.x = col + PAD;
    text.width = IW;
  }
}

// Same fix for s07 icons
for (const key of ['invest', 'income', 'value', 'cost', 'sustain', 'service']) {
  const icon = getEl('s07', `s07-card-${key}-icon`);
  if (icon) {
    icon.style.textAlign = 'left';
  }
}

// Same fix for s04 card numbers
for (const key of ['c1', 'c2', 'c3']) {
  const num = getEl('s04', `s04-${key}-num`);
  if (num) {
    num.style.textAlign = 'left';
  }
}

// ══════════════════════════════════════════════════
// PART 2: BACKGROUND IMAGES MORE VISIBLE (0.06 → 0.12)
// ══════════════════════════════════════════════════

const bgImages = [
  ['s02', 's02-bg', 0.12],
  ['s04', 's04-bg', 0.10],
  ['s05', 's05-bg', 0.10],
  ['s06', 's06-bg', 0.12],
  ['s07', 's07-img', 0.10],
  ['s08', 's08-img', 0.10],
  ['s11', 's11-img', 0.10],
  ['s12', 's12-bg', 0.12],
  ['s13', 's13-bg', 0.10],
];

for (const [sid, eid, opacity] of bgImages) {
  const el = getEl(sid, eid);
  if (el) el.style.opacity = opacity;
}

// ══════════════════════════════════════════════════
// PART 3: ADD BG IMAGES where missing (s03, s09)
// ══════════════════════════════════════════════════

// s03: Add a separate background image (sunset-gewerbedach as bg)
// Move the current s03-img to right side and add a full bg
const s03 = data.slides.find(s => s.id === 's03');
const s03imgIdx = s03.elements.findIndex(e => e.id === 's03-img');
if (s03imgIdx >= 0) {
  // Convert existing image to bg and add a new smaller one
  s03.elements[s03imgIdx].x = 0;
  s03.elements[s03imgIdx].y = 0;
  s03.elements[s03imgIdx].width = 100;
  s03.elements[s03imgIdx].height = 100;
  s03.elements[s03imgIdx].style.opacity = 0.10;
  s03.elements[s03imgIdx].style.objectFit = 'cover';
}

// s09: Add full background
const s09 = data.slides.find(s => s.id === 's09');
const s09labelIdx = s09.elements.findIndex(e => e.id === 's09-label');
s09.elements.splice(s09labelIdx, 0, {
  id: 's09-bg',
  type: 'image',
  x: 0, y: 0, width: 100, height: 100,
  rotation: 0,
  content: '/images/flachdach-sunset2.jpg',
  style: { objectFit: 'cover', opacity: 0.10, borderRadius: 0 },
});

// ══════════════════════════════════════════════════
// PART 4: FIX IMAGE-TEXT OVERLAPS
// ══════════════════════════════════════════════════

// s03: Image was overlapping title/body — now it's a full bg, fixed above

// s10: s10-img overlaps s10-foot text
// Move image up or shrink, and move foot text below image
const s10img = getEl('s10', 's10-img');
if (s10img) {
  s10img.height = 20; // was 24, shrink to avoid foot text
  s10img.y = 66;
}
const s10foot = getEl('s10', 's10-foot');
if (s10foot) {
  s10foot.y = 64; // move above image
  s10foot.height = 5;
}

data.updatedAt = Date.now();
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log('v7 applied:');
console.log('- s06: Badge text now left-aligned, same width as description');
console.log('- s04/s07: Card headers also left-aligned');
console.log('- Background images opacity increased to 0.10-0.12');
console.log('- Background images added to s03, s09');
console.log('- Image-text overlaps fixed on s03, s10');
