import { useDiagramStore } from '../../stores/diagramStore';
import { useEditorStore } from '../../stores/editorStore';
import { getPreset } from '../../animation';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function AnimationTimelineBar() {
  const diagram = useDiagramStore((s) => s.diagram);
  const isPlaying = useEditorStore((s) => s.animationPreviewPlaying);
  const setPlaying = useEditorStore((s) => s.setAnimationPreviewPlaying);
  const selectNode = useEditorStore((s) => s.selectNode);
  const selectEdge = useEditorStore((s) => s.selectEdge);
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);
  const selectedEdgeId = useEditorStore((s) => s.selectedEdgeId);

  const animatedNodes = diagram.nodes.filter((n) => n.animation);
  const animatedEdges = diagram.edges.filter((e) => e.animation);

  if (animatedNodes.length === 0 && animatedEdges.length === 0) return null;

  // Calculate total timeline duration
  const allItems = [
    ...animatedNodes.map((n, i) => ({
      id: n.id,
      label: n.label,
      type: 'node' as const,
      presetName: getPreset(n.animation!.presetId)?.name || '?',
      delay: n.animation!.config.delay + i * (diagram.animationSettings?.staggerDelay || 0.1),
      duration: n.animation!.config.duration,
    })),
    ...animatedEdges.map((e, i) => ({
      id: e.id,
      label: e.label || `Edge ${i + 1}`,
      type: 'edge' as const,
      presetName: getPreset(e.animation!.presetId)?.name || '?',
      delay: e.animation!.config.delay + (diagram.animationSettings?.edgeDelay || 0.3) + i * 0.1,
      duration: e.animation!.config.duration,
    })),
  ];

  const totalDuration = Math.max(...allItems.map((it) => it.delay + it.duration), 1);

  return (
    <div style={{
      background: '#0a0a12',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '8px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      maxHeight: 200,
      flexShrink: 0,
    }}>
      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <button
          onClick={() => setPlaying(!isPlaying)}
          style={{
            background: isPlaying ? '#E93BCD20' : '#3B4BF920',
            border: 'none',
            borderRadius: 6,
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: isPlaying ? '#E93BCD' : '#3B4BF9',
          }}
        >
          {isPlaying ? <Pause size={12} /> : <Play size={12} />}
        </button>
        <button
          onClick={() => { setPlaying(false); setTimeout(() => setPlaying(true), 50); }}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: 'none',
            borderRadius: 6,
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          <RotateCcw size={12} />
        </button>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginLeft: 'auto' }}>
          {totalDuration.toFixed(1)}s
        </span>
      </div>

      {/* Timeline rows */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
      {allItems.map((item) => {
        const isSelected = item.type === 'node' ? selectedNodeId === item.id : selectedEdgeId === item.id;
        const leftPct = (item.delay / totalDuration) * 100;
        const widthPct = (item.duration / totalDuration) * 100;

        return (
          <div
            key={item.id}
            onClick={() => item.type === 'node' ? selectNode(item.id) : selectEdge(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              padding: '2px 0',
            }}
          >
            <div style={{
              width: 80,
              fontSize: 10,
              color: isSelected ? '#fff' : 'rgba(255,255,255,0.5)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              {item.label}
            </div>
            <div style={{
              flex: 1,
              height: 18,
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                left: `${leftPct}%`,
                width: `${Math.max(widthPct, 2)}%`,
                top: 2,
                bottom: 2,
                borderRadius: 3,
                background: isSelected
                  ? 'linear-gradient(90deg, #3B4BF9, #E93BCD)'
                  : item.type === 'node'
                    ? '#3B4BF960'
                    : '#E93BCD60',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 4,
              }}>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>
                  {item.presetName}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
