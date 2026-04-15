---
name: slide-forge-design
description: Master design skill for Slide-Forge static graphic generation. CegTec brand system, layout patterns, typography hierarchy, SVG atmosphere, format-adaptive rendering. Use when creating or modifying any graphic component.
---

# Slide-Forge Design Skill

You are designing **static graphics** exported as PNG/JPG via html-to-image. These are NOT interactive web pages. No animations, no hover states, no accessibility concerns — pure visual output optimized for social media and presentations.

---

## 1. CegTec Design System (MANDATORY)

**cegtecTheme.ts is the Single Source of Truth.** Never hardcode colors, fonts, or spacing.

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `bgLight` | `#F8F7F4` | Default background (warm off-white) |
| `bgLightAlt` | `#F5F5F0` | Alt background (slightly cooler) |
| `bgDark` | `#080820` | Dark mode background |
| `filled` | `#2563EB` | Primary blue — headlines, accents, CTAs |
| `filledDark` | `#1A3FD4` | Deep blue — secondary accent |
| `titleLight` | `#1A1A2E` | Body text on light backgrounds |
| `labelLight` | `#8A8A9A` | Muted labels, secondary text |
| `border` | `#E5E5EA` | Card borders, dividers |
| `success` | `#10B981` | Positive metrics, verified states |
| `warning` | `#F59E0B` | Caution, review states |
| `danger` | `#EF4444` | Negative metrics |

### Fonts
- **Display**: `'DM Sans', 'Plus Jakarta Sans'` — headlines, titles (weight 700-800)
- **Mono**: `'JetBrains Mono', 'IBM Plex Mono'` — badges, labels, data values (weight 600-700)

### Default Color Set
Always spread `CEGTEC_LIGHT_DEFAULTS` into `defaultData` unless the graphic explicitly requires dark mode. Never switch themes without user permission.

---

## 2. Scale Factor Pattern (MANDATORY)

Every graphic MUST use a scale factor for all dimensions:

```typescript
const s = Math.min(width / REF_WIDTH, height / REF_HEIGHT);
```

- **Reference dimensions**: Match the primary format (1080x1080 for 1:1, 1080x1920 for 9:16, 1200x630 for OG)
- **ALL pixel values** get multiplied by `s`: font sizes, padding, margins, border-radius, gaps, icon sizes
- **Never use raw pixel values** — always `value * s`

### Format-Adaptive Layouts
When a graphic must work across very different aspect ratios (e.g., 1:1 AND 9:16):

```typescript
const isTall = height > width * 1.3;
const s = isTall ? Math.min(w/1080, h/1920) : Math.min(w/1080, h/1080);
```

Then branch layout logic based on `isTall`. Design each layout independently — don't force one layout to stretch.

---

## 3. Typography Hierarchy

Every graphic needs a clear 4-level hierarchy:

| Level | Element | Font | Weight | Size Range | Tracking |
|-------|---------|------|--------|-----------|----------|
| **1** | Headline | Display | 800 | 42-56 * s | -1.5 to -2 * s |
| **2** | Subheadline | Display | 600-700 | 18-24 * s | -0.5 * s |
| **3** | Body/Labels | Display | 500-600 | 13-16 * s | 0 |
| **4** | Badges/Tags | Mono | 600-700 | 10-13 * s | 2-3 * s, uppercase |

### Typography Rules
- Headlines: tight negative letter-spacing, line-height 1.05-1.1
- Last headline line often colored with `filledColor` for emphasis
- Mono text: always uppercase with generous letter-spacing
- Use `whiteSpace: 'pre-line'` for multi-line headlines with `\n`
- German text is ~30% longer than English — account for overflow

---

## 4. Visual Atmosphere (SVG Background Layer)

Every graphic uses a layered SVG background for depth:

### Layer Stack (bottom to top)
1. **Base fill**: `<rect>` with `backgroundColor`
2. **Orbs**: 1-3 `<ellipse>` with primary/accent colors, low opacity (0.03-0.06), heavy Gaussian blur (80-120*s)
3. **Accent stripe**: Thin `<rect>` at top (3-4*s height) with gradient from filled→transparent
4. **Content shapes**: Funnel segments, data bars, geometric elements
5. **Noise overlay**: `<rect>` with feTurbulence filter, opacity 0.01-0.015
6. **Scanlines** (optional): Horizontal lines every 5*s px, opacity 0.006-0.01

### SVG Filter Definitions
```tsx
<defs>
  <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation={90 * s} />
  </filter>
  <filter id="noise">
    <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
    <feColorMatrix type="saturate" values="0" />
    <feBlend in="SourceGraphic" mode="multiply" />
  </filter>
</defs>
```

Use unique IDs per component (prefix with component abbreviation) to avoid SVG filter conflicts.

---

## 5. Layout Patterns

### Standard Graphic Structure
```
┌──────────────────────────────────┐
│ [Logo]              [BADGE TEXT] │  ← Header row
│                                  │
│ ┃ CATEGORY TAG                   │  ← Accent bar + mono label
│                                  │
│ Multi-line                       │  ← Display headline
│ Headline Here                    │     (last line in primary blue)
│                                  │
│ ┌─────────────────────────────┐  │
│ │     Main Visual Content     │  │  ← Cards, charts, funnel, bars
│ │                             │  │
│ └─────────────────────────────┘  │
│                                  │
│ ┌─ Footer / CTA ──────────────┐  │  ← Subtle card with mono text
│ └─────────────────────────────┘  │
└──────────────────────────────────┘
```

### Card Style
- Background: `#ffffff` (light) or `rgba(255,255,255,0.02)` (dark)
- Border: `1.5px solid` with border color
- Border-radius: `8-12 * s`
- No box-shadow (breaks in html-to-image export)
- No backdrop-filter/glassmorphism (breaks in export)

### Spacing
- Outer padding: `40-52 * s`
- Content gaps: `12-20 * s`
- Card inner padding: `14-20 * s`

---

## 6. Color Application

### Primary Palette Usage
- **Blue (#2563EB)**: Headlines (partial), badges, accent bars, primary data
- **Green (#10B981)**: Positive states, verified data, success metrics
- **Amber (#F59E0B)**: Warning states, in-progress
- **Red (#EF4444)**: Negative metrics, errors (use sparingly)

### Color Interpolation for Sequences
When showing stages/steps that progress (funnel, pipeline):
```typescript
function stageColor(i: number, n: number): [number, number, number] {
  const t = n > 1 ? i / (n - 1) : 0;
  return [
    Math.round(startR + (endR - startR) * t),
    Math.round(startG + (endG - startG) * t),
    Math.round(startB + (endB - startB) * t),
  ];
}
```
Common gradients: blue→green (pipeline), blue→purple (features), blue→amber (funnel)

### Opacity Patterns
- Orb overlays: 0.03-0.06
- Card backgrounds on dark: 0.02-0.05
- Noise texture: 0.01-0.015
- Shape fills: 0.25-0.45 (higher = more visible)
- Shape strokes: 0.4-0.7

---

## 7. Data Visualization

### Funnel/Trapezoid Shapes
Use SVG `<polygon>` with 4 points for true trapezoid segments:
```typescript
const points = [
  `${cx - topHalf},${y1}`,
  `${cx + topHalf},${y1}`,
  `${cx + botHalf},${y2}`,
  `${cx - botHalf},${y2}`,
].join(' ');
```

### Progress Bars
- Use `<div>` with percentage width
- Filled portion: primary color at 0.2-0.4 opacity with solid border
- Add highlight line at top for depth

### Metric Cards
- Value in large display font (28-36*s), colored
- Label below in smaller text (12-14*s), muted
- Optional percentage badge in mono

---

## 8. Anti-Patterns (NEVER DO)

### Visual
- No box-shadow (breaks html-to-image export)
- No backdrop-filter/blur on content elements (breaks export)
- No CSS animations or transitions (static output)
- No gradients on text (unreliable in export)
- No absolute positioning for labels over dynamic SVG shapes in compact formats
- No opacity below 0.15 for shapes that should be visible

### Code
- Never hardcode hex colors — import from cegtecTheme
- Never use raw pixel values — always multiply by scale factor `s`
- Never use `position: fixed`
- Never mix font families within one hierarchy level
- Never change the color theme (light/dark) without explicit user permission

### Design
- No generic AI aesthetics (purple gradients, Inter font, cookie-cutter layouts)
- No Glassmorphism/frosted-glass effects (export-incompatible)
- No emoji in professional graphics
- No decorative elements that don't serve the information hierarchy
- No more than 3 distinct colors in a single graphic (plus neutrals)

---

## 9. Export Optimization

- Target: `html-to-image` with `pixelRatio: 3`
- All text must be HTML (not SVG `<text>`) for crisp rendering
- SVG only for: backgrounds, shapes, decorative elements
- Content overlay uses `position: relative; zIndex: 1` over the SVG
- Logo: always use `logoFilter(bg)` for dark background compatibility
- Preferred format: PNG (JPG gets double-compressed by LinkedIn)

---

## 10. Design Decision Framework

When designing a new graphic or redesigning an existing one:

1. **What's the one key message?** — Design around it, make it the largest/most prominent element
2. **What format is primary?** — Design for that first, adapt for others
3. **Information hierarchy** — Max 3 levels of visual importance
4. **Whitespace is intentional** — Use it to separate sections, not fill it with decoration
5. **Test at export size** — What looks good at 2x zoom may be illegible at 1080px

### Style Direction for CegTec
- **Tone**: Technical-editorial, data-driven, B2B SaaS
- **Aesthetic**: Clean but not sterile — warm off-white backgrounds, blue accents, mono-spaced data labels give a "dashboard report" feel
- **Differentiator**: SVG atmosphere layers (orbs, noise, scanlines) add depth without clutter
- **Reference**: Bloomberg Terminal meets Stripe documentation
