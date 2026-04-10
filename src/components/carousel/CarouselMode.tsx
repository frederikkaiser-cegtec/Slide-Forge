import { useCallback, useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import jsPDF from 'jspdf';
import { Plus, Trash2, ChevronLeft, ChevronRight, Download, Archive, ChevronDown, ChevronUp, Layers, Copy, FileText, Save, FolderOpen, X } from 'lucide-react';
import { useCarouselStore } from '../../stores/carouselStore';
import { useSavedGraphicsStore } from '../../stores/savedGraphicsStore';
import { GRAPHIC_REGISTRY, getDefinition } from '../../registry';
import { FORMAT_PRESETS, getFormat } from '../../utils/formats';
import { useEditorStore } from '../../stores/editorStore';
import { AssetLibraryModal } from '../graphics/AssetLibraryModal';
import { LayerCanvas, normalizeSvgSize } from '../graphics/LayerCanvas';
import { LayerPanel } from '../graphics/LayerPanel';
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
  const savedCarousels = graphics.filter((g) => g.type === 'carousel');

  const handlePipelineSplit = () => {
    const base = structuredClone(defaultOutreachPipelineData);
    const slides = base.phases.map((_, pi) => ({
      id: crypto.randomUUID(),
      data: { ...structuredClone(base), activePhaseIndex: pi },
      layers: [] as Layer[],
    }));
    useCarouselStore.setState({ carousel: { graphicType: 'outreach-pipeline', formatId: '4:5', slides }, activeSlideId: slides[0].id });
  };

  const [graphicType, setGraphicType] = useState('outreach-pipeline');
  const [formatId, setFormatId] = useState('4:5');
  const [count, setCount] = useState(6);
  const types = GRAPHIC_REGISTRY.filter((d) => !['kpi-banner'].includes(d.id));

  return (
    <div className="flex-1 flex items-center justify-center bg-bg">
      <div className="bg-surface border border-border/60 rounded-2xl p-8 w-[420px] space-y-5 shadow-xl">
        <div>
          <h2 className="text-lg font-semibold text-text" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Carousel erstellen</h2>
          <p className="text-sm text-text-muted mt-1">Mehrere Slides desselben Templates bearbeiten &amp; exportieren</p>
        </div>
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
        <div className="border border-border/60 rounded-xl p-4 bg-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={14} className="text-primary" />
            <span className="text-sm font-semibold text-text" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pipeline aufteilen</span>
          </div>
          <p className="text-xs text-text-muted mb-3">Erstellt automatisch 5 Slides — je eine pro Phase</p>
          <button onClick={handlePipelineSplit}
            className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg font-medium text-sm transition-colors">
            Pipeline → 5 Slides
          </button>
        </div>
        <div className="relative flex items-center gap-2">
          <div className="flex-1 h-px bg-border/40" />
          <span className="text-[10px] text-text-muted/40 uppercase tracking-wider">oder manuell</span>
          <div className="flex-1 h-px bg-border/40" />
        </div>
        <button onClick={() => create(graphicType, formatId, count)}
          className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium text-sm transition-colors">
          {count} Slides erstellen
        </button>

        {/* Saved templates */}
        {savedCarousels.length > 0 && (
          <div className="pt-2 border-t border-border/40 space-y-2">
            <div className="flex items-center gap-1.5">
              <FolderOpen size={12} className="text-text-muted/50" />
              <span className="text-[11px] text-text-muted/60 uppercase tracking-wider font-medium">Gespeicherte Vorlagen</span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {savedCarousels.map((g) => (
                <div key={g.id} className="flex items-center gap-2 group">
                  <button
                    onClick={() => {
                      const c = g.data as { graphicType: string; formatId: string; slides: any[] };
                      const slides = c.slides.map((sl: any) => ({ ...sl, id: crypto.randomUUID() }));
                      useCarouselStore.setState({
                        carousel: { graphicType: c.graphicType, formatId: c.formatId, slides },
                        activeSlideId: slides[0].id,
                      });
                    }}
                    className="flex-1 text-left px-3 py-2 rounded-lg bg-muted/40 hover:bg-muted/70 border border-border/40 hover:border-primary/30 transition-colors"
                  >
                    <div className="text-[12px] font-medium text-text truncate">{g.name}</div>
                    <div className="text-[10px] text-text-muted/50 mt-0.5">{(g.data as any)?.slides?.length ?? '?'} Slides · {g.formatId}</div>
                  </button>
                  <button onClick={() => remove(g.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-text-muted/40 hover:text-red-400 transition-all">
                    <X size={12} />
                  </button>
                </div>
              ))}
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
  const previewRef = useRef<HTMLDivElement>(null);
  const exportRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  if (!carousel) return null;

  const format = getFormat(carousel.formatId);
  const def = getDefinition(carousel.graphicType);
  const FormComponent = def.FormComponent;
  const GraphicComponent = def.GraphicComponent;
  const activeSlide = carousel.slides.find((s) => s.id === activeSlideId) ?? carousel.slides[0];
  const activeLayers = activeSlide.layers;

  const previewScale = Math.min(
    (window.innerWidth - 340) / format.width,
    (window.innerHeight - 180) / format.height,
    1,
  );

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
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [format.width, format.height], hotfixes: ['px_scaling'] });
      for (let i = 0; i < carousel.slides.length; i++) {
        const el = exportRefs.current.get(carousel.slides[i].id);
        if (!el) continue;
        const dataUrl = await toPng(el, { width: format.width, height: format.height, pixelRatio: 2 });
        if (i > 0) pdf.addPage([format.width, format.height], 'portrait');
        pdf.addImage(dataUrl, 'PNG', 0, 0, format.width, format.height);
      }
      pdf.save(`carousel-${carousel.graphicType}.pdf`);
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
        <div className="flex-1 flex items-center justify-center overflow-auto p-8">
          <div ref={previewRef} style={{
            width: format.width, height: format.height,
            transform: `scale(${previewScale})`, transformOrigin: 'center center',
            position: 'relative',
          }}>
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
