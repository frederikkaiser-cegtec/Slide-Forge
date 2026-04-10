import { create } from 'zustand';
import { getDefinition } from '../registry';

export interface CarouselSlide {
  id: string;
  data: unknown;
}

export interface Carousel {
  graphicType: string;
  formatId: string;
  slides: CarouselSlide[];
}

interface CarouselStore {
  carousel: Carousel | null;
  activeSlideId: string | null;
  create: (graphicType: string, formatId: string, count: number) => void;
  setActive: (id: string) => void;
  updateSlide: (id: string, data: unknown) => void;
  addSlide: () => void;
  removeSlide: (id: string) => void;
  moveSlide: (from: number, to: number) => void;
  applyGlobal: (path: string, value: string) => void;
  reset: () => void;
}

export const useCarouselStore = create<CarouselStore>((set, get) => ({
  carousel: null,
  activeSlideId: null,

  create: (graphicType, formatId, count) => {
    const def = getDefinition(graphicType);
    const slides: CarouselSlide[] = Array.from({ length: count }, () => ({
      id: crypto.randomUUID(),
      data: structuredClone(def.defaultData),
    }));
    set({ carousel: { graphicType, formatId, slides }, activeSlideId: slides[0].id });
  },

  setActive: (id) => set({ activeSlideId: id }),

  updateSlide: (id, data) =>
    set((s) => ({
      carousel: s.carousel
        ? { ...s.carousel, slides: s.carousel.slides.map((sl) => (sl.id === id ? { ...sl, data } : sl)) }
        : null,
    })),

  addSlide: () =>
    set((s) => {
      if (!s.carousel) return s;
      const def = getDefinition(s.carousel.graphicType);
      const newSlide: CarouselSlide = { id: crypto.randomUUID(), data: structuredClone(def.defaultData) };
      return {
        carousel: { ...s.carousel, slides: [...s.carousel.slides, newSlide] },
        activeSlideId: newSlide.id,
      };
    }),

  removeSlide: (id) =>
    set((s) => {
      if (!s.carousel || s.carousel.slides.length <= 1) return s;
      const slides = s.carousel.slides.filter((sl) => sl.id !== id);
      const activeSlideId = s.activeSlideId === id ? slides[0].id : s.activeSlideId;
      return { carousel: { ...s.carousel, slides }, activeSlideId };
    }),

  moveSlide: (from, to) =>
    set((s) => {
      if (!s.carousel) return s;
      const slides = [...s.carousel.slides];
      const [item] = slides.splice(from, 1);
      slides.splice(to, 0, item);
      return { carousel: { ...s.carousel, slides } };
    }),

  applyGlobal: (path, value) =>
    set((s) => {
      if (!s.carousel) return s;
      const parts = path.split('.');
      function setPath(obj: unknown): unknown {
        const clone = structuredClone(obj) as Record<string, unknown>;
        let cur: Record<string, unknown> = clone;
        for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]] as Record<string, unknown>;
        cur[parts[parts.length - 1]] = value;
        return clone;
      }
      return {
        carousel: {
          ...s.carousel,
          slides: s.carousel.slides.map((sl) => ({ ...sl, data: setPath(sl.data) })),
        },
      };
    }),

  reset: () => set({ carousel: null, activeSlideId: null }),
}));
