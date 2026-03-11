import { useState } from 'react';
import { useSavedGraphicsStore, type SavedGraphic } from '../../stores/savedGraphicsStore';
import { Trash2, X } from 'lucide-react';

const TYPE_LABELS: Record<string, string> = {
  'case-study': 'Case Study',
  'roi': 'ROI',
  'kpi-banner': 'KPI Banner',
  'revenue-systems': 'Systems',
  'infographic': 'Infografik',
};

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'gerade eben';
  if (mins < 60) return `vor ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `vor ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `vor ${days}d`;
}

export function SavedGraphicsModal({
  onClose,
  onLoad,
}: {
  onClose: () => void;
  onLoad: (graphic: SavedGraphic) => void;
}) {
  const { graphics, rename, remove } = useSavedGraphicsStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#12121e',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          width: 480,
          maxHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: '#f0f0f5' }}>
            Gespeicherte Grafiken
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
          {graphics.length === 0 ? (
            <div
              style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.25)',
                fontSize: 13,
              }}
            >
              Noch keine Grafiken gespeichert.
            </div>
          ) : (
            graphics.map((g) => (
              <div
                key={g.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'transparent')
                }
                onClick={() => {
                  if (editingId) return;
                  onLoad(g);
                  onClose();
                }}
              >
                {/* Type badge */}
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: 'rgba(99,102,241,0.15)',
                    color: '#818cf8',
                    whiteSpace: 'nowrap',
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                  }}
                >
                  {TYPE_LABELS[g.type] || g.type}
                </span>

                {/* Name */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {editingId === g.id ? (
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => {
                        if (editName.trim()) rename(g.id, editName.trim());
                        setEditingId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (editName.trim()) rename(g.id, editName.trim());
                          setEditingId(null);
                        }
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(99,102,241,0.4)',
                        borderRadius: 6,
                        padding: '2px 8px',
                        fontSize: 13,
                        color: '#f0f0f5',
                        outline: 'none',
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: 13,
                        color: '#f0f0f5',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block',
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingId(g.id);
                        setEditName(g.name);
                      }}
                    >
                      {g.name}
                    </span>
                  )}
                </div>

                {/* Time */}
                <span
                  style={{
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.2)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {timeAgo(g.savedAt)}
                </span>

                {/* Delete */}
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
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color:
                      confirmDeleteId === g.id
                        ? '#ef4444'
                        : 'rgba(255,255,255,0.2)',
                    padding: 4,
                    transition: 'color 0.15s',
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
