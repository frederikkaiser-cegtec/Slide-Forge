import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./public/presentation.json', 'utf-8'));

// ═══ V2: Dark premium design — deep navy + lime accent ═══
const BG = '#0f1419';
const SURFACE = '#1a2332';
const CARD = '#1e2a3a';
const TEXT = '#f0f2f5';
const MUTED = '#8899aa';
const ACCENT = '#c7f80f';
const ACCENT2 = '#00d4aa'; // teal secondary

data.id = 'better-energy-v2-dark';
data.title = 'BetterEnergy — Dark Premium';

for (const slide of data.slides) {
  slide.background = BG;

  for (const el of slide.elements) {
    const id = el.id;
    const s = el.style;
    if (!s) continue;

    // ── Shape colors ──
    if (el.type === 'shape') {
      // Top bar — keep lime
      if (id.endsWith('-topbar')) { s.backgroundColor = ACCENT; continue; }
      // Sidebar accent
      if (id.endsWith('-sidebar-accent')) { s.backgroundColor = ACCENT; s.opacity = 0.15; continue; }
      // Deco circles
      if (id.endsWith('-deco-circle-tr')) { s.backgroundColor = ACCENT; s.opacity = 0.05; continue; }
      if (id.endsWith('-deco-circle-bl')) { s.backgroundColor = ACCENT2; s.opacity = 0.04; continue; }
      // Title accent lines
      if (id.endsWith('-title-accent')) { s.backgroundColor = ACCENT; continue; }
      // Footer line
      if (id.endsWith('-footer-line')) { s.backgroundColor = '#2a3a4a'; continue; }
      // Card/box backgrounds (catch all light card variants)
      if (['#f5f7f2', '#f3f4f3', '#eef1ea'].includes(s.backgroundColor)) {
        s.backgroundColor = CARD;
      }
      // Accent bars on cards
      if (id.includes('-accent') && !id.endsWith('-title-accent') && !id.endsWith('-sidebar-accent')) {
        s.backgroundColor = ACCENT;
      }
      // Decorative lines
      if (id.endsWith('-line') && !id.endsWith('-footer-line')) {
        s.backgroundColor = ACCENT;
      }
    }

    // ── Text colors ──
    if (el.type === 'text') {
      // Footer
      if (id.includes('-footer-')) { s.color = '#4a5a6a'; continue; }

      // Category labels
      if (id.endsWith('-label')) { s.color = ACCENT; continue; }

      // Titles
      if (id.match(/^s\d+-title$/)) { s.color = TEXT; continue; }

      // Subtitles
      if (id.endsWith('-sub')) { s.color = MUTED; continue; }

      // Body/descriptions — all gray tones → light muted
      if (['#6b7280', '#9ca3af', '#374151', '#4b5563'].includes(s.color)) {
        s.color = MUTED;
      }

      // Dark text → light (catch all dark tones)
      if (s.color === '#1a1a1a' || s.color === '#111827' || s.color === '#1f2937') { s.color = TEXT; }

      // Green accent text (both old and new values)
      if (s.color === '#5a8a00' || s.color === '#3d6b00') { s.color = ACCENT; }

      // Fix inline styles in HTML content
      if (el.content) {
        el.content = el.content
          .replace(/color:\s*#1a1a1a/g, `color: ${TEXT}`)
          .replace(/color:\s*#374151/g, `color: ${MUTED}`)
          .replace(/color:\s*#4b5563/g, `color: ${MUTED}`)
          .replace(/color:\s*#5a8a00/g, `color: ${ACCENT}`)
          .replace(/color:\s*#3d6b00/g, `color: ${ACCENT}`)
          .replace(/color:\s*#6b7280/g, `color: ${MUTED}`);
      }

      // Brand/pills text
      if (id === 's01-brand') { s.color = '#4a5a6a'; }
      if (id === 's01-pills') { s.color = ACCENT; }
    }

    // ── Images — slightly brighter on dark ──
    if (el.type === 'image') {
      // Background images — slightly more visible on dark
      if (s.opacity && s.opacity < 0.15) {
        s.opacity = Math.min(s.opacity * 1.5, 0.15);
      }
    }
  }
}

// Special: s14 contact box
const s14contact = data.slides.find(s => s.id === 's14')?.elements.find(e => e.id === 's14-contact');
if (s14contact) {
  s14contact.content = s14contact.content
    .replace(/color:\s*#1a1a1a/g, `color: ${TEXT}`)
    .replace(/color:\s*#374151/g, `color: ${MUTED}`)
    .replace(/color:\s*#5a8a00/g, `color: ${ACCENT}`)
    .replace(/color:\s*#3d6b00/g, `color: ${ACCENT}`);
}

// Catch-all: any remaining dark text that wasn't caught above
for (const slide of data.slides) {
  for (const el of slide.elements) {
    if (el.type === 'text' && el.style) {
      const c = el.style.color;
      // Any very dark color that would be invisible on dark bg
      if (c && c.startsWith('#') && !['#f0f2f5','#c7f80f','#00d4aa','#8899aa','#4a5a6a','#3a4a5a','#2a3a4a'].includes(c)) {
        const r = parseInt(c.slice(1,3),16);
        const g = parseInt(c.slice(3,5),16);
        const b = parseInt(c.slice(5,7),16);
        const lum = (r*0.299 + g*0.587 + b*0.114);
        if (lum < 100) {
          // Too dark for dark bg — make it light
          el.style.color = TEXT;
        }
      }
    }
  }
}

// s14 legal
const s14legal = data.slides.find(s => s.id === 's14')?.elements.find(e => e.id === 's14-legal');
if (s14legal) { s14legal.style.color = '#5a6a7a'; }

data.updatedAt = Date.now();
fs.writeFileSync('./public/presentation-v2.json', JSON.stringify(data, null, 2));
console.log('V2 dark premium design created → localhost:5173?v=2');
