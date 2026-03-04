import fs from 'fs';

const FILE = './public/presentation.json';
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

// Add logo to s01 (title slide) — large, prominent
const s01 = data.slides.find(s => s.id === 's01');
// Remove old text-based brand element
s01.elements = s01.elements.filter(e => e.id !== 's01-brand');
// Add logo image before title
const s01titleIdx = s01.elements.findIndex(e => e.id === 's01-line');
s01.elements.splice(s01titleIdx, 0, {
  id: 's01-logo',
  type: 'image',
  x: 32, y: 6, width: 36, height: 18,
  rotation: 0,
  content: '/images/logo-transparent.png',
  style: { objectFit: 'contain', opacity: 1, borderRadius: 0 },
});

// Add small logo to footer area of all other slides (bottom-left corner)
for (const slide of data.slides) {
  if (slide.id === 's01') continue;

  // Check if logo already exists
  if (slide.elements.find(e => e.id === slide.id + '-logo')) continue;

  // Replace footer-left text with logo
  const footerLeft = slide.elements.find(e => e.id === slide.id + '-footer-left');
  if (footerLeft) {
    // Keep the text but make it smaller, shift right
    footerLeft.x = 10;
    footerLeft.width = 40;
  }

  // Add small logo before footer
  const footerLineIdx = slide.elements.findIndex(e => e.id === slide.id + '-footer-line');
  if (footerLineIdx >= 0) {
    slide.elements.splice(footerLineIdx + 1, 0, {
      id: slide.id + '-logo',
      type: 'image',
      x: 2, y: 93.5, width: 7, height: 5,
      rotation: 0,
      content: '/images/logo-transparent.png',
      style: { objectFit: 'contain', opacity: 0.8, borderRadius: 0 },
    });
  }
}

data.updatedAt = Date.now();
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log('Logo added:');
console.log('- s01: Large logo (36% wide) at top');
console.log('- All other slides: Small logo in footer-left');
