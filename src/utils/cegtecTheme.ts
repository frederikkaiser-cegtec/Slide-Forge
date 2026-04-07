/**
 * CegTec Design System — Single Source of Truth
 *
 * ALLE Grafik-Komponenten sollen aus dieser Datei importieren.
 * Niemals Farben, Fonts oder Effekte direkt in Komponenten hartcodieren.
 *
 * Liest Brand-Config aus /brand.json — dort Fonts, Farben, Logo anpassen.
 */

import brand from '../../brand.json';

// ── Font Stacks (aus brand.json) ────────────────────────────────

export const FONTS = {
  mono: brand.fonts.mono,
  display: brand.fonts.display,
  ui: brand.fonts.ui,
} as const;

// ── Farb-System (aus brand.json) ────────────────────────────────

export const COLORS = {
  // Hintergruende
  bgLight: brand.colors.light.backgroundAlt,
  bgLightAlt: brand.colors.light.background,
  bgDark: brand.colors.dark.backgroundAlt,
  bgDarkAlt: brand.colors.dark.background,

  // Text
  titleLight: brand.colors.light.textTitle,
  titleDark: brand.colors.dark.textTitle,

  // Labels / Muted
  labelLight: brand.colors.light.label,
  labelDark: brand.colors.dark.label,

  // Akzentfarben
  filled: brand.colors.accent.filled,
  filledDark: brand.colors.accent.filledDark,
  accent1: brand.colors.accent.primary,
  accent2: brand.colors.accent.secondary,

  // Semantisch
  empty: brand.colors.accent.empty,
  border: brand.colors.light.border,
  success: brand.colors.accent.success,
  warning: brand.colors.accent.warning,
  danger: brand.colors.accent.danger,

  // Card-Farben
  cardLight: brand.colors.light.card,
  cardDark: 'rgba(255,255,255,0.02)',
} as const;

// ── Brand-Presets fuer Light/Dark Mode ──────────────────────────
// Verwendet in savedGraphicsStore.ts und Graphic-Komponenten.

export const BRAND_LIGHT = {
  bg: brand.colors.light.background,
  accent: brand.colors.accent.primary,
  accent2: brand.colors.accent.secondary,
  text: brand.colors.light.text,
  label: brand.colors.light.label,
  card: brand.colors.light.card,
  border: brand.colors.light.cardBorder,
  tag: brand.colors.light.tag,
} as const;

export const BRAND_DARK = {
  bg: brand.colors.dark.background,
  accent: brand.colors.accent.primary,
  accent2: brand.colors.accent.secondary,
  text: brand.colors.dark.text,
  label: brand.colors.dark.label,
  card: brand.colors.dark.card,
  border: brand.colors.dark.cardBorder,
  tag: brand.colors.dark.tag,
} as const;

// ── Standard-Farbset fuer Light-Mode-Grafiken ───────────────────
// Import als Spread in defaultData: { ...CEGTEC_LIGHT_DEFAULTS }

export const CEGTEC_LIGHT_DEFAULTS = {
  backgroundColor: COLORS.bgLight,
  textColor: COLORS.titleLight,
  labelColor: COLORS.labelLight,
  filledColor: COLORS.filled,
  emptyColor: COLORS.empty,
  borderColor: COLORS.border,
  warningColor: COLORS.filledDark,
} as const;

// ── Utility Functions ───────────────────────────────────────────

export function isDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

export function adjustBrightness(hex: string, amount: number): string {
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(1, 3), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(3, 5), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(5, 7), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

/** Logo filter — macht das Logo weiß auf dunklem Hintergrund */
export function logoFilter(bg: string): React.CSSProperties {
  return isDark(bg) ? { filter: 'brightness(0) invert(1)' } : {};
}

// ── SVG Background Components (React) ───────────────────────────
// Wiederverwendbare SVG-Elemente fuer den Hintergrund.
// `s` = Skalierungsfaktor, `uid` = unique prefix fuer filter IDs.

interface SvgBgProps {
  width: number;
  height: number;
  s: number;
  uid: string;
  dark: boolean;
}

/**
 * Noise-Filter Definition — in <defs> einbinden.
 * Usage: <NoiseFilterDef uid="rd" />
 * Then:  <rect ... filter="url(#rd-noise)" />
 */
export function noiseFilterDef(uid: string) {
  return {
    id: `${uid}-noise`,
    baseFrequency: '0.9',
    numOctaves: '4',
  };
}

/**
 * Scanlines — horizontale Linien alle 5*s Pixel.
 * Gibt ein Array von rect-Props zurueck.
 */
export function scanlineProps({ height, s, dark }: { height: number; s: number; dark: boolean }) {
  const count = Math.floor(height / (5 * s));
  return {
    count,
    gap: 5 * s,
    lineHeight: 1 * s,
    fill: dark ? '#ffffff' : '#000000',
    opacity: dark ? 0.006 : 0.01,
  };
}

/**
 * Card-Style fuer Light-Mode-Grafiken.
 * Gibt ein CSSProperties-Objekt zurueck.
 */
export function cardStyle(s: number, dark: boolean, borderCol?: string): React.CSSProperties {
  return {
    background: dark ? COLORS.cardDark : COLORS.cardLight,
    border: `1.5px solid ${borderCol || COLORS.border}`,
    borderRadius: 8 * s,
  };
}

// ── Typography Helpers ──────────────────────────────────────────

/** Mono label style — z.B. fuer Source-Labels, Badges, Tags */
export function monoLabel(s: number, color?: string): React.CSSProperties {
  return {
    fontFamily: FONTS.mono,
    fontSize: 10 * s,
    fontWeight: 600,
    color: color || COLORS.labelLight,
    letterSpacing: 2 * s,
    textTransform: 'uppercase' as const,
  };
}

/** Display headline style */
export function displayHeadline(s: number, fontSize: number, color?: string): React.CSSProperties {
  return {
    fontFamily: FONTS.display,
    fontSize: fontSize * s,
    fontWeight: 800,
    color: color || COLORS.titleLight,
    lineHeight: 1.08,
    letterSpacing: -1.5 * s,
    margin: 0,
  };
}
