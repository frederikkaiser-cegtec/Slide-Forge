import fs from 'fs';

const FILE = './public/presentation.json';
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

function getSlide(id) { return data.slides.find(s => s.id === id); }
function getEl(sid, eid) { return getSlide(sid)?.elements.find(e => e.id === eid); }
function removeEl(sid, eid) {
  const s = getSlide(sid);
  s.elements = s.elements.filter(e => e.id !== eid);
}
function addBgImage(sid, photoId) {
  const s = getSlide(sid);
  const existing = s.elements.find(e => e.id === `${sid}-bg`);
  if (existing) {
    existing.content = `https://images.unsplash.com/photo-${photoId}?w=800&q=50`;
    return;
  }
  // Insert after decorators, before content
  const labelIdx = s.elements.findIndex(e => e.id === `${sid}-label`);
  const insertIdx = labelIdx >= 0 ? labelIdx : 4;
  s.elements.splice(insertIdx, 0, {
    id: `${sid}-bg`,
    type: 'image',
    x: 0, y: 0, width: 100, height: 100,
    rotation: 0,
    content: `https://images.unsplash.com/photo-${photoId}?w=800&q=50`,
    style: { objectFit: 'cover', opacity: 0.06, borderRadius: 0 },
  });
}

// ══════════════════════════════════════════════════
// PART 1: FIX TEXT OVERFLOW — reduce font sizes & expand boxes
// ══════════════════════════════════════════════════

// s02: body text too big for box
const s02body = getEl('s02', 's02-body');
if (s02body) { s02body.style.fontSize = 22; s02body.height = 38; }
const s02boxbody = getEl('s02', 's02-box-body');
if (s02boxbody) { s02boxbody.style.fontSize = 20; }

// s03: body text cramped
const s03body = getEl('s03', 's03-body');
if (s03body) { s03body.style.fontSize = 22; s03body.height = 18; }

// s04: variant descriptions overflow at 24px in 26-wide cards
for (const v of ['c1', 'c2', 'c3']) {
  const desc = getEl('s04', `s04-${v}-desc`);
  if (desc) { desc.style.fontSize = 18; desc.height = 28; }
}

// s06: card texts overflow at 24px in 25-wide cards
for (const key of ['duration', 'grundbuch', 'kosten', 'ende', 'eigentum']) {
  const t = getEl('s06', `s06-card-${key}-text`);
  if (t) { t.style.fontSize = 18; }
}

// s07: card texts
for (const key of ['invest', 'income', 'value', 'cost', 'sustain', 'service']) {
  const t = getEl('s07', `s07-card-${key}-text`);
  if (t) { t.style.fontSize = 18; }
}

// s08: title too long at 56px, insurance card text
const s08title = getEl('s08', 's08-title');
if (s08title) { s08title.style.fontSize = 48; s08title.height = 12; }
for (const b of ['b1', 'b2', 'b3', 'b4']) {
  const t = getEl('s08', `s08-${b}-t`);
  if (t) { t.style.fontSize = 22; }
}

// s10: subtitle cramped
const s10sub = getEl('s10', 's10-sub');
if (s10sub) { s10sub.height = 8; s10sub.style.fontSize = 24; }

// s12: card text with emojis
for (const key of ['plan', 'permit', 'statik', 'elektro', 'dach', 'foerder']) {
  const t = getEl('s12', `s12-card-${key}-text`);
  if (t) { t.style.fontSize = 18; }
}

// s13: step text in narrow columns
for (const n of [1, 2, 3, 4]) {
  const t = getEl('s13', `s13-s${n}-t`);
  if (t) { t.style.fontSize = 17; }
}

// s14: contact box text
const s14contact = getEl('s14', 's14-contact');
if (s14contact) { s14contact.style.fontSize = 20; s14contact.height = 22; }
// Expand contact box
const s14box = getEl('s14', 's14-box');
if (s14box) { s14box.height = 28; }

// ══════════════════════════════════════════════════
// PART 2: REPLACE ALL IMAGES with specific Dachpacht photos
// ══════════════════════════════════════════════════

// s01: Aerial view commercial rooftop with solar — German building
const s01img = getEl('s01', 's01-img');
if (s01img) {
  s01img.content = 'https://images.unsplash.com/photo-1592213299715-026f68b02218?w=800&q=50';
  s01img.style.opacity = 0.12;
}

// s02: Remove old image, add rooftop solar rows as subtle bg
removeEl('s02', 's02-img');
addBgImage('s02', '1592213299715-026f68b02218'); // rooftop solar rows

// s03: Solar workers/team on roof instead of generic office
const s03img = getEl('s03', 's03-img');
if (s03img) {
  s03img.content = 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&q=50';
  s03img.style.opacity = 0.85;
}

// s04: Background — different roof types / commercial rooftop
addBgImage('s04', '1558618666-fcd25c85f82e'); // commercial building aerial

// s05: Background — financial/growth concept with solar
addBgImage('s05', '1532601224476-15c79f2f7a51'); // calculator/finance

// s06: Background — contract signing / handshake
addBgImage('s06', '1450101499163-c8848c66ca85'); // business contract

// s07: Update existing bg — green rooftop / sustainability
const s07img = getEl('s07', 's07-img');
if (s07img) {
  s07img.content = 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=800&q=50';
  s07img.style.opacity = 0.05;
}

// s08: Update bg — protection/shield concept
const s08img = getEl('s08', 's08-img');
if (s08img) {
  s08img.content = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=50';
  s08img.style.opacity = 0.05;
}

// s09: Solar panels close-up on building + inverter
const s09img1 = getEl('s09', 's09-img-1');
if (s09img1) {
  s09img1.content = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&q=50';
}
const s09img2 = getEl('s09', 's09-img-2');
if (s09img2) {
  s09img2.content = 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=500&q=50';
}

// s10: Industrial building aerial with solar
const s10img = getEl('s10', 's10-img');
if (s10img) {
  s10img.content = 'https://images.unsplash.com/photo-1611365892117-00ac6ce06fbc?w=700&q=50';
}

// s11: Update bg — corporate trust / skyline
const s11img = getEl('s11', 's11-img');
if (s11img) {
  s11img.content = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=50';
  s11img.style.opacity = 0.04;
}

// s12: Background — installation process / construction
addBgImage('s12', '1504307651254-35680f356dfd'); // construction workers

// s13: Background — process/steps / solar installation
addBgImage('s13', '1621905252507-b35492cc74b4'); // solar workers on roof

// s14: Sunset over solar panels on building
const s14img = getEl('s14', 's14-img');
if (s14img) {
  s14img.content = 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=50';
  s14img.style.opacity = 0.1;
}

data.updatedAt = Date.now();
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log('v4 applied:');
console.log('- Text overflow fixed on s02-s14');
console.log('- All images replaced with Dachpacht-specific Unsplash photos');
console.log('- Background images added to s04, s05, s06, s12, s13');
console.log('- Every slide now has at least one image');
