import html2canvas from 'html2canvas';

interface GifExportOptions {
  fps?: number;
  duration?: number;  // total animation duration in seconds
  width?: number;
  height?: number;
  onProgress?: (progress: number) => void;
}

/**
 * Export a diagram container as an animated GIF.
 * Uses html2canvas for frame capture and gifshot for assembly.
 */
export async function exportGIF(
  containerEl: HTMLElement,
  options: GifExportOptions = {},
): Promise<Blob> {
  const {
    fps = 10,
    duration = 3,
    width = containerEl.offsetWidth,
    height = containerEl.offsetHeight,
    onProgress,
  } = options;

  const totalFrames = Math.round(fps * duration);
  const frameInterval = 1000 / fps;
  const frames: string[] = [];

  // Try to use Web Animations API to seek through time
  const animations = containerEl.getAnimations({ subtree: true });
  const hasAnimations = animations.length > 0;

  if (hasAnimations) {
    // Pause all animations and seek through frames
    animations.forEach((a) => a.pause());

    for (let i = 0; i < totalFrames; i++) {
      const t = (i / totalFrames) * duration * 1000;
      animations.forEach((a) => {
        if (a.effect) {
          a.currentTime = t;
        }
      });

      const canvas = await html2canvas(containerEl, {
        width,
        height,
        scale: 1,
        useCORS: true,
        logging: false,
      });

      frames.push(canvas.toDataURL('image/png'));
      onProgress?.(i / totalFrames);
    }

    // Restore animations
    animations.forEach((a) => a.play());
  } else {
    // Fallback: capture frames in real-time
    for (let i = 0; i < totalFrames; i++) {
      const canvas = await html2canvas(containerEl, {
        width,
        height,
        scale: 1,
        useCORS: true,
        logging: false,
      });

      frames.push(canvas.toDataURL('image/png'));
      onProgress?.(i / totalFrames);

      if (i < totalFrames - 1) {
        await new Promise((r) => setTimeout(r, frameInterval));
      }
    }
  }

  // Use gifshot to assemble
  const gifshot = await import('gifshot');

  return new Promise<Blob>((resolve, reject) => {
    gifshot.createGIF(
      {
        images: frames,
        gifWidth: width,
        gifHeight: height,
        interval: 1 / fps,
        numFrames: frames.length,
        frameDuration: 1,
        sampleInterval: 10,
      },
      (result: { error: boolean; errorMsg?: string; image?: string }) => {
        if (result.error) {
          reject(new Error(result.errorMsg || 'GIF creation failed'));
        } else if (result.image) {
          // Convert data URL to Blob
          const byteString = atob(result.image.split(',')[1]);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          resolve(new Blob([ab], { type: 'image/gif' }));
        } else {
          reject(new Error('No GIF image generated'));
        }
      },
    );
  });
}
