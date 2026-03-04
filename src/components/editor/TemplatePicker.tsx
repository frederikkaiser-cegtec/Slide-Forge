import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { templates } from '../../templates';
import { usePresentationStore } from '../../stores/presentationStore';
import { useEditorStore } from '../../stores/editorStore';
import { getTheme } from '../../themes';
import { SlideRenderer } from '../slides/SlideRenderer';
import type { TemplateId } from '../../types';

export function TemplatePicker() {
  const show = useEditorStore((s) => s.showTemplatePicker);
  const setShow = useEditorStore((s) => s.setShowTemplatePicker);
  const addSlide = usePresentationStore((s) => s.addSlide);
  const themeId = usePresentationStore((s) => s.presentation.themeId);
  const slides = usePresentationStore((s) => s.presentation.slides);
  const selectedSlideId = useEditorStore((s) => s.selectedSlideId);
  const selectSlide = useEditorStore((s) => s.selectSlide);

  const handleSelect = (templateId: TemplateId) => {
    const theme = getTheme(themeId);
    const template = templates.find((t) => t.id === templateId)!;
    const newSlide = template.create(theme);
    const currentIndex = slides.findIndex((s) => s.id === selectedSlideId);
    addSlide(newSlide, currentIndex + 1);
    selectSlide(newSlide.id);
    setShow(false);
  };

  return (
    <Dialog.Root open={show} onOpenChange={setShow}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface border border-border rounded-xl w-[700px] max-h-[80vh] overflow-y-auto p-6 z-50 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-lg font-semibold text-text">Add Slide</Dialog.Title>
            <Dialog.Close className="p-1 hover:bg-surface-hover rounded text-text-muted hover:text-text transition-colors">
              <X size={18} />
            </Dialog.Close>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {templates.map((template) => {
              const theme = getTheme(themeId);
              const preview = template.create(theme);
              return (
                <button
                  key={template.id}
                  onClick={() => handleSelect(template.id)}
                  className="group text-left"
                >
                  <div className="aspect-video rounded-lg overflow-hidden ring-1 ring-border group-hover:ring-2 group-hover:ring-primary transition-all">
                    <SlideRenderer slide={preview} width={200} height={112.5} />
                  </div>
                  <p className="text-xs text-text-muted mt-1.5 group-hover:text-text transition-colors">{template.name}</p>
                </button>
              );
            })}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
