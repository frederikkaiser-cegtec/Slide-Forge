import { useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePresentationStore } from '../../stores/presentationStore';
import { useEditorStore } from '../../stores/editorStore';
import { SlideRenderer } from '../slides/SlideRenderer';
import { getFormat } from '../../utils/formats';

export function PresentationMode() {
  const slides = usePresentationStore((s) => s.presentation.slides);
  const formatId = usePresentationStore((s) => s.presentation.formatId);
  const currentIndex = useEditorStore((s) => s.presentationSlideIndex);
  const setIndex = useEditorStore((s) => s.setPresentationSlideIndex);
  const exit = useEditorStore((s) => s.exitPresentationMode);
  const containerRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef(1);

  const goNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      directionRef.current = 1;
      setIndex(currentIndex + 1);
    }
  }, [currentIndex, slides.length, setIndex]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      directionRef.current = -1;
      setIndex(currentIndex - 1);
    }
  }, [currentIndex, setIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          goNext();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          goPrev();
          break;
        case 'Escape':
          e.preventDefault();
          exit();
          break;
        case 'Home':
          e.preventDefault();
          directionRef.current = -1;
          setIndex(0);
          break;
        case 'End':
          e.preventDefault();
          directionRef.current = 1;
          setIndex(slides.length - 1);
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, exit, setIndex, slides.length]);

  useEffect(() => {
    containerRef.current?.requestFullscreen?.().catch(() => {});
    return () => {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    };
  }, []);

  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement) exit();
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, [exit]);

  const format = getFormat(formatId ?? '16:9');
  const current = slides[currentIndex];
  if (!current) return null;

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 cursor-none"
      onClick={(e) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        if (e.clientX > rect.width / 2) goNext();
        else goPrev();
      }}
    >
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
        <AnimatePresence custom={directionRef.current} mode="wait">
          <motion.div
            key={current.id}
            custom={directionRef.current}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <SlideRenderer
              slide={current}
              width={window.innerWidth}
              height={window.innerHeight}
              baseWidth={format.width}
              baseHeight={format.height}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-4 right-4 text-white/40 text-sm font-mono">
        {currentIndex + 1} / {slides.length}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
        <div
          className="h-full bg-white/40 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
