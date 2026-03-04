import fs from 'fs';

const FILE = './public/presentation.json';
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

function findEl(slideId, elId) {
  const slide = data.slides.find(s => s.id === slideId);
  return slide?.elements.find(e => e.id === elId);
}

// ═══ s03: Gesamtleistung ist "10+ MW" nicht "5 MWp" ═══
const s03m3 = findEl('s03', 's03-m3-num');
if (s03m3) s03m3.content = '<h1>10+ MW</h1>';

// ═══ s04: Titel aus PDF übernehmen + Untertitel ═══
const s04title = findEl('s04', 's04-title');
if (s04title) s04title.content = '<h2>Drei flexible Pachtvarianten für Ihre Situation</h2>';

// s04 Variante 1: vollständigere Beschreibung
const s04c1desc = findEl('s04', 's04-c1-desc');
if (s04c1desc) s04c1desc.content = '<p>Bei intakten Dächern zahlen wir Ihnen zwischen 2,50 € und 4,00 € pro Quadratmeter und Jahr. Die genaue Höhe richtet sich nach Dachzustand, Ausrichtung und statischen Gegebenheiten.</p>';

// s04 Variante 2: vollständigere Beschreibung
const s04c2desc = findEl('s04', 's04-c2-desc');
if (s04c2desc) s04c2desc.content = '<p>Ist Ihr Dach sanierungsbedürftig oder asbesthaltig? Wir übernehmen die vollständige Dachsanierung inklusive fachgerechter Asbestentsorgung und kompletter Neueindeckung.</p>';

// s04 Variante 3: vollständigere Beschreibung
const s04c3desc = findEl('s04', 's04-c3-desc');
if (s04c3desc) s04c3desc.content = '<p>Einmalige Zahlung zwischen 185 € und 220 € pro installiertem Kilowattpeak. Sofortige Liquidität statt laufender Zahlungen – ideal für Investitionsprojekte.</p>';

// ═══ s07: Titel aus PDF ═══
const s07title = findEl('s07', 's07-title');
if (s07title) s07title.content = '<h2>Ihre Vorteile auf einen Blick</h2>';

// ═══ s08: "umfassende" fehlt im Titel ═══
const s08title = findEl('s08', 's08-title');
if (s08title) s08title.content = '<h2>Vollständige Absicherung durch umfassende Versicherungen</h2>';

// ═══ s10: "1.138,9 m²" statt "1.139" ═══
const s10m2n = findEl('s10', 's10-m2n');
if (s10m2n) s10m2n.content = '<h2>1.138,9</h2>';

// s10: "23,08%" statt "23%"
const s10m6n = findEl('s10', 's10-m6n');
if (s10m6n) s10m6n.content = '<h2>23,08%</h2>';

// s10: "Eigenverbrauch in Produktion"
const s10m4u = findEl('s10', 's10-m4u');
if (s10m4u) s10m4u.content = '<p>Eigenverbrauch in Produktion</p>';

// s10: "Amortisationsdauer" statt "Amortisation"
const s10m5u = findEl('s10', 's10-m5u');
if (s10m5u) s10m5u.content = '<p>Amortisations-dauer</p>';

// s10: "Gesamtkapitalrendite" statt "Rendite"
const s10m6u = findEl('s10', 's10-m6u');
if (s10m6u) s10m6u.content = '<p>Gesamtkapital-rendite</p>';

// ═══ s11: "Green Monkey Energy" fehlt als 7. Kunde ═══
{
  const s11 = data.slides.find(s => s.id === 's11');
  // Add Green Monkey Energy card
  const footerIdx = s11.elements.findIndex(e => e.id === 's11-footer-line');
  s11.elements.splice(footerIdx, 0,
    {
      id: 's11-card-greenmonkey',
      type: 'shape',
      x: 4, y: 72, width: 29, height: 16,
      rotation: 0, content: '',
      style: { backgroundColor: '#f5f7f2', borderRadius: 12 },
    },
    {
      id: 's11-card-greenmonkey-text',
      type: 'text',
      x: 7, y: 74, width: 23, height: 12,
      rotation: 0,
      content: '<p><strong style="color: #1a1a1a; font-size: 1.1em">Green Monkey Energy</strong></p><p>Energiepartner und Elektro-Fachplaner</p>',
      style: { fontSize: 24, color: '#6b7280' },
    }
  );

  // Also add the tagline from PDF
  s11.elements.splice(footerIdx + 2, 0, {
    id: 's11-tagline',
    type: 'text',
    x: 35, y: 76, width: 56, height: 6,
    rotation: 0,
    content: '<p><strong style="color: #5a8a00">Ihre Sicherheit:</strong> Bewährte Kompetenz und langjährige Partnerschaften</p>',
    style: { fontSize: 22, color: '#6b7280' },
  });
}

// ═══ s12: Titel aus PDF ═══
const s12title = findEl('s12', 's12-title');
if (s12title) s12title.content = '<h2>Alles aus einer Hand – Ihr Komfort</h2>';

// s12: Dachmontage vollständiger
// find it in the cards
{
  const s12 = data.slides.find(s => s.id === 's12');
  const dachCard = s12.elements.find(e => e.id === 's12-card-dach-text');
  if (dachCard) {
    dachCard.content = '<p style="font-size: 1.6em">🏗️</p><p><strong style="color: #1a1a1a">Dachmontage</strong></p><p>Professionelle Montage durch erfahrene Dachdecker – sicher und qualitätsgeprüft.</p>';
  }
  // Add tagline from PDF
  const footerIdx = s12.elements.findIndex(e => e.id === 's12-footer-line');
  s12.elements.splice(footerIdx, 0, {
    id: 's12-tagline',
    type: 'text',
    x: 8, y: 87, width: 84, height: 5,
    rotation: 0,
    content: '<p><strong style="color: #5a8a00">Ihr Vorteil:</strong> Ein Ansprechpartner von der ersten Beratung bis zur Inbetriebnahme und darüber hinaus</p>',
    style: { fontSize: 22, color: '#6b7280' },
  });
}

// ═══ s13: Titel aus PDF + Step 4 vollständiger ═══
const s13title = findEl('s13', 's13-title');
if (s13title) s13title.content = '<h2>Der Weg zu Ihrer Dachpacht in vier Schritten</h2>';

const s13s4t = findEl('s13', 's13-s4-t');
if (s13s4t) s13s4t.content = '<p><strong style="color: #1a1a1a">Inbetriebnahme und langfristige Betreuung</strong></p><p><br></p><p>Nach Funktionsprüfung und Netzanmeldung läuft die Anlage – wir übernehmen Wartung, Monitoring und Service für die gesamte Laufzeit.</p>';

// ═══ s14: "Kostenloser Beratungstermin" Label + Legal Info fehlt ═══
{
  const s14 = data.slides.find(s => s.id === 's14');

  // Add "Kostenloser Beratungstermin" badge above CTA text
  const subEl = s14.elements.find(e => e.id === 's14-sub');
  if (subEl) {
    subEl.content = '<p>Nutzen Sie das Potenzial Ihrer Dachfläche und profitieren Sie von sicheren Einnahmen, Wertsteigerung und einem Beitrag zur nachhaltigen Energiezukunft.</p>';
  }

  // Update contact box to include CTA + legal
  const contactEl = s14.elements.find(e => e.id === 's14-contact');
  if (contactEl) {
    contactEl.content = '<p><strong style="color: #5a8a00; font-size: 1.1em">Kostenloser Beratungstermin</strong></p><p>Vereinbaren Sie jetzt Ihre unverbindliche Erstberatung!</p><p><br></p><p><strong style="color: #1a1a1a">Better Energy GmbH</strong></p><p>Bahnhofstraße 2, 55218 Ingelheim am Rhein</p><p style="color: #5a8a00">info@better-energy-solar.de</p><p style="color: #5a8a00">www.better-energy-solar.de</p>';
  }

  // Add legal footer
  s14.elements.push({
    id: 's14-legal',
    type: 'text',
    x: 8, y: 94, width: 84, height: 4,
    rotation: 0,
    content: '<p>Better Energy GmbH | Amtsgericht Mainz | HR-Nr.: B 51475 | USt-ID: DE355478729 | Geschäftsführung: Eric Matuszak</p>',
    style: { fontSize: 12, color: '#9ca3af', textAlign: 'center' },
  });
}

data.updatedAt = Date.now();
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

console.log('Content fixes applied:');
console.log('- s03: "5 MWp" → "10+ MW" Gesamtleistung');
console.log('- s04: Titel, Beschreibungen vollständiger aus PDF');
console.log('- s07: Titel aus PDF');
console.log('- s08: "umfassende" im Titel ergänzt');
console.log('- s10: Exakte Zahlen (1.138,9 m², 23,08%, etc.)');
console.log('- s11: Green Monkey Energy als 7. Kunde hinzugefügt + Tagline');
console.log('- s12: Titel aus PDF, Dachmontage vollständiger, Tagline');
console.log('- s13: Titel aus PDF, Schritt 4 vollständiger');
console.log('- s14: "Kostenloser Beratungstermin" + Legal Footer');
