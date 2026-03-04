import fs from 'fs';

const FILE = './public/presentation.json';
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

// Minimum font sizes by role
const MIN_SIZES = {
  title: 48,      // Slide titles (h1/h2) — must be huge
  subtitle: 24,   // Subtitles under titles
  body: 22,       // Main body text, descriptions
  card_title: 24, // Card headings
  card_body: 18,  // Card body text
  label: 16,      // Category labels (e.g. "DAS POTENZIAL")
  footer: 12,     // Footer text
  metric: 36,     // Big numbers in metric cards
  note: 16,       // Small notes/disclaimers
};

for (const slide of data.slides) {
  for (const el of slide.elements) {
    if (el.type !== 'text' || !el.style) continue;
    const id = el.id;
    const fs_val = el.style.fontSize;
    if (!fs_val) continue;

    // Skip footer elements
    if (id.endsWith('-footer-left') || id.endsWith('-footer-right')) {
      el.style.fontSize = Math.max(fs_val, MIN_SIZES.footer);
      continue;
    }

    // Category labels (uppercase labels like "DAS POTENZIAL")
    if (id.endsWith('-label')) {
      el.style.fontSize = Math.max(fs_val, MIN_SIZES.label);
      continue;
    }

    // Slide titles
    if (id.endsWith('-title') && !id.includes('-card-') && !id.includes('-box-') && !id.includes('-c1-') && !id.includes('-c2-') && !id.includes('-c3-')) {
      el.style.fontSize = Math.max(fs_val, MIN_SIZES.title);
      continue;
    }

    // Subtitles
    if (id.endsWith('-sub')) {
      el.style.fontSize = Math.max(fs_val, MIN_SIZES.subtitle);
      continue;
    }

    // Metric numbers (big numbers in cards)
    if (id.endsWith('-num') || id.match(/-m\d+n$/) || id.match(/-m\d+-num$/)) {
      el.style.fontSize = Math.max(fs_val, MIN_SIZES.metric);
      continue;
    }

    // Card text elements
    if (id.includes('-card-') && id.endsWith('-text')) {
      el.style.fontSize = Math.max(fs_val, MIN_SIZES.card_body);
      continue;
    }

    // Card icons/badges
    if (id.includes('-card-') && (id.endsWith('-icon') || id.endsWith('-badge'))) {
      el.style.fontSize = Math.max(fs_val, 26);
      continue;
    }

    // Body text, descriptions, columns
    if (id.endsWith('-body') || id.endsWith('-col1') || id.endsWith('-col2') || id.endsWith('-desc') || id.match(/-b\d+-t$/) || id.match(/-c\d+-t$/) || id.match(/-s\d+-t$/)) {
      el.style.fontSize = Math.max(fs_val, MIN_SIZES.body);
      continue;
    }

    // Notes and requirements
    if (id.endsWith('-note') || id.endsWith('-req')) {
      el.style.fontSize = Math.max(fs_val, MIN_SIZES.note);
      continue;
    }

    // Anything else below 16px gets bumped
    if (fs_val < 16) {
      el.style.fontSize = 16;
    }
  }
}

// Specific fixes for known small elements
const specificFixes = [
  // s03 metric labels
  { pattern: /s03-m\d+-lbl/, size: 18 },
  // s10 metric units
  { pattern: /s10-m\d+u/, size: 16 },
  // s04 variant card titles
  { pattern: /s04-c\d+-title/, size: 28 },
  // s04 variant card descriptions
  { pattern: /s04-c\d+-desc/, size: 18 },
  // s04 variant prices
  { pattern: /s04-c\d+-price/, size: 38 },
  // s04 variant units
  { pattern: /s04-c\d+-unit/, size: 16 },
  // s05 big numbers
  { pattern: /s05-b\d+-num/, size: 42 },
  // s05 sub labels
  { pattern: /s05-b\d+-sub/, size: 20 },
  // s05 labels
  { pattern: /s05-b\d+-label/, size: 18 },
  // s08 card text
  { pattern: /s08-b\d+-t/, size: 19 },
  // s09 card text
  { pattern: /s09-c\d+-t/, size: 20 },
  // s10 metric numbers
  { pattern: /s10-m\d+n/, size: 34 },
  // s13 step text
  { pattern: /s13-s\d+-t/, size: 17 },
  // s13 step numbers
  { pattern: /s13-s\d+-num/, size: 48 },
  // pills on title slide
  { pattern: /s01-pills/, size: 24 },
  // contact info
  { pattern: /s14-contact/, size: 20 },
];

for (const slide of data.slides) {
  for (const el of slide.elements) {
    if (el.type !== 'text' || !el.style) continue;
    for (const fix of specificFixes) {
      if (fix.pattern.test(el.id)) {
        el.style.fontSize = Math.max(el.style.fontSize || 0, fix.size);
        break;
      }
    }
  }
}

data.updatedAt = Date.now();
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log('Font sizes fixed! All text should now be clearly readable at first glance.');
