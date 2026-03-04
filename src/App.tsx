import { useState, useRef } from 'react';
import { Download, Image, BarChart3, Trophy } from 'lucide-react';
import html2canvas from 'html2canvas';
import { CaseStudyGraphic } from './components/graphics/CaseStudyGraphic';
import { RoiGraphic } from './components/graphics/RoiGraphic';
import { KpiBannerGraphic } from './components/graphics/KpiBannerGraphic';
import type { KpiBannerData } from './components/graphics/KpiBannerGraphic';
import { FORMAT_PRESETS } from './utils/formats';
import type { ChartConfig, ChartType, ChartDataPoint } from './types/charts';
import { LOGO_URL } from './utils/assets';

type GraphicType = 'case-study' | 'roi' | 'kpi-banner';

export interface CaseStudyData {
  companyName: string;
  industry: string;
  headline: string;
  metricValue: string;
  metricLabel: string;
  metric2Value: string;
  metric2Label: string;
  metric3Value: string;
  metric3Label: string;
  quote: string;
  chart: ChartConfig;
}

export interface RoiData {
  title: string;
  subtitle: string;
  metrics: { value: string; label: string; color: 'blue' | 'pink' }[];
  chart: ChartConfig;
}

const defaultCaseStudy: CaseStudyData = {
  companyName: 'Jomavis Solar',
  industry: 'Erneuerbare Energien',
  headline: 'Wie Jomavis Solar 3x mehr Leads generiert',
  metricValue: '312%',
  metricLabel: 'Mehr qualifizierte Leads',
  metric2Value: '14 Tage',
  metric2Label: 'Time-to-First-Meeting',
  metric3Value: '67%',
  metric3Label: 'Weniger manueller Aufwand',
  quote: '"CegTec hat unseren Vertrieb komplett transformiert."',
  chart: {
    type: 'bar',
    title: 'Leads pro Monat',
    data: [
      { label: 'Jan', value: 12 },
      { label: 'Feb', value: 18 },
      { label: 'Mär', value: 31 },
      { label: 'Apr', value: 42 },
      { label: 'Mai', value: 55 },
      { label: 'Jun', value: 68 },
    ],
  },
};

const defaultRoi: RoiData = {
  title: 'ROI nach 90 Tagen',
  subtitle: 'Durchschnittliche Ergebnisse unserer Kunden',
  metrics: [
    { value: '3x', label: 'Mehr qualifizierte Leads', color: 'blue' },
    { value: '67%', label: 'Weniger manuelle Arbeit', color: 'pink' },
  ],
  chart: {
    type: 'area',
    title: 'Umsatzentwicklung (Tsd. €)',
    data: [
      { label: 'Monat 1', value: 20 },
      { label: 'Monat 2', value: 35 },
      { label: 'Monat 3', value: 52 },
      { label: 'Monat 4', value: 78 },
      { label: 'Monat 5', value: 110 },
      { label: 'Monat 6', value: 156 },
    ],
  },
};

const defaultKpiBanner: KpiBannerData = {
  title: 'Die CegTec Sales Engine in Zahlen',
  kpis: [
    { icon: '📧', value: '21.500+', label: 'E-Mails versendet', color: 'blue' },
    { icon: '👥', value: '8.400+', label: 'Leads kontaktiert', color: 'green' },
    { icon: '💬', value: '288', label: 'Qualifizierte Replies', color: 'blue' },
    { icon: '🎯', value: '50+', label: 'Generierte Opportunities', color: 'green' },
    { icon: '💰', value: '€89.600+', label: 'Pipeline-Wert', color: 'blue' },
  ],
};

function App() {
  const [graphicType, setGraphicType] = useState<GraphicType>('kpi-banner');
  const [formatId, setFormatId] = useState('banner');
  const [caseStudy, setCaseStudy] = useState<CaseStudyData>(defaultCaseStudy);
  const [roi, setRoi] = useState<RoiData>(defaultRoi);
  const [kpiBanner, setKpiBanner] = useState<KpiBannerData>(defaultKpiBanner);
  const graphicRef = useRef<HTMLDivElement>(null);

  const format = FORMAT_PRESETS.find((f) => f.id === formatId) ?? FORMAT_PRESETS[0];

  const handleExport = async (type: 'png' | 'jpeg') => {
    if (!graphicRef.current) return;
    const canvas = await html2canvas(graphicRef.current, {
      width: format.width,
      height: format.height,
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });
    const link = document.createElement('a');
    link.download = `cegtec-${graphicType}-${format.id}.${type === 'jpeg' ? 'jpg' : 'png'}`;
    link.href = canvas.toDataURL(`image/${type}`, 0.95);
    link.click();
  };

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-80 bg-surface border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <img src={LOGO_URL} alt="CegTec" className="h-6" />
            <span className="text-xs text-text-muted">Grafik-Generator</span>
          </div>

          <div className="flex gap-1 mb-4 flex-wrap">
            {([
              { id: 'case-study' as const, label: 'Case Study', icon: Image },
              { id: 'roi' as const, label: 'ROI', icon: BarChart3 },
              { id: 'kpi-banner' as const, label: 'KPI Banner', icon: Trophy },
            ]).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setGraphicType(id);
                  if (id === 'kpi-banner') setFormatId('banner');
                  else if (formatId === 'banner' || formatId === 'banner-wide') setFormatId('linkedin');
                }}
                className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                  graphicType === id ? 'bg-primary text-white' : 'bg-surface-hover text-text-muted hover:text-text'
                }`}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>

          <label className="text-xs text-text-muted block mb-1">Format</label>
          <select
            value={formatId}
            onChange={(e) => setFormatId(e.target.value)}
            className="w-full bg-surface-hover border border-border rounded-lg px-3 py-2 text-sm text-text outline-none"
          >
            {FORMAT_PRESETS.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          {graphicType === 'case-study' ? (
            <CaseStudyForm data={caseStudy} onChange={setCaseStudy} />
          ) : graphicType === 'roi' ? (
            <RoiForm data={roi} onChange={setRoi} />
          ) : (
            <KpiBannerForm data={kpiBanner} onChange={setKpiBanner} />
          )}
        </div>

        <div className="p-4 border-t border-border flex gap-2">
          <button
            onClick={() => handleExport('png')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm rounded-lg font-medium transition-colors"
          >
            <Download size={14} /> PNG
          </button>
          <button
            onClick={() => handleExport('jpeg')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-hover hover:bg-border text-text text-sm rounded-lg font-medium transition-colors"
          >
            <Download size={14} /> JPG
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 flex items-center justify-center bg-bg p-8 overflow-auto">
        <div
          ref={graphicRef}
          style={{
            width: format.width, height: format.height,
            transform: `scale(${getPreviewScale(format.width, format.height)})`,
            transformOrigin: 'center center',
          }}
        >
          {graphicType === 'case-study' ? (
            <CaseStudyGraphic data={caseStudy} width={format.width} height={format.height} />
          ) : graphicType === 'roi' ? (
            <RoiGraphic data={roi} width={format.width} height={format.height} />
          ) : (
            <KpiBannerGraphic data={kpiBanner} width={format.width} height={format.height} />
          )}
        </div>
      </div>
    </div>
  );
}

function getPreviewScale(w: number, h: number): number {
  const maxW = window.innerWidth - 380;
  const maxH = window.innerHeight - 80;
  return Math.min(maxW / w, maxH / h, 1);
}

/* ---- KPI Banner Form ---- */

function KpiBannerForm({ data, onChange }: { data: KpiBannerData; onChange: (d: KpiBannerData) => void }) {
  const updateKpi = (i: number, key: string, val: string) => {
    const kpis = [...data.kpis];
    kpis[i] = { ...kpis[i], [key]: val };
    onChange({ ...data, kpis });
  };

  const addKpi = () => {
    if (data.kpis.length >= 7) return;
    onChange({ ...data, kpis: [...data.kpis, { icon: '📊', value: '0', label: 'Neue KPI', color: 'blue' }] });
  };

  const removeKpi = (i: number) => {
    onChange({ ...data, kpis: data.kpis.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-3">
      <Field label="Titel" value={data.title} onChange={(v) => onChange({ ...data, title: v })} />

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">KPIs</span>
        <button onClick={addKpi} className="text-xs text-primary hover:text-primary-hover">+ Hinzufügen</button>
      </div>

      {data.kpis.map((kpi, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex gap-2 items-end">
            <div className="w-14">
              <Field label="Icon" value={kpi.icon} onChange={(v) => updateKpi(i, 'icon', v)} />
            </div>
            <div className="flex-1">
              <Field label="Wert" value={kpi.value} onChange={(v) => updateKpi(i, 'value', v)} />
            </div>
            <button
              onClick={() => updateKpi(i, 'color', kpi.color === 'blue' ? 'green' : 'blue')}
              className={`w-6 h-6 rounded-full mb-0.5 shrink-0 ${kpi.color === 'blue' ? 'bg-[#3B82F6]' : 'bg-[#10B981]'}`}
              title="Farbe wechseln"
            />
            {data.kpis.length > 1 && (
              <button onClick={() => removeKpi(i)} className="text-danger text-xs mb-1 shrink-0">✕</button>
            )}
          </div>
          <Field label="Label" value={kpi.label} onChange={(v) => updateKpi(i, 'label', v)} />
        </div>
      ))}
    </div>
  );
}

/* ---- Chart Form ---- */

const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: 'none', label: 'Kein Diagramm' },
  { value: 'bar', label: 'Balken' },
  { value: 'line', label: 'Linie' },
  { value: 'area', label: 'Fläche' },
  { value: 'donut', label: 'Donut' },
];

function ChartForm({ chart, onChange }: { chart: ChartConfig; onChange: (c: ChartConfig) => void }) {
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

/* ---- Case Study Form ---- */

function CaseStudyForm({ data, onChange }: { data: CaseStudyData; onChange: (d: CaseStudyData) => void }) {
  const update = (key: keyof CaseStudyData, value: string) => onChange({ ...data, [key]: value });
  return (
    <div className="space-y-3">
      <Field label="Unternehmen" value={data.companyName} onChange={(v) => update('companyName', v)} />
      <Field label="Branche" value={data.industry} onChange={(v) => update('industry', v)} />
      <Field label="Headline" value={data.headline} onChange={(v) => update('headline', v)} textarea />
      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Metriken</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Wert 1 (Hero)" value={data.metricValue} onChange={(v) => update('metricValue', v)} />
        <Field label="Label 1" value={data.metricLabel} onChange={(v) => update('metricLabel', v)} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Wert 2" value={data.metric2Value} onChange={(v) => update('metric2Value', v)} />
        <Field label="Label 2" value={data.metric2Label} onChange={(v) => update('metric2Label', v)} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Wert 3" value={data.metric3Value} onChange={(v) => update('metric3Value', v)} />
        <Field label="Label 3" value={data.metric3Label} onChange={(v) => update('metric3Label', v)} />
      </div>
      <Field label="Zitat" value={data.quote} onChange={(v) => update('quote', v)} textarea />
      <ChartForm chart={data.chart} onChange={(chart) => onChange({ ...data, chart })} />
    </div>
  );
}

/* ---- ROI Form ---- */

function RoiForm({ data, onChange }: { data: RoiData; onChange: (d: RoiData) => void }) {
  const updateMetric = (i: number, key: 'value' | 'label' | 'color', val: string) => {
    const metrics = [...data.metrics];
    metrics[i] = { ...metrics[i], [key]: val };
    onChange({ ...data, metrics });
  };
  const addMetric = () => {
    if (data.metrics.length >= 6) return;
    onChange({ ...data, metrics: [...data.metrics, { value: '0', label: 'Neue Metrik', color: 'blue' }] });
  };
  const removeMetric = (i: number) => {
    onChange({ ...data, metrics: data.metrics.filter((_, idx) => idx !== i) });
  };
  return (
    <div className="space-y-3">
      <Field label="Titel" value={data.title} onChange={(v) => onChange({ ...data, title: v })} />
      <Field label="Untertitel" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} />
      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Metriken</span>
        <button onClick={addMetric} className="text-xs text-primary hover:text-primary-hover">+ Hinzufügen</button>
      </div>
      {data.metrics.map((m, i) => (
        <div key={i} className="flex gap-2 items-end">
          <div className="flex-1">
            <Field label={`Wert ${i + 1}`} value={m.value} onChange={(v) => updateMetric(i, 'value', v)} />
          </div>
          <div className="flex-1">
            <Field label={`Label ${i + 1}`} value={m.label} onChange={(v) => updateMetric(i, 'label', v)} />
          </div>
          <button
            onClick={() => updateMetric(i, 'color', m.color === 'blue' ? 'pink' : 'blue')}
            className={`w-6 h-6 rounded-full mb-0.5 shrink-0 ${m.color === 'blue' ? 'bg-[#3B4BF9]' : 'bg-[#E93BCD]'}`}
            title="Farbe wechseln"
          />
          {data.metrics.length > 1 && (
            <button onClick={() => removeMetric(i)} className="text-danger text-xs mb-1 shrink-0">✕</button>
          )}
        </div>
      ))}
      <ChartForm chart={data.chart} onChange={(chart) => onChange({ ...data, chart })} />
    </div>
  );
}

/* ---- Field ---- */

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  const cls = "w-full bg-surface-hover border border-border rounded-lg px-3 py-1.5 text-sm text-text outline-none focus:border-primary transition-colors";
  return (
    <div>
      <label className="text-xs text-text-muted block mb-0.5">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} className={cls + " resize-none h-16"} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </div>
  );
}

export default App;
