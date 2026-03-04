import fs from 'fs';

const FILE = './public/presentation.json';
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

function getEl(sid, eid) {
  return data.slides.find(s => s.id === sid)?.elements.find(e => e.id === eid);
}

// ══════════════════════════════════════════════════
// s01: Pills text wraps — reduce font or increase height
// ══════════════════════════════════════════════════
const s01pills = getEl('s01', 's01-pills');
if (s01pills) { s01pills.style.fontSize = 26; s01pills.height = 6; }

// ══════════════════════════════════════════════════
// s02: Title too long for box — increase box height
// ══════════════════════════════════════════════════
const s02title = getEl('s02', 's02-title');
if (s02title) { s02title.height = 18; s02title.width = 48; }
// Push everything below down
const s02accent = getEl('s02', 's02-title-accent');
if (s02accent) { s02accent.y = 32.5; }
const s02body = getEl('s02', 's02-body');
if (s02body) { s02body.y = 36; s02body.height = 36; }

// ══════════════════════════════════════════════════
// s03: Title too long — increase height
// ══════════════════════════════════════════════════
const s03title = getEl('s03', 's03-title');
if (s03title) { s03title.height = 18; }
const s03accent = getEl('s03', 's03-title-accent');
if (s03accent) { s03accent.y = 32.5; }
const s03body = getEl('s03', 's03-body');
if (s03body) { s03body.y = 34; s03body.height = 14; }
// Metric boxes push down slightly
for (const n of [1,2,3,4]) {
  const box = getEl('s03', `s03-m${n}-box`);
  if (box) { box.y = 52; }
  const num = getEl('s03', `s03-m${n}-num`);
  if (num) { num.y = 56; }
  const lbl = getEl('s03', `s03-m${n}-lbl`);
  if (lbl) { lbl.y = 68; }
}

// ══════════════════════════════════════════════════
// s04: desc overlaps price in all 3 cards
// Cards: box y=27 h=65 → ends y=92
// desc: y=46 h=28 → ends y=74, price: y=70 → OVERLAP of 4
// Fix: shrink desc height, move price down
// ══════════════════════════════════════════════════
for (const key of ['c1', 'c2', 'c3']) {
  const desc = getEl('s04', `s04-${key}-desc`);
  if (desc) { desc.height = 22; } // was 28, now ends at y=68
  const price = getEl('s04', `s04-${key}-price`);
  if (price) { price.y = 72; } // was 70
  const unit = getEl('s04', `s04-${key}-unit`);
  if (unit) { unit.y = 83; } // was 81
}
// s04-c2-title "Dachsanierung als Vergütung" too long at 32px
const s04c2t = getEl('s04', 's04-c2-title');
if (s04c2t) { s04c2t.style.fontSize = 28; s04c2t.height = 10; }
// Same for other card titles for consistency
const s04c1t = getEl('s04', 's04-c1-title');
if (s04c1t) { s04c1t.style.fontSize = 28; s04c1t.height = 10; }
const s04c3t = getEl('s04', 's04-c3-title');
if (s04c3t) { s04c3t.style.fontSize = 28; s04c3t.height = 10; }
// Adjust desc y to account for taller title
for (const key of ['c1', 'c2', 'c3']) {
  const desc = getEl('s04', `s04-${key}-desc`);
  if (desc) { desc.y = 48; }
}

// ══════════════════════════════════════════════════
// s12: Tagline overlaps bottom cards
// Cards row2: y=61 h=30 → ends y=91
// Tagline: y=87 → sits INSIDE cards
// Fix: shrink card height, move tagline below
// ══════════════════════════════════════════════════
// Shrink both rows of cards
for (const key of ['plan', 'permit', 'statik']) {
  const card = getEl('s12', `s12-card-${key}`);
  if (card) { card.height = 26; } // was 30
  const text = getEl('s12', `s12-card-${key}-text`);
  if (text) { text.height = 20; } // was 24
}
for (const key of ['elektro', 'dach', 'foerder']) {
  const card = getEl('s12', `s12-card-${key}`);
  if (card) { card.y = 57; card.height = 26; } // was y=61 h=30 → ends 83
  const text = getEl('s12', `s12-card-${key}-text`);
  if (text) { text.y = 61; text.height = 20; } // was y=65 h=24
}
const s12tag = getEl('s12', 's12-tagline');
if (s12tag) { s12tag.y = 85; } // was 87, now safely below cards ending at 83

// ══════════════════════════════════════════════════
// Also check s06, s07 card text doesn't overflow
// s06 cards: text w=20 at 18px — check content length
// ══════════════════════════════════════════════════
// s06 card text is at 18px in w=20 boxes. The px width is 20/100*1920=384px
// At 18px, ~39 chars per line. Box h=17 → 17/100*1080=183px → ~7 lines at 18px*1.4=25px
// These should be fine.

// s07 card text similar — also fine at 18px

// ══════════════════════════════════════════════════
// s08: Check card text fits
// ══════════════════════════════════════════════════
// Cards at w=40, text w=34 at 22px. px width = 34/100*1920=653px → ~54 chars/line
// h=18 → 18/100*1080=194px → ~6 lines at 22px*1.4=31px. Should be fine.

// ══════════════════════════════════════════════════
// s11: tagline check
// ══════════════════════════════════════════════════
const s11tag = getEl('s11', 's11-tagline');
if (s11tag) { s11tag.y = 90; s11tag.height = 4; s11tag.style.fontSize = 18; }

// s11 row2 cards: y=64 h=24 → ends 88. Tagline at 90 — OK

data.updatedAt = Date.now();
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log('v9 applied:');
console.log('- s01: pills font smaller');
console.log('- s02/s03: title box taller for wrapping');
console.log('- s04: desc no longer overlaps price, card titles smaller');
console.log('- s12: tagline moved below cards, card heights reduced');
console.log('- s11: tagline repositioned');
