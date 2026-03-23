import { Palette, GitBranch, Presentation, Home } from 'lucide-react';
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
    <div className="h-10 bg-surface border-b border-border flex items-center px-3 gap-1.5 shrink-0">
      <button
        onClick={() => setMode('home')}
        className="flex items-center gap-2 mr-3 hover:opacity-80 transition-opacity"
      >
        <img src={LOGO_URL} alt="CegTec" className="h-5" />
      </button>

      <div className="w-px h-5 bg-border" />

      {modes.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setMode(id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mode === id
              ? 'bg-primary text-white'
              : 'text-text-muted hover:text-text hover:bg-surface-hover'
          }`}
        >
          <Icon size={14} /> {label}
        </button>
      ))}
    </div>
  );
}
