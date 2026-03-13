import { Field, ColorRow, ChartForm } from '../forms';
import type { CaseStudyData } from '../../types/graphics';

export function CaseStudyForm({ data, onChange }: { data: CaseStudyData; onChange: (d: CaseStudyData) => void }) {
  const update = (key: keyof CaseStudyData, value: string) => onChange({ ...data, [key]: value });
  return (
    <div className="space-y-3">
      <Field label="Unternehmen" value={data.companyName} onChange={(v) => update('companyName', v)} />
      <Field label="Branche" value={data.industry} onChange={(v) => update('industry', v)} />
      <Field label="Headline" value={data.headline} onChange={(v) => update('headline', v)} textarea />
      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Metriken</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Wert 1 (Hero)" value={data.metricValue} onChange={(v) => update('metricValue', v)} />
        <Field label="Label 1" value={data.metricLabel} onChange={(v) => update('metricLabel', v)} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Wert 2" value={data.metric2Value} onChange={(v) => update('metric2Value', v)} />
        <Field label="Label 2" value={data.metric2Label} onChange={(v) => update('metric2Label', v)} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Wert 3" value={data.metric3Value} onChange={(v) => update('metric3Value', v)} />
        <Field label="Label 3" value={data.metric3Label} onChange={(v) => update('metric3Label', v)} />
      </div>
      <Field label="Zitat" value={data.quote} onChange={(v) => update('quote', v)} textarea />
      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben</span>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#080820" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Akzent 1" value={data.accentColor} defaultValue="#3B4BF9" onChange={(v) => onChange({ ...data, accentColor: v })} />
      <ColorRow label="Akzent 2" value={data.accentColor2} defaultValue="#E93BCD" onChange={(v) => onChange({ ...data, accentColor2: v })} />
      <ColorRow label="Textfarbe" value={data.textColor} defaultValue="#ffffff" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#8888a0" onChange={(v) => onChange({ ...data, labelColor: v })} />
      <ColorRow label="Card-Farbe" value={data.cardColor} defaultValue="#0a0a1a" onChange={(v) => onChange({ ...data, cardColor: v })} />
      <ColorRow label="Card-Rand" value={data.cardBorderColor} defaultValue="#1a1a2e" onChange={(v) => onChange({ ...data, cardBorderColor: v })} />
      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Texte</span>
      </div>
      <Field label="Tagline" value={data.tagline || 'Case Study'} onChange={(v) => onChange({ ...data, tagline: v })} />
      <Field label="Footer links" value={data.footerLeft || 'cegtec.net'} onChange={(v) => onChange({ ...data, footerLeft: v })} />
      <Field label="Footer rechts" value={data.footerRight || 'AI Sales Automation'} onChange={(v) => onChange({ ...data, footerRight: v })} />
      <ChartForm chart={data.chart} onChange={(chart) => onChange({ ...data, chart })} />
    </div>
  );
}
