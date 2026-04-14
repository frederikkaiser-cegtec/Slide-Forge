import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import path from 'path';

const OUTDIR = 'C:/Users/frede/Projects/cegtec-assets/whitepaper';

async function exportPresentation(jsonPath, outputName) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to Slide-Forge
  await page.goto('http://localhost:5173/Slide-Forge/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Click on "Slides" mode
  await page.click('text=Slides');
  await page.waitForTimeout(1500);

  // Import the JSON
  const json = readFileSync(jsonPath, 'utf8');
  await page.evaluate((jsonStr) => {
    // Access zustand store and import
    const store = window.__ZUSTAND_STORES?.presentationStore;
    if (store) {
      store.getState().importJSON(jsonStr);
    }
  }, json);
  await page.waitForTimeout(1000);

  // Try clicking the Export dropdown and Vektor PDF
  try {
    await page.click('text=Export');
    await page.waitForTimeout(500);

    // Wait for download
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
    await page.click('text=PDF (Vektor)');
    const download = await downloadPromise;
    const outputPath = path.join(OUTDIR, `${outputName}.pdf`);
    await download.saveAs(outputPath);
    console.log(`Saved: ${outputPath}`);
  } catch (e) {
    console.log('Export button approach failed, trying direct PDF print...');
    // Fallback: use page.pdf() for each slide
    // First get slide count
    const slideCount = await page.evaluate(() => {
      return document.querySelectorAll('[data-slide-index]').length || 7;
    });
    console.log(`Slides: ${slideCount}`);
  }

  await browser.close();
}

// Export both
console.log('Exporting Outbound Stack...');
await exportPresentation(
  'C:/Users/frede/Projects/slide-forge/src/data/outbound-stack.json',
  'der-150-outbound-stack'
);

console.log('Exporting CRM Audit...');
await exportPresentation(
  'C:/Users/frede/Projects/slide-forge/src/data/crm-audit.json',
  'dein-crm-luegt'
);

console.log('Done!');
