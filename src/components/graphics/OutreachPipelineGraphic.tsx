import { LOGO_URL } from '../../utils/assets';
import {
  FONTS, COLORS, isDark, logoFilter, hexToRgb, adjustBrightness,
} from '../../utils/cegtecTheme';

// ── Types ──────────────────────────────────────────────────────────

export interface PipelineStep {
  num: string;
  title: string;
  desc: string;
  tools: string[];
}

export interface PipelinePhase {
  label: string;
  accentColor: string;
  bgColor: string;
  steps: PipelineStep[];
  result?: string;
}

export interface OutreachPipelineData {
  topLabel: string;
  title: string;
  subtitle: string;
  phases: PipelinePhase[];
  footerText: string;
  activePhaseIndex?: number; // wenn gesetzt: nur diese Phase rendern (Carousel-Modus)
  isCover?: boolean;         // Cover-Slide
  backgroundColor?: string;
  textColor?: string;
  labelColor?: string;
  borderColor?: string;
}

// ── Default Data ───────────────────────────────────────────────────

export const defaultOutreachPipelineData: OutreachPipelineData = {
  topLabel: 'MANAGED OUTREACH',
  title: 'So gewinnen wir\nInvestoren.',
  subtitle: 'Von der Datenbeschaffung bis zum qualifizierten Gespräch — unser Prozess für systematische Neukundengewinnung.',
  footerText: 'cegtec.net',
  phases: [
    {
      label: 'Phase 1 — Foundation',
      accentColor: '#3C3489',
      bgColor: '#EEEDFE',
      result: 'Klares Zielbild: Wen wir ansprechen, warum jetzt, mit welchem Offer.',
      steps: [
        {
          num: '1',
          title: 'TAM & ICP-Validierung',
          desc: 'Marktgröße bewerten, adressierbares Universum quantifizieren. Welche Fondsgröße, welcher Fokus, welche Regulierung? Daraus ergibt sich: Multichannel-Kampagne oder Account-Based 1:1.',
          tools: ['Desk Research', 'BaFin-Register'],
        },
        {
          num: '2',
          title: 'Playbook-Definition',
          desc: 'ICP, Personas, Offer, Messaging-Angles, Kanalstrategie, Sequenz-Architektur — dokumentiert und abgestimmt. Kein Outreach startet ohne vollständiges, reviewtes Playbook.',
          tools: ['Playbook Wizard', 'Notion'],
        },
      ],
    },
    {
      label: 'Phase 2 — Infrastruktur & Daten',
      accentColor: '#0C447C',
      bgColor: '#E6F1FB',
      result: 'Infrastruktur live. Kontaktliste bereit für Enrichment.',
      steps: [
        {
          num: '3',
          title: 'Technisches Setup',
          desc: 'Domain-Kauf, DNS-Setup (SPF, DKIM, DMARC), Mailbox-Provisioning. 2–4 Wochen Warmup für maximale Inbox-Rate. Ohne saubere Infrastruktur landet alles im Spam.',
          tools: ['Instantly', 'DNS'],
        },
        {
          num: '4',
          title: 'Datenbeschaffung',
          desc: 'Lead-Listen nach ICP: Firmen (Branche, AuM, Regulierungsstatus) und Entscheider (Name, Titel, LinkedIn-Profil). Sourcing aus BaFin-Register und LinkedIn Sales Navigator.',
          tools: ['Clay', 'LinkedIn SN', 'BaFin-Register'],
        },
      ],
    },
    {
      label: 'Phase 3 — Intelligence',
      accentColor: '#085041',
      bgColor: '#E1F5EE',
      result: 'Vollständige, verifizierte Kontaktliste mit personalisierten Openern.',
      steps: [
        {
          num: '5',
          title: 'Enrichment',
          desc: 'E-Mail-Verifizierung, LinkedIn-Zuordnung, Investment-Datenpunkte: Fondsfokus, AuM, letzte Investments, Ticket-Größen. Clay Waterfall maximiert die Match-Rate über mehrere Datenquellen.',
          tools: ['Clay Enrichment', 'Waterfall'],
        },
        {
          num: '5.5',
          title: 'QA-Gate',
          desc: 'Match-Rate, fehlende Felder, falsche Zuordnungen prüfen. Nur vollständig validierte Leads kommen in die Sequenz — kein Rauschen, kein Streuverlust.',
          tools: ['Quality Check'],
        },
        {
          num: '6',
          title: 'Personalisierung',
          desc: 'AI-generierte Opener basierend auf Fondsprofil, Portfolio und Investmentfokus. Pro Persona eigene Value Proposition. Skaliert auf hunderte Kontakte ohne Qualitätsverlust.',
          tools: ['AI-Layer', 'Clay AI'],
        },
      ],
    },
    {
      label: 'Phase 4 — Execution',
      accentColor: '#633806',
      bgColor: '#FAEEDA',
      result: 'Kampagne läuft. Erste Replies erwartet in 48–72 Stunden.',
      steps: [
        {
          num: '7',
          title: 'Sequenz-Aufbau',
          desc: 'Mehrstufig: Hook → Vertiefung → Social Proof → Breakup. Pro Kanal eigene Varianten. A/B-Tests laufen automatisch von Tag 1 — kein manuelles Optimieren nötig.',
          tools: ['Instantly', 'HeyReach'],
        },
        {
          num: '8',
          title: 'Multichannel-Aussteuerung',
          desc: 'E-Mail und LinkedIn zeitlich koordiniert. Sender-Rotation, Bounce-Handling, Opt-out-Compliance. Vollautomatisch und DSGVO-konform — kein manueller Aufwand.',
          tools: ['Instantly', 'HeyReach'],
        },
      ],
    },
    {
      label: 'Phase 5 — Optimization & Handoff',
      accentColor: '#712B13',
      bgColor: '#FAECE7',
      result: 'Qualifizierte Gespräche im Kalender. Ownership vollständig beim Kunden.',
      steps: [
        {
          num: '9',
          title: 'Monitoring & Iteration',
          desc: 'Open- und Reply-Rates täglich tracken. Schwache Sequenzen stoppen, A/B-Gewinner skalieren. Wöchentliches Reporting direkt an den Kunden — volle Transparenz.',
          tools: ['Instantly Analytics', 'HubSpot'],
        },
        {
          num: '10',
          title: 'CRM-Handoff',
          desc: 'Interessierte Leads mit vollständigem Gesprächskontext ins CRM: Firma, Ansprechpartner, Kanal, Verlauf. Lückenlos dokumentiert und an den Kunden übergeben.',
          tools: ['HubSpot'],
        },
        {
          num: '11',
          title: 'Qualifizierte Gespräche',
          desc: 'Kalender-Booking über Calendly. Die LP-Beziehung gehört ab Tag 1 dem Kunden — nicht CegTec. Wir liefern den Zugang, nicht die Abhängigkeit.',
          tools: ['Calendly'],
        },
      ],
    },
  ],
  backgroundColor: '#F8F7F4',
  textColor: '#1A1A2E',
  labelColor: '#71717A',
  borderColor: '#E5E5EA',
};

// ── Component ──────────────────────────────────────────────────────

const REF_W = 1080;
const REF_H = 1920;

export function OutreachPipelineGraphic({
  data,
  width,
  height,
}: {
  data: OutreachPipelineData;
  width: number;
  height: number;
}) {
  const s = Math.min(width / REF_W, height / REF_H);
  const bg = data.backgroundColor || '#F8F7F4';
  const dark = isDark(bg);
  const textCol = data.textColor || COLORS.titleLight;
  const labelCol = data.labelColor || COLORS.labelLight;
  const borderCol = data.borderColor || COLORS.border;
  const pad = 52 * s;

  // ── Cover Slide ────────────────────────────────────────────────
  if (data.isCover) {
    const sc = width / 1080;
    const allColors = data.phases.map((p) => p.accentColor);
    return (
      <div style={{ width, height, background: bg, position: 'relative', overflow: 'hidden', fontFamily: FONTS.display }}>

        {/* SVG atmosphere — same pattern as phase slides */}
        <svg viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <defs>
            <filter id="cv-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={100 * sc} />
            </filter>
            <linearGradient id="cv-stripe" x1="0" y1="0" x2="1" y2="0">
              {allColors.map((c, i) => (
                <stop key={i} offset={`${(i / (allColors.length - 1)) * 100}%`} stopColor={c} />
              ))}
            </linearGradient>
          </defs>
          {/* Subtle multi-color glows */}
          <ellipse cx={width * 0.1} cy={height * 0.2} rx={280 * sc} ry={240 * sc} fill={allColors[0]} opacity={0.05} filter="url(#cv-blur)" />
          <ellipse cx={width * 0.9} cy={height * 0.6} rx={260 * sc} ry={220 * sc} fill={allColors[2]} opacity={0.04} filter="url(#cv-blur)" />
          <ellipse cx={width * 0.4} cy={height * 0.92} rx={240 * sc} ry={200 * sc} fill={allColors[4]} opacity={0.04} filter="url(#cv-blur)" />
          {/* Rainbow top stripe */}
          <rect y={0} width={width} height={5 * sc} fill="url(#cv-stripe)" />
          {/* Grid dots */}
          {Array.from({ length: Math.ceil(width / (80 * sc)) }).map((_, xi) =>
            Array.from({ length: Math.ceil(height / (80 * sc)) }).map((_, yi) => (
              <circle key={`${xi}-${yi}`} cx={xi * 80 * sc} cy={yi * 80 * sc} r={1.5 * sc} fill="#000000" opacity={0.03} />
            ))
          )}
          {/* Ghost "11" */}
          <text x={width * 1.02} y={height * 0.7} textAnchor="end"
            fontFamily={FONTS.display} fontWeight={900} fontSize={500 * sc}
            fill={allColors[0]} opacity={0.04} style={{ userSelect: 'none' }}>
            11
          </text>
        </svg>

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 1, width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          padding: `${48 * sc}px ${60 * sc}px ${36 * sc}px`,
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 * sc }}>
            <img src={LOGO_URL} alt="CegTec" style={{ height: 48 * sc, objectFit: 'contain', ...logoFilter(bg) }} />
            <span style={{ fontFamily: FONTS.mono, fontSize: 11 * sc, fontWeight: 700, letterSpacing: 2.5 * sc, textTransform: 'uppercase' as const, color: labelCol }}>
              {data.topLabel}
            </span>
          </div>

          {/* Main content — vertically centered */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 * sc, marginBottom: 24 * sc }}>
              <div style={{ height: 3 * sc, width: 48 * sc, borderRadius: 2 * sc, backgroundImage: `linear-gradient(90deg, ${allColors[0]}, ${allColors[4]})` }} />
              <span style={{ fontFamily: FONTS.mono, fontSize: 13 * sc, fontWeight: 700, letterSpacing: 2 * sc, textTransform: 'uppercase' as const, color: labelCol }}>
                5 Phasen · 11 Schritte
              </span>
            </div>

            {/* Headline */}
            <div style={{
              fontFamily: FONTS.display, fontWeight: 900,
              fontSize: 86 * sc, lineHeight: 0.95,
              letterSpacing: -4 * sc, color: textCol,
              marginBottom: 28 * sc, whiteSpace: 'pre-line',
            }}>
              {data.title}
            </div>

            {/* Divider with multi-color accent */}
            <div style={{ width: '100%', height: 1.5 * sc, background: borderCol, marginBottom: 28 * sc, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: 120 * sc, height: 1.5 * sc, backgroundImage: `linear-gradient(90deg, ${allColors[0]}, ${allColors[4]})` }} />
            </div>

            {/* Subtitle */}
            <div style={{
              fontFamily: FONTS.ui, fontSize: 22 * sc, lineHeight: 1.6,
              color: labelCol, marginBottom: 52 * sc,
            }}>
              {data.subtitle}
            </div>

            {/* Phase pills */}
            <div style={{ display: 'flex', gap: 10 * sc, flexWrap: 'wrap' }}>
              {data.phases.map((phase, pi) => (
                <div key={pi} style={{
                  display: 'flex', alignItems: 'center', gap: 8 * sc,
                  padding: `${8 * sc}px ${16 * sc}px`,
                  borderRadius: 999 * sc,
                  background: phase.bgColor,
                  border: `1.5px solid ${phase.accentColor}40`,
                }}>
                  <div style={{ width: 7 * sc, height: 7 * sc, borderRadius: '50%', background: phase.accentColor }} />
                  <span style={{ fontFamily: FONTS.mono, fontSize: 11 * sc, fontWeight: 600, color: phase.accentColor, letterSpacing: 0.5 * sc }}>
                    {phase.label.split('—')[1]?.trim() || phase.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: 18 * sc, borderTop: `1.5px solid ${borderCol}`,
          }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 12 * sc, color: labelCol, letterSpacing: 2 * sc, textTransform: 'uppercase' as const }}>
              {data.footerText}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 * sc }}>
              <span style={{ fontFamily: FONTS.ui, fontSize: 13 * sc, color: labelCol }}>Swipe</span>
              <span style={{ fontSize: 16 * sc, color: labelCol }}>→</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Single-Phase view (Carousel-Modus) ──────────────────────────
  if (typeof data.activePhaseIndex === 'number') {
    const phase = data.phases[data.activePhaseIndex];
    if (!phase) return null;
    const phaseIdx = data.activePhaseIndex;
    const [pr, pg, pb] = hexToRgb(phase.accentColor);
    const textDim = adjustBrightness(labelCol, -10);
    // sc = width-based scale — 1.0 at 1080px, 0.703 at 759px, etc.
    const sc = width / 1080;
    const circleSize = 64 * sc;
    const colWidth = circleSize + 16 * sc; // includes outer ring space
    const lineLeft = colWidth / 2 - 1.5 * sc; // center of circle column

    return (
      <div style={{ width, height, background: bg, position: 'relative', overflow: 'hidden', fontFamily: FONTS.display }}>

        {/* ── SVG Atmosphere ── */}
        <svg viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <defs>
            <filter id="sf-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={80 * sc} />
            </filter>
            <filter id="sf-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={18 * sc} result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="sf-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
              <feBlend in="SourceGraphic" mode="multiply" />
            </filter>
            <linearGradient id="sf-topline" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={phase.accentColor} stopOpacity="0" />
              <stop offset="40%" stopColor={phase.accentColor} />
              <stop offset="100%" stopColor={phase.accentColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Ambient orb top-right */}
          <ellipse cx={width * 0.88} cy={height * 0.1} rx={320 * sc} ry={260 * sc}
            fill={phase.accentColor} opacity={0.08} filter="url(#sf-blur)" />
          {/* Ambient orb bottom-left */}
          <ellipse cx={width * 0.08} cy={height * 0.92} rx={260 * sc} ry={220 * sc}
            fill={phase.accentColor} opacity={0.06} filter="url(#sf-blur)" />
          {/* Accent top stripe */}
          <rect y={0} width={width} height={4 * sc} fill={`url(#sf-topline)`} />
          {/* Grid dots */}
          {Array.from({ length: Math.ceil(width / (80 * sc)) }).map((_, xi) =>
            Array.from({ length: Math.ceil(height / (80 * sc)) }).map((_, yi) => (
              <circle key={`${xi}-${yi}`} cx={xi * 80 * sc} cy={yi * 80 * sc} r={1.5 * sc}
                fill="#000000" opacity={0.03} />
            ))
          )}
          {/* Ghost phase number — large editorial background element */}
          <text
            x={width * 0.98}
            y={height * 0.62}
            textAnchor="end"
            fontFamily={FONTS.display}
            fontWeight={900}
            fontSize={480 * sc}
            fill={phase.accentColor}
            opacity={0.04}
            style={{ userSelect: 'none', letterSpacing: -20 * sc }}
          >
            {String(phaseIdx + 1).padStart(2, '0')}
          </text>
          <rect width={width} height={height} opacity="0.01" filter="url(#sf-noise)" />
        </svg>

        {/* ── Content layer ── */}
        <div style={{
          position: 'relative', zIndex: 1, width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          padding: `${48 * sc}px ${60 * sc}px ${36 * sc}px`,
        }}>

          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 * sc }}>
            <img src={LOGO_URL} alt="CegTec" style={{ height: 28 * sc, objectFit: 'contain', ...logoFilter(bg) }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 * sc }}>
              {data.phases.map((_, pi) => (
                <div key={pi} style={{
                  width: pi === phaseIdx ? 24 * sc : 8 * sc, height: 8 * sc, borderRadius: 4 * sc,
                  background: pi === phaseIdx ? phase.accentColor : COLORS.border,
                  transition: 'width 0.3s',
                }} />
              ))}
            </div>
          </div>

          {/* Phase badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 * sc, marginBottom: 14 * sc }}>
            <div style={{ width: 4 * sc, height: 22 * sc, borderRadius: 2 * sc, background: phase.accentColor }} />
            <span style={{
              fontFamily: FONTS.mono, fontSize: 13 * sc, fontWeight: 700,
              letterSpacing: 2 * sc, textTransform: 'uppercase' as const, color: phase.accentColor,
            }}>{phase.label}</span>
          </div>

          {/* Phase title — BIG */}
          <div style={{
            fontFamily: FONTS.display, fontSize: 72 * sc, fontWeight: 800,
            color: textCol, lineHeight: 1.0, letterSpacing: -3 * sc,
            marginBottom: 28 * sc,
          }}>
            {phase.label.split('—')[1]?.trim() || phase.label}
          </div>

          {/* Divider */}
          <div style={{ width: '100%', height: 1.5 * sc, background: borderCol, marginBottom: 36 * sc, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 100 * sc, height: 1.5 * sc, background: phase.accentColor }} />
          </div>

          {/* Steps — flex: 1 per step fills the height evenly */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>

            {phase.steps.map((step, si) => {
              const isLast = si === phase.steps.length - 1;
              return (
                <div key={si} style={{
                  flex: 1, display: 'flex', gap: 24 * sc, position: 'relative', minHeight: 0,
                }}>
                  {/* Connector line — spans from below this circle to bottom of this flex row (= top of next) */}
                  {!isLast && (
                    <div style={{
                      position: 'absolute',
                      left: lineLeft,
                      top: 20 * sc + circleSize,
                      bottom: 0,
                      width: 3 * sc,
                      borderRadius: 2 * sc,
                      background: `linear-gradient(to bottom, ${phase.accentColor}AA, ${phase.accentColor}22)`,
                      zIndex: 0,
                    }} />
                  )}

                  {/* Circle column */}
                  <div style={{
                    flexShrink: 0, width: colWidth,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    paddingTop: 20 * sc,
                  }}>
                    {/* Outer ring */}
                    <div style={{
                      width: colWidth, height: colWidth,
                      borderRadius: '50%',
                      border: `2px solid ${phase.accentColor}`,
                      opacity: 0.18,
                      position: 'absolute',
                      marginTop: 20 * sc,
                      zIndex: 0,
                    }} />
                    <div style={{
                      width: circleSize, height: circleSize, borderRadius: '50%',
                      background: phase.accentColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: FONTS.mono,
                      fontSize: step.num.length > 1 ? 18 * sc : 26 * sc,
                      fontWeight: 800, color: '#fff',
                      boxShadow: `0 0 0 6px rgba(${pr},${pg},${pb},0.12), 0 14px 40px rgba(${pr},${pg},${pb},0.45)`,
                      position: 'relative', zIndex: 1,
                    }}>
                      {step.num}
                    </div>
                  </div>

                  {/* Text content */}
                  <div style={{ flex: 1, paddingTop: 18 * sc }}>
                    <div style={{
                      fontFamily: FONTS.display,
                      fontSize: 48 * sc,
                      fontWeight: 800,
                      color: textCol,
                      lineHeight: 1.0,
                      letterSpacing: -2 * sc,
                      marginBottom: 14 * sc,
                    }}>
                      {step.title}
                    </div>
                    <div style={{
                      fontFamily: FONTS.ui,
                      fontSize: 21 * sc,
                      color: labelCol,
                      lineHeight: 1.6,
                      marginBottom: 18 * sc,
                    }}>
                      {step.desc}
                    </div>
                    <div style={{ display: 'flex', gap: 8 * sc, flexWrap: 'wrap', alignItems: 'center' }}>
                      {step.tools.map((tool, ti) => (
                        <span key={ti} style={{
                          fontFamily: FONTS.mono, fontSize: 12 * sc, fontWeight: 600,
                          color: phase.accentColor, letterSpacing: 0.5 * sc,
                          background: phase.bgColor,
                          border: `1.5px solid ${phase.accentColor}30`,
                          borderRadius: 6 * sc,
                          padding: `${5 * sc}px ${12 * sc}px`,
                          display: 'inline-block',
                        }}>
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Result block — pinned to bottom of steps area */}
            {phase.result && (
              <div style={{
                flexShrink: 0,
                display: 'flex', alignItems: 'center', gap: 16 * sc,
                padding: `${18 * sc}px ${22 * sc}px`,
                background: `${phase.accentColor}0D`,
                borderLeft: `4px solid ${phase.accentColor}`,
                borderRadius: `0 ${8 * sc}px ${8 * sc}px 0`,
              }}>
                <span style={{
                  fontFamily: FONTS.ui, fontSize: 19 * sc, fontWeight: 600,
                  color: textCol, lineHeight: 1.4,
                }}>
                  {phase.result}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: 24 * sc, paddingTop: 18 * sc,
            borderTop: `1.5px solid ${borderCol}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 12 * sc, color: textDim, letterSpacing: 2 * sc, textTransform: 'uppercase' as const }}>
              {data.footerText}
            </span>
            <span style={{ fontFamily: FONTS.mono, fontSize: 12 * sc, color: textDim, letterSpacing: 1 * sc }}>
              {phaseIdx + 1} / {data.phases.length}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── Full overview (Standard) ────────────────────────────────────
  return (
    <div
      style={{
        width,
        height,
        background: bg,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: FONTS.ui,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Subtle top accent line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3 * s,
        background: `linear-gradient(90deg, transparent, ${data.phases[0].accentColor}, ${data.phases[2].accentColor}, ${data.phases[4].accentColor}, transparent)`,
        opacity: 0.6,
      }} />

      {/* Header */}
      <div style={{ padding: `${44 * s}px ${pad}px ${20 * s}px` }}>
        {/* Logo + Label row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 * s }}>
          <img
            src={LOGO_URL}
            alt="CegTec"
            style={{ height: 22 * s, objectFit: 'contain', ...logoFilter(bg) }}
          />
          <span style={{
            fontFamily: FONTS.mono,
            fontSize: 9 * s,
            fontWeight: 600,
            letterSpacing: 2 * s,
            textTransform: 'uppercase',
            color: labelCol,
          }}>
            {data.topLabel}
          </span>
        </div>

        {/* Title */}
        <div style={{
          fontFamily: FONTS.display,
          fontSize: 36 * s,
          fontWeight: 800,
          color: textCol,
          lineHeight: 1.1,
          letterSpacing: -0.5 * s,
          marginBottom: 10 * s,
          whiteSpace: 'pre-line',
        }}>
          {data.title}
        </div>

        {/* Subtitle */}
        <div style={{
          fontFamily: FONTS.ui,
          fontSize: 13 * s,
          color: labelCol,
          lineHeight: 1.5,
        }}>
          {data.subtitle}
        </div>
      </div>

      {/* Divider under header */}
      <div style={{ height: 1 * s, background: borderCol, margin: `0 ${pad}px`, opacity: 0.6 }} />

      {/* Phases */}
      <div style={{ flex: 1, padding: `${12 * s}px ${pad}px`, overflow: 'hidden' }}>
        {data.phases.map((phase, pi) => (
          <div key={pi}>
            {/* Phase divider (except first) */}
            {pi > 0 && (
              <div style={{
                height: 1 * s,
                background: borderCol,
                margin: `${6 * s}px 0 ${14 * s}px`,
                opacity: 0.5,
              }} />
            )}

            {/* Phase label */}
            <div style={{
              fontFamily: FONTS.mono,
              fontSize: 9 * s,
              fontWeight: 600,
              letterSpacing: 1.5 * s,
              textTransform: 'uppercase',
              color: phase.accentColor,
              opacity: 0.8,
              marginBottom: 8 * s,
              paddingLeft: 44 * s,
            }}>
              {phase.label}
            </div>

            {/* Steps */}
            {phase.steps.map((step, si) => {
              const isLast = si === phase.steps.length - 1;
              return (
                <div
                  key={si}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12 * s,
                    paddingBottom: isLast ? 0 : 4 * s,
                    position: 'relative',
                    marginBottom: isLast ? 0 : 6 * s,
                  }}
                >
                  {/* Number circle + connector */}
                  <div style={{ position: 'relative', flexShrink: 0, width: 32 * s }}>
                    <div style={{
                      width: 32 * s,
                      height: 32 * s,
                      borderRadius: '50%',
                      background: phase.bgColor,
                      border: `1px solid ${phase.accentColor}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: FONTS.mono,
                      fontSize: step.num.length > 1 ? 9 * s : 12 * s,
                      fontWeight: 600,
                      color: phase.accentColor,
                      position: 'relative',
                      zIndex: 2,
                    }}>
                      {step.num}
                    </div>
                    {/* Connector line to next step */}
                    {!isLast && (
                      <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: 32 * s,
                        bottom: -(6 * s + 32 * s / 2),
                        width: 1 * s,
                        background: `${phase.accentColor}40`,
                        transform: 'translateX(-50%)',
                        zIndex: 1,
                      }} />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, paddingTop: 2 * s }}>
                    <div style={{
                      fontFamily: FONTS.ui,
                      fontSize: 13 * s,
                      fontWeight: 600,
                      color: textCol,
                      marginBottom: 3 * s,
                      lineHeight: 1.3,
                    }}>
                      {step.title}
                    </div>
                    <div style={{
                      fontFamily: FONTS.ui,
                      fontSize: 11 * s,
                      color: labelCol,
                      lineHeight: 1.45,
                      marginBottom: 6 * s,
                    }}>
                      {step.desc}
                    </div>
                    {/* Tool tags */}
                    <div style={{ display: 'flex', gap: 4 * s, flexWrap: 'wrap' }}>
                      {step.tools.map((tool, ti) => (
                        <span
                          key={ti}
                          style={{
                            fontFamily: FONTS.mono,
                            fontSize: 9 * s,
                            fontWeight: 500,
                            padding: `${2 * s}px ${7 * s}px`,
                            borderRadius: 10 * s,
                            background: phase.bgColor,
                            color: phase.accentColor,
                            border: `0.5px solid ${phase.accentColor}40`,
                            letterSpacing: 0.3 * s,
                          }}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: `${12 * s}px ${pad}px ${28 * s}px`,
        borderTop: `1px solid ${borderCol}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: FONTS.mono,
          fontSize: 10 * s,
          color: labelCol,
          letterSpacing: 1 * s,
        }}>
          {data.footerText}
        </span>
        <span style={{
          fontFamily: FONTS.mono,
          fontSize: 9 * s,
          color: labelCol,
          opacity: 0.6,
          letterSpacing: 1 * s,
          textTransform: 'uppercase',
        }}>
          Managed Outreach System
        </span>
      </div>
    </div>
  );
}
