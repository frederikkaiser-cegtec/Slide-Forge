import { usePresentationStore } from '../../stores/presentationStore';
import { useEditorStore } from '../../stores/editorStore';
import { SlideRenderer } from '../slides/SlideRenderer';
import { Plus, Trash2, Copy } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Slide } from '../../types';
import { getFormat } from '../../utils/formats';

export function SlideSidebar() {
  const slides = usePresentationStore((s) => s.presentation.slides);
  const formatId = usePresentationStore((s) => s.presentation.formatId);
  const reorderSlides = usePresentationStore((s) => s.reorderSlides);
  const removeSlide = usePresentationStore((s) => s.removeSlide);
  const duplicateSlide = usePresentationStore((s) => s.duplicateSlide);
  const selectedSlideId = useEditorStore((s) => s.selectedSlideId);
  const selectSlide = useEditorStore((s) => s.selectSlide);
  const setShowTemplatePicker = useEditorStore((s) => s.setShowTemplatePicker);
  const format = getFormat(formatId ?? '16:9');
  const thumbWidth = 192;
  const thumbHeight = Math.round(thumbWidth / (format.width / format.height));

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = slides.findIndex((s) => s.id === active.id);
    const to = slides.findIndex((s) => s.id === over.id);
    if (from !== -1 && to !== -1) reorderSlides(from, to);
  };

  return (
    <div className="w-56 bg-surface border-r border-border flex flex-col shrink-0">
      <div className="p-2 border-b border-border flex items-center justify-between">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Slides</span>
        <button
          onClick={() => setShowTemplatePicker(true)}
          className="p-1 rounded hover:bg-surface-hover text-text-muted hover:text-text transition-colors"
          title="Add Slide"
        >
          <Plus size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={slides.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            {slides.map((slide, idx) => (
              <SortableSlide
                key={slide.id}
                slide={slide}
                index={idx}
                isSelected={selectedSlideId === slide.id}
                thumbWidth={thumbWidth}
                thumbHeight={thumbHeight}
                baseWidth={format.width}
                baseHeight={format.height}
                onSelect={() => selectSlide(slide.id)}
                onDelete={() => {
                  if (slides.length > 1) removeSlide(slide.id);
                }}
                onDuplicate={() => duplicateSlide(slide.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

function SortableSlide({
  slide,
  index,
  isSelected,
  thumbWidth,
  thumbHeight,
  baseWidth,
  baseHeight,
  onSelect,
  onDelete,
  onDuplicate,
}: {
  slide: Slide;
  index: number;
  isSelected: boolean;
  thumbWidth: number;
  thumbHeight: number;
  baseWidth: number;
  baseHeight: number;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: slide.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        onClick={onSelect}
        className={`group relative rounded-lg overflow-hidden cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-primary' : 'ring-1 ring-border hover:ring-text-muted'
        }`}
      >
        <div style={{ aspectRatio: `${baseWidth} / ${baseHeight}` }}>
          <SlideRenderer slide={slide} width={thumbWidth} height={thumbHeight} baseWidth={baseWidth} baseHeight={baseHeight} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-1.5 py-1 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-white font-medium">{index + 1}</span>
          <div className="flex gap-0.5">
            <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} className="p-0.5 hover:bg-white/20 rounded" title="Duplicate">
              <Copy size={10} className="text-white" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-0.5 hover:bg-white/20 rounded" title="Delete">
              <Trash2 size={10} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
