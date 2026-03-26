import { Field, ColorRow } from '../forms';
import type { FunnelData } from './FunnelGraphic';

export function FunnelForm({ data, onChange }: { data: FunnelData; onChange: (d: FunnelData) => void }) {
  const updateStage = (i: number, key: string, val: string) => {
    const stages = [...data.stages];
    stages[i] = { ...stages[i], [key]: key === 'pct' ? Number(val) || 0 : val };
    onChange({ ...data, stages });
  };

  const addStage = () => {
    onChange({ ...data, stages: [...data.stages, { label: 'Neue Stufe', value: '0', pct: 0 }] });
  };

  const removeStage = (i: number) => {
    onChange({ ...data, stages: data.stages.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-3">
      <Field label="Top-Label" value={data.topLabel} onChange={(v) => onChange({ ...data, topLabel: v })} />
      <Field label="Headline" value={data.headline} onChange={(v) => onChange({ ...data, headline: v })} textarea />

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Funnel-Stufen</span>
        <button onClick={addStage} className="text-xs text-primary hover:text-primary-hover">+ Hinzuf&uuml;gen</button>
      </div>
      {data.stages.map((stage, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex gap-2 items-end">
            <div className="flex-1"><Field label="Label" value={stage.label} onChange={(v) => updateStage(i, 'label', v)} /></div>
            {data.stages.length > 1 && (
              <button onClick={() => removeStage(i)} className="text-xs text-red-400 hover:text-red-300 pb-1">&#x2715;</button>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex-1"><Field label="Wert" value={stage.value} onChange={(v) => updateStage(i, 'value', v)} /></div>
            <div className="w-20"><Field label="%" value={String(stage.pct)} onChange={(v) => updateStage(i, 'pct', v)} /></div>
          </div>
        </div>
      ))}

      <Field label="Bottom Line" value={data.bottomLine} onChange={(v) => onChange({ ...data, bottomLine: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben</span>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#F8F7F4" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Titelfarbe" value={data.textColor} defaultValue="#1A1A2E" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#8A8A9A" onChange={(v) => onChange({ ...data, labelColor: v })} />
      <ColorRow label="Akzentfarbe" value={data.filledColor} defaultValue="#2563EB" onChange={(v) => onChange({ ...data, filledColor: v })} />
      <ColorRow label="Rahmen" value={data.borderColor} defaultValue="#E5E5EA" onChange={(v) => onChange({ ...data, borderColor: v })} />
      <ColorRow label="Warning-Akzent" value={data.warningColor} defaultValue="#1A3FD4" onChange={(v) => onChange({ ...data, warningColor: v })} />
    </div>
  );
}
