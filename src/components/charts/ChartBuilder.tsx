import { useState, useMemo, useCallback } from 'react';
import { BarChart2, TrendingUp, Activity, PieChart, Plus, X, Copy, ArrowRight, AlignLeft } from 'lucide-react';
import { type ChartConfig, type ChartSeries, generateSvg } from './chartUtils';

const PALETTE = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6', '#14b8a6'];

const DEFAULT_STYLE: ChartConfig['style'] = {
  backgroundColor: '#0f1117',
  gridColor: '#334155',
  textColor: '#94a3b8',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 11,
  showGrid: true,
  showLegend: true,
  showValues: false,
  barRadius: 4,
  padding: 10,
};

const PRESETS: Array<{ label: string; config: Omit<ChartConfig, 'style' | 'width' | 'height'> }> = [
  {
    label: 'Reply Rate',
    config: {
      type: 'line',
      xLabels: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun'],
      series: [
        { name: 'Email', values: [8, 10, 12, 11, 14, 16], color: '#6366f1' },
        { name: 'LinkedIn', values: [18, 22, 20, 25, 28, 30], color: '#22d3ee' },
      ],
    },
  },
  {
    label: 'Pipeline',
    config: {
      type: 'bar',
      xLabels: ['Kontaktiert', 'Antwort', 'Interesse', 'Demo', 'Deal'],
      series: [{ name: 'Pipeline', values: [500, 85, 42, 20, 8], color: '#6366f1' }],
    },
  },
  {
    label: 'Channel-Mix',
    config: {
      type: 'pie',
      xLabels: ['Anteil'],
      series: [
        { name: 'Email', values: [45], color: '#6366f1' },
        { name: 'LinkedIn', values: [40], color: '#22d3ee' },
        { name: 'Telefon', values: [15], color: '#f59e0b' },
      ],
    },
  },
];

const CHART_TYPES: Array<{ id: ChartConfig['type']; label: string; Icon: React.FC<{ size?: number; strokeWidth?: number }> }> = [
  { id: 'bar', label: 'Bar', Icon: BarChart2 },
  { id: 'bar-h', label: 'Bar H', Icon: AlignLeft },
  { id: 'line', label: 'Linie', Icon: TrendingUp },
  { id: 'area', label: 'Area', Icon: Activity },
  { id: 'pie', label: 'Pie', Icon: PieChart },
];

const FONT_OPTIONS = [
  'Inter, system-ui, sans-serif',
  'Plus Jakarta Sans, sans-serif',
  'DM Sans, sans-serif',
  'Georgia, serif',
  'monospace',
];

function makeDefaultConfig(): ChartConfig {
  return {
    ...PRESETS[0].config,
    style: { ...DEFAULT_STYLE },
    width: 800,
    height: 500,
  };
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer select-none">
      <span className="text-[11px] text-text-muted">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-8 h-4 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-muted'}`}
      >
        <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </button>
    </label>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] text-text-muted/60 uppercase tracking-wider font-medium mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {children}
    </p>
  );
}

export function ChartBuilder() {
  const [config, setConfig] = useState<ChartConfig>(makeDefaultConfig);
  const [csvText, setCsvText] = useState('');

  const patch = useCallback((p: Partial<ChartConfig>) => setConfig((c) => ({ ...c, ...p })), []);
  const patchStyle = useCallback(
    (p: Partial<ChartConfig['style']>) => setConfig((c) => ({ ...c, style: { ...c.style, ...p } })),
    [],
  );

  const svgString = useMemo(() => {
    try { return generateSvg(config); } catch { return ''; }
  }, [config]);

  const previewScale = Math.min(
    Math.max(0.1, (window.innerWidth - 600) / config.width),
    Math.max(0.1, (window.innerHeight - 80) / config.height),
    1,
  );

  // ── Series ops ────────────────────────────────────────────────
  const addSeries = useCallback(() => {
    setConfig((c) => ({
      ...c,
      series: [
        ...c.series,
        {
          name: `Serie ${c.series.length + 1}`,
          values: Array<number>(c.xLabels.length).fill(0),
          color: PALETTE[c.series.length % PALETTE.length],
        },
      ],
    }));
  }, []);

  const removeSeries = useCallback((si: number) => {
    setConfig((c) => ({ ...c, series: c.series.filter((_, i) => i !== si) }));
  }, []);

  const updateSeries = useCallback((si: number, patch: Partial<ChartSeries>) => {
    setConfig((c) => ({
      ...c,
      series: c.series.map((s, i) => (i === si ? { ...s, ...patch } : s)),
    }));
  }, []);

  const setSeriesValue = useCallback((si: number, ri: number, val: number) => {
    setConfig((c) => ({
      ...c,
      series: c.series.map((s, i) => {
        if (i !== si) return s;
        const values = [...s.values];
        values[ri] = val;
        return { ...s, values };
      }),
    }));
  }, []);

  // ── Row ops ───────────────────────────────────────────────────
  const addRow = useCallback(() => {
    setConfig((c) => ({
      ...c,
      xLabels: [...c.xLabels, `Label ${c.xLabels.length + 1}`],
      series: c.series.map((s) => ({ ...s, values: [...s.values, 0] })),
    }));
  }, []);

  const removeRow = useCallback((ri: number) => {
    setConfig((c) => ({
      ...c,
      xLabels: c.xLabels.filter((_, i) => i !== ri),
      series: c.series.map((s) => ({ ...s, values: s.values.filter((_, i) => i !== ri) })),
    }));
  }, []);

  const setLabel = useCallback((ri: number, val: string) => {
    setConfig((c) => {
      const xLabels = [...c.xLabels];
      xLabels[ri] = val;
      return { ...c, xLabels };
    });
  }, []);

  // ── CSV parse ─────────────────────────────────────────────────
  const parseCSV = useCallback(() => {
    const rows = csvText.trim().split('\n').map((r) => r.split(/[,\t]/));
    if (rows.length < 2) return;
    const headers = rows[0].slice(1).map((h) => h.trim());
    const xLabels = rows.slice(1).map((r) => r[0]?.trim() ?? '');
    const newSeries = headers.map((h, si) => ({
      name: h,
      values: rows.slice(1).map((r) => parseFloat(r[si + 1] ?? '') || 0),
      color: config.series[si]?.color ?? PALETTE[si % PALETTE.length],
    }));
    patch({ xLabels, series: newSeries });
    setCsvText('');
  }, [csvText, config.series, patch]);

  const handleInsert = useCallback(() => {
    if (!svgString) return;
    window.dispatchEvent(new CustomEvent('sf:insert-svg', { detail: svgString }));
  }, [svgString]);

  const handleCopy = useCallback(() => {
    if (svgString) navigator.clipboard.writeText(svgString);
  }, [svgString]);

  const isPie = config.type === 'pie';
  const isBar = config.type === 'bar' || config.type === 'bar-h';

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* ── Left panel ─────────────────────────────────────────── */}
      <div className="w-[280px] bg-surface border-r border-border/60 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-3 space-y-4">
          {/* Presets */}
          <div>
            <SectionLabel>Presets</SectionLabel>
            <div className="flex gap-1 flex-wrap">
              {PRESETS.map((pr) => (
                <button
                  key={pr.label}
                  onClick={() => patch({ ...pr.config })}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-muted/60 text-text-muted hover:text-text hover:bg-muted transition-colors"
                >
                  {pr.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chart type */}
          <div>
            <SectionLabel>Typ</SectionLabel>
            <div className="flex gap-1 flex-wrap">
              {CHART_TYPES.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => patch({ type: id })}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                    config.type === id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-muted/60 text-text-muted hover:text-text hover:bg-muted'
                  }`}
                >
                  <Icon size={11} strokeWidth={config.type === id ? 2 : 1.5} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Data table */}
          <div>
            <SectionLabel>Daten</SectionLabel>
            <div className="overflow-x-auto">
              <table className="text-xs w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left pb-1 pr-1 w-20">
                      <span className="text-[10px] text-text-muted/50 font-medium">Label</span>
                    </th>
                    {config.series.map((s, si) => (
                      <th key={si} className="text-left pb-1 pr-1">
                        <div className="flex items-center gap-0.5">
                          <input
                            value={s.name}
                            onChange={(e) => updateSeries(si, { name: e.target.value })}
                            className="w-16 bg-muted/40 border border-border/40 rounded px-1 py-0.5 text-[10px] text-text-muted outline-none focus:border-primary/50 focus:text-text"
                          />
                          {config.series.length > 1 && (
                            <button onClick={() => removeSeries(si)} className="text-text-muted/30 hover:text-red-400 transition-colors shrink-0">
                              <X size={9} />
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="pb-1">
                      <button onClick={addSeries} title="Serie hinzufügen" className="text-text-muted/40 hover:text-primary transition-colors">
                        <Plus size={11} />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {config.xLabels.map((label, ri) => (
                    <tr key={ri}>
                      <td className="pr-1 pb-1">
                        <input
                          value={label}
                          onChange={(e) => setLabel(ri, e.target.value)}
                          className="w-full bg-muted/40 border border-border/40 rounded px-1.5 py-0.5 text-[11px] text-text outline-none focus:border-primary/50"
                        />
                      </td>
                      {config.series.map((s, si) => (
                        <td key={si} className="pb-1 pr-1">
                          <input
                            type="number"
                            value={s.values[ri] ?? 0}
                            onChange={(e) => setSeriesValue(si, ri, parseFloat(e.target.value) || 0)}
                            className="w-16 bg-muted/40 border border-border/40 rounded px-1.5 py-0.5 text-[11px] text-text outline-none focus:border-primary/50"
                          />
                        </td>
                      ))}
                      <td className="pb-1">
                        {config.xLabels.length > 1 && (
                          <button onClick={() => removeRow(ri)} className="text-text-muted/30 hover:text-red-400 transition-colors">
                            <X size={9} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={addRow}
                className="mt-1 flex items-center gap-1 text-[11px] text-text-muted/60 hover:text-text transition-colors"
              >
                <Plus size={11} /> Zeile
              </button>
            </div>
          </div>

          {/* CSV import */}
          <div>
            <SectionLabel>CSV Import</SectionLabel>
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder={"Label,Serie1,Serie2\nJan,8,18\nFeb,10,22"}
              rows={4}
              className="w-full bg-muted/40 border border-border/40 rounded-lg px-2.5 py-2 text-[10px] text-text font-mono outline-none focus:border-primary/50 resize-none placeholder:text-text-muted/40"
            />
            <button
              onClick={parseCSV}
              disabled={!csvText.trim()}
              className="mt-1.5 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-muted/60 text-text-muted hover:text-text hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight size={11} /> Importieren
            </button>
          </div>

          {/* Dimensions */}
          <div>
            <SectionLabel>Größe</SectionLabel>
            <div className="flex gap-2">
              <label className="flex-1">
                <span className="text-[10px] text-text-muted/60 block mb-1">Breite</span>
                <input
                  type="number"
                  value={config.width}
                  min={200}
                  max={2000}
                  step={10}
                  onChange={(e) => patch({ width: Math.max(200, parseInt(e.target.value) || 800) })}
                  className="w-full bg-muted/40 border border-border/40 rounded px-2 py-1.5 text-xs text-text outline-none focus:border-primary/50"
                />
              </label>
              <label className="flex-1">
                <span className="text-[10px] text-text-muted/60 block mb-1">Höhe</span>
                <input
                  type="number"
                  value={config.height}
                  min={150}
                  max={1500}
                  step={10}
                  onChange={(e) => patch({ height: Math.max(150, parseInt(e.target.value) || 500) })}
                  className="w-full bg-muted/40 border border-border/40 rounded px-2 py-1.5 text-xs text-text outline-none focus:border-primary/50"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ── Center preview ──────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-bg overflow-hidden p-6">
        {svgString ? (
          <div
            style={{ transform: `scale(${previewScale})`, transformOrigin: 'center center' }}
            dangerouslySetInnerHTML={{ __html: svgString }}
          />
        ) : (
          <p className="text-text-muted/40 text-sm">Kein Chart</p>
        )}
      </div>

      {/* ── Right panel ─────────────────────────────────────────── */}
      <div className="w-[260px] bg-surface border-l border-border/60 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-3 space-y-4 flex-1">
          {/* Series colors */}
          <div>
            <SectionLabel>Serien</SectionLabel>
            <div className="space-y-1.5">
              {config.series.map((s, si) => (
                <div key={si} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={s.color}
                    onChange={(e) => updateSeries(si, { color: e.target.value })}
                    className="w-6 h-6 rounded border border-border/40 cursor-pointer bg-transparent p-0"
                  />
                  <input
                    value={s.name}
                    onChange={(e) => updateSeries(si, { name: e.target.value })}
                    className="flex-1 bg-muted/40 border border-border/40 rounded px-2 py-1 text-xs text-text outline-none focus:border-primary/50"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Background */}
          <div>
            <SectionLabel>Hintergrund</SectionLabel>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.style.backgroundColor}
                onChange={(e) => patchStyle({ backgroundColor: e.target.value })}
                className="w-6 h-6 rounded border border-border/40 cursor-pointer bg-transparent p-0"
              />
              <input
                value={config.style.backgroundColor}
                onChange={(e) => patchStyle({ backgroundColor: e.target.value })}
                className="flex-1 bg-muted/40 border border-border/40 rounded px-2 py-1 text-xs text-text font-mono outline-none focus:border-primary/50"
              />
            </div>
          </div>

          {/* Grid & text colors */}
          <div>
            <SectionLabel>Farben</SectionLabel>
            <div className="space-y-1.5">
              {(
                [
                  { label: 'Grid', key: 'gridColor' },
                  { label: 'Text', key: 'textColor' },
                ] as const
              ).map(({ label, key }) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.style[key]}
                    onChange={(e) => patchStyle({ [key]: e.target.value })}
                    className="w-6 h-6 rounded border border-border/40 cursor-pointer bg-transparent p-0"
                  />
                  <span className="text-[11px] text-text-muted w-8 shrink-0">{label}</span>
                  <input
                    value={config.style[key]}
                    onChange={(e) => patchStyle({ [key]: e.target.value })}
                    className="flex-1 bg-muted/40 border border-border/40 rounded px-2 py-1 text-xs text-text font-mono outline-none focus:border-primary/50"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Font */}
          <div>
            <SectionLabel>Schrift</SectionLabel>
            <select
              value={config.style.fontFamily}
              onChange={(e) => patchStyle({ fontFamily: e.target.value })}
              className="w-full bg-muted/40 border border-border/50 rounded-lg px-2.5 py-1.5 text-xs text-text outline-none focus:border-primary/40"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f} value={f}>{f.split(',')[0]}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-text-muted/60 shrink-0">Größe</span>
              <input
                type="range"
                min={8}
                max={18}
                value={config.style.fontSize}
                onChange={(e) => patchStyle({ fontSize: parseInt(e.target.value) })}
                className="flex-1 h-1 accent-primary"
              />
              <span className="text-[11px] text-text-muted w-6 text-right">{config.style.fontSize}</span>
            </div>
          </div>

          {/* Toggles */}
          <div>
            <SectionLabel>Optionen</SectionLabel>
            <div className="space-y-2">
              <Toggle label="Grid" value={config.style.showGrid} onChange={(v) => patchStyle({ showGrid: v })} />
              <Toggle label="Legende" value={config.style.showLegend} onChange={(v) => patchStyle({ showLegend: v })} />
              <Toggle label="Werte anzeigen" value={config.style.showValues} onChange={(v) => patchStyle({ showValues: v })} />
            </div>
          </div>

          {/* Bar radius — only for bar types */}
          {isBar && (
            <div>
              <SectionLabel>Bar Radius</SectionLabel>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={config.style.barRadius}
                  onChange={(e) => patchStyle({ barRadius: parseInt(e.target.value) })}
                  className="flex-1 h-1 accent-primary"
                />
                <span className="text-[11px] text-text-muted w-6 text-right">{config.style.barRadius}</span>
              </div>
            </div>
          )}

          {/* Padding */}
          {!isPie && (
            <div>
              <SectionLabel>Padding</SectionLabel>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={config.style.padding}
                  onChange={(e) => patchStyle({ padding: parseInt(e.target.value) })}
                  className="flex-1 h-1 accent-primary"
                />
                <span className="text-[11px] text-text-muted w-6 text-right">{config.style.padding}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Action buttons ──────────────────────────────────────── */}
        <div className="p-3 border-t border-border/40 space-y-2 shrink-0">
          <button
            onClick={handleInsert}
            disabled={!svgString}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowRight size={14} /> Als SVG einfügen
          </button>
          <button
            onClick={handleCopy}
            disabled={!svgString}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-muted/60 hover:bg-muted text-text-muted hover:text-text text-sm rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Copy size={13} /> SVG kopieren
          </button>
        </div>
      </div>
    </div>
  );
}
