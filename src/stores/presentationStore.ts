import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Presentation, Slide, SlideElement } from '../types';
import { generateId } from '../utils/id';
import { templates } from '../templates';
import { getTheme } from '../themes';
import { getFormat } from '../utils/formats';

interface PresentationState {
  presentation: Presentation;
  undoStack: Presentation[];
  redoStack: Presentation[];
  setTitle: (title: string) => void;
  setTheme: (themeId: string) => void;
  setFormat: (formatId: string) => void;
  addSlide: (slide: Slide, index?: number) => void;
  removeSlide: (slideId: string) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;
  duplicateSlide: (slideId: string) => void;
  updateSlideBackground: (slideId: string, bg: string) => void;
  addElement: (slideId: string, element: SlideElement) => void;
  updateElement: (slideId: string, elementId: string, updates: Partial<SlideElement>) => void;
  removeElement: (slideId: string, elementId: string) => void;
  undo: () => void;
  redo: () => void;
  pushUndo: () => void;
  exportJSON: () => string;
  importJSON: (json: string) => void;
  resetPresentation: () => void;
}

function cegtecEl(partial: Partial<SlideElement> & Pick<SlideElement, 'type' | 'x' | 'y' | 'width' | 'height' | 'content'>): SlideElement {
  return { id: generateId(), rotation: 0, style: {}, ...partial };
}

function createDefaultPresentation(): Presentation {
  const theme = getTheme('cegtec');
  const c = theme.colors;

  return {
    id: generateId(),
    title: 'CegTec Grafik',
    slides: [
      {
        id: generateId(),
        elements: [
          // Logo top-right
          cegtecEl({
            type: 'image', x: 72, y: 4, width: 24, height: 12,
            content: '/cegtec-logo.png',
            style: { objectFit: 'contain' },
          }),
          // Headline
          cegtecEl({
            type: 'text', x: 6, y: 18, width: 88, height: 18,
            content: '<h1>3x mehr qualifizierte Leads</h1>',
            style: { fontSize: 52, fontWeight: 800, color: c.text, textAlign: 'left' },
          }),
          // Subline
          cegtecEl({
            type: 'text', x: 6, y: 38, width: 60, height: 12,
            content: '<p>Mit KI-gestützter Sales Automation für B2B-Unternehmen</p>',
            style: { fontSize: 24, color: c.textMuted, textAlign: 'left' },
          }),
          // Accent line
          cegtecEl({
            type: 'shape', x: 6, y: 54, width: 20, height: 0.6,
            content: '',
            style: { backgroundColor: c.secondary },
          }),
          // Metric cards row
          cegtecEl({
            type: 'shape', x: 6, y: 60, width: 26, height: 30,
            content: '',
            style: { backgroundColor: c.surface, borderRadius: 16 },
          }),
          cegtecEl({
            type: 'text', x: 6, y: 63, width: 26, height: 24,
            content: '<h2 style="color: #3B4BF9">67%</h2><p>weniger manuelle Arbeit</p>',
            style: { fontSize: 16, color: c.textMuted, textAlign: 'center' },
          }),
          cegtecEl({
            type: 'shape', x: 37, y: 60, width: 26, height: 30,
            content: '',
            style: { backgroundColor: c.surface, borderRadius: 16 },
          }),
          cegtecEl({
            type: 'text', x: 37, y: 63, width: 26, height: 24,
            content: '<h2 style="color: #E93BCD">14 Tage</h2><p>bis zum ersten Meeting</p>',
            style: { fontSize: 16, color: c.textMuted, textAlign: 'center' },
          }),
          cegtecEl({
            type: 'shape', x: 68, y: 60, width: 26, height: 30,
            content: '',
            style: { backgroundColor: c.surface, borderRadius: 16 },
          }),
          cegtecEl({
            type: 'text', x: 68, y: 63, width: 26, height: 24,
            content: '<h2 style="color: #3B4BF9">98%</h2><p>Zustellrate</p>',
            style: { fontSize: 16, color: c.textMuted, textAlign: 'center' },
          }),
        ],
        background: c.background,
      },
    ],
    themeId: 'cegtec',
    formatId: 'linkedin',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export const usePresentationStore = create<PresentationState>()(
  persist(
    (set, get) => ({
      presentation: createDefaultPresentation(),
      undoStack: [],
      redoStack: [],

      pushUndo: () => {
        const { presentation, undoStack } = get();
        set({
          undoStack: [...undoStack.slice(-49), JSON.parse(JSON.stringify(presentation))],
          redoStack: [],
        });
      },

      setTitle: (title) => {
        get().pushUndo();
        set((s) => ({ presentation: { ...s.presentation, title, updatedAt: Date.now() } }));
      },

      setTheme: (themeId) => {
        get().pushUndo();
        const theme = getTheme(themeId);
        set((s) => {
          const slides = s.presentation.slides.map((slide) => ({
            ...slide,
            background: theme.colors.background,
            elements: slide.elements.map((el) => ({
              ...el,
              style: {
                ...el.style,
                color: el.style.color ? theme.colors.text : undefined,
              },
            })),
          }));
          return { presentation: { ...s.presentation, themeId, slides, updatedAt: Date.now() } };
        });
      },

      setFormat: (formatId) => {
        get().pushUndo();
        getFormat(formatId); // validate
        set((s) => ({ presentation: { ...s.presentation, formatId, updatedAt: Date.now() } }));
      },

      addSlide: (slide, index) => {
        get().pushUndo();
        set((s) => {
          const slides = [...s.presentation.slides];
          if (index !== undefined) {
            slides.splice(index, 0, slide);
          } else {
            slides.push(slide);
          }
          return { presentation: { ...s.presentation, slides, updatedAt: Date.now() } };
        });
      },

      removeSlide: (slideId) => {
        get().pushUndo();
        set((s) => ({
          presentation: {
            ...s.presentation,
            slides: s.presentation.slides.filter((sl) => sl.id !== slideId),
            updatedAt: Date.now(),
          },
        }));
      },

      reorderSlides: (fromIndex, toIndex) => {
        get().pushUndo();
        set((s) => {
          const slides = [...s.presentation.slides];
          const [removed] = slides.splice(fromIndex, 1);
          slides.splice(toIndex, 0, removed);
          return { presentation: { ...s.presentation, slides, updatedAt: Date.now() } };
        });
      },

      duplicateSlide: (slideId) => {
        get().pushUndo();
        set((s) => {
          const idx = s.presentation.slides.findIndex((sl) => sl.id === slideId);
          if (idx === -1) return s;
          const original = s.presentation.slides[idx];
          const copy: Slide = {
            ...JSON.parse(JSON.stringify(original)),
            id: generateId(),
          };
          copy.elements = copy.elements.map((el: SlideElement) => ({ ...el, id: generateId() }));
          const slides = [...s.presentation.slides];
          slides.splice(idx + 1, 0, copy);
          return { presentation: { ...s.presentation, slides, updatedAt: Date.now() } };
        });
      },

      updateSlideBackground: (slideId, bg) => {
        get().pushUndo();
        set((s) => ({
          presentation: {
            ...s.presentation,
            slides: s.presentation.slides.map((sl) =>
              sl.id === slideId ? { ...sl, background: bg } : sl
            ),
            updatedAt: Date.now(),
          },
        }));
      },

      addElement: (slideId, element) => {
        get().pushUndo();
        set((s) => ({
          presentation: {
            ...s.presentation,
            slides: s.presentation.slides.map((sl) =>
              sl.id === slideId ? { ...sl, elements: [...sl.elements, element] } : sl
            ),
            updatedAt: Date.now(),
          },
        }));
      },

      updateElement: (slideId, elementId, updates) => {
        set((s) => ({
          presentation: {
            ...s.presentation,
            slides: s.presentation.slides.map((sl) =>
              sl.id === slideId
                ? {
                    ...sl,
                    elements: sl.elements.map((el) =>
                      el.id === elementId ? { ...el, ...updates, style: { ...el.style, ...updates.style } } : el
                    ),
                  }
                : sl
            ),
            updatedAt: Date.now(),
          },
        }));
      },

      removeElement: (slideId, elementId) => {
        const slide = get().presentation.slides.find((sl) => sl.id === slideId);
        const el = slide?.elements.find((e) => e.id === elementId);
        if (el?.locked) return;
        get().pushUndo();
        set((s) => ({
          presentation: {
            ...s.presentation,
            slides: s.presentation.slides.map((sl) =>
              sl.id === slideId
                ? { ...sl, elements: sl.elements.filter((el) => el.id !== elementId) }
                : sl
            ),
            updatedAt: Date.now(),
          },
        }));
      },

      undo: () => {
        const { undoStack, presentation } = get();
        if (undoStack.length === 0) return;
        const prev = undoStack[undoStack.length - 1];
        set((s) => ({
          undoStack: undoStack.slice(0, -1),
          redoStack: [...s.redoStack, JSON.parse(JSON.stringify(presentation))],
          presentation: prev,
        }));
      },

      redo: () => {
        const { redoStack, presentation } = get();
        if (redoStack.length === 0) return;
        const next = redoStack[redoStack.length - 1];
        set((s) => ({
          redoStack: redoStack.slice(0, -1),
          undoStack: [...s.undoStack, JSON.parse(JSON.stringify(presentation))],
          presentation: next,
        }));
      },

      exportJSON: () => {
        return JSON.stringify(get().presentation, null, 2);
      },

      importJSON: (json) => {
        try {
          const data = JSON.parse(json) as Presentation;
          if (data.slides && data.title) {
            get().pushUndo();
            set({ presentation: data });
          }
        } catch {
          console.error('Invalid JSON');
        }
      },

      resetPresentation: () => {
        get().pushUndo();
        set({ presentation: createDefaultPresentation() });
      },
    }),
    {
      name: 'slide-forge-v5',
      partialize: (state) => ({ presentation: state.presentation }),
    }
  )
);
