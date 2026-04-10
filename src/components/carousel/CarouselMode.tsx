import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { Plus, Trash2, ChevronLeft, ChevronRight, Download, Archive } from 'lucide-react';
import { useCarouselStore } from '../../stores/carouselStore';
import { GRAPHIC_REGISTRY, getDefinition } from '../../registry';
import { FORMAT_PRESETS, getFormat } from '../../utils/formats';
import { useEditorStore } from '../../stores/editorStore';

// ── Thumbnail ────────────────────────────────────────────────────
const THUMB_W = 130;

function Thumbnail({ graphicType, formatId, data, active, index, onClick, onRemove, onMoveLeft, onMoveRight, isFirst, isLast }: {
  graphicType: string; formatId: string; data: unknown;
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
      <div
        onClick={onClick}
        className={`relative cursor-pointer rounded overflow-hidden border-2 transition-all ${active ? 'border-primary shadow-lg shadow-primary/20' : 'border-border/40 hover:border-border'}`}
        style={{ width: THUMB_W, height: thumbH }}
      >
        <div style={{ width: format.width, height: format.height, transform: `scale(${scale})`, transformOrigin: '0 0', pointerEvents: 'none' }}>
          <GraphicComponent data={data as any} width={format.width} height={format.height} />
        </div>
        {/* hover controls */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-black/40 flex items-end justify-between p-1">
          <button onClick={(e) => { e.stopPropagation(); onMoveLeft(); }} disabled={isFirst}
            className="p-0.5 rounded bg-black/60 text-white disabled:opacity-30 hover:bg-black/80">
            <ChevronLeft size={10} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-0.5 rounded bg-red-500/80 text-white hover:bg-red-600">
            <Trash2 size={10} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMoveRight(); }} disabled={isLast}
            className="p-0.5 rounded bg-black/60 text-white disabled:opacity-30 hover:bg-black/80">
            <ChevronRight size={10} />
          </button>
        </div>
      </div>
      <span className={`text-[10px] font-medium ${active ? 'text-primary' : 'text-text-muted/50'}`}>{index + 1}</span>
    </div>
  );
}

// ── Setup Screen ─────────────────────────────────────────────────
function SetupScreen() {
  const { create } = useCarouselStore();
  const [graphicType, setGraphicType] = useState('outreach-pipeline');
  const [formatId, setFormatId] = useState('4:5');
  const [count, setCount] = useState(6);

  // Only show graphic types that make sense for carousels (not force-format banners)
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
            <input type="range" min={1} max={12} value={count} onChange={(e) => setCount(+e.target.value)}
              className="w-full accent-primary" />
            <div className="flex justify-between text-[10px] text-text-muted/40 mt-0.5">
              <span>1</span><span>12</span>
            </div>
          </div>
        </div>

        <button onClick={() => create(graphicType, formatId, count)}
          className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium text-sm transition-colors">
          {count} Slides erstellen
        </button>
      </div>
    </div>
  );
}

// ── Editor ───────────────────────────────────────────────────────
function Editor() {
  const { carousel, activeSlideId, setActive, updateSlide, addSlide, removeSlide, moveSlide, reset } = useCarouselStore();
  const setMode = useEditorStore((s) => s.setMode);
  const [exporting, setExporting] = useState(false);

  if (!carousel) return null;

  const format = getFormat(carousel.formatId);
  const def = getDefinition(carousel.graphicType);
  const FormComponent = def.FormComponent;
  const GraphicComponent = def.GraphicComponent;
  const activeSlide = carousel.slides.find((s) => s.id === activeSlideId) ?? carousel.slides[0];

  // refs for off-screen export
  const exportRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const previewScale = Math.min(
    (window.innerWidth - 340) / format.width,
    (window.innerHeight - 180) / format.height,
    1,
  );

  const handleExportZip = async () => {
    setExporting(true);
    try {
      const zip = new JSZip();
      for (let i = 0; i < carousel.slides.length; i++) {
        const slide = carousel.slides[i];
        const el = exportRefs.current.get(slide.id);
        if (!el) continue;
        const dataUrl = await toPng(el, { width: format.width, height: format.height, pixelRatio: 3 });
        zip.file(`slide-${String(i + 1).padStart(2, '0')}.png`, dataUrl.split(',')[1], { base64: true });
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `carousel-${carousel.graphicType}.zip`; a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const handleExportActive = async () => {
    const el = exportRefs.current.get(activeSlide.id);
    if (!el) return;
    const dataUrl = await toPng(el, { width: format.width, height: format.height, pixelRatio: 3 });
    const a = document.createElement('a'); a.href = dataUrl;
    a.download = `slide-${carousel.slides.indexOf(activeSlide) + 1}.png`; a.click();
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
          <span className="text-[10px] text-text-muted/50 ml-auto">{format.label}</span>
        </div>

        <div className="p-3 flex-1 overflow-y-auto">
          <p className="text-[10px] text-text-muted/50 uppercase tracking-wider font-medium mb-2">
            Slide {carousel.slides.indexOf(activeSlide) + 1} von {carousel.slides.length}
          </p>
          <FormComponent data={activeSlide.data as any} onChange={(d: any) => updateSlide(activeSlide.id, d)} />
        </div>

        <div className="p-3 border-t border-border/40 space-y-2">
          <div className="flex gap-2">
            <button onClick={handleExportActive}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs bg-muted/50 hover:bg-muted text-text-muted hover:text-text rounded-lg transition-colors">
              <Download size={12} /> PNG
            </button>
            <button onClick={handleExportZip} disabled={exporting}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors disabled:opacity-60">
              <Archive size={12} /> {exporting ? 'Exportiere…' : 'ZIP alle'}
            </button>
          </div>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-bg">
        {/* Slide strip */}
        <div className="bg-surface border-b border-border/60 px-4 py-3">
          <div className="flex items-end gap-3 overflow-x-auto pb-1">
            {carousel.slides.map((slide, i) => (
              <Thumbnail key={slide.id}
                graphicType={carousel.graphicType} formatId={carousel.formatId} data={slide.data}
                active={slide.id === activeSlide.id} index={i}
                onClick={() => setActive(slide.id)}
                onRemove={() => removeSlide(slide.id)}
                onMoveLeft={() => moveSlide(i, i - 1)}
                onMoveRight={() => moveSlide(i, i + 1)}
                isFirst={i === 0} isLast={i === carousel.slides.length - 1}
              />
            ))}
            <button onClick={addSlide}
              className="flex flex-col items-center justify-center gap-1 shrink-0 rounded border-2 border-dashed border-border/40 hover:border-primary/40 text-text-muted/40 hover:text-primary transition-colors"
              style={{ width: THUMB_W, height: Math.round(getFormat(carousel.formatId).height * (THUMB_W / getFormat(carousel.formatId).width)) }}>
              <Plus size={18} />
              <span className="text-[10px]">Slide</span>
            </button>
          </div>
        </div>

        {/* Active preview */}
        <div className="flex-1 flex items-center justify-center overflow-auto p-8">
          <div style={{
            width: format.width, height: format.height,
            transform: `scale(${previewScale})`, transformOrigin: 'center center',
            position: 'relative',
          }}>
            <GraphicComponent data={activeSlide.data as any} width={format.width} height={format.height} />
          </div>
        </div>
      </div>

      {/* Off-screen export container */}
      <div style={{ position: 'fixed', left: -9999, top: -9999, pointerEvents: 'none', zIndex: -1 }}>
        {carousel.slides.map((slide) => (
          <div key={slide.id}
            ref={(el) => { if (el) exportRefs.current.set(slide.id, el); else exportRefs.current.delete(slide.id); }}
            style={{ width: format.width, height: format.height, position: 'relative' }}>
            <GraphicComponent data={slide.data as any} width={format.width} height={format.height} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CarouselMode ─────────────────────────────────────────────────
export function CarouselMode() {
  const carousel = useCarouselStore((s) => s.carousel);
  return carousel ? <Editor /> : <SetupScreen />;
}
