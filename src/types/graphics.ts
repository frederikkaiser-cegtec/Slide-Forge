import type { ChartConfig } from './charts';

export interface CaseStudySection {
  title: string;
  intro?: string;
  bullets: string[];
}

export interface CaseStudyFunnelStep {
  label: string;
  value: string;
  pct: number;
  color: string;
}

export interface CaseStudyData {
  companyName: string;
  industry: string;
  headline: string;
  heroValue: string;
  heroLabel: string;
  metrics: Array<{ value: string; label: string }>;
  sections: CaseStudySection[];
  funnelSteps: CaseStudyFunnelStep[];
  quote: string;
  chart: ChartConfig;
  backgroundColor?: string;
  accentColor?: string;
  textColor?: string;
  labelColor?: string;
  tagline?: string;
  footerLeft?: string;
  footerRight?: string;
  ctaText?: string;
  ctaSub?: string;
  clientLogoUrl?: string;
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
  companyName: 'Caya GmbH',
  industry: 'SaaS / Dokumentenautomatisierung',
  headline: '329 Hausverwaltungen kontaktiert.\n12,5% Reply Rate. 8 Opportunities.',
  heroValue: '12,5%',
  heroLabel: 'Reply Rate',
  clientLogoUrl: 'https://cdn.prod.website-files.com/6683d1f8d68ae361de2dcf21/6683d1f8d68ae361de2dd061_caya-logo.svg',
  metrics: [
    { value: '329', label: 'Sequenzen gestartet' },
    { value: '12,5%', label: 'Reply Rate' },
    { value: '19,5%', label: 'Positive Reply Rate' },
    { value: '8', label: 'Opportunities' },
  ],
  sections: [
    {
      title: 'Ausgangssituation',
      intro: 'Caya ist ein Berliner SaaS-Unternehmen f\u00fcr Dokumentenautomatisierung. Kernprodukt: vollautomatische Postdigitalisierung f\u00fcr Hausverwaltungen mit ERP-Integration.',
      bullets: [
        'Zielgruppe: Hausverwaltungen in Deutschland mit hohem Postvolumen',
        'Value Prop: 30% mehr verwaltete Einheiten pro Mitarbeiter',
        'GoBD-konform und revisionssicher',
        'Kein skalierbarer Outreach-Prozess vorhanden',
        'Konservative Zielgruppe \u2014 generische Ansprache funktioniert nicht',
      ],
    },
    {
      title: 'L\u00f6sung',
      intro: 'CegTec baute eine fokussierte Cold Email Kampagne mit 3-Step-Sequenz:',
      bullets: [
        'Branchenspezifisches ICP \u2014 Hausverwaltungen mit ERP-Systemen',
        'Buying-Signal-Erkennung \u2014 Stellenausschreibungen, Wachstum, \u00dcbernahmen',
        'Compliance-Messaging \u2014 GoBD-Sicherheit als Hauptargument',
        '3-Step Email-Sequenz \u00fcber Instantly mit optimiertem Timing',
        'Konkrete ROI-Zahlen im Messaging: \u201e30% mehr Einheiten pro MA\u201c',
      ],
    },
    {
      title: 'Ergebnisse',
      intro: 'Die Kampagne lieferte \u00fcberdurchschnittliche Ergebnisse:',
      bullets: [
        '329 Sequenzen gestartet',
        '12,5% Reply Rate (41 Replies) \u2014 weit \u00fcber Benchmark',
        '19,5% Positive Reply Rate (8 von 41 positiv)',
        '8 Opportunities generiert',
        'Step 1 am st\u00e4rksten: 25 Replies, 6 Opportunities',
        'Step 2+3 brachten 16 weitere Replies',
      ],
    },
  ],
  funnelSteps: [
    { label: 'Sequences started', value: '329', pct: 100, color: '#3B82F6' },
    { label: 'Step 2 reached', value: '236', pct: 71.7, color: '#22C55E' },
    { label: 'Step 3 reached', value: '119', pct: 36.2, color: '#F59E0B' },
    { label: 'Replied', value: '41', pct: 12.5, color: '#8B5CF6' },
    { label: 'Positive Replies', value: '8', pct: 2.4, color: '#4F46E5' },
    { label: 'Opportunities', value: '8', pct: 2.4, color: '#16A34A' },
  ],
  quote: '\u201eCegTec hat unseren Vertrieb komplett transformiert.\u201c',
  chart: {
    type: 'bar',
    title: 'Replies pro Step',
    data: [
      { label: 'Step 1', value: 25 },
      { label: 'Step 2', value: 10 },
      { label: 'Step 3', value: 6 },
    ],
  },
  tagline: 'Case Study',
  ctaText: 'Erstgespr\u00e4ch vereinbaren',
  ctaSub: 'Wir zeigen Ihnen in 30 Minuten, wie das f\u00fcr Ihre Zielgruppe funktioniert.',
  footerLeft: 'cegtec.net',
  footerRight: 'GTM Engineering Partner',
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
