import fs from 'fs';

const FILE = './public/presentation.json';
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

function getEl(sid, eid) {
  return data.slides.find(s => s.id === sid)?.elements.find(e => e.id === eid);
}

// ══════════════════════════════════════════════════
// PART 1: FIX ALIGNMENT — Cards left edge = title left edge (x=8)
// ══════════════════════════════════════════════════

// 3-column grid starting at x=8 (same as title)
const COL1 = 8, COL2 = 37, COL3 = 66;
const CW = 26;
const PAD = 3;
const IW = CW - PAD * 2; // 20

// ── s04: Pachtvarianten ──
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

// ── s06: Transparent und fair ──
for (const [col, key] of [[COL1, 'duration'], [COL2, 'grundbuch'], [COL3, 'kosten']]) {
  const card = getEl('s06', `s06-card-${key}`);
  if (card) { card.x = col; card.width = CW; }
  const badge = getEl('s06', `s06-card-${key}-badge`);
  if (badge) { badge.x = col + PAD; }
  const text = getEl('s06', `s06-card-${key}-text`);
  if (text) { text.x = col + PAD; text.width = IW; }
}
for (const [col, key] of [[COL1, 'ende'], [COL2, 'eigentum']]) {
  const card = getEl('s06', `s06-card-${key}`);
  if (card) { card.x = col; card.width = CW; }
  const badge = getEl('s06', `s06-card-${key}-badge`);
  if (badge) { badge.x = col + PAD; }
  const text = getEl('s06', `s06-card-${key}-text`);
  if (text) { text.x = col + PAD; text.width = IW; }
}

// ── s07: Vorteile ──
for (const [col, key] of [[COL1, 'invest'], [COL2, 'income'], [COL3, 'value']]) {
  const card = getEl('s07', `s07-card-${key}`);
  if (card) { card.x = col; card.width = CW; }
  const icon = getEl('s07', `s07-card-${key}-icon`);
  if (icon) { icon.x = col + PAD; icon.width = IW; }
  const text = getEl('s07', `s07-card-${key}-text`);
  if (text) { text.x = col + PAD; text.width = IW; }
}
for (const [col, key] of [[COL1, 'cost'], [COL2, 'sustain'], [COL3, 'service']]) {
  const card = getEl('s07', `s07-card-${key}`);
  if (card) { card.x = col; card.width = CW; }
  const icon = getEl('s07', `s07-card-${key}-icon`);
  if (icon) { icon.x = col + PAD; icon.width = IW; }
  const text = getEl('s07', `s07-card-${key}-text`);
  if (text) { text.x = col + PAD; text.width = IW; }
}

// ── s08: Absicherung (2x2 grid) ──
const C8_1 = 8, C8_2 = 52, C8_W = 40;
for (const key of ['b1', 'b2', 'b3', 'b4']) {
  const col = key === 'b1' || key === 'b3' ? C8_1 : C8_2;
  const card = getEl('s08', `s08-${key}`);
  if (card) { card.x = col; card.width = C8_W; }
  const accent = getEl('s08', `s08-${key}-accent`);
  if (accent) { accent.x = col; }
  const text = getEl('s08', `s08-${key}-t`);
  if (text) { text.x = col + 3; text.width = C8_W - 6; }
}

// ── s11: Referenzkunden ──
for (const [col, key] of [[COL1, 'vonovia'], [COL2, 'dqs'], [COL3, 'bag']]) {
  const card = getEl('s11', `s11-card-${key}`);
  if (card) { card.x = col; card.width = CW; }
  const text = getEl('s11', `s11-card-${key}-text`);
  if (text) { text.x = col + PAD; text.width = IW; }
}
// Row 2: 4 cols
const R2_1 = 8, R2_2 = 31, R2_3 = 54, R2_4 = 74;
const R2W = 20;
for (const [col, key] of [[R2_1, 'radeberger'], [R2_2, 'bender'], [R2_3, 'gewo'], [R2_4, 'greenmonkey']]) {
  const card = getEl('s11', `s11-card-${key}`);
  if (card) { card.x = col; card.width = R2W; }
  const text = getEl('s11', `s11-card-${key}-text`);
  if (text) { text.x = col + 2; text.width = R2W - 4; }
}

// ── s12: Alles aus einer Hand ──
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

// ── s05: Einnahmebeispiele (2-col boxes) ──
const s05b1 = getEl('s05', 's05-b1');
if (s05b1) { s05b1.x = 8; s05b1.width = 40; }
for (const s of ['b1-label', 'b1-num', 'b1-sub']) {
  const el = getEl('s05', `s05-${s}`);
  if (el) { el.x = 11; el.width = 34; }
}
const s05b2 = getEl('s05', 's05-b2');
if (s05b2) { s05b2.x = 52; s05b2.width = 40; }
for (const s of ['b2-label', 'b2-num', 'b2-sub']) {
  const el = getEl('s05', `s05-${s}`);
  if (el) { el.x = 55; el.width = 34; }
}

// ── s13: 4 Schritte ──
const S13_1 = 8, S13_2 = 31, S13_3 = 54, S13_4 = 77;
const S13W = 20;
for (const [col, n] of [[S13_1, 1], [S13_2, 2], [S13_3, 3], [S13_4, 4]]) {
  const box = getEl('s13', `s13-s${n}-box`);
  if (box) { box.x = col; box.width = S13W; }
  const num = getEl('s13', `s13-s${n}-num`);
  if (num) { num.x = col + 2; num.width = S13W - 4; }
  const t = getEl('s13', `s13-s${n}-t`);
  if (t) { t.x = col + 2; t.width = S13W - 4; }
}

// ══════════════════════════════════════════════════
// PART 2: HIGHER CONTRAST — darker text, stronger accents
// ══════════════════════════════════════════════════

for (const slide of data.slides) {
  for (const el of slide.elements) {
    if (!el.style) continue;

    // Card/body text: #6b7280 → #374151 (much darker gray)
    if (el.style.color === '#6b7280') {
      el.style.color = '#374151';
    }

    // Muted text: #9ca3af → #6b7280 (one step darker)
    if (el.style.color === '#9ca3af') {
      el.style.color = '#6b7280';
    }

    // Subtitle text: bump contrast
    if (el.id.endsWith('-sub') && el.type === 'text') {
      if (el.style.color === '#6b7280' || el.style.color === '#374151') {
        el.style.color = '#374151';
      }
    }

    // Card backgrounds: #f5f7f2 → #eef1ea (slightly more contrast to white bg)
    if (el.type === 'shape' && el.style.backgroundColor === '#f5f7f2') {
      el.style.backgroundColor = '#eef1ea';
    }

    // Accent color: #5a8a00 → #4a7a00 (slightly darker green for better contrast)
    if (el.style.color === '#5a8a00') {
      el.style.color = '#3d6b00';
    }

    // Fix inline HTML colors too
    if (el.content && typeof el.content === 'string') {
      el.content = el.content
        .replace(/color:\s*#6b7280/g, 'color: #374151')
        .replace(/color:\s*#9ca3af/g, 'color: #6b7280')
        .replace(/color:\s*#5a8a00/g, 'color: #3d6b00');
    }
  }
}

data.updatedAt = Date.now();
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log('v6 applied:');
console.log('- Card alignment: left edges now at x=8, matching title position');
console.log('- Contrast: card text #6b7280 → #374151, muted #9ca3af → #6b7280');
console.log('- Contrast: card bg #f5f7f2 → #eef1ea, accent green darker');
