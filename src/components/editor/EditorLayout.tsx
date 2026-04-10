import { useEffect } from 'react';
import { SlideSidebar } from './SlideSidebar';
import { SlideCanvas } from './SlideCanvas';
import { PropertiesPanel } from './PropertiesPanel';
import { EditorToolbar } from './EditorToolbar';
import { usePresentationStore } from '../../stores/presentationStore';
import { useEditorStore } from '../../stores/editorStore';
import { generateId } from '../../utils/id';

export function EditorLayout() {
  const slides = usePresentationStore((s) => s.presentation.slides);
  const selectedSlideId = useEditorStore((s) => s.selectedSlideId);
  const selectSlide = useEditorStore((s) => s.selectSlide);
  const undo = usePresentationStore((s) => s.undo);
  const redo = usePresentationStore((s) => s.redo);
  const removeElement = usePresentationStore((s) => s.removeElement);
  const duplicateSlide = usePresentationStore((s) => s.duplicateSlide);
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const editingElementId = useEditorStore((s) => s.editingElementId);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const removeSlide = usePresentationStore((s) => s.removeSlide);

  // Listen for chart SVG inserts
  useEffect(() => {
    const handler = (e: Event) => {
      const svg = (e as CustomEvent<string>).detail;
      const slideId = useEditorStore.getState().selectedSlideId ?? slides[0]?.id;
      if (!slideId) return;
      usePresentationStore.getState().pushUndo();
      usePresentationStore.getState().addElement(slideId, {
        id: generateId(), type: 'svg',
        x: 10, y: 10, width: 80, height: 50,
        rotation: 0, content: svg,
        style: { opacity: 1 },
      });
    };
    window.addEventListener('sf:insert-svg', handler);
    return () => window.removeEventListener('sf:insert-svg', handler);
  }, [slides]);

  // Auto-select first slide
  useEffect(() => {
    if (!selectedSlideId && slides.length > 0) {
      selectSlide(slides[0].id);
    }
  }, [selectedSlideId, slides, selectSlide]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (editingElementId) return; // don't intercept when editing text

      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey && e.key === 'Z') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        redo();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId && selectedSlideId) {
          e.preventDefault();
          removeElement(selectedSlideId, selectedElementId);
          clearSelection();
        }
      }
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        if (selectedSlideId) duplicateSlide(selectedSlideId);
      }
      if (e.key === 'Escape') {
        clearSelection();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, removeElement, duplicateSlide, selectedElementId, selectedSlideId, editingElementId, clearSelection]);

  return (
    <div className="flex flex-col h-full bg-bg">
      <EditorToolbar />
      <div className="flex flex-1 min-h-0">
        <SlideSidebar />
        <SlideCanvas />
        <PropertiesPanel />
      </div>
    </div>
  );
}
