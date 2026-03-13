import { Field, ColorRow } from '../forms';
import type { RevenueSystemsData } from './RevenueSystemsGraphic';

export function RevenueSystemsForm({ data, onChange }: { data: RevenueSystemsData; onChange: (d: RevenueSystemsData) => void }) {
  const updateCard = (i: number, key: string, val: string | boolean) => {
    const cards = [...data.cards];
    cards[i] = { ...cards[i], [key]: val };
    onChange({ ...data, cards });
  };

  return (
    <div className="space-y-3">
      <Field label="Footer-Text" value={data.footer} onChange={(v) => onChange({ ...data, footer: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben</span>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#FAFAFA" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Akzent" value={data.accentColor} defaultValue="#2563EB" onChange={(v) => onChange({ ...data, accentColor: v })} />
      <ColorRow label="Textfarbe" value={data.textColor} defaultValue="#0A0A0A" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#71717A" onChange={(v) => onChange({ ...data, labelColor: v })} />
      <ColorRow label="Card-Farbe" value={data.cardColor} defaultValue="#FFFFFF" onChange={(v) => onChange({ ...data, cardColor: v })} />
      <ColorRow label="Card-Rand" value={data.cardBorderColor} defaultValue="#E5E5E5" onChange={(v) => onChange({ ...data, cardBorderColor: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Karten</span>
      </div>

      {data.cards.map((card, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">{card.system}</span>
          <Field label="System-Nr." value={card.system} onChange={(v) => updateCard(i, 'system', v)} />
          <Field label="Headline" value={card.headline} onChange={(v) => updateCard(i, 'headline', v)} />
          <Field label="Tag" value={card.tag} onChange={(v) => updateCard(i, 'tag', v)} />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={card.tagFilled}
              onChange={(e) => updateCard(i, 'tagFilled', e.target.checked)}
              className="accent-primary"
            />
            <span className="text-xs text-text-muted">Tag ausgefüllt (blauer Hintergrund)</span>
          </div>
          <Field label="Beschreibung" value={card.description} onChange={(v) => updateCard(i, 'description', v)} />
          <Field label="Datenzeile" value={card.dataLine} onChange={(v) => updateCard(i, 'dataLine', v)} />
        </div>
      ))}
    </div>
  );
}
