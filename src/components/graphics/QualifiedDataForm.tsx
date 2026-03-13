import { Field, ColorRow } from '../forms';
import type { QualifiedDataData } from './QualifiedDataGraphic';

export function QualifiedDataForm({ data, onChange }: { data: QualifiedDataData; onChange: (d: QualifiedDataData) => void }) {
  const updateEntry = (i: number, key: string, val: string) => {
    const entries = [...data.entries];
    entries[i] = { ...entries[i], [key]: key === 'icpScore' ? Number(val) || 0 : val };
    onChange({ ...data, entries });
  };

  const addEntry = () => {
    onChange({ ...data, entries: [...data.entries, { company: 'Neue Firma GmbH', domain: 'example.de', employees: '50–200', revenue: '€5M–10M', industry: 'SaaS', icpScore: 70, status: 'Review' }] });
  };

  const removeEntry = (i: number) => {
    onChange({ ...data, entries: data.entries.filter((_, idx) => idx !== i) });
  };

  const updateFooterStat = (i: number, key: string, val: string) => {
    const footerStats = [...data.footerStats];
    footerStats[i] = { ...footerStats[i], [key]: val };
    onChange({ ...data, footerStats });
  };

  return (
    <div className="space-y-3">
      <Field label="Titel" value={data.title} onChange={(v) => onChange({ ...data, title: v })} />
      <Field label="Untertitel" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} />
      <Field label="Gesamt-Anzahl" value={data.totalCount} onChange={(v) => onChange({ ...data, totalCount: v })} />
      <Field label="Qualified Count" value={data.qualifiedCount} onChange={(v) => onChange({ ...data, qualifiedCount: v })} />
      <Field label="Quelle" value={data.sourceLabel} onChange={(v) => onChange({ ...data, sourceLabel: v })} />
      <Field label="Footer Label" value={data.footerLabel} onChange={(v) => onChange({ ...data, footerLabel: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben</span>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#F8F7F4" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Titelfarbe" value={data.textColor} defaultValue="#1A1A2E" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#8A8A9A" onChange={(v) => onChange({ ...data, labelColor: v })} />
      <ColorRow label="Gefüllte Felder" value={data.filledColor} defaultValue="#2563EB" onChange={(v) => onChange({ ...data, filledColor: v })} />
      <ColorRow label="Leere Felder" value={data.emptyColor} defaultValue="#D4D4D8" onChange={(v) => onChange({ ...data, emptyColor: v })} />
      <ColorRow label="Rahmen" value={data.borderColor} defaultValue="#E5E5EA" onChange={(v) => onChange({ ...data, borderColor: v })} />
      <ColorRow label="Warning-Akzent" value={data.warningColor} defaultValue="#2563EB" onChange={(v) => onChange({ ...data, warningColor: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Footer Stats</span>
      </div>
      {data.footerStats.map((stat, i) => (
        <div key={i} className="flex gap-2">
          <div className="flex-1"><Field label="Label" value={stat.label} onChange={(v) => updateFooterStat(i, 'label', v)} /></div>
          <div className="flex-1"><Field label="Wert" value={stat.value} onChange={(v) => updateFooterStat(i, 'value', v)} /></div>
        </div>
      ))}

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Einträge</span>
        <button onClick={addEntry} className="text-xs text-primary hover:text-primary-hover">+ Hinzufügen</button>
      </div>

      {data.entries.map((entry, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">#{String(i + 1).padStart(3, '0')}</span>
            {data.entries.length > 1 && (
              <button onClick={() => removeEntry(i)} className="text-danger text-xs">&times;</button>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex-[2]"><Field label="Firma" value={entry.company} onChange={(v) => updateEntry(i, 'company', v)} /></div>
            <div className="flex-1"><Field label="Domain" value={entry.domain} onChange={(v) => updateEntry(i, 'domain', v)} /></div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1"><Field label="Employees" value={entry.employees} onChange={(v) => updateEntry(i, 'employees', v)} /></div>
            <div className="flex-1"><Field label="Revenue" value={entry.revenue} onChange={(v) => updateEntry(i, 'revenue', v)} /></div>
          </div>
          <Field label="Industry" value={entry.industry} onChange={(v) => updateEntry(i, 'industry', v)} />
          <div className="flex gap-2">
            <div className="flex-1"><Field label="ICP Score" value={String(entry.icpScore)} onChange={(v) => updateEntry(i, 'icpScore', v)} /></div>
            <div className="flex-1"><Field label="Status" value={entry.status} onChange={(v) => updateEntry(i, 'status', v)} /></div>
          </div>
        </div>
      ))}
    </div>
  );
}
