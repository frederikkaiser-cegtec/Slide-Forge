/**
 * CegTec Design System — Single Source of Truth
 *
 * ALLE Grafik-Komponenten sollen aus dieser Datei importieren.
 * Niemals Farben, Fonts oder Effekte direkt in Komponenten hartcodieren.
 *
 * Zwei Varianten:
 *   LIGHT — #F8F7F4 / #F5F5F0 Hintergrund (Data-Pipeline, Outreach, Academy, LinkedIn)
 *   DARK  — #080820 / #070718 / #0A1628 Hintergrund (Case Study, ROI, KPI Banner)
 */

// ── Font Stacks ─────────────────────────────────────────────────
// Canonical order: the first font is the primary, rest are fallbacks.
// Data-Pipeline-Grafiken nutzen JetBrains Mono zuerst,
// OutboundStack/Academy nutzen IBM Plex Mono zuerst.
// Beide sind akzeptabel — Hauptsache konsistent pro Grafik-Gruppe.

export const FONTS = {
  mono: "'JetBrains Mono', 'IBM Plex Mono', 'SF Mono', monospace",
  display: "'DM Sans', 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
} as const;

// ── Farb-System ─────────────────────────────────────────────────

export const COLORS = {
  // Hintergruende
  bgLight: '#F8F7F4',       // Data-Pipeline, Outreach, Multichannel
  bgLightAlt: '#F5F5F0',    // OutboundStack, Academy, AgentFriendly
  bgDark: '#080820',        // Case Study
  bgDarkAlt: '#070718',     // ROI

  // Text
  titleLight: '#1A1A2E',    // Titel auf hellem Hintergrund
  titleDark: '#ffffff',      // Titel auf dunklem Hintergrund

  // Labels / Muted
  labelLight: '#8A8A9A',    // Labels auf hellem Hintergrund
  labelDark: '#8888a0',     // Labels auf dunklem Hintergrund

  // Akzentfarben
  filled: '#2563EB',        // Primaer-Blau (Deep Blue Primary)
  filledDark: '#1A3FD4',    // Deep Blue Dark / Warning-Akzent
  accent1: '#3B4BF9',       // Case Study / Infographic Akzent 1
  accent2: '#E93BCD',       // Case Study / Infographic Akzent 2 (Pink)

  // Semantisch
  empty: '#D4D4D8',         // Leere / fehlende Daten
  border: '#E5E5EA',        // Rahmenfarbe (Light Mode)
  success: '#10B981',       // Verifiziert / Enriched
  warning: '#F59E0B',       // Review / Pruefung
  danger: '#EF4444',        // Fehler / negative Stats

  // Card-Farben (Light Mode — solide, kein Glassmorphism)
  cardLight: '#ffffff',
  cardDark: 'rgba(255,255,255,0.02)',
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
