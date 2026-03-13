import { Field, ColorRow } from '../forms';
import type { MultichannelOutreachData } from './MultichannelOutreachGraphic';

export function MultichannelOutreachForm({ data, onChange }: { data: MultichannelOutreachData; onChange: (d: MultichannelOutreachData) => void }) {
  const updateChannelEntry = (side: 'leftChannel' | 'rightChannel', si: number, ei: number, key: string, val: string) => {
    const channel = { ...data[side] };
    const steps = [...channel.steps];
    const entries = [...steps[si].entries];
    entries[ei] = { ...entries[ei], [key]: val };
    steps[si] = { ...steps[si], entries };
    channel.steps = steps;
    onChange({ ...data, [side]: channel });
  };

  const updateStep = (side: 'leftChannel' | 'rightChannel', si: number, key: string, val: string) => {
    const channel = { ...data[side] };
    const steps = [...channel.steps];
    steps[si] = { ...steps[si], [key]: val };
    channel.steps = steps;
    onChange({ ...data, [side]: channel });
  };

  const addEntry = (side: 'leftChannel' | 'rightChannel', si: number) => {
    const channel = { ...data[side] };
    const steps = [...channel.steps];
    steps[si] = { ...steps[si], entries: [...steps[si].entries, { name: 'name@example.de', status: 'Pending\u2026' }] };
    channel.steps = steps;
    onChange({ ...data, [side]: channel });
  };

  const removeEntry = (side: 'leftChannel' | 'rightChannel', si: number, ei: number) => {
    const channel = { ...data[side] };
    const steps = [...channel.steps];
    steps[si] = { ...steps[si], entries: steps[si].entries.filter((_, idx) => idx !== ei) };
    channel.steps = steps;
    onChange({ ...data, [side]: channel });
  };

  const addStep = (side: 'leftChannel' | 'rightChannel') => {
    const channel = { ...data[side] };
    channel.steps = [...channel.steps, { day: 'DAY X', action: 'Aktion', entries: [{ name: 'name@example.de', status: 'Pending\u2026' }] }];
    onChange({ ...data, [side]: channel });
  };

  const removeStep = (side: 'leftChannel' | 'rightChannel', si: number) => {
    const channel = { ...data[side] };
    channel.steps = channel.steps.filter((_, idx) => idx !== si);
    onChange({ ...data, [side]: channel });
  };

  const updateFooterStat = (i: number, key: string, val: string) => {
    const footerStats = [...data.footerStats];
    footerStats[i] = { ...footerStats[i], [key]: val };
    onChange({ ...data, footerStats });
  };

  const renderChannelEditor = (side: 'leftChannel' | 'rightChannel', label: string) => {
    const channel = data[side];
    return (
      <>
        <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
          <span className="text-xs text-text-muted font-medium">{label}</span>
          <button onClick={() => addStep(side)} className="text-xs text-primary hover:text-primary-hover">+ Step</button>
        </div>
        <Field label="Icon" value={channel.icon} onChange={(v) => onChange({ ...data, [side]: { ...channel, icon: v } })} />
        <Field label="Header" value={channel.header} onChange={(v) => onChange({ ...data, [side]: { ...channel, header: v } })} />
        {channel.steps.map((step, si) => (
          <div key={si} className="bg-surface-hover rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">{step.day}</span>
              {channel.steps.length > 1 && (
                <button onClick={() => removeStep(side, si)} className="text-danger text-xs">&times;</button>
              )}
            </div>
            <div className="flex gap-2">
              <div className="flex-1"><Field label="Day" value={step.day} onChange={(v) => updateStep(side, si, 'day', v)} /></div>
              <div className="flex-1"><Field label="Aktion" value={step.action} onChange={(v) => updateStep(side, si, 'action', v)} /></div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-text-muted">Einträge</span>
              <button onClick={() => addEntry(side, si)} className="text-xs text-primary hover:text-primary-hover">+</button>
            </div>
            {step.entries.map((entry, ei) => (
              <div key={ei} className="flex gap-2 items-end">
                <div className="flex-[2]"><Field label="Name" value={entry.name} onChange={(v) => updateChannelEntry(side, si, ei, 'name', v)} /></div>
                <div className="flex-1"><Field label="Status" value={entry.status} onChange={(v) => updateChannelEntry(side, si, ei, 'status', v)} /></div>
                {step.entries.length > 1 && (
                  <button onClick={() => removeEntry(side, si, ei)} className="text-danger text-xs mb-1">&times;</button>
                )}
              </div>
            ))}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="space-y-3">
      <Field label="Titel" value={data.title} onChange={(v) => onChange({ ...data, title: v })} />
      <Field label="Untertitel" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} />
      <Field label="Quelle" value={data.sourceLabel} onChange={(v) => onChange({ ...data, sourceLabel: v })} />
      <Field label="Badge" value={data.badgeText} onChange={(v) => onChange({ ...data, badgeText: v })} />
      <Field label="Counter Wert" value={data.counterValue} onChange={(v) => onChange({ ...data, counterValue: v })} />
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

      {renderChannelEditor('leftChannel', 'Linke Spalte (Email)')}
      {renderChannelEditor('rightChannel', 'Rechte Spalte (LinkedIn)')}
    </div>
  );
}
