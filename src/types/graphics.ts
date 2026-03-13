import type { ChartConfig } from './charts';

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

export const defaultCaseStudy: CaseStudyData = {
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

export const defaultRoi: RoiData = {
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
