import html2canvas from 'html2canvas';

interface VideoExportOptions {
  fps?: number;
  duration?: number;
  width?: number;
  height?: number;
  onProgress?: (progress: number) => void;
}

/**
 * Export a diagram container as a WebM video.
 * Uses Canvas.captureStream + MediaRecorder.
 */
export async function exportVideo(
  containerEl: HTMLElement,
  options: VideoExportOptions = {},
): Promise<Blob> {
  const {
    fps = 30,
    duration = 3,
    width = containerEl.offsetWidth,
    height = containerEl.offsetHeight,
    onProgress,
  } = options;

  const totalFrames = Math.round(fps * duration);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const stream = canvas.captureStream(0); // 0 = manual frame push
  const recorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: 5_000_000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  recorder.start();

  // Use Web Animations API to seek
  const animations = containerEl.getAnimations({ subtree: true });
  const hasAnimations = animations.length > 0;

  if (hasAnimations) {
    animations.forEach((a) => a.pause());
  }

  for (let i = 0; i < totalFrames; i++) {
    if (hasAnimations) {
      const t = (i / totalFrames) * duration * 1000;
      animations.forEach((a) => {
        if (a.effect) a.currentTime = t;
      });
    }

    const frameCanvas = await html2canvas(containerEl, {
      width,
      height,
      scale: 1,
      useCORS: true,
      logging: false,
    });

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(frameCanvas, 0, 0, width, height);

    // Request a new frame on the stream
    (stream.getVideoTracks()[0] as unknown as { requestFrame?: () => void }).requestFrame?.();

    onProgress?.(i / totalFrames);

    // Small delay to let MediaRecorder process the frame
    await new Promise((r) => setTimeout(r, 10));
  }

  if (hasAnimations) {
    animations.forEach((a) => a.play());
  }

  recorder.stop();

  return new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: 'video/webm' }));
    };
  });
}
