import { useState, useRef, useCallback, useReducer } from 'react';
import { Download, Save, FolderOpen } from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import { DiagramEditor } from './components/diagram/DiagramEditor';
import { EditorLayout } from './components/editor/EditorLayout';
import { PresentationMode } from './components/presentation/PresentationMode';
import { ModeNav } from './components/ModeNav';
import { WelcomeScreen } from './components/WelcomeScreen';
import { useFileSync } from './hooks/useFileSync';
import { useEditorStore } from './stores/editorStore';
import { FORMAT_PRESETS } from './utils/formats';
import { useSavedGraphicsStore, type SavedGraphic } from './stores/savedGraphicsStore';
import { SavedGraphicsModal } from './components/graphics/SavedGraphicsModal';
import { GRAPHIC_REGISTRY, getDefinition } from './registry';

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
  { label: 'Weitere', ids: ['revenue-systems', 'academy', 'agent-friendly'] },
];

function GraphicTypeSelector({ graphicType, onSwitch }: { graphicType: string; onSwitch: (id: string) => void }) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium">Vorlage wählen</p>
      {GRAPHIC_CATEGORIES.map((cat) => (
        <div key={cat.label}>
          <p className="text-[10px] text-text-muted mb-1.5 font-medium">{cat.label}</p>
          <div className="flex gap-1 flex-wrap">
            {cat.ids.map((id) => {
              const def = GRAPHIC_REGISTRY.find((d) => d.id === id);
              if (!def) return null;
              const Icon = def.icon;
              return (
                <button
                  key={id}
                  onClick={() => onSwitch(id)}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    graphicType === id
                      ? 'bg-primary text-white'
                      : 'bg-surface-hover text-text-muted hover:text-text'
                  }`}
                >
                  <Icon size={12} /> {def.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── App ─────────────────────────────────────────────────────────
function App() {
  const { mode, setMode } = useEditorStore();
  const [graphicType, setGraphicType] = useState('revenue-systems');
  const [formatId, setFormatId] = useState('og');
  const [state, dispatch] = useReducer(graphicReducer, initialState);
  const graphicRef = useRef<HTMLDivElement>(null);
  const [showSavedGraphics, setShowSavedGraphics] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false);

  const format = FORMAT_PRESETS.find((f) => f.id === formatId) ?? FORMAT_PRESETS[0];
  const def = getDefinition(graphicType);

  // ── Save ────────────────────────────────────────────────────
  const handleSaveGraphic = useCallback(() => {
    const d = getDefinition(graphicType);
    const name = d.getDisplayName(state[graphicType]) || 'Unbenannt';
    useSavedGraphicsStore.getState().save(name, graphicType, state[graphicType], formatId);
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1200);
  }, [graphicType, state, formatId]);

  // ── Load ────────────────────────────────────────────────────
  const handleLoadGraphic = useCallback((g: SavedGraphic) => {
    setGraphicType(g.type);
    setFormatId(g.formatId);
    dispatch({ type: 'SET_DATA', graphicType: g.type, data: g.data });
  }, []);

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
      pixelRatio: 2,
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
      <div className="w-80 bg-surface border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <GraphicTypeSelector graphicType={graphicType} onSwitch={handleSwitchType} />

          <label className="text-xs text-text-muted block mb-1 mt-4">Format</label>
          <select
            value={formatId}
            onChange={(e) => setFormatId(e.target.value)}
            className="w-full bg-surface-hover border border-border rounded-lg px-3 py-2 text-sm text-text outline-none"
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
          <div className="flex gap-2">
            <button
              onClick={handleSaveGraphic}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-lg font-medium transition-all ${
                saveFlash
                  ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                  : 'bg-surface-hover hover:bg-border text-text-muted hover:text-text'
              }`}
            >
              <Save size={12} /> {saveFlash ? 'Gespeichert' : 'Speichern'}
            </button>
            <button
              onClick={() => setShowSavedGraphics(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-lg font-medium bg-surface-hover hover:bg-border text-text-muted hover:text-text transition-colors"
            >
              <FolderOpen size={12} /> Laden
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
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-hover hover:bg-border text-text text-sm rounded-lg font-medium transition-colors"
            >
              <Download size={14} /> JPG
            </button>
          </div>
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
          }}
        >
          <GraphicComponent
            data={state[graphicType] as any}
            width={format.width}
            height={format.height}
          />
        </div>
      </div>

      {showSavedGraphics && (
        <SavedGraphicsModal
          onClose={() => setShowSavedGraphics(false)}
          onLoad={handleLoadGraphic}
        />
      )}
    </div>
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
