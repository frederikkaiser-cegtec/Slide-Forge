import fs from 'fs';

const FILE = './public/presentation.json';
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

// Aggressive font size increases - presentation must be readable from distance
for (const slide of data.slides) {
  for (const el of slide.elements) {
    if (el.type !== 'text' || !el.style || !el.style.fontSize) continue;
    const id = el.id;
    const cur = el.style.fontSize;

    // Footer — leave small (it's fine)
    if (id.includes('-footer-')) continue;

    // Brand line on title slide
    if (id === 's01-brand') { el.style.fontSize = 20; continue; }

    // Category labels ("DAS POTENZIAL", "ÜBER UNS" etc)
    if (id.endsWith('-label')) { el.style.fontSize = Math.max(cur, 18); continue; }

    // Slide titles — big and bold
    if (id.match(/^s\d+-title$/) && cur < 52) { el.style.fontSize = 52; continue; }

    // Title slide special
    if (id === 's01-title') { el.style.fontSize = 68; continue; }
    if (id === 's01-sub') { el.style.fontSize = 32; continue; }
    if (id === 's01-pills') { el.style.fontSize = 28; continue; }

    // Closing slide
    if (id === 's14-title') { el.style.fontSize = 58; continue; }
    if (id === 's14-sub') { el.style.fontSize = 26; continue; }
    if (id === 's14-contact') { el.style.fontSize = 22; continue; }

    // Subtitles
    if (id.endsWith('-sub')) { el.style.fontSize = Math.max(cur, 26); continue; }

    // Main body text
    if (id.endsWith('-body')) { el.style.fontSize = Math.max(cur, 26); continue; }

    // s02 box elements
    if (id === 's02-box-title') { el.style.fontSize = 26; continue; }
    if (id === 's02-box-body') { el.style.fontSize = 22; continue; }
    if (id === 's02-box-list') { el.style.fontSize = 20; continue; }
    if (id === 's02-req') { el.style.fontSize = 20; continue; }

    // s03 metric numbers — already big, make bigger
    if (id.match(/^s03-m\d+-num$/)) { el.style.fontSize = 48; continue; }
    if (id.match(/^s03-m\d+-lbl$/)) { el.style.fontSize = 20; continue; }

    // s04 variant cards
    if (id.match(/^s04-c\d+-num$/)) { el.style.fontSize = 18; continue; } // "VARIANTE 1" label
    if (id.match(/^s04-c\d+-title$/)) { el.style.fontSize = 30; continue; }
    if (id.match(/^s04-c\d+-desc$/)) { el.style.fontSize = 22; continue; }
    if (id.match(/^s04-c\d+-price$/)) { el.style.fontSize = 42; continue; }
    if (id.match(/^s04-c\d+-unit$/)) { el.style.fontSize = 18; continue; }

    // s05 example numbers
    if (id.match(/^s05-b\d+-num$/)) { el.style.fontSize = 46; continue; }
    if (id.match(/^s05-b\d+-label$/)) { el.style.fontSize = 22; continue; }
    if (id.match(/^s05-b\d+-sub$/)) { el.style.fontSize = 24; continue; }
    if (id === 's05-note') { el.style.fontSize = 20; continue; }

    // s06 info cards
    if (id.match(/^s06-card-.*-badge$/)) { el.style.fontSize = 30; continue; }
    if (id.match(/^s06-card-.*-text$/)) { el.style.fontSize = 22; continue; }

    // s07 benefit cards
    if (id.match(/^s07-card-.*-icon$/)) { el.style.fontSize = 30; continue; }
    if (id.match(/^s07-card-.*-text$/)) { el.style.fontSize = 22; continue; }

    // s08 insurance cards
    if (id.match(/^s08-b\d+-t$/)) { el.style.fontSize = 24; continue; }

    // s09 quality cards
    if (id.match(/^s09-c\d+-t$/)) { el.style.fontSize = 24; continue; }

    // s10 reference metrics
    if (id.match(/^s10-m\d+n$/)) { el.style.fontSize = 38; continue; }
    if (id.match(/^s10-m\d+u$/)) { el.style.fontSize = 18; continue; }
    if (id === 's10-foot') { el.style.fontSize = 22; continue; }

    // s11 customer cards
    if (id.match(/^s11-card-.*-text$/)) { el.style.fontSize = 22; continue; }

    // s12 service cards
    if (id.match(/^s12-card-.*-text$/)) { el.style.fontSize = 22; continue; }

    // s13 process steps
    if (id.match(/^s13-s\d+-num$/)) { el.style.fontSize = 52; continue; }
    if (id.match(/^s13-s\d+-t$/)) { el.style.fontSize = 20; continue; }

    // Catch-all: nothing below 20px (except footer/labels)
    if (cur < 20) { el.style.fontSize = 20; }
  }
}

data.updatedAt = Date.now();
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

// Verify
const sizes = [];
for (const slide of data.slides) {
  for (const el of slide.elements) {
    if (el.type === 'text' && el.style && el.style.fontSize) {
      sizes.push({ size: el.style.fontSize, id: el.id });
    }
  }
}
sizes.sort((a,b) => a.size - b.size);
const smallest = sizes.filter(s => !s.id.includes('footer')).slice(0, 10);
console.log('Smallest non-footer text sizes:');
for (const s of smallest) console.log(`  ${s.size}px  ${s.id}`);
console.log(`\nDone! Total text elements: ${sizes.length}`);
