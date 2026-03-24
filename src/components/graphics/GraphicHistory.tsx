import { useState } from 'react';
import { Plus, Trash2, Clock, RotateCcw } from 'lucide-react';
import { useSavedGraphicsStore, type SavedGraphic } from '../../stores/savedGraphicsStore';

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'jetzt';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

interface GraphicHistoryProps {
  graphicType: string;
  onLoad: (graphic: SavedGraphic) => void;
  onReset: () => void;
  activeId?: string | null;
}

export function GraphicHistory({ graphicType, onLoad, onReset, activeId }: GraphicHistoryProps) {
  const { graphics, remove } = useSavedGraphicsStore();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);

  const filtered = graphics.filter((g) => g.type === graphicType);
  const presets = filtered.filter((g) => g.id.startsWith('preset-'));
  const userSaved = filtered.filter((g) => !g.id.startsWith('preset-'));

  if (filtered.length === 0) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-[10px] text-text-muted/60 uppercase tracking-wider font-medium mb-2"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <span className="flex items-center gap-1.5">
          <Clock size={10} />
          Gespeichert ({filtered.length})
        </span>
        <span className="text-[9px]">{expanded ? '−' : '+'}</span>
      </button>

      {expanded && (
        <div className="space-y-0.5">
          {/* New from template */}
          <button
            onClick={onReset}
            className="flex items-center gap-2 w-full px-2.5 py-2 rounded-md text-[12px] font-medium text-text-muted hover:text-text hover:bg-muted/50 transition-all group"
          >
            <div className="w-5 h-5 rounded flex items-center justify-center bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
              <Plus size={11} strokeWidth={2.5} />
            </div>
            <span>Neue Vorlage</span>
          </button>

          {/* User saved items */}
          {userSaved.map((g) => (
            <div
              key={g.id}
              className={`group flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-[12px] transition-all cursor-pointer ${
                activeId === g.id
                  ? 'bg-primary/10 text-text'
                  : 'text-text-muted hover:text-text hover:bg-muted/60'
              }`}
              onClick={() => onLoad(g)}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
              <span className="flex-1 truncate">{g.name}</span>
              <span className="text-[9px] text-text-muted/40 shrink-0">{timeAgo(g.savedAt)}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirmDeleteId === g.id) {
                    remove(g.id);
                    setConfirmDeleteId(null);
                  } else {
                    setConfirmDeleteId(g.id);
                    setTimeout(() => setConfirmDeleteId(null), 2000);
                  }
                }}
                className={`opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded ${
                  confirmDeleteId === g.id ? 'text-danger opacity-100' : 'text-text-muted/30 hover:text-text-muted'
                }`}
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))}

          {/* Presets (collapsible) */}
          {presets.length > 0 && (
            <>
              <div className="pt-1.5 pb-0.5 px-2.5">
                <span className="text-[9px] text-text-muted/30 uppercase tracking-wider font-medium">Vorlagen</span>
              </div>
              {presets.map((g) => (
                <div
                  key={g.id}
                  className={`group flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-[12px] transition-all cursor-pointer ${
                    activeId === g.id
                      ? 'bg-primary/10 text-text'
                      : 'text-text-muted/60 hover:text-text-muted hover:bg-muted/40'
                  }`}
                  onClick={() => onLoad(g)}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-text-muted/20 shrink-0" />
                  <span className="flex-1 truncate">{g.name}</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
