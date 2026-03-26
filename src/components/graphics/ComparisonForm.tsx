import { Field, ColorRow } from '../forms';
import type { ComparisonData } from './ComparisonGraphic';

export function ComparisonForm({ data, onChange }: { data: ComparisonData; onChange: (d: ComparisonData) => void }) {
  const updateRow = (i: number, key: string, val: string) => {
    const rows = [...data.rows];
    rows[i] = { ...rows[i], [key]: val };
    onChange({ ...data, rows });
  };

  const addRow = () => {
    onChange({ ...data, rows: [...data.rows, { label: 'Neue Metrik', leftValue: '0', rightValue: '0' }] });
  };

  const removeRow = (i: number) => {
    onChange({ ...data, rows: data.rows.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-3">
      <Field label="Top-Label" value={data.topLabel} onChange={(v) => onChange({ ...data, topLabel: v })} />
      <Field label="Headline" value={data.headline} onChange={(v) => onChange({ ...data, headline: v })} textarea />
      <Field label="Linker Titel" value={data.leftTitle} onChange={(v) => onChange({ ...data, leftTitle: v })} />
      <Field label="Rechter Titel" value={data.rightTitle} onChange={(v) => onChange({ ...data, rightTitle: v })} />

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Vergleichszeilen</span>
        <button onClick={addRow} className="text-xs text-primary hover:text-primary-hover">+ Hinzuf&uuml;gen</button>
      </div>
      {data.rows.map((row, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex gap-2 items-end">
            <div className="flex-1"><Field label="Label" value={row.label} onChange={(v) => updateRow(i, 'label', v)} /></div>
            {data.rows.length > 1 && (
              <button onClick={() => removeRow(i)} className="text-xs text-red-400 hover:text-red-300 pb-1">&#x2715;</button>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex-1"><Field label="Links" value={row.leftValue} onChange={(v) => updateRow(i, 'leftValue', v)} /></div>
            <div className="flex-1"><Field label="Rechts" value={row.rightValue} onChange={(v) => updateRow(i, 'rightValue', v)} /></div>
          </div>
        </div>
      ))}

      <Field label="Bottom Line" value={data.bottomLine} onChange={(v) => onChange({ ...data, bottomLine: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben</span>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#F8F7F4" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Titelfarbe" value={data.textColor} defaultValue="#1A1A2E" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#8A8A9A" onChange={(v) => onChange({ ...data, labelColor: v })} />
      <ColorRow label="Akzentfarbe" value={data.filledColor} defaultValue="#2563EB" onChange={(v) => onChange({ ...data, filledColor: v })} />
      <ColorRow label="Rahmen" value={data.borderColor} defaultValue="#E5E5EA" onChange={(v) => onChange({ ...data, borderColor: v })} />
      <ColorRow label="Warning-Akzent" value={data.warningColor} defaultValue="#1A3FD4" onChange={(v) => onChange({ ...data, warningColor: v })} />
    </div>
  );
}
