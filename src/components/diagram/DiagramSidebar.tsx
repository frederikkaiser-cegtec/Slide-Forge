import {
  GitBranch,
  Network,
  Clock,
  Layers,
  ArrowRightLeft,
  Trash2,
} from 'lucide-react';
import { useDiagramStore } from '../../stores/diagramStore';
import { useEditorStore } from '../../stores/editorStore';
import { generateId } from '../../utils/id';
import { createDefaultPorts } from '../../utils/edgePaths';
import { diagramTemplates } from '../../templates/diagrams';
import { getTheme } from '../../themes';
import type { NodeShape, DiagramType } from '../../types/diagram';

const DIAGRAM_TYPES: { id: DiagramType; label: string; icon: typeof GitBranch }[] = [
  { id: 'flowchart', label: 'Flowchart', icon: GitBranch },
  { id: 'orgchart', label: 'Org Chart', icon: Network },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'techstack', label: 'Tech Stack', icon: Layers },
  { id: 'process', label: 'Process', icon: ArrowRightLeft },
];

const NODE_SHAPES: { type: NodeShape; label: string; icon: string }[] = [
  { type: 'process', label: 'Prozess', icon: '▭' },
  { type: 'decision', label: 'Entscheidung', icon: '◇' },
  { type: 'terminal', label: 'Start/Ende', icon: '⬭' },
  { type: 'data', label: 'Daten', icon: '▱' },
  { type: 'circle', label: 'Kreis', icon: '○' },
  { type: 'card', label: 'Karte', icon: '▢' },
];

const NODE_DEFAULTS: Record<NodeShape, { width: number; height: number; borderRadius: number }> = {
  process: { width: 140, height: 50, borderRadius: 12 },
  decision: { width: 80, height: 80, borderRadius: 0 },
  terminal: { width: 120, height: 50, borderRadius: 25 },
  data: { width: 140, height: 50, borderRadius: 6 },
  circle: { width: 70, height: 70, borderRadius: 35 },
  card: { width: 180, height: 80, borderRadius: 14 },
};

export function DiagramSidebar() {
  const { diagram, addNode, setDiagramType, removeNode, loadDiagram } = useDiagramStore();
  const { selectNode, selectedNodeId } = useEditorStore();

  const handleAddNode = (shape: NodeShape) => {
    const defaults = NODE_DEFAULTS[shape];
    addNode({
      id: generateId(),
      type: shape,
      x: 200 + Math.random() * 100,
      y: 200 + Math.random() * 100,
      width: defaults.width,
      height: defaults.height,
      label: shape === 'decision' ? 'Ja/Nein?' : 'Neuer Node',
      style: {
        backgroundColor: '#ffffff',
        borderColor: '#3B4BF9',
        borderWidth: 1,
        color: '#1a1a2e',
        fontSize: shape === 'card' ? 15 : 13,
        fontWeight: 500,
        borderRadius: defaults.borderRadius,
      },
      ports: createDefaultPorts(),
    });
  };

  return (
    <div
      style={{
        width: 220,
        background: '#ffffff',
        borderRight: '1px solid #e8eaef',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Diagram Type */}
      <Section label="Diagramm-Typ">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          {DIAGRAM_TYPES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setDiagramType(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px 8px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                fontSize: 10,
                fontWeight: 500,
                transition: 'all 0.15s ease',
                background: diagram.diagramType === id
                  ? 'linear-gradient(135deg, #3B4BF9, #6875FF)'
                  : 'transparent',
                color: diagram.diagramType === id ? '#fff' : '#6b7280',
                outline: 'none',
                boxShadow: diagram.diagramType === id ? '0 2px 6px rgba(59,75,249,0.3)' : 'none',
              }}
            >
              <Icon size={11} /> {label}
            </button>
          ))}
        </div>
      </Section>

      {/* Node Palette */}
      <Section label="Nodes hinzufügen">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 3 }}>
          {NODE_SHAPES.map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => handleAddNode(type)}
              title={label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: '8px 4px',
                borderRadius: 8,
                border: '1px solid #eef0f4',
                background: '#f8f9fb',
                color: '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontSize: 16,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#eef0ff';
                e.currentTarget.style.borderColor = '#c7cbff';
                e.currentTarget.style.color = '#3B4BF9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8f9fb';
                e.currentTarget.style.borderColor = '#eef0f4';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              <span>{icon}</span>
              <span style={{ fontSize: 9, letterSpacing: '0.03em' }}>{label}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Templates */}
      <Section label="Vorlagen">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {diagramTemplates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => {
                const theme = getTheme(diagram.themeId);
                const data = tpl.create(theme.colors);
                loadDiagram({
                  ...data,
                  id: generateId(),
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '7px 10px',
                borderRadius: 8,
                border: 'none',
                background: 'transparent',
                color: '#6b7280',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                fontSize: 11,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f3f7';
                e.currentTarget.style.color = '#1a1a2e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              <span style={{ fontSize: 14 }}>{tpl.icon}</span>
              <div>
                <div style={{ fontWeight: 500 }}>{tpl.name}</div>
                <div style={{ fontSize: 9, opacity: 0.5, marginTop: 1 }}>{tpl.description}</div>
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* Element list */}
      <div style={{ flex: 1, overflow: 'auto', padding: '10px 12px' }}>
        <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          Elemente
          <span style={{ color: '#b0b8c4', fontWeight: 400, marginLeft: 4 }}>
            {diagram.nodes.length}N · {diagram.edges.length}E
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {diagram.nodes.map((node) => (
            <div
              key={node.id}
              onClick={() => selectNode(node.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '5px 8px',
                borderRadius: 6,
                fontSize: 11,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                background: selectedNodeId === node.id ? '#eef0ff' : 'transparent',
                color: selectedNodeId === node.id ? '#3B4BF9' : '#6b7280',
                borderLeft: selectedNodeId === node.id ? '2px solid #3B4BF9' : '2px solid transparent',
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {node.icon && <span style={{ marginRight: 4 }}>{node.icon}</span>}
                {node.label}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeNode(node.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  opacity: 0.4,
                  cursor: 'pointer',
                  padding: 2,
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.4')}
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      padding: '10px 12px',
      borderBottom: '1px solid #e8eaef',
    }}>
      <div style={{
        fontSize: 10,
        color: '#9ca3af',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: 8,
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}
