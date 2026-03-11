import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Diagram, DiagramNode, DiagramEdge } from '../types/diagram';
import type { DiagramAnimationSettings, ElementAnimation } from '../types/animation';
import { generateId } from '../utils/id';
import { getTheme } from '../themes';
import { diagramTemplates } from '../templates/diagrams';

function createDefaultDiagram(): Diagram {
  const theme = getTheme('cegtec');
  const c = theme.colors;

  // Starte mit der CegTec Lead-Gen Pipeline als Demo
  const processTemplate = diagramTemplates.find((t) => t.id === 'process-flow');
  if (processTemplate) {
    const data = processTemplate.create(c);
    return {
      ...data,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  return {
    id: generateId(),
    title: 'Neues Diagramm',
    diagramType: 'flowchart',
    nodes: [],
    edges: [],
    background: c.background,
    gridSize: 20,
    themeId: 'cegtec',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

interface DiagramState {
  diagram: Diagram;
  undoStack: Diagram[];
  redoStack: Diagram[];

  // Diagram-level
  setTitle: (title: string) => void;
  setDiagramType: (type: Diagram['diagramType']) => void;
  setBackground: (bg: string) => void;
  setTheme: (themeId: string) => void;
  setGridSize: (size: number) => void;
  loadDiagram: (diagram: Diagram) => void;
  resetDiagram: () => void;

  // Nodes
  addNode: (node: DiagramNode) => void;
  updateNode: (nodeId: string, updates: Partial<DiagramNode>) => void;
  removeNode: (nodeId: string) => void;
  moveNode: (nodeId: string, x: number, y: number) => void;
  resizeNode: (nodeId: string, width: number, height: number) => void;

  // Edges
  addEdge: (edge: DiagramEdge) => void;
  updateEdge: (edgeId: string, updates: Partial<DiagramEdge>) => void;
  removeEdge: (edgeId: string) => void;

  // Bulk
  setNodes: (nodes: DiagramNode[]) => void;
  setEdges: (edges: DiagramEdge[]) => void;

  // Undo/Redo
  undo: () => void;
  redo: () => void;
  pushUndo: () => void;

  // Animation
  setAnimationSettings: (settings: Partial<DiagramAnimationSettings>) => void;
  setNodeAnimation: (nodeId: string, animation: ElementAnimation | undefined) => void;
  setEdgeAnimation: (edgeId: string, animation: ElementAnimation | undefined) => void;

  // Export
  exportJSON: () => string;
  importJSON: (json: string) => void;
}

export const useDiagramStore = create<DiagramState>()(
  persist(
    (set, get) => ({
      diagram: createDefaultDiagram(),
      undoStack: [],
      redoStack: [],

      pushUndo: () => {
        const { diagram, undoStack } = get();
        set({
          undoStack: [...undoStack.slice(-49), JSON.parse(JSON.stringify(diagram))],
          redoStack: [],
        });
      },

      setTitle: (title) => {
        get().pushUndo();
        set((s) => ({ diagram: { ...s.diagram, title, updatedAt: Date.now() } }));
      },

      setDiagramType: (diagramType) => {
        get().pushUndo();
        set((s) => ({ diagram: { ...s.diagram, diagramType, updatedAt: Date.now() } }));
      },

      setBackground: (background) => {
        get().pushUndo();
        set((s) => ({ diagram: { ...s.diagram, background, updatedAt: Date.now() } }));
      },

      setTheme: (themeId) => {
        get().pushUndo();
        const theme = getTheme(themeId);
        set((s) => ({
          diagram: { ...s.diagram, themeId, background: theme.colors.background, updatedAt: Date.now() },
        }));
      },

      setGridSize: (gridSize) => {
        set((s) => ({ diagram: { ...s.diagram, gridSize, updatedAt: Date.now() } }));
      },

      loadDiagram: (diagram) => {
        get().pushUndo();
        set({ diagram });
      },

      resetDiagram: () => {
        get().pushUndo();
        set({ diagram: createDefaultDiagram() });
      },

      // Nodes
      addNode: (node) => {
        get().pushUndo();
        set((s) => ({
          diagram: {
            ...s.diagram,
            nodes: [...s.diagram.nodes, node],
            updatedAt: Date.now(),
          },
        }));
      },

      updateNode: (nodeId, updates) => {
        get().pushUndo();
        set((s) => ({
          diagram: {
            ...s.diagram,
            nodes: s.diagram.nodes.map((n) =>
              n.id === nodeId ? { ...n, ...updates, style: { ...n.style, ...updates.style } } : n
            ),
            updatedAt: Date.now(),
          },
        }));
      },

      removeNode: (nodeId) => {
        get().pushUndo();
        set((s) => ({
          diagram: {
            ...s.diagram,
            nodes: s.diagram.nodes.filter((n) => n.id !== nodeId),
            edges: s.diagram.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
            updatedAt: Date.now(),
          },
        }));
      },

      moveNode: (nodeId, x, y) => {
        set((s) => ({
          diagram: {
            ...s.diagram,
            nodes: s.diagram.nodes.map((n) => (n.id === nodeId ? { ...n, x, y } : n)),
            updatedAt: Date.now(),
          },
        }));
      },

      resizeNode: (nodeId, width, height) => {
        set((s) => ({
          diagram: {
            ...s.diagram,
            nodes: s.diagram.nodes.map((n) => (n.id === nodeId ? { ...n, width, height } : n)),
            updatedAt: Date.now(),
          },
        }));
      },

      // Edges
      addEdge: (edge) => {
        get().pushUndo();
        set((s) => ({
          diagram: {
            ...s.diagram,
            edges: [...s.diagram.edges, edge],
            updatedAt: Date.now(),
          },
        }));
      },

      updateEdge: (edgeId, updates) => {
        get().pushUndo();
        set((s) => ({
          diagram: {
            ...s.diagram,
            edges: s.diagram.edges.map((e) =>
              e.id === edgeId ? { ...e, ...updates, style: { ...e.style, ...updates.style } } : e
            ),
            updatedAt: Date.now(),
          },
        }));
      },

      removeEdge: (edgeId) => {
        get().pushUndo();
        set((s) => ({
          diagram: {
            ...s.diagram,
            edges: s.diagram.edges.filter((e) => e.id !== edgeId),
            updatedAt: Date.now(),
          },
        }));
      },

      // Bulk
      setNodes: (nodes) => {
        get().pushUndo();
        set((s) => ({ diagram: { ...s.diagram, nodes, updatedAt: Date.now() } }));
      },

      setEdges: (edges) => {
        get().pushUndo();
        set((s) => ({ diagram: { ...s.diagram, edges, updatedAt: Date.now() } }));
      },

      // Undo/Redo
      undo: () => {
        const { undoStack, diagram } = get();
        if (undoStack.length === 0) return;
        const prev = undoStack[undoStack.length - 1];
        set((s) => ({
          undoStack: undoStack.slice(0, -1),
          redoStack: [...s.redoStack, JSON.parse(JSON.stringify(diagram))],
          diagram: prev,
        }));
      },

      redo: () => {
        const { redoStack, diagram } = get();
        if (redoStack.length === 0) return;
        const next = redoStack[redoStack.length - 1];
        set((s) => ({
          redoStack: redoStack.slice(0, -1),
          undoStack: [...s.undoStack, JSON.parse(JSON.stringify(diagram))],
          diagram: next,
        }));
      },

      // Animation
      setAnimationSettings: (settings) => {
        get().pushUndo();
        set((s) => ({
          diagram: {
            ...s.diagram,
            animationSettings: { ...s.diagram.animationSettings, ...settings } as DiagramAnimationSettings,
            updatedAt: Date.now(),
          },
        }));
      },

      setNodeAnimation: (nodeId, animation) => {
        get().pushUndo();
        set((s) => ({
          diagram: {
            ...s.diagram,
            nodes: s.diagram.nodes.map((n) =>
              n.id === nodeId ? { ...n, animation } : n
            ),
            updatedAt: Date.now(),
          },
        }));
      },

      setEdgeAnimation: (edgeId, animation) => {
        get().pushUndo();
        set((s) => ({
          diagram: {
            ...s.diagram,
            edges: s.diagram.edges.map((e) =>
              e.id === edgeId ? { ...e, animation } : e
            ),
            updatedAt: Date.now(),
          },
        }));
      },

      exportJSON: () => JSON.stringify(get().diagram, null, 2),

      importJSON: (json) => {
        try {
          const data = JSON.parse(json) as Diagram;
          if (data.nodes && data.edges && data.title) {
            get().pushUndo();
            set({ diagram: data });
          }
        } catch {
          console.error('Invalid diagram JSON');
        }
      },
    }),
    {
      name: 'slide-forge-diagram-v1',
      partialize: (state) => ({ diagram: state.diagram }),
    }
  )
);
