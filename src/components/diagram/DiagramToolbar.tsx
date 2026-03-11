import { useState } from 'react';
import {
  MousePointer2,
  Plus,
  Spline,
  Hand,
  Undo2,
  Redo2,
  LayoutGrid,
  Code,
  Eye,
  Sparkles,
  Play,
  ChevronDown,
  FileImage,
  Film,
  FileCode,
  Save,
  FolderOpen,
} from 'lucide-react';
import { useDiagramStore } from '../../stores/diagramStore';
import { useEditorStore } from '../../stores/editorStore';
import { useSavedDiagramsStore } from '../../stores/savedDiagramsStore';
import type { DiagramTool } from '../../types/diagram';

interface Props {
  onAutoLayout: () => void;
  onExportHTML: () => void;
  onExportSVG?: () => void;
  onExportGIF?: () => void;
  onExportVideo?: () => void;
  onShowSavedDiagrams: () => void;
}

export function DiagramToolbar({ onAutoLayout, onExportHTML, onExportSVG, onExportGIF, onExportVideo, onShowSavedDiagrams }: Props) {
  const { diagram, undo, redo, undoStack, redoStack } = useDiagramStore();
  const { diagramTool, setDiagramTool, setShowExportPreview } = useEditorStore();
  const showAnimationPanel = useEditorStore((s) => s.showAnimationPanel);
  const setShowAnimationPanel = useEditorStore((s) => s.setShowAnimationPanel);
  const isPlaying = useEditorStore((s) => s.animationPreviewPlaying);
  const setPlaying = useEditorStore((s) => s.setAnimationPreviewPlaying);
  const saveDiagram = useSavedDiagramsStore((s) => s.save);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false);

  const handleSave = () => {
    saveDiagram(diagram.title || 'Unbenannt', diagram);
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1200);
  };

  const tools: { id: DiagramTool; icon: typeof MousePointer2; label: string; shortcut: string }[] = [
    { id: 'select', icon: MousePointer2, label: 'Auswählen', shortcut: 'V' },
    { id: 'addNode', icon: Plus, label: 'Node hinzufügen', shortcut: 'N' },
    { id: 'drawEdge', icon: Spline, label: 'Verbindung zeichnen', shortcut: 'E' },
    { id: 'pan', icon: Hand, label: 'Verschieben', shortcut: 'H' },
  ];

  return (
    <div
      style={{
        height: 48,
        background: '#ffffff',
        borderBottom: '1px solid #e8eaef',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 8,
        flexShrink: 0,
      }}
    >
      {/* Title */}
      <span style={{
        fontSize: 13,
        fontWeight: 600,
        color: '#1a1a2e',
        maxWidth: 180,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        letterSpacing: '-0.02em',
      }}>
        {diagram.title}
      </span>

      <Divider />

      {/* Tool buttons */}
      <div style={{ display: 'flex', gap: 2, background: '#f1f3f7', borderRadius: 8, padding: 2 }}>
        {tools.map(({ id, icon: Icon, label, shortcut }) => (
          <button
            key={id}
            onClick={() => setDiagramTool(id)}
            title={`${label} (${shortcut})`}
            style={{
              padding: '6px 8px',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              fontWeight: 500,
              transition: 'all 0.15s ease',
              background: diagramTool === id
                ? 'linear-gradient(135deg, #3B4BF9, #6875FF)'
                : 'transparent',
              color: diagramTool === id ? '#fff' : '#6b7280',
              boxShadow: diagramTool === id ? '0 2px 8px rgba(59,75,249,0.4)' : 'none',
            }}
          >
            <Icon size={14} />
          </button>
        ))}
      </div>

      <Divider />

      {/* Undo/Redo */}
      <ToolbarBtn onClick={undo} disabled={undoStack.length === 0} title="Rückgängig (Ctrl+Z)">
        <Undo2 size={14} />
      </ToolbarBtn>
      <ToolbarBtn onClick={redo} disabled={redoStack.length === 0} title="Wiederholen (Ctrl+Y)">
        <Redo2 size={14} />
      </ToolbarBtn>

      <Divider />

      {/* Auto Layout */}
      <ToolbarBtn onClick={onAutoLayout} title="Auto-Layout">
        <LayoutGrid size={14} />
      </ToolbarBtn>

      <Divider />

      {/* Save / Load */}
      <ToolbarBtn onClick={handleSave} title="Speichern (Ctrl+S)">
        <Save size={14} style={{ color: saveFlash ? '#10b981' : undefined, transition: 'color 0.3s' }} />
        {saveFlash && <span style={{ fontSize: 10, color: '#10b981', fontWeight: 600 }}>Gespeichert</span>}
      </ToolbarBtn>
      <ToolbarBtn onClick={onShowSavedDiagrams} title="Gespeicherte Designs laden">
        <FolderOpen size={14} />
      </ToolbarBtn>

      <Divider />

      {/* Animation toggle */}
      <ToolbarBtn
        onClick={() => setShowAnimationPanel(!showAnimationPanel)}
        title="Animation Panel"
      >
        <Sparkles size={14} style={{ color: showAnimationPanel ? '#E93BCD' : undefined }} />
      </ToolbarBtn>

      <ToolbarBtn
        onClick={() => setPlaying(!isPlaying)}
        title={isPlaying ? 'Animation stoppen' : 'Animation abspielen'}
      >
        <Play size={14} style={{ color: isPlaying ? '#E93BCD' : undefined }} />
      </ToolbarBtn>

      <div style={{ flex: 1 }} />

      {/* Node/Edge count */}
      <span style={{ fontSize: 10, color: '#9ca3af', letterSpacing: '0.05em' }}>
        {diagram.nodes.length}N · {diagram.edges.length}E
      </span>

      <Divider />

      {/* Export actions */}
      <ToolbarBtn onClick={() => setShowExportPreview(true)} title="Preview">
        <Eye size={13} />
        <span style={{ fontSize: 11 }}>Preview</span>
      </ToolbarBtn>

      {/* Export dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowExportDropdown(!showExportDropdown)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            background: 'linear-gradient(135deg, #3B4BF9, #6875FF)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(59,75,249,0.35)',
            transition: 'all 0.15s ease',
            letterSpacing: '0.02em',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,75,249,0.5)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 2px 12px rgba(59,75,249,0.35)')}
        >
          <Code size={13} /> Export <ChevronDown size={12} />
        </button>

        {showExportDropdown && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 4,
              background: '#0a0a12',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              padding: 4,
              minWidth: 180,
              zIndex: 100,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
            onMouseLeave={() => setShowExportDropdown(false)}
          >
            <ExportItem icon={Code} label="HTML Embed" onClick={() => { onExportHTML(); setShowExportDropdown(false); }} />
            <ExportItem icon={FileCode} label="Animated SVG" onClick={() => { onExportSVG?.(); setShowExportDropdown(false); }} />
            <ExportItem icon={FileImage} label="GIF Animation" onClick={() => { onExportGIF?.(); setShowExportDropdown(false); }} />
            <ExportItem icon={Film} label="Video (WebM)" onClick={() => { onExportVideo?.(); setShowExportDropdown(false); }} />
          </div>
        )}
      </div>
    </div>
  );
}

function ExportItem({ icon: Icon, label, onClick }: { icon: typeof Code; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        padding: '8px 12px',
        background: 'transparent',
        border: 'none',
        borderRadius: 6,
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.1s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

function Divider() {
  return <div style={{ width: 1, height: 20, background: '#e8eaef', margin: '0 4px' }} />;
}

function ToolbarBtn({
  onClick,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        padding: '5px 8px',
        borderRadius: 6,
        border: 'none',
        background: 'transparent',
        color: disabled ? '#d1d5db' : '#6b7280',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.color = '#1a1a2e'; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.color = '#6b7280'; }}
    >
      {children}
    </button>
  );
}
