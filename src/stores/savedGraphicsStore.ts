import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InfographicData } from '../components/graphics/InfographicGraphic';
import type { LinkedInPostData } from '../components/graphics/LinkedInPostGraphic';
import { defaultOutreachPipelineData } from '../components/graphics/OutreachPipelineGraphic';
import { defaultPromptCardData } from '../components/graphics/PromptCardGraphic';
import { CEGTEC_LIGHT_DEFAULTS, BRAND_LIGHT, BRAND_DARK } from '../utils/cegtecTheme';

export interface SavedGraphic {
  id: string;
  name: string;
  type: string;
  data: any;
  formatId: string;
  savedAt: number;
}

// Brand colors from brand.json (via cegtecTheme)
const CT = BRAND_LIGHT;
const CT_DARK = BRAND_DARK;

function ctLight(d: Partial<InfographicData>): InfographicData {
  return {
    accentColor: CT.accent, accentColor2: CT.accent2,
    backgroundColor: CT.bg, textColor: CT.text, labelColor: CT.label,
    cardColor: CT.card, cardBorderColor: CT.border, kpiTagColor: CT.tag,
    ...d,
  } as InfographicData;
}
function ctDark(d: Partial<InfographicData>): InfographicData {
  return {
    accentColor: CT_DARK.accent, accentColor2: CT_DARK.accent2,
    backgroundColor: CT_DARK.bg, textColor: CT_DARK.text, labelColor: CT_DARK.label,
    cardColor: CT_DARK.card, cardBorderColor: CT_DARK.border, kpiTagColor: CT_DARK.tag,
    ...d,
  } as InfographicData;
}

const SEED_INFOGRAPHICS: SavedGraphic[] = [
  // ── 1. JOMAVIS SOLAR ─────────────────────────────────────
  {
    id: 'preset-jomavis-hell',
    name: 'Jomavis Solar \u2014 ROI 22x (Hell)',
    type: 'infographic',
    formatId: 'og',
    savedAt: Date.now(),
    data: ctLight({
      companyName: 'Jomavis Solar GmbH',
      industry: 'Solar / Dachpacht',
      headline: '2.250\u20AC investiert \u2192 100.000\u20AC Marge: 22x ROI',
      subline: 'CegTec AI Outreach \u2014 112 Leads in 3 Stunden, Deal in 2 Wochen',
      metrics: [
        { value: '22x', label: 'Return on Investment', icon: '\uD83D\uDCB0', tag: 'ROI' },
        { value: '7', label: 'Meetings in 2 Wochen', icon: '\uD83C\uDFAF', tag: 'MEETINGS' },
        { value: '17%', label: 'Response Rate', icon: '\uD83D\uDCE8', tag: 'REPLIES' },
      ],
      funnelSteps: [
        { label: 'Kontaktiert', value: '112', pct: 100 },
        { label: 'Antworten', value: '18', pct: 16.1 },
        { label: 'Meetings', value: '7', pct: 6.3 },
        { label: 'Deal', value: '1', pct: 0.9 },
      ],
      quote: '\u201e112 Leads in 3 Stunden kontaktiert \u2014 1 Deal, 250 kWp Anlage, 100k\u20AC Marge.\u201c',
      ctaText: 'cegtec.net/case-studies',
      funnelTitle: 'Outreach Funnel',
      funnelSubtitle: '3 STUNDEN \u2192 2 WOCHEN',
    }),
  },
  {
    id: 'preset-jomavis-dunkel',
    name: 'Jomavis Solar \u2014 ROI 22x (Dunkel)',
    type: 'infographic',
    formatId: 'og',
    savedAt: Date.now(),
    data: ctDark({
      companyName: 'Jomavis Solar GmbH',
      industry: 'Solar / Dachpacht',
      headline: '2.250\u20AC investiert \u2192 100.000\u20AC Marge: 22x ROI',
      subline: 'CegTec AI Outreach \u2014 112 Leads in 3 Stunden, Deal in 2 Wochen',
      metrics: [
        { value: '22x', label: 'Return on Investment', icon: '\uD83D\uDCB0', tag: 'ROI' },
        { value: '7', label: 'Meetings in 2 Wochen', icon: '\uD83C\uDFAF', tag: 'MEETINGS' },
        { value: '17%', label: 'Response Rate', icon: '\uD83D\uDCE8', tag: 'REPLIES' },
      ],
      funnelSteps: [
        { label: 'Kontaktiert', value: '112', pct: 100 },
        { label: 'Antworten', value: '18', pct: 16.1 },
        { label: 'Meetings', value: '7', pct: 6.3 },
        { label: 'Deal', value: '1', pct: 0.9 },
      ],
      quote: '\u201e112 Leads in 3 Stunden kontaktiert \u2014 1 Deal, 250 kWp Anlage, 100k\u20AC Marge.\u201c',
      ctaText: 'cegtec.net/case-studies',
      funnelTitle: 'Outreach Funnel',
      funnelSubtitle: '3 STUNDEN \u2192 2 WOCHEN',
    }),
  },
  {
    id: 'preset-jomavis-conversion',
    name: 'Jomavis Solar \u2014 Conversion Focus (Hell)',
    type: 'infographic',
    formatId: 'og',
    savedAt: Date.now(),
    data: ctLight({
      companyName: 'Jomavis Solar GmbH',
      industry: 'Solar / Dachpacht',
      headline: 'Von 112 Kontakten zum 250 kWp Deal',
      subline: 'CegTec Precision Outreach \u2014 Vollst\u00e4ndig dokumentierte Case Study',
      metrics: [
        { value: '6,6%', label: 'Lead-to-Meeting Conversion', icon: '\uD83D\uDCC8', tag: 'CONVERSION' },
        { value: '250 kWp', label: 'Anlagengr\u00f6\u00dfe', icon: '\u2600\uFE0F', tag: 'DEAL SIZE' },
        { value: '2.200%', label: 'ROI auf Investment', icon: '\uD83D\uDE80', tag: 'RENDITE' },
      ],
      funnelSteps: [
        { label: 'Investment', value: '2.250\u20AC', pct: 2.3 },
        { label: 'Leads', value: '112', pct: 100 },
        { label: 'Responses', value: '18', pct: 16.1 },
        { label: 'Meetings', value: '7', pct: 6.3 },
        { label: 'Marge', value: '100.000\u20AC', pct: 89 },
      ],
      quote: '\u201eInvestment 2.250\u20AC \u2192 Marge 100.000\u20AC. In nur 2 Wochen.\u201c',
      ctaText: 'cegtec.net/solar',
      funnelTitle: 'Investment \u2192 Return',
      funnelSubtitle: '14 TAGE',
    }),
  },

  // ── 2. PROSELLER AG ───────────────────────────────────────
  {
    id: 'preset-proseller-hell',
    name: 'ProSeller AG \u2014 Multichannel (Hell)',
    type: 'infographic',
    formatId: 'og',
    savedAt: Date.now(),
    data: ctLight({
      companyName: 'ProSeller AG',
      industry: 'IT-Distribution / Concerto Platform',
      headline: 'Multichannel Outreach: LinkedIn + Email DACH',
      subline: 'CegTec AI Sales Automation \u2014 Aug 2025 bis Feb 2026, 10 Kampagnen',
      metrics: [
        { value: '9,9%', label: 'Email Reply Rate', icon: '\uD83D\uDCE7', tag: 'EMAIL' },
        { value: '36,6%', label: 'LinkedIn Acceptance Rate', icon: '\uD83D\uDD17', tag: 'LINKEDIN' },
        { value: '28,7%', label: 'LinkedIn Reply Rate', icon: '\uD83D\uDCAC', tag: 'ENGAGEMENT' },
      ],
      funnelSteps: [
        { label: 'Email kontaktiert', value: '2.777', pct: 100 },
        { label: 'Email Replies', value: '275', pct: 9.9 },
        { label: 'LI Connections', value: '1.494', pct: 53.8 },
        { label: 'LI Accepted', value: '547', pct: 36.6 },
        { label: 'LI Replies', value: '191', pct: 12.8 },
      ],
      quote: '\u201eMultichannel-Ansatz \u00fcber 3 Zielgruppen: Reseller, Distributoren, Hersteller.\u201c',
      ctaText: 'cegtec.net/case-studies',
      funnelTitle: 'Multichannel Funnel',
      funnelSubtitle: '6 MONATE \u2022 10 KAMPAGNEN',
    }),
  },
  {
    id: 'preset-proseller-linkedin',
    name: 'ProSeller AG \u2014 LinkedIn Deep Dive (Dunkel)',
    type: 'infographic',
    formatId: 'og',
    savedAt: Date.now(),
    data: ctDark({
      companyName: 'ProSeller AG',
      industry: 'IT-Distribution / Concerto Platform',
      headline: 'LinkedIn Authority: 36,6% Acceptance Rate',
      subline: 'St\u00e4rkste Kampagne: Distributor DACH Gesch\u00e4ftsleitung',
      metrics: [
        { value: '35,5%', label: 'Best Acceptance Rate', icon: '\uD83C\uDFC6', tag: 'TOP KAMPAGNE' },
        { value: '15,9%', label: 'Best Reply Rate', icon: '\uD83D\uDCAC', tag: 'ENGAGEMENT' },
        { value: '7,2%', label: 'Interested Rate', icon: '\uD83C\uDFAF', tag: 'INTERESSE' },
      ],
      funnelSteps: [
        { label: 'Sent', value: '1.494', pct: 100 },
        { label: 'Accepted', value: '547', pct: 36.6 },
        { label: 'Replied', value: '191', pct: 28.7 },
        { label: 'Interested', value: '42', pct: 7.2 },
      ],
      quote: '\u201eDistributor DACH Gesch\u00e4ftsleitung: 35,5% Acceptance, 15,9% Reply.\u201c',
      ctaText: 'cegtec.net/linkedin',
      funnelTitle: 'LinkedIn Funnel',
      funnelSubtitle: 'BEST CAMPAIGN',
    }),
  },

  // ── 3. JOCHEN SCHWEIZER MYDAYS ────────────────────────────
  {
    id: 'preset-jsmd-hell',
    name: 'JSMD \u2014 B2B Events (Hell)',
    type: 'infographic',
    formatId: 'og',
    savedAt: Date.now(),
    data: ctLight({
      companyName: 'Jochen Schweizer mydays',
      industry: 'B2B Events / Recruiting',
      headline: '6,3% Reply Rate bei 2.700+ Entscheidern',
      subline: 'CegTec AI Outreach \u2014 8 Kampagnen, Finance & Pharma DACH',
      metrics: [
        { value: '2.700+', label: 'Entscheider kontaktiert', icon: '\uD83D\uDC64', tag: 'REACH' },
        { value: '6,3%', label: 'Reply Rate', icon: '\uD83D\uDCE8', tag: 'REPLIES' },
        { value: '8', label: 'Instantly-Kampagnen', icon: '\uD83D\uDCE1', tag: 'KAMPAGNEN' },
      ],
      funnelSteps: [
        { label: 'Kontaktiert', value: '2.700+', pct: 100 },
        { label: 'Ge\u00f6ffnet', value: '~1.620', pct: 60 },
        { label: 'Replies', value: '~170', pct: 6.3 },
        { label: 'Interessiert', value: 'k.A.', pct: 2 },
      ],
      quote: '\u201eBrand Safety, Hands-off Delivery, Qualit\u00e4t vor Quantit\u00e4t.\u201c',
      ctaText: 'cegtec.net/case-studies',
      funnelTitle: 'Outreach Funnel',
      funnelSubtitle: 'FINANCE & PHARMA DACH',
    }),
  },
  {
    id: 'preset-jsmd-sap',
    name: 'JSMD \u2014 SAP Referenz (Dunkel)',
    type: 'infographic',
    formatId: 'og',
    savedAt: Date.now(),
    data: ctDark({
      companyName: 'Jochen Schweizer mydays',
      industry: 'B2B Events / Recruiting',
      headline: 'SAP-Referenz: 400 Gutscheine/Jahr, 4,3 Sterne',
      subline: 'Personalvermittlung DACH \u2014 Kununu-Scoring Kampagnen',
      metrics: [
        { value: '400', label: 'Gutscheine/Jahr (SAP)', icon: '\uD83C\uDF81', tag: 'REFERENZ' },
        { value: '4,3\u2605', label: 'Kununu-Bewertung', icon: '\u2B50', tag: 'RATING' },
        { value: '8', label: 'Kampagnen aktiv', icon: '\uD83D\uDCCA', tag: 'VOLUMEN' },
      ],
      funnelSteps: [
        { label: 'Entscheider', value: '2.700+', pct: 100 },
        { label: 'Finance DACH', value: '~900', pct: 33 },
        { label: 'Pharma DACH', value: '~900', pct: 33 },
        { label: 'Reply Rate', value: '6,3%', pct: 6.3 },
      ],
      quote: '\u201eWeihnachts-Aktion als konkretes Erfolgsbeispiel. Video Case Study geplant.\u201c',
      ctaText: 'cegtec.net/events',
      funnelTitle: 'Kampagnen\u00fcbersicht',
      funnelSubtitle: 'KUNUNU-SCORING',
    }),
  },

  // ── 4. RENK AG ────────────────────────────────────────────
  {
    id: 'preset-renk-hell',
    name: 'RENK AG \u2014 \u00dcbersicht (Hell)',
    type: 'infographic',
    formatId: 'og',
    savedAt: Date.now(),
    data: ctLight({
      companyName: 'RENK AG',
      industry: 'Defence / Wind / Agri',
      headline: '7.129 Kontakte, 789 Replies, 15 Kampagnen',
      subline: 'CegTec AI Outreach \u2014 Defence, Wind & Agri ENG/DACH',
      metrics: [
        { value: '11,1%', label: 'Reply Rate gesamt', icon: '\uD83D\uDCE8', tag: 'REPLIES' },
        { value: '99,7%', label: 'Delivery Rate', icon: '\u2705', tag: 'DELIVERY' },
        { value: '15', label: 'Kampagnen', icon: '\uD83D\uDCE1', tag: 'KAMPAGNEN' },
      ],
      funnelSteps: [
        { label: 'Kontaktiert', value: '7.129', pct: 100 },
        { label: 'Delivered', value: '7.107', pct: 99.7 },
        { label: 'Opened', value: '1.555', pct: 21.9 },
        { label: 'Replied', value: '789', pct: 11.1 },
        { label: 'Interested', value: '35', pct: 0.5 },
      ],
      quote: '\u201e15 Kampagnen \u00fcber 3 Branchen: Defence, Wind, Agriculture.\u201c',
      ctaText: 'cegtec.net/case-studies',
      funnelTitle: 'Outreach Funnel',
      funnelSubtitle: '15 KAMPAGNEN \u2022 3 BRANCHEN',
    }),
  },
  {
    id: 'preset-renk-dunkel',
    name: 'RENK AG \u2014 \u00dcbersicht (Dunkel)',
    type: 'infographic',
    formatId: 'og',
    savedAt: Date.now(),
    data: ctDark({
      companyName: 'RENK AG',
      industry: 'Defence / Wind / Agri',
      headline: '7.129 Kontakte, 789 Replies, 15 Kampagnen',
      subline: 'CegTec AI Outreach \u2014 Defence, Wind & Agri ENG/DACH',
      metrics: [
        { value: '11,1%', label: 'Reply Rate gesamt', icon: '\uD83D\uDCE8', tag: 'REPLIES' },
        { value: '99,7%', label: 'Delivery Rate', icon: '\u2705', tag: 'DELIVERY' },
        { value: '15', label: 'Kampagnen', icon: '\uD83D\uDCE1', tag: 'KAMPAGNEN' },
      ],
      funnelSteps: [
        { label: 'Kontaktiert', value: '7.129', pct: 100 },
        { label: 'Delivered', value: '7.107', pct: 99.7 },
        { label: 'Opened', value: '1.555', pct: 21.9 },
        { label: 'Replied', value: '789', pct: 11.1 },
        { label: 'Interested', value: '35', pct: 0.5 },
      ],
      quote: '\u201e15 Kampagnen \u00fcber 3 Branchen: Defence, Wind, Agriculture.\u201c',
      ctaText: 'cegtec.net/case-studies',
      funnelTitle: 'Outreach Funnel',
      funnelSubtitle: '15 KAMPAGNEN \u2022 3 BRANCHEN',
    }),
  },
  {
    id: 'preset-renk-wind',
    name: 'RENK AG \u2014 Wind Best Campaign (Hell)',
    type: 'infographic',
    formatId: 'og',
    savedAt: Date.now(),
    data: ctLight({
      companyName: 'RENK AG',
      industry: 'Wind Energy',
      headline: 'Wind DACH: 41,9% Open Rate, 23,3% Reply Rate',
      subline: 'St\u00e4rkste Kampagne: Strategic Influencer Wind DACH',
      metrics: [
        { value: '41,9%', label: 'Open Rate (Best)', icon: '\uD83D\uDCE7', tag: 'OPENS' },
        { value: '23,3%', label: 'Reply Rate (Best)', icon: '\uD83D\uDCAC', tag: 'REPLIES' },
        { value: '4,7%', label: 'Interested Rate', icon: '\uD83C\uDFAF', tag: 'INTERESSE' },
      ],
      funnelSteps: [
        { label: 'Wind DACH Strategic', value: 'Top', pct: 100 },
        { label: 'Open Rate', value: '41,9%', pct: 41.9 },
        { label: 'Reply Rate', value: '23,3%', pct: 23.3 },
        { label: 'Interested', value: '4,7%', pct: 4.7 },
        { label: 'Wind ENG User', value: '20,0% Reply', pct: 20 },
      ],
      quote: '\u201eWind DACH Strategic Influencer: Top-Performance \u00fcber alle Kampagnen.\u201c',
      ctaText: 'cegtec.net/wind',
      funnelTitle: 'Top Kampagnen',
      funnelSubtitle: 'WIND DACH + ENG',
    }),
  },
  // ── LINKEDIN POST: AI Agents vs. Schreibmaschine ─────────
  {
    id: 'preset-ai-agents-linkedin-hell',
    name: 'LinkedIn — AI Agents vs. Schreibmaschine (Hell)',
    type: 'infographic',
    formatId: 'og',
    savedAt: Date.now(),
    data: ctLight({
      companyName: 'CegTec GmbH',
      industry: 'AI Agents',
      headline: 'Autonome Agenten vs. Schreibmaschine',
      subline: 'Warum KI im B2B mehr kann als Text generieren — Zahlen, die den Unterschied zeigen',
      metrics: [
        { value: '65%', label: 'Workflows komplett automatisiert', icon: '\u2699\uFE0F', tag: 'AUTOMATION' },
        { value: '+40%', label: 'Sales-Produktivit\u00e4t mit AI Agents', icon: '\uD83D\uDCC8', tag: 'PRODUKTIVIT\u00C4T' },
        { value: '-65%', label: 'Response Time vs. Rule-Based', icon: '\u26A1', tag: 'GESCHWINDIGKEIT' },
      ],
      funnelSteps: [
        { label: 'Routine-Tasks autonom', value: '80%', pct: 80 },
        { label: 'ROI im ersten Jahr', value: '74%', pct: 74 },
        { label: 'Enterprise-Apps 2026', value: '40%', pct: 40 },
        { label: 'Handling-Kosten gesenkt', value: '30-40%', pct: 35 },
        { label: 'Sales Cycle verk\u00fcrzt', value: '25%', pct: 25 },
      ],
      quote: '\u201eDie Frage ist nicht mehr \u201AWen stellen wir ein?\u2018 sondern \u201AWie viele Agents deployen wir?\u2018\u201c \u2014 Gartner',
      ctaText: 'cegtec.net/platform',
      funnelTitle: 'AI Agent Impact',
      funnelSubtitle: 'GARTNER \u2022 GOOGLE CLOUD \u2022 G2',
    }),
  },
  {
    id: 'preset-ai-agents-linkedin-dunkel',
    name: 'LinkedIn — AI Agents vs. Schreibmaschine (Dunkel)',
    type: 'infographic',
    formatId: 'og',
    savedAt: Date.now(),
    data: ctDark({
      companyName: 'CegTec GmbH',
      industry: 'AI Agents',
      headline: 'Autonome Agenten vs. Schreibmaschine',
      subline: 'Warum KI im B2B mehr kann als Text generieren — Zahlen, die den Unterschied zeigen',
      metrics: [
        { value: '65%', label: 'Workflows komplett automatisiert', icon: '\u2699\uFE0F', tag: 'AUTOMATION' },
        { value: '+40%', label: 'Sales-Produktivit\u00e4t mit AI Agents', icon: '\uD83D\uDCC8', tag: 'PRODUKTIVIT\u00C4T' },
        { value: '-65%', label: 'Response Time vs. Rule-Based', icon: '\u26A1', tag: 'GESCHWINDIGKEIT' },
      ],
      funnelSteps: [
        { label: 'Routine-Tasks autonom', value: '80%', pct: 80 },
        { label: 'ROI im ersten Jahr', value: '74%', pct: 74 },
        { label: 'Enterprise-Apps 2026', value: '40%', pct: 40 },
        { label: 'Handling-Kosten gesenkt', value: '30-40%', pct: 35 },
        { label: 'Sales Cycle verk\u00fcrzt', value: '25%', pct: 25 },
      ],
      quote: '\u201eDie Frage ist nicht mehr \u201AWen stellen wir ein?\u2018 sondern \u201AWie viele Agents deployen wir?\u2018\u201c \u2014 Gartner',
      ctaText: 'cegtec.net/platform',
      funnelTitle: 'AI Agent Impact',
      funnelSubtitle: 'GARTNER \u2022 GOOGLE CLOUD \u2022 G2',
    }),
  },
];

// ── LinkedIn Post Presets ──────────────────────────────────────
const SEED_LINKEDIN_POSTS: SavedGraphic[] = [
  {
    id: 'preset-seo-hidden-cost-hell',
    name: 'LinkedIn — SEO Hidden Cost 2026 (Hell)',
    type: 'linkedin-post',
    formatId: '1:1',
    savedAt: Date.now(),
    data: {
      topLabel: 'SEO IST TOT? DIE ZAHLEN.',
      headline: 'Warum SEO allein\n2026 nicht mehr reicht.',
      subline: 'Gartner, SparkToro & Forrester zeigen: Der klassische Suchtraffic bricht ein.',
      gapTitle: 'DER RÜCKGANG',
      gapBars: [
        { value: '-25%', label: 'Suchvolumen bis 2026 — Gartner', pct: 75 },
        { value: '58,5%', label: 'Zero-Click-Suchen — SparkToro', pct: 58, color: '#F59E0B' },
        { value: '-61%', label: 'CTR bei AI Overviews — Seer Interactive', pct: 61, color: '#EF4444' },
      ],
      stats: [
        { value: '50%', label: 'der B2B-Buyer starten in AI Chatbots', source: 'FORRESTER' },
        { value: '+31%', label: 'Conversion bei AI-Traffic vs. Organic', source: 'SEL 2025' },
        { value: '96%', label: 'der AI Overview Quellen mit E-E-A-T', source: 'GOOGLE' },
      ],
      bullets: [
        { text: 'Topical Authority statt Keywords — KI zitiert nur Quellen mit echter Expertise (E-E-A-T).' },
        { text: 'Zero-Click akzeptieren — Content so strukturieren, dass Maschinen ihn als Faktenquelle nutzen.' },
        { text: 'Search Everywhere — LinkedIn, Reddit, Fachmedien: dort sein, wo Entscheidungen fallen.' },
      ],
      ctaQuestion: 'Siehst du den Rückgang bereits in deinen Daten?',
      ctaLine: 'cegtec.net',
      ...CEGTEC_LIGHT_DEFAULTS,
    } as LinkedInPostData,
  },
  // ── Post 2: Funnel Handoff / Speed to Lead ──────────────────
  {
    id: 'preset-funnel-handoff-hell',
    name: 'LinkedIn — Funnel Handoff / Speed to Lead (Hell)',
    type: 'linkedin-post',
    formatId: '1:1',
    savedAt: Date.now(),
    data: {
      topLabel: 'SPEED TO LEAD',
      headline: 'Dein Funnel hat kein\nTraffic-Problem.\nEr hat ein Handoff-Problem.',
      subline: 'MQL → SQL Conversion liegt im Schnitt bei 13 %. Der Rest versickert zwischen Marketing und Sales.',
      gapTitle: 'WO LEADS VERSICKERN',
      gapBars: [
        { value: '13%', label: 'Ø MQL-to-SQL Conversion Rate — Gartner / Salesforce', pct: 13 },
        { value: '42h', label: 'Ø Zeit bis zur ersten Sales-Reaktion — Chilipiper 2025', pct: 35, color: '#F59E0B' },
        { value: '79%', label: 'der MQLs konvertieren nie zu einem Sale — Benchmarks', pct: 79, color: '#EF4444' },
      ],
      stats: [
        { value: '391%', label: 'höhere Conversion bei Antwort in <1 Minute', source: 'CALLPAGE 2025' },
        { value: '79%', label: 'der MQLs konvertieren nie — weil kein Follow-up kommt', source: 'BENCHMARKS 2025' },
        { value: '5 Min', label: 'nach 5 Minuten sinkt die Conversion um 80 %', source: 'CHILI PIPER 2025' },
      ],
      bullets: [
        { text: 'Speed to Lead entscheidet — nach 5 Minuten sinkt die Conversion um 80 %. Die meisten Teams antworten in 42 Stunden.' },
        { text: '79 % der MQLs versickern — nicht wegen schlechter Qualität, sondern weil kein zeitnahes Follow-up kommt.' },
        { text: 'Der Funnel ist kein Marketing-Problem — er ist ein Handoff-Problem zwischen Marketing, SDR und Sales.' },
      ],
      ctaQuestion: 'Wie schnell antwortet dein Team auf einen qualifizierten Lead?',
      ctaLine: 'cegtec.net',
      ...CEGTEC_LIGHT_DEFAULTS,
    } as LinkedInPostData,
  },
  // ── Post 3: Email Deliverability ────────────────────────────
  {
    id: 'preset-email-deliverability-hell',
    name: 'LinkedIn — Email Deliverability (Hell)',
    type: 'linkedin-post',
    formatId: '1:1',
    savedAt: Date.now(),
    data: {
      topLabel: 'EMAIL DELIVERABILITY',
      headline: 'Dein Outreach-Problem ist\nnicht dein Text.\nEs ist deine Infrastruktur.',
      subline: 'Jede 6. E-Mail erreicht den Posteingang nicht – und du merkst es nicht.',
      gapTitle: 'WO DEINE MAILS LANDEN',
      gapBars: [
        { value: '84%', label: 'Inbox Placement Rate global (Validity 2025)', pct: 84 },
        { value: '9,1%', label: 'Ø Spam Landing Rate (Saleshandy 2026)', pct: 9, color: '#F59E0B' },
        { value: '0,1%', label: 'Gmail Spam-Beschwerde-Schwelle (Google Guidelines)', pct: 3, color: '#EF4444' },
      ],
      stats: [
        { value: '3,43%', label: 'Ø Reply Rate (Top 10 %: über 10 %)', source: 'INSTANTLY 2026' },
        { value: '84%', label: 'globale Inbox Placement Rate', source: 'VALIDITY 2025' },
        { value: '50%', label: 'mehr Leads durch bessere Deliverability bei -33 % Kosten', source: 'MARTAL 2026' },
      ],
      bullets: [
        { text: 'Jede 6. Mail landet im Spam — ohne Bounce, ohne Fehlermeldung, ohne dass du es merkst.' },
        { text: 'Gmail blockt ab 0,1 % Beschwerderate — 1 Beschwerde pro 1.000 Mails reicht.' },
        { text: 'Infrastruktur vor Copywriting — SPF, DKIM, DMARC und Domain Warmup entscheiden über Erfolg.' },
      ],
      ctaQuestion: 'Wann hast du das letzte Mal deine Sender Reputation geprüft?',
      ctaLine: 'cegtec.net',
      ...CEGTEC_LIGHT_DEFAULTS,
    } as LinkedInPostData,
  },
  // ── Post 4: Dark Funnel & Attribution ───────────────────────
  {
    id: 'preset-dark-funnel-hell',
    name: 'LinkedIn — Dark Funnel & Attribution (Hell)',
    type: 'linkedin-post',
    formatId: '1:1',
    savedAt: Date.now(),
    data: {
      topLabel: 'DARK FUNNEL & ATTRIBUTION',
      headline: 'Dein Attribution-Report lügt.\n70 % der Buyer Journey\nsind unsichtbar.',
      subline: 'Käufer entscheiden in Kanälen, die dein Dashboard nie sieht.',
      gapTitle: 'DIE UNSICHTBARE JOURNEY',
      gapBars: [
        { value: '57%', label: 'Buyer Journey vor Vendorkontakt (UK/IE) — MarketOne / 6sense 2025', pct: 57 },
        { value: '73%', label: 'Buyer Journey vor Vendorkontakt (APAC) — Green Hat / 6sense', pct: 73 },
        { value: '61%', label: 'Buyer Journey vor Vendorkontakt (global) — 6sense 2025', pct: 61 },
      ],
      stats: [
        { value: '84%', label: 'der Käufer haben ihren Anbieter gewählt bevor sie Sales kontaktieren', source: '6SENSE 2025' },
        { value: '78 vs. 85%', label: 'Software sagt Websuche, Käufer sagen Dark Social', source: 'REFINE LABS' },
        { value: '70–80%', label: 'der Recherche passieren vor dem ersten Sales-Kontakt', source: 'FORRESTER 2025' },
      ],
      bullets: [
        { text: 'Käufer entscheiden ohne dich — 84 % haben ihren Anbieter gewählt bevor die Evaluation startet.' },
        { text: 'Last-Click belügt dich — Software-Attribution und Self-Reported Attribution erzählen komplett verschiedene Geschichten.' },
        { text: 'KI macht es schlimmer — 94 % der B2B-Käufer nutzen LLMs im Kaufprozess, mit null Attribution.' },
      ],
      ctaQuestion: 'Was sagt dein CRM – und was sagen deine Kunden?',
      ctaLine: 'cegtec.net',
      ...CEGTEC_LIGHT_DEFAULTS,
    } as LinkedInPostData,
  },
  // ── Post 5: Lead Quality vs. Volume ─────────────────────────
  {
    id: 'preset-lead-quality-hell',
    name: 'LinkedIn — Lead Quality vs. Volume (Hell)',
    type: 'linkedin-post',
    formatId: '1:1',
    savedAt: Date.now(),
    data: {
      topLabel: 'LEAD QUALITY VS. VOLUME',
      headline: 'Weniger Leads.\nBessere Leads.\nMehr Umsatz.',
      subline: '79 % der MQLs konvertieren nie – weil Volumen keine Strategie ist.',
      gapTitle: 'QUALITY VS. QUANTITY',
      gapBars: [
        { value: '79%', label: 'MQLs die nie konvertieren — Benchmarks 2025', pct: 79, color: '#EF4444' },
        { value: '5–20%', label: 'Leads die als hochwertig gelten — Prospectvine 2026', pct: 12 },
        { value: '40%', label: 'Close Rate qualifizierte Leads — Prospectvine 2026', pct: 40 },
        { value: '11%', label: 'Close Rate unqualifizierte Leads — Prospectvine 2026', pct: 11, color: '#F59E0B' },
      ],
      stats: [
        { value: '92%', label: 'der Käufer starten mit einem Anbieter im Kopf', source: '6SENSE 2025' },
        { value: '33%', label: 'niedrigere Kosten bei Fokus auf Lead-Qualität', source: 'PROSPECTVINE 2026' },
        { value: '208%', label: 'mehr Marketing-Revenue bei Sales-Marketing Alignment', source: 'MONDAY.COM 2026' },
      ],
      bullets: [
        { text: 'Volumen ist eine Vanity Metric — nur 5–20 % aller Leads sind qualitativ hochwertig.' },
        { text: 'Der Käufer hat schon entschieden — 92 % starten mit einem Anbieter im Kopf, 41 % haben bereits gewählt.' },
        { text: 'Präzision senkt Kosten — 33 % weniger Kosten, 50 % mehr Abschlüsse bei Quality-First.' },
      ],
      ctaQuestion: 'Misst du noch Lead-Volumen oder schon Pipeline-Qualität?',
      ctaLine: 'cegtec.net',
      ...CEGTEC_LIGHT_DEFAULTS,
    } as LinkedInPostData,
  },
];

const _base = defaultOutreachPipelineData;

const _pv = {
  topLabel: 'MANAGED OUTREACH',
  title: 'So füllen wir\nIhren Kalender.',
  subtitle: 'Von der ersten Adresse bis zum gebuchten Termin — wie wir Dacheigentümer für Sie finden und ansprechen.',
  footerText: 'cegtec.net',
  backgroundColor: '#FAFAF8',
  textColor: '#1C1917',
  labelColor: '#78716C',
  borderColor: '#E7E5E4',
  phases: [
    {
      label: 'Phase 1 — Zieldefinition',
      accentColor: '#B45309',
      bgColor: '#FFFBEB',
      result: 'Klare Strategie: Wen wir ansprechen und wie.',
      steps: [
        {
          num: '1',
          title: 'Zielgebiet & Kriterien',
          desc: 'Gemeinsam legen wir fest: Welche Region, welche Dachgröße, welche Branchen? Auf Basis Ihrer bisherigen Projekte definieren wir, welche Eigentümer wirklich passen.',
          tools: ['Kick-off Call', 'Playbook'],
        },
        {
          num: '2',
          title: 'Botschaft & Angebot',
          desc: 'Welches Angebot, welche Sprache, welcher Kanal? Wir entwickeln die Nachricht, die Dacheigentümer zum Antworten bringt — klar, konkret, ohne Fachchinesisch.',
          tools: ['CegTec Playbook'],
        },
      ],
    },
    {
      label: 'Phase 2 — Aufbau & Listen',
      accentColor: '#C2410C',
      bgColor: '#FFF7ED',
      result: 'Saubere Infrastruktur und eine verifizierte Lead-Liste.',
      steps: [
        {
          num: '3',
          title: 'E-Mail-Setup',
          desc: 'Eigene Absender-Domain, technische Konfiguration, 2–4 Wochen Aufwärmphase. So landen Ihre Nachrichten im Posteingang — nicht im Spam-Ordner.',
          tools: ['Instantly', 'DNS'],
        },
        {
          num: '4',
          title: 'Lead-Liste aufbauen',
          desc: 'Adressen, Eigentümer, Ansprechpartner, Dachfläche — alles zusammengestellt, gefiltert nach Ihren Kriterien. Keine gekauften Altdaten, sondern frisch recherchiert.',
          tools: ['Clay', 'Adressdaten'],
        },
      ],
    },
    {
      label: 'Phase 3 — Datenpflege',
      accentColor: '#0D9488',
      bgColor: '#F0FDFA',
      result: 'Jeder Kontakt kennt Ihr Angebot — bevor Sie sprechen.',
      steps: [
        {
          num: '5',
          title: 'Anreicherung',
          desc: 'E-Mail verifiziert, LinkedIn-Profil zugeordnet, Dachfläche abgeschätzt, Firma geprüft. Mehr Kontext bedeutet bessere Nachrichten und höhere Antwortrate.',
          tools: ['Clay', 'Waterfall'],
        },
        {
          num: '5.5',
          title: 'Qualitätsprüfung',
          desc: 'Nur Kontakte mit vollständigen, verifizierten Daten kommen in die Kampagne. Schlechte Daten kosten Geld und Reputation — deshalb prüfen wir jeden Lead.',
          tools: ['QA-Check'],
        },
        {
          num: '6',
          title: 'Personalisierung',
          desc: 'Jede Nachricht wird individuell angepasst — mit Firmenname, Adresse und geschätztem Pacht-Ertrag. Klingt persönlich geschrieben, läuft vollautomatisch.',
          tools: ['KI-Texte', 'Clay AI'],
        },
      ],
    },
    {
      label: 'Phase 4 — Ansprache',
      accentColor: '#1D4ED8',
      bgColor: '#EFF6FF',
      result: 'Kampagne läuft. Erste Antworten in 48–72 Stunden.',
      steps: [
        {
          num: '7',
          title: 'Nachrichten aufsetzen',
          desc: '4 aufeinander aufbauende Nachrichten: Erstkontakt, Mehrwert, Referenz, Abschluss. Jede Stufe hat einen klaren Zweck — keine leeren Floskeln.',
          tools: ['Instantly', 'HeyReach'],
        },
        {
          num: '8',
          title: 'Kampagne starten',
          desc: 'E-Mail und LinkedIn gleichzeitig, automatisch versendet, DSGVO-konform. Sie müssen nichts tun — wir übernehmen den kompletten Versand und das Timing.',
          tools: ['Instantly', 'HeyReach'],
        },
      ],
    },
    {
      label: 'Phase 5 — Ergebnisse',
      accentColor: '#15803D',
      bgColor: '#F0FDF4',
      result: 'Termine mit echten Interessenten. Direkt in Ihrem Kalender.',
      steps: [
        {
          num: '9',
          title: 'Auswertung & Anpassung',
          desc: 'Was funktioniert, was nicht? Wir stoppen schwache Nachrichten und verstärken was antwortet. Sie bekommen ein wöchentliches Update mit klaren Zahlen.',
          tools: ['Analytics', 'Reporting'],
        },
        {
          num: '10',
          title: 'Übergabe',
          desc: 'Interessierte Kontakte mit allem was Sie wissen müssen: Wer hat geantwortet, was haben sie gesagt, welcher Schritt kommt als nächstes. Vollständig dokumentiert.',
          tools: ['HubSpot'],
        },
        {
          num: '11',
          title: 'Termin im Kalender',
          desc: 'Gebuchte Gespräche mit vorqualifizierten Dacheigentümern. Wie JOMAVIS Solar: 112 kontaktiert, 7 Meetings, 1 Deal in 2 Wochen.',
          tools: ['Calendly'],
        },
      ],
    },
  ],
};

// ── v2 Sunny · Trust-Building Variante ─────────────────────────────
// Ziel: Dacheigentümer (nicht vom Fach) durch TRANSPARENZ überzeugen.
// Tool-Namen drin, aber mit Klartext-Erklärung. Warme Sonnenaufgang-Palette.
// Phasen → "Kapitel" (Leser-Metapher statt Corporate-Phasen).
const _pvSunny = {
  topLabel: 'UNSERE VORGEHENSWEISE',
  title: 'So füllen wir\nIhren Kalender.',
  subtitle: 'Von der ersten Adresse bis zum gebuchten Termin — Schritt für Schritt transparent erklärt, damit Sie genau wissen, was bei uns passiert.',
  footerText: 'cegtec.net',
  backgroundColor: '#FFFBF5',
  textColor: '#44403C',
  labelColor: '#78716C',
  borderColor: '#EADFC9',
  phases: [
    {
      label: 'Kapitel 1 — Wir lernen Sie kennen',
      accentColor: '#CA8A04',
      bgColor: '#FEF9C3',
      result: 'Sie wissen genau, was wir machen — und wir wissen, wen Sie suchen.',
      steps: [
        {
          num: '1',
          title: 'Zielgebiet & Kriterien',
          desc: 'Wir setzen uns 30 Minuten zusammen und klären: Welche Region, welche Dachgröße, welche Branchen? Auf Basis Ihrer bisherigen Projekte definieren wir gemeinsam, welche Eigentümer wirklich passen.',
          tools: ['30-Min Kick-off · persönlich', 'Strategie-Dokument'],
        },
        {
          num: '2',
          title: 'Botschaft & Angebot',
          desc: 'Welches Angebot, welche Sprache, welcher Kanal? Wir entwickeln gemeinsam die Nachricht, die Dacheigentümer zum Antworten bringt — klar, konkret, ohne Fachchinesisch. Sie geben jede Nachricht frei, bevor irgendwas rausgeht.',
          tools: ['CegTec Playbook · Ihre Strategie', 'Freigabe durch Sie'],
        },
      ],
    },
    {
      label: 'Kapitel 2 — Wir bauen die Liste',
      accentColor: '#B45309',
      bgColor: '#FEF3C7',
      result: 'Eine saubere Liste: nur Dächer, die zu Ihnen passen.',
      steps: [
        {
          num: '3',
          title: 'E-Mail-Setup',
          desc: 'Wir richten eine eigene Absender-Adresse ein und "wärmen" sie rund 2 Wochen auf. Klingt technisch, macht aber den Unterschied: Ihre Nachrichten landen im Posteingang statt im Spam-Ordner.',
          tools: ['Eigene Absender-Domain', 'Sichere Zustellung'],
        },
        {
          num: '4',
          title: 'Lead-Liste aufbauen',
          desc: 'Adressen, Eigentümer, Ansprechpartner, Dachfläche — alles frisch zusammengestellt, passend zu Ihren Kriterien. Keine gekauften Altdaten, sondern aus offiziellen Registern und öffentlichen Quellen recherchiert.',
          tools: ['Offizielle Register', 'Daten-Recherche'],
        },
      ],
    },
    {
      label: 'Kapitel 3 — Wir bereiten alles vor',
      accentColor: '#C2410C',
      bgColor: '#FFEDD5',
      result: 'Jede Nachricht ist persönlich — und jeder Kontakt ist echt.',
      steps: [
        {
          num: '5',
          title: 'Daten anreichern',
          desc: 'E-Mail wird verifiziert, LinkedIn-Profil zugeordnet, Dachfläche geschätzt, Firma geprüft. Je mehr wir über den Kontakt wissen, desto relevanter wird die Nachricht, die er bekommt.',
          tools: ['Mehrere Datenquellen', 'Daten-Recherche'],
        },
        {
          num: '5.5',
          title: 'Qualitätsprüfung',
          desc: 'Jeder Lead wird von uns manuell gegengecheckt, bevor er in die Kampagne geht. Schlechte Daten kosten Geld und schaden dem Ruf — deshalb prüft ein Mensch, nicht nur die Maschine.',
          tools: ['Manuelle Endkontrolle', 'Durch unser Team'],
        },
        {
          num: '6',
          title: 'Persönliche Texte',
          desc: 'Jede Nachricht wird individuell angepasst — mit Firmenname, Standort und geschätztem Pacht-Ertrag. Klingt persönlich geschrieben, weil sie es ist. Sie sehen vor dem Versand 10 Beispiele zur Freigabe.',
          tools: ['Individueller Text pro Kontakt', '10 Muster zur Freigabe'],
        },
      ],
    },
    {
      label: 'Kapitel 4 — Wir schreiben Ihre Interessenten an',
      accentColor: '#9A3412',
      bgColor: '#FFE4CE',
      result: 'Kampagne läuft. Erste Antworten in 48–72 Stunden.',
      steps: [
        {
          num: '7',
          title: 'Nachrichten aufsetzen',
          desc: '4 aufeinander aufbauende Nachrichten: Erstkontakt, Mehrwert, Referenz, letzte Chance. Jede Stufe hat einen klaren Zweck — keine nervigen Nachfasser, keine leeren Floskeln.',
          tools: ['4-stufige Sequenz', 'Erstkontakt bis Abschluss'],
        },
        {
          num: '8',
          title: 'Kampagne starten',
          desc: 'E-Mail und LinkedIn laufen zeitlich koordiniert, vollautomatisch, DSGVO-gerecht aufgesetzt. Sie müssen nichts tun — wir übernehmen Versand, Timing und das Aussortieren von Abwesenden.',
          tools: ['E-Mail-Kampagne', 'LinkedIn-Kampagne'],
        },
      ],
    },
    {
      label: 'Kapitel 5 — Sie bekommen Termine',
      accentColor: '#A16207',
      bgColor: '#FEF3C7',
      result: 'Termine mit echten Interessenten — direkt in Ihrem Kalender.',
      steps: [
        {
          num: '9',
          title: 'Auswertung & Anpassung',
          desc: 'Was funktioniert, was nicht? Wir stoppen schwache Nachrichten und verstärken, was antwortet. Einmal pro Woche bekommen Sie einen kurzen Report per E-Mail — klare Zahlen, keine Agentur-Folien.',
          tools: ['Wöchentlicher Report', 'Per E-Mail · 1 Seite'],
        },
        {
          num: '10',
          title: 'Übergabe',
          desc: 'Interessierte Kontakte mit allem, was Sie wissen müssen: Wer hat geantwortet, was haben sie gesagt, was ist der nächste Schritt. Vollständig dokumentiert — die Beziehung gehört Ihnen, nicht uns.',
          tools: ['Ihr CRM-Zugang', 'Lückenlose Dokumentation'],
        },
        {
          num: '11',
          title: 'Termin im Kalender',
          desc: 'Gebuchte Gespräche mit vorqualifizierten Dacheigentümern. Zum Beispiel bei JOMAVIS Solar: 112 kontaktiert · 7 Termine · 1 Deal in nur 2 Wochen.',
          tools: ['Direkt buchbar', 'Ihr Kalender'],
        },
      ],
    },
  ],
};

// ── Prompt Card Carousel: Cold Outreach V3 (5 Slides, Full Prompt) ──
const _promptBase = defaultPromptCardData;

const _pcInput: typeof defaultPromptCardData = {
  ..._promptBase,
  promptFontSize: 30,
  metaLabel: 'outreach-builder — 1/5',
  subline: 'Opus 4.6 · 4-Email Sequenz · DACH B2B',
  userPrompt: 'Reply Rate > 10 %. Bau mir den Prompt.',
  promptText: `● Read(22 Kampagnen · Ø 11 % Reply)
  ⎿ Patterns geladen
● Write(outreach-framework.md)

--- COPY START ---
PFLICHT-INPUT — ohne diese: STOPPE.
NIEMALS Zahlen/Namen/Anker erfinden.

1. SENDER — Firma + Produkt + USP
2. EMPFÄNGER — Firma, Stadt, Rolle
3. ANKER (echt, max 14 Tage alt)
   News > Stelle > LinkedIn > Podcast
4. QUICK WIN — Asset, versandfertig
5a. REF PRIMÄR — Ergebnis + Zeitraum
5b. REF SEKUNDÄR — anderer Angle
6. RESSOURCE — URL Case Study
7. SIGNATUR — Name, Titel, Telefon

Wenn 3, 4 oder 5a fehlt → STOPPE.
{{firma}} = Kurzname oder Nachname
--- COPY END ---

  ⎿ 1/5 · Input ready`,
  bottomLine: 'cegtec.net  ·  Teil 1/5 — Pflicht-Input',
};

const _pcEmails12: typeof defaultPromptCardData = {
  ..._promptBase,
  promptFontSize: 30,
  metaLabel: 'outreach-builder — 2/5',
  subline: 'Opus 4.6 · Timing + Email 1 + Email 2',
  userPrompt: 'Timing-Logik + die ersten zwei Emails.',
  promptText: `● Write(outreach-emails.md)

--- COPY START ---
TIMING — Delays werden LÄNGER
Tag 1 → 4 (+3) → 9 (+5) → 16 (+7)

EMAIL 1 — "Problem + Quick Win"
• Subject: {{firma}} + Nutzen, max 5 W.
• Preview: 1 Satz, max 90 Zeichen
• Anker aus Feld 3 zitieren
• EIN Problem + Quick Win Feld 4
• KEIN Meeting-CTA. Max 80 Wörter.

EMAIL 2 — "Social Proof + Risk Reversal"
• Subject: Re: [E1] (Threading!)
• Referenz 5a + Zahl + Zeitraum
• Was Empfänger NICHT tun muss
• Weicher CTA. Max 60 Wörter.
--- COPY END ---

  ⎿ 2/5 · Timing + E1 + E2`,
  bottomLine: 'cegtec.net  ·  Teil 2/5 — Timing & E1–E2',
};

const _pcEmails34: typeof defaultPromptCardData = {
  ..._promptBase,
  promptFontSize: 30,
  metaLabel: 'outreach-builder — 3/5',
  subline: 'Opus 4.6 · Email 3 + Email 4',
  userPrompt: 'E3: Einwand-Abfrage. E4: Breakup.',
  promptText: `● Write(outreach-emails.md) — append

--- COPY START ---
EMAIL 3 — "Einwand-Abfrage" (STÄRKSTER HEBEL)
• Subject: Re: [E1]
• Preview: Zahl/Zitat/Frage aus Body
• "Bevor ich aufgebe — der Grund?"
    [ ] Kein Budget
    [ ] Zeitpunkt passt nicht
    [ ] Bereits andere Lösung
    [ ] Sonstiges
• Max 50 Wörter

EMAIL 4 — "Akte schließen" (Breakup)
• Subject: Akte [Firma] / [Stadt]
• "Schließe Akte zu [Thema] vorerst."
• Argument: Ref 5b oder USP-Zahl
• Link Ressource Feld 6. Max 40 W.
--- COPY END ---

  ⎿ 3/5 · E3 + E4`,
  bottomLine: 'cegtec.net  ·  Teil 3/5 — E3 + E4',
};

const _pcVerboten: typeof defaultPromptCardData = {
  ..._promptBase,
  promptFontSize: 30,
  metaLabel: 'outreach-builder — 4/5',
  subline: 'Opus 4.6 · Hard Rules — Verboten',
  userPrompt: 'Was NIEMALS in den Emails vorkommen darf.',
  promptText: `● Write(outreach-rules.md)

--- COPY START ---
VERBOTEN:
• "Synergien", "ganzheitlich",
  "Mehrwert", "innovativ"
• "Ich hoffe diese Mail findet
  Sie wohlauf", "kurz und knapp"
• Ausrufezeichen
• Emojis
• Konjunktiv: "würde", "könnte"
  (außer Einwand-Vorwegnahme)
• Generische Preview-Texte
  Preview = Pattern brechen,
  nicht Subject wiederholen
--- COPY END ---

  ⎿ 4/5 · Blacklist`,
  bottomLine: 'cegtec.net  ·  Teil 4/5 — Blacklist',
};

const _pcPflicht: typeof defaultPromptCardData = {
  ..._promptBase,
  promptFontSize: 30,
  metaLabel: 'outreach-builder — 5/5',
  subline: 'Opus 4.6 · Pflicht + Output-Format',
  userPrompt: 'Pflicht-Regeln + Output-Format.',
  promptText: `● Write(outreach-rules.md) — append

--- COPY START ---
PFLICHT:
• Du/Sie konsistent (DACH = Sie)
• Jede Email kürzer als vorige
• Wortzählung: nur Body
  (Anrede + Signatur exkludiert)
• Subject max 50 Zeichen (Gmail)
• Preview immer, Pattern-brechend

OUTPUT PRO EMAIL:
  SUBJECT: ...
  PREVIEW: ...
  BODY: ...
  WORTZAHL BODY: [n]
--- COPY END ---

  ⎿ 5/5 · Rules ready

V3 · 98 Zeilen · 18 Hard Rules`,
  bottomLine: 'cegtec.net  ·  Teil 5/5 — Pflicht & Output',
};

export const CAROUSEL_PRESETS: SavedGraphic[] = [
  {
    id: 'preset-prompt-card-outreach-v3',
    name: 'Prompt Card — Cold Outreach V3 (5 Slides)',
    type: 'carousel',
    formatId: '4:5',
    savedAt: Date.now(),
    data: {
      graphicType: 'prompt-card',
      formatId: '4:5',
      slides: [
        { id: 'preset-v3-input',    data: _pcInput,    layers: [] },
        { id: 'preset-v3-emails12', data: _pcEmails12, layers: [] },
        { id: 'preset-v3-emails34', data: _pcEmails34, layers: [] },
        { id: 'preset-v3-verboten', data: _pcVerboten, layers: [] },
        { id: 'preset-v3-pflicht',  data: _pcPflicht,  layers: [] },
      ],
    },
  },
  {
    id: 'preset-outreach-pipeline-investoren',
    name: 'Outreach Pipeline — Investorenansprache',
    type: 'carousel',
    formatId: '4:5',
    savedAt: Date.now(),
    data: {
      graphicType: 'outreach-pipeline',
      formatId: '4:5',
      slides: [
        { id: 'preset-pipeline-cover',   data: { ..._base, isCover: true },          layers: [] },
        { id: 'preset-pipeline-phase-0', data: { ..._base, activePhaseIndex: 0 },    layers: [] },
        { id: 'preset-pipeline-phase-1', data: { ..._base, activePhaseIndex: 1 },    layers: [] },
        { id: 'preset-pipeline-phase-2', data: { ..._base, activePhaseIndex: 2 },    layers: [] },
        { id: 'preset-pipeline-phase-3', data: { ..._base, activePhaseIndex: 3 },    layers: [] },
        { id: 'preset-pipeline-phase-4', data: { ..._base, activePhaseIndex: 4 },    layers: [] },
      ],
    },
  },
  {
    id: 'preset-outreach-pipeline-pv-v1',
    name: 'Outreach Pipeline — PV / Dachpacht (v1 · Original)',
    type: 'carousel',
    formatId: '4:5',
    savedAt: Date.now(),
    data: {
      graphicType: 'outreach-pipeline',
      formatId: '4:5',
      slides: [
        { id: 'preset-pv-v1-cover',   data: { ..._pv, isCover: true },       layers: [] },
        { id: 'preset-pv-v1-phase-0', data: { ..._pv, activePhaseIndex: 0 }, layers: [] },
        { id: 'preset-pv-v1-phase-1', data: { ..._pv, activePhaseIndex: 1 }, layers: [] },
        { id: 'preset-pv-v1-phase-2', data: { ..._pv, activePhaseIndex: 2 }, layers: [] },
        { id: 'preset-pv-v1-phase-3', data: { ..._pv, activePhaseIndex: 3 }, layers: [] },
        { id: 'preset-pv-v1-phase-4', data: { ..._pv, activePhaseIndex: 4 }, layers: [] },
      ],
    },
  },
  {
    id: 'preset-outreach-pipeline-pv-sunny',
    name: 'Outreach Pipeline — PV / Dachpacht (v2 · Sunny · Trust)',
    type: 'carousel',
    formatId: '4:5',
    savedAt: Date.now(),
    data: {
      graphicType: 'outreach-pipeline',
      formatId: '4:5',
      slides: [
        { id: 'preset-pv-sunny-cover',   data: { ..._pvSunny, isCover: true },       layers: [] },
        { id: 'preset-pv-sunny-phase-0', data: { ..._pvSunny, activePhaseIndex: 0 }, layers: [] },
        { id: 'preset-pv-sunny-phase-1', data: { ..._pvSunny, activePhaseIndex: 1 }, layers: [] },
        { id: 'preset-pv-sunny-phase-2', data: { ..._pvSunny, activePhaseIndex: 2 }, layers: [] },
        { id: 'preset-pv-sunny-phase-3', data: { ..._pvSunny, activePhaseIndex: 3 }, layers: [] },
        { id: 'preset-pv-sunny-phase-4', data: { ..._pvSunny, activePhaseIndex: 4 }, layers: [] },
      ],
    },
  },
];

// ── Prompt Card Single-Slide Presets ─────────────────────────────
const SEED_PROMPT_CARDS: SavedGraphic[] = [
  {
    id: 'preset-prompt-card-reply-handler',
    name: 'Prompt Card — Reply Handler V1 (7 Typen)',
    type: 'prompt-card',
    formatId: '9:16',
    savedAt: Date.now(),
    data: {
      topLabel: 'CegTec Code v1.0',
      headline: '~/cegtec/replies/classify-and-respond',
      subline: 'Opus 4.6 · Reply Strategist · DACH B2B',
      userPrompt: '80 % sterben nach Reply 1. Fix das.',
      promptFontSize: 16,
      promptText: `● Read(387 Replies · 22 Kampagnen · 7 Muster)
  ⎿ Klassifikation geladen
● Write(reply-handler-v1.md)

--- COPY START ---
PFLICHT-INPUT — ohne diese: STOPPE.
Produkt/Service + Original-Email + Reply.

SCHRITT 1 — KLASSIFIZIERE (exakt 1 Typ)

Typ 1 INTERESSE      Will mehr wissen
Typ 2 WEITERLEITUNG  Falsche Person
Typ 3 EINWAND        Grund gegen Kauf
Typ 4 TIMING         Nicht jetzt, später
Typ 5 INFO-BRUSH     "Schicken Sie Unterlagen"
Typ 6 ABWESEND       OOO / Auto-Reply
Typ 7 ABSAGE         Stop-Anfrage

SCHRITT 2 — STRATEGIE PRO TYP

Typ 1 (Interesse):
→ NICHT sofort Meeting — erst Wert liefern
→ Asset senden (Case Study, ROI, Loom)
→ Meeting NICHT in gleicher Nachricht
→ Asset muss alleine stehen
→ CTA: "Sag mir ob das passt"

Typ 2 (Weiterleitung):
→ Neue Person ist wieder KALT
→ Referenz als Türöffner + Kontext
→ Angle an ROLLE anpassen
→ "[Name] hat mich verwiesen. [1 Satz].
   Ist das ein Thema bei Ihnen?"

Typ 3 (Einwand):
→ NICHT widerlegen — Rückfrage stellen
→ "Kein Budget" → "Timing oder Priorität?"
→ "Haben wir" → "Zufrieden mit [Aspekt]?"
→ "Kein Bedarf" → "Was nutzt ihr für [X]?"
→ "Schlechte Erfahrung" → "Was lief schief?"
→ "Zu klein/groß" → "Ab wann relevant?"
→ Antwort spiegeln, dann 1 Gegenbeispiel

Typ 4 (Timing):
→ Konkretes Datum, NICHT "irgendwann"
→ Nur Assets versprechen die du HAST
→ "Am [Datum] melden? Vorab [Asset]."

Typ 5 (Info-Brush-Off):
→ NICHT PDF schicken = Brush-off
→ "Was ist relevanter: [A], [B], [C]?"
→ Erzwingt echte Antwort + qualifiziert

Typ 6 (Abwesend):
→ Rückkehr +2 Tage, neuer Angle
→ NICHT Original wiederholen
→ Kein "Willkommen zurück"
→ "Hi [Name], [neuer Angle]. Relevant?"

Typ 7 (Absage):
→ Respektieren. Sofort stoppen.
→ "Verstanden, nehme Sie raus."
→ NIEMALS argumentieren
→ Kein Füllmaterial

SCHRITT 3 — SCHREIBE DIE ANTWORT
Max 3-4 Sätze
Kein "Vielen Dank für Ihre Antwort"
Direkt, menschlich, kein Corporate-Sprech
1 klare nächste Aktion, keine MC-CTAs
Nur Assets versprechen die existieren

OUTPUT: TYP · STRATEGIE · REPLY
--- COPY END ---

  ⎿ V1 · 7 Reply-Typen · 58 Zeilen`,
      bottomLine: 'cegtec.net  ·  Reply Handler V1',
      metaLabel: 'reply-handler — 82×32',
      backgroundColor: '#1A1815',
      textColor: '#E8E6E3',
      labelColor: '#8A8278',
      filledColor: '#D97757',
      borderColor: '#2E2A26',
      warningColor: '#5EC5D1',
    },
  },
];

const SEED_VERSION = 'v20-reply-handler-v1';

interface SavedGraphicsState {
  graphics: SavedGraphic[];
  _seedVersion?: string;
  save: (name: string, type: string, data: any, formatId: string) => string;
  overwrite: (id: string, data: any) => void;
  rename: (id: string, name: string) => void;
  remove: (id: string) => void;
  get: (id: string) => SavedGraphic | undefined;
}

export const useSavedGraphicsStore = create<SavedGraphicsState>()(
  persist(
    (set, get) => ({
      graphics: [...SEED_INFOGRAPHICS, ...SEED_LINKEDIN_POSTS, ...CAROUSEL_PRESETS, ...SEED_PROMPT_CARDS],
      _seedVersion: SEED_VERSION,

      save: (name, type, data, formatId) => {
        const id = `g-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const entry: SavedGraphic = { id, name, type, data, formatId, savedAt: Date.now() };
        set((s) => ({ graphics: [entry, ...s.graphics] }));
        return id;
      },

      overwrite: (id, data) => {
        set((s) => ({
          graphics: s.graphics.map((g) =>
            g.id === id ? { ...g, data, savedAt: Date.now() } : g
          ),
        }));
      },

      rename: (id, name) => {
        set((s) => ({
          graphics: s.graphics.map((g) => (g.id === id ? { ...g, name } : g)),
        }));
      },

      remove: (id) => {
        set((s) => ({ graphics: s.graphics.filter((g) => g.id !== id) }));
      },

      get: (id) => get().graphics.find((g) => g.id === id),
    }),
    {
      name: 'slide-forge-saved-graphics-v1',
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) return;
        if (state._seedVersion !== SEED_VERSION) {
          const userGraphics = state.graphics.filter((g: any) => !g.id.startsWith('preset-'));
          useSavedGraphicsStore.setState({
            graphics: [...SEED_INFOGRAPHICS, ...SEED_LINKEDIN_POSTS, ...CAROUSEL_PRESETS, ...SEED_PROMPT_CARDS, ...userGraphics],
            _seedVersion: SEED_VERSION,
          });
        }
      },
    }
  )
);
