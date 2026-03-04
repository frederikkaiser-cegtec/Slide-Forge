import { create } from 'zustand';

interface EditorState {
  selectedSlideId: string | null;
  selectedElementId: string | null;
  editingElementId: string | null;
  isPresentationMode: boolean;
  presentationSlideIndex: number;
  zoom: number;
  showTemplatePicker: boolean;
  showThemePicker: boolean;

  selectSlide: (id: string | null) => void;
  selectElement: (id: string | null) => void;
  setEditingElement: (id: string | null) => void;
  enterPresentationMode: (slideIndex?: number) => void;
  exitPresentationMode: () => void;
  setPresentationSlideIndex: (index: number) => void;
  setZoom: (zoom: number) => void;
  setShowTemplatePicker: (show: boolean) => void;
  setShowThemePicker: (show: boolean) => void;
  clearSelection: () => void;
}

export const useEditorStore = create<EditorState>()((set) => ({
  selectedSlideId: null,
  selectedElementId: null,
  editingElementId: null,
  isPresentationMode: false,
  presentationSlideIndex: 0,
  zoom: 1,
  showTemplatePicker: false,
  showThemePicker: false,

  selectSlide: (id) => set({ selectedSlideId: id, selectedElementId: null, editingElementId: null }),
  selectElement: (id) => set({ selectedElementId: id }),
  setEditingElement: (id) => set({ editingElementId: id }),
  enterPresentationMode: (slideIndex = 0) =>
    set({ isPresentationMode: true, presentationSlideIndex: slideIndex, selectedElementId: null, editingElementId: null }),
  exitPresentationMode: () => set({ isPresentationMode: false }),
  setPresentationSlideIndex: (index) => set({ presentationSlideIndex: index }),
  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(2, zoom)) }),
  setShowTemplatePicker: (show) => set({ showTemplatePicker: show }),
  setShowThemePicker: (show) => set({ showThemePicker: show }),
  clearSelection: () => set({ selectedElementId: null, editingElementId: null }),
}));
