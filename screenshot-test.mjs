import { chromium } from 'playwright';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('C:/Users/frede/Projects/slide-forge');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  // Navigate to the app
  await page.goto('http://localhost:5182/Slide-Forge/', { waitUntil: 'networkidle' });
  console.log('Page loaded');

  // Click "Case Study" button in sidebar
  const caseStudyBtn = page.getByRole('button', { name: /Case Study/i });
  if (await caseStudyBtn.count() === 0) {
    // Try finding by text
    const allButtons = await page.locator('button').allTextContents();
    console.log('Available buttons:', allButtons.join(' | '));
  }
  await caseStudyBtn.click();
  console.log('Clicked Case Study');
  await page.waitForTimeout(1000);

  // Scroll down in the sidebar to show color pickers (Farben)
  const sidebar = page.locator('.sidebar, [class*="sidebar"], nav, aside').first();
  // Try to find the Farben section and scroll to it
  const farbenText = page.getByText('Farben');
  if (await farbenText.count() > 0) {
    await farbenText.scrollIntoViewIfNeeded();
    console.log('Scrolled to Farben section');
  } else {
    // Fallback: scroll the sidebar area
    await sidebar.evaluate(el => el.scrollTop = el.scrollHeight);
    console.log('Scrolled sidebar to bottom');
  }
  await page.waitForTimeout(500);

  // Take first screenshot
  const screenshot1 = path.join(SCREENSHOT_DIR, 'screenshot-case-study.png');
  await page.screenshot({ path: screenshot1, fullPage: false });
  console.log('Screenshot 1 saved:', screenshot1);

  // Click "Infografik" button
  const infografikBtn = page.getByRole('button', { name: /Infografik/i });
  if (await infografikBtn.count() === 0) {
    const allButtons = await page.locator('button').allTextContents();
    console.log('Available buttons:', allButtons.join(' | '));
  }
  await infografikBtn.click();
  console.log('Clicked Infografik');
  await page.waitForTimeout(1000);

  // Take second screenshot
  const screenshot2 = path.join(SCREENSHOT_DIR, 'screenshot-infografik.png');
  await page.screenshot({ path: screenshot2, fullPage: false });
  console.log('Screenshot 2 saved:', screenshot2);

  await browser.close();
  console.log('Done!');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
