import { jsPDF } from 'jspdf';
import { toJpeg } from 'html-to-image';
import type { FormatPreset } from './formats';

/**
 * Capture HTML elements and assemble them into a single multi-page PDF.
 *
 * Uses raster (JPEG @ 2x DPI, quality 0.92) so the PDF is a pixel-perfect
 * copy of what the browser shows — fonts, kerning, line-wrapping and all.
 * The browser is the only reliable text-layout engine; jsPDF and svg2pdf
 * both diverge from it in font metrics and word-wrapping.
 *
 * JPEG @ 2x keeps files under LinkedIn's 100 MB document limit and loads
 * fast on mobile. 3x PNG was ~40 MB per 4:5 slide — unusable for uploads.
 *
 * Tradeoff: text isn't selectable, file is larger than a true vector export.
 * For social-media slides this is fine; for long documents use another tool.
 */
export async function exportElementsAsRasterPdf(
  elements: HTMLElement[],
  format: FormatPreset,
  filename: string,
): Promise<void> {
  if (elements.length === 0) return;

  // Wait for @font-face fonts to fully load before capture, otherwise the
  // first export of a session may fall back to system fonts.
  if ('fonts' in document) {
    try {
      await (document as Document & { fonts: { ready: Promise<unknown> } }).fonts.ready;
    } catch { /* ignore */ }
  }

  const orientation = format.width >= format.height ? 'landscape' : 'portrait';
  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [format.width, format.height],
    hotfixes: ['px_scaling'],
    compress: true,
  });

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const dataUrl = await toJpeg(el, {
      width: format.width,
      height: format.height,
      pixelRatio: 2,
      quality: 0.92,
      style: { transform: 'none', transformOrigin: '0 0' },
    });

    if (i > 0) pdf.addPage([format.width, format.height], orientation);
    pdf.addImage(dataUrl, 'JPEG', 0, 0, format.width, format.height, undefined, 'FAST');
  }

  pdf.save(`${filename}.pdf`);
}
