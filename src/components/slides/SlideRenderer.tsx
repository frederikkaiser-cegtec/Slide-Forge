import { Lock } from 'lucide-react';
import type { Slide, SlideElement } from '../../types';

const BASE = import.meta.env.BASE_URL || '/';
function resolveAsset(src: string): string {
  if (!src || src.startsWith('http') || src.startsWith('data:') || src.startsWith(BASE)) return src;
  return src.startsWith('/') ? `${BASE}${src.slice(1)}` : `${BASE}${src}`;
}

interface SlideRendererProps {
  slide: Slide;
  width: number;
  height: number;
  baseWidth?: number;
  baseHeight?: number;
  interactive?: boolean;
  selectedElementId?: string | null;
  editingElementId?: string | null;
  onElementClick?: (elementId: string) => void;
  onElementDoubleClick?: (elementId: string) => void;
  onElementUpdate?: (elementId: string, updates: Partial<SlideElement>) => void;
  onBackgroundClick?: () => void;
  className?: string;
}

export function SlideRenderer({
  slide,
  width,
  height,
  baseWidth = 1920,
  baseHeight = 1080,
  interactive = false,
  selectedElementId,
  editingElementId,
  onElementClick,
  onElementDoubleClick,
  onElementUpdate,
  onBackgroundClick,
  className = '',
}: SlideRendererProps) {
  const scaleX = width / baseWidth;
  const scaleY = height / baseHeight;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width,
        height,
        background: slide.background,
        fontFamily: "'Inter', system-ui, sans-serif",
        isolation: 'isolate',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onBackgroundClick?.();
      }}
    >
      {slide.elements.map((element) => (
        <RenderElement
          key={element.id}
          element={element}
          scaleX={scaleX}
          scaleY={scaleY}
          baseWidth={baseWidth}
          baseHeight={baseHeight}
          interactive={interactive}
          isSelected={selectedElementId === element.id}
          isEditing={editingElementId === element.id}
          onClick={() => onElementClick?.(element.id)}
          onDoubleClick={() => onElementDoubleClick?.(element.id)}
          onUpdate={(updates) => onElementUpdate?.(element.id, updates)}
        />
      ))}
    </div>
  );
}

interface RenderElementProps {
  element: SlideElement;
  scaleX: number;
  scaleY: number;
  baseWidth: number;
  baseHeight: number;
  interactive: boolean;
  isSelected: boolean;
  isEditing: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
  onUpdate: (updates: Partial<SlideElement>) => void;
}

function RenderElement({
  element,
  scaleX,
  scaleY,
  baseWidth,
  baseHeight,
  interactive,
  isSelected,
  onClick,
  onDoubleClick,
}: RenderElementProps) {
  const { x, y, width, height, style, type, content, rotation } = element;

  const left = (x / 100) * baseWidth * scaleX;
  const top = (y / 100) * baseHeight * scaleY;
  const w = (width / 100) * baseWidth * scaleX;
  const h = (height / 100) * baseHeight * scaleY;
  const fontSize = (style.fontSize || 24) * scaleX;

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left,
    top,
    width: w,
    height: h,
    transform: rotation ? `rotate(${rotation}deg)` : undefined,
    cursor: interactive ? 'pointer' : 'default',
    opacity: style.opacity ?? 1,
  };

  const lockOverlay = isSelected && interactive && element.locked && (
    <div className="absolute top-1 right-1 bg-black/60 rounded p-0.5 pointer-events-none">
      <Lock size={Math.max(10, 14 * scaleX)} className="text-yellow-400" />
    </div>
  );

  if (type === 'shape') {
    return (
      <div
        style={{
          ...baseStyle,
          backgroundColor: style.backgroundColor || '#333',
          borderRadius: style.borderRadius ? style.borderRadius * scaleX : 0,
        }}
        onClick={(e) => {
          if (!interactive) return;
          e.stopPropagation();
          onClick();
        }}
      >
        {isSelected && interactive && (
          <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" style={{ borderRadius: style.borderRadius ? style.borderRadius * scaleX : 0 }} />
        )}
        {lockOverlay}
      </div>
    );
  }

  if (type === 'image') {
    return (
      <div
        style={{
          ...baseStyle,
          backgroundImage: `url(${resolveAsset(content)})`,
          backgroundSize: style.objectFit === 'contain' ? 'contain' : 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: style.borderRadius ? style.borderRadius * scaleX : 0,
          filter: style.filter || undefined,
        }}
        onClick={(e) => {
          if (!interactive) return;
          e.stopPropagation();
          onClick();
        }}
      >
        {isSelected && interactive && (
          <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" />
        )}
        {lockOverlay}
      </div>
    );
  }

  // Text element
  return (
    <div
      style={{
        ...baseStyle,
        fontSize,
        fontWeight: style.fontWeight || 400,
        color: style.color || '#ffffff',
        textAlign: style.textAlign || 'left',
        lineHeight: 1.3,
        overflow: 'hidden',
        wordBreak: 'break-word',
      }}
      onClick={(e) => {
        if (!interactive) return;
        e.stopPropagation();
        onClick();
      }}
      onDoubleClick={(e) => {
        if (!interactive) return;
        e.stopPropagation();
        onDoubleClick();
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {isSelected && interactive && (
        <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" style={{ margin: -2 }} />
      )}
      {lockOverlay}
    </div>
  );
}
