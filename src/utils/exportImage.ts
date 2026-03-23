import { toPng, toJpeg } from 'html-to-image';
import JSZip from 'jszip';
import type { FormatPreset } from './formats';

function captureElement(el: HTMLElement, format: FormatPreset, imageType: 'png' | 'jpeg') {
  const opts = {
    width: format.width,
    height: format.height,
    pixelRatio: 2,
    style: { transform: 'none', transformOrigin: '0 0' },
  };
  return imageType === 'jpeg'
    ? toJpeg(el, { ...opts, quality: 0.92 })
    : toPng(el, opts);
}

function showExportContainer() {
  const c = document.getElementById('slide-export-container');
  if (c) c.style.display = 'block';
}
function hideExportContainer() {
  const c = document.getElementById('slide-export-container');
  if (c) c.style.display = 'none';
}

export async function exportSlideAsImage(
  slideIndex: number,
  format: FormatPreset,
  filename: string,
  imageType: 'png' | 'jpeg' = 'png',
) {
  const el = document.getElementById(`slide-export-${slideIndex}`);
  if (!el) return;

  showExportContainer();
  const dataUrl = await captureElement(el, format, imageType);
  hideExportContainer();
  const ext = imageType === 'jpeg' ? 'jpg' : 'png';

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
  const ext = imageType === 'jpeg' ? 'jpg' : 'png';

  showExportContainer();
  for (let i = 0; i < slideCount; i++) {
    const el = document.getElementById(`slide-export-${i}`);
    if (!el) continue;

    const dataUrl = await captureElement(el, format, imageType);
    const base64 = dataUrl.split(',')[1];
    zip.file(`slide-${i + 1}.${ext}`, base64, { base64: true });
  }

  hideExportContainer();

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
