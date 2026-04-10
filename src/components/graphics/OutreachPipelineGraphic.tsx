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
}

export interface OutreachPipelineData {
  topLabel: string;
  title: string;
  subtitle: string;
  phases: PipelinePhase[];
  footerText: string;
  activePhaseIndex?: number; // wenn gesetzt: nur diese Phase rendern (Carousel-Modus)
  backgroundColor?: string;
  textColor?: string;
  labelColor?: string;
  borderColor?: string;
}

// ── Default Data ───────────────────────────────────────────────────

export const defaultOutreachPipelineData: OutreachPipelineData = {
  topLabel: 'MANAGED OUTREACH',
  title: 'Systematische\nLP-Ansprache',
  subtitle: 'Von der ersten Datenliste bis zum qualifizierten Gespräch.',
  footerText: 'cegtec.net',
  phases: [
    {
      label: 'Phase 1 — Foundation',
      accentColor: '#3C3489',
      bgColor: '#EEEDFE',
      steps: [
        {
          num: '0',
          title: 'TAM & ICP-Validierung',
          desc: 'Marktgröße bewerten, adressierbares Universum quantifizieren. Entscheidung: Multichannel oder Account-Based 1:1?',
          tools: ['Desk Research', 'BaFin-Register'],
        },
        {
          num: '1',
          title: 'Playbook-Definition',
          desc: 'ICP, Personas, Offer, Messaging-Angles, Kanalstrategie, Sequenz-Architektur',
          tools: ['Playbook Wizard', 'Notion'],
        },
      ],
    },
    {
      label: 'Phase 2 — Infrastruktur & Daten',
      accentColor: '#0C447C',
      bgColor: '#E6F1FB',
      steps: [
        {
          num: '2',
          title: 'Technisches Setup',
          desc: 'Domain-Kauf, DNS (SPF, DKIM, DMARC), Mailbox-Provisioning, 2–4 Wochen Warmup',
          tools: ['Instantly', 'DNS'],
        },
        {
          num: '3',
          title: 'Datenbeschaffung',
          desc: 'Lead-Listen nach ICP: Firmen (Branche, AuM, Regulierungsstatus), Entscheider (Name, Titel)',
          tools: ['Clay', 'LinkedIn SN'],
        },
      ],
    },
    {
      label: 'Phase 3 — Intelligence',
      accentColor: '#085041',
      bgColor: '#E1F5EE',
      steps: [
        {
          num: '4',
          title: 'Enrichment',
          desc: 'E-Mail-Verifizierung, LinkedIn-Zuordnung, Investment-Datenpunkte: Fondsfokus, AuM, letzte Investments',
          tools: ['Clay Enrichment', 'Waterfall'],
        },
        {
          num: '4.5',
          title: 'QA-Gate',
          desc: 'Datenqualität prüfen: Match-Rate, fehlende Felder, falsche Zuordnungen. Nur validierte Leads weiter.',
          tools: ['Quality Check'],
        },
        {
          num: '5',
          title: 'Personalisierung',
          desc: 'AI-generierte Opener basierend auf Fondsprofil, Portfolio, Investmentfokus. Pro Persona eigene Value Props.',
          tools: ['AI-Layer', 'Clay AI'],
        },
      ],
    },
    {
      label: 'Phase 4 — Execution',
      accentColor: '#633806',
      bgColor: '#FAEEDA',
      steps: [
        {
          num: '6',
          title: 'Sequenz-Aufbau',
          desc: 'Mehrstufig: Hook → Vertiefung → Social Proof → Breakup. Pro Kanal eigene Varianten, A/B-Tests.',
          tools: ['Instantly', 'HeyReach'],
        },
        {
          num: '7',
          title: 'Multichannel-Aussteuerung',
          desc: 'E-Mail + LinkedIn parallel. Timing, Sender-Rotation, Bounce-Handling, DSGVO-konform.',
          tools: ['Instantly', 'HeyReach'],
        },
      ],
    },
    {
      label: 'Phase 5 — Optimization & Handoff',
      accentColor: '#712B13',
      bgColor: '#FAECE7',
      steps: [
        {
          num: '8',
          title: 'Monitoring & Iteration',
          desc: 'Open/Reply Rates tracken, schwache Sequenzen stoppen, A/B-Gewinner skalieren.',
          tools: ['Instantly Analytics', 'HubSpot'],
        },
        {
          num: '9',
          title: 'CRM-Handoff',
          desc: 'Leads mit vollständigem Kontext ins CRM. Ownership-Transfer, Briefing-Paket für den Kunden.',
          tools: ['HubSpot'],
        },
        {
          num: '10',
          title: 'Qualifizierte Gespräche',
          desc: 'Kalender-Booking. LP-Beziehung gehört ab Tag 1 dem Kunden. Volle Transparenz.',
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

  // ── Single-Phase view (Carousel-Modus) ──────────────────────────
  if (typeof data.activePhaseIndex === 'number') {
    const phase = data.phases[data.activePhaseIndex];
    if (!phase) return null;
    const phaseIdx = data.activePhaseIndex;
    const [pr, pg, pb] = hexToRgb(phase.accentColor);
    const textDim = adjustBrightness(labelCol, -10);

    return (
      <div style={{ width, height, background: bg, position: 'relative', overflow: 'hidden', fontFamily: FONTS.display }}>

        {/* ── SVG Atmosphere ── */}
        <svg viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <defs>
            <filter id="sf-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={80 * s} />
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
          <ellipse cx={width * 0.85} cy={height * 0.12} rx={260 * s} ry={200 * s}
            fill={phase.accentColor} opacity={0.06} filter="url(#sf-blur)" />
          {/* Ambient orb bottom-left */}
          <ellipse cx={width * 0.15} cy={height * 0.88} rx={220 * s} ry={180 * s}
            fill={phase.accentColor} opacity={0.04} filter="url(#sf-blur)" />
          {/* Accent top stripe */}
          <rect y={0} width={width} height={3.5 * s} fill={`url(#sf-topline)`} />
          {/* Grid dots */}
          {Array.from({ length: Math.ceil(width / (72 * s)) }).map((_, xi) =>
            Array.from({ length: Math.ceil(height / (72 * s)) }).map((_, yi) => (
              <circle key={`${xi}-${yi}`} cx={xi * 72 * s} cy={yi * 72 * s} r={1 * s}
                fill="#000000" opacity={0.035} />
            ))
          )}
          {/* Noise */}
          <rect width={width} height={height} opacity="0.01" filter="url(#sf-noise)" />
        </svg>

        {/* ── Content layer ── */}
        <div style={{
          position: 'relative', zIndex: 1, width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          padding: `${48 * s}px ${60 * s}px ${36 * s}px`,
        }}>

          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 * s }}>
            <img src={LOGO_URL} alt="CegTec" style={{ height: 28 * s, objectFit: 'contain', ...logoFilter(bg) }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 * s }}>
              {data.phases.map((_, pi) => (
                <div key={pi} style={{
                  width: pi === phaseIdx ? 20 * s : 6 * s, height: 6 * s, borderRadius: 3 * s,
                  background: pi === phaseIdx ? phase.accentColor : COLORS.border,
                }} />
              ))}
            </div>
          </div>

          {/* Phase badge + title */}
          <div style={{ marginBottom: 24 * s }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 * s, marginBottom: 12 * s }}>
              <div style={{ width: 3.5 * s, height: 20 * s, borderRadius: 2 * s, background: phase.accentColor }} />
              <span style={{
                fontFamily: FONTS.mono, fontSize: 11 * s, fontWeight: 700,
                letterSpacing: 2.5 * s, textTransform: 'uppercase' as const, color: phase.accentColor,
              }}>{phase.label}</span>
            </div>
            <div style={{
              fontFamily: FONTS.display, fontSize: 38 * s, fontWeight: 800,
              color: textCol, lineHeight: 1.05, letterSpacing: -1.5 * s,
              marginBottom: 0,
            }}>
              {phase.label.split('—')[1]?.trim() || phase.label}
            </div>
          </div>

          {/* Divider with accent */}
          <div style={{ width: '100%', height: 1.5 * s, background: borderCol, marginBottom: 28 * s, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 80 * s, height: 1.5 * s, background: phase.accentColor }} />
          </div>

          {/* Steps */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {phase.steps.map((step, si) => {
              const isLast = si === phase.steps.length - 1;
              return (
                <div key={si} style={{ display: 'flex', gap: 24 * s, flex: 1 }}>
                  {/* Left: circle + connector */}
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: 48 * s, height: 48 * s, borderRadius: '50%',
                      background: phase.accentColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: FONTS.mono, fontSize: step.num.length > 1 ? 13 * s : 18 * s,
                      fontWeight: 800, color: '#fff', flexShrink: 0,
                      boxShadow: `0 6px 18px rgba(${pr},${pg},${pb},0.30)`,
                    }}>
                      {step.num}
                    </div>
                    {!isLast && (
                      <div style={{
                        flex: 1, width: 2 * s, marginTop: 6 * s,
                        background: `linear-gradient(to bottom, ${phase.accentColor}60, ${phase.accentColor}10)`,
                        borderRadius: 2 * s,
                      }} />
                    )}
                  </div>

                  {/* Right: no card, editorial layout */}
                  <div style={{
                    flex: 1,
                    paddingTop: 4 * s,
                    paddingBottom: isLast ? 0 : 48 * s,
                  }}>
                    <div style={{
                      fontFamily: FONTS.display,
                      fontSize: 40 * s,
                      fontWeight: 800,
                      color: textCol,
                      lineHeight: 1.05,
                      letterSpacing: -1.5 * s,
                      marginBottom: 14 * s,
                    }}>
                      {step.title}
                    </div>
                    <div style={{
                      fontFamily: FONTS.ui,
                      fontSize: 16 * s,
                      color: labelCol,
                      lineHeight: 1.6,
                      marginBottom: 16 * s,
                    }}>
                      {step.desc}
                    </div>
                    {/* Tool tags — inline, no box */}
                    <div style={{ display: 'flex', gap: 8 * s, flexWrap: 'wrap', alignItems: 'center' }}>
                      {step.tools.map((tool, ti) => (
                        <span key={ti} style={{
                          fontFamily: FONTS.mono, fontSize: 11 * s, fontWeight: 600,
                          color: phase.accentColor,
                          letterSpacing: 0.5 * s,
                        }}>
                          {ti > 0 && <span style={{ marginRight: 8 * s, opacity: 0.3 }}>·</span>}
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: 20 * s, paddingTop: 16 * s,
            borderTop: `1px solid ${borderCol}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 10 * s, color: textDim, letterSpacing: 1.5 * s, textTransform: 'uppercase' as const }}>
              {data.footerText}
            </span>
            <span style={{ fontFamily: FONTS.mono, fontSize: 10 * s, color: textDim, letterSpacing: 1 * s }}>
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
