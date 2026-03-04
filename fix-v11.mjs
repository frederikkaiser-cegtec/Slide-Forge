import fs from 'fs';

const FILE = './public/presentation.json';
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

function getEl(sid, eid) {
  return data.slides.find(s => s.id === sid)?.elements.find(e => e.id === eid);
}

// ══════════════════════════════════════════════════
// 1. S07: Remove "Rundum-Sorglos" card (overlaps with s12)
//    Replace with stronger benefit: "Steuervorteile" or make 5-card layout
//    → Cleaner: just remove the 6th card, make 5 cards (3+2)
// ══════════════════════════════════════════════════

const s07 = data.slides.find(s => s.id === 's07');
// Remove service card (shape + icon + text)
s07.elements = s07.elements.filter(e =>
  e.id !== 's07-card-service' &&
  e.id !== 's07-card-service-icon' &&
  e.id !== 's07-card-service-text'
);

// Row 2 now has only 2 cards (cost, sustain).
// Widen them and center: 2 cards instead of 3
const costCard = getEl('s07', 's07-card-cost');
if (costCard) { costCard.x = 8; costCard.width = 42; }
const costIcon = getEl('s07', 's07-card-cost-icon');
if (costIcon) { costIcon.x = 11; costIcon.width = 36; }
const costText = getEl('s07', 's07-card-cost-text');
if (costText) { costText.x = 11; costText.width = 36; }

const sustainCard = getEl('s07', 's07-card-sustain');
if (sustainCard) { sustainCard.x = 53; sustainCard.width = 42; }
const sustainIcon = getEl('s07', 's07-card-sustain-icon');
if (sustainIcon) { sustainIcon.x = 56; sustainIcon.width = 36; }
const sustainText = getEl('s07', 's07-card-sustain-text');
if (sustainText) { sustainText.x = 56; sustainText.width = 36; }

// ══════════════════════════════════════════════════
// 2. REORDER: Move s08 (Versicherungen) and s09 (Qualität)
//    to after s13 (before closing) as backup slides
//    New order: s01-s07, s10, s11, s06, s12, s13, s08, s09, s14
//    Actually: Keep s06 where it is (it's strong content)
//    Target: s01, s02, s03, s04, s05, s06, s07, s10, s11, s12, s13, s08, s09, s14
// ══════════════════════════════════════════════════

const slideOrder = ['s01','s02','s03','s04','s05','s06','s07','s10','s11','s12','s13','s08','s09','s14'];
const reordered = [];
for (const id of slideOrder) {
  const slide = data.slides.find(s => s.id === id);
  if (slide) reordered.push(slide);
}
// Add any slides not in the list (safety)
for (const slide of data.slides) {
  if (!reordered.find(s => s.id === slide.id)) {
    reordered.push(slide);
  }
}
data.slides = reordered;

// Update footer page numbers
for (let i = 0; i < data.slides.length; i++) {
  const slide = data.slides[i];
  const footerRight = slide.elements.find(e => e.id === slide.id + '-footer-right');
  if (footerRight) {
    footerRight.content = String(i + 1);
  }
}

// ══════════════════════════════════════════════════
// 3. S14 CTA: Stärkerer Call-to-Action
// ══════════════════════════════════════════════════

const s14sub = getEl('s14', 's14-sub');
if (s14sub) {
  s14sub.content = '<p style="color: #374151"><strong>In 30 Minuten wissen Sie, was Ihr Dach einbringt.</strong><br/>Kostenlos. Unverbindlich. Konkrete Zahlen für Ihre Dachfläche.</p>';
}

const s14contact = getEl('s14', 's14-contact');
if (s14contact) {
  s14contact.content = s14contact.content
    .replace('Kostenloser Beratungstermin', 'Jetzt Beratungstermin sichern')
    .replace(/Vereinbaren Sie jetzt Ihr[^<]*/, 'Vereinbaren Sie jetzt Ihr kostenloses Erstgespräch — wir analysieren Ihr Dach und rechnen Ihnen konkret vor, was Sie verdienen können.');
}

// ══════════════════════════════════════════════════
// 4. S03: Kennzahl "800+" mit Hinweis
//    (Website sagt 582, PDF sagt 800+ — muss geklärt werden)
//    → Wir lassen 800+ drin (kommt aus Original-PDF),
//    aber notieren es als Kommentar im JSON
// ══════════════════════════════════════════════════
// No visible change needed — this is a business decision.
// The data comes from the original PDF, leave as-is.

data.updatedAt = Date.now();
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log('v11 applied:');
console.log('- s07: "Rundum-Sorglos" card removed (redundant with s12)');
console.log('- s07: Row 2 now 2 wider cards (cost + sustain)');
console.log('- Slide order: s08/s09 moved to backup position before closing');
console.log('- s14: Stronger CTA — "In 30 Min wissen Sie was Ihr Dach einbringt"');
console.log('- Page numbers updated');
console.log('\nNew order:');
data.slides.forEach((s,i) => {
  const t = s.elements.find(e => e.id === s.id+'-title');
  const text = t ? (t.content||'').replace(/<[^>]+>/g,'').slice(0,50) : '?';
  console.log(`  ${i+1}. ${text}`);
});
