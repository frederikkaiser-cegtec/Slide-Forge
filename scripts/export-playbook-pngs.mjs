import { chromium } from 'playwright';
import { readFileSync } from 'fs';

const OUTDIR = 'C:/Users/frede/Projects/cegtec-assets/whitepaper';

const json = readFileSync('src/data/data-playbook.json', 'utf8');
const data = JSON.parse(json);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });

for (let i = 0; i < data.slides.length; i++) {
  const slide = data.slides[i];
  const bg = slide.background || '#F2EDE8';
  let elements = '';

  for (const el of slide.elements) {
    const x = (el.x / 100) * 1080;
    const y = (el.y / 100) * 1350;
    const ew = (el.width / 100) * 1080;
    const eh = (el.height / 100) * 1350;
    const s = el.style || {};

    if (el.type === 'shape') {
      const bgColor = s.backgroundColor || '#333';
      const radius = s.borderRadius ? `border-radius:${s.borderRadius}px;` : '';
      const opacity = s.opacity !== undefined ? `opacity:${s.opacity};` : '';
      const filter = s.filter ? `filter:${s.filter};` : '';
      elements += `<div style="position:absolute;left:${x}px;top:${y}px;width:${ew}px;height:${eh}px;background:${bgColor};${radius}${opacity}${filter}"></div>`;
    }
    if (el.type === 'text') {
      const color = s.color || '#000';
      const fontSize = s.fontSize || 16;
      const fontWeight = s.fontWeight || 400;
      const textAlign = s.textAlign || 'left';
      elements += `<div style="position:absolute;left:${x}px;top:${y}px;width:${ew}px;height:${eh}px;color:${color};font-size:${fontSize}px;font-weight:${fontWeight};text-align:${textAlign};display:flex;align-items:center;${textAlign === 'center' ? 'justify-content:center;' : textAlign === 'right' ? 'justify-content:flex-end;' : ''}line-height:1.15;font-family:'DM Sans',system-ui,sans-serif;">${el.content}</div>`;
    }
    if (el.type === 'image') {
      const fit = s.objectFit || 'contain';
      const filter = s.filter ? `filter:${s.filter};` : '';
      const src = el.content.startsWith('/') ? `http://localhost:5173/Slide-Forge${el.content}` : el.content;
      elements += `<img src="${src}" style="position:absolute;left:${x}px;top:${y}px;width:${ew}px;height:${eh}px;object-fit:${fit};${filter}" />`;
    }
  }

  const html = `<!DOCTYPE html><html><head><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box;}h1{font-size:inherit;font-weight:inherit;margin:0;}p{margin:0;}</style></head><body style="width:1080px;height:1350px;overflow:hidden;position:relative;background:${bg};font-family:'DM Sans',system-ui,sans-serif;">${elements}</body></html>`;

  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const path = `${OUTDIR}/data-playbook-${String(i + 1).padStart(2, '0')}.png`;
  await page.screenshot({ path, type: 'png', clip: { x: 0, y: 0, width: 1080, height: 1350 } });
  console.log(`Saved data-playbook-${String(i + 1).padStart(2, '0')}.png`);
}

await browser.close();
console.log('Done!');
