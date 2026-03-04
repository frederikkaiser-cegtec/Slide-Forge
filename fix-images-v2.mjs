import fs from 'fs';

const FILE = './public/presentation.json';
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

function getSlide(id) { return data.slides.find(s => s.id === id); }
function getEl(slideId, elId) {
  const s = getSlide(slideId);
  return s?.elements.find(e => e.id === elId);
}

// ═══ s01: Hero — already works, keep as is ═══

// ═══ s02: Make image bigger, move to right side, higher opacity ═══
{
  const el = getEl('s02', 's02-img');
  if (el) {
    el.x = 54; el.y = 8; el.width = 42; el.height = 50;
    el.style.opacity = 0.85;
    el.style.borderRadius = 16;
    el.content = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&h=1100&fit=crop&q=80';
  }
  // Move image after decorators but before text so it's visible
  const s02 = getSlide('s02');
  s02.elements = s02.elements.filter(e => e.id !== 's02-img');
  const boxIdx = s02.elements.findIndex(e => e.id === 's02-box');
  if (boxIdx >= 0) {
    // Put image before the box so box overlays on top
    s02.elements.splice(boxIdx, 0, {
      ...el,
    });
  }
}

// ═══ s03: Add team/office image ═══
{
  const s03 = getSlide('s03');
  const bodyIdx = s03.elements.findIndex(e => e.id === 's03-body');
  s03.elements.splice(bodyIdx + 1, 0, {
    id: 's03-img',
    type: 'image',
    x: 72, y: 8, width: 24, height: 35,
    rotation: 0,
    content: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=800&fit=crop&q=80',
    style: { objectFit: 'cover', opacity: 0.9, borderRadius: 16 },
  });
}

// ═══ s05: Add image to Einnahmebeispiele ═══
{
  const s05 = getSlide('s05');
  const noteIdx = s05.elements.findIndex(e => e.id === 's05-note');
  s05.elements.splice(noteIdx, 0, {
    id: 's05-img',
    type: 'image',
    x: 8, y: 72, width: 84, height: 18,
    rotation: 0,
    content: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=1400&h=400&fit=crop&q=80',
    style: { objectFit: 'cover', opacity: 0.25, borderRadius: 12 },
  });
}

// ═══ s07: Add image ═══
{
  const s07 = getSlide('s07');
  const footerIdx = s07.elements.findIndex(e => e.id === 's07-footer-line');
  s07.elements.splice(footerIdx, 0, {
    id: 's07-img',
    type: 'image',
    x: 0, y: 0, width: 100, height: 100,
    rotation: 0,
    content: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&h=1080&fit=crop&q=80',
    style: { objectFit: 'cover', opacity: 0.06, borderRadius: 0 },
  });
}

// ═══ s08: Add subtle background image ═══
{
  const s08 = getSlide('s08');
  const labelIdx = s08.elements.findIndex(e => e.id === 's08-label');
  s08.elements.splice(labelIdx, 0, {
    id: 's08-img',
    type: 'image',
    x: 0, y: 0, width: 100, height: 100,
    rotation: 0,
    content: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&h=1080&fit=crop&q=80',
    style: { objectFit: 'cover', opacity: 0.05, borderRadius: 0 },
  });
}

// ═══ s09: Make images bigger and more visible ═══
{
  const img1 = getEl('s09', 's09-img-1');
  if (img1) {
    img1.x = 8; img1.y = 68; img1.width = 40; img1.height = 22;
    img1.style.opacity = 0.9;
    img1.style.borderRadius = 12;
    img1.content = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=900&h=500&fit=crop&q=80';
  }
  const img2 = getEl('s09', 's09-img-2');
  if (img2) {
    img2.x = 52; img2.y = 68; img2.width = 40; img2.height = 22;
    img2.style.opacity = 0.9;
    img2.style.borderRadius = 12;
    img2.content = 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=900&h=500&fit=crop&q=80';
  }
  // Move images to end (before footer) so they're on top
  const s09 = getSlide('s09');
  s09.elements = s09.elements.filter(e => e.id !== 's09-img-1' && e.id !== 's09-img-2');
  const footerIdx = s09.elements.findIndex(e => e.id === 's09-footer-line');
  s09.elements.splice(footerIdx, 0, img1, img2);
}

// ═══ s10: Make reference image bigger ═══
{
  const img = getEl('s10', 's10-img');
  if (img) {
    img.x = 4; img.y = 64; img.width = 92; img.height = 28;
    img.style.opacity = 0.9;
    img.style.borderRadius = 12;
    img.content = 'https://images.unsplash.com/photo-1611365892117-00ac6ce06fbc?w=1600&h=500&fit=crop&q=80';
  }
  // Move to end before footer
  const s10 = getSlide('s10');
  s10.elements = s10.elements.filter(e => e.id !== 's10-img');
  const footerIdx = s10.elements.findIndex(e => e.id === 's10-footer-line');
  s10.elements.splice(footerIdx, 0, img);
}

// ═══ s11: Add subtle background ═══
{
  const s11 = getSlide('s11');
  const labelIdx = s11.elements.findIndex(e => e.id === 's11-label');
  s11.elements.splice(labelIdx, 0, {
    id: 's11-img',
    type: 'image',
    x: 0, y: 0, width: 100, height: 100,
    rotation: 0,
    content: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop&q=80',
    style: { objectFit: 'cover', opacity: 0.04, borderRadius: 0 },
  });
}

data.updatedAt = Date.now();
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log('Images v2 applied — all slides now have visible photos!');
