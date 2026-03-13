import { Field, ColorRow } from '../forms';
import type { AcademyData } from './AcademyGraphic';

export function AcademyForm({ data, onChange }: { data: AcademyData; onChange: (d: AcademyData) => void }) {
  const updateStep = (i: number, key: string, val: string) => {
    const steps = [...data.steps];
    steps[i] = { ...steps[i], [key]: val };
    onChange({ ...data, steps });
  };

  return (
    <div className="space-y-3">
      <Field label="Titel" value={data.title} onChange={(v) => onChange({ ...data, title: v })} textarea />
      <Field label="Untertitel" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} />
      <Field label="Badge" value={data.badge} onChange={(v) => onChange({ ...data, badge: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben & Theme</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onChange({ ...data, theme: 'light', backgroundColor: '#F5F5F0', textColor: '#1A1A2E' })}
          className={`flex-1 py-1.5 text-xs rounded-lg font-medium ${data.theme === 'light' ? 'bg-primary text-white' : 'bg-surface-hover text-text-muted'}`}
        >Light</button>
        <button
          onClick={() => onChange({ ...data, theme: 'dark', backgroundColor: '#0A0E27', textColor: '#FFFFFF' })}
          className={`flex-1 py-1.5 text-xs rounded-lg font-medium ${data.theme === 'dark' ? 'bg-primary text-white' : 'bg-surface-hover text-text-muted'}`}
        >Dark</button>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#F5F5F0" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Akzent" value={data.accentColor} defaultValue="#2563EB" onChange={(v) => onChange({ ...data, accentColor: v })} />
      <ColorRow label="Akzent 2" value={data.accentColor2} defaultValue="#1A3FD4" onChange={(v) => onChange({ ...data, accentColor2: v })} />
      <ColorRow label="Textfarbe" value={data.textColor} defaultValue="#1A1A2E" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#7A7A8E" onChange={(v) => onChange({ ...data, labelColor: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Pipeline Steps</span>
      </div>
      {data.steps.map((step, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex gap-2">
            <div className="flex-1"><Field label="Aktion" value={step.action} onChange={(v) => updateStep(i, 'action', v)} /></div>
            <div className="w-20"><Field label="Kosten" value={step.cost} onChange={(v) => updateStep(i, 'cost', v)} /></div>
          </div>
          <Field label="Tool" value={step.tool} onChange={(v) => updateStep(i, 'tool', v)} />
          <Field label="Beschreibung" value={step.desc} onChange={(v) => updateStep(i, 'desc', v)} />
        </div>
      ))}

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Kosten-Vergleich</span>
      </div>
      <div className="flex gap-2">
        <div className="flex-1"><Field label="Unser Preis" value={data.ourPrice} onChange={(v) => onChange({ ...data, ourPrice: v })} /></div>
        <div className="flex-1"><Field label="Deren Preis" value={data.theirPrice} onChange={(v) => onChange({ ...data, theirPrice: v })} /></div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1"><Field label="Unser Label" value={data.ourLabel} onChange={(v) => onChange({ ...data, ourLabel: v })} /></div>
        <div className="flex-1"><Field label="Deren Label" value={data.theirLabel} onChange={(v) => onChange({ ...data, theirLabel: v })} /></div>
      </div>

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Ergebnis-Banner</span>
      </div>
      <Field label="Metriken" value={data.resultBanner} onChange={(v) => onChange({ ...data, resultBanner: v })} textarea />
      <Field label="Quelle" value={data.resultSource} onChange={(v) => onChange({ ...data, resultSource: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">CTA</span>
      </div>
      <Field label="CTA Text" value={data.ctaText} onChange={(v) => onChange({ ...data, ctaText: v })} textarea />
      <Field label="Button" value={data.ctaButton} onChange={(v) => onChange({ ...data, ctaButton: v })} />
      <Field label="URL" value={data.ctaUrl} onChange={(v) => onChange({ ...data, ctaUrl: v })} />
    </div>
  );
}
