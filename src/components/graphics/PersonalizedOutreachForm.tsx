import { Field, ColorRow } from '../forms';
import type { PersonalizedOutreachData } from './PersonalizedOutreachGraphic';

export function PersonalizedOutreachForm({ data, onChange }: { data: PersonalizedOutreachData; onChange: (d: PersonalizedOutreachData) => void }) {
  const updateMessage = (i: number, key: string, val: string) => {
    const messages = [...data.messages];
    messages[i] = { ...messages[i], [key]: val };
    onChange({ ...data, messages });
  };

  const updateVariable = (mi: number, vi: number, key: string, val: string) => {
    const messages = [...data.messages];
    const variables = [...messages[mi].variables];
    variables[vi] = { ...variables[vi], [key]: val };
    messages[mi] = { ...messages[mi], variables };
    onChange({ ...data, messages });
  };

  const addVariable = (mi: number) => {
    const messages = [...data.messages];
    messages[mi] = { ...messages[mi], variables: [...messages[mi].variables, { key: '{{new}}', value: 'Wert' }] };
    onChange({ ...data, messages });
  };

  const removeVariable = (mi: number, vi: number) => {
    const messages = [...data.messages];
    messages[mi] = { ...messages[mi], variables: messages[mi].variables.filter((_, idx) => idx !== vi) };
    onChange({ ...data, messages });
  };

  const addMessage = () => {
    onChange({ ...data, messages: [...data.messages, { to: 'name@example.de', subject: 'Betreff', variables: [{ key: '{{firmenname}}', value: 'Firma' }], preview: 'Nachricht...', status: '\u2705 READY TO SEND' }] });
  };

  const removeMessage = (i: number) => {
    onChange({ ...data, messages: data.messages.filter((_, idx) => idx !== i) });
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
      <Field label="Quelle" value={data.sourceLabel} onChange={(v) => onChange({ ...data, sourceLabel: v })} />
      <Field label="Badge" value={data.badgeText} onChange={(v) => onChange({ ...data, badgeText: v })} />
      <Field label="Nachrichten-Anzahl" value={data.messageCount} onChange={(v) => onChange({ ...data, messageCount: v })} />
      <Field label="Counter Label" value={data.counterLabel} onChange={(v) => onChange({ ...data, counterLabel: v })} />
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
        <span className="text-xs text-text-muted font-medium">Nachrichten</span>
        <button onClick={addMessage} className="text-xs text-primary hover:text-primary-hover">+ Hinzufügen</button>
      </div>

      {data.messages.map((msg, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Message #{i + 1}</span>
            {data.messages.length > 1 && (
              <button onClick={() => removeMessage(i)} className="text-danger text-xs">&times;</button>
            )}
          </div>
          <Field label="An" value={msg.to} onChange={(v) => updateMessage(i, 'to', v)} />
          <Field label="Betreff" value={msg.subject} onChange={(v) => updateMessage(i, 'subject', v)} />
          <Field label="Preview" value={msg.preview} onChange={(v) => updateMessage(i, 'preview', v)} textarea />
          <Field label="Status" value={msg.status} onChange={(v) => updateMessage(i, 'status', v)} />
          <div className="border-t border-border pt-2 mt-2 flex items-center justify-between">
            <span className="text-[10px] text-text-muted font-medium">Variablen</span>
            <button onClick={() => addVariable(i)} className="text-xs text-primary hover:text-primary-hover">+</button>
          </div>
          {msg.variables.map((v, vi) => (
            <div key={vi} className="flex gap-2 items-end">
              <div className="flex-1"><Field label="Key" value={v.key} onChange={(val) => updateVariable(i, vi, 'key', val)} /></div>
              <div className="flex-1"><Field label="Value" value={v.value} onChange={(val) => updateVariable(i, vi, 'value', val)} /></div>
              {msg.variables.length > 1 && (
                <button onClick={() => removeVariable(i, vi)} className="text-danger text-xs mb-1">&times;</button>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
