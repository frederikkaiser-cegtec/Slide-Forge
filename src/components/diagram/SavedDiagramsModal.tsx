import { useState } from 'react';
import { X, Trash2, Upload, Edit3, Check, Clock, Layers } from 'lucide-react';
import { useSavedDiagramsStore, type SavedDiagram } from '../../stores/savedDiagramsStore';
import { useDiagramStore } from '../../stores/diagramStore';

interface Props {
  onClose: () => void;
}

export function SavedDiagramsModal({ onClose }: Props) {
  const { savedDiagrams, remove, rename } = useSavedDiagramsStore();
  const loadDiagram = useDiagramStore((s) => s.loadDiagram);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleLoad = (entry: SavedDiagram) => {
    loadDiagram(entry.diagram);
    onClose();
  };

  const handleStartRename = (entry: SavedDiagram) => {
    setEditingId(entry.id);
    setEditName(entry.name);
  };

  const handleConfirmRename = () => {
    if (editingId && editName.trim()) {
      rename(editingId, editName.trim());
    }
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      remove(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const now = Date.now();
    const diff = now - ts;
    if (diff < 60_000) return 'Gerade eben';
    if (diff < 3_600_000) return `vor ${Math.floor(diff / 60_000)} Min.`;
    if (diff < 86_400_000) return `vor ${Math.floor(diff / 3_600_000)} Std.`;
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  const typeLabels: Record<string, string> = {
    flowchart: 'Flowchart',
    orgchart: 'Organigramm',
    timeline: 'Timeline',
    techstack: 'Tech Stack',
    process: 'Prozess',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          width: 560,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e8eaef',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1a1a2e', letterSpacing: '-0.02em' }}>
              Gespeicherte Designs
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9ca3af' }}>
              {savedDiagrams.length} Design{savedDiagrams.length !== 1 ? 's' : ''} gespeichert
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: 6, borderRadius: 8, border: 'none', background: '#f1f3f7',
              cursor: 'pointer', display: 'flex', color: '#6b7280',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
          {savedDiagrams.length === 0 ? (
            <div style={{
              padding: '48px 24px',
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: 13,
            }}>
              <Layers size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
              <p style={{ margin: 0 }}>Noch keine Designs gespeichert.</p>
              <p style={{ margin: '4px 0 0', fontSize: 11 }}>Nutze Ctrl+S oder den Speichern-Button in der Toolbar.</p>
            </div>
          ) : (
            savedDiagrams.map((entry) => (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1px solid transparent',
                  marginBottom: 4,
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8f9fb';
                  e.currentTarget.style.borderColor = '#e8eaef';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
                onClick={() => handleLoad(entry)}
              >
                {/* Type badge */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'linear-gradient(135deg, #3B4BF9, #6875FF)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0,
                  letterSpacing: '0.02em',
                }}>
                  {entry.nodeCount}N
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {editingId === entry.id ? (
                    <div style={{ display: 'flex', gap: 4 }} onClick={(e) => e.stopPropagation()}>
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmRename(); if (e.key === 'Escape') setEditingId(null); }}
                        style={{
                          flex: 1, padding: '4px 8px', fontSize: 13, fontWeight: 600,
                          border: '1px solid #3B4BF9', borderRadius: 6, outline: 'none',
                          color: '#1a1a2e',
                        }}
                      />
                      <button
                        onClick={handleConfirmRename}
                        style={{
                          padding: '4px 8px', borderRadius: 6, border: 'none',
                          background: '#3B4BF9', color: '#fff', cursor: 'pointer',
                          display: 'flex', alignItems: 'center',
                        }}
                      >
                        <Check size={12} />
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      fontSize: 13, fontWeight: 600, color: '#1a1a2e',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      letterSpacing: '-0.01em',
                    }}>
                      {entry.name}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, marginTop: 2, fontSize: 11, color: '#9ca3af' }}>
                    <span>{typeLabels[entry.diagramType] || entry.diagramType}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Layers size={10} /> {entry.nodeCount}N · {entry.edgeCount}E
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Clock size={10} /> {formatDate(entry.savedAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 2 }} onClick={(e) => e.stopPropagation()}>
                  <ActionBtn
                    title="Umbenennen"
                    onClick={() => handleStartRename(entry)}
                  >
                    <Edit3 size={13} />
                  </ActionBtn>
                  <ActionBtn
                    title={confirmDeleteId === entry.id ? 'Nochmal klicken zum Loeschen' : 'Loeschen'}
                    onClick={() => handleDelete(entry.id)}
                    danger={confirmDeleteId === entry.id}
                  >
                    <Trash2 size={13} />
                  </ActionBtn>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ActionBtn({
  onClick, title, children, danger,
}: {
  onClick: () => void; title: string; children: React.ReactNode; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        padding: 6, borderRadius: 6, border: 'none',
        background: danger ? '#fef2f2' : 'transparent',
        color: danger ? '#ef4444' : '#9ca3af',
        cursor: 'pointer', display: 'flex', alignItems: 'center',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger ? '#fee2e2' : '#f1f3f7';
        e.currentTarget.style.color = danger ? '#dc2626' : '#6b7280';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = danger ? '#fef2f2' : 'transparent';
        e.currentTarget.style.color = danger ? '#ef4444' : '#9ca3af';
      }}
    >
      {children}
    </button>
  );
}
