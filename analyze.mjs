import fs from 'fs';
const data = JSON.parse(fs.readFileSync('./public/presentation.json','utf-8'));

console.log('=== POSSIBLE TEXT OVERFLOW ===\n');
for (const slide of data.slides) {
  for (const el of slide.elements) {
    if (el.type !== 'text') continue;
    const textLen = el.content.replace(/<[^>]+>/g,'').length;
    const area = el.width * el.height;
    const fontSize = el.style?.fontSize || 16;
    const estCapacity = area / (fontSize * 0.055);
    if (textLen > estCapacity * 0.7 && textLen > 30) {
      console.log(`${el.id}  ${fontSize}px  box=${el.width}x${el.height}  chars=${textLen}  ~cap=${Math.round(estCapacity)}`);
      console.log(`  "${el.content.replace(/<[^>]+>/g,'').slice(0,100)}"`);
      console.log();
    }
  }
}

console.log('\n=== ALL SLIDES SUMMARY ===\n');
for (const slide of data.slides) {
  const title = slide.elements.find(e => e.id === slide.id + '-title');
  const imgs = slide.elements.filter(e => e.type === 'image');
  const titleText = title ? title.content.replace(/<[^>]+>/g,'') : 'no title';
  console.log(`${slide.id}: "${titleText}"`);
  console.log(`  Images: ${imgs.length > 0 ? imgs.map(i => i.id + ' (' + Math.round(i.style?.opacity*100) + '%)').join(', ') : 'NONE'}`);
  console.log();
}
