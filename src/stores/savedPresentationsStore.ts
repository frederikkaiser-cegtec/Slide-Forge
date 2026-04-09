import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Presentation } from '../types';
import outboundStackData from '../data/outbound-stack.json';
import crmAuditData from '../data/crm-audit.json';

export interface SavedPresentation {
  id: string;
  name: string;
  data: Presentation;
  savedAt: number;
}

const PRESET_OUTBOUND: SavedPresentation = {
  id: 'preset-outbound-stack',
  name: 'Der 150€ Outbound Stack',
  data: {
    ...(outboundStackData as unknown as Presentation),
    themeId: 'cegtec',
    formatId: '4:5',
    createdAt: 0,
    updatedAt: 0,
  },
  savedAt: 0,
};

const PRESET_CRM: SavedPresentation = {
  id: 'preset-crm-audit',
  name: 'Dein CRM lügt',
  data: {
    ...(crmAuditData as unknown as Presentation),
    themeId: 'cegtec',
    formatId: '4:5',
    createdAt: 0,
    updatedAt: 0,
  },
  savedAt: 0,
};

interface SavedPresentationsState {
  presentations: SavedPresentation[];
  save: (name: string, data: Presentation) => string;
  overwrite: (id: string, data: Presentation) => void;
  rename: (id: string, name: string) => void;
  remove: (id: string) => void;
  get: (id: string) => SavedPresentation | undefined;
}

export const useSavedPresentationsStore = create<SavedPresentationsState>()(
  persist(
    (set, get) => ({
      presentations: [PRESET_OUTBOUND, PRESET_CRM],

      save: (name, data) => {
        const id = `pres-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const entry: SavedPresentation = { id, name, data, savedAt: Date.now() };
        set((s) => ({ presentations: [entry, ...s.presentations] }));
        return id;
      },

      overwrite: (id, data) => {
        set((s) => ({
          presentations: s.presentations.map((p) =>
            p.id === id ? { ...p, data, savedAt: Date.now() } : p
          ),
        }));
      },

      rename: (id, name) => {
        set((s) => ({
          presentations: s.presentations.map((p) => (p.id === id ? { ...p, name } : p)),
        }));
      },

      remove: (id) => {
        if (id.startsWith('preset-')) return; // protect presets
        set((s) => ({ presentations: s.presentations.filter((p) => p.id !== id) }));
      },

      get: (id) => get().presentations.find((p) => p.id === id),
    }),
    {
      name: 'sf-saved-presentations-v1',
    }
  )
);
