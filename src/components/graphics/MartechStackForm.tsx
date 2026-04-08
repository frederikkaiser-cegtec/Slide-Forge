import { Field, ColorRow } from '../forms';
import type { MartechStackData } from './MartechStackGraphic';

export function MartechStackForm({ data, onChange }: { data: MartechStackData; onChange: (d: MartechStackData) => void }) {
  const updateUtil = (i: number, key: string, val: string) => {
    const utilization = [...data.utilization];
    utilization[i] = { ...utilization[i], [key]: key === 'pct' ? Number(val) || 0 : val };
    onChange({ ...data, utilization });
  };

  const updateStat = (i: number, key: string, val: string) => {
    const stats = [...data.stats];
    stats[i] = { ...stats[i], [key]: val };
    onChange({ ...data, stats });
  };

  const updateInsight = (i: number, key: string, val: string) => {
    const insights = [...data.insights];
    insights[i] = { ...insights[i], [key]: val };
    onChange({ ...data, insights });
  };

  const addInsight = () => {
    onChange({ ...data, insights: [...data.insights, { icon: '📊', text: 'Neuer Insight', highlight: '' }] });
  };

  const removeInsight = (i: number) => {
    onChange({ ...data, insights: data.insights.filter((_, idx) => idx !== i) });
  };

  const addUtil = () => {
    onChange({ ...data, utilization: [...data.utilization, { year: '2026', pct: 25 }] });
  };

  const removeUtil = (i: number) => {
    onChange({ ...data, utilization: data.utilization.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-3">
      <Field label="Top-Label" value={data.topLabel} onChange={(v) => onChange({ ...data, topLabel: v })} />
      <Field label="Headline" value={data.headline} onChange={(v) => onChange({ ...data, headline: v })} textarea />
      <Field label="Subline" value={data.subline} onChange={(v) => onChange({ ...data, subline: v })} textarea />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben</span>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#F8F7F4" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Titelfarbe" value={data.textColor} defaultValue="#1A1A2E" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#8A8A9A" onChange={(v) => onChange({ ...data, labelColor: v })} />
      <ColorRow label="Primärfarbe" value={data.filledColor} defaultValue="#2563EB" onChange={(v) => onChange({ ...data, filledColor: v })} />
      <ColorRow label="Akzent (Warm)" value={data.accentColor} defaultValue="#F59E0B" onChange={(v) => onChange({ ...data, accentColor: v })} />
      <ColorRow label="Danger" value={data.dangerColor} defaultValue="#EF4444" onChange={(v) => onChange({ ...data, dangerColor: v })} />
      <ColorRow label="Rahmen" value={data.borderColor} defaultValue="#E5E5EA" onChange={(v) => onChange({ ...data, borderColor: v })} />

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Nutzungsrate</span>
        <button onClick={addUtil} className="text-xs text-primary hover:text-primary-hover">+ Jahr</button>
      </div>
      <Field label="Chart-Titel" value={data.utilizationTitle} onChange={(v) => onChange({ ...data, utilizationTitle: v })} />
      {data.utilization.map((pt, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex gap-2 items-end">
            <div className="w-20"><Field label="Jahr" value={pt.year} onChange={(v) => updateUtil(i, 'year', v)} /></div>
            <div className="w-16"><Field label="%" value={String(pt.pct)} onChange={(v) => updateUtil(i, 'pct', v)} /></div>
            {data.utilization.length > 2 && (
              <button onClick={() => removeUtil(i)} className="text-xs text-red-400 hover:text-red-300 pb-1">&#x2715;</button>
            )}
          </div>
        </div>
      ))}

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Statistiken (3 Karten)</span>
      </div>
      {data.stats.map((stat, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex gap-2">
            <div className="flex-1"><Field label="Wert" value={stat.value} onChange={(v) => updateStat(i, 'value', v)} /></div>
            <div className="flex-1"><Field label="Quelle" value={stat.source || ''} onChange={(v) => updateStat(i, 'source', v)} /></div>
          </div>
          <Field label="Label" value={stat.label} onChange={(v) => updateStat(i, 'label', v)} />
          <ColorRow label="Farbe" value={stat.color} defaultValue="" onChange={(v) => updateStat(i, 'color', v)} />
        </div>
      ))}

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Insights</span>
        <button onClick={addInsight} className="text-xs text-primary hover:text-primary-hover">+ Hinzufügen</button>
      </div>
      {data.insights.map((row, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex gap-2 items-end">
            <div className="w-14"><Field label="Icon" value={row.icon} onChange={(v) => updateInsight(i, 'icon', v)} /></div>
            <div className="flex-1"><Field label="Text" value={row.text} onChange={(v) => updateInsight(i, 'text', v)} /></div>
            {data.insights.length > 1 && (
              <button onClick={() => removeInsight(i)} className="text-xs text-red-400 hover:text-red-300 pb-1">&#x2715;</button>
            )}
          </div>
          <Field label="Highlight" value={row.highlight || ''} onChange={(v) => updateInsight(i, 'highlight', v)} />
        </div>
      ))}

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Footer</span>
      </div>
      <Field label="Bottom Line" value={data.bottomLine} onChange={(v) => onChange({ ...data, bottomLine: v })} textarea />
      <Field label="Quellen" value={data.sourceText} onChange={(v) => onChange({ ...data, sourceText: v })} textarea />
      <Field label="CTA-Link" value={data.ctaLine} onChange={(v) => onChange({ ...data, ctaLine: v })} />
    </div>
  );
}
