import { Field, ColorRow } from '../forms';
import type { PromptCardData } from './PromptCardGraphic';

export function PromptCardForm({ data, onChange }: { data: PromptCardData; onChange: (d: PromptCardData) => void }) {
  return (
    <div className="space-y-3">
      <Field label="App-Name + Version" value={data.topLabel} onChange={(v) => onChange({ ...data, topLabel: v })} />
      <Field label="Workspace-Pfad" value={data.headline} onChange={(v) => onChange({ ...data, headline: v })} />
      <Field label="Model / Mode" value={data.subline} onChange={(v) => onChange({ ...data, subline: v })} />
      <Field label="User-Prompt (&gt; ...)" value={data.userPrompt} onChange={(v) => onChange({ ...data, userPrompt: v })} textarea />
      <Field label="Output / Prompt-Body" value={data.promptText} onChange={(v) => onChange({ ...data, promptText: v })} textarea />
      <Field label="Status-Zeile" value={data.bottomLine} onChange={(v) => onChange({ ...data, bottomLine: v })} />
      <Field label="Meta-Label (rechts oben)" value={data.metaLabel || ''} onChange={(v) => onChange({ ...data, metaLabel: v })} />

      <div>
        <label className="text-xs text-text-muted">Prompt-Schriftgröße: {data.promptFontSize || 42}px</label>
        <input type="range" min={24} max={48} value={data.promptFontSize || 42}
          onChange={(e) => onChange({ ...data, promptFontSize: +e.target.value })}
          className="w-full accent-primary" />
      </div>

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben</span>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#1A1815" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Textfarbe" value={data.textColor} defaultValue="#E8E6E3" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Gedimmt" value={data.labelColor} defaultValue="#8A8278" onChange={(v) => onChange({ ...data, labelColor: v })} />
      <ColorRow label="Brand-Akzent" value={data.filledColor} defaultValue="#D97757" onChange={(v) => onChange({ ...data, filledColor: v })} />
      <ColorRow label="Rahmen" value={data.borderColor} defaultValue="#2E2A26" onChange={(v) => onChange({ ...data, borderColor: v })} />
      <ColorRow label="Cyan (Version/Params)" value={data.warningColor} defaultValue="#5EC5D1" onChange={(v) => onChange({ ...data, warningColor: v })} />
    </div>
  );
}
