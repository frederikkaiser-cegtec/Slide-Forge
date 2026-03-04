import fs from 'fs';
const data = JSON.parse(fs.readFileSync('./public/presentation.json','utf-8'));

console.log('=== TEXT OVERFLOW CHECK ===\n');

for (const slide of data.slides) {
  for (const el of slide.elements) {
    if (el.type !== 'text') continue;
    const text = (el.content || '').replace(/<[^>]+>/g,'');
    const fontSize = el.style?.fontSize || 16;
    const w = el.width;
    const h = el.height;
    const pxWidth = (w / 100) * 1920;
    const charsPerLine = Math.floor(pxWidth / (fontSize * 0.55));
    const lines = Math.ceil(text.length / Math.max(charsPerLine, 1));
    const lineHeight = fontSize * 1.4;
    const pxHeight = (h / 100) * 1080;
    const maxLines = Math.floor(pxHeight / lineHeight);
    if (lines > maxLines && text.length > 20) {
      console.log(`${el.id.padEnd(30)} OVERFLOW  ${fontSize}px  box=${w}x${h}  ~lines=${lines}/${maxLines}  chars=${text.length}`);
      console.log(`  "${text.slice(0,150)}"`);
      console.log();
    }
  }
}

// Also check text-on-text overlaps within each slide
console.log('\n=== TEXT-TEXT OVERLAPS ===\n');
for (const slide of data.slides) {
  const texts = slide.elements.filter(e => e.type === 'text' && e.height > 2);
  for (let i = 0; i < texts.length; i++) {
    for (let j = i + 1; j < texts.length; j++) {
      const a = texts[i], b = texts[j];
      const ox = Math.max(0, Math.min(a.x+a.width, b.x+b.width) - Math.max(a.x, b.x));
      const oy = Math.max(0, Math.min(a.y+a.height, b.y+b.height) - Math.max(a.y, b.y));
      if (ox > 2 && oy > 2) {
        const aText = (a.content||'').replace(/<[^>]+>/g,'').slice(0,30);
        const bText = (b.content||'').replace(/<[^>]+>/g,'').slice(0,30);
        console.log(`${slide.id}: ${a.id} overlaps ${b.id}  (${ox.toFixed(0)}x${oy.toFixed(0)})`);
        console.log(`  "${aText}" vs "${bText}"`);
      }
    }
  }
}
