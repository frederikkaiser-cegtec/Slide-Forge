import { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { usePresentationStore } from '../../stores/presentationStore';
import { useEditorStore } from '../../stores/editorStore';
import { SlideRenderer } from '../slides/SlideRenderer';
import { TextEditor } from './TextEditor';
import { getFormat } from '../../utils/formats';
import type { SlideElement } from '../../types';
import { FONTS } from '../../utils/cegtecTheme';

const BASE = import.meta.env.BASE_URL || '/';
function resolveAsset(src: string): string {
  if (!src || src.startsWith('http') || src.startsWith('data:') || src.startsWith(BASE)) return src;
  return src.startsWith('/') ? `${BASE}${src.slice(1)}` : `${BASE}${src}`;
}

// ── Resize / Move handles overlay ─────────────────────────────────────────

type HandleId = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'move';

function ResizeHandles({
  element,
  canvasWidth,
  canvasHeight,
  baseWidth,
  baseHeight,
  onUpdate,
  onDoubleClick,
}: {
  element: SlideElement;
  canvasWidth: number;
  canvasHeight: number;
  baseWidth: number;
  baseHeight: number;
  onUpdate: (updates: Partial<SlideElement>) => void;
  onDoubleClick?: () => void;
}) {
  const dragRef = useRef<{
    handle: HandleId;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
  } | null>(null);

  const scaleX = canvasWidth / baseWidth;
  const scaleY = canvasHeight / baseHeight;
  const left = (element.x / 100) * baseWidth * scaleX;
  const top = (element.y / 100) * baseHeight * scaleY;
  const width = (element.width / 100) * baseWidth * scaleX;
  const height = (element.height / 100) * baseHeight * scaleY;

  const startDrag = useCallback((e: React.MouseEvent, handle: HandleId) => {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      origX: element.x,
      origY: element.y,
      origW: element.width,
      origH: element.height,
    };

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const { handle: h, startX, startY, origX, origY, origW, origH } = dragRef.current;
      // Convert pixel delta to % of slide
      const dx = ((ev.clientX - startX) / canvasWidth) * 100;
      const dy = ((ev.clientY - startY) / canvasHeight) * 100;
      let x = origX, y = origY, w = origW, hh = origH;
      if (h === 'move') { x = origX + dx; y = origY + dy; }
      else {
        if (h.includes('e')) w = Math.max(3, origW + dx);
        if (h.includes('s')) hh = Math.max(3, origH + dy);
        if (h.includes('w')) { x = origX + dx; w = Math.max(3, origW - dx); }
        if (h.includes('n')) { y = origY + dy; hh = Math.max(3, origH - dy); }
      }
      onUpdate({ x, y, width: w, height: hh });
    };

    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [element, canvasWidth, canvasHeight, onUpdate]);

  const handles: Array<{ id: HandleId; lx: number; ly: number; cursor: string }> = [
    { id: 'nw', lx: left,           ly: top,            cursor: 'nw-resize' },
    { id: 'n',  lx: left + width/2, ly: top,            cursor: 'n-resize'  },
    { id: 'ne', lx: left + width,   ly: top,            cursor: 'ne-resize' },
    { id: 'e',  lx: left + width,   ly: top + height/2, cursor: 'e-resize'  },
    { id: 'se', lx: left + width,   ly: top + height,   cursor: 'se-resize' },
    { id: 's',  lx: left + width/2, ly: top + height,   cursor: 's-resize'  },
    { id: 'sw', lx: left,           ly: top + height,   cursor: 'sw-resize' },
    { id: 'w',  lx: left,           ly: top + height/2, cursor: 'w-resize'  },
  ];

  return (
    <>
      {/* Outline */}
      <div style={{ position: 'absolute', left, top, width, height, border: '2px solid #3b82f6', pointerEvents: 'none', zIndex: 10 }} />
      {/* Move zone */}
      <div style={{ position: 'absolute', left, top, width, height, cursor: 'move', zIndex: 11 }}
        onMouseDown={(e) => startDrag(e, 'move')}
        onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick?.(); }} />
      {/* Resize handles */}
      {handles.map((h) => (
        <div key={h.id}
          style={{ position: 'absolute', left: h.lx - 5, top: h.ly - 5, width: 10, height: 10,
            background: 'white', border: '2px solid #3b82f6', borderRadius: 2,
            cursor: h.cursor, zIndex: 12 }}
          onMouseDown={(e) => startDrag(e, h.id)} />
      ))}
    </>
  );
}

export function SlideCanvas() {
  const slides = usePresentationStore((s) => s.presentation.slides);
  const formatId = usePresentationStore((s) => s.presentation.formatId);
  const selectedSlideId = useEditorStore((s) => s.selectedSlideId);
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const editingElementId = useEditorStore((s) => s.editingElementId);
  const selectElement = useEditorStore((s) => s.selectElement);
  const setEditingElement = useEditorStore((s) => s.setEditingElement);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const updateElement = usePresentationStore((s) => s.updateElement);
  const pushUndo = usePresentationStore((s) => s.pushUndo);
  const zoom = useEditorStore((s) => s.zoom);

  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 960, height: 540 });

  const currentSlide = slides.find((s) => s.id === selectedSlideId);
  const format = getFormat(formatId ?? '16:9');
  const aspect = format.width / format.height;
  const selectedElement = currentSlide?.elements.find((e) => e.id === selectedElementId);

  const updateSize = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const padding = 60;
    const availWidth = rect.width - padding * 2;
    const availHeight = rect.height - padding * 2;

    let w = availWidth;
    let h = w / aspect;
    if (h > availHeight) {
      h = availHeight;
      w = h * aspect;
    }
    setCanvasSize({ width: Math.round(w * zoom), height: Math.round(h * zoom) });
  }, [zoom, aspect]);

  useEffect(() => {
    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [updateSize]);

  const handleElementUpdate = useCallback(
    (elementId: string, updates: Partial<SlideElement>) => {
      if (!selectedSlideId) return;
      // Block position/size updates for locked elements
      const slide = slides.find((s) => s.id === selectedSlideId);
      const el = slide?.elements.find((e) => e.id === elementId);
      if (el?.locked) {
        const { x, y, width, height, ...allowed } = updates;
        if (Object.keys(allowed).length === 0 && (x !== undefined || y !== undefined || width !== undefined || height !== undefined)) {
          return;
        }
        updateElement(selectedSlideId, elementId, allowed);
        return;
      }
      updateElement(selectedSlideId, elementId, updates);
    },
    [selectedSlideId, updateElement, slides]
  );

  if (!currentSlide) {
    return (
      <div ref={containerRef} className="flex-1 flex items-center justify-center bg-bg">
        <p className="text-text-muted text-sm">Select a slide to edit</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 flex items-center justify-center bg-bg overflow-auto">
      {/* Export targets - rendered in portal outside canvas to prevent ghost text */}
      {createPortal(
        <div id="slide-export-container" style={{ position: 'fixed', left: -9999, top: -9999, pointerEvents: 'none', display: 'none' }} aria-hidden="true">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              id={`slide-export-${idx}`}
              style={{ width: format.width, height: format.height }}
            >
              <SlideRenderer slide={slide} width={format.width} height={format.height} baseWidth={format.width} baseHeight={format.height} />
            </div>
          ))}
        </div>,
        document.body
      )}

      <div className="relative" style={{ width: canvasSize.width, height: canvasSize.height }}>
        {/* Main canvas */}
        <div className="rounded-lg overflow-hidden shadow-2xl ring-1 ring-border" style={{ position: 'relative', zIndex: 1 }}>
          {editingElementId ? (
            <EditableSlideView
              slide={currentSlide}
              width={canvasSize.width}
              height={canvasSize.height}
              baseWidth={format.width}
              baseHeight={format.height}
              editingElementId={editingElementId}
              selectedElementId={selectedElementId}
              onElementClick={(id) => selectElement(id)}
              onElementDoubleClick={(id) => {
                const el = currentSlide.elements.find((e) => e.id === id);
                if (el?.type === 'text') setEditingElement(id);
              }}
              onBackgroundClick={clearSelection}
              onElementUpdate={handleElementUpdate}
              onFinishEditing={() => setEditingElement(null)}
              pushUndo={pushUndo}
            />
          ) : (
            <SlideRenderer
              slide={currentSlide}
              width={canvasSize.width}
              height={canvasSize.height}
              baseWidth={format.width}
              baseHeight={format.height}
              interactive
              selectedElementId={selectedElementId}
              editingElementId={editingElementId}
              onElementClick={(id) => selectElement(id)}
              onElementDoubleClick={(id) => {
                const el = currentSlide.elements.find((e) => e.id === id);
                if (el?.type === 'text') setEditingElement(id);
              }}
              onBackgroundClick={clearSelection}
              onElementUpdate={handleElementUpdate}
            />
          )}
        </div>

        {/* Resize/move handles for selected element */}
        {selectedElement && !editingElementId && !selectedElement.locked && (
          <ResizeHandles
            element={selectedElement}
            canvasWidth={canvasSize.width}
            canvasHeight={canvasSize.height}
            baseWidth={format.width}
            baseHeight={format.height}
            onUpdate={(updates) => handleElementUpdate(selectedElement.id, updates)}
            onDoubleClick={() => {
              if (selectedElement.type === 'text') setEditingElement(selectedElement.id);
            }}
          />
        )}
      </div>
    </div>
  );
}

function EditableSlideView({
  slide,
  width,
  height,
  baseWidth,
  baseHeight,
  editingElementId,
  selectedElementId,
  onElementClick,
  onElementDoubleClick,
  onBackgroundClick,
  onElementUpdate,
  onFinishEditing,
  pushUndo,
}: {
  slide: NonNullable<ReturnType<typeof usePresentationStore.getState>['presentation']['slides'][0]>;
  width: number;
  height: number;
  baseWidth: number;
  baseHeight: number;
  editingElementId: string;
  selectedElementId: string | null;
  onElementClick: (id: string) => void;
  onElementDoubleClick: (id: string) => void;
  onBackgroundClick: () => void;
  onElementUpdate: (id: string, updates: Partial<SlideElement>) => void;
  onFinishEditing: () => void;
  pushUndo: () => void;
}) {
  const scaleX = width / baseWidth;
  const scaleY = height / baseHeight;

  return (
    <div
      style={{ width, height, background: slide.background, position: 'relative', overflow: 'hidden', fontFamily: FONTS.display }}
      onClick={(e) => { if (e.target === e.currentTarget) { onFinishEditing(); onBackgroundClick(); } }}
    >
      {slide.elements.map((element) => {
        const { x, y, width: ew, height: eh, style, rotation } = element;
        const left = (x / 100) * baseWidth * scaleX;
        const top = (y / 100) * baseHeight * scaleY;
        const w = (ew / 100) * baseWidth * scaleX;
        const h = (eh / 100) * baseHeight * scaleY;
        const fontSize = (style.fontSize || 24) * scaleX;
        const isEditing = element.id === editingElementId;
        const isSelected = element.id === selectedElementId;

        if (isEditing && element.type === 'text') {
          return (
            <div
              key={element.id}
              style={{
                position: 'absolute',
                left, top, width: w, height: h,
                transform: rotation ? `rotate(${rotation}deg)` : undefined,
                fontSize,
                fontWeight: style.fontWeight || 400,
                color: style.color || '#ffffff',
                textAlign: style.textAlign || 'left',
                lineHeight: 1.3,
                overflow: 'hidden',
                wordBreak: 'break-word',
                zIndex: 10,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <TextEditor
                content={element.content}
                onChange={(content) => onElementUpdate(element.id, { content })}
                onBlur={() => onFinishEditing()}
                pushUndo={pushUndo}
              />
              <div className="absolute inset-0 border-2 border-primary pointer-events-none" style={{ margin: -2 }} />
            </div>
          );
        }

        if (element.type === 'shape') {
          return (
            <div
              key={element.id}
              style={{
                position: 'absolute', left, top, width: w, height: h,
                backgroundColor: style.backgroundColor || '#333',
                borderRadius: style.borderRadius ? style.borderRadius * scaleX : 0,
                transform: rotation ? `rotate(${rotation}deg)` : undefined,
                cursor: 'pointer',
              }}
              onClick={(e) => { e.stopPropagation(); onElementClick(element.id); }}
            >
              {isSelected && <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" />}
            </div>
          );
        }

        if (element.type === 'svg') {
          return (
            <div key={element.id}
              style={{ position: 'absolute', left, top, width: w, height: h, overflow: 'hidden', cursor: 'pointer',
                transform: rotation ? `rotate(${rotation}deg)` : undefined, color: element.style.color || '#ffffff', opacity: element.style.opacity ?? 1 }}
              onClick={(e) => { e.stopPropagation(); onElementClick(element.id); }}>
              <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
                dangerouslySetInnerHTML={{ __html: element.content.replace(/<svg([^>]*)>/, (_, a) => `<svg${a.replace(/\s*(width|height)="[^"]*"/g, '')} width="100%" height="100%">`) }} />
              {isSelected && <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" />}
            </div>
          );
        }

        if (element.type === 'image') {
          const imgRadius = style.borderRadius ? style.borderRadius * scaleX : 0;
          const imgScale = style.scale != null ? style.scale / 100 : 1;
          return (
            <div
              key={element.id}
              style={{ position: 'absolute', left, top, width: w, height: h, cursor: 'pointer', borderRadius: imgRadius, overflow: 'hidden', transform: imgScale !== 1 ? `scale(${imgScale})` : undefined, transformOrigin: 'center center' }}
              onClick={(e) => { e.stopPropagation(); onElementClick(element.id); }}
            >
              <img src={resolveAsset(element.content)} alt="" style={{ width: '100%', height: '100%', objectFit: style.objectFit || 'cover', filter: style.filter || undefined }} draggable={false} />
              {isSelected && <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" style={{ borderRadius: imgRadius }} />}
            </div>
          );
        }

        // Non-editing text
        return (
          <div
            key={element.id}
            style={{
              position: 'absolute', left, top, width: w, height: h,
              fontSize, fontWeight: style.fontWeight || 400,
              color: style.color || '#ffffff', textAlign: style.textAlign || 'left',
              lineHeight: 1.3, overflow: 'hidden', wordBreak: 'break-word',
              transform: rotation ? `rotate(${rotation}deg)` : undefined,
              cursor: 'pointer',
              filter: style.filter || undefined,
            }}
            onClick={(e) => { e.stopPropagation(); onElementClick(element.id); }}
            onDoubleClick={(e) => { e.stopPropagation(); onElementDoubleClick(element.id); }}
          >
            <div dangerouslySetInnerHTML={{ __html: element.content }} />
            {isSelected && <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" style={{ margin: -2 }} />}
          </div>
        );
      })}
    </div>
  );
}
