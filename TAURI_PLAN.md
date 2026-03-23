# SlideForge Desktop-App – Tauri Implementierungsplan

## Warum Tauri?

| | Tauri | Electron | PWA |
|---|---|---|---|
| **Installer-Größe** | ~10 MB | ~100 MB | 0 |
| **Desktop-Feeling** | Echte .exe/.dmg | Echte .exe/.dmg | Browser-Feeling |
| **Dateisystem-Zugriff** | Voll, native Dialoge | Voll | Kaum |
| **Offline** | Komplett | Komplett | Wackelig |
| **React-Code ändern** | Nichts | Nichts | Nichts |
| **Bundle-Overhead** | Nutzt OS-WebView | Bündelt Chromium | Keiner |

Tauri nutzt den eingebauten WebView2 (Windows 11) bzw. WebKit (Mac) statt Chromium zu bündeln. Die App ist 8 MB – in 100 MB Chromium wrappen wäre Overkill.

---

## Voraussetzungen

- Rust Toolchain (`rustup`) auf dem Dev-Rechner
- Windows 11 hat WebView2 schon vorinstalliert
- Bestehende Web-Version auf GitHub Pages bleibt parallel bestehen

---

## Implementierung

### Phase 1: Scaffold + Basis

- [ ] `npm install -D @tauri-apps/cli@latest`
- [ ] `npx tauri init` → erstellt `src-tauri/` mit `Cargo.toml`, `tauri.conf.json`, `src/main.rs`
- [ ] `tauri.conf.json` konfigurieren:
  - `build.devUrl`: `http://localhost:5173`
  - `build.frontendDist`: `../dist`
  - `build.beforeBuildCommand`: `npm run build`
  - `build.beforeDevCommand`: `npm run dev`
  - Window-Titel: "SlideForge"
  - Default-Größe: 1440x900

### Phase 2: Base Path conditional machen

`vite.config.ts` anpassen:
- Web (GitHub Pages): `base: '/Slide-Forge/'`
- Tauri: `base: '/'`
- Erkennung über `process.env.TAURI_ENV_PLATFORM`

### Phase 3: Tauri Plugins für Dateisystem

- [ ] `@tauri-apps/plugin-dialog` – native Open/Save Dialoge
- [ ] `@tauri-apps/plugin-fs` – Dateien direkt auf Disk schreiben

### Phase 4: Desktop Export Bridge

Neue Datei `src/utils/desktopExport.ts`:

1. Prüft ob Tauri läuft (`window.__TAURI__`)
2. **Tauri**: Nach `toPng()`/`toJpeg()` → nativer "Speichern unter" Dialog → direkt auf Disk schreiben
3. **Browser**: Fallback auf aktuelle Download-Logik

Gleiches Pattern für PDF-Export via jsPDF.

### Phase 5: Fonts lokal bündeln

- [ ] Google Fonts (Inter, Plus Jakarta Sans, DM Sans, JetBrains Mono) herunterladen
- [ ] In `public/fonts/` ablegen
- [ ] `@font-face` Regeln in `index.css` statt Google CDN Link in `index.html`
- [ ] Google Fonts Link entfernen (oder als Fallback behalten für Web)

### Phase 6: App-Icons

- [ ] `npx tauri icon ./public/favicon.svg` → generiert alle Größen für .ico (Win) und .icns (Mac)
- [ ] Icons landen in `src-tauri/icons/`

### Phase 7: Auto-Updates

- [ ] `@tauri-apps/plugin-updater` konfigurieren
- [ ] Zeigt auf GitHub Releases
- [ ] App prüft beim Start auf neue Version

### Phase 8: GitHub Actions Release-Pipeline

`.github/workflows/release.yml`:
- [ ] Trigger: Git Tag `v*`
- [ ] Baut auf `windows-latest` und `macos-latest`
- [ ] Nutzt `tauri-apps/tauri-action` (offizielle Action)
- [ ] Uploadet .exe (NSIS) und .dmg zu GitHub Release

### Phase 9: Package.json Scripts

```json
"tauri:dev": "tauri dev",
"tauri:build": "tauri build"
```

Bestehende `dev` und `build` Scripts bleiben für die Web-Version.

---

## Was sich NICHT ändert

- Alle React-Komponenten
- Alle Zustand Stores (localStorage = identisch in Tauri WebView)
- Alle Grafik-Typen, Templates, Themes
- Export-Logik (html-to-image, jsPDF) – nur der letzte "Speichern" Schritt bekommt optional Tauri-Pfad
- CLI (`src/cli.ts`)
- Tailwind, Radix UI, TipTap, Recharts, dnd-kit

---

## Potenzielle Herausforderungen

1. **Google Fonts offline** – Müssen lokal gebündelt werden (Phase 5)
2. **html-to-image in WebView2** – Sollte identisch zu Chrome funktionieren, Mac WebKit testen
3. **Rust auf CI** – `tauri-apps/tauri-action` handelt das, Builds dauern 5-10 Min
4. **Code Signing** – Windows zeigt "Unbekannter Herausgeber" ohne Signatur. Für internes Team ok, für öffentliche Distribution braucht man Zertifikat (~200-400€/Jahr)

---

## Zusammenfassung

| Aspekt | Wert |
|---|---|
| **Ansatz** | Tauri v2 |
| **Installer-Größe** | ~10-15 MB |
| **Zeit bis erster Build** | 2-4 Stunden |
| **Zeit bis Release mit CI** | 1-2 Tage |
| **Codebase-Änderungen** | Conditional base path, optionale Tauri Save Bridge, lokale Fonts |
| **React-Code-Änderungen** | Null |
| **Web-Version bleibt** | Ja, paralleles Deployment |
