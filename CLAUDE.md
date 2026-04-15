# SlideForge — Claude Code Project Guide

## Project Overview
Grafik-Generator und Content-Engine fuer CegTec. Erstellt LinkedIn-Grafiken, Case-Study-Visualisierungen, Diagramme und Praesentationen.

**Stack:** React 19 + Vite 7 + Tailwind CSS 4 + Zustand + Playwright
**Dev Server:** `npm run dev` (Port 5173, Base Path `/Slide-Forge/`)
**API Server:** `npm run server` (Port 3000)
**Repo:** `frederikkaiser-cegtec/Slide-Forge`

## Commands
- `npm run dev` — Vite Dev Server (localhost:5173/Slide-Forge/)
- `npm run server` — Express + Playwright API Server (localhost:3000)
- `npm run build` — Production Build
- `npm run cli -- list-templates` — CLI Diagram Templates

## Architecture
```
src/
  App.tsx                    — Haupt-UI (Graphic Mode, Sidebar, Export)
  bridge.ts                  — Browser Bridge fuer Server-Rendering (?mcp=1)
  registry/registry.ts       — GRAPHIC_REGISTRY: alle 20 Templates
  components/graphics/       — 20 Grafik-Komponenten + Forms
  stores/                    — Zustand Stores
  themes/                    — 6 Themes (midnight, clean, corporate, minimal, warm, cegtec)
  utils/formats.ts           — 9 Format-Presets
  export/                    — HTML/SVG/CSS/GIF/Video Exporter

server/
  index.ts                   — Express Server Entry
  renderService.ts           — Playwright Render Service
  mcp.ts                     — MCP Server (Streamable HTTP)
  routes/                    — REST API Routes
```

## Key Conventions
- Alle Farben dynamisch einstellbar (ColorRow: nur 6-char Hex, kein rgba!)
- Save/Load: Zustand + localStorage
- Export: PNG/JPG via html-to-image
- Sprache: Deutsch

---

## Design System (IMMER AKTIV)

Dieses Design-System gilt fuer JEDE Grafik-Komponente. Keine Ausnahmen.

### 1. CegTec Design Tokens (cegtecTheme.ts = Single Source of Truth)

| Token | Hex | Usage |
|-------|-----|-------|
| `bgLight` | `#F8F7F4` | Default Background (warm off-white) |
| `bgLightAlt` | `#F5F5F0` | Alt Background |
| `bgDark` | `#080820` | Dark Mode Background |
| `filled` | `#2563EB` | Primary Blue — Headlines, Accents, CTAs |
| `filledDark` | `#1A3FD4` | Deep Blue — Secondary Accent |
| `titleLight` | `#1A1A2E` | Body Text auf hellen Hintergruenden |
| `labelLight` | `#8A8A9A` | Muted Labels, Secondary Text |
| `border` | `#E5E5EA` | Card Borders, Dividers |
| `success` | `#10B981` | Positive Metriken |
| `warning` | `#F59E0B` | Warnung |
| `danger` | `#EF4444` | Negative Metriken |

### Fonts
- **Display**: `'DM Sans', 'Plus Jakarta Sans'` — Headlines (700-800)
- **Mono**: `'JetBrains Mono', 'IBM Plex Mono'` — Badges, Labels, Datenwerte (600-700)

### Default: Immer `CEGTEC_LIGHT_DEFAULTS` spreaden, nie Themes ohne User-Permission wechseln.

### 2. Scale Factor Pattern (PFLICHT)

Jede Grafik MUSS einen Scale Factor nutzen:
```typescript
const s = Math.min(width / REF_WIDTH, height / REF_HEIGHT);
```
- Referenz-Dimensionen passend zum Primaer-Format (1080x1080 fuer 1:1, etc.)
- ALLE Pixelwerte mit `s` multiplizieren: Font-Sizes, Padding, Margins, Border-Radius, Gaps
- Nie rohe Pixelwerte verwenden

Format-Adaptiv:
```typescript
const isTall = height > width * 1.3;
const s = isTall ? Math.min(w/1080, h/1920) : Math.min(w/1080, h/1080);
```

### 3. Typography Hierarchy (4 Levels)

| Level | Element | Font | Weight | Size | Tracking |
|-------|---------|------|--------|------|----------|
| 1 | Headline | Display | 800 | 42-56*s | -1.5 bis -2*s |
| 2 | Subheadline | Display | 600-700 | 18-24*s | -0.5*s |
| 3 | Body/Labels | Display | 500-600 | 13-16*s | 0 |
| 4 | Badges/Tags | Mono | 600-700 | 10-13*s | 2-3*s, uppercase |

- Headlines: tight negative letter-spacing, line-height 1.05-1.1
- Letzte Headline-Zeile oft in `filledColor` fuer Emphasis
- Mono: immer uppercase mit grosszuegigem letter-spacing
- Deutscher Text ist ~30% laenger als Englisch — Overflow beachten

### 4. SVG Background Layer (Atmosphaere)

Layer-Stack (unten nach oben):
1. Base fill: `<rect>` mit backgroundColor
2. Orbs: 1-3 `<ellipse>` mit Primary/Accent, Opacity 0.03-0.06, Gaussian Blur 80-120*s
3. Accent Stripe: Duenner `<rect>` oben (3-4*s) mit Gradient filled→transparent
4. Content Shapes: Funnel-Segmente, Daten-Bars, geometrische Elemente
5. Noise Overlay: `<rect>` mit feTurbulence, Opacity 0.01-0.015
6. Scanlines (optional): Horizontale Linien alle 5*s px, Opacity 0.006-0.01

Unique IDs pro Komponente (Prefix mit Komponenten-Kuerzel) gegen SVG-Filter-Konflikte.

### 5. Layout Pattern

```
+----------------------------------+
| [Logo]              [BADGE TEXT] |  Header Row
|                                  |
| | CATEGORY TAG                   |  Accent Bar + Mono Label
|                                  |
| Multi-line                       |  Display Headline
| Headline Here                    |  (letzte Zeile in Primary Blue)
|                                  |
| +------------------------------+ |
| |     Main Visual Content      | |  Cards, Charts, Funnel, Bars
| +------------------------------+ |
|                                  |
| +-- Footer / CTA -------------+ |  Subtle Card mit Mono Text
| +------------------------------+ |
+----------------------------------+
```

Card Style:
- Background: `#ffffff` (light) oder `rgba(255,255,255,0.02)` (dark)
- Border: `1.5px solid` mit border color
- Border-radius: `8-12*s`
- KEIN box-shadow, KEIN backdrop-filter (bricht html-to-image Export)

Spacing:
- Outer Padding: `40-52*s`
- Content Gaps: `12-20*s`
- Card Inner Padding: `14-20*s`

### 6. Farb-Anwendung

- **Blue (#2563EB)**: Headlines (partiell), Badges, Accent Bars, primaere Daten
- **Green (#10B981)**: Positive States, verifizierte Daten
- **Amber (#F59E0B)**: Warning, in-progress
- **Red (#EF4444)**: Negative Metriken (sparsam)
- Max 3 distinkte Farben pro Grafik (plus Neutrals)

Farbinterpolation fuer Sequenzen (Funnel, Pipeline):
```typescript
function stageColor(i: number, n: number): [number, number, number] {
  const t = n > 1 ? i / (n - 1) : 0;
  return [Math.round(startR + (endR - startR) * t), ...];
}
```

### 7. Anti-Patterns (NIEMALS)

**Visuell:**
- Kein box-shadow (bricht Export)
- Kein backdrop-filter/blur auf Content (bricht Export)
- Keine CSS Animations/Transitions (statischer Output)
- Keine Gradients auf Text (unzuverlaessig im Export)
- Keine Opacity unter 0.15 fuer sichtbare Shapes

**Code:**
- Nie Hex-Farben hardcoden — immer aus cegtecTheme importieren
- Nie rohe Pixelwerte — immer `* s`
- Nie `position: fixed`
- Nie Font-Families innerhalb einer Hierarchie-Ebene mischen
- Nie Themes wechseln ohne explizite User-Permission

**Design:**
- Keine generische AI-Aesthetik (Purple Gradients, Inter Font, Cookie-Cutter Layouts)
- Kein Glassmorphism (Export-inkompatibel)
- Keine Emoji in professionellen Grafiken
- Keine dekorativen Elemente ohne Informations-Funktion

### 8. Export-Optimierung

- Target: `html-to-image` mit `pixelRatio: 3`
- Aller Text als HTML (nicht SVG `<text>`) fuer scharfes Rendering
- SVG nur fuer: Hintergruende, Shapes, dekorative Elemente
- Content-Overlay: `position: relative; zIndex: 1` ueber dem SVG
- Logo: immer `logoFilter(bg)` fuer Dark-Background-Kompatibilitaet
- Bevorzugtes Format: PNG (JPG wird von LinkedIn doppelt komprimiert)

### 9. Design-Entscheidungs-Framework

1. **Was ist die eine Key Message?** — Design drumherum, groesstes/prominentestes Element
2. **Welches Format ist primaer?** — Dafuer zuerst designen, dann adaptieren
3. **Informations-Hierarchie** — Max 3 Levels visueller Wichtigkeit
4. **Whitespace ist intentional** — Zum Trennen nutzen, nicht mit Deko fuellen
5. **Bei Export-Groesse testen** — Was bei 2x Zoom gut aussieht, kann bei 1080px unleserlich sein

### Stil-Richtung
- **Ton**: Technisch-editorial, datengetrieben, B2B SaaS
- **Aesthetik**: Clean aber nicht steril — warme Off-White Hintergruende, blaue Akzente, Monospace-Daten-Labels = "Dashboard Report" Feel
- **Differentiator**: SVG Atmosphaere-Layers (Orbs, Noise, Scanlines) schaffen Tiefe ohne Clutter
- **Referenz**: Bloomberg Terminal meets Stripe Documentation
