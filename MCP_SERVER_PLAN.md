# SlideForge MCP Server – Implementierungsplan

## Ziel

Lokaler MCP Server damit andere User SlideForge über ihr Claude Code CLI ansteuern können. Alle 3 Modi (Grafiken, Diagramme, Slides) werden exponiert.

---

## Architektur

```
Claude Code CLI
    │ stdio (JSON-RPC)
    ▼
MCP Server (Node.js, tsx)
    │
    ├── spawnt ──→ Vite Dev Server (localhost:<random-port>)
    ├── startet ──→ Playwright (headless Chromium)
    │                  │
    │                  └─→ http://localhost:<port>/Slide-Forge/?mcp=1
    │                  └─→ page.evaluate() steuert Zustand Stores
    │                  └─→ Screenshots / In-Browser Export
    │
    └── returniert base64 oder Dateipfad
```

**Warum Playwright statt SSR?** Die Grafiken sind React-Komponenten mit Tailwind, Recharts, Framer Motion, TipTap etc. – ohne echten Browser kein korrektes Rendering möglich. Playwright ist schon im Projekt.

**Lazy Init:** Vite + Playwright starten erst beim ersten Tool-Call (~2-3s). Danach wird die gleiche Browser-Instanz wiederverwendet.

---

## Neue Dateien

```
src/mcp/
  server.ts          – MCP Server Entry (stdio Transport)
  bridge.ts          – Playwright Browser Manager (Vite spawnen, navigieren, evaluate)
  browserBridge.ts   – Client-seitige Bridge (window.__SF_BRIDGE__ bei ?mcp=1)
  schemas.ts         – Zod/JSON Schemas für alle Tool-Inputs
  tools/
    graphics.ts      – Tool Handler für alle 13 Grafik-Typen
    diagrams.ts      – Tool Handler für Diagramm-Operationen
    slides.ts        – Tool Handler für Präsentations-Operationen
    shared.ts        – Gemeinsame Utilities (Export-Helper, Fehlerbehandlung)
```

Neuer npm Script: `"mcp": "tsx src/mcp/server.ts"`

---

## Tools

### Grafiken

| Tool | Parameter | Rückgabe |
|------|-----------|----------|
| `list_graphic_types` | – | Array: `{ id, label, defaultFormat, forceFormat, dataShape }` |
| `get_graphic_defaults` | `type` (required) | Default-Daten JSON für den Typ |
| `create_graphic` | `type` (required), `data` (optional), `format` (optional), `imageType` (optional: png/jpeg), `outputPath` (optional) | `{ base64, mimeType, width, height }` oder `{ filePath }` |
| `list_formats` | – | 8 Format-Presets mit Dimensionen |

### Diagramme

| Tool | Parameter | Rückgabe |
|------|-----------|----------|
| `list_diagram_templates` | – | Array: `{ id, name, description, diagramType }` |
| `create_diagram` | `template` (optional), `title` (optional), `diagramType` (optional), `nodes` (optional), `edges` (optional), `autoLayout` (optional, default: true) | `{ diagramId, nodeCount, edgeCount }` |
| `update_diagram` | `addNodes`, `removeNodeIds`, `addEdges`, `removeEdgeIds`, `title`, `autoLayout` (alle optional) | `{ nodeCount, edgeCount }` |
| `export_diagram` | `format` (required: svg/png/html), `outputPath` (optional), `animated` (optional) | base64/String oder Dateipfad |

**Hinweis:** SVG-Export (`generateAnimatedSVG()`) ist eine reine Funktion – braucht keinen Browser! Nur PNG-Rasterisierung braucht Playwright.

### Slides

| Tool | Parameter | Rückgabe |
|------|-----------|----------|
| `list_slide_templates` | – | 9 Slide-Templates |
| `list_themes` | – | 6 Themes mit Farbpaletten |
| `create_presentation` | `title` (optional), `theme` (optional), `format` (optional), `slides` (optional: Array mit template/elements/background) | `{ presentationId, slideCount, slideIds }` |
| `update_presentation` | `title`, `theme`, `format`, `addSlide`, `removeSlideId`, `updateSlide` (alle optional) | `{ slideCount, slideIds }` |
| `export_presentation` | `format` (required: pdf/png-single/jpg-single), `slideIndex` (optional), `outputPath` (optional) | base64 oder Dateipfad |

---

## Browser Bridge (`window.__SF_BRIDGE__`)

Wird nur geladen wenn `?mcp=1` in der URL. Gibt dem MCP Server direkten Zugriff auf Zustand Stores via `page.evaluate()`.

```ts
window.__SF_BRIDGE__ = {
  // Grafiken
  setGraphicType: (type: string) => void,
  setGraphicData: (type: string, data: any) => void,
  setGraphicFormat: (formatId: string) => void,
  getGraphicRef: () => HTMLElement | null,

  // Diagramme
  loadDiagram: (diagram: Diagram) => void,
  getDiagramState: () => Diagram,

  // Slides
  loadPresentation: (presentation: Presentation) => void,
  getPresentationState: () => Presentation,
  addSlide: (slide: Slide, index?: number) => void,

  // Export
  exportGraphicAsPng: (w: number, h: number) => Promise<string>,
  exportDiagramAsSvg: () => string,
  exportSlidesAsPdf: () => Promise<Blob>,

  // Navigation
  setMode: (mode: 'graphic' | 'diagram' | 'slides') => void,
}
```

---

## Setup für End-User

### Voraussetzungen
- Node.js 18+
- Repo klonen + `npm install`
- `npx playwright install chromium`

### Claude Code Konfiguration

```json
{
  "mcpServers": {
    "slide-forge": {
      "command": "npx",
      "args": ["tsx", "src/mcp/server.ts"],
      "cwd": "/pfad/zu/slide-forge"
    }
  }
}
```

---

## Implementierungs-Reihenfolge

### Phase 1: Foundation
- [ ] `@modelcontextprotocol/sdk` installieren
- [ ] `src/mcp/server.ts` – MCP Server mit stdio Transport, Tool-Definitionen registrieren
- [ ] `src/mcp/bridge.ts` – Playwright Manager: Vite starten, Browser launchen, navigate, evaluate-Helper
- [ ] `src/mcp/browserBridge.ts` – Client-seitige Bridge bei `?mcp=1`
- [ ] `App.tsx` anpassen: Bridge conditional laden
- [ ] `package.json`: `"mcp"` Script hinzufügen

### Phase 2: Grafik-Tools
- [ ] `list_graphic_types` – Liest aus GRAPHIC_REGISTRY
- [ ] `get_graphic_defaults` – Returniert defaultData
- [ ] `create_graphic` – Typ + Daten + Format im Browser setzen, Screenshot, base64 zurück
- [ ] `list_formats` – Reine Daten

### Phase 3: Diagramm-Tools
- [ ] `list_diagram_templates` – Liest aus diagramTemplates
- [ ] `create_diagram` – Diagram-Objekt bauen, optional autoLayout, in Browser laden
- [ ] `export_diagram` – SVG direkt (ohne Browser!), PNG via Playwright, HTML via Exporter
- [ ] `update_diagram` – State-Manipulation via Bridge

### Phase 4: Slides-Tools
- [ ] `list_slide_templates` – 9 Templates
- [ ] `list_themes` – 6 Themes
- [ ] `create_presentation` – Presentation-Objekt aus Templates bauen
- [ ] `update_presentation` – Slides/Elemente hinzufügen/ändern/löschen
- [ ] `export_presentation` – PDF via In-Browser jsPDF, PNG/JPG via Playwright

### Phase 5: Polish
- [ ] Error Handling + Timeouts + Retry-Logik
- [ ] Graceful Shutdown (Vite + Playwright aufräumen bei SIGTERM)
- [ ] README-Abschnitt zum MCP Setup
- [ ] Playwright Chromium in postinstall sicherstellen

---

## Dependencies

| Paket | Status |
|-------|--------|
| `@modelcontextprotocol/sdk` | **Neu** – einzige neue Dependency |
| `playwright` | Bereits in devDependencies |
| `tsx` | Bereits vorhanden |
| `html-to-image` | Bereits vorhanden (wird in-browser genutzt) |
| `jsPDF` | Bereits vorhanden (wird in-browser genutzt) |

---

## Einschränkungen v1

- **Kein GIF/Video-Export** – `html2canvas` + `MediaRecorder` sind fragil headless. SVG mit Animationen ist die bessere v1-Story.
- **Single Browser Instance** – Alle Operationen teilen sich eine Page. Kein paralleles Rendering.
- **Nur lokal** – Kein Remote/Cloud-Deployment geplant.

---

## Entscheidungen

| Entscheidung | Begründung |
|-------------|------------|
| Playwright statt SSR | 100% der Rendering-Logik wird wiederverwendet, kein Reimplementieren nötig |
| Lazy Init | Spart Ressourcen wenn Tools nicht gebraucht werden |
| SVG-Export ohne Browser | `generateAnimatedSVG()` ist eine pure Funktion, schneller + zuverlässiger |
| base64 + Dateipfad Output | base64 für inline-Inspektion durch Claude, Dateipfad für Weiterverarbeitung |
| `?mcp=1` Query Param | Saubere Trennung: Bridge wird nur geladen wenn MCP aktiv ist |
