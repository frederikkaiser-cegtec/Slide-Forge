import { Field, ColorRow } from '../forms';
import type { LinkedInPostData } from './LinkedInPostGraphic';

export function LinkedInPostForm({ data, onChange }: { data: LinkedInPostData; onChange: (d: LinkedInPostData) => void }) {
  const updateStat = (i: number, key: string, val: string) => {
    const stats = [...data.stats];
    stats[i] = { ...stats[i], [key]: val };
    onChange({ ...data, stats });
  };

  const updateGapBar = (i: number, key: string, val: string) => {
    const gapBars = [...data.gapBars];
    gapBars[i] = { ...gapBars[i], [key]: key === 'pct' ? Number(val) || 0 : val };
    onChange({ ...data, gapBars });
  };

  const updateBullet = (i: number, key: string, val: string) => {
    const bullets = [...data.bullets];
    bullets[i] = { ...bullets[i], [key]: val };
    onChange({ ...data, bullets });
  };

  const addBullet = () => {
    onChange({ ...data, bullets: [...data.bullets, { text: 'Neuer Punkt' }] });
  };

  const removeBullet = (i: number) => {
    onChange({ ...data, bullets: data.bullets.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-3">
      <Field label="Top-Label" value={data.topLabel} onChange={(v) => onChange({ ...data, topLabel: v })} />
      <Field label="Headline" value={data.headline} onChange={(v) => onChange({ ...data, headline: v })} textarea />
      <Field label="Subline" value={data.subline} onChange={(v) => onChange({ ...data, subline: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben</span>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#F8F7F4" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Titelfarbe" value={data.textColor} defaultValue="#1A1A2E" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#8A8A9A" onChange={(v) => onChange({ ...data, labelColor: v })} />
      <ColorRow label="Gef&uuml;llte Felder" value={data.filledColor} defaultValue="#2563EB" onChange={(v) => onChange({ ...data, filledColor: v })} />
      <ColorRow label="Rahmen" value={data.borderColor} defaultValue="#E5E5EA" onChange={(v) => onChange({ ...data, borderColor: v })} />
      <ColorRow label="Warning-Akzent" value={data.warningColor} defaultValue="#1A3FD4" onChange={(v) => onChange({ ...data, warningColor: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Perception Gap</span>
      </div>
      <Field label="Gap-Titel" value={data.gapTitle} onChange={(v) => onChange({ ...data, gapTitle: v })} />
      {data.gapBars.map((bar, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex gap-2">
            <div className="w-20"><Field label="Wert" value={bar.value} onChange={(v) => updateGapBar(i, 'value', v)} /></div>
            <div className="w-16"><Field label="%" value={String(bar.pct)} onChange={(v) => updateGapBar(i, 'pct', v)} /></div>
            <div className="flex-1"><Field label="Label" value={bar.label} onChange={(v) => updateGapBar(i, 'label', v)} /></div>
          </div>
          {bar.color && (
            <ColorRow label="Farbe" value={bar.color} defaultValue="#2563EB" onChange={(v) => updateGapBar(i, 'color', v)} />
          )}
        </div>
      ))}

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Statistiken</span>
      </div>
      {data.stats.map((stat, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex gap-2">
            <div className="flex-1"><Field label="Wert" value={stat.value} onChange={(v) => updateStat(i, 'value', v)} /></div>
            <div className="flex-1"><Field label="Quelle" value={stat.source || ''} onChange={(v) => updateStat(i, 'source', v)} /></div>
          </div>
          <Field label="Label" value={stat.label} onChange={(v) => updateStat(i, 'label', v)} />
        </div>
      ))}

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Bullet Points</span>
        <button onClick={addBullet} className="text-xs text-primary hover:text-primary-hover">+ Hinzuf&uuml;gen</button>
      </div>
      {data.bullets.map((b, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex gap-2 items-end">
            <div className="flex-1"><Field label="Text" value={b.text} onChange={(v) => updateBullet(i, 'text', v)} /></div>
            {data.bullets.length > 1 && (
              <button onClick={() => removeBullet(i)} className="text-xs text-red-400 hover:text-red-300 pb-1">&#x2715;</button>
            )}
          </div>
        </div>
      ))}

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">CTA</span>
      </div>
      <Field label="CTA-Frage" value={data.ctaQuestion} onChange={(v) => onChange({ ...data, ctaQuestion: v })} textarea />
      <Field label="CTA-Link" value={data.ctaLine} onChange={(v) => onChange({ ...data, ctaLine: v })} />
    </div>
  );
}
