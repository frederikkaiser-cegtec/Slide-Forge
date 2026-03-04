import type { Theme } from '../types';

export const themes: Theme[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    colors: {
      background: '#0f0f1a',
      surface: '#1a1a2e',
      primary: '#6366f1',
      secondary: '#8b5cf6',
      text: '#f0f0ff',
      textMuted: '#9898b0',
      accent: '#f59e0b',
    },
  },
  {
    id: 'clean',
    name: 'Clean',
    colors: {
      background: '#ffffff',
      surface: '#f8f9fa',
      primary: '#1a1a2e',
      secondary: '#4a4a6a',
      text: '#1a1a2e',
      textMuted: '#6b7280',
      accent: '#6366f1',
    },
  },
  {
    id: 'corporate',
    name: 'Corporate Blue',
    colors: {
      background: '#0a1628',
      surface: '#112240',
      primary: '#2563eb',
      secondary: '#3b82f6',
      text: '#e2e8f0',
      textMuted: '#94a3b8',
      accent: '#f59e0b',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    colors: {
      background: '#fafafa',
      surface: '#f0f0f0',
      primary: '#171717',
      secondary: '#404040',
      text: '#171717',
      textMuted: '#737373',
      accent: '#dc2626',
    },
  },
  {
    id: 'warm',
    name: 'Warm',
    colors: {
      background: '#1c1917',
      surface: '#292524',
      primary: '#f97316',
      secondary: '#fb923c',
      text: '#fef3c7',
      textMuted: '#d6d3d1',
      accent: '#ef4444',
    },
  },
  {
    id: 'cegtec',
    name: 'CegTec',
    colors: {
      background: '#111133',
      surface: '#1a1a44',
      primary: '#3B4BF9',
      secondary: '#E93BCD',
      text: '#f0f0ff',
      textMuted: '#a0a0c0',
      accent: '#E93BCD',
    },
  },
];

export function getTheme(id: string): Theme {
  return themes.find((t) => t.id === id) || themes[0];
}
