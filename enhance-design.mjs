import fs from 'fs';

const FILE = './public/presentation.json';
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

const ACCENT = '#c7f80f';
const ACCENT_DARK = '#5a8a00';
const GOLD = '#d4a017';
const CARD_BG = '#f5f7f2';

// Helper to check if element ID matches any of the decorator IDs we add
function isDecorator(id) {
  return id.endsWith('-topbar') ||
    id.endsWith('-sidebar-accent') ||
    id.endsWith('-deco-circle-tr') ||
    id.endsWith('-deco-circle-bl') ||
    id.endsWith('-title-accent') ||
    id.endsWith('-footer-line') ||
    id.endsWith('-footer-left') ||
    id.endsWith('-footer-right');
}

data.slides.forEach((slide, idx) => {
  // Remove old decorators
  slide.elements = slide.elements.filter(e => !isDecorator(e.id));

  const sid = slide.id;
  const isTitle = sid === 's01';
  const isClosing = sid === 's14';
  const pageNum = idx + 1;

  // 1. Top accent bar (all slides)
  slide.elements.unshift({
    id: `${sid}-topbar`,
    type: 'shape',
    x: 0, y: 0, width: 100, height: 0.8,
    rotation: 0, content: '',
    style: { backgroundColor: ACCENT },
  });

  // 2. Left sidebar accent (content slides only)
  if (!isTitle && !isClosing) {
    slide.elements.splice(1, 0, {
      id: `${sid}-sidebar-accent`,
      type: 'shape',
      x: 0, y: 0.8, width: 0.4, height: 99.2,
      rotation: 0, content: '',
      style: { backgroundColor: ACCENT_DARK, opacity: 0.25 },
    });
  }

  // 3. Decorative background circles
  slide.elements.splice(isTitle || isClosing ? 1 : 2, 0, {
    id: `${sid}-deco-circle-tr`,
    type: 'shape',
    x: 82, y: -8, width: 26, height: 46,
    rotation: 0, content: '',
    style: { backgroundColor: ACCENT, opacity: 0.03, borderRadius: 9999 },
  });
  slide.elements.splice(isTitle || isClosing ? 2 : 3, 0, {
    id: `${sid}-deco-circle-bl`,
    type: 'shape',
    x: -8, y: 65, width: 22, height: 39,
    rotation: 0, content: '',
    style: { backgroundColor: GOLD, opacity: 0.03, borderRadius: 9999 },
  });

  // 4. Footer system (skip title and closing)
  if (!isTitle && !isClosing) {
    slide.elements.push({
      id: `${sid}-footer-line`,
      type: 'shape',
      x: 5, y: 93, width: 90, height: 0.15,
      rotation: 0, content: '',
      style: { backgroundColor: '#d1d5db' },
    });
    slide.elements.push({
      id: `${sid}-footer-left`,
      type: 'text',
      x: 5, y: 94, width: 50, height: 4,
      rotation: 0,
      content: '<p>Better Energy  |  Dachpacht-Modell</p>',
      style: { fontSize: 11, color: '#9ca3af', textAlign: 'left' },
    });
    slide.elements.push({
      id: `${sid}-footer-right`,
      type: 'text',
      x: 70, y: 94, width: 25, height: 4,
      rotation: 0,
      content: `<p>${pageNum}</p>`,
      style: { fontSize: 11, color: '#9ca3af', textAlign: 'right' },
    });
  }

  // 5. Update card backgrounds to warmer tone
  slide.elements.forEach(el => {
    if (el.style && el.style.backgroundColor === '#f3f4f3') {
      el.style.backgroundColor = CARD_BG;
    }
  });

  // 6. Find title elements and add accent line underneath
  const titleEl = slide.elements.find(e =>
    e.type === 'text' && e.content && e.content.includes('<h1>') && e.id !== `${sid}-footer-left`
  );
  if (titleEl && !isTitle && !isClosing) {
    const accentLineY = titleEl.y + titleEl.height + 0.5;
    const titleIdx = slide.elements.indexOf(titleEl);
    slide.elements.splice(titleIdx + 1, 0, {
      id: `${sid}-title-accent`,
      type: 'shape',
      x: titleEl.x, y: accentLineY, width: 8, height: 0.5,
      rotation: 0, content: '',
      style: { backgroundColor: ACCENT },
    });
  }
});

data.updatedAt = Date.now();
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log(`Done! Enhanced ${data.slides.length} slides with premium design elements.`);
