import type { CaseStudyData, RoiData } from '../App';
import type { KpiBannerData } from '../components/graphics/KpiBannerGraphic';
import type { InfographicData } from '../components/graphics/InfographicGraphic';

/**
 * Extract a common "core" from any graphic type,
 * then map it into the target type.
 */
interface CoreData {
  companyName: string;
  industry: string;
  headline: string;
  metrics: { value: string; label: string; icon?: string }[];
  quote: string;
}

function extractCore(type: string, data: any): CoreData {
  switch (type) {
    case 'case-study': {
      const d = data as CaseStudyData;
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
    case 'roi': {
      const d = data as RoiData;
      return {
        companyName: '',
        industry: '',
        headline: d.title,
        metrics: d.metrics.map((m) => ({ value: m.value, label: m.label })),
        quote: d.subtitle,
      };
    }
    case 'kpi-banner': {
      const d = data as KpiBannerData;
      return {
        companyName: '',
        industry: '',
        headline: d.title,
        metrics: d.kpis.map((k) => ({ value: k.value, label: k.label, icon: k.icon })),
        quote: '',
      };
    }
    case 'infographic': {
      const d = data as InfographicData;
      return {
        companyName: d.companyName,
        industry: d.industry,
        headline: d.headline,
        metrics: d.metrics,
        quote: d.quote,
      };
    }
    default:
      return { companyName: '', industry: '', headline: '', metrics: [], quote: '' };
  }
}

function m(core: CoreData, i: number): { value: string; label: string; icon: string } {
  const met = core.metrics[i];
  return met
    ? { value: met.value, label: met.label, icon: met.icon || '' }
    : { value: '0', label: '-', icon: '' };
}

export function syncToCaseStudy(fromType: string, fromData: any, current: CaseStudyData): CaseStudyData {
  if (fromType === 'revenue-systems') return current;
  const core = extractCore(fromType, fromData);
  return {
    ...current,
    companyName: core.companyName || current.companyName,
    industry: core.industry || current.industry,
    headline: core.headline || current.headline,
    metricValue: m(core, 0).value,
    metricLabel: m(core, 0).label,
    metric2Value: m(core, 1).value,
    metric2Label: m(core, 1).label,
    metric3Value: m(core, 2).value,
    metric3Label: m(core, 2).label,
    quote: core.quote || current.quote,
  };
}

export function syncToRoi(fromType: string, fromData: any, current: RoiData): RoiData {
  if (fromType === 'revenue-systems') return current;
  const core = extractCore(fromType, fromData);
  const colors: ('blue' | 'pink')[] = ['blue', 'pink'];
  return {
    ...current,
    title: core.headline || current.title,
    subtitle: core.quote || current.subtitle,
    metrics: core.metrics.slice(0, 6).map((met, i) => ({
      value: met.value,
      label: met.label,
      color: colors[i % 2],
    })),
  };
}

export function syncToKpiBanner(fromType: string, fromData: any, current: KpiBannerData): KpiBannerData {
  if (fromType === 'revenue-systems') return current;
  const core = extractCore(fromType, fromData);
  const colors: ('blue' | 'green')[] = ['blue', 'green'];
  return {
    ...current,
    title: core.headline || current.title,
    kpis: core.metrics.slice(0, 7).map((met, i) => ({
      icon: met.icon || ['📊', '📧', '🎯', '💰', '👥', '💬', '📈'][i % 7],
      value: met.value,
      label: met.label,
      color: colors[i % 2],
    })),
  };
}

export function syncToInfographic(fromType: string, fromData: any, current: InfographicData): InfographicData {
  if (fromType === 'revenue-systems') return current;
  const core = extractCore(fromType, fromData);
  return {
    ...current,
    companyName: core.companyName || current.companyName,
    industry: core.industry || current.industry,
    headline: core.headline || current.headline,
    metrics: core.metrics.slice(0, 3).map((met, i) => ({
      value: met.value,
      label: met.label,
      icon: met.icon || ['\u2191', '\u23F1', '\u26A1'][i % 3],
    })),
    quote: core.quote || current.quote,
  };
}
