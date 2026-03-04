import fs from 'fs';

const FILE = './public/presentation.json';
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

// Unsplash source URLs — free, no API key needed, direct image links
const imageReplacements = {
  // s01: Hero background — solar panels on rooftop, aerial view
  's01-img': 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&h=1080&fit=crop&q=80',

  // s02: Commercial rooftop unused potential
  's02-img': 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=1000&fit=crop&q=80',

  // s09: Trina solar modules close-up
  's09-img-1': 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&h=600&fit=crop&q=80',

  // s09: Inverter / technical equipment
  's09-img-2': 'https://images.unsplash.com/photo-1592833159057-6de3df358824?w=800&h=600&fit=crop&q=80',

  // s10: Industrial building with solar — aerial
  's10-img': 'https://images.unsplash.com/photo-1611365892117-00ac6ce06fbc?w=1400&h=500&fit=crop&q=80',

  // s14: Sunset over solar panels — closing slide
  's14-img': 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1920&h=1080&fit=crop&q=80',
};

let count = 0;
for (const slide of data.slides) {
  for (const el of slide.elements) {
    if (imageReplacements[el.id]) {
      el.content = imageReplacements[el.id];
      count++;
      console.log(`  ✅ ${el.id} → Unsplash photo`);
    }
  }
}

data.updatedAt = Date.now();
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log(`\nDone! Replaced ${count} placeholder images with Unsplash photos.`);
