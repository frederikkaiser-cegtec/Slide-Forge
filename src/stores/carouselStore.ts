import { create } from 'zustand';
import { getDefinition } from '../registry';
import type { Layer } from '../types/layers';

export interface CarouselSlide {
  id: string;
  data: unknown;
  layers: Layer[];
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
  addSlideLayer: (slideId: string, layer: Layer) => void;
  updateSlideLayer: (slideId: string, layerId: string, patch: Partial<Layer>) => void;
  deleteSlideLayer: (slideId: string, layerId: string) => void;
  moveSlideLayerUp: (slideId: string, layerId: string) => void;
  moveSlideLayerDown: (slideId: string, layerId: string) => void;
  reset: () => void;
}

function slidesMap(slides: CarouselSlide[], id: string, fn: (s: CarouselSlide) => CarouselSlide): CarouselSlide[] {
  return slides.map((sl) => sl.id === id ? fn(sl) : sl);
}

export const useCarouselStore = create<CarouselStore>((set, get) => ({
  carousel: null,
  activeSlideId: null,

  create: (graphicType, formatId, count) => {
    const def = getDefinition(graphicType);
    const slides: CarouselSlide[] = Array.from({ length: count }, () => ({
      id: crypto.randomUUID(),
      data: structuredClone(def.defaultData),
      layers: [],
    }));
    set({ carousel: { graphicType, formatId, slides }, activeSlideId: slides[0].id });
  },

  setActive: (id) => set({ activeSlideId: id }),

  updateSlide: (id, data) =>
    set((s) => ({
      carousel: s.carousel
        ? { ...s.carousel, slides: slidesMap(s.carousel.slides, id, (sl) => ({ ...sl, data })) }
        : null,
    })),

  addSlide: () =>
    set((s) => {
      if (!s.carousel) return s;
      const def = getDefinition(s.carousel.graphicType);
      const newSlide: CarouselSlide = { id: crypto.randomUUID(), data: structuredClone(def.defaultData), layers: [] };
      return {
        carousel: { ...s.carousel, slides: [...s.carousel.slides, newSlide] },
        activeSlideId: newSlide.id,
      };
    }),

  removeSlide: (id) =>
    set((s) => {
      if (!s.carousel || s.carousel.slides.length <= 1) return s;
      const slides = s.carousel.slides.filter((sl) => sl.id !== id);
      return { carousel: { ...s.carousel, slides }, activeSlideId: s.activeSlideId === id ? slides[0].id : s.activeSlideId };
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
      return { carousel: { ...s.carousel, slides: s.carousel.slides.map((sl) => ({ ...sl, data: setPath(sl.data) })) } };
    }),

  addSlideLayer: (slideId, layer) =>
    set((s) => ({
      carousel: s.carousel
        ? { ...s.carousel, slides: slidesMap(s.carousel.slides, slideId, (sl) => ({ ...sl, layers: [...sl.layers, layer] })) }
        : null,
    })),

  updateSlideLayer: (slideId, layerId, patch) =>
    set((s) => ({
      carousel: s.carousel
        ? { ...s.carousel, slides: slidesMap(s.carousel.slides, slideId, (sl) => ({
            ...sl,
            layers: sl.layers.map((l) => l.id === layerId ? { ...l, ...patch } as Layer : l),
          })) }
        : null,
    })),

  deleteSlideLayer: (slideId, layerId) =>
    set((s) => ({
      carousel: s.carousel
        ? { ...s.carousel, slides: slidesMap(s.carousel.slides, slideId, (sl) => ({
            ...sl,
            layers: sl.layers.filter((l) => l.id !== layerId),
          })) }
        : null,
    })),

  moveSlideLayerUp: (slideId, layerId) =>
    set((s) => ({
      carousel: s.carousel
        ? { ...s.carousel, slides: slidesMap(s.carousel.slides, slideId, (sl) => {
            const i = sl.layers.findIndex((l) => l.id === layerId);
            if (i >= sl.layers.length - 1) return sl;
            const a = [...sl.layers]; [a[i], a[i + 1]] = [a[i + 1], a[i]];
            return { ...sl, layers: a };
          }) }
        : null,
    })),

  moveSlideLayerDown: (slideId, layerId) =>
    set((s) => ({
      carousel: s.carousel
        ? { ...s.carousel, slides: slidesMap(s.carousel.slides, slideId, (sl) => {
            const i = sl.layers.findIndex((l) => l.id === layerId);
            if (i <= 0) return sl;
            const a = [...sl.layers]; [a[i], a[i - 1]] = [a[i - 1], a[i]];
            return { ...sl, layers: a };
          }) }
        : null,
    })),

  reset: () => set({ carousel: null, activeSlideId: null }),
}));
