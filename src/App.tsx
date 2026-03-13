import { useState, useRef, useCallback } from 'react';
import { Download, Image, BarChart3, Trophy, Boxes, GitBranch, Palette, LayoutDashboard, Save, FolderOpen, GraduationCap, Database, DatabaseZap, ScanSearch, Mail, Radio, Layers, Bot } from 'lucide-react';
import { toPng, toJpeg } from 'html-to-image';
import { CaseStudyGraphic } from './components/graphics/CaseStudyGraphic';
import { RoiGraphic } from './components/graphics/RoiGraphic';
import { KpiBannerGraphic } from './components/graphics/KpiBannerGraphic';
import type { KpiBannerData } from './components/graphics/KpiBannerGraphic';
import { RevenueSystemsGraphic, defaultRevenueSystemsData } from './components/graphics/RevenueSystemsGraphic';
import type { RevenueSystemsData } from './components/graphics/RevenueSystemsGraphic';
import { InfographicGraphic, defaultInfographicData } from './components/graphics/InfographicGraphic';
import type { InfographicData } from './components/graphics/InfographicGraphic';
import { AcademyGraphic, defaultAcademyData } from './components/graphics/AcademyGraphic';
import type { AcademyData } from './components/graphics/AcademyGraphic';
import { RawDataGraphic, defaultRawDataData } from './components/graphics/RawDataGraphic';
import type { RawDataData } from './components/graphics/RawDataGraphic';
import { EnrichedDataGraphic, defaultEnrichedDataData } from './components/graphics/EnrichedDataGraphic';
import type { EnrichedDataData } from './components/graphics/EnrichedDataGraphic';
import { QualifiedDataGraphic, defaultQualifiedDataData } from './components/graphics/QualifiedDataGraphic';
import type { QualifiedDataData } from './components/graphics/QualifiedDataGraphic';
import { PersonalizedOutreachGraphic, defaultPersonalizedOutreachData } from './components/graphics/PersonalizedOutreachGraphic';
import type { PersonalizedOutreachData } from './components/graphics/PersonalizedOutreachGraphic';
import { MultichannelOutreachGraphic, defaultMultichannelOutreachData } from './components/graphics/MultichannelOutreachGraphic';
import type { MultichannelOutreachData } from './components/graphics/MultichannelOutreachGraphic';
import { OutboundStackGraphic, defaultOutboundStackData } from './components/graphics/OutboundStackGraphic';
import type { OutboundStackData } from './components/graphics/OutboundStackGraphic';
import { AgentFriendlyGraphic, defaultAgentFriendlyData } from './components/graphics/AgentFriendlyGraphic';
import type { AgentFriendlyData } from './components/graphics/AgentFriendlyGraphic';
import { DiagramEditor } from './components/diagram/DiagramEditor';
import { useEditorStore } from './stores/editorStore';
import { FORMAT_PRESETS } from './utils/formats';
import type { ChartConfig, ChartType, ChartDataPoint } from './types/charts';
import { LOGO_URL } from './utils/assets';
import { useSavedGraphicsStore, type SavedGraphic } from './stores/savedGraphicsStore';
import { SavedGraphicsModal } from './components/graphics/SavedGraphicsModal';
import { syncToCaseStudy, syncToRoi, syncToKpiBanner, syncToInfographic } from './utils/graphicSync';

type GraphicType = 'case-study' | 'roi' | 'kpi-banner' | 'revenue-systems' | 'infographic' | 'academy' | 'raw-data' | 'enriched-data' | 'qualified-data' | 'personalized-outreach' | 'multichannel-outreach' | 'outbound-stack' | 'agent-friendly';

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
  backgroundColor?: string;
  accentColor?: string;
  accentColor2?: string;
  textColor?: string;
  labelColor?: string;
  tagline?: string;
  footerLeft?: string;
  footerRight?: string;
  cardColor?: string;
  cardBorderColor?: string;
}

export interface RoiData {
  title: string;
  subtitle: string;
  metrics: { value: string; label: string; color: 'blue' | 'pink' }[];
  chart: ChartConfig;
  backgroundColor?: string;
  accentColor?: string;
  accentColor2?: string;
  textColor?: string;
  labelColor?: string;
  tagline?: string;
  footerLeft?: string;
  footerRight?: string;
  cardColor?: string;
  cardBorderColor?: string;
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
  title: 'CegTec Outreach Performance',
  kpis: [
    { icon: '👥', value: '1.976', label: 'Leads kontaktiert', color: 'blue' },
    { icon: '📧', value: '7.526', label: 'E-Mails versendet', color: 'green' },
    { icon: '💬', value: '118', label: 'Unique Replies', color: 'blue' },
    { icon: '📊', value: '6,0%', label: 'Reply Rate', color: 'green' },
    { icon: '🎯', value: '6', label: 'Opportunities', color: 'blue' },
    { icon: '💰', value: '€6.000', label: 'Pipeline-Wert', color: 'green' },
  ],
};

function App() {
  const { mode, setMode } = useEditorStore();
  const [graphicType, setGraphicType] = useState<GraphicType>('revenue-systems');
  const [formatId, setFormatId] = useState('og');
  const [caseStudy, setCaseStudy] = useState<CaseStudyData>(defaultCaseStudy);
  const [roi, setRoi] = useState<RoiData>(defaultRoi);
  const [kpiBanner, setKpiBanner] = useState<KpiBannerData>(defaultKpiBanner);
  const [revenueSystems, setRevenueSystems] = useState<RevenueSystemsData>(defaultRevenueSystemsData);
  const [infographic, setInfographic] = useState<InfographicData>(defaultInfographicData);
  const [academy, setAcademy] = useState<AcademyData>(defaultAcademyData);
  const [rawData, setRawData] = useState<RawDataData>(defaultRawDataData);
  const [enrichedData, setEnrichedData] = useState<EnrichedDataData>(defaultEnrichedDataData);
  const [qualifiedData, setQualifiedData] = useState<QualifiedDataData>(defaultQualifiedDataData);
  const [personalizedOutreach, setPersonalizedOutreach] = useState<PersonalizedOutreachData>(defaultPersonalizedOutreachData);
  const [multichannelOutreach, setMultichannelOutreach] = useState<MultichannelOutreachData>(defaultMultichannelOutreachData);
  const [outboundStack, setOutboundStack] = useState<OutboundStackData>(defaultOutboundStackData);
  const [agentFriendly, setAgentFriendly] = useState<AgentFriendlyData>(defaultAgentFriendlyData);
  const graphicRef = useRef<HTMLDivElement>(null);
  const [showSavedGraphics, setShowSavedGraphics] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false);

  const format = FORMAT_PRESETS.find((f) => f.id === formatId) ?? FORMAT_PRESETS[0];

  const getCurrentData = useCallback(() => {
    switch (graphicType) {
      case 'case-study': return caseStudy;
      case 'roi': return roi;
      case 'kpi-banner': return kpiBanner;
      case 'revenue-systems': return revenueSystems;
      case 'infographic': return infographic;
      case 'academy': return academy;
      case 'raw-data': return rawData;
      case 'enriched-data': return enrichedData;
      case 'qualified-data': return qualifiedData;
      case 'personalized-outreach': return personalizedOutreach;
      case 'multichannel-outreach': return multichannelOutreach;
      case 'outbound-stack': return outboundStack;
      case 'agent-friendly': return agentFriendly;
    }
  }, [graphicType, caseStudy, roi, kpiBanner, revenueSystems, infographic, academy, rawData, enrichedData, qualifiedData, personalizedOutreach, multichannelOutreach, outboundStack, agentFriendly]);

  const handleSaveGraphic = useCallback(() => {
    const name = graphicType === 'case-study' ? caseStudy.companyName
      : graphicType === 'infographic' ? infographic.companyName
      : graphicType === 'roi' ? roi.title
      : graphicType === 'kpi-banner' ? kpiBanner.title
      : graphicType === 'academy' ? academy.title
      : graphicType === 'raw-data' ? rawData.title
      : graphicType === 'enriched-data' ? enrichedData.title
      : graphicType === 'qualified-data' ? qualifiedData.title
      : graphicType === 'personalized-outreach' ? personalizedOutreach.title
      : graphicType === 'multichannel-outreach' ? multichannelOutreach.title
      : graphicType === 'outbound-stack' ? outboundStack.title
      : graphicType === 'agent-friendly' ? agentFriendly.title
      : 'Grafik';
    useSavedGraphicsStore.getState().save(name || 'Unbenannt', graphicType, getCurrentData(), formatId);
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1200);
  }, [graphicType, getCurrentData, formatId, caseStudy, infographic, roi, kpiBanner]);

  const handleLoadGraphic = useCallback((g: SavedGraphic) => {
    setGraphicType(g.type);
    setFormatId(g.formatId);
    switch (g.type) {
      case 'case-study': setCaseStudy(g.data as CaseStudyData); break;
      case 'roi': setRoi(g.data as RoiData); break;
      case 'kpi-banner': setKpiBanner(g.data as KpiBannerData); break;
      case 'revenue-systems': setRevenueSystems(g.data as RevenueSystemsData); break;
      case 'infographic': setInfographic(g.data as InfographicData); break;
      case 'academy': setAcademy(g.data as AcademyData); break;
      case 'raw-data': setRawData(g.data as RawDataData); break;
      case 'enriched-data': setEnrichedData(g.data as EnrichedDataData); break;
      case 'qualified-data': setQualifiedData(g.data as QualifiedDataData); break;
      case 'personalized-outreach': setPersonalizedOutreach(g.data as PersonalizedOutreachData); break;
      case 'multichannel-outreach': setMultichannelOutreach(g.data as MultichannelOutreachData); break;
      case 'outbound-stack': setOutboundStack(g.data as OutboundStackData); break;
      case 'agent-friendly': setAgentFriendly(g.data as AgentFriendlyData); break;
    }
  }, []);

  const handleSwitchType = useCallback((newType: GraphicType) => {
    // Auto-sync data from current type to new type
    if (newType !== graphicType && graphicType !== 'revenue-systems' && newType !== 'revenue-systems' && graphicType !== 'academy' && newType !== 'academy' && graphicType !== 'raw-data' && newType !== 'raw-data' && graphicType !== 'enriched-data' && newType !== 'enriched-data' && graphicType !== 'qualified-data' && newType !== 'qualified-data' && graphicType !== 'personalized-outreach' && newType !== 'personalized-outreach' && graphicType !== 'multichannel-outreach' && newType !== 'multichannel-outreach' && graphicType !== 'outbound-stack' && newType !== 'outbound-stack' && graphicType !== 'agent-friendly' && newType !== 'agent-friendly') {
      const data = getCurrentData();
      switch (newType) {
        case 'case-study': setCaseStudy((prev) => syncToCaseStudy(graphicType, data, prev)); break;
        case 'roi': setRoi((prev) => syncToRoi(graphicType, data, prev)); break;
        case 'kpi-banner': setKpiBanner((prev) => syncToKpiBanner(graphicType, data, prev)); break;
        case 'infographic': setInfographic((prev) => syncToInfographic(graphicType, data, prev)); break;
      }
    }

    setGraphicType(newType);
    if (newType === 'kpi-banner') setFormatId('banner');
    else if (newType === 'academy' || newType === 'outbound-stack' || newType === 'agent-friendly') setFormatId('9:16');
    else if (newType === 'raw-data' || newType === 'enriched-data' || newType === 'qualified-data' || newType === 'personalized-outreach' || newType === 'multichannel-outreach') setFormatId('16:9');
    else if (newType === 'revenue-systems' || newType === 'infographic') setFormatId('og');
    else if (formatId === 'banner' || formatId === 'banner-wide') setFormatId('linkedin');
  }, [graphicType, getCurrentData, formatId]);

  const handleExport = async (type: 'png' | 'jpeg') => {
    if (!graphicRef.current) return;
    const el = graphicRef.current;
    const prevTransform = el.style.transform;
    el.style.transform = 'none';
    const opts = {
      width: format.width,
      height: format.height,
      pixelRatio: 2,
      style: { transform: 'none', transformOrigin: '0 0' },
    };
    const dataUrl = type === 'jpeg'
      ? await toJpeg(el, { ...opts, quality: 0.95 })
      : await toPng(el, opts);
    el.style.transform = prevTransform;
    const link = document.createElement('a');
    const filename = graphicType === 'revenue-systems' ? 'cegtec-revenue-systems' : graphicType === 'infographic' ? 'cegtec-infographic' : graphicType === 'academy' ? 'cegtec-academy' : graphicType === 'raw-data' ? 'cegtec-raw-data' : graphicType === 'enriched-data' ? 'cegtec-enriched-data' : graphicType === 'qualified-data' ? 'cegtec-qualified-data' : graphicType === 'personalized-outreach' ? 'cegtec-personalized-outreach' : graphicType === 'multichannel-outreach' ? 'cegtec-multichannel-outreach' : graphicType === 'outbound-stack' ? 'cegtec-outbound-stack' : `cegtec-${graphicType}-${format.id}`;
    link.download = `${filename}.${type === 'jpeg' ? 'jpg' : 'png'}`;
    link.href = dataUrl;
    link.click();
  };

  if (mode === 'diagram') {
    return (
      <div className="h-full flex flex-col">
        {/* Mode Toggle (top bar) */}
        <div className="h-9 bg-bg border-b border-border flex items-center px-3 gap-1 shrink-0">
          <img src={LOGO_URL} alt="CegTec" className="h-4 mr-2" />
          <button
            onClick={() => setMode('graphic')}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-xs text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
          >
            <Palette size={12} /> Grafiken
          </button>
          <button
            className="flex items-center gap-1 px-2.5 py-1 rounded text-xs bg-primary text-white"
          >
            <GitBranch size={12} /> Diagramme
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <DiagramEditor />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-80 bg-surface border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <img src={LOGO_URL} alt="CegTec" className="h-5" />
            <div className="flex gap-1 ml-auto">
              <button className="flex items-center gap-1 px-2 py-1 rounded text-[10px] bg-primary text-white">
                <Palette size={10} /> Grafiken
              </button>
              <button
                onClick={() => setMode('diagram')}
                className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
              >
                <GitBranch size={10} /> Diagramme
              </button>
            </div>
          </div>

          <div className="flex gap-1 mb-4 flex-wrap">
            {([
              { id: 'case-study' as const, label: 'Case Study', icon: Image },
              { id: 'roi' as const, label: 'ROI', icon: BarChart3 },
              { id: 'kpi-banner' as const, label: 'KPI Banner', icon: Trophy },
              { id: 'revenue-systems' as const, label: 'Systems', icon: Boxes },
              { id: 'infographic' as const, label: 'Infografik', icon: LayoutDashboard },
              { id: 'academy' as const, label: 'Academy', icon: GraduationCap },
              { id: 'raw-data' as const, label: 'Raw Data', icon: Database },
              { id: 'enriched-data' as const, label: 'Enriched', icon: DatabaseZap },
              { id: 'qualified-data' as const, label: 'Qualified', icon: ScanSearch },
              { id: 'personalized-outreach' as const, label: 'Outreach', icon: Mail },
              { id: 'multichannel-outreach' as const, label: 'Multichannel', icon: Radio },
              { id: 'outbound-stack' as const, label: 'Stack', icon: Layers },
              { id: 'agent-friendly' as const, label: 'AI-Ready', icon: Bot },
            ]).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleSwitchType(id)}
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
          ) : graphicType === 'revenue-systems' ? (
            <RevenueSystemsForm data={revenueSystems} onChange={setRevenueSystems} />
          ) : graphicType === 'infographic' ? (
            <InfographicForm data={infographic} onChange={setInfographic} />
          ) : graphicType === 'academy' ? (
            <AcademyForm data={academy} onChange={setAcademy} />
          ) : graphicType === 'raw-data' ? (
            <RawDataForm data={rawData} onChange={setRawData} />
          ) : graphicType === 'enriched-data' ? (
            <EnrichedDataForm data={enrichedData} onChange={setEnrichedData} />
          ) : graphicType === 'qualified-data' ? (
            <QualifiedDataForm data={qualifiedData} onChange={setQualifiedData} />
          ) : graphicType === 'personalized-outreach' ? (
            <PersonalizedOutreachForm data={personalizedOutreach} onChange={setPersonalizedOutreach} />
          ) : graphicType === 'multichannel-outreach' ? (
            <MultichannelOutreachForm data={multichannelOutreach} onChange={setMultichannelOutreach} />
          ) : graphicType === 'outbound-stack' ? (
            <OutboundStackForm data={outboundStack} onChange={setOutboundStack} />
          ) : graphicType === 'agent-friendly' ? (
            <AgentFriendlyForm data={agentFriendly} onChange={setAgentFriendly} />
          ) : (
            <KpiBannerForm data={kpiBanner} onChange={setKpiBanner} />
          )}
        </div>

        <div className="p-4 border-t border-border space-y-2">
          <div className="flex gap-2">
            <button
              onClick={handleSaveGraphic}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-lg font-medium transition-all ${
                saveFlash
                  ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                  : 'bg-surface-hover hover:bg-border text-text-muted hover:text-text'
              }`}
            >
              <Save size={12} /> {saveFlash ? 'Gespeichert' : 'Speichern'}
            </button>
            <button
              onClick={() => setShowSavedGraphics(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-lg font-medium bg-surface-hover hover:bg-border text-text-muted hover:text-text transition-colors"
            >
              <FolderOpen size={12} /> Laden
            </button>
          </div>
          <div className="flex gap-2">
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
          ) : graphicType === 'revenue-systems' ? (
            <RevenueSystemsGraphic data={revenueSystems} width={format.width} height={format.height} />
          ) : graphicType === 'infographic' ? (
            <InfographicGraphic data={infographic} width={format.width} height={format.height} />
          ) : graphicType === 'academy' ? (
            <AcademyGraphic data={academy} width={format.width} height={format.height} />
          ) : graphicType === 'raw-data' ? (
            <RawDataGraphic data={rawData} width={format.width} height={format.height} />
          ) : graphicType === 'enriched-data' ? (
            <EnrichedDataGraphic data={enrichedData} width={format.width} height={format.height} />
          ) : graphicType === 'qualified-data' ? (
            <QualifiedDataGraphic data={qualifiedData} width={format.width} height={format.height} />
          ) : graphicType === 'personalized-outreach' ? (
            <PersonalizedOutreachGraphic data={personalizedOutreach} width={format.width} height={format.height} />
          ) : graphicType === 'multichannel-outreach' ? (
            <MultichannelOutreachGraphic data={multichannelOutreach} width={format.width} height={format.height} />
          ) : graphicType === 'outbound-stack' ? (
            <OutboundStackGraphic data={outboundStack} width={format.width} height={format.height} />
          ) : graphicType === 'agent-friendly' ? (
            <AgentFriendlyGraphic data={agentFriendly} width={format.width} height={format.height} />
          ) : (
            <KpiBannerGraphic data={kpiBanner} width={format.width} height={format.height} />
          )}
        </div>
      </div>

      {showSavedGraphics && (
        <SavedGraphicsModal
          onClose={() => setShowSavedGraphics(false)}
          onLoad={handleLoadGraphic}
        />
      )}
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
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#0A1628" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Akzent 1 (Blau)" value={data.accentColor} defaultValue="#3B82F6" onChange={(v) => onChange({ ...data, accentColor: v })} />
      <ColorRow label="Akzent 2 (Grün)" value={data.accentColor2} defaultValue="#10B981" onChange={(v) => onChange({ ...data, accentColor2: v })} />
      <ColorRow label="Titel-Farbe" value={data.textColor} defaultValue="#b0b0c0" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#808090" onChange={(v) => onChange({ ...data, labelColor: v })} />

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
              style={{ background: kpi.color === 'blue' ? (data.accentColor || '#3B82F6') : (data.accentColor2 || '#10B981') }}
              className="w-6 h-6 rounded-full mb-0.5 shrink-0"
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
      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben</span>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#080820" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Akzent 1" value={data.accentColor} defaultValue="#3B4BF9" onChange={(v) => onChange({ ...data, accentColor: v })} />
      <ColorRow label="Akzent 2" value={data.accentColor2} defaultValue="#E93BCD" onChange={(v) => onChange({ ...data, accentColor2: v })} />
      <ColorRow label="Textfarbe" value={data.textColor} defaultValue="#ffffff" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#8888a0" onChange={(v) => onChange({ ...data, labelColor: v })} />
      <ColorRow label="Card-Farbe" value={data.cardColor} defaultValue="#0a0a1a" onChange={(v) => onChange({ ...data, cardColor: v })} />
      <ColorRow label="Card-Rand" value={data.cardBorderColor} defaultValue="#1a1a2e" onChange={(v) => onChange({ ...data, cardBorderColor: v })} />
      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Texte</span>
      </div>
      <Field label="Tagline" value={data.tagline || 'Case Study'} onChange={(v) => onChange({ ...data, tagline: v })} />
      <Field label="Footer links" value={data.footerLeft || 'cegtec.net'} onChange={(v) => onChange({ ...data, footerLeft: v })} />
      <Field label="Footer rechts" value={data.footerRight || 'AI Sales Automation'} onChange={(v) => onChange({ ...data, footerRight: v })} />
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
      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben</span>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#070718" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Akzent 1" value={data.accentColor} defaultValue="#3B4BF9" onChange={(v) => onChange({ ...data, accentColor: v })} />
      <ColorRow label="Akzent 2" value={data.accentColor2} defaultValue="#E93BCD" onChange={(v) => onChange({ ...data, accentColor2: v })} />
      <ColorRow label="Textfarbe" value={data.textColor} defaultValue="#ffffff" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#8888a0" onChange={(v) => onChange({ ...data, labelColor: v })} />
      <ColorRow label="Card-Farbe" value={data.cardColor} defaultValue="#0a0a1a" onChange={(v) => onChange({ ...data, cardColor: v })} />
      <ColorRow label="Card-Rand" value={data.cardBorderColor} defaultValue="#1a1a2e" onChange={(v) => onChange({ ...data, cardBorderColor: v })} />
      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Texte</span>
      </div>
      <Field label="Tagline" value={data.tagline || 'ROI Report'} onChange={(v) => onChange({ ...data, tagline: v })} />
      <Field label="Footer links" value={data.footerLeft || 'cegtec.net'} onChange={(v) => onChange({ ...data, footerLeft: v })} />
      <Field label="Footer rechts" value={data.footerRight || 'AI Sales Automation'} onChange={(v) => onChange({ ...data, footerRight: v })} />
      <ChartForm chart={data.chart} onChange={(chart) => onChange({ ...data, chart })} />
    </div>
  );
}

/* ---- Revenue Systems Form ---- */

function RevenueSystemsForm({ data, onChange }: { data: RevenueSystemsData; onChange: (d: RevenueSystemsData) => void }) {
  const updateCard = (i: number, key: string, val: string | boolean) => {
    const cards = [...data.cards];
    cards[i] = { ...cards[i], [key]: val };
    onChange({ ...data, cards });
  };

  return (
    <div className="space-y-3">
      <Field label="Footer-Text" value={data.footer} onChange={(v) => onChange({ ...data, footer: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben</span>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#FAFAFA" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Akzent" value={data.accentColor} defaultValue="#2563EB" onChange={(v) => onChange({ ...data, accentColor: v })} />
      <ColorRow label="Textfarbe" value={data.textColor} defaultValue="#0A0A0A" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#71717A" onChange={(v) => onChange({ ...data, labelColor: v })} />
      <ColorRow label="Card-Farbe" value={data.cardColor} defaultValue="#FFFFFF" onChange={(v) => onChange({ ...data, cardColor: v })} />
      <ColorRow label="Card-Rand" value={data.cardBorderColor} defaultValue="#E5E5E5" onChange={(v) => onChange({ ...data, cardBorderColor: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Karten</span>
      </div>

      {data.cards.map((card, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">{card.system}</span>
          <Field label="System-Nr." value={card.system} onChange={(v) => updateCard(i, 'system', v)} />
          <Field label="Headline" value={card.headline} onChange={(v) => updateCard(i, 'headline', v)} />
          <Field label="Tag" value={card.tag} onChange={(v) => updateCard(i, 'tag', v)} />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={card.tagFilled}
              onChange={(e) => updateCard(i, 'tagFilled', e.target.checked)}
              className="accent-primary"
            />
            <span className="text-xs text-text-muted">Tag ausgefüllt (blauer Hintergrund)</span>
          </div>
          <Field label="Beschreibung" value={card.description} onChange={(v) => updateCard(i, 'description', v)} />
          <Field label="Datenzeile" value={card.dataLine} onChange={(v) => updateCard(i, 'dataLine', v)} />
        </div>
      ))}
    </div>
  );
}

/* ---- Infographic Form ---- */

function InfographicForm({ data, onChange }: { data: InfographicData; onChange: (d: InfographicData) => void }) {
  const updateMetric = (i: number, key: string, val: string) => {
    const metrics = [...data.metrics];
    metrics[i] = { ...metrics[i], [key]: val };
    onChange({ ...data, metrics });
  };

  const updateFunnel = (i: number, key: string, val: string) => {
    const funnelSteps = [...data.funnelSteps];
    funnelSteps[i] = { ...funnelSteps[i], [key]: key === 'pct' ? Number(val) || 0 : val };
    onChange({ ...data, funnelSteps });
  };

  const addFunnelStep = () => {
    onChange({ ...data, funnelSteps: [...data.funnelSteps, { label: 'Schritt', value: '0', pct: 1 }] });
  };

  const removeFunnelStep = (i: number) => {
    onChange({ ...data, funnelSteps: data.funnelSteps.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-3">
      <Field label="Unternehmen" value={data.companyName} onChange={(v) => onChange({ ...data, companyName: v })} />
      <Field label="Branche" value={data.industry} onChange={(v) => onChange({ ...data, industry: v })} />
      <Field label="Headline" value={data.headline} onChange={(v) => onChange({ ...data, headline: v })} textarea />
      <Field label="Subline" value={data.subline} onChange={(v) => onChange({ ...data, subline: v })} />
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#FAFAFA" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Akzent 1" value={data.accentColor} defaultValue="#3B4BF9" onChange={(v) => onChange({ ...data, accentColor: v })} />
      <ColorRow label="Akzent 2" value={data.accentColor2} defaultValue="#E93BCD" onChange={(v) => onChange({ ...data, accentColor2: v })} />
      <ColorRow label="Textfarbe" value={data.textColor} defaultValue="#0A0A0A" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#71717A" onChange={(v) => onChange({ ...data, labelColor: v })} />
      <ColorRow label="Card-Farbe" value={data.cardColor} defaultValue="#FFFFFF" onChange={(v) => onChange({ ...data, cardColor: v })} />
      <ColorRow label="Card-Rand" value={data.cardBorderColor} defaultValue="#E5E7EB" onChange={(v) => onChange({ ...data, cardBorderColor: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Metriken</span>
      </div>
      {data.metrics.map((m, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex gap-2">
            <div className="w-14"><Field label="Icon" value={m.icon} onChange={(v) => updateMetric(i, 'icon', v)} /></div>
            <div className="flex-1"><Field label="Wert" value={m.value} onChange={(v) => updateMetric(i, 'value', v)} /></div>
          </div>
          <Field label="Label" value={m.label} onChange={(v) => updateMetric(i, 'label', v)} />
          <Field label="Tag (z.B. KPI 01)" value={m.tag || `KPI 0${i + 1}`} onChange={(v) => updateMetric(i, 'tag', v)} />
        </div>
      ))}
      <ColorRow label="KPI-Tag-Farbe" value={data.kpiTagColor} defaultValue="#9CA3AF" onChange={(v) => onChange({ ...data, kpiTagColor: v })} />

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Funnel</span>
        <button onClick={addFunnelStep} className="text-xs text-primary hover:text-primary-hover">+ Hinzufügen</button>
      </div>
      <div className="flex gap-2">
        <div className="flex-1"><Field label="Funnel-Titel" value={data.funnelTitle || 'Sales Funnel'} onChange={(v) => onChange({ ...data, funnelTitle: v })} /></div>
        <div className="flex-1"><Field label="Untertitel" value={data.funnelSubtitle || '90-DAY WINDOW'} onChange={(v) => onChange({ ...data, funnelSubtitle: v })} /></div>
      </div>
      {data.funnelSteps.map((step, i) => (
        <div key={i} className="flex gap-2 items-end">
          <div className="flex-1"><Field label="Label" value={step.label} onChange={(v) => updateFunnel(i, 'label', v)} /></div>
          <div className="w-20"><Field label="Wert" value={step.value} onChange={(v) => updateFunnel(i, 'value', v)} /></div>
          <div className="w-16"><Field label="%" value={String(step.pct)} onChange={(v) => updateFunnel(i, 'pct', v)} /></div>
          {data.funnelSteps.length > 2 && (
            <button onClick={() => removeFunnelStep(i)} className="text-danger text-xs mb-1 shrink-0">&times;</button>
          )}
        </div>
      ))}

      <Field label="Zitat" value={data.quote} onChange={(v) => onChange({ ...data, quote: v })} textarea />
      <Field label="CTA-Text" value={data.ctaText} onChange={(v) => onChange({ ...data, ctaText: v })} />
    </div>
  );
}

/* ---- Academy Form ---- */

function AcademyForm({ data, onChange }: { data: AcademyData; onChange: (d: AcademyData) => void }) {
  const updateStep = (i: number, key: string, val: string) => {
    const steps = [...data.steps];
    steps[i] = { ...steps[i], [key]: val };
    onChange({ ...data, steps });
  };

  return (
    <div className="space-y-3">
      <Field label="Titel" value={data.title} onChange={(v) => onChange({ ...data, title: v })} textarea />
      <Field label="Untertitel" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} />
      <Field label="Badge" value={data.badge} onChange={(v) => onChange({ ...data, badge: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben & Theme</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onChange({ ...data, theme: 'light', backgroundColor: '#F5F5F0', textColor: '#1A1A2E' })}
          className={`flex-1 py-1.5 text-xs rounded-lg font-medium ${data.theme === 'light' ? 'bg-primary text-white' : 'bg-surface-hover text-text-muted'}`}
        >Light</button>
        <button
          onClick={() => onChange({ ...data, theme: 'dark', backgroundColor: '#0A0E27', textColor: '#FFFFFF' })}
          className={`flex-1 py-1.5 text-xs rounded-lg font-medium ${data.theme === 'dark' ? 'bg-primary text-white' : 'bg-surface-hover text-text-muted'}`}
        >Dark</button>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#F5F5F0" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Akzent" value={data.accentColor} defaultValue="#2563EB" onChange={(v) => onChange({ ...data, accentColor: v })} />
      <ColorRow label="Akzent 2" value={data.accentColor2} defaultValue="#1A3FD4" onChange={(v) => onChange({ ...data, accentColor2: v })} />
      <ColorRow label="Textfarbe" value={data.textColor} defaultValue="#1A1A2E" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#7A7A8E" onChange={(v) => onChange({ ...data, labelColor: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Pipeline Steps</span>
      </div>
      {data.steps.map((step, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex gap-2">
            <div className="flex-1"><Field label="Aktion" value={step.action} onChange={(v) => updateStep(i, 'action', v)} /></div>
            <div className="w-20"><Field label="Kosten" value={step.cost} onChange={(v) => updateStep(i, 'cost', v)} /></div>
          </div>
          <Field label="Tool" value={step.tool} onChange={(v) => updateStep(i, 'tool', v)} />
          <Field label="Beschreibung" value={step.desc} onChange={(v) => updateStep(i, 'desc', v)} />
        </div>
      ))}

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Kosten-Vergleich</span>
      </div>
      <div className="flex gap-2">
        <div className="flex-1"><Field label="Unser Preis" value={data.ourPrice} onChange={(v) => onChange({ ...data, ourPrice: v })} /></div>
        <div className="flex-1"><Field label="Deren Preis" value={data.theirPrice} onChange={(v) => onChange({ ...data, theirPrice: v })} /></div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1"><Field label="Unser Label" value={data.ourLabel} onChange={(v) => onChange({ ...data, ourLabel: v })} /></div>
        <div className="flex-1"><Field label="Deren Label" value={data.theirLabel} onChange={(v) => onChange({ ...data, theirLabel: v })} /></div>
      </div>

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Ergebnis-Banner</span>
      </div>
      <Field label="Metriken" value={data.resultBanner} onChange={(v) => onChange({ ...data, resultBanner: v })} textarea />
      <Field label="Quelle" value={data.resultSource} onChange={(v) => onChange({ ...data, resultSource: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">CTA</span>
      </div>
      <Field label="CTA Text" value={data.ctaText} onChange={(v) => onChange({ ...data, ctaText: v })} textarea />
      <Field label="Button" value={data.ctaButton} onChange={(v) => onChange({ ...data, ctaButton: v })} />
      <Field label="URL" value={data.ctaUrl} onChange={(v) => onChange({ ...data, ctaUrl: v })} />
    </div>
  );
}

/* ---- Enriched Data Form ---- */

function EnrichedDataForm({ data, onChange }: { data: EnrichedDataData; onChange: (d: EnrichedDataData) => void }) {
  const updateEntry = (i: number, key: string, val: string) => {
    const entries = [...data.entries];
    entries[i] = { ...entries[i], [key]: val };
    onChange({ ...data, entries });
  };

  const addEntry = () => {
    onChange({ ...data, entries: [...data.entries, { company: 'Neue Firma GmbH', domain: 'example.de', country: 'DE', phone: '+49 ...', email: 'info@example.de', revenue: '\u20AC5\u201310M', employees: '50', industry: 'SaaS' }] });
  };

  const removeEntry = (i: number) => {
    onChange({ ...data, entries: data.entries.filter((_, idx) => idx !== i) });
  };

  const updateStat = (i: number, key: string, val: string) => {
    const completionStats = [...data.completionStats];
    completionStats[i] = { ...completionStats[i], [key]: key === 'pct' ? Number(val) || 0 : val };
    onChange({ ...data, completionStats });
  };

  return (
    <div className="space-y-3">
      <Field label="Titel" value={data.title} onChange={(v) => onChange({ ...data, title: v })} />
      <Field label="Untertitel" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} />
      <Field label="Gesamt-Anzahl" value={data.totalCount} onChange={(v) => onChange({ ...data, totalCount: v })} />
      <Field label="Quelle" value={data.sourceLabel} onChange={(v) => onChange({ ...data, sourceLabel: v })} />
      <Field label="Completion Label" value={data.completionLabel} onChange={(v) => onChange({ ...data, completionLabel: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben</span>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#F8F7F4" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Titelfarbe" value={data.textColor} defaultValue="#1A1A2E" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#8A8A9A" onChange={(v) => onChange({ ...data, labelColor: v })} />
      <ColorRow label="Gef\u00fcllte Felder" value={data.filledColor} defaultValue="#2563EB" onChange={(v) => onChange({ ...data, filledColor: v })} />
      <ColorRow label="Leere Felder" value={data.emptyColor} defaultValue="#D4D4D8" onChange={(v) => onChange({ ...data, emptyColor: v })} />
      <ColorRow label="Rahmen" value={data.borderColor} defaultValue="#E5E5EA" onChange={(v) => onChange({ ...data, borderColor: v })} />
      <ColorRow label="Warning-Akzent" value={data.warningColor} defaultValue="#10B981" onChange={(v) => onChange({ ...data, warningColor: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Completion Stats</span>
      </div>
      {data.completionStats.map((stat, i) => (
        <div key={i} className="flex gap-2 items-end">
          <div className="flex-1"><Field label="Label" value={stat.label} onChange={(v) => updateStat(i, 'label', v)} /></div>
          <div className="w-16"><Field label="%" value={String(stat.pct)} onChange={(v) => updateStat(i, 'pct', v)} /></div>
        </div>
      ))}

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Eintr\u00e4ge</span>
        <button onClick={addEntry} className="text-xs text-primary hover:text-primary-hover">+ Hinzuf\u00fcgen</button>
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
            <div className="flex-1"><Field label="Land" value={entry.country} onChange={(v) => updateEntry(i, 'country', v)} /></div>
          </div>
          <Field label="Domain" value={entry.domain} onChange={(v) => updateEntry(i, 'domain', v)} />
          <div className="flex gap-2">
            <div className="flex-1"><Field label="Phone" value={entry.phone} onChange={(v) => updateEntry(i, 'phone', v)} /></div>
            <div className="flex-1"><Field label="Email" value={entry.email} onChange={(v) => updateEntry(i, 'email', v)} /></div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1"><Field label="Revenue" value={entry.revenue} onChange={(v) => updateEntry(i, 'revenue', v)} /></div>
            <div className="flex-1"><Field label="Employees" value={entry.employees} onChange={(v) => updateEntry(i, 'employees', v)} /></div>
          </div>
          <Field label="Industry" value={entry.industry} onChange={(v) => updateEntry(i, 'industry', v)} />
        </div>
      ))}
    </div>
  );
}

/* ---- Raw Data Form ---- */

function RawDataForm({ data, onChange }: { data: RawDataData; onChange: (d: RawDataData) => void }) {
  const updateEntry = (i: number, key: string, val: string) => {
    const entries = [...data.entries];
    entries[i] = { ...entries[i], [key]: val };
    onChange({ ...data, entries });
  };

  const addEntry = () => {
    onChange({ ...data, entries: [...data.entries, { company: 'Neue Firma GmbH', domain: 'example.de', country: 'DE', phone: '', email: '', revenue: '', employees: '', industry: '' }] });
  };

  const removeEntry = (i: number) => {
    onChange({ ...data, entries: data.entries.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-3">
      <Field label="Titel" value={data.title} onChange={(v) => onChange({ ...data, title: v })} />
      <Field label="Untertitel" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v })} />
      <Field label="Gesamt-Anzahl" value={data.totalCount} onChange={(v) => onChange({ ...data, totalCount: v })} />
      <Field label="Quelle" value={data.sourceLabel} onChange={(v) => onChange({ ...data, sourceLabel: v })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Farben</span>
      </div>
      <ColorRow label="Hintergrund" value={data.backgroundColor} defaultValue="#F8F7F4" onChange={(v) => onChange({ ...data, backgroundColor: v })} />
      <ColorRow label="Titelfarbe" value={data.textColor} defaultValue="#1A1A2E" onChange={(v) => onChange({ ...data, textColor: v })} />
      <ColorRow label="Label-Farbe" value={data.labelColor} defaultValue="#8A8A9A" onChange={(v) => onChange({ ...data, labelColor: v })} />
      <ColorRow label="Gef\u00fcllte Felder" value={data.filledColor} defaultValue="#2563EB" onChange={(v) => onChange({ ...data, filledColor: v })} />
      <ColorRow label="Leere Felder" value={data.emptyColor} defaultValue="#D4D4D8" onChange={(v) => onChange({ ...data, emptyColor: v })} />
      <ColorRow label="Rahmen" value={data.borderColor} defaultValue="#E5E5EA" onChange={(v) => onChange({ ...data, borderColor: v })} />
      <ColorRow label="Warning-Akzent" value={data.warningColor} defaultValue="#1A3FD4" onChange={(v) => onChange({ ...data, warningColor: v })} />

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Eintr\u00e4ge</span>
        <button onClick={addEntry} className="text-xs text-primary hover:text-primary-hover">+ Hinzuf\u00fcgen</button>
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
            <div className="flex-1"><Field label="Land" value={entry.country} onChange={(v) => updateEntry(i, 'country', v)} /></div>
          </div>
          <Field label="Domain" value={entry.domain} onChange={(v) => updateEntry(i, 'domain', v)} />
          <div className="flex gap-2">
            <div className="flex-1"><Field label="Phone" value={entry.phone} onChange={(v) => updateEntry(i, 'phone', v)} /></div>
            <div className="flex-1"><Field label="Email" value={entry.email} onChange={(v) => updateEntry(i, 'email', v)} /></div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1"><Field label="Revenue" value={entry.revenue} onChange={(v) => updateEntry(i, 'revenue', v)} /></div>
            <div className="flex-1"><Field label="Employees" value={entry.employees} onChange={(v) => updateEntry(i, 'employees', v)} /></div>
          </div>
          <Field label="Industry" value={entry.industry} onChange={(v) => updateEntry(i, 'industry', v)} />
        </div>
      ))}
    </div>
  );
}

/* ---- Outbound Stack Form ---- */

function OutboundStackForm({ data, onChange }: { data: OutboundStackData; onChange: (d: OutboundStackData) => void }) {
  const updateStep = (i: number, key: string, val: string) => {
    const steps = [...data.steps];
    steps[i] = { ...steps[i], [key]: val };
    onChange({ ...data, steps });
  };

  const addStep = () => {
    onChange({ ...data, steps: [...data.steps, { label: 'NEUER SCHRITT', tool: 'Tool Name', url: 'example.com', price: '$0/Mo', description: 'Beschreibung' }] });
  };

  const removeStep = (i: number) => {
    onChange({ ...data, steps: data.steps.filter((_, idx) => idx !== i) });
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
      <ColorRow label="Gef\u00fcllte Felder" value={data.filledColor} defaultValue="#2563EB" onChange={(v) => onChange({ ...data, filledColor: v })} />
      <ColorRow label="Leere Felder" value={data.emptyColor} defaultValue="#D4D4D8" onChange={(v) => onChange({ ...data, emptyColor: v })} />
      <ColorRow label="Rahmen" value={data.borderColor} defaultValue="#E5E5EA" onChange={(v) => onChange({ ...data, borderColor: v })} />
      <ColorRow label="Warning-Akzent" value={data.warningColor} defaultValue="#1A3FD4" onChange={(v) => onChange({ ...data, warningColor: v })} />

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Pipeline-Schritte</span>
        <button onClick={addStep} className="text-xs text-primary hover:text-primary-hover">+ Hinzuf\u00fcgen</button>
      </div>
      {data.steps.map((step, i) => (
        <div key={i} className="bg-surface-hover rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">Schritt {i + 1}</span>
            {data.steps.length > 1 && (
              <button onClick={() => removeStep(i)} className="text-danger text-xs">&times;</button>
            )}
          </div>
          <Field label="Label" value={step.label} onChange={(v) => updateStep(i, 'label', v)} />
          <Field label="Tool" value={step.tool} onChange={(v) => updateStep(i, 'tool', v)} />
          <div className="flex gap-2">
            <div className="flex-1"><Field label="URL" value={step.url} onChange={(v) => updateStep(i, 'url', v)} /></div>
            <div className="flex-1"><Field label="Preis" value={step.price} onChange={(v) => updateStep(i, 'price', v)} /></div>
          </div>
          <Field label="Beschreibung" value={step.description} onChange={(v) => updateStep(i, 'description', v)} />
        </div>
      ))}

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Kosten-Vergleich</span>
      </div>
      <div className="flex gap-2">
        <div className="flex-1"><Field label="Links Titel" value={data.costLeft.title} onChange={(v) => onChange({ ...data, costLeft: { ...data.costLeft, title: v } })} /></div>
        <div className="flex-1"><Field label="Links Preis" value={data.costLeft.price} onChange={(v) => onChange({ ...data, costLeft: { ...data.costLeft, price: v } })} /></div>
      </div>
      <Field label="Links Kleingedruckt" value={data.costLeft.subtitle} onChange={(v) => onChange({ ...data, costLeft: { ...data.costLeft, subtitle: v } })} />
      <div className="flex gap-2">
        <div className="flex-1"><Field label="Rechts Titel" value={data.costRight.title} onChange={(v) => onChange({ ...data, costRight: { ...data.costRight, title: v } })} /></div>
        <div className="flex-1"><Field label="Rechts Preis" value={data.costRight.price} onChange={(v) => onChange({ ...data, costRight: { ...data.costRight, price: v } })} /></div>
      </div>
      <Field label="Rechts Kleingedruckt" value={data.costRight.subtitle} onChange={(v) => onChange({ ...data, costRight: { ...data.costRight, subtitle: v } })} />

      <div className="border-t border-border pt-3 mt-3">
        <span className="text-xs text-text-muted font-medium">Ergebnis</span>
      </div>
      <Field label="Ergebnis-Metriken" value={data.resultMetrics} onChange={(v) => onChange({ ...data, resultMetrics: v })} textarea />
      <Field label="Quelle" value={data.resultSource} onChange={(v) => onChange({ ...data, resultSource: v })} />
    </div>
  );
}

/* ---- Agent-Friendly Form ---- */

function AgentFriendlyForm({ data, onChange }: { data: AgentFriendlyData; onChange: (d: AgentFriendlyData) => void }) {
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
      <ColorRow label="Prim\u00e4rfarbe" value={data.filledColor} defaultValue="#2563EB" onChange={(v) => onChange({ ...data, filledColor: v })} />
      <ColorRow label="Leere Felder" value={data.emptyColor} defaultValue="#D4D4D8" onChange={(v) => onChange({ ...data, emptyColor: v })} />
      <ColorRow label="Rahmen" value={data.borderColor} defaultValue="#E5E5EA" onChange={(v) => onChange({ ...data, borderColor: v })} />
      <ColorRow label="Akzent" value={data.warningColor} defaultValue="#1A3FD4" onChange={(v) => onChange({ ...data, warningColor: v })} />

      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
        <span className="text-xs text-text-muted font-medium">Pyramiden-Layer</span>
        <button onClick={addLayer} className="text-xs text-primary hover:text-primary-hover">+ Hinzuf\u00fcgen</button>
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
        <button onClick={addFact} className="text-xs text-primary hover:text-primary-hover">+ Hinzuf\u00fcgen</button>
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

/* ---- Multichannel Outreach Form ---- */

function MultichannelOutreachForm({ data, onChange }: { data: MultichannelOutreachData; onChange: (d: MultichannelOutreachData) => void }) {
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
              <span className="text-[10px] text-text-muted">Eintr\u00e4ge</span>
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
      <ColorRow label="Gef\u00fcllte Felder" value={data.filledColor} defaultValue="#2563EB" onChange={(v) => onChange({ ...data, filledColor: v })} />
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

/* ---- Personalized Outreach Form ---- */

function PersonalizedOutreachForm({ data, onChange }: { data: PersonalizedOutreachData; onChange: (d: PersonalizedOutreachData) => void }) {
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
      <ColorRow label="Gef\u00fcllte Felder" value={data.filledColor} defaultValue="#2563EB" onChange={(v) => onChange({ ...data, filledColor: v })} />
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
        <button onClick={addMessage} className="text-xs text-primary hover:text-primary-hover">+ Hinzuf\u00fcgen</button>
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

/* ---- Qualified Data Form ---- */

function QualifiedDataForm({ data, onChange }: { data: QualifiedDataData; onChange: (d: QualifiedDataData) => void }) {
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
      <ColorRow label="Gef\u00fcllte Felder" value={data.filledColor} defaultValue="#2563EB" onChange={(v) => onChange({ ...data, filledColor: v })} />
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
        <span className="text-xs text-text-muted font-medium">Eintr\u00e4ge</span>
        <button onClick={addEntry} className="text-xs text-primary hover:text-primary-hover">+ Hinzuf\u00fcgen</button>
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

/* ---- Color Row ---- */

function ColorRow({ label, value, defaultValue, onChange }: { label: string; value: string | undefined; defaultValue: string; onChange: (v: string) => void }) {
  const val = value || defaultValue;
  return (
    <div>
      <label className="text-xs text-text-muted block mb-0.5">{label}</label>
      <div className="flex gap-1">
        <input type="color" value={val} onChange={(e) => onChange(e.target.value)} className="w-7 h-7 rounded border border-border cursor-pointer shrink-0" />
        <input type="text" value={val} onChange={(e) => onChange(e.target.value)} className="w-full bg-surface-hover border border-border rounded-lg px-2 py-1 text-xs text-text outline-none focus:border-primary transition-colors" />
      </div>
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
