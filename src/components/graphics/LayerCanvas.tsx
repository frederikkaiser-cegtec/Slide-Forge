import { useCallback, useRef } from 'react';
import type { Layer, TextLayer } from '../../types/layers';

// ── Helpers ───────────────────────────────────────────────────────
export function normalizeSvgSize(svg: string): string {
  return svg.replace(/<svg([^>]*)>/, (_, a) =>
    `<svg${a.replace(/\s*(width|height)="[^"]*"/g, '')} width="100%" height="100%">`,
  );
}

type HandleId = 'tl' | 'tr' | 'bl' | 'br' | 'rotate';

const CURSOR: Record<HandleId, string> = {
  tl: 'nw-resize', tr: 'ne-resize', bl: 'sw-resize', br: 'se-resize', rotate: 'grab',
};

function Handle({ id, style, onDown }: { id: HandleId; style: React.CSSProperties; onDown: (e: React.MouseEvent) => void }) {
  return (
    <div
      data-handle={id}
      onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); onDown(e); }}
      style={{
        position: 'absolute', width: 10, height: 10,
        background: 'white', border: '2px solid #6366f1',
        borderRadius: id === 'rotate' ? '50%' : 2,
        cursor: CURSOR[id], zIndex: 20, boxSizing: 'border-box',
        ...style,
      }}
    />
  );
}

// ── LayerElement ──────────────────────────────────────────────────
interface ElemProps {
  layer: Layer;
  selected: boolean;
  showHandles: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<Layer>) => void;
  getScale: () => number;
  getPreviewRect: () => DOMRect | null;
}

function LayerElement({ layer, selected, showHandles, onSelect, onUpdate, getScale, getPreviewRect }: ElemProps) {
  const dragging = useRef(false);

  const startMove = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).dataset.handle) return;
    e.stopPropagation(); e.preventDefault();
    dragging.current = false;
    const scale = getScale();
    const sx = e.clientX, sy = e.clientY, ox = layer.x, oy = layer.y;
    const onMove = (me: MouseEvent) => {
      dragging.current = true;
      onUpdate({ x: Math.round(ox + (me.clientX - sx) / scale), y: Math.round(oy + (me.clientY - sy) / scale) } as any);
    };
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const startResize = useCallback((e: React.MouseEvent, h: 'tl' | 'tr' | 'bl' | 'br') => {
    e.stopPropagation(); e.preventDefault();
    const scale = getScale();
    const sx = e.clientX, sy = e.clientY;
    const { x: ox, y: oy, width: ow, height: oh, rotation } = layer;
    const rad = -(rotation * Math.PI / 180);
    const onMove = (me: MouseEvent) => {
      const dx = (me.clientX - sx) / scale, dy = (me.clientY - sy) / scale;
      // Rotate delta into layer-local space
      const ldx = dx * Math.cos(rad) + dy * Math.sin(rad);
      const ldy = -dx * Math.sin(rad) + dy * Math.cos(rad);
      let nx = ox, ny = oy, nw = ow, nh = oh;
      if (h === 'br') { nw = Math.max(20, ow + ldx); nh = Math.max(20, oh + ldy); }
      if (h === 'bl') { nx = ox + ldx; nw = Math.max(20, ow - ldx); nh = Math.max(20, oh + ldy); }
      if (h === 'tr') { ny = oy + ldy; nw = Math.max(20, ow + ldx); nh = Math.max(20, oh - ldy); }
      if (h === 'tl') { nx = ox + ldx; ny = oy + ldy; nw = Math.max(20, ow - ldx); nh = Math.max(20, oh - ldy); }
      onUpdate({ x: Math.round(nx), y: Math.round(ny), width: Math.round(nw), height: Math.round(nh) } as any);
    };
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [layer, getScale, onUpdate]);

  const startRotate = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); e.preventDefault();
    const rect = getPreviewRect(); if (!rect) return;
    const scale = getScale();
    const cx = rect.left + (layer.x + layer.width / 2) * scale;
    const cy = rect.top + (layer.y + layer.height / 2) * scale;
    const onMove = (me: MouseEvent) => {
      const angle = Math.atan2(me.clientY - cy, me.clientX - cx) * 180 / Math.PI + 90;
      onUpdate({ rotation: Math.round(((angle % 360) + 360) % 360) } as any);
    };
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [layer, getScale, getPreviewRect, onUpdate]);

  const isText = layer.type === 'text';
  const tl = layer as TextLayer;

  return (
    <div
      onMouseDown={(e) => { onSelect(); startMove(e); }}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute', left: layer.x, top: layer.y,
        width: layer.width, height: layer.height,
        transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
        transformOrigin: 'center center',
        opacity: layer.opacity / 100,
        cursor: 'move', userSelect: 'none', color: layer.color,
      }}
    >
      {/* Content */}
      {isText ? (
        <div style={{
          width: '100%', height: '100%', overflow: 'hidden',
          fontSize: tl.fontSize, fontWeight: tl.fontWeight,
          textAlign: tl.textAlign, fontFamily: tl.fontFamily,
          lineHeight: 1.2, display: 'flex', alignItems: 'center',
          wordBreak: 'break-word', pointerEvents: 'none',
        }}>
          {layer.content || ' '}
        </div>
      ) : (
        <div style={{ width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}
          dangerouslySetInnerHTML={{ __html: normalizeSvgSize(layer.content) }} />
      )}

      {/* Selection outline + handles */}
      {selected && showHandles && (
        <>
          <div style={{ position: 'absolute', inset: -2, border: '2px solid #6366f1', borderRadius: 2, pointerEvents: 'none' }} />
          {/* Rotation line + handle */}
          <div style={{ position: 'absolute', left: '50%', top: -22, width: 1, height: 20, background: '#6366f1', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
          <Handle id="rotate" style={{ left: '50%', top: -27, transform: 'translateX(-50%)' }} onDown={startRotate} />
          <Handle id="tl" style={{ left: -5, top: -5 }} onDown={(e) => startResize(e, 'tl')} />
          <Handle id="tr" style={{ right: -5, top: -5 }} onDown={(e) => startResize(e, 'tr')} />
          <Handle id="bl" style={{ left: -5, bottom: -5 }} onDown={(e) => startResize(e, 'bl')} />
          <Handle id="br" style={{ right: -5, bottom: -5 }} onDown={(e) => startResize(e, 'br')} />
        </>
      )}
    </div>
  );
}

// ── LayerCanvas ───────────────────────────────────────────────────
interface CanvasProps {
  layers: Layer[];
  selectedId: string | null;
  showHandles?: boolean;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, patch: Partial<Layer>) => void;
  previewRef: React.RefObject<HTMLDivElement | null>;
  formatWidth: number;
}

export function LayerCanvas({ layers, selectedId, showHandles = true, onSelect, onUpdate, previewRef, formatWidth }: CanvasProps) {
  const getScale = useCallback(() => {
    const r = previewRef.current?.getBoundingClientRect();
    return r ? r.width / formatWidth : 1;
  }, [previewRef, formatWidth]);

  const getPreviewRect = useCallback(() =>
    previewRef.current?.getBoundingClientRect() ?? null,
  [previewRef]);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 5 }}
      onClick={() => onSelect(null)}>
      {layers.map((layer) => (
        <LayerElement
          key={layer.id}
          layer={layer}
          selected={layer.id === selectedId}
          showHandles={showHandles}
          onSelect={() => onSelect(layer.id)}
          onUpdate={(patch) => onUpdate(layer.id, patch)}
          getScale={getScale}
          getPreviewRect={getPreviewRect}
        />
      ))}
    </div>
  );
}
