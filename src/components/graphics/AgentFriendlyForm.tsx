import { Field, ColorRow } from '../forms';
import type { AgentFriendlyData } from './AgentFriendlyGraphic';

export function AgentFriendlyForm({ data, onChange }: { data: AgentFriendlyData; onChange: (d: AgentFriendlyData) => void }) {
  const updateLayer = (i: number, key: string, val: string) => {
    const layers = [...data.layers];
    layers[i] = { ...layers[i], [key]: val };
    onChange({ ...data, layers });
  };

  const updateFact = (i: number, key: string, val: string) => {
    const keyFacts = [...data.keyFacts];
    keyFacts[i] = { ...keyFacts[i], [key]: val };
    onChange({ ...data, keyFacts });
  };

  const addLayer = () => {
    onChange({ ...data, layers: [...data.layers, { label: 'NEUER LAYER', description: 'Beschreibung', difficulty: 'Standard' }] });
  };

  const removeLayer = (i: number) => {
    onChange({ ...data, layers: data.layers.filter((_, idx) => idx !== i) });
  };

  const addFact = () => {
    onChange({ ...data, keyFacts: [...data.keyFacts, { value: '0', label: 'Beschreibung' }] });
  };

  const removeFact = (i: number) => {
    onChange({ ...data, keyFacts: data.keyFacts.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-3">
      <Field label="Titel" value={data.title} onChange={(v) => onChange({ ...data, title: v })} />
      <Field label="Untertitel" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} />
      <Field label="Quelle" value={data.sourceLabel} onChange={(v) => onChange({ ...data, sourceLabel: v })} />
      <Field label="Badge" value={data.badgeText} onChange={(v) => onChange({ ...data, badgeText: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben</span>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#F5F5F0" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Titelfarbe" value={data.textColor} defaultValue="#1A1A2E" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#8A8A9A" onChange={(v) => onChange({ ...data, labelColor: v })} />
      <ColorRow label="Primärfarbe" value={data.filledColor} defaultValue="#2563EB" onChange={(v) => onChange({ ...data, filledColor: v })} />
      <ColorRow label="Leere Felder" value={data.emptyColor} defaultValue="#D4D4D8" onChange={(v) => onChange({ ...data, emptyColor: v })} />
      <ColorRow label="Rahmen" value={data.borderColor} defaultValue="#E5E5EA" onChange={(v) => onChange({ ...data, borderColor: v })} />
      <ColorRow label="Akzent" value={data.warningColor} defaultValue="#1A3FD4" onChange={(v) => onChange({ ...data, warningColor: v })} />

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Pyramiden-Layer</span>
        <button onClick={addLayer} className="text-xs text-primary hover:text-primary-hover">+ Hinzufügen</button>
      </div>
      {data.layers.map((layer, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Layer {i + 1}</span>
            {data.layers.length > 1 && (
              <button onClick={() => removeLayer(i)} className="text-danger text-xs">&times;</button>
            )}
          </div>
          <Field label="Label" value={layer.label} onChange={(v) => updateLayer(i, 'label', v)} />
          <Field label="Beschreibung" value={layer.description} onChange={(v) => updateLayer(i, 'description', v)} />
          <Field label="Schwierigkeit" value={layer.difficulty} onChange={(v) => updateLayer(i, 'difficulty', v)} />
        </div>
      ))}

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Key Facts</span>
        <button onClick={addFact} className="text-xs text-primary hover:text-primary-hover">+ Hinzufügen</button>
      </div>
      {data.keyFacts.map((fact, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Fakt {i + 1}</span>
            {data.keyFacts.length > 1 && (
              <button onClick={() => removeFact(i)} className="text-danger text-xs">&times;</button>
            )}
          </div>
          <Field label="Wert" value={fact.value} onChange={(v) => updateFact(i, 'value', v)} />
          <Field label="Label" value={fact.label} onChange={(v) => updateFact(i, 'label', v)} />
        </div>
      ))}

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Footer</span>
      </div>
      <Field label="Tools-Zeile" value={data.toolsLine} onChange={(v) => onChange({ ...data, toolsLine: v })} textarea />
      <Field label="Ergebnis-Text" value={data.resultMetrics} onChange={(v) => onChange({ ...data, resultMetrics: v })} textarea />
      <Field label="URL/Quelle" value={data.resultSource} onChange={(v) => onChange({ ...data, resultSource: v })} />
    </div>
  );
}
