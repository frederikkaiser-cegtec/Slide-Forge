import { jsPDF } from 'jspdf';
import type { Slide, SlideElement } from '../types';
import type { FormatPreset } from './formats';
import { DM_SANS_400, DM_SANS_500, DM_SANS_600, DM_SANS_700, DM_SANS_800 } from './fontData';

// Each weight as its own font family — jsPDF can't do weight matching
const WEIGHT_FONTS: Record<number, { vfs: string; name: string; data: string }> = {
  400: { vfs: 'dm400.ttf', name: 'DM400', data: DM_SANS_400 },
  500: { vfs: 'dm500.ttf', name: 'DM500', data: DM_SANS_500 },
  600: { vfs: 'dm600.ttf', name: 'DM600', data: DM_SANS_600 },
  700: { vfs: 'dm700.ttf', name: 'DM700', data: DM_SANS_700 },
  800: { vfs: 'dm800.ttf', name: 'DM800', data: DM_SANS_800 },
};

function registerFonts(pdf: jsPDF) {
  for (const { vfs, name, data } of Object.values(WEIGHT_FONTS)) {
    pdf.addFileToVFS(vfs, data);
    pdf.addFont(vfs, name, 'normal');
  }
}

/** Get jsPDF font name for a given CSS fontWeight */
function fontForWeight(w: number): string {
  if (w >= 800) return 'DM800';
  if (w >= 700) return 'DM700';
  if (w >= 600) return 'DM600';
  if (w >= 500) return 'DM500';
  return 'DM400';
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return [0, 0, 0];
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function resolveBackground(bg: string): string {
  if (bg.includes('gradient')) {
    const match = bg.match(/#[0-9a-fA-F]{6}/);
    return match ? match[0] : '#ffffff';
  }
  return bg;
}

/** Parse HTML content into lines of text segments */
function parseContent(html: string, baseWeight: number): { text: string; weight: number }[][] {
  const cleaned = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n')
    .replace(/<\/div>\s*<div[^>]*>/gi, '\n');

  const lines: { text: string; weight: number }[][] = [];

  for (const rawLine of cleaned.split('\n')) {
    const segs: { text: string; weight: number }[] = [];
    const parts = rawLine.split(/(<(?:strong|b|h[12])[^>]*>.*?<\/(?:strong|b|h[12])>)/gi);

    for (const part of parts) {
      const isBold = /^<(?:strong|b|h[12])/i.test(part);
      const text = part
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&bull;/g, '\u2022')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
      if (text) {
        segs.push({ text, weight: isBold ? Math.max(baseWeight, 700) : baseWeight });
      }
    }
    if (segs.length > 0) lines.push(segs);
  }
  return lines;
}

function renderElement(pdf: jsPDF, el: SlideElement, fw: number, fh: number) {
  const x = (el.x / 100) * fw;
  const y = (el.y / 100) * fh;
  const w = (el.width / 100) * fw;
  const h = (el.height / 100) * fh;
  const s = el.style;

  if (el.type === 'shape') {
    const [cr, cg, cb] = hexToRgb(s.backgroundColor || '#333333');
    const opacity = s.opacity ?? 1;
    const r = Math.min(s.borderRadius || 0, Math.min(w, h) / 2);

    pdf.saveGraphicsState();
    // @ts-ignore — jsPDF GState
    pdf.setGState(new (pdf as any).GState({ opacity, 'stroke-opacity': opacity }));
    pdf.setFillColor(cr, cg, cb);

    if (r > 0) pdf.roundedRect(x, y, w, h, r, r, 'F');
    else pdf.rect(x, y, w, h, 'F');

    pdf.restoreGraphicsState();
    return;
  }

  if (el.type === 'text') {
    const fontSize = s.fontSize || 24;
    const weight = s.fontWeight || 400;
    const [tr, tg, tb] = hexToRgb(s.color || '#000000');
    const align = s.textAlign || 'left';
    const lines = parseContent(el.content, weight);

    if (lines.length === 0) return;

    pdf.setTextColor(tr, tg, tb);
    pdf.setFontSize(fontSize);

    const lineHeight = fontSize * 1.3;
    const totalTextHeight = lines.length * lineHeight;
    const startY = y + (h - totalTextHeight) / 2 + fontSize * 0.85;

    for (let i = 0; i < lines.length; i++) {
      const ly = startY + i * lineHeight;
      if (ly > y + h + fontSize) break;
      const segs = lines[i];

      if (segs.length === 1) {
        pdf.setFont(fontForWeight(segs[0].weight), 'normal');
        let lx = x;
        if (align === 'center') lx = x + w / 2;
        else if (align === 'right') lx = x + w;
        pdf.text(segs[0].text, lx, ly, { align: align as any, maxWidth: w });
      } else {
        let totalWidth = 0;
        for (const seg of segs) {
          pdf.setFont(fontForWeight(seg.weight), 'normal');
          totalWidth += pdf.getTextWidth(seg.text);
        }
        let lx = x;
        if (align === 'center') lx = x + (w - totalWidth) / 2;
        else if (align === 'right') lx = x + w - totalWidth;
        for (const seg of segs) {
          pdf.setFont(fontForWeight(seg.weight), 'normal');
          pdf.text(seg.text, lx, ly);
          lx += pdf.getTextWidth(seg.text);
        }
      }
    }
    return;
  }
}

export async function exportVectorPDF(
  slides: Slide[],
  format: FormatPreset,
  filename: string,
) {
  const fw = format.width;
  const fh = format.height;

  const pdf = new jsPDF({
    orientation: fw >= fh ? 'landscape' : 'portrait',
    unit: 'px',
    format: [fw, fh],
  });

  registerFonts(pdf);

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    if (i > 0) pdf.addPage([fw, fh], fw >= fh ? 'landscape' : 'portrait');

    // Background
    const [br, bg, bb] = hexToRgb(resolveBackground(slide.background || '#ffffff'));
    pdf.setFillColor(br, bg, bb);
    pdf.rect(0, 0, fw, fh, 'F');

    // Render shapes + text
    for (const el of slide.elements) {
      if (el.type !== 'image') {
        renderElement(pdf, el, fw, fh);
      }
    }

    // Images as raster
    for (const el of slide.elements) {
      if (el.type === 'image') {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = el.content;
          });
          if (img.naturalWidth > 0) {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d')!;
            if (el.style.filter?.includes('invert(1)')) ctx.filter = 'invert(1)';
            ctx.drawImage(img, 0, 0);
            const ix = (el.x / 100) * fw, iy = (el.y / 100) * fh;
            const iw = (el.width / 100) * fw, ih = (el.height / 100) * fh;
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', ix, iy, iw, ih);
          }
        } catch { /* skip */ }
      }
    }
  }

  pdf.save(`${filename}.pdf`);
}
