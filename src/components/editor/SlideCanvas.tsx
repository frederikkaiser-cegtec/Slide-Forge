import { useRef, useEffect, useState, useCallback } from 'react';
import { usePresentationStore } from '../../stores/presentationStore';
import { useEditorStore } from '../../stores/editorStore';
import { SlideRenderer } from '../slides/SlideRenderer';
import { TextEditor } from './TextEditor';
import { getFormat } from '../../utils/formats';
import type { SlideElement } from '../../types';

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
      <div className="relative" style={{ width: canvasSize.width, height: canvasSize.height }}>
        {/* Export targets (hidden) */}
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            id={`slide-export-${idx}`}
            style={{ position: 'absolute', left: -9999, top: 0, width: format.width, height: format.height }}
          >
            <SlideRenderer slide={slide} width={format.width} height={format.height} baseWidth={format.width} baseHeight={format.height} />
          </div>
        ))}

        {/* Main canvas */}
        <div className="rounded-lg overflow-hidden shadow-2xl ring-1 ring-border">
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
      style={{ width, height, background: slide.background, position: 'relative', overflow: 'hidden', fontFamily: "'Inter', system-ui, sans-serif" }}
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

        if (element.type === 'image') {
          return (
            <div
              key={element.id}
              style={{ position: 'absolute', left, top, width: w, height: h, cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); onElementClick(element.id); }}
            >
              <img src={element.content} alt="" style={{ width: '100%', height: '100%', objectFit: style.objectFit || 'cover', filter: style.filter || undefined }} draggable={false} />
              {isSelected && <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" />}
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
