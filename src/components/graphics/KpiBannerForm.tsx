import { Field, ColorRow } from '../forms';
import type { KpiBannerData } from './KpiBannerGraphic';

export function KpiBannerForm({ data, onChange }: { data: KpiBannerData; onChange: (d: KpiBannerData) => void }) {
  const updateKpi = (i: number, key: string, val: string) => {
    const kpis = [...data.kpis];
    kpis[i] = { ...kpis[i], [key]: val };
    onChange({ ...data, kpis });
  };

  const addKpi = () => {
    if (data.kpis.length >= 7) return;
    onChange({ ...data, kpis: [...data.kpis, { icon: '📊', value: '0', label: 'Neue KPI', color: 'blue' }] });
  };

  const removeKpi = (i: number) => {
    onChange({ ...data, kpis: data.kpis.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-3">
      <Field label="Titel" value={data.title} onChange={(v) => onChange({ ...data, title: v })} />
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#0A1628" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Akzent 1 (Blau)" value={data.accentColor} defaultValue="#3B82F6" onChange={(v) => onChange({ ...data, accentColor: v })} />
      <ColorRow label="Akzent 2 (Grün)" value={data.accentColor2} defaultValue="#10B981" onChange={(v) => onChange({ ...data, accentColor2: v })} />
      <ColorRow label="Titel-Farbe" value={data.textColor} defaultValue="#b0b0c0" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#808090" onChange={(v) => onChange({ ...data, labelColor: v })} />

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">KPIs</span>
        <button onClick={addKpi} className="text-xs text-primary hover:text-primary-hover">+ Hinzufügen</button>
      </div>

      {data.kpis.map((kpi, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex gap-2 items-end">
            <div className="w-14">
              <Field label="Icon" value={kpi.icon} onChange={(v) => updateKpi(i, 'icon', v)} />
            </div>
            <div className="flex-1">
              <Field label="Wert" value={kpi.value} onChange={(v) => updateKpi(i, 'value', v)} />
            </div>
            <button
              onClick={() => updateKpi(i, 'color', kpi.color === 'blue' ? 'green' : 'blue')}
              style={{ background: kpi.color === 'blue' ? (data.accentColor || '#3B82F6') : (data.accentColor2 || '#10B981') }}
              className="w-6 h-6 rounded-full mb-0.5 shrink-0"
              title="Farbe wechseln"
            />
            {data.kpis.length > 1 && (
              <button onClick={() => removeKpi(i)} className="text-danger text-xs mb-1 shrink-0">✕</button>
            )}
          </div>
          <Field label="Label" value={kpi.label} onChange={(v) => updateKpi(i, 'label', v)} />
        </div>
      ))}
    </div>
  );
}
