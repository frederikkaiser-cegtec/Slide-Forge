import { Field, ColorRow, ChartForm } from '../forms';
import type { RoiData } from '../../types/graphics';

export function RoiForm({ data, onChange }: { data: RoiData; onChange: (d: RoiData) => void }) {
  const updateMetric = (i: number, key: 'value' | 'label' | 'color', val: string) => {
    const metrics = [...data.metrics];
    metrics[i] = { ...metrics[i], [key]: val };
    onChange({ ...data, metrics });
  };
  const addMetric = () => {
    if (data.metrics.length >= 6) return;
    onChange({ ...data, metrics: [...data.metrics, { value: '0', label: 'Neue Metrik', color: 'blue' }] });
  };
  const removeMetric = (i: number) => {
    onChange({ ...data, metrics: data.metrics.filter((_, idx) => idx !== i) });
  };
  return (
    <div className="space-y-3">
      <Field label="Titel" value={data.title} onChange={(v) => onChange({ ...data, title: v })} />
      <Field label="Untertitel" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} />
      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Metriken</span>
        <button onClick={addMetric} className="text-xs text-primary hover:text-primary-hover">+ Hinzufügen</button>
      </div>
      {data.metrics.map((m, i) => (
        <div key={i} className="flex gap-2 items-end">
          <div className="flex-1">
            <Field label={`Wert ${i + 1}`} value={m.value} onChange={(v) => updateMetric(i, 'value', v)} />
          </div>
          <div className="flex-1">
            <Field label={`Label ${i + 1}`} value={m.label} onChange={(v) => updateMetric(i, 'label', v)} />
          </div>
          <button
            onClick={() => updateMetric(i, 'color', m.color === 'blue' ? 'pink' : 'blue')}
            className={`w-6 h-6 rounded-full mb-0.5 shrink-0 ${m.color === 'blue' ? 'bg-[#3B4BF9]' : 'bg-[#E93BCD]'}`}
            title="Farbe wechseln"
          />
          {data.metrics.length > 1 && (
            <button onClick={() => removeMetric(i)} className="text-danger text-xs mb-1 shrink-0">✕</button>
          )}
        </div>
      ))}
      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben</span>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#070718" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Akzent 1" value={data.accentColor} defaultValue="#3B4BF9" onChange={(v) => onChange({ ...data, accentColor: v })} />
      <ColorRow label="Akzent 2" value={data.accentColor2} defaultValue="#E93BCD" onChange={(v) => onChange({ ...data, accentColor2: v })} />
      <ColorRow label="Textfarbe" value={data.textColor} defaultValue="#ffffff" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#8888a0" onChange={(v) => onChange({ ...data, labelColor: v })} />
      <ColorRow label="Card-Farbe" value={data.cardColor} defaultValue="#0a0a1a" onChange={(v) => onChange({ ...data, cardColor: v })} />
      <ColorRow label="Card-Rand" value={data.cardBorderColor} defaultValue="#1a1a2e" onChange={(v) => onChange({ ...data, cardBorderColor: v })} />
      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Texte</span>
      </div>
      <Field label="Tagline" value={data.tagline || 'ROI Report'} onChange={(v) => onChange({ ...data, tagline: v })} />
      <Field label="Footer links" value={data.footerLeft || 'cegtec.net'} onChange={(v) => onChange({ ...data, footerLeft: v })} />
      <Field label="Footer rechts" value={data.footerRight || 'AI Sales Automation'} onChange={(v) => onChange({ ...data, footerRight: v })} />
      <ChartForm chart={data.chart} onChange={(chart) => onChange({ ...data, chart })} />
    </div>
  );
}
