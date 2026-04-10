import { useState, useRef, useCallback, useReducer, useEffect } from 'react';
import { Download, Save, Upload, Library, ImagePlus, X, ChevronDown, ChevronUp } from 'lucide-react';
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
  { label: 'Outreach', ids: ['personalized-outreach', 'multichannel-outreach', 'outbound-stack'] },
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

// ── SVG Overlay ──────────────────────────────────────────────────
type SvgPos = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

const SVG_POSITIONS: { id: SvgPos; label: string; row: number; col: number }[] = [
  { id: 'top-left',     label: '↖', row: 0, col: 0 },
  { id: 'top-right',    label: '↗', row: 0, col: 2 },
  { id: 'center',       label: '⊕', row: 1, col: 1 },
  { id: 'bottom-left',  label: '↙', row: 2, col: 0 },
  { id: 'bottom-right', label: '↘', row: 2, col: 2 },
];

function svgPosStyle(pos: SvgPos, size: number): React.CSSProperties {
  const base: React.CSSProperties = { position: 'absolute', width: size, height: size, pointerEvents: 'none', zIndex: 10, overflow: 'hidden' };
  switch (pos) {
    case 'top-left':     return { ...base, top: 16, left: 16 };
    case 'top-right':    return { ...base, top: 16, right: 16 };
    case 'bottom-left':  return { ...base, bottom: 16, left: 16 };
    case 'bottom-right': return { ...base, bottom: 16, right: 16 };
    case 'center':       return { ...base, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  }
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
  const [svgOverlay, setSvgOverlay] = useState({ svg: '', position: 'bottom-right' as SvgPos, size: 80, opacity: 100 });
  const [overlayOpen, setOverlayOpen] = useState(false);

  // Listen for template selection from WelcomeScreen
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent).detail as string;
      handleSwitchType(id);
    };
    window.addEventListener('sf:select-graphic', handler);
    return () => window.removeEventListener('sf:select-graphic', handler);
  });

  const format = FORMAT_PRESETS.find((f) => f.id === formatId) ?? FORMAT_PRESETS[0];
  const def = getDefinition(graphicType);

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
                <div>
                  <p className="text-[10px] text-text-muted/50 uppercase tracking-wider mb-1.5">Position</p>
                  <div className="grid grid-cols-3 gap-1" style={{ width: 84 }}>
                    {([0,1,2] as const).flatMap(row =>
                      ([0,1,2] as const).map(col => {
                        const pos = SVG_POSITIONS.find(p => p.row === row && p.col === col);
                        return (
                          <button
                            key={`${row}-${col}`}
                            onClick={() => pos && setSvgOverlay(o => ({ ...o, position: pos.id }))}
                            className={`h-6 w-6 rounded text-xs transition-colors ${
                              pos
                                ? svgOverlay.position === pos.id
                                  ? 'bg-primary text-white'
                                  : 'bg-muted/60 hover:bg-muted text-text-muted'
                                : 'bg-muted/20 cursor-default'
                            }`}
                          >
                            {pos?.label ?? ''}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted/50 uppercase tracking-wider mb-1">Größe: {svgOverlay.size}px</p>
                  <input type="range" min={40} max={300} value={svgOverlay.size}
                    onChange={(e) => setSvgOverlay(o => ({ ...o, size: +e.target.value }))}
                    className="w-full accent-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted/50 uppercase tracking-wider mb-1">Deckkraft: {svgOverlay.opacity}%</p>
                  <input type="range" min={10} max={100} value={svgOverlay.opacity}
                    onChange={(e) => setSvgOverlay(o => ({ ...o, opacity: +e.target.value }))}
                    className="w-full accent-primary" />
                </div>
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
              style={{ ...svgPosStyle(svgOverlay.position, svgOverlay.size), opacity: svgOverlay.opacity / 100 }}
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
