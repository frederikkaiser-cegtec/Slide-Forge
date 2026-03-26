import { Field, ColorRow } from '../forms';
import type { TimelineData } from './TimelineGraphic';

export function TimelineForm({ data, onChange }: { data: TimelineData; onChange: (d: TimelineData) => void }) {
  const updateStep = (i: number, key: string, val: string) => {
    const steps = [...data.steps];
    steps[i] = { ...steps[i], [key]: val };
    onChange({ ...data, steps });
  };

  const addStep = () => {
    onChange({ ...data, steps: [...data.steps, { title: 'Neuer Schritt', description: 'Beschreibung', duration: '' }] });
  };

  const removeStep = (i: number) => {
    onChange({ ...data, steps: data.steps.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-3">
      <Field label="Top-Label" value={data.topLabel} onChange={(v) => onChange({ ...data, topLabel: v })} />
      <Field label="Headline" value={data.headline} onChange={(v) => onChange({ ...data, headline: v })} textarea />

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Schritte</span>
        <button onClick={addStep} className="text-xs text-primary hover:text-primary-hover">+ Hinzuf&uuml;gen</button>
      </div>
      {data.steps.map((step, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex gap-2 items-end">
            <div className="flex-1"><Field label="Titel" value={step.title} onChange={(v) => updateStep(i, 'title', v)} /></div>
            {data.steps.length > 1 && (
              <button onClick={() => removeStep(i)} className="text-xs text-red-400 hover:text-red-300 pb-1">&#x2715;</button>
            )}
          </div>
          <Field label="Beschreibung" value={step.description} onChange={(v) => updateStep(i, 'description', v)} />
          <Field label="Dauer (optional)" value={step.duration || ''} onChange={(v) => updateStep(i, 'duration', v)} />
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
