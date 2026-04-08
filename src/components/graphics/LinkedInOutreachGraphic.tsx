import { LOGO_URL } from '../../utils/assets';
import {
  FONTS, COLORS, CEGTEC_LIGHT_DEFAULTS,
  isDark, adjustBrightness, logoFilter, hexToRgb,
} from '../../utils/cegtecTheme';

// ── Types ────────────────────────────────────────────────
export interface OutreachProblem { icon: string; text: string }
export interface OutreachTouch { name: string; timing: string; chars: string; schema: string }
export interface OutreachKpi { metric: string; target: string }
export interface OutreachStep { label: string; desc: string }

export interface LinkedInOutreachData {
  title: string;
  subtitle: string;
  badgeText: string;
  sourceLabel: string;
  problems: OutreachProblem[];
  steps: OutreachStep[];
  engagerStat: string;
  engagerStatLabel: string;
  touches: OutreachTouch[];
  kpis: OutreachKpi[];
  resultText: string;
  resultSource: string;
  backgroundColor?: string;
  textColor?: string;
  labelColor?: string;
  filledColor?: string;
  borderColor?: string;
}

export const defaultLinkedInOutreachData: LinkedInOutreachData = {
  title: 'LinkedIn Outreach\nohne Cringe',
  subtitle: 'Signal-Based Targeting, Engager-Playbook und Sequenz-Architektur für Reply-Rates über 10%.',
  badgeText: 'LINKEDIN OUTREACH',
  sourceLabel: 'CEGTEC ACADEMY',
  problems: [
    { icon: '⏱', text: 'Kein Timing-Signal — Blindschuss ohne Intent-Daten' },
    { icon: '📋', text: 'Template-Personalisierung — {Vorname} reicht nicht' },
    { icon: '📢', text: 'Pitchen statt Validieren — Monolog statt Frage' },
    { icon: '🔍', text: 'Kein Research-Layer — oberflächlich ohne Kontext' },
  ],
  steps: [
    { label: 'SIGNAL', desc: 'Jobwechsel, Funding, Stellenausschreibungen, Content-Signale — max. 7 Tage alt' },
    { label: 'ENGAGER', desc: 'Post → Engager tracken → HOT/WARM bewerten → DM innerhalb 2–4h' },
    { label: 'SEQUENZ', desc: '4 Touchpoints mit Schema: Connect → Opener → Follow-up → Break-up' },
  ],
  engagerStat: '20–30%',
  engagerStatLabel: 'Response-Rate vs. 3–5% bei Kaltakquise',
  touches: [
    { name: 'Connect', timing: 'Tag 0', chars: '≤50', schema: 'Signal → Request' },
    { name: 'Opener', timing: '+0–2d', chars: '≤150', schema: 'Dank → Signal → Frage' },
    { name: 'Follow-up', timing: '+3–4d', chars: '≤250', schema: 'Problem → Beweis → CTA' },
    { name: 'Break-up', timing: '+5–7d', chars: '≤100', schema: 'Verständnis → Tür offen' },
  ],
  kpis: [
    { metric: 'Connection', target: '>30%' },
    { metric: 'Reply', target: '>10%' },
    { metric: 'Meeting', target: '>2%' },
    { metric: 'Opt-Out', target: '<2%' },
  ],
  resultText: 'Signal-Based Targeting · Engager-Playbook · 4-Touch Sequenz · Multichannel-Ready · Messbare KPIs',
  resultSource: 'CegTec LinkedIn Outreach Workflow',
  ...CEGTEC_LIGHT_DEFAULTS,
};

// ── Colors ───────────────────────────────────────────────
const STEP_COLORS = ['#2563EB', '#7C3AED', '#059669'];
const TOUCH_COLORS = ['#2563EB', '#7C3AED', '#D97706', '#059669'];
const KPI_COLORS = ['#2563EB', '#059669', '#D97706', '#DC2626'];

// ── Main ─────────────────────────────────────────────────
export function LinkedInOutreachGraphic({
  data, width, height,
}: {
  data: LinkedInOutreachData; width: number; height: number;
}) {
  const ratio = width / height;
  if (ratio > 1.2) return <Landscape data={data} width={width} height={height} />;
  if (ratio > 0.7) return <Square data={data} width={width} height={height} />;
  return <Portrait data={data} width={width} height={height} />;
}

// ── SVG Atmosphere ───────────────────────────────────────
function SvgAtmosphere({ width, height, s, accent, dark, uid }: {
  width: number; height: number; s: number; accent: string; dark: boolean; uid: string;
}) {
  return (
    <svg viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <defs>
        <filter id={`${uid}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={100 * s} />
        </filter>
        <filter id={`${uid}-noise`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
        <linearGradient id={`${uid}-top`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0" />
          <stop offset="20%" stopColor={accent} />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="80%" stopColor="#059669" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx={width * 0.15} cy={height * 0.1} rx={280 * s} ry={180 * s}
        fill={accent} opacity={dark ? 0.06 : 0.035} filter={`url(#${uid}-blur)`} />
      <ellipse cx={width * 0.85} cy={height * 0.4} rx={240 * s} ry={160 * s}
        fill="#7C3AED" opacity={dark ? 0.05 : 0.03} filter={`url(#${uid}-blur)`} />
      <ellipse cx={width * 0.3} cy={height * 0.88} rx={300 * s} ry={150 * s}
        fill="#059669" opacity={dark ? 0.05 : 0.025} filter={`url(#${uid}-blur)`} />
      <rect y={0} width={width} height={4 * s} fill={`url(#${uid}-top)`} />
      {Array.from({ length: Math.ceil(width / (80 * s)) }).map((_, xi) =>
        Array.from({ length: Math.ceil(height / (80 * s)) }).map((_, yi) => (
          <circle key={`${xi}-${yi}`} cx={xi * 80 * s} cy={yi * 80 * s} r={1.2 * s}
            fill={dark ? '#fff' : '#000'} opacity={dark ? 0.06 : 0.04} />
        ))
      )}
      <rect width={width} height={height} opacity="0.012" filter={`url(#${uid}-noise)`} />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   PORTRAIT (9:16)
   ═══════════════════════════════════════════════════════════ */
function Portrait({ data, width, height }: { data: LinkedInOutreachData; width: number; height: number }) {
  const bg = data.backgroundColor || COLORS.bgLightAlt;
  const dark = isDark(bg);
  const accent = data.filledColor || COLORS.filled;
  const titleCol = data.textColor || COLORS.titleLight;
  const textMuted = data.labelColor || COLORS.labelLight;
  const textDim = adjustBrightness(textMuted, -18);
  const borderCol = data.borderColor || COLORS.border;
  const s = Math.min(width / 1080, height / 1920);
  const cardBg = dark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const cardBorder = dark ? 'rgba(255,255,255,0.08)' : borderCol;

  return (
    <div style={{
      width, height, position: 'relative', overflow: 'hidden',
      fontFamily: FONTS.display, background: bg, color: titleCol,
    }}>
      <SvgAtmosphere width={width} height={height} s={s} accent={accent} dark={dark} uid="lo-p" />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        padding: `${52 * s}px ${64 * s}px ${44 * s}px`,
      }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 18 * s }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 * s }}>
            <img src={LOGO_URL} alt="CegTec" style={{ height: 30 * s, ...logoFilter(bg) }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 * s }}>
              <span style={{ width: 5 * s, height: 5 * s, borderRadius: '50%', background: accent, opacity: 0.5, display: 'inline-block' }} />
              <span style={{ fontFamily: FONTS.mono, fontSize: 11 * s, fontWeight: 600, color: textDim, letterSpacing: 2.5 * s, textTransform: 'uppercase' as const }}>{data.sourceLabel}</span>
            </div>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 * s, marginBottom: 14 * s }}>
            <div style={{ width: 3.5 * s, height: 22 * s, borderRadius: 2 * s, background: accent }} />
            <span style={{ fontFamily: FONTS.mono, fontSize: 13 * s, fontWeight: 700, letterSpacing: 3.5 * s, textTransform: 'uppercase' as const, color: accent }}>{data.badgeText}</span>
          </div>
          <h1 style={{
            fontSize: 52 * s, fontWeight: 800, lineHeight: 1.06, letterSpacing: -2.5 * s,
            margin: 0, marginBottom: 10 * s, whiteSpace: 'pre-line' as const,
          }}>
            {data.title.split('\n').map((line, i, arr) => (
              <span key={i}>
                {i === arr.length - 1 ? <span style={{ color: accent }}>{line}</span> : line}
                {i < arr.length - 1 && '\n'}
              </span>
            ))}
          </h1>
          <p style={{
            fontFamily: FONTS.mono, fontSize: 14 * s, color: textMuted, margin: 0,
            lineHeight: 1.4, fontWeight: 500, fontStyle: 'italic',
          }}>{data.subtitle}</p>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1.5, background: cardBorder, marginBottom: 16 * s, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 100 * s, height: 2, background: '#DC2626' }} />
        </div>

        {/* ── PROBLEM ── */}
        <div style={{
          fontFamily: FONTS.mono, fontSize: 11 * s, fontWeight: 600,
          color: '#DC2626', letterSpacing: 3 * s, textTransform: 'uppercase' as const,
          marginBottom: 10 * s,
        }}>WARUM 90% SCHEITERN</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 * s, marginBottom: 18 * s }}>
          {data.problems.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12 * s,
              padding: `${10 * s}px ${16 * s}px`,
              background: dark ? 'rgba(220,38,38,0.04)' : '#FEF2F2',
              borderRadius: 10 * s, border: `1px solid ${dark ? 'rgba(220,38,38,0.1)' : '#FECACA'}`,
            }}>
              <span style={{ fontSize: 16 * s, flexShrink: 0 }}>{p.icon}</span>
              <span style={{ fontSize: 14 * s, fontWeight: 600, color: titleCol, lineHeight: 1.3 }}>{p.text}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1.5, background: cardBorder, marginBottom: 16 * s, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 100 * s, height: 2, background: accent }} />
        </div>

        {/* ── DIE METHODE ── */}
        <div style={{
          fontFamily: FONTS.mono, fontSize: 11 * s, fontWeight: 600,
          color: accent, letterSpacing: 3 * s, textTransform: 'uppercase' as const,
          marginBottom: 10 * s,
        }}>DIE METHODE</div>

        <div style={{
          display: 'flex', flexDirection: 'column', gap: 8 * s,
          marginBottom: 14 * s, position: 'relative',
        }}>
          {/* Connector */}
          <div style={{
            position: 'absolute', left: 26 * s, top: 26 * s, bottom: 26 * s,
            width: 2.5 * s, borderRadius: 2 * s, opacity: 0.2,
            background: `linear-gradient(to bottom, ${STEP_COLORS[0]}, ${STEP_COLORS[1]}, ${STEP_COLORS[2]})`,
          }} />

          {data.steps.map((step, i) => {
            const col = STEP_COLORS[i % STEP_COLORS.length];
            const rgb = hexToRgb(col);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 * s, position: 'relative' }}>
                <div style={{
                  width: 52 * s, height: 52 * s, borderRadius: '50%',
                  background: cardBg, border: `2px solid ${col}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, zIndex: 2, boxShadow: `0 0 16px rgba(${rgb},0.1)`,
                }}>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 18 * s, fontWeight: 800, color: col }}>{i + 1}</span>
                </div>
                <div style={{
                  flex: 1, minWidth: 0, padding: `${14 * s}px ${18 * s}px`,
                  background: cardBg, borderRadius: 12 * s,
                  border: `1.5px solid ${cardBorder}`, position: 'relative',
                }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 * s, background: col, borderRadius: `${12 * s}px 0 0 ${12 * s}px` }} />
                  <div style={{ paddingLeft: 8 * s }}>
                    <span style={{ fontFamily: FONTS.mono, fontSize: 13 * s, fontWeight: 700, color: col, letterSpacing: 2 * s, marginRight: 10 * s }}>{step.label}</span>
                    <span style={{ fontSize: 14 * s, color: textMuted, lineHeight: 1.4, fontWeight: 500 }}>{step.desc}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Engager stat */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16 * s,
          padding: `${14 * s}px ${20 * s}px`, marginBottom: 18 * s,
          background: `linear-gradient(135deg, ${accent}10, #059669${dark ? '0A' : '06'})`,
          borderRadius: 12 * s, border: `1.5px solid ${accent}20`,
        }}>
          <span style={{ fontSize: 38 * s, fontWeight: 800, color: accent, letterSpacing: -2 * s, lineHeight: 1, flexShrink: 0 }}>{data.engagerStat}</span>
          <span style={{ fontSize: 14 * s, color: textMuted, fontWeight: 500, lineHeight: 1.3 }}>{data.engagerStatLabel}</span>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1.5, background: cardBorder, marginBottom: 16 * s, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 80 * s, height: 2, background: '#D97706' }} />
        </div>

        {/* ── 4-TOUCH SEQUENZ ── */}
        <div style={{
          fontFamily: FONTS.mono, fontSize: 11 * s, fontWeight: 600,
          color: '#D97706', letterSpacing: 3 * s, textTransform: 'uppercase' as const,
          marginBottom: 10 * s,
        }}>4-TOUCH SEQUENZ</div>

        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', gap: 6 * s, marginBottom: 16 * s,
        }}>
          {data.touches.map((t, i) => {
            const col = TOUCH_COLORS[i % TOUCH_COLORS.length];
            return (
              <div key={i} style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: 12 * s,
                padding: `${16 * s}px ${20 * s}px`,
                background: cardBg, borderRadius: 12 * s,
                border: `1.5px solid ${cardBorder}`, borderLeft: `4px solid ${col}`,
              }}>
                <div style={{ width: 100 * s, flexShrink: 0 }}>
                  <div style={{ fontSize: 20 * s, fontWeight: 800, color: col }}>{t.name}</div>
                </div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 14 * s, color: textMuted, width: 56 * s, flexShrink: 0 }}>{t.timing}</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 15 * s, fontWeight: 700, color: col, width: 48 * s, flexShrink: 0 }}>{t.chars}</div>
                <div style={{ flex: 1, fontSize: 16 * s, color: textMuted, fontWeight: 500 }}>{t.schema}</div>
              </div>
            );
          })}
        </div>

        {/* ── KPIs ── */}
        <div style={{ display: 'flex', gap: 10 * s, marginBottom: 18 * s }}>
          {data.kpis.map((kpi, i) => {
            const col = KPI_COLORS[i % KPI_COLORS.length];
            return (
              <div key={i} style={{
                flex: 1, padding: `${16 * s}px ${10 * s}px`,
                background: cardBg, borderRadius: 12 * s,
                border: `1.5px solid ${cardBorder}`, borderTop: `3px solid ${col}`,
                textAlign: 'center' as const,
              }}>
                <div style={{ fontSize: 30 * s, fontWeight: 800, color: col, lineHeight: 1, letterSpacing: -1 * s, marginBottom: 6 * s }}>{kpi.target}</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 11 * s, color: textMuted }}>{kpi.metric}</div>
              </div>
            );
          })}
        </div>

        {/* ── RESULT BANNER ── */}
        <div style={{
          padding: `${18 * s}px ${22 * s}px`,
          background: `linear-gradient(135deg, ${accent}12, ${accent}08)`,
          borderRadius: 14 * s, border: `1.5px solid ${accent}25`,
        }}>
          <div style={{ fontSize: 15 * s, fontWeight: 600, color: titleCol, lineHeight: 1.5 }}>
            {data.resultText.split('·').map((part, i, arr) => (
              <span key={i}>
                <span style={{ color: accent, fontWeight: 700 }}>✓</span>{' '}
                {part.trim()}
                {i < arr.length - 1 && <span style={{ color: accent, margin: `0 ${5 * s}px`, opacity: 0.4 }}> · </span>}
              </span>
            ))}
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 10 * s, color: textMuted, marginTop: 8 * s, opacity: 0.65 }}>{data.resultSource}</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SQUARE (1:1 / 4:5 — LinkedIn Post)
   ═══════════════════════════════════════════════════════════ */
function Square({ data, width, height }: { data: LinkedInOutreachData; width: number; height: number }) {
  const bg = data.backgroundColor || COLORS.bgLightAlt;
  const dark = isDark(bg);
  const accent = data.filledColor || COLORS.filled;
  const titleCol = data.textColor || COLORS.titleLight;
  const textMuted = data.labelColor || COLORS.labelLight;
  const textDim = adjustBrightness(textMuted, -18);
  const borderCol = data.borderColor || COLORS.border;
  const s = Math.min(width / 1080, height / 1080);
  const cardBg = dark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const cardBorder = dark ? 'rgba(255,255,255,0.08)' : borderCol;

  return (
    <div style={{
      width, height, position: 'relative', overflow: 'hidden',
      fontFamily: FONTS.display, background: bg, color: titleCol,
    }}>
      <SvgAtmosphere width={width} height={height} s={s} accent={accent} dark={dark} uid="lo-sq" />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        padding: `${48 * s}px ${56 * s}px ${40 * s}px`,
      }}>

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 * s }}>
          <img src={LOGO_URL} alt="CegTec" style={{ height: 28 * s, ...logoFilter(bg) }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 * s }}>
            <div style={{ width: 3 * s, height: 18 * s, borderRadius: 2 * s, background: accent }} />
            <span style={{ fontFamily: FONTS.mono, fontSize: 11 * s, fontWeight: 700, letterSpacing: 3 * s, color: accent, textTransform: 'uppercase' as const }}>{data.badgeText}</span>
          </div>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 48 * s, fontWeight: 800, lineHeight: 1.06, letterSpacing: -2.5 * s,
          margin: 0, marginBottom: 10 * s, whiteSpace: 'pre-line' as const,
        }}>
          {data.title.split('\n').map((line, i, arr) => (
            <span key={i}>
              {i === arr.length - 1 ? <span style={{ color: accent }}>{line}</span> : line}
              {i < arr.length - 1 && '\n'}
            </span>
          ))}
        </h1>
        <p style={{
          fontFamily: FONTS.mono, fontSize: 13 * s, color: textMuted, margin: 0,
          marginBottom: 20 * s, lineHeight: 1.4, fontWeight: 500, fontStyle: 'italic',
        }}>{data.subtitle}</p>

        {/* Divider */}
        <div style={{ width: '100%', height: 1.5, background: cardBorder, marginBottom: 18 * s, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 100 * s, height: 2, background: accent }} />
        </div>

        {/* ── METHOD (compact) ── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', gap: 10 * s,
          position: 'relative', marginBottom: 18 * s,
        }}>
          {/* Connector */}
          <div style={{
            position: 'absolute', left: 24 * s, top: 24 * s, bottom: 24 * s,
            width: 2.5 * s, borderRadius: 2 * s, opacity: 0.2,
            background: `linear-gradient(to bottom, ${STEP_COLORS[0]}, ${STEP_COLORS[1]}, ${STEP_COLORS[2]})`,
          }} />

          {data.steps.map((step, i) => {
            const col = STEP_COLORS[i % STEP_COLORS.length];
            const rgb = hexToRgb(col);
            return (
              <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14 * s, position: 'relative' }}>
                <div style={{
                  width: 48 * s, height: 48 * s, borderRadius: '50%',
                  background: cardBg, border: `2px solid ${col}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, zIndex: 2, boxShadow: `0 0 16px rgba(${rgb},0.1)`,
                }}>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 18 * s, fontWeight: 800, color: col }}>{i + 1}</span>
                </div>
                <div style={{
                  flex: 1, minWidth: 0, padding: `${16 * s}px ${20 * s}px`,
                  background: cardBg, borderRadius: 12 * s,
                  border: `1.5px solid ${cardBorder}`, position: 'relative',
                }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 * s, background: col, borderRadius: `${12 * s}px 0 0 ${12 * s}px` }} />
                  <div style={{ paddingLeft: 8 * s }}>
                    <span style={{ fontFamily: FONTS.mono, fontSize: 14 * s, fontWeight: 700, color: col, letterSpacing: 2 * s, marginRight: 10 * s }}>{step.label}</span>
                    <span style={{ fontSize: 16 * s, color: textMuted, lineHeight: 1.4, fontWeight: 500 }}>{step.desc}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── STAT + KPIs row ── */}
        <div style={{ display: 'flex', gap: 12 * s, marginBottom: 18 * s }}>
          {/* Stat */}
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 14 * s,
            padding: `${16 * s}px ${20 * s}px`,
            background: `linear-gradient(135deg, ${accent}10, #059669${dark ? '0A' : '06'})`,
            borderRadius: 14 * s, border: `1.5px solid ${accent}20`,
          }}>
            <span style={{ fontSize: 36 * s, fontWeight: 800, color: accent, letterSpacing: -2 * s, lineHeight: 1, flexShrink: 0 }}>{data.engagerStat}</span>
            <span style={{ fontSize: 13 * s, color: textMuted, fontWeight: 500, lineHeight: 1.3 }}>{data.engagerStatLabel}</span>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: 'flex', gap: 10 * s }}>
          {data.kpis.map((kpi, i) => {
            const col = KPI_COLORS[i % KPI_COLORS.length];
            return (
              <div key={i} style={{
                flex: 1, padding: `${14 * s}px ${8 * s}px`,
                background: cardBg, borderRadius: 12 * s,
                border: `1.5px solid ${cardBorder}`, borderTop: `3px solid ${col}`,
                textAlign: 'center' as const,
              }}>
                <div style={{ fontSize: 28 * s, fontWeight: 800, color: col, lineHeight: 1, letterSpacing: -1 * s, marginBottom: 4 * s }}>{kpi.target}</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 10 * s, color: textMuted }}>{kpi.metric}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LANDSCAPE (16:9)
   ═══════════════════════════════════════════════════════════ */
function Landscape({ data, width, height }: { data: LinkedInOutreachData; width: number; height: number }) {
  const bg = data.backgroundColor || COLORS.bgLightAlt;
  const dark = isDark(bg);
  const accent = data.filledColor || COLORS.filled;
  const titleCol = data.textColor || COLORS.titleLight;
  const textMuted = data.labelColor || COLORS.labelLight;
  const textDim = adjustBrightness(textMuted, -18);
  const borderCol = data.borderColor || COLORS.border;
  const s = Math.min(width / 1920, height / 1080);
  const cardBg = dark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const cardBorder = dark ? 'rgba(255,255,255,0.08)' : borderCol;

  return (
    <div style={{
      width, height, position: 'relative', overflow: 'hidden',
      fontFamily: FONTS.display, background: bg, color: titleCol,
    }}>
      <SvgAtmosphere width={width} height={height} s={s} accent={accent} dark={dark} uid="lo-l" />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        padding: `${40 * s}px ${52 * s}px ${32 * s}px`,
      }}>

        {/* ── TOP ROW ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 36 * s, marginBottom: 22 * s }}>
          {/* Left — title */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 * s }}>
              <img src={LOGO_URL} alt="CegTec" style={{ height: 26 * s, ...logoFilter(bg) }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 * s }}>
                <div style={{ width: 3 * s, height: 16 * s, borderRadius: 2 * s, background: accent }} />
                <span style={{ fontFamily: FONTS.mono, fontSize: 10 * s, fontWeight: 700, letterSpacing: 3 * s, color: accent, textTransform: 'uppercase' as const }}>{data.badgeText}</span>
              </div>
            </div>
            <h1 style={{
              fontSize: 36 * s, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.5 * s,
              margin: 0, marginBottom: 8 * s, whiteSpace: 'pre-line' as const,
            }}>
              {data.title.split('\n').map((line, i, arr) => (
                <span key={i}>
                  {i === arr.length - 1 ? <span style={{ color: accent }}>{line}</span> : line}
                  {i < arr.length - 1 && '\n'}
                </span>
              ))}
            </h1>
            <p style={{ fontFamily: FONTS.mono, fontSize: 12 * s, color: textMuted, margin: 0, fontStyle: 'italic', fontWeight: 500, lineHeight: 1.4 }}>{data.subtitle}</p>
          </div>

          {/* Right — problems */}
          <div style={{ width: 520 * s, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 5 * s }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 9 * s, fontWeight: 600, color: '#DC2626', letterSpacing: 2.5 * s, marginBottom: 4 * s, textTransform: 'uppercase' as const }}>WARUM 90% SCHEITERN</div>
            {data.problems.map((p, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8 * s,
                padding: `${6 * s}px ${12 * s}px`,
                background: dark ? 'rgba(220,38,38,0.04)' : '#FEF2F2',
                borderRadius: 8 * s, border: `1px solid ${dark ? 'rgba(220,38,38,0.1)' : '#FECACA'}`,
              }}>
                <span style={{ fontSize: 12 * s }}>{p.icon}</span>
                <span style={{ fontSize: 11 * s, fontWeight: 600, color: titleCol, lineHeight: 1.3 }}>{p.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1.5, background: cardBorder, marginBottom: 18 * s, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 100 * s, height: 2, background: accent }} />
        </div>

        {/* ── MAIN: Method + Sequence ── */}
        <div style={{ flex: 1, display: 'flex', gap: 28 * s, minHeight: 0 }}>

          {/* Left — Method steps */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10 * s, fontWeight: 600, color: accent, letterSpacing: 2.5 * s, marginBottom: 10 * s, textTransform: 'uppercase' as const }}>DIE METHODE</div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 8 * s, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 20 * s, top: 20 * s, bottom: 20 * s, width: 2 * s, borderRadius: 2 * s, opacity: 0.2, background: `linear-gradient(to bottom, ${STEP_COLORS[0]}, ${STEP_COLORS[2]})` }} />
              {data.steps.map((step, i) => {
                const col = STEP_COLORS[i % STEP_COLORS.length];
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 * s, position: 'relative' }}>
                    <div style={{
                      width: 40 * s, height: 40 * s, borderRadius: '50%',
                      background: cardBg, border: `2px solid ${col}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, zIndex: 2,
                    }}>
                      <span style={{ fontFamily: FONTS.mono, fontSize: 16 * s, fontWeight: 800, color: col }}>{i + 1}</span>
                    </div>
                    <div style={{
                      flex: 1, padding: `${12 * s}px ${14 * s}px`,
                      background: cardBg, borderRadius: 10 * s,
                      border: `1.5px solid ${cardBorder}`, borderLeft: `3px solid ${col}`,
                    }}>
                      <span style={{ fontFamily: FONTS.mono, fontSize: 10 * s, fontWeight: 700, color: col, letterSpacing: 1.5 * s, marginRight: 8 * s }}>{step.label}</span>
                      <span style={{ fontSize: 12 * s, color: textMuted, fontWeight: 500, lineHeight: 1.3 }}>{step.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Stat */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12 * s, marginTop: 10 * s,
              padding: `${10 * s}px ${16 * s}px`,
              background: `linear-gradient(135deg, ${accent}10, #059669${dark ? '0A' : '06'})`,
              borderRadius: 10 * s, border: `1.5px solid ${accent}20`,
            }}>
              <span style={{ fontSize: 28 * s, fontWeight: 800, color: accent, letterSpacing: -1.5 * s, lineHeight: 1 }}>{data.engagerStat}</span>
              <span style={{ fontSize: 11 * s, color: textMuted, fontWeight: 500 }}>{data.engagerStatLabel}</span>
            </div>
          </div>

          {/* Right — Sequence + KPIs */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10 * s, fontWeight: 600, color: '#D97706', letterSpacing: 2.5 * s, marginBottom: 10 * s, textTransform: 'uppercase' as const }}>4-TOUCH SEQUENZ</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 * s, marginBottom: 12 * s }}>
              {data.touches.map((t, i) => {
                const col = TOUCH_COLORS[i % TOUCH_COLORS.length];
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 8 * s,
                    padding: `${8 * s}px ${12 * s}px`,
                    background: cardBg, borderRadius: 8 * s,
                    border: `1.5px solid ${cardBorder}`, borderLeft: `3px solid ${col}`,
                  }}>
                    <div style={{ width: 64 * s, flexShrink: 0, fontSize: 13 * s, fontWeight: 800, color: col }}>{t.name}</div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 10 * s, color: textMuted, width: 40 * s, flexShrink: 0 }}>{t.timing}</div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 10 * s, fontWeight: 700, color: col, width: 36 * s, flexShrink: 0 }}>{t.chars}</div>
                    <div style={{ flex: 1, fontSize: 11 * s, color: textMuted, fontWeight: 500 }}>{t.schema}</div>
                  </div>
                );
              })}
            </div>
            {/* KPIs */}
            <div style={{ flex: 1, display: 'flex', gap: 8 * s }}>
              {data.kpis.map((kpi, i) => {
                const col = KPI_COLORS[i % KPI_COLORS.length];
                return (
                  <div key={i} style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: `${12 * s}px`,
                    background: cardBg, borderRadius: 10 * s,
                    border: `1.5px solid ${cardBorder}`, borderTop: `3px solid ${col}`,
                    textAlign: 'center' as const,
                  }}>
                    <div style={{ fontSize: 26 * s, fontWeight: 800, color: col, lineHeight: 1, marginBottom: 4 * s }}>{kpi.target}</div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 9 * s, color: textMuted }}>{kpi.metric}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RESULT BANNER ── */}
        <div style={{
          padding: `${14 * s}px ${20 * s}px`, marginTop: 16 * s,
          background: `linear-gradient(135deg, ${accent}10, ${accent}06)`,
          borderRadius: 12 * s, border: `1.5px solid ${accent}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 12 * s, fontWeight: 600, color: titleCol, lineHeight: 1.5 }}>
            {data.resultText.split('·').map((part, i, arr) => (
              <span key={i}>
                <span style={{ color: accent, fontWeight: 700 }}>✓</span>{' '}{part.trim()}
                {i < arr.length - 1 && <span style={{ margin: `0 ${3 * s}px`, opacity: 0.3 }}> · </span>}
              </span>
            ))}
          </div>
          <span style={{ fontFamily: FONTS.mono, fontSize: 9 * s, color: textMuted, opacity: 0.6 }}>{data.resultSource}</span>
        </div>
      </div>
    </div>
  );
}
