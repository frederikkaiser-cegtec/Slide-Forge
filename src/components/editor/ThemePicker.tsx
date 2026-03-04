import * as Dialog from '@radix-ui/react-dialog';
import { X, Check } from 'lucide-react';
import { themes } from '../../themes';
import { usePresentationStore } from '../../stores/presentationStore';
import { useEditorStore } from '../../stores/editorStore';

export function ThemePicker() {
  const show = useEditorStore((s) => s.showThemePicker);
  const setShow = useEditorStore((s) => s.setShowThemePicker);
  const currentThemeId = usePresentationStore((s) => s.presentation.themeId);
  const setTheme = usePresentationStore((s) => s.setTheme);

  return (
    <Dialog.Root open={show} onOpenChange={setShow}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface border border-border rounded-xl w-[500px] p-6 z-50 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-lg font-semibold text-text">Choose Theme</Dialog.Title>
            <Dialog.Close className="p-1 hover:bg-surface-hover rounded text-text-muted hover:text-text transition-colors">
              <X size={18} />
            </Dialog.Close>
          </div>
          <div className="space-y-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  setTheme(theme.id);
                  setShow(false);
                }}
                className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all ${
                  currentThemeId === theme.id ? 'ring-2 ring-primary bg-primary/10' : 'hover:bg-surface-hover ring-1 ring-border'
                }`}
              >
                {/* Color preview */}
                <div className="flex gap-1">
                  <div className="w-6 h-6 rounded-full" style={{ background: theme.colors.background, border: '1px solid rgba(255,255,255,0.1)' }} />
                  <div className="w-6 h-6 rounded-full" style={{ background: theme.colors.primary }} />
                  <div className="w-6 h-6 rounded-full" style={{ background: theme.colors.text }} />
                  <div className="w-6 h-6 rounded-full" style={{ background: theme.colors.accent }} />
                </div>
                <span className="text-sm font-medium text-text flex-1 text-left">{theme.name}</span>
                {currentThemeId === theme.id && <Check size={16} className="text-primary" />}
              </button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
