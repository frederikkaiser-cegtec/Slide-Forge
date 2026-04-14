/**
 * Browser Bridge for server-side rendering.
 * Only loaded when ?mcp=1 is in the URL.
 * Exposes window.__SF_BRIDGE__ for Playwright to control the app.
 */

import { GRAPHIC_REGISTRY, getDefinition } from './registry';
import { FORMAT_PRESETS } from './utils/formats';
import { themes } from './themes';

export interface BridgeAPI {
  setGraphicType(type: string): void;
  setGraphicData(type: string, data: unknown): void;
  setFormat(formatId: string): void;
  getGraphicElement(): HTMLElement | null;
  getAvailableTypes(): { id: string; label: string; defaultFormat: string; defaultData: unknown }[];
  getFormats(): { id: string; label: string; width: number; height: number }[];
  getThemes(): typeof themes;
  getTemplateDefaults(templateId: string): { data: unknown; format: string } | null;
  isReady(): boolean;
}

declare global {
  interface Window {
    __SF_BRIDGE__: BridgeAPI;
    __SF_DISPATCH__: ((action: { type: 'SET_DATA'; graphicType: string; data: unknown }) => void) | undefined;
    __SF_SET_GRAPHIC_TYPE__: ((type: string) => void) | undefined;
    __SF_SET_FORMAT__: ((formatId: string) => void) | undefined;
  }
}

export function shouldLoadBridge(): boolean {
  return new URLSearchParams(window.location.search).has('mcp');
}

export function initBridge() {
  window.__SF_BRIDGE__ = {
    setGraphicType(type: string) {
      if (!GRAPHIC_REGISTRY.find((d) => d.id === type)) {
        throw new Error(`Unknown graphic type: ${type}`);
      }
      window.__SF_SET_GRAPHIC_TYPE__?.(type);
    },

    setGraphicData(type: string, data: unknown) {
      window.__SF_DISPATCH__?.({ type: 'SET_DATA', graphicType: type, data });
    },

    setFormat(formatId: string) {
      window.__SF_SET_FORMAT__?.(formatId);
    },

    getGraphicElement() {
      return document.getElementById('sf-graphic-root');
    },

    getAvailableTypes() {
      return GRAPHIC_REGISTRY.map((def) => ({
        id: def.id,
        label: def.label,
        defaultFormat: def.defaultFormat,
        defaultData: def.defaultData,
      }));
    },

    getFormats() {
      return FORMAT_PRESETS.map((f) => ({
        id: f.id,
        label: f.label,
        width: f.width,
        height: f.height,
      }));
    },

    getThemes() {
      return themes;
    },

    getTemplateDefaults(templateId: string) {
      const def = GRAPHIC_REGISTRY.find((d) => d.id === templateId);
      if (!def) return null;
      return { data: def.defaultData, format: def.defaultFormat };
    },

    isReady() {
      return !!document.getElementById('sf-graphic-root');
    },
  };
}
