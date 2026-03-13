import { Field, ColorRow } from '../forms';
import type { OutboundStackData } from './OutboundStackGraphic';

export function OutboundStackForm({ data, onChange }: { data: OutboundStackData; onChange: (d: OutboundStackData) => void }) {
  const updateStep = (i: number, key: string, val: string) => {
    const steps = [...data.steps];
    steps[i] = { ...steps[i], [key]: val };
    onChange({ ...data, steps });
  };

  const addStep = () => {
    onChange({ ...data, steps: [...data.steps, { label: 'NEUER SCHRITT', tool: 'Tool Name', url: 'example.com', price: '$0/Mo', description: 'Beschreibung' }] });
  };

  const removeStep = (i: number) => {
    onChange({ ...data, steps: data.steps.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-3">
      <Field label="Titel" value={data.title} onChange={(v) => onChange({ ...data, title: v })} />
      <Field label="Untertitel" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} />
      <Field label="Quelle" value={data.sourceLabel} onChange={(v) => onChange({ ...data, sourceLabel: v })} />
      <Field label="Badge" value={data.badgeText} onChange={(v) => onChange({ ...data, badgeText: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben</span>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#F5F5F0" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Titelfarbe" value={data.textColor} defaultValue="#1A1A2E" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#8A8A9A" onChange={(v) => onChange({ ...data, labelColor: v })} />
      <ColorRow label="Gefüllte Felder" value={data.filledColor} defaultValue="#2563EB" onChange={(v) => onChange({ ...data, filledColor: v })} />
      <ColorRow label="Leere Felder" value={data.emptyColor} defaultValue="#D4D4D8" onChange={(v) => onChange({ ...data, emptyColor: v })} />
      <ColorRow label="Rahmen" value={data.borderColor} defaultValue="#E5E5EA" onChange={(v) => onChange({ ...data, borderColor: v })} />
      <ColorRow label="Warning-Akzent" value={data.warningColor} defaultValue="#1A3FD4" onChange={(v) => onChange({ ...data, warningColor: v })} />

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Pipeline-Schritte</span>
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
          <Field label="Tool" value={step.tool} onChange={(v) => updateStep(i, 'tool', v)} />
          <div className="flex gap-2">
            <div className="flex-1"><Field label="URL" value={step.url} onChange={(v) => updateStep(i, 'url', v)} /></div>
            <div className="flex-1"><Field label="Preis" value={step.price} onChange={(v) => updateStep(i, 'price', v)} /></div>
          </div>
          <Field label="Beschreibung" value={step.description} onChange={(v) => updateStep(i, 'description', v)} />
        </div>
      ))}

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Kosten-Vergleich</span>
      </div>
      <div className="flex gap-2">
        <div className="flex-1"><Field label="Links Titel" value={data.costLeft.title} onChange={(v) => onChange({ ...data, costLeft: { ...data.costLeft, title: v } })} /></div>
        <div className="flex-1"><Field label="Links Preis" value={data.costLeft.price} onChange={(v) => onChange({ ...data, costLeft: { ...data.costLeft, price: v } })} /></div>
      </div>
      <Field label="Links Kleingedruckt" value={data.costLeft.subtitle} onChange={(v) => onChange({ ...data, costLeft: { ...data.costLeft, subtitle: v } })} />
      <div className="flex gap-2">
        <div className="flex-1"><Field label="Rechts Titel" value={data.costRight.title} onChange={(v) => onChange({ ...data, costRight: { ...data.costRight, title: v } })} /></div>
        <div className="flex-1"><Field label="Rechts Preis" value={data.costRight.price} onChange={(v) => onChange({ ...data, costRight: { ...data.costRight, price: v } })} /></div>
      </div>
      <Field label="Rechts Kleingedruckt" value={data.costRight.subtitle} onChange={(v) => onChange({ ...data, costRight: { ...data.costRight, subtitle: v } })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Ergebnis</span>
      </div>
      <Field label="Ergebnis-Metriken" value={data.resultMetrics} onChange={(v) => onChange({ ...data, resultMetrics: v })} textarea />
      <Field label="Quelle" value={data.resultSource} onChange={(v) => onChange({ ...data, resultSource: v })} />
    </div>
  );
}
