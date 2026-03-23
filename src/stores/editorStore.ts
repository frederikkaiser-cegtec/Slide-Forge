import { create } from 'zustand';
import type { DiagramTool } from '../types/diagram';

type AppMode = 'graphic' | 'diagram' | 'slides';

interface EditorState {
  // App mode
  mode: AppMode;
  setMode: (mode: AppMode) => void;

  // Diagram-specific
  diagramTool: DiagramTool;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  drawingEdgeFrom: { nodeId: string; portId: string } | null;
  diagramZoom: number;
  diagramPan: { x: number; y: number };
  showDiagramTemplatePicker: boolean;
  showExportPreview: boolean;
  showAnimationPanel: boolean;
  animationPreviewPlaying: boolean;
  animationEpoch: number;

  setDiagramTool: (tool: DiagramTool) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  setDrawingEdgeFrom: (from: { nodeId: string; portId: string } | null) => void;
  setDiagramZoom: (zoom: number) => void;
  setDiagramPan: (pan: { x: number; y: number }) => void;
  setShowDiagramTemplatePicker: (show: boolean) => void;
  setShowExportPreview: (show: boolean) => void;
  setShowAnimationPanel: (show: boolean) => void;
  setAnimationPreviewPlaying: (playing: boolean) => void;
  clearDiagramSelection: () => void;

  // Slide editor (existing)
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
  // App mode
  mode: 'graphic',
  setMode: (mode) => set({ mode }),

  // Diagram
  diagramTool: 'select',
  selectedNodeId: null,
  selectedEdgeId: null,
  drawingEdgeFrom: null,
  diagramZoom: 1,
  diagramPan: { x: 0, y: 0 },
  showDiagramTemplatePicker: false,
  showExportPreview: false,
  showAnimationPanel: false,
  animationPreviewPlaying: false,
  animationEpoch: 0,

  setDiagramTool: (diagramTool) => set({ diagramTool, drawingEdgeFrom: diagramTool !== 'drawEdge' ? null : undefined }),
  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
  setDrawingEdgeFrom: (drawingEdgeFrom) => set({ drawingEdgeFrom }),
  setDiagramZoom: (zoom) => set({ diagramZoom: Math.max(0.1, Math.min(3, zoom)) }),
  setDiagramPan: (diagramPan) => set({ diagramPan }),
  setShowDiagramTemplatePicker: (show) => set({ showDiagramTemplatePicker: show }),
  setShowExportPreview: (show) => set({ showExportPreview: show }),
  setShowAnimationPanel: (show) => set({ showAnimationPanel: show }),
  setAnimationPreviewPlaying: (playing) => set((s) => ({
    animationPreviewPlaying: playing,
    animationEpoch: playing ? s.animationEpoch + 1 : s.animationEpoch,
  })),
  clearDiagramSelection: () => set({ selectedNodeId: null, selectedEdgeId: null, drawingEdgeFrom: null }),

  // Slide editor (existing)
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
