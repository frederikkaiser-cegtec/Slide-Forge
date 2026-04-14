import { chromium } from 'playwright';
import { readFileSync } from 'fs';

const OUTDIR = 'C:/Users/frede/Projects/cegtec-assets/whitepaper';

async function exportSlidesPNG(jsonPath, prefix) {
  const json = readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(json);
  const slideCount = data.slides.length;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/Slide-Forge/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Enter slides mode
  await page.click('text=Slides');
  await page.waitForTimeout(1500);

  // Import JSON via store
  await page.evaluate((jsonStr) => {
    const evt = new CustomEvent('sf-import', { detail: jsonStr });
    window.dispatchEvent(evt);
  }, json);

  // Use importJSON directly via the store
  await page.evaluate((jsonStr) => {
    // Find the zustand store on the page
    const data = JSON.parse(jsonStr);
    if (data.slides && data.title) {
      // Trigger file sync by writing to presentation.json would be complex
      // Instead, use the import button approach - paste into the store
    }
  }, json);
  await page.waitForTimeout(500);

  // The presentation should already be loaded via useFileSync since we copied to presentation.json
  // Just need to screenshot each slide from the export container

  // Click on first slide to make sure we're in the editor
  await page.waitForTimeout(1000);

  // Screenshot each slide from the sidebar thumbnails at full resolution
  for (let i = 0; i < slideCount; i++) {
    // Click slide in sidebar
    const slides = await page.$$('[class*="slide-sidebar"] > div, [class*="SlideSidebar"] > div, .slide-thumb, [data-slide-index]');
    if (slides[i]) {
      await slides[i].click();
      await page.waitForTimeout(300);
    }

    // Find the main canvas slide element and screenshot it
    const slideEl = await page.$('#slide-export-container [id^="slide-export-"]')
      || await page.$('[class*="SlideCanvas"] > div > div')
      || await page.$('.slide-canvas-inner');

    if (slideEl) {
      await slideEl.screenshot({
        path: `${OUTDIR}/${prefix}-${String(i + 1).padStart(2, '0')}.png`,
        type: 'png',
      });
      console.log(`  Saved ${prefix}-${String(i + 1).padStart(2, '0')}.png`);
    }
  }

  await browser.close();
}

// Simpler approach: use page.pdf() to render each slide as a full-page screenshot
async function exportSlidesSimple(jsonPath, prefix, title) {
  const json = readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(json);

  const browser = await chromium.launch({ headless: true });

  // Set viewport to 4:5 ratio at 2x for quality
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });

  for (let i = 0; i < data.slides.length; i++) {
    const slide = data.slides[i];

    // Build a standalone HTML page for this slide
    const html = buildSlideHTML(slide, 1080, 1350);
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const path = `${OUTDIR}/${prefix}-${String(i + 1).padStart(2, '0')}.png`;
    await page.screenshot({ path, type: 'png', clip: { x: 0, y: 0, width: 1080, height: 1350 } });
    console.log(`  Saved ${prefix}-${String(i + 1).padStart(2, '0')}.png`);
  }

  await browser.close();
}

function buildSlideHTML(slide, w, h) {
  const bg = slide.background || '#F2EDE8';

  let elements = '';
  for (const el of slide.elements) {
    const x = (el.x / 100) * w;
    const y = (el.y / 100) * h;
    const ew = (el.width / 100) * w;
    const eh = (el.height / 100) * h;
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

  return `<!DOCTYPE html>
<html>
<head>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
h1 { font-size:inherit; font-weight:inherit; margin:0; }
p { margin:0; }
</style>
</head>
<body style="width:${w}px;height:${h}px;overflow:hidden;position:relative;background:${bg};font-family:'DM Sans',system-ui,sans-serif;">
${elements}
</body>
</html>`;
}

console.log('Exporting Outbound Stack PNGs...');
await exportSlidesSimple(
  'C:/Users/frede/Projects/slide-forge/src/data/outbound-stack.json',
  'outbound-stack',
  'Der 150€ Outbound Stack'
);

console.log('Exporting CRM Audit PNGs...');
await exportSlidesSimple(
  'C:/Users/frede/Projects/slide-forge/src/data/crm-audit.json',
  'crm-audit',
  'Dein CRM lügt'
);

console.log('Done!');
