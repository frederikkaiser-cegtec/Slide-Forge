import { useState } from 'react';
import { useDiagramStore } from '../../stores/diagramStore';
import { useEditorStore } from '../../stores/editorStore';
import type { NodeShape, EdgeType } from '../../types/diagram';
import { getPreset } from '../../animation';

export function DiagramProperties() {
  const { diagram, updateNode, updateEdge, setTitle, setBackground } = useDiagramStore();
  const { selectedNodeId, selectedEdgeId } = useEditorStore();
  const setShowAnimationPanel = useEditorStore((s) => s.setShowAnimationPanel);
  const [tab, setTab] = useState<'props' | 'anim'>('props');

  const selectedNode = diagram.nodes.find((n) => n.id === selectedNodeId);
  const selectedEdge = diagram.edges.find((e) => e.id === selectedEdgeId);

  const hasAnimation = !!(selectedNode?.animation || selectedEdge?.animation);
  const animPresetName = selectedNode?.animation
    ? getPreset(selectedNode.animation.presetId)?.name
    : selectedEdge?.animation
      ? getPreset(selectedEdge.animation.presetId)?.name
      : null;

  return (
    <div className="w-60 bg-surface border-l border-border flex flex-col shrink-0 overflow-y-auto">
      {/* Tab Header */}
      {(selectedNode || selectedEdge) ? (
        <div className="flex border-b border-border">
          <button
            onClick={() => setTab('props')}
            className="flex-1 px-3 py-2 text-xs font-medium transition-colors"
            style={{
              color: tab === 'props' ? '#fff' : 'rgba(255,255,255,0.4)',
              borderBottom: tab === 'props' ? '2px solid #3B4BF9' : '2px solid transparent',
              background: 'transparent',
              border: 'none',
              borderBottomWidth: 2,
              borderBottomStyle: 'solid',
              borderBottomColor: tab === 'props' ? '#3B4BF9' : 'transparent',
              cursor: 'pointer',
            }}
          >
            Eigenschaften
          </button>
          <button
            onClick={() => { setTab('anim'); setShowAnimationPanel(true); }}
            className="flex-1 px-3 py-2 text-xs font-medium transition-colors"
            style={{
              color: tab === 'anim' ? '#fff' : 'rgba(255,255,255,0.4)',
              background: 'transparent',
              border: 'none',
              borderBottomWidth: 2,
              borderBottomStyle: 'solid',
              borderBottomColor: tab === 'anim' ? '#E93BCD' : 'transparent',
              cursor: 'pointer',
            }}
          >
            Animation
            {hasAnimation && (
              <span style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#E93BCD',
                marginLeft: 4,
                verticalAlign: 'middle',
              }} />
            )}
          </button>
        </div>
      ) : (
        <div className="p-3 border-b border-border">
          <span className="text-xs text-text-muted font-medium">Eigenschaften</span>
        </div>
      )}

      {tab === 'props' ? (
        <>
          {selectedNode ? (
            <NodeProperties
              node={selectedNode}
              onUpdate={(updates) => updateNode(selectedNode.id, updates)}
            />
          ) : selectedEdge ? (
            <EdgeProperties
              edge={selectedEdge}
              onUpdate={(updates) => updateEdge(selectedEdge.id, updates)}
            />
          ) : (
            <DiagramLevelProperties
              title={diagram.title}
              background={diagram.background}
              onTitleChange={setTitle}
              onBackgroundChange={setBackground}
            />
          )}
        </>
      ) : (
        <div className="p-3 space-y-2">
          {hasAnimation ? (
            <div style={{
              background: 'linear-gradient(135deg, #3B4BF910, #E93BCD10)',
              borderRadius: 8,
              padding: '10px 12px',
              border: '1px solid rgba(233,59,205,0.2)',
            }}>
              <div style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>{animPresetName}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                Konfiguration im Animation-Panel links
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center', paddingTop: 20 }}>
              Öffne das Animation-Panel um Effekte hinzuzufügen
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DiagramLevelProperties({
  title,
  background,
  onTitleChange,
  onBackgroundChange,
}: {
  title: string;
  background: string;
  onTitleChange: (t: string) => void;
  onBackgroundChange: (bg: string) => void;
}) {
  return (
    <div className="p-3 space-y-3">
      <PropField label="Titel" value={title} onChange={onTitleChange} />
      <PropField label="Hintergrund" value={background} onChange={onBackgroundChange} type="color" />
    </div>
  );
}

function NodeProperties({
  node,
  onUpdate,
}: {
  node: NonNullable<ReturnType<typeof useDiagramStore.getState>['diagram']['nodes'][0]>;
  onUpdate: (updates: Partial<typeof node>) => void;
}) {
  const shapeOptions: { value: NodeShape; label: string }[] = [
    { value: 'process', label: 'Prozess' },
    { value: 'decision', label: 'Entscheidung' },
    { value: 'terminal', label: 'Start/Ende' },
    { value: 'data', label: 'Daten' },
    { value: 'circle', label: 'Kreis' },
    { value: 'card', label: 'Karte' },
  ];

  return (
    <div className="p-3 space-y-3">
      <span className="text-[10px] text-primary font-medium uppercase tracking-wider">Node</span>

      <PropField label="Label" value={node.label} onChange={(v) => onUpdate({ label: v })} />
      <PropField label="Sublabel" value={node.sublabel ?? ''} onChange={(v) => onUpdate({ sublabel: v || undefined })} />
      <PropField label="Icon" value={node.icon ?? ''} onChange={(v) => onUpdate({ icon: v || undefined })} />

      <div>
        <label className="text-xs text-text-muted block mb-0.5">Form</label>
        <select
          value={node.type}
          onChange={(e) => onUpdate({ type: e.target.value as NodeShape })}
          className="w-full bg-surface-hover border border-border rounded-lg px-2 py-1.5 text-xs text-text outline-none"
        >
          {shapeOptions.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <PropField label="X" value={String(Math.round(node.x))} onChange={(v) => onUpdate({ x: Number(v) || 0 })} />
        <PropField label="Y" value={String(Math.round(node.y))} onChange={(v) => onUpdate({ y: Number(v) || 0 })} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <PropField label="Breite" value={String(node.width)} onChange={(v) => onUpdate({ width: Number(v) || 60 })} />
        <PropField label="Höhe" value={String(node.height)} onChange={(v) => onUpdate({ height: Number(v) || 40 })} />
      </div>

      <div className="border-t border-border pt-3">
        <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Stil</span>
      </div>

      <PropField
        label="Hintergrund"
        value={node.style.backgroundColor ?? '#ffffff'}
        onChange={(v) => onUpdate({ style: { ...node.style, backgroundColor: v } })}
        type="color"
      />
      <PropField
        label="Rahmen"
        value={node.style.borderColor ?? '#3B4BF9'}
        onChange={(v) => onUpdate({ style: { ...node.style, borderColor: v } })}
        type="color"
      />
      <PropField
        label="Textfarbe"
        value={node.style.color ?? '#1a1a2e'}
        onChange={(v) => onUpdate({ style: { ...node.style, color: v } })}
        type="color"
      />
      <PropField
        label="Schriftgröße"
        value={String(node.style.fontSize ?? 14)}
        onChange={(v) => onUpdate({ style: { ...node.style, fontSize: Number(v) || 14 } })}
      />
      <PropField
        label="Radius"
        value={String(node.style.borderRadius ?? 8)}
        onChange={(v) => onUpdate({ style: { ...node.style, borderRadius: Number(v) || 0 } })}
      />
    </div>
  );
}

function EdgeProperties({
  edge,
  onUpdate,
}: {
  edge: NonNullable<ReturnType<typeof useDiagramStore.getState>['diagram']['edges'][0]>;
  onUpdate: (updates: Partial<typeof edge>) => void;
}) {
  const edgeTypes: { value: EdgeType; label: string }[] = [
    { value: 'bezier', label: 'Bezier' },
    { value: 'step', label: 'Stufen' },
    { value: 'straight', label: 'Gerade' },
  ];

  return (
    <div className="p-3 space-y-3">
      <span className="text-[10px] text-primary font-medium uppercase tracking-wider">Verbindung</span>

      <PropField label="Label" value={edge.label ?? ''} onChange={(v) => onUpdate({ label: v || undefined })} />

      <div>
        <label className="text-xs text-text-muted block mb-0.5">Typ</label>
        <select
          value={edge.type}
          onChange={(e) => onUpdate({ type: e.target.value as EdgeType })}
          className="w-full bg-surface-hover border border-border rounded-lg px-2 py-1.5 text-xs text-text outline-none"
        >
          {edgeTypes.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <PropField
        label="Farbe"
        value={edge.style.strokeColor ?? '#3B4BF9'}
        onChange={(v) => onUpdate({ style: { ...edge.style, strokeColor: v } })}
        type="color"
      />
      <PropField
        label="Stärke"
        value={String(edge.style.strokeWidth ?? 2)}
        onChange={(v) => onUpdate({ style: { ...edge.style, strokeWidth: Number(v) || 2 } })}
      />
      <PropField
        label="Gestrichelt"
        value={edge.style.strokeDasharray ?? ''}
        onChange={(v) => onUpdate({ style: { ...edge.style, strokeDasharray: v || undefined } })}
        placeholder="z.B. 6 4"
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={edge.style.animated ?? false}
          onChange={(e) => onUpdate({ style: { ...edge.style, animated: e.target.checked } })}
          className="accent-primary"
        />
        <span className="text-xs text-text-muted">Animiert</span>
      </div>
    </div>
  );
}

function PropField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: 'text' | 'color';
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-text-muted block mb-0.5">{label}</label>
      <div className="flex gap-1">
        {type === 'color' && (
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-7 h-7 rounded border border-border cursor-pointer shrink-0"
          />
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-surface-hover border border-border rounded-lg px-2 py-1 text-xs text-text outline-none focus:border-primary transition-colors"
        />
      </div>
    </div>
  );
}
