# SlideForge

Grafik-Generator und Content-Engine fuer CegTec. Erstellt LinkedIn-Grafiken, Case-Study-Visualisierungen, Diagramme und Praesentationen.

## Quick Start

```bash
npm install
npm run dev          # Web UI auf http://localhost:5173/Slide-Forge/
npm run server       # API Server auf http://localhost:3000
```

## Architektur

```
SlideForge Server (Express)
  |
  +-- REST API    /api/v1/*    (Templates, Grafik-Rendering, Diagramme)
  +-- MCP Server  /mcp         (Claude Code Integration)
  +-- Web UI      /Slide-Forge/ (React SPA)
  |
  +-- RenderService (Playwright headless Chromium)
      Laedt die React App, setzt Template + Daten, macht Screenshot -> PNG/JPG
```

## Templates (20 Grafik-Typen)

| ID | Name | Format | Beschreibung |
|----|------|--------|-------------|
| `case-study` | Case Study | A4 | Hero-Metrik + Secondary Metrics + Chart |
| `roi` | ROI | LinkedIn | ROI-Berechnung mit Metric-Cards |
| `kpi-banner` | KPI Banner | Banner | Grid von KPI-Karten |
| `revenue-systems` | Systems | OG | 3-Karten-Layout mit SVG Connections |
| `infographic` | Infografik | OG | 3 KPIs + Sales Funnel |
| `academy` | Academy | 9:16 | Story-Format Academy Content |
| `raw-data` | Raw Data | 16:9 | Daten-Visualisierung |
| `enriched-data` | Enriched | 16:9 | Angereicherte Daten |
| `qualified-data` | Qualified | 16:9 | Qualifizierte Leads |
| `personalized-outreach` | Outreach | 16:9 | Outreach-Personalisierung |
| `multichannel-outreach` | Multichannel | 16:9 | Multi-Channel Kampagnen |
| `outbound-stack` | Stack | 9:16 | Tool-Stack Uebersicht |
| `agent-friendly` | AI-Ready | 9:16 | AI-Readiness Grafik |
| `linkedin-post` | LinkedIn Post | 1:1 | LinkedIn Content Cards |
| `comparison` | Vergleich | 1:1 | Side-by-Side Vergleich |
| `timeline` | Timeline | 16:9 | Zeitstrahl |
| `funnel` | Funnel | 1:1 | Trichter-Visualisierung |
| `outreach-pipeline` | Pipeline | 9:16 | Outreach-Pipeline Flow |
| `prompt-card` | Prompt Card | 9:16 | AI Prompt Vorlagen |
| `quote-card` | Quote Card | 1:1 | Zitat-Karten |

## Formate

| ID | Abmessungen | Verwendung |
|----|-------------|------------|
| `16:9` | 1920x1080 | Praesentationen, Breitbild |
| `1:1` | 1080x1080 | LinkedIn Posts, Instagram |
| `9:16` | 1080x1920 | Stories, Reels |
| `4:5` | 1080x1350 | Instagram Feed |
| `linkedin` | 1200x627 | LinkedIn Link-Preview |
| `og` | 1200x630 | OG Image / Social Preview |
| `banner` | 1200x400 | Banner |
| `banner-wide` | 1600x400 | Breiter Banner |
| `a4` | 1240x1754 | DIN A4 Portrait |

## Themes

6 Themes: `midnight`, `clean`, `corporate`, `minimal`, `warm`, `cegtec`

Brand-Farben in `brand.json`.

---

## API-Nutzung

### Auth

API-Key via Header: `X-API-Key: dein-key`

Wenn keine Keys konfiguriert sind (kein `SLIDEFORGE_API_KEYS` in Env), ist Auth deaktiviert.

### Templates auflisten

```bash
curl -H "X-API-Key: $KEY" http://localhost:3000/api/v1/templates
```

### Template-Details abrufen

```bash
curl -H "X-API-Key: $KEY" http://localhost:3000/api/v1/templates/linkedin-post
```

### Grafik erstellen (PNG)

```bash
curl -X POST http://localhost:3000/api/v1/graphics \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $KEY" \
  -d '{"template":"linkedin-post","data":{"topLabel":"CegTec","headline":"3x Reply Rate"},"format":"1:1"}' \
  --output grafik.png
```

### Grafik als JSON (base64)

```bash
curl -X POST "http://localhost:3000/api/v1/graphics?response=json" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $KEY" \
  -d '{"template":"funnel","format":"1:1"}'
```

Antwort:
```json
{
  "base64": "iVBORw0KGgo...",
  "mimeType": "image/png",
  "width": 1080,
  "height": 1080
}
```

### Diagramm erstellen (HTML)

```bash
curl -X POST http://localhost:3000/api/v1/diagrams \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $KEY" \
  -d '{"template":"sales-pipeline","theme":"cegtec"}' \
  --output diagramm.html
```

### Formate und Themes

```bash
curl http://localhost:3000/api/v1/formats
curl http://localhost:3000/api/v1/themes
```

---

## MCP-Integration (Claude Code)

SlideForge laeuft als MCP Server (Streamable HTTP). Claude Code kann direkt Grafiken erstellen.

### Setup in Claude Code

In `~/.claude/settings.json` oder Projekt-Config:
```json
{
  "mcpServers": {
    "slide-forge": {
      "type": "streamable-http",
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

Fuer Remote-Server:
```json
{
  "mcpServers": {
    "slide-forge": {
      "type": "streamable-http",
      "url": "https://slideforge.onrender.com/mcp",
      "headers": { "X-API-Key": "dein-key" }
    }
  }
}
```

### Verfuegbare MCP Tools

| Tool | Beschreibung |
|------|-------------|
| `list_templates` | Alle 20 Templates mit IDs und Defaults |
| `get_template_defaults` | Default-Daten fuer ein Template |
| `create_graphic` | Grafik rendern (Template + Daten -> PNG/JPG) |
| `list_formats` | Format-Presets mit Dimensionen |
| `list_themes` | Themes mit Farbpaletten |

### Beispiel-Prompt fuer Claude Code

> "Erstelle eine LinkedIn-Post-Grafik mit Headline 'CegTec Academy Launch' im 1:1 Format"

Claude nutzt automatisch `list_templates` -> `create_graphic` und gibt das Bild zurueck.

---

## Deployment (Render / Docker)

### Docker

```bash
docker build -t slideforge .
docker run -p 3000:3000 -e SLIDEFORGE_API_KEYS=key1,key2 slideforge
```

### Render

1. Neuen **Web Service** erstellen (Docker)
2. Repo verbinden: `frederikkaiser-cegtec/Slide-Forge`
3. Environment Variables setzen:
   - `SLIDEFORGE_API_KEYS` = komma-separierte API Keys
   - `NODE_ENV` = `production`
4. Health Check: `GET /api/v1/health`

Chromium braucht mind. 512MB RAM -> Render Starter Plan ($7/mo) oder hoeher.

---

## CLI (Diagramme)

```bash
# Verfuegbare Diagram-Templates
npm run cli -- list-templates

# Diagramm als HTML
npm run cli -- generate sales-pipeline --theme cegtec --out pipeline.html

# Aus JSON
npm run cli -- from-json mein-diagramm.json --auto-layout --out output.html
```

---

## Bestehende Workflows

| Workflow | Beschreibung | Dateien |
|----------|-------------|---------|
| **Playwright Export** | Headless PNG/PDF-Export aus laufender App | `scripts/export-pngs.mjs`, `scripts/export-pdf.mjs` |
| **Playbook Export** | Batch-Export fuer Playbook-PNGs | `scripts/export-playbook-pngs.mjs` |
| **Presets** | Fertige Grafik-Daten (JSON) fuer Kunden-Cases | `presets/`, `src/data/` |
| **Save/Load** | Zustand + localStorage, 11 Case-Study Presets | Automatisch in der Web UI |
| **GitHub Push** | Grafiken direkt ins cegtec-assets Repo pushen | Button in der Web UI |

### Preset-Daten (echte Kunden-Cases)

- **Jomavis Solar**: ROI 22x, 112 Leads -> 7 Meetings -> 1 Deal
- **ProSeller AG**: Email 9,9% Reply + LinkedIn 36,6% Acceptance
- **JSMD**: 2.700+ Entscheider kontaktiert, 6,3% Reply
- **RENK AG**: 7.129 Kontakte, 11,1% Reply, 15 Kampagnen

---

## Projektstruktur

```
src/
  App.tsx                    -- Haupt-UI (Graphic Mode, Sidebar, Export)
  bridge.ts                  -- Browser Bridge fuer Server-Rendering (?mcp=1)
  registry/
    registry.ts              -- GRAPHIC_REGISTRY: alle 20 Templates registriert
    types.ts                 -- GraphicDefinition Interface
  components/graphics/       -- 20 Grafik-Komponenten + ihre Forms
  components/diagram/        -- Diagram Editor
  components/presentation/   -- Slides-Modus
  stores/                    -- Zustand Stores (editor, saved graphics, etc.)
  themes/                    -- 6 Themes
  utils/formats.ts           -- 9 Format-Presets
  export/                    -- HTML/SVG/CSS/GIF/Video Exporter
  templates/                 -- Diagram Templates

server/
  index.ts                   -- Express Server Entry
  renderService.ts           -- Playwright Render-Pool
  auth.ts                    -- API-Key Auth Middleware
  mcp.ts                     -- MCP Server (Streamable HTTP)
  routes/
    templates.ts             -- GET /api/v1/templates
    graphics.ts              -- POST /api/v1/graphics
    diagrams.ts              -- POST /api/v1/diagrams
    health.ts                -- GET /api/v1/health
```

## Tech Stack

- **Frontend**: React 19, Vite 7, Tailwind CSS 4, Zustand, Recharts, Framer Motion, TipTap
- **Server**: Express 5, Playwright (headless Chromium)
- **MCP**: @modelcontextprotocol/sdk (Streamable HTTP Transport)
- **Export**: html-to-image, jsPDF, html2canvas
