import { Field, ColorRow } from '../forms';
import type { QuoteCardData } from './QuoteCardGraphic';

export function QuoteCardForm({ data, onChange }: { data: QuoteCardData; onChange: (d: QuoteCardData) => void }) {
  return (
    <div className="space-y-3">
      <Field label="Zitat" value={data.quote} onChange={(v) => onChange({ ...data, quote: v })} textarea />
      <Field label="Akzent-Subline" value={data.topLabel} onChange={(v) => onChange({ ...data, topLabel: v })} />
      <Field label="Name" value={data.personName} onChange={(v) => onChange({ ...data, personName: v })} />
      <Field label="Titel" value={data.personTitle} onChange={(v) => onChange({ ...data, personTitle: v })} />
      <Field label="Foto-URL" value={data.photoUrl} onChange={(v) => onChange({ ...data, photoUrl: v })} />
      <Field label="CTA-Text" value={data.ctaText} onChange={(v) => onChange({ ...data, ctaText: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben</span>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#F2EDE8" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Textfarbe" value={data.textColor} defaultValue="#1A1A2E" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Akzent" value={data.accentColor} defaultValue="#4f46e5" onChange={(v) => onChange({ ...data, accentColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#8A8A9A" onChange={(v) => onChange({ ...data, labelColor: v })} />
    </div>
  );
}
