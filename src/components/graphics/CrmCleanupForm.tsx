import { Field, ColorRow } from '../forms';
import type { CrmCleanupData } from './CrmCleanupGraphic';

export function CrmCleanupForm({ data, onChange }: { data: CrmCleanupData; onChange: (d: CrmCleanupData) => void }) {
  const updateStep = (i: number, key: string, val: string) => {
    const steps = [...data.steps];
    steps[i] = { ...steps[i], [key]: val };
    onChange({ ...data, steps });
  };

  const updateStat = (i: number, key: string, val: string) => {
    const stats = [...data.stats];
    stats[i] = { ...stats[i], [key]: val };
    onChange({ ...data, stats });
  };

  const addStep = () => {
    onChange({ ...data, steps: [...data.steps, { label: 'NEUER SCHRITT', description: 'Beschreibung' }] });
  };
  const removeStep = (i: number) => {
    onChange({ ...data, steps: data.steps.filter((_, idx) => idx !== i) });
  };

  const addStat = () => {
    onChange({ ...data, stats: [...data.stats, { value: '0%', label: 'Beschreibung' }] });
  };
  const removeStat = (i: number) => {
    onChange({ ...data, stats: data.stats.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-3">
      <Field label="Titel" value={data.title} onChange={(v) => onChange({ ...data, title: v })} textarea />
      <Field label="Untertitel" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} />
      <Field label="Quelle" value={data.sourceLabel} onChange={(v) => onChange({ ...data, sourceLabel: v })} />
      <Field label="Badge" value={data.badgeText} onChange={(v) => onChange({ ...data, badgeText: v })} />
      <Field label="Hook-Zeile" value={data.hookLine} onChange={(v) => onChange({ ...data, hookLine: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben</span>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#F5F5F0" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Titelfarbe" value={data.textColor} defaultValue="#1A1A2E" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#8A8A9A" onChange={(v) => onChange({ ...data, labelColor: v })} />
      <ColorRow label="Primärfarbe" value={data.filledColor} defaultValue="#2563EB" onChange={(v) => onChange({ ...data, filledColor: v })} />
      <ColorRow label="Rahmen" value={data.borderColor} defaultValue="#E5E5EA" onChange={(v) => onChange({ ...data, borderColor: v })} />

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Key Stats</span>
        <button onClick={addStat} className="text-xs text-primary hover:text-primary-hover">+ Hinzufügen</button>
      </div>
      {data.stats.map((stat, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Stat {i + 1}</span>
            {data.stats.length > 1 && (
              <button onClick={() => removeStat(i)} className="text-danger text-xs">&times;</button>
            )}
          </div>
          <div className="flex gap-2">
            <div className="w-24"><Field label="Wert" value={stat.value} onChange={(v) => updateStat(i, 'value', v)} /></div>
            <div className="flex-1"><Field label="Label" value={stat.label} onChange={(v) => updateStat(i, 'label', v)} /></div>
          </div>
        </div>
      ))}

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Cleanup-Schritte</span>
        <button onClick={addStep} className="text-xs text-primary hover:text-primary-hover">+ Hinzufügen</button>
      </div>
      {data.steps.map((step, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Schritt {i + 1}</span>
            {data.steps.length > 1 && (
              <button onClick={() => removeStep(i)} className="text-danger text-xs">&times;</button>
            )}
          </div>
          <Field label="Label" value={step.label} onChange={(v) => updateStep(i, 'label', v)} />
          <Field label="Beschreibung" value={step.description} onChange={(v) => updateStep(i, 'description', v)} />
        </div>
      ))}

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Ergebnis-Banner</span>
      </div>
      <Field label="Metriken" value={data.resultMetrics} onChange={(v) => onChange({ ...data, resultMetrics: v })} textarea />
      <Field label="Quelle" value={data.resultSource} onChange={(v) => onChange({ ...data, resultSource: v })} />
    </div>
  );
}
