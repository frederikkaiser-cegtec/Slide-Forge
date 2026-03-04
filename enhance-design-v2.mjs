import fs from 'fs';

const FILE = './public/presentation.json';
const data = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

const ACCENT = '#c7f80f';
const ACCENT_DARK = '#5a8a00';

// ── Fix 1: Remove misplaced title-accent lines & add correct ones ──
// The v1 script matched <h1> inside metric cards. Fix: remove all title-accents, re-add correctly.
for (const slide of data.slides) {
  slide.elements = slide.elements.filter(e => !e.id.endsWith('-title-accent'));
}

// Add accent lines under the actual slide titles (the -title element with <h1> or <h2>)
for (const slide of data.slides) {
  const sid = slide.id;
  if (sid === 's01' || sid === 's14') continue; // skip title/closing

  const titleEl = slide.elements.find(e => e.id === `${sid}-title`);
  if (!titleEl) continue;

  const accentY = titleEl.y + titleEl.height + 0.5;
  const titleIdx = slide.elements.indexOf(titleEl);
  slide.elements.splice(titleIdx + 1, 0, {
    id: `${sid}-title-accent`,
    type: 'shape',
    x: titleEl.x, y: accentY, width: 8, height: 0.5,
    rotation: 0, content: '',
    style: { backgroundColor: ACCENT },
  });
}

// ── Fix 2: Increase deco circle opacity from 3% to 6% ──
for (const slide of data.slides) {
  for (const el of slide.elements) {
    if (el.id.endsWith('-deco-circle-tr') || el.id.endsWith('-deco-circle-bl')) {
      el.style.opacity = 0.06;
    }
  }
}

// ── Fix 3: s06 (Rahmenbedingungen) — Convert text wall into visual cards ──
{
  const s06 = data.slides.find(s => s.id === 's06');
  // Remove old body text
  s06.elements = s06.elements.filter(e => e.id !== 's06-body' && e.id !== 's06-sub');

  const items = [
    { key: 'duration', label: 'Laufzeit', text: '20 Jahre mit Option auf Verlängerung um weitere 10 Jahre. Langfristige Planungssicherheit für beide Vertragspartner.', icon: '20+' },
    { key: 'grundbuch', label: 'Grundbucheintrag', text: 'Dingliche Dienstbarkeit, bezieht sich ausschließlich auf die Dachfläche.', icon: 'GB' },
    { key: 'kosten', label: 'Kosten & Zugang', text: 'Better Energy trägt alle Notar- und Grundbuchkosten. Zutrittsrecht für Montage und Wartung nach Absprache.', icon: '0 €' },
    { key: 'ende', label: 'Vertragsende', text: 'Kostenfreier Rückbau der Anlage und Wiederherstellung des ursprünglichen Dachzustands.', icon: '↺' },
    { key: 'eigentum', label: 'Eigentum', text: 'Sie behalten das volle Eigentum an der Immobilie. Nur die Dachnutzung wird geregelt.', icon: '✓' },
  ];

  // Find where to insert (after title-accent)
  const insertIdx = s06.elements.findIndex(e => e.id === 's06-title-accent') + 1;

  items.forEach((item, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 4 + col * 31.5;
    const y = 28 + row * 33;
    const w = 29;
    const h = 30;

    s06.elements.splice(insertIdx + i * 3, 0,
      {
        id: `s06-card-${item.key}`,
        type: 'shape',
        x, y, width: w, height: h,
        rotation: 0, content: '',
        style: { backgroundColor: '#f5f7f2', borderRadius: 12 },
      },
      {
        id: `s06-card-${item.key}-badge`,
        type: 'text',
        x: x + 2, y: y + 3, width: 8, height: 6,
        rotation: 0,
        content: `<p><strong>${item.icon}</strong></p>`,
        style: { fontSize: 22, fontWeight: 800, color: ACCENT_DARK, textAlign: 'center' },
      },
      {
        id: `s06-card-${item.key}-text`,
        type: 'text',
        x: x + 2, y: y + 10, width: w - 4, height: h - 13,
        rotation: 0,
        content: `<p><strong style="color: #1a1a1a">${item.label}</strong></p><p>${item.text}</p>`,
        style: { fontSize: 15, color: '#6b7280' },
      }
    );
  });
}

// ── Fix 4: s07 (Vorteile) — Add card backgrounds behind each benefit ──
{
  const s07 = data.slides.find(s => s.id === 's07');
  // Remove old text columns
  s07.elements = s07.elements.filter(e => e.id !== 's07-col1' && e.id !== 's07-col2');

  const benefits = [
    { key: 'invest', icon: '0€', label: 'Null Investitionsrisiko', text: 'Better Energy trägt sämtliche Kosten für Planung, Bau, Betrieb und Wartung.' },
    { key: 'income', icon: '€€', label: 'Sichere Einnahmen', text: 'Planbare Pachteinnahmen über 20 Jahre oder hochwertige Dachsanierung.' },
    { key: 'value', icon: '↑', label: 'Wertsteigerung', text: 'Eine moderne PV-Anlage erhöht den Marktwert Ihrer Immobilie erheblich.' },
    { key: 'cost', icon: '✓', label: 'Keine Betriebskosten', text: 'Wartung, Reparaturen und Versicherungen übernimmt Better Energy vollständig.' },
    { key: 'sustain', icon: 'CO₂', label: 'Nachhaltigkeit', text: 'Verbesserung der CO₂-Bilanz und aktiver Beitrag zur Energiewende.' },
    { key: 'service', icon: '24/7', label: 'Rundum-Sorglos', text: 'Übernahme von Genehmigungen, Statik und langfristiger Betreuung.' },
  ];

  const insertIdx = s07.elements.findIndex(e => e.id === 's07-title-accent') + 1;

  benefits.forEach((b, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 4 + col * 31.5;
    const y = 28 + row * 33;
    const w = 29;
    const h = 30;

    s07.elements.splice(insertIdx + i * 3, 0,
      {
        id: `s07-card-${b.key}`,
        type: 'shape',
        x, y, width: w, height: h,
        rotation: 0, content: '',
        style: { backgroundColor: '#f5f7f2', borderRadius: 12 },
      },
      {
        id: `s07-card-${b.key}-icon`,
        type: 'text',
        x: x + 2, y: y + 3, width: w - 4, height: 7,
        rotation: 0,
        content: `<p><strong>${b.icon}</strong></p>`,
        style: { fontSize: 24, fontWeight: 800, color: ACCENT_DARK },
      },
      {
        id: `s07-card-${b.key}-text`,
        type: 'text',
        x: x + 2, y: y + 11, width: w - 4, height: h - 14,
        rotation: 0,
        content: `<p><strong style="color: #1a1a1a">${b.label}</strong></p><p>${b.text}</p>`,
        style: { fontSize: 15, color: '#6b7280' },
      }
    );
  });
}

// ── Fix 5: s11 (Referenzkunden) — Add card backgrounds per customer ──
{
  const s11 = data.slides.find(s => s.id === 's11');
  s11.elements = s11.elements.filter(e => e.id !== 's11-col1' && e.id !== 's11-col2');

  const customers = [
    { key: 'vonovia', name: 'Vonovia', desc: 'Deutschlands größter Wohnungskonzern' },
    { key: 'dqs', name: 'DQS', desc: 'TÜV-Zertifizierungsunternehmen, Frankfurt' },
    { key: 'bag', name: 'BAG Bauartikel', desc: 'Baustoffhersteller aus Sprendlingen' },
    { key: 'radeberger', name: 'Radeberger Gruppe', desc: 'Logistik- und Produktionsunternehmen' },
    { key: 'bender', name: 'Bender-Gruppe', desc: 'Industrieunternehmen aus Grünberg' },
    { key: 'gewo', name: 'GEWO-Bau', desc: 'Bauunternehmen und Projektentwickler' },
  ];

  const insertIdx = s11.elements.findIndex(e => e.id === 's11-sub') + 1;

  customers.forEach((c, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 4 + col * 31.5;
    const y = 40 + row * 26;
    const w = 29;
    const h = 23;

    s11.elements.splice(insertIdx + i * 2, 0,
      {
        id: `s11-card-${c.key}`,
        type: 'shape',
        x, y, width: w, height: h,
        rotation: 0, content: '',
        style: { backgroundColor: '#f5f7f2', borderRadius: 12 },
      },
      {
        id: `s11-card-${c.key}-text`,
        type: 'text',
        x: x + 3, y: y + 4, width: w - 6, height: h - 6,
        rotation: 0,
        content: `<p><strong style="color: #1a1a1a; font-size: 1.1em">${c.name}</strong></p><p>${c.desc}</p>`,
        style: { fontSize: 16, color: '#6b7280' },
      }
    );
  });
}

// ── Fix 6: s12 (Alles aus einer Hand) — Add card backgrounds ──
{
  const s12 = data.slides.find(s => s.id === 's12');
  s12.elements = s12.elements.filter(e => e.id !== 's12-col1' && e.id !== 's12-col2');

  const services = [
    { key: 'plan', icon: '📐', label: 'Individuelle Planung', text: 'Maßgeschneiderte Konzepte für Ihre Dachgegebenheiten.' },
    { key: 'permit', icon: '📋', label: 'Bauanträge & Genehmigungen', text: 'Alle Anträge und behördliche Genehmigungen.' },
    { key: 'statik', icon: '🔧', label: 'Statikprüfungen', text: 'Statische Berechnung und Prüfung durch Fachingenieure.' },
    { key: 'elektro', icon: '⚡', label: 'Elektroinstallation', text: 'Zertifizierte Elektromeister mit 10+ Jahren Erfahrung.' },
    { key: 'dach', icon: '🏗️', label: 'Dachmontage', text: 'Durchgeführt von erfahrenen Dachdeckern.' },
    { key: 'foerder', icon: '💰', label: 'Förderungen', text: 'Begleitung bei KfW-Förderungen und Zuschüssen.' },
  ];

  const insertIdx = s12.elements.findIndex(e => e.id === 's12-title-accent') + 1;

  services.forEach((s, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 4 + col * 31.5;
    const y = 28 + row * 33;
    const w = 29;
    const h = 30;

    s12.elements.splice(insertIdx + i * 2, 0,
      {
        id: `s12-card-${s.key}`,
        type: 'shape',
        x, y, width: w, height: h,
        rotation: 0, content: '',
        style: { backgroundColor: '#f5f7f2', borderRadius: 12 },
      },
      {
        id: `s12-card-${s.key}-text`,
        type: 'text',
        x: x + 3, y: y + 4, width: w - 6, height: h - 6,
        rotation: 0,
        content: `<p style="font-size: 1.6em">${s.icon}</p><p><strong style="color: #1a1a1a">${s.label}</strong></p><p>${s.text}</p>`,
        style: { fontSize: 15, color: '#6b7280' },
      }
    );
  });
}

// ── Fix 7: s08 (Absicherung) — Add colored left border accents to insurance cards ──
{
  const s08 = data.slides.find(s => s.id === 's08');
  const cardBoxes = ['s08-b1', 's08-b2', 's08-b3', 's08-b4'];
  for (const boxId of cardBoxes) {
    const box = s08.elements.find(e => e.id === boxId);
    if (!box) continue;
    // Add a left accent bar inside each card
    const barId = `${boxId}-accent`;
    if (!s08.elements.find(e => e.id === barId)) {
      const idx = s08.elements.indexOf(box) + 1;
      s08.elements.splice(idx, 0, {
        id: barId,
        type: 'shape',
        x: box.x, y: box.y + 2, width: 0.5, height: box.height - 4,
        rotation: 0, content: '',
        style: { backgroundColor: ACCENT, borderRadius: 4 },
      });
    }
  }
}

// ── Fix 8: s04 (Drei Pachtvarianten) — Add top accent to each variant card ──
{
  const s04 = data.slides.find(s => s.id === 's04');
  const cardBoxes = ['s04-c1-box', 's04-c2-box', 's04-c3-box'];
  for (const boxId of cardBoxes) {
    const box = s04.elements.find(e => e.id === boxId);
    if (!box) continue;
    const barId = `${boxId}-topaccent`;
    if (!s04.elements.find(e => e.id === barId)) {
      const idx = s04.elements.indexOf(box) + 1;
      s04.elements.splice(idx, 0, {
        id: barId,
        type: 'shape',
        x: box.x + 2, y: box.y, width: box.width - 4, height: 0.6,
        rotation: 0, content: '',
        style: { backgroundColor: ACCENT, borderRadius: 4 },
      });
    }
  }
}

data.updatedAt = Date.now();
fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
console.log('v2 enhancements applied successfully!');
console.log('- Fixed title-accent placement on all slides');
console.log('- Increased deco circle opacity (3% -> 6%)');
console.log('- s06: Text wall -> 5 info cards');
console.log('- s07: Text columns -> 6 benefit cards with icons');
console.log('- s08: Added left accent bars to insurance cards');
console.log('- s11: Text lists -> 6 customer cards');
console.log('- s12: Text columns -> 6 service cards with emojis');
console.log('- s04: Added top accent to variant cards');
