import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import type { FormatPreset } from './formats';

export async function exportSlideAsImage(
  slideIndex: number,
  format: FormatPreset,
  filename: string,
  imageType: 'png' | 'jpeg' = 'png',
) {
  const el = document.getElementById(`slide-export-${slideIndex}`);
  if (!el) return;

  const canvas = await html2canvas(el, {
    width: format.width,
    height: format.height,
    scale: 1.5,
    useCORS: true,
    backgroundColor: null,
  });

  const mimeType = imageType === 'jpeg' ? 'image/jpeg' : 'image/png';
  const ext = imageType === 'jpeg' ? 'jpg' : 'png';
  const dataUrl = canvas.toDataURL(mimeType, 0.92);

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `${filename}.${ext}`;
  a.click();
}

export async function exportAllSlidesAsZip(
  slideCount: number,
  format: FormatPreset,
  filename: string,
  imageType: 'png' | 'jpeg' = 'png',
) {
  const zip = new JSZip();
  const mimeType = imageType === 'jpeg' ? 'image/jpeg' : 'image/png';
  const ext = imageType === 'jpeg' ? 'jpg' : 'png';

  for (let i = 0; i < slideCount; i++) {
    const el = document.getElementById(`slide-export-${i}`);
    if (!el) continue;

    const canvas = await html2canvas(el, {
      width: format.width,
      height: format.height,
      scale: 1.5,
      useCORS: true,
      backgroundColor: null,
    });

    const dataUrl = canvas.toDataURL(mimeType, 0.92);
    const base64 = dataUrl.split(',')[1];
    zip.file(`slide-${i + 1}.${ext}`, base64, { base64: true });
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
