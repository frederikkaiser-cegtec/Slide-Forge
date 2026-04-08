import type { PlaybookBuilderData, PlaybookStep, PlaybookStat, CompareRow } from './PlaybookBuilderGraphic';
import { CEGTEC_LIGHT_DEFAULTS } from '../../utils/cegtecTheme';

export function PlaybookBuilderForm({
  data, onChange,
}: {
  data: PlaybookBuilderData;
  onChange: (d: PlaybookBuilderData) => void;
}) {
  const set = <K extends keyof PlaybookBuilderData>(k: K, v: PlaybookBuilderData[K]) =>
    onChange({ ...data, [k]: v });

  const updateStep = (i: number, patch: Partial<PlaybookStep>) => {
    const steps = data.steps.map((s, j) => (j === i ? { ...s, ...patch } : s));
    set('steps', steps);
  };

  const updateStat = (i: number, patch: Partial<PlaybookStat>) => {
    const stats = data.stats.map((s, j) => (j === i ? { ...s, ...patch } : s));
    set('stats', stats);
  };

  const updateCompare = (i: number, patch: Partial<CompareRow>) => {
    const rows = data.compareRows.map((r, j) => (j === i ? { ...r, ...patch } : r));
    set('compareRows', rows);
  };

  const inp = 'w-full bg-muted/40 border border-border/50 rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-primary/40 transition-colors';
  const lbl = 'block text-[10px] text-text-muted/60 uppercase tracking-wider font-medium mb-1';

  return (
    <div className="space-y-4 text-sm">
      {/* Core fields */}
      <div>
        <label className={lbl}>Titel (\\n = Zeilenumbruch)</label>
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
          <label className={lbl}>Source Label</label>
          <input className={inp} value={data.sourceLabel} onChange={(e) => set('sourceLabel', e.target.value)} />
        </div>
      </div>

      {/* Stats */}
      <div>
        <label className={lbl}>Hero Stats</label>
        {data.stats.map((stat, i) => (
          <div key={i} className="flex gap-2 mb-1.5">
            <input className={`${inp} w-20`} value={stat.value} placeholder="Wert"
              onChange={(e) => updateStat(i, { value: e.target.value })} />
            <input className={`${inp} flex-1`} value={stat.label} placeholder="Label"
              onChange={(e) => updateStat(i, { label: e.target.value })} />
            <button className="text-red-400 hover:text-red-300 text-xs px-1"
              onClick={() => set('stats', data.stats.filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
        <button className="text-xs text-primary hover:underline mt-1"
          onClick={() => set('stats', [...data.stats, { value: '—', label: 'Neuer Stat' }])}>+ Stat</button>
      </div>

      {/* Steps */}
      <div>
        <label className={lbl}>Workflow Steps</label>
        {data.steps.map((step, i) => (
          <div key={i} className="border border-border/40 rounded-lg p-2 mb-2 space-y-1">
            <div className="flex gap-2">
              <input className={`${inp} flex-1`} value={step.label} placeholder="Label"
                onChange={(e) => updateStep(i, { label: e.target.value })} />
              <input className={`${inp} w-24`} value={step.duration} placeholder="Dauer"
                onChange={(e) => updateStep(i, { duration: e.target.value })} />
              <button className="text-red-400 hover:text-red-300 text-xs px-1"
                onClick={() => set('steps', data.steps.filter((_, j) => j !== i))}>×</button>
            </div>
            <input className={inp} value={step.description} placeholder="Beschreibung"
              onChange={(e) => updateStep(i, { description: e.target.value })} />
          </div>
        ))}
        <button className="text-xs text-primary hover:underline mt-1"
          onClick={() => set('steps', [...data.steps, { label: 'NEUER STEP', duration: '~X Min', description: 'Beschreibung' }])}>+ Step</button>
      </div>

      {/* Compare Rows */}
      <div>
        <label className={lbl}>Vorher / Nachher</label>
        {data.compareRows.map((row, i) => (
          <div key={i} className="border border-border/40 rounded-lg p-2 mb-2 space-y-1">
            <div className="flex gap-2">
              <input className={`${inp} w-24`} value={row.label} placeholder="Label"
                onChange={(e) => updateCompare(i, { label: e.target.value })} />
              <button className="text-red-400 hover:text-red-300 text-xs px-1"
                onClick={() => set('compareRows', data.compareRows.filter((_, j) => j !== i))}>×</button>
            </div>
            <input className={inp} value={row.before} placeholder="Vorher"
              onChange={(e) => updateCompare(i, { before: e.target.value })} />
            <input className={inp} value={row.after} placeholder="Nachher"
              onChange={(e) => updateCompare(i, { after: e.target.value })} />
          </div>
        ))}
        <button className="text-xs text-primary hover:underline mt-1"
          onClick={() => set('compareRows', [...data.compareRows, { label: 'Neu', before: 'Vorher', after: 'Nachher' }])}>+ Zeile</button>
      </div>

      {/* Result */}
      <div>
        <label className={lbl}>Result Banner</label>
        <input className={inp} value={data.resultMetrics} onChange={(e) => set('resultMetrics', e.target.value)} />
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
