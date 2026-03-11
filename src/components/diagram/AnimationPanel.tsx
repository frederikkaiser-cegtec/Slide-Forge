import { useEditorStore } from '../../stores/editorStore';
import { useDiagramStore } from '../../stores/diagramStore';
import { ANIMATION_PRESETS, PRESET_CATEGORIES, getNodePresets, getEdgePresets } from '../../animation';
import type { AnimationConfig, AnimationEasing, AnimationTrigger, ElementAnimation } from '../../types/animation';
import { DEFAULT_ANIMATION_CONFIG } from '../../types/animation';
import { Play, Pause, X, Sparkles } from 'lucide-react';

export function AnimationPanel() {
  const selectedNodeId = useEditorStore((s) => s.selectedNodeId);
  const selectedEdgeId = useEditorStore((s) => s.selectedEdgeId);
  const showPanel = useEditorStore((s) => s.showAnimationPanel);
  const setShowPanel = useEditorStore((s) => s.setShowAnimationPanel);
  const isPlaying = useEditorStore((s) => s.animationPreviewPlaying);
  const setPlaying = useEditorStore((s) => s.setAnimationPreviewPlaying);

  const diagram = useDiagramStore((s) => s.diagram);
  const setNodeAnimation = useDiagramStore((s) => s.setNodeAnimation);
  const setEdgeAnimation = useDiagramStore((s) => s.setEdgeAnimation);

  if (!showPanel) return null;

  const isEdge = !!selectedEdgeId;
  const selectedId = selectedNodeId || selectedEdgeId;
  const presets = isEdge ? getEdgePresets() : getNodePresets();

  // Get current animation
  let currentAnimation: ElementAnimation | undefined;
  if (selectedNodeId) {
    currentAnimation = diagram.nodes.find((n) => n.id === selectedNodeId)?.animation;
  } else if (selectedEdgeId) {
    currentAnimation = diagram.edges.find((e) => e.id === selectedEdgeId)?.animation;
  }

  const handleSelectPreset = (presetId: string) => {
    if (!selectedId) return;
    const preset = ANIMATION_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const anim: ElementAnimation = {
      presetId,
      config: { ...preset.defaultConfig },
    };

    if (isEdge) {
      setEdgeAnimation(selectedId, anim);
    } else {
      setNodeAnimation(selectedId, anim);
    }
  };

  const handleRemoveAnimation = () => {
    if (!selectedId) return;
    if (isEdge) {
      setEdgeAnimation(selectedId, undefined);
    } else {
      setNodeAnimation(selectedId, undefined);
    }
  };

  const handleUpdateConfig = (updates: Partial<AnimationConfig>) => {
    if (!selectedId || !currentAnimation) return;
    const updated: ElementAnimation = {
      ...currentAnimation,
      config: { ...currentAnimation.config, ...updates },
    };
    if (isEdge) {
      setEdgeAnimation(selectedId, updated);
    } else {
      setNodeAnimation(selectedId, updated);
    }
  };

  // Group presets by category
  const grouped = PRESET_CATEGORIES
    .map((cat) => ({
      ...cat,
      presets: presets.filter((p) => p.category === cat.id),
    }))
    .filter((g) => g.presets.length > 0);

  return (
    <div style={{
      position: 'absolute',
      right: 252,
      top: 0,
      bottom: 0,
      width: 280,
      background: '#0a0a12',
      borderLeft: '1px solid rgba(255,255,255,0.06)',
      zIndex: 30,
      overflow: 'auto',
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontSize: 13, fontWeight: 600 }}>
          <Sparkles size={14} />
          Animation
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => setPlaying(!isPlaying)}
            style={{
              background: isPlaying ? '#E93BCD20' : '#3B4BF920',
              border: 'none',
              borderRadius: 6,
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isPlaying ? '#E93BCD' : '#3B4BF9',
            }}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={() => setShowPanel(false)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: 6,
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {!selectedId && (
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, textAlign: 'center', paddingTop: 20 }}>
          Element auswählen um Animation hinzuzufügen
        </div>
      )}

      {selectedId && (
        <>
          {/* Preset Grid */}
          {grouped.map((group) => (
            <div key={group.id}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {group.label}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                {group.presets.map((preset) => {
                  const isActive = currentAnimation?.presetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset.id)}
                      style={{
                        background: isActive
                          ? 'linear-gradient(135deg, #3B4BF920, #E93BCD20)'
                          : 'rgba(255,255,255,0.04)',
                        border: isActive ? '1px solid #3B4BF960' : '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 8,
                        padding: '8px 4px',
                        cursor: 'pointer',
                        color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                        fontSize: 10,
                        fontWeight: 500,
                        textAlign: 'center',
                        transition: 'all 0.15s',
                      }}
                    >
                      {preset.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Config */}
          {currentAnimation && (
            <>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <ConfigSlider
                  label="Dauer"
                  value={currentAnimation.config.duration}
                  min={0.1}
                  max={3}
                  step={0.1}
                  suffix="s"
                  onChange={(v) => handleUpdateConfig({ duration: v })}
                />
                <ConfigSlider
                  label="Verzögerung"
                  value={currentAnimation.config.delay}
                  min={0}
                  max={3}
                  step={0.1}
                  suffix="s"
                  onChange={(v) => handleUpdateConfig({ delay: v })}
                />
                <ConfigSelect
                  label="Easing"
                  value={currentAnimation.config.easing}
                  options={[
                    { value: 'ease', label: 'Ease' },
                    { value: 'ease-in', label: 'Ease In' },
                    { value: 'ease-out', label: 'Ease Out' },
                    { value: 'ease-in-out', label: 'Ease In-Out' },
                    { value: 'linear', label: 'Linear' },
                    { value: 'spring', label: 'Spring' },
                  ]}
                  onChange={(v) => handleUpdateConfig({ easing: v as AnimationEasing })}
                />
                <ConfigSelect
                  label="Trigger"
                  value={currentAnimation.config.trigger}
                  options={[
                    { value: 'onLoad', label: 'Beim Laden' },
                    { value: 'onScroll', label: 'Beim Scrollen' },
                    { value: 'onHover', label: 'Bei Hover' },
                    { value: 'stagger', label: 'Gestaffelt' },
                  ]}
                  onChange={(v) => handleUpdateConfig({ trigger: v as AnimationTrigger })}
                />
              </div>

              <button
                onClick={handleRemoveAnimation}
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  color: '#ef4444',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Animation entfernen
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

function ConfigSlider({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{label}</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>
          {value.toFixed(1)}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: '#3B4BF9' }}
      />
    </div>
  );
}

function ConfigSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 6,
          padding: '6px 8px',
          color: '#fff',
          fontSize: 12,
          outline: 'none',
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
