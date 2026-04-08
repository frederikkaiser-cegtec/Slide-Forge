import type {
  LinkedInOutreachData, OutreachProblem, OutreachTouch, OutreachKpi, OutreachStep,
} from './LinkedInOutreachGraphic';
import { CEGTEC_LIGHT_DEFAULTS } from '../../utils/cegtecTheme';

export function LinkedInOutreachForm({
  data, onChange,
}: {
  data: LinkedInOutreachData;
  onChange: (d: LinkedInOutreachData) => void;
}) {
  const set = <K extends keyof LinkedInOutreachData>(k: K, v: LinkedInOutreachData[K]) =>
    onChange({ ...data, [k]: v });

  const inp = 'w-full bg-muted/40 border border-border/50 rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-primary/40 transition-colors';
  const lbl = 'block text-[10px] text-text-muted/60 uppercase tracking-wider font-medium mb-1';

  return (
    <div className="space-y-4 text-sm">
      {/* Header */}
      <div>
        <label className={lbl}>Titel (\n = Zeilenumbruch)</label>
        <textarea rows={2} className={inp} value={data.title} onChange={(e) => set('title', e.target.value)} />
      </div>
      <div>
        <label className={lbl}>Subtitle</label>
        <input className={inp} value={data.subtitle} onChange={(e) => set('subtitle', e.target.value)} />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className={lbl}>Badge</label>
          <input className={inp} value={data.badgeText} onChange={(e) => set('badgeText', e.target.value)} />
        </div>
        <div className="flex-1">
          <label className={lbl}>Source</label>
          <input className={inp} value={data.sourceLabel} onChange={(e) => set('sourceLabel', e.target.value)} />
        </div>
      </div>

      {/* Problems */}
      <div>
        <label className={lbl}>Probleme</label>
        {data.problems.map((p, i) => (
          <div key={i} className="flex gap-2 mb-1.5">
            <input className={`${inp} w-12`} value={p.icon} onChange={(e) => set('problems', data.problems.map((x, j) => j === i ? { ...x, icon: e.target.value } : x))} />
            <input className={`${inp} flex-1`} value={p.text} onChange={(e) => set('problems', data.problems.map((x, j) => j === i ? { ...x, text: e.target.value } : x))} />
            <button className="text-red-400 hover:text-red-300 text-xs px-1"
              onClick={() => set('problems', data.problems.filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
        <button className="text-xs text-primary hover:underline"
          onClick={() => set('problems', [...data.problems, { icon: '❌', text: 'Neues Problem' }])}>+ Problem</button>
      </div>

      {/* Method Steps */}
      <div>
        <label className={lbl}>Methode Steps</label>
        {data.steps.map((step, i) => (
          <div key={i} className="border border-border/40 rounded-lg p-2 mb-2 space-y-1">
            <div className="flex gap-2">
              <input className={`${inp} w-24`} value={step.label} placeholder="Label"
                onChange={(e) => set('steps', data.steps.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} />
              <button className="text-red-400 hover:text-red-300 text-xs px-1"
                onClick={() => set('steps', data.steps.filter((_, j) => j !== i))}>×</button>
            </div>
            <input className={inp} value={step.desc} placeholder="Beschreibung"
              onChange={(e) => set('steps', data.steps.map((x, j) => j === i ? { ...x, desc: e.target.value } : x))} />
          </div>
        ))}
        <button className="text-xs text-primary hover:underline"
          onClick={() => set('steps', [...data.steps, { label: 'NEU', desc: 'Beschreibung' }])}>+ Step</button>
      </div>

      {/* Engager Stat */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className={lbl}>Engager Stat</label>
          <input className={inp} value={data.engagerStat} onChange={(e) => set('engagerStat', e.target.value)} />
        </div>
        <div className="flex-1">
          <label className={lbl}>Stat Label</label>
          <input className={inp} value={data.engagerStatLabel} onChange={(e) => set('engagerStatLabel', e.target.value)} />
        </div>
      </div>

      {/* Touchpoints */}
      <div>
        <label className={lbl}>Touchpoints</label>
        {data.touches.map((t, i) => (
          <div key={i} className="border border-border/40 rounded-lg p-2 mb-2 space-y-1">
            <div className="flex gap-2">
              <input className={`${inp} w-24`} value={t.name} placeholder="Name"
                onChange={(e) => set('touches', data.touches.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
              <input className={`${inp} w-20`} value={t.timing} placeholder="Timing"
                onChange={(e) => set('touches', data.touches.map((x, j) => j === i ? { ...x, timing: e.target.value } : x))} />
              <input className={`${inp} w-16`} value={t.chars} placeholder="Max"
                onChange={(e) => set('touches', data.touches.map((x, j) => j === i ? { ...x, chars: e.target.value } : x))} />
            </div>
            <input className={inp} value={t.schema} placeholder="Schema"
              onChange={(e) => set('touches', data.touches.map((x, j) => j === i ? { ...x, schema: e.target.value } : x))} />
          </div>
        ))}
      </div>

      {/* KPIs */}
      <div>
        <label className={lbl}>KPIs</label>
        {data.kpis.map((k, i) => (
          <div key={i} className="flex gap-2 mb-1.5">
            <input className={`${inp} flex-1`} value={k.metric} placeholder="Metrik"
              onChange={(e) => set('kpis', data.kpis.map((x, j) => j === i ? { ...x, metric: e.target.value } : x))} />
            <input className={`${inp} w-20`} value={k.target} placeholder="Ziel"
              onChange={(e) => set('kpis', data.kpis.map((x, j) => j === i ? { ...x, target: e.target.value } : x))} />
          </div>
        ))}
      </div>

      {/* Result */}
      <div>
        <label className={lbl}>Result (· getrennt)</label>
        <input className={inp} value={data.resultText} onChange={(e) => set('resultText', e.target.value)} />
      </div>
      <div>
        <label className={lbl}>Result Source</label>
        <input className={inp} value={data.resultSource} onChange={(e) => set('resultSource', e.target.value)} />
      </div>

      {/* Colors */}
      <details className="border border-border/30 rounded-lg p-2">
        <summary className="text-[10px] text-text-muted/50 uppercase tracking-wider cursor-pointer">Farben</summary>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {([
            ['backgroundColor', 'Hintergrund'],
            ['textColor', 'Titel'],
            ['labelColor', 'Label'],
            ['filledColor', 'Akzent'],
            ['borderColor', 'Border'],
          ] as const).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <input type="color" value={(data as any)[key] || CEGTEC_LIGHT_DEFAULTS[key as keyof typeof CEGTEC_LIGHT_DEFAULTS] || '#000000'}
                onChange={(e) => set(key as any, e.target.value)}
                className="w-6 h-6 rounded border border-border/50 cursor-pointer" />
              <span className="text-[10px] text-text-muted">{label}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
