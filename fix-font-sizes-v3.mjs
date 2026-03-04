import fs from 'fs';

const FILE = './public/presentation.json';
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

for (const slide of data.slides) {
  for (const el of slide.elements) {
    if (el.type !== 'text' || !el.style || !el.style.fontSize) continue;
    const id = el.id;
    const cur = el.style.fontSize;

    // Footer — leave as is
    if (id.includes('-footer-')) continue;

    // Title slide
    if (id === 's01-title') { el.style.fontSize = 76; continue; }
    if (id === 's01-sub') { el.style.fontSize = 36; continue; }
    if (id === 's01-pills') { el.style.fontSize = 32; continue; }
    if (id === 's01-brand') { el.style.fontSize = 22; continue; }

    // Closing slide
    if (id === 's14-title') { el.style.fontSize = 64; continue; }
    if (id === 's14-sub') { el.style.fontSize = 30; continue; }
    if (id === 's14-contact') { el.style.fontSize = 24; continue; }

    // Slide titles
    if (id.match(/^s\d+-title$/)) { el.style.fontSize = 56; continue; }

    // Subtitles
    if (id.endsWith('-sub')) { el.style.fontSize = Math.max(cur, 30); continue; }

    // Category labels
    if (id.endsWith('-label')) { el.style.fontSize = Math.max(cur, 20); continue; }

    // Main body text
    if (id.endsWith('-body')) { el.style.fontSize = Math.max(cur, 28); continue; }

    // s02
    if (id === 's02-box-title') { el.style.fontSize = 28; continue; }
    if (id === 's02-box-body') { el.style.fontSize = 24; continue; }
    if (id === 's02-box-list') { el.style.fontSize = 22; continue; }
    if (id === 's02-req') { el.style.fontSize = 22; continue; }

    // s03 metrics
    if (id.match(/^s03-m\d+-num$/)) { el.style.fontSize = 54; continue; }
    if (id.match(/^s03-m\d+-lbl$/)) { el.style.fontSize = 22; continue; }

    // s04 variant cards
    if (id.match(/^s04-c\d+-num$/)) { el.style.fontSize = 20; continue; }
    if (id.match(/^s04-c\d+-title$/)) { el.style.fontSize = 32; continue; }
    if (id.match(/^s04-c\d+-desc$/)) { el.style.fontSize = 24; continue; }
    if (id.match(/^s04-c\d+-price$/)) { el.style.fontSize = 46; continue; }
    if (id.match(/^s04-c\d+-unit$/)) { el.style.fontSize = 20; continue; }

    // s05
    if (id.match(/^s05-b\d+-num$/)) { el.style.fontSize = 50; continue; }
    if (id.match(/^s05-b\d+-label$/)) { el.style.fontSize = 24; continue; }
    if (id.match(/^s05-b\d+-sub$/)) { el.style.fontSize = 26; continue; }
    if (id === 's05-note') { el.style.fontSize = 22; continue; }

    // s06-s07 cards
    if (id.match(/^s0[67]-card-.*-badge$/) || id.match(/^s0[67]-card-.*-icon$/)) { el.style.fontSize = 34; continue; }
    if (id.match(/^s0[67]-card-.*-text$/)) { el.style.fontSize = 24; continue; }

    // s08 insurance
    if (id.match(/^s08-b\d+-t$/)) { el.style.fontSize = 26; continue; }

    // s09 quality
    if (id.match(/^s09-c\d+-t$/)) { el.style.fontSize = 26; continue; }

    // s10 metrics
    if (id.match(/^s10-m\d+n$/)) { el.style.fontSize = 42; continue; }
    if (id.match(/^s10-m\d+u$/)) { el.style.fontSize = 20; continue; }
    if (id === 's10-foot') { el.style.fontSize = 24; continue; }

    // s11 customer cards
    if (id.match(/^s11-card-.*-text$/)) { el.style.fontSize = 24; continue; }

    // s12 service cards
    if (id.match(/^s12-card-.*-text$/)) { el.style.fontSize = 24; continue; }

    // s13 steps
    if (id.match(/^s13-s\d+-num$/)) { el.style.fontSize = 56; continue; }
    if (id.match(/^s13-s\d+-t$/)) { el.style.fontSize = 22; continue; }

    // Catch-all
    if (cur < 22) { el.style.fontSize = 22; }
  }
}

// Also make placeholder images more visible with colored backgrounds and bigger text
for (const slide of data.slides) {
  for (const el of slide.elements) {
    if (el.type === 'image' && el.content && el.content.includes('placehold.co')) {
      // Make placeholders more visible — higher opacity, green border
      el.style.opacity = Math.max(el.style.opacity || 0, 0.4);
      el.style.borderRadius = el.style.borderRadius || 12;
      // Update URL to have bigger text and more contrast
      el.content = el.content
        .replace(/e8f5e9/g, 'd4edda')
        .replace(/5a8a00/g, '2d5a00');
    }
  }
}

data.updatedAt = Date.now();
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log('v3 font sizes applied + placeholders made more visible');
