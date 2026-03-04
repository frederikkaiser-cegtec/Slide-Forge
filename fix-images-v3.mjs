import fs from 'fs';

const FILE = './public/presentation.json';
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

function getSlide(id) { return data.slides.find(s => s.id === id); }
function getEl(slideId, elId) {
  const s = getSlide(slideId);
  return s?.elements.find(e => e.id === elId);
}
function removeEl(slideId, elId) {
  const s = getSlide(slideId);
  s.elements = s.elements.filter(e => e.id !== elId);
}
function insertBefore(slideId, beforeId, el) {
  const s = getSlide(slideId);
  const idx = s.elements.findIndex(e => e.id === beforeId);
  if (idx >= 0) s.elements.splice(idx, 0, el);
  else s.elements.push(el);
}

// ═══ s01: Background only — small image, low opacity. No overlap. ═══
{
  const el = getEl('s01', 's01-img');
  if (el) {
    el.content = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=60';
    el.style.opacity = 0.12;
  }
}

// ═══ s02: Image RIGHT side, text LEFT side — no overlap ═══
{
  removeEl('s02', 's02-img');
  // Shrink title width so it doesn't extend into image area
  const title = getEl('s02', 's02-title');
  if (title) title.width = 50;
  const body = getEl('s02', 's02-body');
  if (body) body.width = 46;
  // Place image in top-right corner, behind the info box
  insertBefore('s02', 's02-box', {
    id: 's02-img',
    type: 'image',
    x: 56, y: 4, width: 40, height: 48,
    rotation: 0,
    content: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=600&q=60',
    style: { objectFit: 'cover', opacity: 0.15, borderRadius: 16 },
  });
}

// ═══ s03: Small image top-right, NOT overlapping title ═══
{
  removeEl('s03', 's03-img');
  // Title is at y=14, w=80 — shrink it
  const title = getEl('s03', 's03-title');
  if (title) title.width = 62;
  const body = getEl('s03', 's03-body');
  if (body) body.width = 62;
  insertBefore('s03', 's03-label', {
    id: 's03-img',
    type: 'image',
    x: 72, y: 6, width: 24, height: 38,
    rotation: 0,
    content: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=60',
    style: { objectFit: 'cover', opacity: 0.85, borderRadius: 16 },
  });
}

// ═══ s05: Subtle background strip below cards, not overlapping ═══
{
  removeEl('s05', 's05-img');
  // No image needed here — the cards speak for themselves
}

// ═══ s07: Very subtle full-slide background only ═══
{
  const el = getEl('s07', 's07-img');
  if (el) {
    el.content = 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=50';
    el.style.opacity = 0.04;
  }
}

// ═══ s08: Very subtle background ═══
{
  const el = getEl('s08', 's08-img');
  if (el) {
    el.content = 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=50';
    el.style.opacity = 0.04;
  }
}

// ═══ s09: Images BELOW the cards, not overlapping ═══
{
  // Cards end at y=36+42=78. Place images at y=80
  const img1 = getEl('s09', 's09-img-1');
  if (img1) {
    img1.x = 8; img1.y = 80; img1.width = 38; img1.height = 12;
    img1.style.opacity = 0.8;
    img1.content = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&q=60';
  }
  const img2 = getEl('s09', 's09-img-2');
  if (img2) {
    img2.x = 52; img2.y = 80; img2.width = 38; img2.height = 12;
    img2.style.opacity = 0.8;
    img2.content = 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=500&q=60';
  }
}

// ═══ s10: Image below metrics, not overlapping ═══
{
  const img = getEl('s10', 's10-img');
  if (img) {
    // Metrics end at y=36+26=62. foot text at y=68. Place image at y=66
    img.x = 4; img.y = 66; img.width = 92; img.height = 24;
    img.style.opacity = 0.85;
    img.content = 'https://images.unsplash.com/photo-1611365892117-00ac6ce06fbc?w=700&q=60';
  }
  // Move foot text above the image
  const foot = getEl('s10', 's10-foot');
  if (foot) {
    foot.y = 62;
    foot.style.fontSize = 18;
  }
}

// ═══ s11: Very subtle background ═══
{
  const el = getEl('s11', 's11-img');
  if (el) {
    el.content = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=50';
    el.style.opacity = 0.03;
  }
}

// ═══ s14: Background — small image ═══
{
  const el = getEl('s14', 's14-img');
  if (el) {
    el.content = 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=800&q=60';
    el.style.opacity = 0.1;
  }
}

data.updatedAt = Date.now();
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log('Images v3: overlaps fixed, image sizes reduced (max 800px wide, q=60)');
