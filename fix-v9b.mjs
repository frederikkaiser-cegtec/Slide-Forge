import fs from 'fs';
const FILE = './public/presentation.json';
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));
const el = data.slides[0].elements.find(e => e.id === 's01-pills');
if (el) {
  el.style.fontSize = 22;
  el.width = 76;
  el.x = 12;
}
data.updatedAt = Date.now();
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log('s01 pills fixed: 22px, wider box');
