import fs from 'fs';

const FILE = './public/presentation.json';
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

function getSlide(id) { return data.slides.find(s => s.id === id); }
function getEl(sid, eid) { return getSlide(sid)?.elements.find(e => e.id === eid); }
function removeEl(sid, eid) {
  const s = getSlide(sid);
  if (s) s.elements = s.elements.filter(e => e.id !== eid);
}

// ══════════════════════════════════════════════════
// PART 1: REPLACE ALL IMAGES with customer Gewerbedach photos
// ══════════════════════════════════════════════════

// s01: Hero — Gewerbedach Flachdach blauer Himmel
const s01img = getEl('s01', 's01-img');
if (s01img) {
  s01img.content = '/images/hero-gewerbedach.jpg';
  s01img.style.opacity = 0.15;
  s01img.style.objectFit = 'cover';
}

// s02: Background — Drohne über Gewerbedach
const s02bg = getEl('s02', 's02-bg');
if (s02bg) {
  s02bg.content = '/images/aerial-gewerbedach.jpg';
  s02bg.style.opacity = 0.08;
}

// s03: Team image — Sonnenuntergang Gewerbedach
const s03img = getEl('s03', 's03-img');
if (s03img) {
  s03img.content = '/images/sunset-gewerbedach.jpg';
  s03img.style.opacity = 0.7;
  s03img.x = 68; s03img.y = 6; s03img.width = 28; s03img.height = 42;
}

// s04: Background — Lagerhalle
const s04bg = getEl('s04', 's04-bg');
if (s04bg) {
  s04bg.content = '/images/lagerhalle-solar.jpg';
  s04bg.style.opacity = 0.06;
}

// s05: Background — Gewerbedach mit Stadtblick
const s05bg = getEl('s05', 's05-bg');
if (s05bg) {
  s05bg.content = '/images/gewerbedach-cityview.jpg';
  s05bg.style.opacity = 0.06;
}

// s06: Background — Montageschienen
const s06bg = getEl('s06', 's06-bg');
if (s06bg) {
  s06bg.content = '/images/montageschienen.jpg';
  s06bg.style.opacity = 0.06;
}

// s07: Background — Fertige Flachdach-Anlage
const s07img = getEl('s07', 's07-img');
if (s07img) {
  s07img.content = '/images/flachdach-fertig.jpg';
  s07img.style.opacity = 0.06;
}

// s08: Background — Dramatischer Himmel über Gewerbedach
const s08img = getEl('s08', 's08-img');
if (s08img) {
  s08img.content = '/images/dramatisch-gewerbedach.jpg';
  s08img.style.opacity = 0.06;
}

// s09: Two images — Nahaufnahme + Installation
const s09img1 = getEl('s09', 's09-img-1');
if (s09img1) {
  s09img1.content = '/images/closeup-gewerbepanels.jpg';
}
const s09img2 = getEl('s09', 's09-img-2');
if (s09img2) {
  s09img2.content = '/images/grosse-installation.jpg';
}

// s10: Referenz — Hallendach
const s10img = getEl('s10', 's10-img');
if (s10img) {
  s10img.content = '/images/referenz-hallendach.jpg';
  s10img.style.opacity = 0.9;
}

// s11: Background — Gewerbe Aerial
const s11img = getEl('s11', 's11-img');
if (s11img) {
  s11img.content = '/images/referenz-gewerbe-aerial.jpg';
  s11img.style.opacity = 0.05;
}

// s12: Background — Installation/Montage
const s12bg = getEl('s12', 's12-bg');
if (s12bg) {
  s12bg.content = '/images/installation-montage.jpg';
  s12bg.style.opacity = 0.06;
}

// s13: Background — Sonnenuntergang Installation
const s13bg = getEl('s13', 's13-bg');
if (s13bg) {
  s13bg.content = '/images/installation-sunset.jpg';
  s13bg.style.opacity = 0.06;
}

// s14: Closing — Gewerbe Aerial
const s14img = getEl('s14', 's14-img');
if (s14img) {
  s14img.content = '/images/closing-gewerbe-aerial.jpg';
  s14img.style.opacity = 0.12;
}

// ══════════════════════════════════════════════════
// PART 2: FIX ALIGNMENT — Cards aligned with title (x=8)
// ══════════════════════════════════════════════════

// Card grid: 3 columns aligned with title x=8
// Col1: x=5, w=28   (inner text x=8, w=22)
// Col2: x=36, w=28  (inner text x=39, w=22)
// Col3: x=67, w=28  (inner text x=70, w=22)
// → Padding inside card: 3 left

const COL1 = 5, COL2 = 36, COL3 = 67;
const CW = 28;
const PAD = 3; // padding inside card
const IW = CW - PAD - 3; // inner text width (22)

// ── s06: "Transparent und fair" — fix card alignment ──
// Row 1 cards
for (const [col, key] of [[COL1, 'duration'], [COL2, 'grundbuch'], [COL3, 'kosten']]) {
  const card = getEl('s06', `s06-card-${key}`);
  if (card) { card.x = col; card.width = CW; }
  const badge = getEl('s06', `s06-card-${key}-badge`);
  if (badge) { badge.x = col + PAD; badge.width = 8; }
  const text = getEl('s06', `s06-card-${key}-text`);
  if (text) { text.x = col + PAD; text.width = IW; }
}
// Row 2 cards
for (const [col, key] of [[COL1, 'ende'], [COL2, 'eigentum']]) {
  const card = getEl('s06', `s06-card-${key}`);
  if (card) { card.x = col; card.width = CW; }
  const badge = getEl('s06', `s06-card-${key}-badge`);
  if (badge) { badge.x = col + PAD; badge.width = 8; }
  const text = getEl('s06', `s06-card-${key}-text`);
  if (text) { text.x = col + PAD; text.width = IW; }
}

// ── s07: "Ihre Vorteile auf einen Blick" — fix card alignment ──
// Row 1
for (const [col, key] of [[COL1, 'invest'], [COL2, 'income'], [COL3, 'value']]) {
  const card = getEl('s07', `s07-card-${key}`);
  if (card) { card.x = col; card.width = CW; }
  const icon = getEl('s07', `s07-card-${key}-icon`);
  if (icon) { icon.x = col + PAD; icon.width = IW; }
  const text = getEl('s07', `s07-card-${key}-text`);
  if (text) { text.x = col + PAD; text.width = IW; }
}
// Row 2
for (const [col, key] of [[COL1, 'cost'], [COL2, 'sustain'], [COL3, 'service']]) {
  const card = getEl('s07', `s07-card-${key}`);
  if (card) { card.x = col; card.width = CW; }
  const icon = getEl('s07', `s07-card-${key}-icon`);
  if (icon) { icon.x = col + PAD; icon.width = IW; }
  const text = getEl('s07', `s07-card-${key}-text`);
  if (text) { text.x = col + PAD; text.width = IW; }
}

// ── s08: "Absicherung" — fix card alignment (2 cols, 2 rows) ──
const C8_1 = 5, C8_2 = 52, C8_W = 43;
for (const [col, key] of [[C8_1, 'b1'], [C8_2, 'b2']]) {
  const card = getEl('s08', `s08-${key}`);
  if (card) { card.x = col; card.width = C8_W; }
  const accent = getEl('s08', `s08-${key}-accent`);
  if (accent) { accent.x = col; }
  const text = getEl('s08', `s08-${key}-t`);
  if (text) { text.x = col + 3; text.width = C8_W - 6; }
}
for (const [col, key] of [[C8_1, 'b3'], [C8_2, 'b4']]) {
  const card = getEl('s08', `s08-${key}`);
  if (card) { card.x = col; card.width = C8_W; }
  const accent = getEl('s08', `s08-${key}-accent`);
  if (accent) { accent.x = col; }
  const text = getEl('s08', `s08-${key}-t`);
  if (text) { text.x = col + 3; text.width = C8_W - 6; }
}

// ── s11: Fix overlapping Green Monkey card ──
// Remove overlap: Green Monkey was at y=72 clashing with row 2 at y=66
// Move to 3rd column of row 2
const gmCard = getEl('s11', 's11-card-greenmonkey');
if (gmCard) { gmCard.x = COL3; gmCard.y = 66; gmCard.width = CW; gmCard.height = 23; }
const gmText = getEl('s11', 's11-card-greenmonkey-text');
if (gmText) { gmText.x = COL3 + PAD; gmText.y = 70; gmText.width = IW; gmText.height = 17; }

// Fix all s11 card alignment too
for (const [col, key] of [[COL1, 'vonovia'], [COL2, 'dqs'], [COL3, 'bag']]) {
  const card = getEl('s11', `s11-card-${key}`);
  if (card) { card.x = col; card.width = CW; }
  const text = getEl('s11', `s11-card-${key}-text`);
  if (text) { text.x = col + PAD; text.width = IW; }
}
for (const [col, key] of [[COL1, 'radeberger'], [COL2, 'bender'], [COL3, 'gewo']]) {
  const card = getEl('s11', `s11-card-${key}`);
  if (card) { card.x = col; card.width = CW; }
  const text = getEl('s11', `s11-card-${key}-text`);
  if (text) { text.x = col + PAD; text.width = IW; }
}
// Gewo is row 2 col 3 — but now greenmonkey goes there. Move gewo to row 3 or merge.
// Actually let's do 7 cards: 3+3+1
// Row 1: vonovia, dqs, bag (y=40)
// Row 2: radeberger, bender, greenmonkey (y=66)
// gewo stays at col3 row2 — move greenmonkey there and gewo to row 2 col 3
// Wait, there are 7 customers. Let's do: row1=3, row2=4 smaller
// Simpler: just move gewo off col3 row2, put greenmonkey in col3 row2
// Actually, remove the gewo from col3 row2 and put greenmonkey there
const gewoCard = getEl('s11', 's11-card-gewo');
const gewoText = getEl('s11', 's11-card-gewo-text');
// Keep gewo at original col3 row2 position — no wait, greenmonkey should replace it
// Let's rearrange: Row1: vonovia, dqs, bag. Row2: radeberger, bender, gewo. Row3 full-width: greenmonkey
// That looks cleaner

// gewo stays at col3 row2 (already set above)
// greenmonkey becomes a full-width card in row 3
if (gmCard) {
  gmCard.x = COL1; gmCard.y = 66; gmCard.width = CW; gmCard.height = 23;
}
if (gmText) {
  gmText.x = COL1 + PAD; gmText.y = 70; gmText.width = IW; gmText.height = 17;
}

// Actually there are 7 cards and I'm confusing myself. Let me reorganize:
// Row 1 (y=38, h=24): vonovia, dqs, bag
// Row 2 (y=64, h=24): radeberger, bender, gewo, greenmonkey → but 4 doesn't fit in 3 cols
// Solution: Make 4 columns in row 2
const R2Y = 64;
const C4_1 = 5, C4_2 = 27.5, C4_3 = 50, C4_4 = 72.5;
const C4W = 20;
const C4PAD = 2;
const C4IW = C4W - 4;

// Row 1 stays as 3 cols (already fixed above)
for (const [col, key] of [[COL1, 'vonovia'], [COL2, 'dqs'], [COL3, 'bag']]) {
  const card = getEl('s11', `s11-card-${key}`);
  if (card) { card.x = col; card.y = 38; card.width = CW; card.height = 24; }
  const text = getEl('s11', `s11-card-${key}-text`);
  if (text) { text.x = col + PAD; text.y = 42; text.width = IW; text.height = 17; }
}

// Row 2: 4 columns
for (const [col, key] of [[C4_1, 'radeberger'], [C4_2, 'bender'], [C4_3, 'gewo'], [C4_4, 'greenmonkey']]) {
  const card = getEl('s11', `s11-card-${key}`);
  if (card) { card.x = col; card.y = R2Y; card.width = C4W; card.height = 24; }
  const text = getEl('s11', `s11-card-${key}-text`);
  if (text) { text.x = col + C4PAD; text.y = R2Y + 4; text.width = C4IW; text.height = 17; text.style.fontSize = 20; }
}

// ── s12: "Alles aus einer Hand" — fix card alignment ──
for (const [col, key] of [[COL1, 'plan'], [COL2, 'permit'], [COL3, 'statik']]) {
  const card = getEl('s12', `s12-card-${key}`);
  if (card) { card.x = col; card.width = CW; }
  const text = getEl('s12', `s12-card-${key}-text`);
  if (text) { text.x = col + PAD; text.width = IW; }
}
for (const [col, key] of [[COL1, 'elektro'], [COL2, 'dach'], [COL3, 'foerder']]) {
  const card = getEl('s12', `s12-card-${key}`);
  if (card) { card.x = col; card.width = CW; }
  const text = getEl('s12', `s12-card-${key}-text`);
  if (text) { text.x = col + PAD; text.width = IW; }
}

// ── s04: Fix card alignment ──
for (const [col, key] of [[COL1, 'c1'], [COL2, 'c2'], [COL3, 'c3']]) {
  const card = getEl('s04', `s04-${key}-box`);
  if (card) { card.x = col; card.width = CW; }
  const topaccent = getEl('s04', `s04-${key}-box-topaccent`);
  if (topaccent) { topaccent.x = col + PAD; topaccent.width = IW; }
  for (const suffix of ['num', 'title', 'desc', 'price', 'unit']) {
    const el = getEl('s04', `s04-${key}-${suffix}`);
    if (el) { el.x = col + PAD; el.width = IW; }
  }
}

// ── s13: Fix step columns alignment ──
// 4 cols: match same pattern
const S13_1 = 5, S13_2 = 28, S13_3 = 52, S13_4 = 76;
const S13W = 21;
for (const [col, n] of [[S13_1, 1], [S13_2, 2], [S13_3, 3], [S13_4, 4]]) {
  const box = getEl('s13', `s13-s${n}-box`);
  if (box) { box.x = col; box.width = S13W; }
  const num = getEl('s13', `s13-s${n}-num`);
  if (num) { num.x = col + 2; num.width = S13W - 4; }
  const t = getEl('s13', `s13-s${n}-t`);
  if (t) { t.x = col + 2; t.width = S13W - 4; }
}

// ══════════════════════════════════════════════════
// PART 3: Ensure tagline on s11 doesn't overlap
// ══════════════════════════════════════════════════
const s11tag = getEl('s11', 's11-tagline');
if (s11tag) {
  s11tag.y = 90; // Move below row 2
  s11tag.x = 8;
  s11tag.width = 84;
  s11tag.style.fontSize = 18;
}

data.updatedAt = Date.now();
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log('v5 applied:');
console.log('- All images replaced with customer Gewerbedach photos');
console.log('- Card alignment fixed on s04, s06, s07, s08, s11, s12, s13');
console.log('- s11 Green Monkey card overlap fixed (4-column row 2)');
console.log('- s11 tagline repositioned');
