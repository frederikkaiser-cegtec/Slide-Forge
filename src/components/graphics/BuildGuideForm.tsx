import { Field, ColorRow } from '../forms';
import type { BuildGuideData } from './BuildGuideGraphic';

export function BuildGuideForm({ data, onChange }: { data: BuildGuideData; onChange: (d: BuildGuideData) => void }) {
  const updateStack = (i: number, key: string, val: string) => {
    const stack = [...data.stack];
    stack[i] = { ...stack[i], [key]: val };
    onChange({ ...data, stack });
  };

  const updatePhase = (i: number, key: string, val: string) => {
    const phases = [...data.phases];
    phases[i] = { ...phases[i], [key]: val };
    onChange({ ...data, phases });
  };

  const updateCompare = (i: number, key: string, val: string) => {
    const compareRows = [...data.compareRows];
    compareRows[i] = { ...compareRows[i], [key]: val };
    onChange({ ...data, compareRows });
  };

  const addStack = () => {
    onChange({ ...data, stack: [...data.stack, { tool: 'Neues Tool', role: 'Rolle', cost: '$0' }] });
  };
  const removeStack = (i: number) => {
    onChange({ ...data, stack: data.stack.filter((_, idx) => idx !== i) });
  };

  const addPhase = () => {
    onChange({ ...data, phases: [...data.phases, { label: 'NEUE PHASE', duration: '1 Std', description: 'Beschreibung' }] });
  };
  const removePhase = (i: number) => {
    onChange({ ...data, phases: data.phases.filter((_, idx) => idx !== i) });
  };

  const addCompare = () => {
    onChange({ ...data, compareRows: [...data.compareRows, { label: 'Neu', before: 'Vorher', after: 'Nachher' }] });
  };
  const removeCompare = (i: number) => {
    onChange({ ...data, compareRows: data.compareRows.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-3">
      <Field label="Titel" value={data.title} onChange={(v) => onChange({ ...data, title: v })} textarea />
      <Field label="Untertitel" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} />
      <Field label="Quelle" value={data.sourceLabel} onChange={(v) => onChange({ ...data, sourceLabel: v })} />
      <Field label="Badge" value={data.badgeText} onChange={(v) => onChange({ ...data, badgeText: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben</span>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#F5F5F0" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Titelfarbe" value={data.textColor} defaultValue="#1A1A2E" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#8A8A9A" onChange={(v) => onChange({ ...data, labelColor: v })} />
      <ColorRow label="Primärfarbe" value={data.filledColor} defaultValue="#2563EB" onChange={(v) => onChange({ ...data, filledColor: v })} />
      <ColorRow label="Rahmen" value={data.borderColor} defaultValue="#E5E5EA" onChange={(v) => onChange({ ...data, borderColor: v })} />

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Stack</span>
        <button onClick={addStack} className="text-xs text-primary hover:text-primary-hover">+ Hinzufügen</button>
      </div>
      {data.stack.map((t, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Tool {i + 1}</span>
            {data.stack.length > 1 && (
              <button onClick={() => removeStack(i)} className="text-danger text-xs">&times;</button>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex-1"><Field label="Tool" value={t.tool} onChange={(v) => updateStack(i, 'tool', v)} /></div>
            <div className="w-20"><Field label="Kosten" value={t.cost} onChange={(v) => updateStack(i, 'cost', v)} /></div>
          </div>
          <Field label="Rolle" value={t.role} onChange={(v) => updateStack(i, 'role', v)} />
        </div>
      ))}

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Gesamtkosten</span>
      </div>
      <Field label="Gesamtpreis" value={data.totalCost} onChange={(v) => onChange({ ...data, totalCost: v })} />
      <Field label="Kosten-Label" value={data.totalCostLabel} onChange={(v) => onChange({ ...data, totalCostLabel: v })} />

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Build-Phasen</span>
        <button onClick={addPhase} className="text-xs text-primary hover:text-primary-hover">+ Hinzufügen</button>
      </div>
      {data.phases.map((phase, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Phase {i + 1}</span>
            {data.phases.length > 1 && (
              <button onClick={() => removePhase(i)} className="text-danger text-xs">&times;</button>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex-1"><Field label="Label" value={phase.label} onChange={(v) => updatePhase(i, 'label', v)} /></div>
            <div className="w-24"><Field label="Dauer" value={phase.duration} onChange={(v) => updatePhase(i, 'duration', v)} /></div>
          </div>
          <Field label="Beschreibung" value={phase.description} onChange={(v) => updatePhase(i, 'description', v)} />
        </div>
      ))}

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Vorher / Nachher</span>
        <button onClick={addCompare} className="text-xs text-primary hover:text-primary-hover">+ Hinzufügen</button>
      </div>
      {data.compareRows.map((row, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Zeile {i + 1}</span>
            {data.compareRows.length > 1 && (
              <button onClick={() => removeCompare(i)} className="text-danger text-xs">&times;</button>
            )}
          </div>
          <Field label="Label" value={row.label} onChange={(v) => updateCompare(i, 'label', v)} />
          <div className="flex gap-2">
            <div className="flex-1"><Field label="Vorher" value={row.before} onChange={(v) => updateCompare(i, 'before', v)} /></div>
            <div className="flex-1"><Field label="Nachher" value={row.after} onChange={(v) => updateCompare(i, 'after', v)} /></div>
          </div>
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
