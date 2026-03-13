import { Field, ColorRow } from '../forms';
import type { InfographicData } from './InfographicGraphic';

export function InfographicForm({ data, onChange }: { data: InfographicData; onChange: (d: InfographicData) => void }) {
  const updateMetric = (i: number, key: string, val: string) => {
    const metrics = [...data.metrics];
    metrics[i] = { ...metrics[i], [key]: val };
    onChange({ ...data, metrics });
  };

  const updateFunnel = (i: number, key: string, val: string) => {
    const funnelSteps = [...data.funnelSteps];
    funnelSteps[i] = { ...funnelSteps[i], [key]: key === 'pct' ? Number(val) || 0 : val };
    onChange({ ...data, funnelSteps });
  };

  const addFunnelStep = () => {
    onChange({ ...data, funnelSteps: [...data.funnelSteps, { label: 'Schritt', value: '0', pct: 1 }] });
  };

  const removeFunnelStep = (i: number) => {
    onChange({ ...data, funnelSteps: data.funnelSteps.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-3">
      <Field label="Unternehmen" value={data.companyName} onChange={(v) => onChange({ ...data, companyName: v })} />
      <Field label="Branche" value={data.industry} onChange={(v) => onChange({ ...data, industry: v })} />
      <Field label="Headline" value={data.headline} onChange={(v) => onChange({ ...data, headline: v })} textarea />
      <Field label="Subline" value={data.subline} onChange={(v) => onChange({ ...data, subline: v })} />
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#FAFAFA" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Akzent 1" value={data.accentColor} defaultValue="#3B4BF9" onChange={(v) => onChange({ ...data, accentColor: v })} />
      <ColorRow label="Akzent 2" value={data.accentColor2} defaultValue="#E93BCD" onChange={(v) => onChange({ ...data, accentColor2: v })} />
      <ColorRow label="Textfarbe" value={data.textColor} defaultValue="#0A0A0A" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#71717A" onChange={(v) => onChange({ ...data, labelColor: v })} />
      <ColorRow label="Card-Farbe" value={data.cardColor} defaultValue="#FFFFFF" onChange={(v) => onChange({ ...data, cardColor: v })} />
      <ColorRow label="Card-Rand" value={data.cardBorderColor} defaultValue="#E5E7EB" onChange={(v) => onChange({ ...data, cardBorderColor: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Metriken</span>
      </div>
      {data.metrics.map((m, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex gap-2">
            <div className="w-14"><Field label="Icon" value={m.icon} onChange={(v) => updateMetric(i, 'icon', v)} /></div>
            <div className="flex-1"><Field label="Wert" value={m.value} onChange={(v) => updateMetric(i, 'value', v)} /></div>
          </div>
          <Field label="Label" value={m.label} onChange={(v) => updateMetric(i, 'label', v)} />
          <Field label="Tag (z.B. KPI 01)" value={m.tag || `KPI 0${i + 1}`} onChange={(v) => updateMetric(i, 'tag', v)} />
        </div>
      ))}
      <ColorRow label="KPI-Tag-Farbe" value={data.kpiTagColor} defaultValue="#9CA3AF" onChange={(v) => onChange({ ...data, kpiTagColor: v })} />

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Funnel</span>
        <button onClick={addFunnelStep} className="text-xs text-primary hover:text-primary-hover">+ Hinzufügen</button>
      </div>
      <div className="flex gap-2">
        <div className="flex-1"><Field label="Funnel-Titel" value={data.funnelTitle || 'Sales Funnel'} onChange={(v) => onChange({ ...data, funnelTitle: v })} /></div>
        <div className="flex-1"><Field label="Untertitel" value={data.funnelSubtitle || '90-DAY WINDOW'} onChange={(v) => onChange({ ...data, funnelSubtitle: v })} /></div>
      </div>
      {data.funnelSteps.map((step, i) => (
        <div key={i} className="flex gap-2 items-end">
          <div className="flex-1"><Field label="Label" value={step.label} onChange={(v) => updateFunnel(i, 'label', v)} /></div>
          <div className="w-20"><Field label="Wert" value={step.value} onChange={(v) => updateFunnel(i, 'value', v)} /></div>
          <div className="w-16"><Field label="%" value={String(step.pct)} onChange={(v) => updateFunnel(i, 'pct', v)} /></div>
          {data.funnelSteps.length > 2 && (
            <button onClick={() => removeFunnelStep(i)} className="text-danger text-xs mb-1 shrink-0">&times;</button>
          )}
        </div>
      ))}

      <Field label="Zitat" value={data.quote} onChange={(v) => onChange({ ...data, quote: v })} textarea />
      <Field label="CTA-Text" value={data.ctaText} onChange={(v) => onChange({ ...data, ctaText: v })} />
    </div>
  );
}
