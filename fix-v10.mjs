import fs from 'fs';

const FILE = './public/presentation.json';
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

function getEl(sid, eid) {
  return data.slides.find(s => s.id === sid)?.elements.find(e => e.id === eid);
}

// ══════════════════════════════════════════════════
// TEXTE GRÖßER — überall wo Platz ist
// ══════════════════════════════════════════════════

// s01: Pills und Sub größer
const s01pills = getEl('s01', 's01-pills');
if (s01pills) { s01pills.style.fontSize = 26; }
const s01sub = getEl('s01', 's01-sub');
if (s01sub) { s01sub.style.fontSize = 38; }

// s02: Body text, box content
const s02body = getEl('s02', 's02-body');
if (s02body) { s02body.style.fontSize = 24; }
const s02boxBody = getEl('s02', 's02-box-body');
if (s02boxBody) { s02boxBody.style.fontSize = 22; }
const s02boxList = getEl('s02', 's02-box-list');
if (s02boxList) { s02boxList.style.fontSize = 24; }
const s02boxTitle = getEl('s02', 's02-box-title');
if (s02boxTitle) { s02boxTitle.style.fontSize = 32; }
const s02req = getEl('s02', 's02-req');
if (s02req) { s02req.style.fontSize = 24; }

// s03: Metric labels viel größer + numbers
for (const n of [1,2,3,4]) {
  const lbl = getEl('s03', `s03-m${n}-lbl`);
  if (lbl) { lbl.style.fontSize = 26; }
  const num = getEl('s03', `s03-m${n}-num`);
  if (num) { num.style.fontSize = 60; }
}
const s03body = getEl('s03', 's03-body');
if (s03body) { s03body.style.fontSize = 24; }

// s04: Card titles, descriptions, units
for (const key of ['c1', 'c2', 'c3']) {
  const title = getEl('s04', `s04-${key}-title`);
  if (title) { title.style.fontSize = 30; }
  const desc = getEl('s04', `s04-${key}-desc`);
  if (desc) { desc.style.fontSize = 20; }
  const price = getEl('s04', `s04-${key}-price`);
  if (price) { price.style.fontSize = 48; }
  const unit = getEl('s04', `s04-${key}-unit`);
  if (unit) { unit.style.fontSize = 22; }
  const num = getEl('s04', `s04-${key}-num`);
  if (num) { num.style.fontSize = 22; }
}

// s05: Labels, notes
for (const s of ['b1-label', 'b2-label']) {
  const el = getEl('s05', `s05-${s}`);
  if (el) { el.style.fontSize = 24; }
}
const s05note = getEl('s05', 's05-note');
if (s05note) { s05note.style.fontSize = 24; }
const s05b1num = getEl('s05', 's05-b1-num');
if (s05b1num) { s05b1num.style.fontSize = 56; }
const s05b2num = getEl('s05', 's05-b2-num');
if (s05b2num) { s05b2num.style.fontSize = 56; }
const s05b1sub = getEl('s05', 's05-b1-sub');
if (s05b1sub) { s05b1sub.style.fontSize = 32; }
const s05b2sub = getEl('s05', 's05-b2-sub');
if (s05b2sub) { s05b2sub.style.fontSize = 32; }

// s06: Card text größer
for (const key of ['duration', 'grundbuch', 'kosten', 'ende', 'eigentum']) {
  const t = getEl('s06', `s06-card-${key}-text`);
  if (t) { t.style.fontSize = 20; }
  const badge = getEl('s06', `s06-card-${key}-badge`);
  if (badge) { badge.style.fontSize = 38; }
}

// s07: Card text größer
for (const key of ['invest', 'income', 'value', 'cost', 'sustain', 'service']) {
  const t = getEl('s07', `s07-card-${key}-text`);
  if (t) { t.style.fontSize = 20; }
  const icon = getEl('s07', `s07-card-${key}-icon`);
  if (icon) { icon.style.fontSize = 38; }
}

// s08: Card text
for (const key of ['b1', 'b2', 'b3', 'b4']) {
  const t = getEl('s08', `s08-${key}-t`);
  if (t) { t.style.fontSize = 24; }
}

// s09: Subtitle
const s09sub = getEl('s09', 's09-sub');
if (s09sub) { s09sub.style.fontSize = 32; }

// s10: Metric numbers bigger, units
for (const n of [1,2,3,4,5,6]) {
  const num = getEl('s10', `s10-m${n}n`);
  if (num) { num.style.fontSize = 46; }
  const unit = getEl('s10', `s10-m${n}u`);
  if (unit) { unit.style.fontSize = 18; } // tight space, keep reasonable
}
const s10sub = getEl('s10', 's10-sub');
if (s10sub) { s10sub.style.fontSize = 26; }

// s11: Card text
for (const key of ['vonovia', 'dqs', 'bag']) {
  const t = getEl('s11', `s11-card-${key}-text`);
  if (t) { t.style.fontSize = 26; }
}
for (const key of ['radeberger', 'bender', 'gewo', 'greenmonkey']) {
  const t = getEl('s11', `s11-card-${key}-text`);
  if (t) { t.style.fontSize = 22; }
}

// s12: Card text
for (const key of ['plan', 'permit', 'statik', 'elektro', 'dach', 'foerder']) {
  const t = getEl('s12', `s12-card-${key}-text`);
  if (t) { t.style.fontSize = 20; }
}
const s12tag = getEl('s12', 's12-tagline');
if (s12tag) { s12tag.style.fontSize = 24; }

// s13: Step text — narrow cols, but bump a bit
for (const n of [1,2,3,4]) {
  const t = getEl('s13', `s13-s${n}-t`);
  if (t) { t.style.fontSize = 19; }
}

// s14: Contact bigger
const s14contact = getEl('s14', 's14-contact');
if (s14contact) { s14contact.style.fontSize = 22; }
const s14sub = getEl('s14', 's14-sub');
if (s14sub) { s14sub.style.fontSize = 32; }

// All category labels (ÜBER UNS, etc) — bump from 20 to 22
for (const slide of data.slides) {
  const label = slide.elements.find(e => e.id === slide.id + '-label');
  if (label && label.style) { label.style.fontSize = 22; }
}

data.updatedAt = Date.now();
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log('v10: All copy text sizes increased');
