import { Field } from './Field';
import type { ChartConfig, ChartType, ChartDataPoint } from '../../types/charts';

export const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: 'none', label: 'Kein Diagramm' },
  { value: 'bar', label: 'Balken' },
  { value: 'line', label: 'Linie' },
  { value: 'area', label: 'Fläche' },
  { value: 'donut', label: 'Donut' },
];

export function ChartForm({ chart, onChange }: { chart: ChartConfig; onChange: (c: ChartConfig) => void }) {
  const updatePoint = (i: number, key: keyof ChartDataPoint, val: string) => {
    const data = [...chart.data];
    data[i] = { ...data[i], [key]: key === 'value' ? Number(val) || 0 : val };
    onChange({ ...chart, data });
  };

  const addPoint = () => {
    onChange({ ...chart, data: [...chart.data, { label: 'Neu', value: 0 }] });
  };

  const removePoint = (i: number) => {
    onChange({ ...chart, data: chart.data.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-3">
      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Diagramm</span>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs text-text-muted block mb-0.5">Typ</label>
          <select
            value={chart.type}
            onChange={(e) => onChange({ ...chart, type: e.target.value as ChartType })}
            className="w-full bg-surface-hover border border-border rounded-lg px-3 py-1.5 text-sm text-text outline-none"
          >
            {CHART_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <Field label="Diagramm-Titel" value={chart.title ?? ''} onChange={(v) => onChange({ ...chart, title: v })} />
        </div>
      </div>
      {chart.type !== 'none' && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Datenpunkte</span>
            <button onClick={addPoint} className="text-xs text-primary hover:text-primary-hover">+ Hinzufügen</button>
          </div>
          {chart.data.map((d, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="flex-1">
                <Field label="Label" value={d.label} onChange={(v) => updatePoint(i, 'label', v)} />
              </div>
              <div className="w-20">
                <Field label="Wert" value={String(d.value)} onChange={(v) => updatePoint(i, 'value', v)} />
              </div>
              {chart.data.length > 1 && (
                <button onClick={() => removePoint(i)} className="text-danger text-xs mb-1 shrink-0">✕</button>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
