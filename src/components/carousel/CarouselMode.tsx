import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import JSZip from 'jszip';
import { Plus, Trash2, ChevronLeft, ChevronRight, Download, Archive, ChevronDown, ChevronUp, Layers, Copy, FileText, Save, FolderOpen, X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useCarouselStore } from '../../stores/carouselStore';
import { exportElementsAsRasterPdf } from '../../utils/exportRasterPdf';
import { useSavedGraphicsStore, CAROUSEL_PRESETS } from '../../stores/savedGraphicsStore';
import { GRAPHIC_REGISTRY, getDefinition } from '../../registry';
import { FORMAT_PRESETS, getFormat } from '../../utils/formats';
import { useEditorStore } from '../../stores/editorStore';
import { AssetLibraryModal } from '../graphics/AssetLibraryModal';
import { LayerCanvas, normalizeSvgSize } from '../graphics/LayerCanvas';
import { LayerPanel } from '../graphics/LayerPanel';
import { GraphicPreview } from '../ui/GraphicPreview';
import { type Layer, type TextLayer, createSvgLayer, createTextLayer } from '../../types/layers';
import { defaultOutreachPipelineData } from '../graphics/OutreachPipelineGraphic';

// ── Global color utils ───────────────────────────────────────────
const HEX6 = /^#[0-9a-fA-F]{6}$/;

function findColorPaths(obj: unknown, path: string[] = []): { path: string; key: string; value: string }[] {
  if (typeof obj === 'string' && HEX6.test(obj))
    return [{ path: path.join('.'), key: path[path.length - 1] ?? 'color', value: obj }];
  if (obj && typeof obj === 'object' && !Array.isArray(obj))
    return Object.entries(obj).flatMap(([k, v]) => findColorPaths(v, [...path, k]));
  return [];
}

const LABEL_MAP: Record<string, string> = {
  bgColor: 'Hintergrund', backgroundColor: 'Hintergrund', bg: 'Hintergrund',
  accentColor: 'Akzent', accent: 'Akzent', color: 'Farbe',
  textColor: 'Text', headlineColor: 'Headline', iconColor: 'Icon',
  borderColor: 'Rahmen', highlightColor: 'Highlight',
};
function colorLabel(key: string) {
  return LABEL_MAP[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
}

// ── Static layer renderer (thumbnail + export) ───────────────────
function StaticLayer({ layer }: { layer: Layer }) {
  const tl = layer as TextLayer;
  return (
    <div style={{
      position: 'absolute', left: layer.x, top: layer.y,
      width: layer.width, height: layer.height,
      transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
      transformOrigin: 'center center',
      opacity: layer.opacity / 100,
      color: layer.color,
      overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      {layer.type === 'svg' ? (
        <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: normalizeSvgSize(layer.content) }} />
      ) : (
        <div style={{
          width: '100%', height: '100%', overflow: 'hidden',
          fontSize: tl.fontSize, fontWeight: tl.fontWeight,
          textAlign: tl.textAlign, fontFamily: tl.fontFamily,
          lineHeight: 1.2, display: 'flex', alignItems: 'center',
          wordBreak: 'break-word',
        }}>
          {layer.content || ' '}
        </div>
      )}
    </div>
  );
}

// ── Thumbnail ────────────────────────────────────────────────────
const THUMB_W = 130;

function Thumbnail({ graphicType, formatId, data, layers, active, index, onClick, onRemove, onMoveLeft, onMoveRight, isFirst, isLast }: {
  graphicType: string; formatId: string; data: unknown; layers: Layer[];
  active: boolean; index: number;
  onClick: () => void; onRemove: () => void;
  onMoveLeft: () => void; onMoveRight: () => void;
  isFirst: boolean; isLast: boolean;
}) {
  const def = getDefinition(graphicType);
  const format = getFormat(formatId);
  const scale = THUMB_W / format.width;
  const thumbH = Math.round(format.height * scale);
  const GraphicComponent = def.GraphicComponent;

  return (
    <div className="flex flex-col items-center gap-1 shrink-0" style={{ width: THUMB_W }}>
      <div onClick={onClick}
        className={`relative cursor-pointer rounded overflow-hidden border-2 transition-all ${active ? 'border-primary shadow-lg shadow-primary/20' : 'border-border/40 hover:border-border'}`}
        style={{ width: THUMB_W, height: thumbH }}>
        <div style={{ width: format.width, height: format.height, transform: `scale(${scale})`, transformOrigin: '0 0', pointerEvents: 'none', position: 'relative' }}>
          <GraphicComponent data={data as any} width={format.width} height={format.height} />
          {layers.map((layer) => <StaticLayer key={layer.id} layer={layer} />)}
        </div>
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-black/40 flex items-end justify-between p-1">
          <button onClick={(e) => { e.stopPropagation(); onMoveLeft(); }} disabled={isFirst}
            className="p-0.5 rounded bg-black/60 text-white disabled:opacity-30 hover:bg-black/80"><ChevronLeft size={10} /></button>
          <button onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-0.5 rounded bg-red-500/80 text-white hover:bg-red-600"><Trash2 size={10} /></button>
          <button onClick={(e) => { e.stopPropagation(); onMoveRight(); }} disabled={isLast}
            className="p-0.5 rounded bg-black/60 text-white disabled:opacity-30 hover:bg-black/80"><ChevronRight size={10} /></button>
        </div>
      </div>
      <span className={`text-[10px] font-medium ${active ? 'text-primary' : 'text-text-muted/50'}`}>{index + 1}</span>
    </div>
  );
}

// ── Setup Screen ─────────────────────────────────────────────────
function SetupScreen() {
  const { create } = useCarouselStore();
  const { graphics, remove } = useSavedGraphicsStore();
  // User-saved carousels (exclude presets — those are always hardcoded)
  const userCarousels = graphics.filter((g) => g.type === 'carousel' && !g.id.startsWith('preset-'));
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handlePipelineSplit = () => {
    const base = structuredClone(defaultOutreachPipelineData);
    const coverSlide = {
      id: crypto.randomUUID(),
      data: { ...structuredClone(base), isCover: true },
      layers: [] as Layer[],
    };
    const phaseSlides = base.phases.map((_, pi) => ({
      id: crypto.randomUUID(),
      data: { ...structuredClone(base), activePhaseIndex: pi },
      layers: [] as Layer[],
    }));
    const slides = [coverSlide, ...phaseSlides];
    useCarouselStore.setState({ carousel: { graphicType: 'outreach-pipeline', formatId: '4:5', slides }, activeSlideId: slides[0].id });
  };

  const loadCarousel = (g: (typeof userCarousels)[0]) => {
    const c = g.data as { graphicType: string; formatId: string; slides: any[] };
    const slides = c.slides.map((sl: any) => ({ ...sl, id: crypto.randomUUID() }));
    useCarouselStore.setState({ carousel: { graphicType: c.graphicType, formatId: c.formatId, slides }, activeSlideId: slides[0].id });
  };

  const [graphicType, setGraphicType] = useState('outreach-pipeline');
  const [formatId, setFormatId] = useState('4:5');
  const [count, setCount] = useState(6);
  const types = GRAPHIC_REGISTRY.filter((d) => !['kpi-banner'].includes(d.id));

  return (
    <div className="flex-1 flex items-center justify-center bg-bg p-8">
      <div className="w-full max-w-2xl space-y-4">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-text" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Carousel</h2>
          <p className="text-sm text-text-muted mt-1">Mehrere Slides exportieren als PDF oder ZIP</p>
        </div>

        {/* CegTec Presets — always visible, hardcoded */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 mb-3">
            <Layers size={13} className="text-primary" />
            <span className="text-[12px] text-text font-semibold uppercase tracking-wider" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>CegTec Vorlagen</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {CAROUSEL_PRESETS.map((g) => {
              const c = g.data as { graphicType: string; formatId: string; slides: { data: unknown }[] };
              const firstSlideData = c.slides?.[0]?.data;
              return (
                <button key={g.id} onClick={() => loadCarousel(g)}
                  className="w-full text-left bg-surface border border-border/60 hover:border-primary/50 rounded-xl overflow-hidden transition-all hover:shadow-md hover:shadow-primary/5 group">
                  {/* Preview */}
                  <div className="relative bg-gradient-to-br from-muted/30 to-bg/80 aspect-[4/3] flex items-center justify-center overflow-hidden">
                    <div className="rounded-md overflow-hidden shadow-sm ring-1 ring-black/[0.04]">
                      <GraphicPreview graphicType={c.graphicType} formatId={c.formatId} data={firstSlideData} width={140} />
                    </div>
                    {/* Slide-count badge */}
                    <span className="absolute bottom-2 right-2 z-10 text-[10px] font-semibold text-text bg-surface/90 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                      <Layers size={10} className="text-primary" />
                      {c.slides?.length ?? 0}
                    </span>
                  </div>
                  {/* Label */}
                  <div className="p-3 border-t border-border/30">
                    <div className="text-[13px] font-semibold text-text truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{g.name}</div>
                    <div className="text-[11px] text-text-muted mt-0.5">{c.slides?.length ?? '?'} Slides · {g.formatId}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* User-saved carousels */}
        {userCarousels.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-1.5 mb-2">
              <FolderOpen size={13} className="text-text-muted/60" />
              <span className="text-[11px] text-text-muted font-semibold uppercase tracking-wider">Gespeichert</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {userCarousels.map((g) => {
                const c = g.data as { graphicType: string; formatId: string; slides: { data: unknown }[] };
                const firstSlideData = c.slides?.[0]?.data;
                return (
                  <div key={g.id} className="relative group">
                    <button onClick={() => loadCarousel(g)}
                      className="w-full text-left bg-surface border border-border/60 hover:border-primary/50 rounded-xl overflow-hidden transition-all hover:shadow-md hover:shadow-primary/5">
                      <div className="relative bg-gradient-to-br from-muted/30 to-bg/80 aspect-[4/3] flex items-center justify-center overflow-hidden">
                        <div className="rounded-md overflow-hidden shadow-sm ring-1 ring-black/[0.04]">
                          <GraphicPreview graphicType={c.graphicType} formatId={c.formatId} data={firstSlideData} width={140} />
                        </div>
                        <span className="absolute bottom-2 right-2 z-10 text-[10px] font-semibold text-text bg-surface/90 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                          <Layers size={10} className="text-primary" />
                          {c.slides?.length ?? 0}
                        </span>
                      </div>
                      <div className="p-3 border-t border-border/30">
                        <div className="text-[13px] font-semibold text-text truncate">{g.name}</div>
                        <div className="text-[11px] text-text-muted mt-0.5">{c.slides?.length ?? '?'} Slides · {g.formatId}</div>
                      </div>
                    </button>
                    <button onClick={() => remove(g.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded bg-surface/90 backdrop-blur-sm text-text-muted/60 hover:text-red-400 hover:bg-red-400 hover:bg-opacity-100 transition-all z-10">
                      <X size={11} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Divider + toggle */}
        <div className="relative flex items-center gap-3 pt-2">
          <div className="flex-1 h-px bg-border/40" />
          <button
            onClick={() => setShowCreateForm((o) => !o)}
            className="flex items-center gap-1.5 text-[11px] text-text-muted/60 hover:text-text uppercase tracking-wider transition-colors whitespace-nowrap"
          >
            {showCreateForm ? <ChevronUp size={11} /> : <Plus size={11} />}
            Neu erstellen
          </button>
          <div className="flex-1 h-px bg-border/40" />
        </div>

        {/* Create form — collapsible */}
        {showCreateForm && (
          <div className="bg-surface border border-border/60 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-text-muted/60 uppercase tracking-wider font-medium block mb-1.5">Grafik-Typ</label>
                <select value={graphicType} onChange={(e) => setGraphicType(e.target.value)}
                  className="w-full bg-muted/40 border border-border/50 rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-primary/40">
                  {types.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-text-muted/60 uppercase tracking-wider font-medium block mb-1.5">Format</label>
                <select value={formatId} onChange={(e) => setFormatId(e.target.value)}
                  className="w-full bg-muted/40 border border-border/50 rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-primary/40">
                  {FORMAT_PRESETS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-text-muted/60 uppercase tracking-wider font-medium block mb-1.5">Anzahl Slides: {count}</label>
                <input type="range" min={1} max={12} value={count} onChange={(e) => setCount(+e.target.value)} className="w-full accent-primary" />
                <div className="flex justify-between text-[10px] text-text-muted/40 mt-0.5"><span>1</span><span>12</span></div>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <div className="border border-border/60 rounded-xl p-3 bg-muted/20 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <Layers size={13} className="text-primary" />
                  <span className="text-xs font-semibold text-text" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pipeline aufteilen</span>
                </div>
                <p className="text-[11px] text-text-muted mb-2">Automatisch 6 Slides (Cover + 5 Phasen)</p>
                <button onClick={handlePipelineSplit}
                  className="w-full py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg font-medium text-xs transition-colors">
                  Pipeline → 6 Slides
                </button>
              </div>
              <button onClick={() => create(graphicType, formatId, count)}
                className="flex-1 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium text-sm transition-colors">
                {count} Slides erstellen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Editor ───────────────────────────────────────────────────────
function Editor() {
  const { carousel, activeSlideId, setActive, updateSlide, addSlide, removeSlide, moveSlide, applyGlobal,
    addSlideLayer, updateSlideLayer, deleteSlideLayer, moveSlideLayerUp, moveSlideLayerDown, reset } = useCarouselStore();
  const [exporting, setExporting] = useState(false);
  const [globalOpen, setGlobalOpen] = useState(false);
  const [showAssetLibrary, setShowAssetLibrary] = useState(false);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  // zoomOverride: null = auto-fit, number = user-chosen multiplier of fit
  const [zoomOverride, setZoomOverride] = useState<number | null>(null);
  const [fitScale, setFitScale] = useState(0.5);
  const previewRef = useRef<HTMLDivElement>(null);
  const canvasAreaRef = useRef<HTMLDivElement>(null);
  const exportRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  if (!carousel) return null;

  const format = getFormat(carousel.formatId);
  const def = getDefinition(carousel.graphicType);
  const FormComponent = def.FormComponent;
  const GraphicComponent = def.GraphicComponent;
  const activeSlide = carousel.slides.find((s) => s.id === activeSlideId) ?? carousel.slides[0];
  const activeLayers = activeSlide.layers;

  // Measure canvas area and compute auto-fit scale whenever it resizes.
  // This replaces the old one-shot window-size calculation which didn't
  // react to resizes and used a wrong origin (center vs top-left) that
  // caused the slide to crop off-screen above the viewport.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    const el = canvasAreaRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const padding = 48; // p-8 on both sides worth of breathing room
      const s = Math.min(
        (r.width - padding) / format.width,
        (r.height - padding) / format.height,
        1,
      );
      if (s > 0) setFitScale(s);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [format.width, format.height]);

  const previewScale = zoomOverride ?? fitScale;

  // Layer callbacks for active slide
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const addLayer = useCallback((layer: Layer) => {
    addSlideLayer(activeSlide.id, layer);
    setSelectedLayerId(layer.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlide.id]);

  // Listen for chart SVG inserts
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const handler = (e: Event) => addLayer(createSvgLayer((e as CustomEvent<string>).detail));
    window.addEventListener('sf:insert-svg', handler);
    return () => window.removeEventListener('sf:insert-svg', handler);
  }, [addLayer]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const updateLayer = useCallback((layerId: string, patch: Partial<Layer>) =>
    updateSlideLayer(activeSlide.id, layerId, patch),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [activeSlide.id]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const deleteLayer = useCallback((layerId: string) => {
    deleteSlideLayer(activeSlide.id, layerId);
    setSelectedLayerId((s) => (s === layerId ? null : s));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlide.id]);

  const capture = async (el: HTMLDivElement) =>
    toPng(el, { width: format.width, height: format.height, pixelRatio: 3 });

  const handleExportPdf = async () => {
    setExporting(true);
    const prevSel = selectedLayerId;
    setSelectedLayerId(null);
    // Wait two animation frames for the deselection to flush to the DOM
    // before capturing, so selection outlines don't appear in the export.
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    try {
      const els: HTMLElement[] = [];
      for (const slide of carousel.slides) {
        const el = exportRefs.current.get(slide.id);
        if (el) els.push(el);
      }
      await exportElementsAsRasterPdf(els, format, `carousel-${carousel.graphicType}`);
    } finally {
      setSelectedLayerId(prevSel);
      setExporting(false);
    }
  };

  const handleSave = () => {
    const name = window.prompt('Name für dieses Template:', `${def.label} – Carousel`);
    if (!name) return;
    useSavedGraphicsStore.getState().save(name, 'carousel', carousel, carousel.formatId);
  };

  const handleExportZip = async () => {
    setExporting(true);
    const prevSel = selectedLayerId;
    setSelectedLayerId(null);
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    try {
      const zip = new JSZip();
      for (let i = 0; i < carousel.slides.length; i++) {
        const el = exportRefs.current.get(carousel.slides[i].id);
        if (!el) continue;
        const dataUrl = await capture(el);
        zip.file(`slide-${String(i + 1).padStart(2, '0')}.png`, dataUrl.split(',')[1], { base64: true });
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `carousel-${carousel.graphicType}.zip`; a.click();
      URL.revokeObjectURL(url);
    } finally {
      setSelectedLayerId(prevSel);
      setExporting(false);
    }
  };

  const handleExportActive = async () => {
    const prevSel = selectedLayerId;
    setSelectedLayerId(null);
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    const el = exportRefs.current.get(activeSlide.id);
    if (el) {
      const a = document.createElement('a'); a.href = await capture(el);
      a.download = `slide-${carousel.slides.indexOf(activeSlide) + 1}.png`; a.click();
    }
    setSelectedLayerId(prevSel);
  };

  const handleCopyPng = async () => {
    const prevSel = selectedLayerId;
    setSelectedLayerId(null);
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    const el = exportRefs.current.get(activeSlide.id);
    if (el) {
      const blob = await (await fetch(await capture(el))).blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    }
    setSelectedLayerId(prevSel);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-surface border-r border-border/60 flex flex-col shrink-0">
        <div className="p-3 border-b border-border/40 flex items-center gap-2">
          <button onClick={reset} className="text-[11px] text-text-muted hover:text-text flex items-center gap-1 transition-colors">
            <ChevronLeft size={12} /> Neu
          </button>
          <span className="text-[11px] text-text-muted/40">|</span>
          <span className="text-[11px] text-text font-medium truncate">{def.label}</span>
          <button onClick={handleSave} title="Als Vorlage speichern"
            className="ml-auto flex items-center gap-1 text-[11px] text-text-muted hover:text-primary transition-colors px-1.5 py-1 rounded hover:bg-primary/10">
            <Save size={11} /> Speichern
          </button>
        </div>

        <div className="p-3 flex-1 overflow-y-auto">
          <p className="text-[10px] text-text-muted/50 uppercase tracking-wider font-medium mb-2">
            Slide {carousel.slides.indexOf(activeSlide) + 1} von {carousel.slides.length}
          </p>
          <FormComponent data={activeSlide.data as any} onChange={(d: any) => updateSlide(activeSlide.id, d)} />
        </div>

        {/* Layer Panel */}
        <div className="border-t border-border/40">
          <LayerPanel
            layers={activeLayers}
            selectedId={selectedLayerId}
            onSelect={setSelectedLayerId}
            onUpdate={updateLayer}
            onDelete={deleteLayer}
            onMoveUp={(id) => moveSlideLayerUp(activeSlide.id, id)}
            onMoveDown={(id) => moveSlideLayerDown(activeSlide.id, id)}
            onAddText={() => addLayer(createTextLayer())}
            onOpenLibrary={() => setShowAssetLibrary(true)}
          />
        </div>

        {/* Global colors */}
        <div className="border-t border-border/40">
          <button onClick={() => setGlobalOpen((o) => !o)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-text-muted hover:text-text hover:bg-muted/20 transition-colors">
            <span>Farben global ändern</span>
            {globalOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {globalOpen && (() => {
            const unique = findColorPaths(activeSlide.data).filter((c, i, a) => a.findIndex((x) => x.path === c.path) === i);
            return (
              <div className="px-3 pb-3 space-y-2">
                {unique.length === 0 && <p className="text-[11px] text-text-muted/50">Keine Farbfelder gefunden.</p>}
                {unique.map(({ path, key, value }) => (
                  <div key={path} className="flex items-center gap-2">
                    <input type="color" defaultValue={value} onChange={(e) => applyGlobal(path, e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border border-border/50 bg-transparent p-0.5 shrink-0" />
                    <span className="text-[11px] text-text-muted truncate">{colorLabel(key)}</span>
                    <span className="text-[10px] text-text-muted/40 font-mono ml-auto">{value}</span>
                  </div>
                ))}
                <p className="text-[10px] text-text-muted/30 pt-1">Ändert Farbe auf allen {carousel.slides.length} Slides</p>
              </div>
            );
          })()}
        </div>

        {/* Export */}
        <div className="p-3 border-t border-border/40 space-y-2">
          <div className="flex gap-2">
            <button onClick={handleExportActive}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs bg-muted/50 hover:bg-muted text-text-muted hover:text-text rounded-lg transition-colors">
              <Download size={12} /> PNG
            </button>
            <button onClick={handleCopyPng}
              className="flex items-center justify-center px-3 py-2 text-xs bg-muted/50 hover:bg-muted text-text-muted hover:text-text rounded-lg transition-colors" title="PNG kopieren">
              <Copy size={12} />
            </button>
            <button onClick={handleExportZip} disabled={exporting}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs bg-muted/50 hover:bg-muted text-text-muted hover:text-text rounded-lg transition-colors disabled:opacity-60">
              <Archive size={12} /> {exporting ? '…' : 'ZIP'}
            </button>
          </div>
          <button onClick={handleExportPdf} disabled={exporting}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors disabled:opacity-60">
            <FileText size={12} /> {exporting ? 'Exportiere…' : 'PDF exportieren'}
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-bg">
        {/* Slide strip */}
        <div className="bg-surface border-b border-border/60 px-4 py-3">
          <div className="flex items-end gap-3 overflow-x-auto pb-1">
            {carousel.slides.map((slide, i) => (
              <Thumbnail key={slide.id}
                graphicType={carousel.graphicType} formatId={carousel.formatId}
                data={slide.data} layers={slide.layers}
                active={slide.id === activeSlide.id} index={i}
                onClick={() => { setActive(slide.id); setSelectedLayerId(null); }}
                onRemove={() => removeSlide(slide.id)}
                onMoveLeft={() => moveSlide(i, i - 1)}
                onMoveRight={() => moveSlide(i, i + 1)}
                isFirst={i === 0} isLast={i === carousel.slides.length - 1}
              />
            ))}
            <button onClick={addSlide}
              className="flex flex-col items-center justify-center gap-1 shrink-0 rounded border-2 border-dashed border-border/40 hover:border-primary/40 text-text-muted/40 hover:text-primary transition-colors"
              style={{ width: THUMB_W, height: Math.round(format.height * (THUMB_W / format.width)) }}>
              <Plus size={18} />
              <span className="text-[10px]">Slide</span>
            </button>
          </div>
        </div>

        {/* Active preview */}
        <div className="flex-1 relative overflow-hidden">
        <div ref={canvasAreaRef} className="absolute inset-0 overflow-auto p-6">
          {/* Inner flex container ensures the scaled slide centers when
              the canvas is larger than the slide, and scrolls cleanly
              (no clipping) when the slide is larger than the canvas. */}
          <div className="min-w-full min-h-full flex items-center justify-center">
            {/* Wrapper box with POST-scale dimensions — this is what fixes
                the "carousel cropped at the top" bug. A raw CSS transform
                doesn't affect layout, so the unscaled 1080×1350 box was
                centered by flex before scaling, pushing part of it above
                the viewport. Here the wrapper reports the scaled size to
                the layout engine and the inner box scales from top-left. */}
            <div
              style={{
                width: format.width * previewScale,
                height: format.height * previewScale,
                flexShrink: 0,
              }}
            >
              <div
                ref={previewRef}
                style={{
                  width: format.width,
                  height: format.height,
                  transform: `scale(${previewScale})`,
                  transformOrigin: '0 0',
                  position: 'relative',
                }}
              >
                <GraphicComponent data={activeSlide.data as any} width={format.width} height={format.height} />
                <LayerCanvas
                  layers={activeLayers}
                  selectedId={selectedLayerId}
                  onSelect={setSelectedLayerId}
                  onUpdate={updateLayer}
                  previewRef={previewRef}
                  formatWidth={format.width}
                />
              </div>
            </div>
          </div>

        </div>

          {/* Zoom controls — floating bottom-right, outside scroll container
              so they stay visible no matter how far the user has scrolled. */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-surface border border-border/60 rounded-lg shadow-md px-1 py-1 z-20">
            <button
              onClick={() => setZoomOverride(Math.max(0.1, previewScale - 0.1))}
              className="p-1.5 rounded text-text-muted hover:text-text hover:bg-muted/40 transition-colors"
              title="Kleiner"
            >
              <ZoomOut size={13} />
            </button>
            <button
              onClick={() => setZoomOverride(null)}
              className="px-2 py-1 text-[11px] font-mono text-text-muted hover:text-text tabular-nums min-w-[48px] text-center rounded hover:bg-muted/40 transition-colors"
              title="Auf Fenster einpassen"
            >
              {Math.round(previewScale * 100)}%
            </button>
            <button
              onClick={() => setZoomOverride(Math.min(2, previewScale + 0.1))}
              className="p-1.5 rounded text-text-muted hover:text-text hover:bg-muted/40 transition-colors"
              title="Größer"
            >
              <ZoomIn size={13} />
            </button>
            <div className="w-px h-4 bg-border/60 mx-0.5" />
            <button
              onClick={() => setZoomOverride(null)}
              className="p-1.5 rounded text-text-muted hover:text-text hover:bg-muted/40 transition-colors"
              title="Auf Fenster einpassen"
            >
              <Maximize2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Off-screen export */}
      <div style={{ position: 'fixed', left: -9999, top: -9999, pointerEvents: 'none', zIndex: -1 }}>
        {carousel.slides.map((slide) => (
          <div key={slide.id}
            ref={(el) => { if (el) exportRefs.current.set(slide.id, el); else exportRefs.current.delete(slide.id); }}
            style={{ width: format.width, height: format.height, position: 'relative' }}>
            <GraphicComponent data={slide.data as any} width={format.width} height={format.height} />
            {slide.layers.map((layer) => <StaticLayer key={layer.id} layer={layer} />)}
          </div>
        ))}
      </div>

      {showAssetLibrary && (
        <AssetLibraryModal
          onClose={() => setShowAssetLibrary(false)}
          onInsert={(svg) => { addLayer(createSvgLayer(svg)); setShowAssetLibrary(false); }}
        />
      )}
    </div>
  );
}

// ── CarouselMode ─────────────────────────────────────────────────
export function CarouselMode() {
  const carousel = useCarouselStore((s) => s.carousel);
  return carousel ? <Editor /> : <SetupScreen />;
}
