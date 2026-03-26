import {
  Image, BarChart3, Trophy, Boxes, LayoutDashboard,
  GraduationCap, Database, DatabaseZap, ScanSearch,
  Mail, Radio, Layers, Bot, MessageSquareText,
  GitCompare, Clock, Filter,
} from 'lucide-react';

import type { GraphicDefinition } from './types';

// Graphic components
import { CaseStudyGraphic } from '../components/graphics/CaseStudyGraphic';
import { RoiGraphic } from '../components/graphics/RoiGraphic';
import { KpiBannerGraphic } from '../components/graphics/KpiBannerGraphic';
import { RevenueSystemsGraphic, defaultRevenueSystemsData } from '../components/graphics/RevenueSystemsGraphic';
import { InfographicGraphic, defaultInfographicData } from '../components/graphics/InfographicGraphic';
import { AcademyGraphic, defaultAcademyData } from '../components/graphics/AcademyGraphic';
import { RawDataGraphic, defaultRawDataData } from '../components/graphics/RawDataGraphic';
import { EnrichedDataGraphic, defaultEnrichedDataData } from '../components/graphics/EnrichedDataGraphic';
import { QualifiedDataGraphic, defaultQualifiedDataData } from '../components/graphics/QualifiedDataGraphic';
import { PersonalizedOutreachGraphic, defaultPersonalizedOutreachData } from '../components/graphics/PersonalizedOutreachGraphic';
import { MultichannelOutreachGraphic, defaultMultichannelOutreachData } from '../components/graphics/MultichannelOutreachGraphic';
import { OutboundStackGraphic, defaultOutboundStackData } from '../components/graphics/OutboundStackGraphic';
import { AgentFriendlyGraphic, defaultAgentFriendlyData } from '../components/graphics/AgentFriendlyGraphic';
import { LinkedInPostGraphic, defaultLinkedInPostData } from '../components/graphics/LinkedInPostGraphic';
import { ComparisonGraphic, defaultComparisonData } from '../components/graphics/ComparisonGraphic';
import { TimelineGraphic, defaultTimelineData } from '../components/graphics/TimelineGraphic';
import { FunnelGraphic, defaultFunnelData } from '../components/graphics/FunnelGraphic';

// Form components
import { CaseStudyForm } from '../components/graphics/CaseStudyForm';
import { RoiForm } from '../components/graphics/RoiForm';
import { KpiBannerForm } from '../components/graphics/KpiBannerForm';
import { RevenueSystemsForm } from '../components/graphics/RevenueSystemsForm';
import { InfographicForm } from '../components/graphics/InfographicForm';
import { AcademyForm } from '../components/graphics/AcademyForm';
import { RawDataForm } from '../components/graphics/RawDataForm';
import { EnrichedDataForm } from '../components/graphics/EnrichedDataForm';
import { QualifiedDataForm } from '../components/graphics/QualifiedDataForm';
import { PersonalizedOutreachForm } from '../components/graphics/PersonalizedOutreachForm';
import { MultichannelOutreachForm } from '../components/graphics/MultichannelOutreachForm';
import { OutboundStackForm } from '../components/graphics/OutboundStackForm';
import { AgentFriendlyForm } from '../components/graphics/AgentFriendlyForm';
import { LinkedInPostForm } from '../components/graphics/LinkedInPostForm';
import { ComparisonForm } from '../components/graphics/ComparisonForm';
import { TimelineForm } from '../components/graphics/TimelineForm';
import { FunnelForm } from '../components/graphics/FunnelForm';

// Types & defaults
import type { CaseStudyData, RoiData } from '../types/graphics';
import { defaultCaseStudy, defaultRoi } from '../types/graphics';
import type { KpiBannerData } from '../components/graphics/KpiBannerGraphic';
import type { InfographicData } from '../components/graphics/InfographicGraphic';

// Sync utilities
import { syncToCaseStudy, syncToRoi, syncToKpiBanner, syncToInfographic } from '../utils/graphicSync';

// ── Core data shape used for cross-sync ─────────────────────────
interface CoreData {
  companyName: string;
  industry: string;
  headline: string;
  metrics: { value: string; label: string; icon?: string }[];
  quote: string;
}

function extractCaseStudyCore(d: CaseStudyData): CoreData {
  return {
    companyName: d.companyName,
    industry: d.industry,
    headline: d.headline,
    metrics: [
      { value: d.metricValue, label: d.metricLabel, icon: '\u2191' },
      { value: d.metric2Value, label: d.metric2Label, icon: '\u23F1' },
      { value: d.metric3Value, label: d.metric3Label, icon: '\u26A1' },
    ],
    quote: d.quote,
  };
}

function extractRoiCore(d: RoiData): CoreData {
  return {
    companyName: '',
    industry: '',
    headline: d.title,
    metrics: d.metrics.map((m) => ({ value: m.value, label: m.label })),
    quote: d.subtitle,
  };
}

function extractKpiBannerCore(d: KpiBannerData): CoreData {
  return {
    companyName: '',
    industry: '',
    headline: d.title,
    metrics: d.kpis.map((k) => ({ value: k.value, label: k.label, icon: k.icon })),
    quote: '',
  };
}

function extractInfographicCore(d: InfographicData): CoreData {
  return {
    companyName: d.companyName,
    industry: d.industry,
    headline: d.headline,
    metrics: d.metrics,
    quote: d.quote,
  };
}

// ── Default KPI banner data (was inline in App.tsx) ─────────────
const defaultKpiBanner: KpiBannerData = {
  title: 'CegTec Outreach Performance',
  kpis: [
    { icon: '\uD83D\uDC65', value: '1.976', label: 'Leads kontaktiert', color: 'blue' },
    { icon: '\uD83D\uDCE7', value: '7.526', label: 'E-Mails versendet', color: 'green' },
    { icon: '\uD83D\uDCAC', value: '118', label: 'Unique Replies', color: 'blue' },
    { icon: '\uD83D\uDCCA', value: '6,0%', label: 'Reply Rate', color: 'green' },
    { icon: '\uD83C\uDFAF', value: '6', label: 'Opportunities', color: 'blue' },
    { icon: '\uD83D\uDCB0', value: '\u20AC6.000', label: 'Pipeline-Wert', color: 'green' },
  ],
};

// ── Registry ────────────────────────────────────────────────────
export const GRAPHIC_REGISTRY: GraphicDefinition[] = [
  {
    id: 'case-study',
    label: 'Case Study',
    icon: Image,
    defaultData: defaultCaseStudy,
    defaultFormat: 'linkedin',
    forceFormat: false,
    getDisplayName: (d: CaseStudyData) => d.companyName,
    FormComponent: CaseStudyForm,
    GraphicComponent: CaseStudyGraphic,
    syncGroup: 'core',
    extractCore: extractCaseStudyCore,
    applyCore: (core: CoreData, current: CaseStudyData) => syncToCaseStudy('infographic', { ...defaultInfographicData, companyName: core.companyName, industry: core.industry, headline: core.headline, metrics: core.metrics, quote: core.quote }, current),
  },
  {
    id: 'roi',
    label: 'ROI',
    icon: BarChart3,
    defaultData: defaultRoi,
    defaultFormat: 'linkedin',
    forceFormat: false,
    getDisplayName: (d: RoiData) => d.title,
    FormComponent: RoiForm,
    GraphicComponent: RoiGraphic,
    syncGroup: 'core',
    extractCore: extractRoiCore,
    applyCore: (core: CoreData, current: RoiData) => syncToRoi('infographic', { ...defaultInfographicData, companyName: core.companyName, industry: core.industry, headline: core.headline, metrics: core.metrics, quote: core.quote }, current),
  },
  {
    id: 'kpi-banner',
    label: 'KPI Banner',
    icon: Trophy,
    defaultData: defaultKpiBanner,
    defaultFormat: 'banner',
    forceFormat: true,
    getDisplayName: (d: KpiBannerData) => d.title,
    FormComponent: KpiBannerForm,
    GraphicComponent: KpiBannerGraphic,
    syncGroup: 'core',
    extractCore: extractKpiBannerCore,
    applyCore: (core: CoreData, current: KpiBannerData) => syncToKpiBanner('infographic', { ...defaultInfographicData, companyName: core.companyName, industry: core.industry, headline: core.headline, metrics: core.metrics, quote: core.quote }, current),
  },
  {
    id: 'revenue-systems',
    label: 'Systems',
    icon: Boxes,
    defaultData: defaultRevenueSystemsData,
    defaultFormat: 'og',
    forceFormat: true,
    getDisplayName: () => 'Grafik',
    FormComponent: RevenueSystemsForm,
    GraphicComponent: RevenueSystemsGraphic,
  },
  {
    id: 'infographic',
    label: 'Infografik',
    icon: LayoutDashboard,
    defaultData: defaultInfographicData,
    defaultFormat: 'og',
    forceFormat: true,
    getDisplayName: (d: InfographicData) => d.companyName,
    FormComponent: InfographicForm,
    GraphicComponent: InfographicGraphic,
    syncGroup: 'core',
    extractCore: extractInfographicCore,
    applyCore: (core: CoreData, current: InfographicData) => syncToInfographic('case-study', { companyName: core.companyName, industry: core.industry, headline: core.headline, metricValue: core.metrics[0]?.value ?? '', metricLabel: core.metrics[0]?.label ?? '', metric2Value: core.metrics[1]?.value ?? '', metric2Label: core.metrics[1]?.label ?? '', metric3Value: core.metrics[2]?.value ?? '', metric3Label: core.metrics[2]?.label ?? '', quote: core.quote } as any, current),
  },
  {
    id: 'academy',
    label: 'Academy',
    icon: GraduationCap,
    defaultData: defaultAcademyData,
    defaultFormat: '9:16',
    forceFormat: true,
    getDisplayName: (d: any) => d.title,
    FormComponent: AcademyForm,
    GraphicComponent: AcademyGraphic,
  },
  {
    id: 'raw-data',
    label: 'Raw Data',
    icon: Database,
    defaultData: defaultRawDataData,
    defaultFormat: '16:9',
    forceFormat: true,
    getDisplayName: (d: any) => d.title,
    FormComponent: RawDataForm,
    GraphicComponent: RawDataGraphic,
  },
  {
    id: 'enriched-data',
    label: 'Enriched',
    icon: DatabaseZap,
    defaultData: defaultEnrichedDataData,
    defaultFormat: '16:9',
    forceFormat: true,
    getDisplayName: (d: any) => d.title,
    FormComponent: EnrichedDataForm,
    GraphicComponent: EnrichedDataGraphic,
  },
  {
    id: 'qualified-data',
    label: 'Qualified',
    icon: ScanSearch,
    defaultData: defaultQualifiedDataData,
    defaultFormat: '16:9',
    forceFormat: true,
    getDisplayName: (d: any) => d.title,
    FormComponent: QualifiedDataForm,
    GraphicComponent: QualifiedDataGraphic,
  },
  {
    id: 'personalized-outreach',
    label: 'Outreach',
    icon: Mail,
    defaultData: defaultPersonalizedOutreachData,
    defaultFormat: '16:9',
    forceFormat: true,
    getDisplayName: (d: any) => d.title,
    FormComponent: PersonalizedOutreachForm,
    GraphicComponent: PersonalizedOutreachGraphic,
  },
  {
    id: 'multichannel-outreach',
    label: 'Multichannel',
    icon: Radio,
    defaultData: defaultMultichannelOutreachData,
    defaultFormat: '16:9',
    forceFormat: true,
    getDisplayName: (d: any) => d.title,
    FormComponent: MultichannelOutreachForm,
    GraphicComponent: MultichannelOutreachGraphic,
  },
  {
    id: 'outbound-stack',
    label: 'Stack',
    icon: Layers,
    defaultData: defaultOutboundStackData,
    defaultFormat: '9:16',
    forceFormat: true,
    getDisplayName: (d: any) => d.title,
    FormComponent: OutboundStackForm,
    GraphicComponent: OutboundStackGraphic,
  },
  {
    id: 'agent-friendly',
    label: 'AI-Ready',
    icon: Bot,
    defaultData: defaultAgentFriendlyData,
    defaultFormat: '9:16',
    forceFormat: true,
    getDisplayName: (d: any) => d.title,
    FormComponent: AgentFriendlyForm,
    GraphicComponent: AgentFriendlyGraphic,
  },
  {
    id: 'linkedin-post',
    label: 'LinkedIn Post',
    icon: MessageSquareText,
    defaultData: defaultLinkedInPostData,
    defaultFormat: '1:1',
    forceFormat: false,
    getDisplayName: (d: any) => d.topLabel || 'LinkedIn Post',
    FormComponent: LinkedInPostForm,
    GraphicComponent: LinkedInPostGraphic,
  },
  {
    id: 'comparison',
    label: 'Vergleich',
    icon: GitCompare,
    defaultData: defaultComparisonData,
    defaultFormat: '1:1',
    forceFormat: false,
    getDisplayName: (d: any) => d.topLabel || 'Vergleich',
    FormComponent: ComparisonForm,
    GraphicComponent: ComparisonGraphic,
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: Clock,
    defaultData: defaultTimelineData,
    defaultFormat: '16:9',
    forceFormat: true,
    getDisplayName: (d: any) => d.topLabel || 'Timeline',
    FormComponent: TimelineForm,
    GraphicComponent: TimelineGraphic,
  },
  {
    id: 'funnel',
    label: 'Funnel',
    icon: Filter,
    defaultData: defaultFunnelData,
    defaultFormat: '1:1',
    forceFormat: false,
    getDisplayName: (d: any) => d.topLabel || 'Funnel',
    FormComponent: FunnelForm,
    GraphicComponent: FunnelGraphic,
  },
];

// ── Derived type & helper ───────────────────────────────────────
export type GraphicType = (typeof GRAPHIC_REGISTRY)[number]['id'];

export function getDefinition(id: string): GraphicDefinition {
  const def = GRAPHIC_REGISTRY.find((d) => d.id === id);
  if (!def) throw new Error(`Unknown graphic type: ${id}`);
  return def;
}
