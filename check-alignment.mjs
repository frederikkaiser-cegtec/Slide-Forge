import fs from 'fs';
const data = JSON.parse(fs.readFileSync('./public/presentation.json','utf-8'));

for (const slide of data.slides) {
  const title = slide.elements.find(e => e.id === slide.id+'-title');
  const titleText = title ? title.content.replace(/<[^>]+>/g,'').slice(0,50) : '?';
  console.log(`\n=== ${slide.id}: "${titleText}" ===`);
  for (const el of slide.elements) {
    const t = el.type;
    if (t === 'text' || t === 'shape') {
      const label = el.id.padEnd(25);
      console.log(`  ${label} ${t.padEnd(6)} x=${String(el.x).padStart(4)} y=${String(el.y).padStart(4)} w=${String(el.width).padStart(4)} h=${String(el.height).padStart(4)}  ${t==='text' ? (el.style?.fontSize||'?')+'px' : (el.style?.backgroundColor||'')}`);
    }
    if (t === 'image') {
      const label = el.id.padEnd(25);
      console.log(`  ${label} image  x=${String(el.x).padStart(4)} y=${String(el.y).padStart(4)} w=${String(el.width).padStart(4)} h=${String(el.height).padStart(4)}  opacity=${el.style?.opacity||1}`);
    }
  }
}
