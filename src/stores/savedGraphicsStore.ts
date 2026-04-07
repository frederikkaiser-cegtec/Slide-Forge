import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InfographicData } from '../components/graphics/InfographicGraphic';
import type { LinkedInPostData } from '../components/graphics/LinkedInPostGraphic';
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
];

const SEED_VERSION = 'v5-seo-hidden-cost-v2';

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
      graphics: [...SEED_INFOGRAPHICS, ...SEED_LINKEDIN_POSTS],
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
      onRehydrate: () => {
        return (state: any) => {
          if (!state) return;
          if (state._seedVersion !== SEED_VERSION) {
            const userGraphics = state.graphics.filter((g: any) => !g.id.startsWith('preset-'));
            state.graphics = [...SEED_INFOGRAPHICS, ...SEED_LINKEDIN_POSTS, ...userGraphics];
            state._seedVersion = SEED_VERSION;
          }
        };
      },
    } as any
  )
);
