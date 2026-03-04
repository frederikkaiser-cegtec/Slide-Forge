import fs from 'fs';

const FILE = './public/presentation.json';
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

function getEl(sid, eid) {
  return data.slides.find(s => s.id === sid)?.elements.find(e => e.id === eid);
}

// Hintergrundbilder deutlich sichtbarer machen
const bgImages = [
  ['s01', 's01-img', 0.25],
  ['s02', 's02-bg', 0.20],
  ['s03', 's03-img', 0.20],
  ['s04', 's04-bg', 0.18],
  ['s05', 's05-bg', 0.18],
  ['s06', 's06-bg', 0.20],
  ['s07', 's07-img', 0.18],
  ['s08', 's08-img', 0.18],
  ['s09', 's09-bg', 0.18],
  ['s11', 's11-img', 0.18],
  ['s12', 's12-bg', 0.20],
  ['s13', 's13-bg', 0.18],
  ['s14', 's14-img', 0.25],
];

for (const [sid, eid, opacity] of bgImages) {
  const el = getEl(sid, eid);
  if (el) el.style.opacity = opacity;
}

data.updatedAt = Date.now();
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log('v8: Background images now at 18-25% opacity');
