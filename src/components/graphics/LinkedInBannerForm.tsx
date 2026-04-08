import { Field, ColorRow } from '../forms';
import type { LinkedInBannerData } from './LinkedInBannerGraphic';

export function LinkedInBannerForm({ data, onChange }: { data: LinkedInBannerData; onChange: (d: LinkedInBannerData) => void }) {
  return (
    <div className="space-y-3">
      <Field label="Tagline" value={data.tagline} onChange={(v) => onChange({ ...data, tagline: v })} />
      <Field label="Headline" value={data.headline} onChange={(v) => onChange({ ...data, headline: v })} textarea />
      <Field label="Subtitle" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} textarea />
      <Field label="URL" value={data.url} onChange={(v) => onChange({ ...data, url: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben</span>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#F8F7F4" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Titelfarbe" value={data.textColor} defaultValue="#1A1A2E" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#8A8A9A" onChange={(v) => onChange({ ...data, labelColor: v })} />
      <ColorRow label="Akzentfarbe" value={data.filledColor} defaultValue="#2563EB" onChange={(v) => onChange({ ...data, filledColor: v })} />
      <ColorRow label="Rahmen" value={data.borderColor} defaultValue="#E5E5EA" onChange={(v) => onChange({ ...data, borderColor: v })} />
    </div>
  );
}
