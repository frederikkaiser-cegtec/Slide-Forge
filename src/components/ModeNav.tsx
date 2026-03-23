import { Palette, GitBranch, Presentation, ChevronLeft } from 'lucide-react';
import { useEditorStore } from '../stores/editorStore';
import { LOGO_URL } from '../utils/assets';

const modes = [
  { id: 'graphic' as const, label: 'Grafiken', icon: Palette },
  { id: 'diagram' as const, label: 'Diagramme', icon: GitBranch },
  { id: 'slides' as const, label: 'Slides', icon: Presentation },
];

export function ModeNav() {
  const { mode, setMode } = useEditorStore();

  return (
    <div className="h-11 bg-surface/80 backdrop-blur-md border-b border-border/60 flex items-center px-3 gap-1 shrink-0">
      {/* Home / Logo */}
      <button
        onClick={() => setMode('home')}
        className="flex items-center gap-1.5 mr-2 px-1.5 py-1 rounded-md text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
        title="Zurück zur Übersicht"
      >
        <ChevronLeft size={14} strokeWidth={2} className="opacity-50" />
        <img src={LOGO_URL} alt="CegTec" className="h-[18px]" />
      </button>

      <div className="w-px h-4 bg-border/50" />

      {/* Mode pills */}
      <div className="flex items-center gap-0.5 ml-1 bg-bg/60 rounded-lg p-0.5 border border-border/30">
        {modes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 ${
              mode === id
                ? 'bg-surface text-text shadow-sm shadow-black/20'
                : 'text-text-muted hover:text-text'
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}
          >
            <Icon size={13} strokeWidth={mode === id ? 2 : 1.5} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
