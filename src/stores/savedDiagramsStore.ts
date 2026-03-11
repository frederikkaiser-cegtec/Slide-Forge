import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Diagram } from '../types/diagram';

export interface SavedDiagram {
  id: string;
  name: string;
  diagram: Diagram;
  savedAt: number;
  nodeCount: number;
  edgeCount: number;
  diagramType: string;
}

interface SavedDiagramsState {
  savedDiagrams: SavedDiagram[];
  save: (name: string, diagram: Diagram) => string;
  overwrite: (id: string, diagram: Diagram) => void;
  rename: (id: string, name: string) => void;
  remove: (id: string) => void;
  get: (id: string) => SavedDiagram | undefined;
}

export const useSavedDiagramsStore = create<SavedDiagramsState>()(
  persist(
    (set, get) => ({
      savedDiagrams: [],

      save: (name, diagram) => {
        const id = `saved-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const entry: SavedDiagram = {
          id,
          name,
          diagram: JSON.parse(JSON.stringify(diagram)),
          savedAt: Date.now(),
          nodeCount: diagram.nodes.length,
          edgeCount: diagram.edges.length,
          diagramType: diagram.diagramType,
        };
        set((s) => ({ savedDiagrams: [entry, ...s.savedDiagrams] }));
        return id;
      },

      overwrite: (id, diagram) => {
        set((s) => ({
          savedDiagrams: s.savedDiagrams.map((d) =>
            d.id === id
              ? {
                  ...d,
                  diagram: JSON.parse(JSON.stringify(diagram)),
                  savedAt: Date.now(),
                  nodeCount: diagram.nodes.length,
                  edgeCount: diagram.edges.length,
                  diagramType: diagram.diagramType,
                }
              : d
          ),
        }));
      },

      rename: (id, name) => {
        set((s) => ({
          savedDiagrams: s.savedDiagrams.map((d) =>
            d.id === id ? { ...d, name } : d
          ),
        }));
      },

      remove: (id) => {
        set((s) => ({
          savedDiagrams: s.savedDiagrams.filter((d) => d.id !== id),
        }));
      },

      get: (id) => get().savedDiagrams.find((d) => d.id === id),
    }),
    {
      name: 'slide-forge-saved-diagrams-v1',
    }
  )
);
