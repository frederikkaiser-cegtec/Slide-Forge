import { useState, useRef, useCallback, useReducer, useEffect } from 'react';
import { Download, Save, Upload, Library, ImagePlus, X, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import { GitHubPushModal } from './components/graphics/GitHubPushModal';
import { DiagramEditor } from './components/diagram/DiagramEditor';
import { EditorLayout } from './components/editor/EditorLayout';
import { PresentationMode } from './components/presentation/PresentationMode';
import { ModeNav } from './components/ModeNav';
import { WelcomeScreen } from './components/WelcomeScreen';
import { GraphicHistory } from './components/graphics/GraphicHistory';
import { useFileSync } from './hooks/useFileSync';
import { useEditorStore } from './stores/editorStore';
import { FORMAT_PRESETS } from './utils/formats';
import { useSavedGraphicsStore, type SavedGraphic } from './stores/savedGraphicsStore';
import { GRAPHIC_REGISTRY, getDefinition } from './registry';
import { AssetLibraryModal } from './components/graphics/AssetLibraryModal';

// ── State via useReducer ────────────────────────────────────────
type GraphicState = Record<string, unknown>;
type Action =
  | { type: 'SET_DATA'; graphicType: string; data: unknown }
  | { type: 'RESET' };

const initialState: GraphicState = Object.fromEntries(
  GRAPHIC_REGISTRY.map((def) => [def.id, def.defaultData]),
);

function graphicReducer(state: GraphicState, action: Action): GraphicState {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, [action.graphicType]: action.data };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// ── Graphic Type Categories ──────────────────────────────────────
const GRAPHIC_CATEGORIES = [
  { label: 'Case Studies', ids: ['case-study', 'roi', 'kpi-banner', 'infographic'] },
  { label: 'Daten-Pipeline', ids: ['raw-data', 'enriched-data', 'qualified-data'] },
  { label: 'Outreach', ids: ['personalized-outreach', 'multichannel-outreach', 'outbound-stack', 'outreach-pipeline'] },
  { label: 'Weitere', ids: ['revenue-systems', 'academy', 'agent-friendly', 'linkedin-post', 'comparison', 'timeline', 'funnel'] },
];

function GraphicTypeSelector({ graphicType, onSwitch }: { graphicType: string; onSwitch: (id: string) => void }) {
  return (
    <div className="space-y-2.5">
      {GRAPHIC_CATEGORIES.map((cat) => (
        <div key={cat.label}>
          <p className="text-[10px] text-text-muted/60 uppercase tracking-wider font-medium mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{cat.label}</p>
          <div className="flex gap-1 flex-wrap">
            {cat.ids.map((id) => {
              const def = GRAPHIC_REGISTRY.find((d) => d.id === id);
              if (!def) return null;
              const Icon = def.icon;
              return (
                <button
                  key={id}
                  onClick={() => onSwitch(id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-all duration-150 ${
                    graphicType === id
                      ? 'bg-primary text-white shadow-sm shadow-primary/20'
                      : 'bg-muted/60 text-text-muted hover:text-text hover:bg-muted'
                  }`}
                >
                  <Icon size={12} strokeWidth={graphicType === id ? 2 : 1.5} /> {def.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// Force SVG to fill its container by overriding width/height attrs
function normalizeSvgSize(svg: string): string {
  return svg.replace(/<svg([^>]*)>/, (_, attrs) => {
    const cleaned = attrs.replace(/\s*(width|height)="[^"]*"/g, '');
    return `<svg${cleaned} width="100%" height="100%">`;
  });
}

// ── App ─────────────────────────────────────────────────────────
function App() {
  const { mode, setMode } = useEditorStore();
  const [graphicType, setGraphicType] = useState('revenue-systems');
  const [formatId, setFormatId] = useState('og');
  const [state, dispatch] = useReducer(graphicReducer, initialState);
  const graphicRef = useRef<HTMLDivElement>(null);
  const [activeGraphicId, setActiveGraphicId] = useState<string | null>(null);
  const [saveFlash, setSaveFlash] = useState(false);
  const [showGitHubPush, setShowGitHubPush] = useState(false);
  const [showAssetLibrary, setShowAssetLibrary] = useState<'normal' | 'insert' | false>(false);
  const [svgOverlay, setSvgOverlay] = useState({ svg: '', x: 16, y: 16, size: 80, opacity: 100, color: '#ffffff', rotation: 0 });
  const [overlayOpen, setOverlayOpen] = useState(false);

  const format = FORMAT_PRESETS.find((f) => f.id === formatId) ?? FORMAT_PRESETS[0];
  const def = getDefinition(graphicType);

  const handleOverlayDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // Use actual rendered size for accurate scale (accounts for padding etc.)
    const rect = graphicRef.current?.getBoundingClientRect();
    const scale = rect ? rect.width / format.width : getPreviewScale(format.width, format.height);
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startX = svgOverlay.x;
    const startY = svgOverlay.y;
    const onMove = (me: MouseEvent) => {
      setSvgOverlay(o => ({
        ...o,
        x: Math.round(startX + (me.clientX - startMouseX) / scale),
        y: Math.round(startY + (me.clientY - startMouseY) / scale),
      }));
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [format.width, svgOverlay.x, svgOverlay.y]);

  // Listen for template selection from WelcomeScreen
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent).detail as string;
      handleSwitchType(id);
    };
    window.addEventListener('sf:select-graphic', handler);
    return () => window.removeEventListener('sf:select-graphic', handler);
  });

  // ── Save ────────────────────────────────────────────────────
  const handleSaveGraphic = useCallback(() => {
    const d = getDefinition(graphicType);
    const name = d.getDisplayName(state[graphicType]) || 'Unbenannt';
    const id = useSavedGraphicsStore.getState().save(name, graphicType, state[graphicType], formatId);
    setActiveGraphicId(id);
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1200);
  }, [graphicType, state, formatId]);

  // ── Load ────────────────────────────────────────────────────
  const handleLoadGraphic = useCallback((g: SavedGraphic) => {
    setGraphicType(g.type);
    setFormatId(g.formatId);
    dispatch({ type: 'SET_DATA', graphicType: g.type, data: g.data });
    setActiveGraphicId(g.id);
  }, []);

  const handleResetToTemplate = useCallback(() => {
    const d = getDefinition(graphicType);
    dispatch({ type: 'SET_DATA', graphicType, data: d.defaultData });
    setActiveGraphicId(null);
    if (d.forceFormat && d.defaultFormat) setFormatId(d.defaultFormat);
  }, [graphicType]);

  // ── Switch type (with cross-sync) ──────────────────────────
  const handleSwitchType = useCallback((newType: string) => {
    const oldDef = getDefinition(graphicType);
    const newDef = getDefinition(newType);

    if (
      oldDef.syncGroup &&
      newDef.syncGroup &&
      oldDef.syncGroup === newDef.syncGroup &&
      oldDef.extractCore &&
      newDef.applyCore
    ) {
      const core = oldDef.extractCore(state[graphicType]);
      const synced = newDef.applyCore(core, state[newType]);
      dispatch({ type: 'SET_DATA', graphicType: newType, data: synced });
    }

    setGraphicType(newType);

    if (newDef.forceFormat && newDef.defaultFormat) {
      setFormatId(newDef.defaultFormat);
    } else if (['banner', 'banner-wide'].includes(formatId)) {
      setFormatId('linkedin');
    }
  }, [graphicType, state, formatId]);

  // ── Export ──────────────────────────────────────────────────
  const handleExport = async (type: 'png' | 'jpeg') => {
    if (!graphicRef.current) return;
    const el = graphicRef.current;
    const prevTransform = el.style.transform;
    el.style.transform = 'none';
    const opts = {
      width: format.width,
      height: format.height,
      pixelRatio: 3,
      style: { transform: 'none', transformOrigin: '0 0' },
    };
    const dataUrl = type === 'jpeg'
      ? await toJpeg(el, { ...opts, quality: 0.95 })
      : await toPng(el, opts);
    el.style.transform = prevTransform;
    const link = document.createElement('a');
    const filename = `cegtec-${graphicType}-${format.id}`;
    link.download = `${filename}.${type === 'jpeg' ? 'jpg' : 'png'}`;
    link.href = dataUrl;
    link.click();
  };

  // ── Copy PNG to clipboard ───────────────────────────────────
  const handleCopyPng = async () => {
    if (!graphicRef.current) return;
    const el = graphicRef.current;
    const prevTransform = el.style.transform;
    el.style.transform = 'none';
    const dataUrl = await toPng(el, { width: format.width, height: format.height, pixelRatio: 3, style: { transform: 'none', transformOrigin: '0 0' } });
    el.style.transform = prevTransform;
    const blob = await (await fetch(dataUrl)).blob();
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
  };

  // ── Capture for GitHub push ─────────────────────────────────
  const captureForGitHub = async (): Promise<string> => {
    if (!graphicRef.current) throw new Error('No graphic element');
    const el = graphicRef.current;
    const prevTransform = el.style.transform;
    el.style.transform = 'none';
    const dataUrl = await toPng(el, {
      width: format.width,
      height: format.height,
      pixelRatio: 3,
      style: { transform: 'none', transformOrigin: '0 0' },
    });
    el.style.transform = prevTransform;
    return dataUrl;
  };

  // ── Home screen ────────────────────────────────────────────
  if (mode === 'home') {
    return <WelcomeScreen />;
  }

  // ── Slides mode ────────────────────────────────────────────
  if (mode === 'slides') {
    return <SlidesMode />;
  }

  // ── Diagram mode ───────────────────────────────────────────
  if (mode === 'diagram') {
    return (
      <div className="h-full flex flex-col">
        <ModeNav />
        <div className="flex-1 overflow-hidden">
          <DiagramEditor />
        </div>
      </div>
    );
  }

  // ── Graphic mode ───────────────────────────────────────────
  const FormComponent = def.FormComponent;
  const GraphicComponent = def.GraphicComponent;

  return (
    <div className="h-full flex flex-col">
      <ModeNav />
      <div className="flex-1 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-surface border-r border-border/60 flex flex-col shrink-0">
        <div className="p-4 border-b border-border/40 overflow-y-auto max-h-[45vh] shrink-0">
          <GraphicTypeSelector graphicType={graphicType} onSwitch={handleSwitchType} />

          <GraphicHistory
            graphicType={graphicType}
            onLoad={handleLoadGraphic}
            onReset={handleResetToTemplate}
            activeId={activeGraphicId}
          />

          <label className="text-[11px] text-text-muted/60 uppercase tracking-wider font-medium block mb-1.5 mt-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Format</label>
          <select
            value={formatId}
            onChange={(e) => setFormatId(e.target.value)}
            className="w-full bg-muted/40 border border-border/50 rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-primary/40 transition-colors"
          >
            {FORMAT_PRESETS.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <FormComponent
            data={state[graphicType] as any}
            onChange={(d: any) => dispatch({ type: 'SET_DATA', graphicType, data: d })}
          />
        </div>

        <div className="p-4 border-t border-border space-y-2">
          {/* SVG Overlay Panel */}
          <div className="border border-border/40 rounded-lg overflow-hidden">
            <button
              onClick={() => setOverlayOpen(o => !o)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-text-muted hover:text-text hover:bg-muted/30 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <ImagePlus size={12} />
                SVG Overlay
                {svgOverlay.svg && <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />}
              </span>
              <div className="flex items-center gap-1">
                {svgOverlay.svg && (
                  <span
                    onClick={(e) => { e.stopPropagation(); setSvgOverlay(o => ({ ...o, svg: '' })); }}
                    className="text-text-muted/60 hover:text-red-400 transition-colors cursor-pointer p-0.5"
                    title="Overlay entfernen"
                  >
                    <X size={10} />
                  </span>
                )}
                {overlayOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </div>
            </button>
            {overlayOpen && (
              <div className="px-3 pb-3 space-y-2.5 border-t border-border/30">
                <textarea
                  placeholder="SVG hier einfügen…"
                  value={svgOverlay.svg}
                  onChange={(e) => setSvgOverlay(o => ({ ...o, svg: e.target.value }))}
                  className="w-full h-14 mt-2 bg-muted/40 border border-border/50 rounded text-[11px] text-text font-mono px-2 py-1.5 resize-none outline-none focus:border-primary/40"
                />
                <button
                  onClick={() => setShowAssetLibrary('insert')}
                  className="w-full text-[11px] text-primary hover:text-primary/80 text-center py-1.5 border border-primary/20 rounded hover:bg-primary/5 transition-colors"
                >
                  + Library öffnen
                </button>
                {/* Quick position presets */}
                <div className="flex gap-1">
                  {([['↖',16,16],['↗',format.width-svgOverlay.size-16,16],['⊕',Math.round((format.width-svgOverlay.size)/2),Math.round((format.height-svgOverlay.size)/2)],['↙',16,format.height-svgOverlay.size-16],['↘',format.width-svgOverlay.size-16,format.height-svgOverlay.size-16]] as [string,number,number][]).map(([label,px,py]) => (
                    <button key={label} onClick={() => setSvgOverlay(o => ({ ...o, x: px, y: py }))}
                      className="flex-1 py-1 text-xs bg-muted/50 hover:bg-muted text-text-muted hover:text-text rounded transition-colors">
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <p className="text-[10px] text-text-muted/50 uppercase tracking-wider mb-1">X (px)</p>
                    <input type="number" value={svgOverlay.x}
                      onChange={(e) => setSvgOverlay(o => ({ ...o, x: Math.max(0, +e.target.value) }))}
                      className="w-full bg-muted/40 border border-border/50 rounded px-2 py-1 text-xs text-text outline-none focus:border-primary/40" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-text-muted/50 uppercase tracking-wider mb-1">Y (px)</p>
                    <input type="number" value={svgOverlay.y}
                      onChange={(e) => setSvgOverlay(o => ({ ...o, y: +e.target.value }))}
                      className="w-full bg-muted/40 border border-border/50 rounded px-2 py-1 text-xs text-text outline-none focus:border-primary/40" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-text-muted/50 uppercase tracking-wider mb-1">Größe</p>
                    <input type="number" value={svgOverlay.size}
                      onChange={(e) => setSvgOverlay(o => ({ ...o, size: Math.max(10, +e.target.value) }))}
                      className="w-full bg-muted/40 border border-border/50 rounded px-2 py-1 text-xs text-text outline-none focus:border-primary/40" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted/50 uppercase tracking-wider mb-1">Farbe</p>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={svgOverlay.color}
                      onChange={(e) => setSvgOverlay(o => ({ ...o, color: e.target.value }))}
                      className="w-7 h-7 rounded cursor-pointer border border-border/50 bg-transparent p-0.5 shrink-0" />
                    <input type="text" value={svgOverlay.color}
                      onChange={(e) => setSvgOverlay(o => ({ ...o, color: e.target.value }))}
                      className="flex-1 bg-muted/40 border border-border/50 rounded px-2 py-1 text-xs text-text font-mono outline-none focus:border-primary/40" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <p className="text-[10px] text-text-muted/50 uppercase tracking-wider mb-1">Deckkraft: {svgOverlay.opacity}%</p>
                    <input type="range" min={10} max={100} value={svgOverlay.opacity}
                      onChange={(e) => setSvgOverlay(o => ({ ...o, opacity: +e.target.value }))}
                      className="w-full accent-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-text-muted/50 uppercase tracking-wider mb-1">Rotation: {svgOverlay.rotation}°</p>
                    <input type="range" min={0} max={360} value={svgOverlay.rotation}
                      onChange={(e) => setSvgOverlay(o => ({ ...o, rotation: +e.target.value }))}
                      className="w-full accent-primary" />
                  </div>
                </div>
                {svgOverlay.svg && (
                  <button
                    onClick={() => setSvgOverlay(o => ({ ...o, svg: '' }))}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-400/40 rounded hover:bg-red-500/5 transition-colors"
                  >
                    <X size={11} /> Overlay entfernen
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSaveGraphic}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-lg font-medium transition-all ${
                saveFlash
                  ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                  : 'bg-muted/50 hover:bg-muted text-text-muted hover:text-text'
              }`}
            >
              <Save size={12} /> {saveFlash ? 'Gespeichert' : 'Speichern'}
            </button>
            <button
              onClick={() => setShowAssetLibrary('normal')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-lg font-medium bg-muted/50 hover:bg-muted text-text-muted hover:text-text transition-all"
              title="Asset Library"
            >
              <Library size={12} /> Assets
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('png')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm rounded-lg font-medium transition-colors"
            >
              <Download size={14} /> PNG
            </button>
            <button
              onClick={() => handleExport('jpeg')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-muted hover:bg-border text-text text-sm rounded-lg font-medium transition-colors"
            >
              <Download size={14} /> JPG
            </button>
            <button
              onClick={handleCopyPng}
              className="flex items-center justify-center px-3 py-2.5 bg-muted hover:bg-border text-text-muted hover:text-text text-sm rounded-lg font-medium transition-colors"
              title="Als PNG kopieren"
            >
              <Copy size={14} />
            </button>
          </div>
          <button
            onClick={() => setShowGitHubPush(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-lg font-medium bg-muted/50 hover:bg-muted text-text-muted hover:text-text transition-all border border-border/40 hover:border-border"
          >
            <Upload size={12} /> Push to GitHub
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 flex items-center justify-center bg-bg p-8 overflow-auto">
        <div
          ref={graphicRef}
          style={{
            width: format.width,
            height: format.height,
            transform: `scale(${getPreviewScale(format.width, format.height)})`,
            transformOrigin: 'center center',
            position: 'relative',
          }}
        >
          <GraphicComponent
            data={state[graphicType] as any}
            width={format.width}
            height={format.height}
          />
          {svgOverlay.svg && (
            <div
              onMouseDown={handleOverlayDrag}
              style={{
                position: 'absolute',
                left: svgOverlay.x,
                top: svgOverlay.y,
                width: svgOverlay.size,
                height: svgOverlay.size,
                opacity: svgOverlay.opacity / 100,
                color: svgOverlay.color,
                zIndex: 10,
                overflow: 'hidden',
                cursor: 'move',
                transform: svgOverlay.rotation ? `rotate(${svgOverlay.rotation}deg)` : undefined,
              }}
              dangerouslySetInnerHTML={{ __html: normalizeSvgSize(svgOverlay.svg) }}
            />
          )}
        </div>
      </div>

    </div>

      <GitHubPushModal
        open={showGitHubPush}
        onClose={() => setShowGitHubPush(false)}
        graphicType={graphicType}
        formatId={formatId}
        captureImage={captureForGitHub}
      />
      {showAssetLibrary && (
        <AssetLibraryModal
          onClose={() => setShowAssetLibrary(false)}
          onInsert={showAssetLibrary === 'insert' ? (svg) => { setSvgOverlay(o => ({ ...o, svg })); setOverlayOpen(true); } : undefined}
        />
      )}
    </div>
  );
}

function SlidesMode() {
  const isPresentationMode = useEditorStore((s) => s.isPresentationMode);
  useFileSync();
  if (isPresentationMode) return <PresentationMode />;
  return (
    <div className="h-full flex flex-col">
      <ModeNav />
      <div className="flex-1 overflow-hidden"><EditorLayout /></div>
    </div>
  );
}

function getPreviewScale(w: number, h: number): number {
  const maxW = window.innerWidth - 380;
  const maxH = window.innerHeight - 80;
  return Math.min(maxW / w, maxH / h, 1);
}

export default App;
