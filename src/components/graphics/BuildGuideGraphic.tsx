import { LOGO_URL } from '../../utils/assets';
import {
  FONTS, COLORS, CEGTEC_LIGHT_DEFAULTS,
  isDark, adjustBrightness, logoFilter, hexToRgb,
} from '../../utils/cegtecTheme';

export interface BuildPhase {
  label: string;
  duration: string;
  description: string;
}

export interface StackTool {
  tool: string;
  role: string;
  cost: string;
}

export interface CompareRow {
  label: string;
  before: string;
  after: string;
}

export interface BuildGuideData {
  title: string;
  subtitle: string;
  sourceLabel: string;
  badgeText: string;
  stack: StackTool[];
  phases: BuildPhase[];
  compareRows: CompareRow[];
  totalCost: string;
  totalCostLabel: string;
  resultMetrics: string;
  resultSource: string;
  backgroundColor?: string;
  textColor?: string;
  labelColor?: string;
  filledColor?: string;
  emptyColor?: string;
  borderColor?: string;
  warningColor?: string;
}

export const defaultBuildGuideData: BuildGuideData = {
  title: 'Agent-Friendly Website\nmit Claude Code',
  subtitle: 'Kein Webflow. Kein WordPress. Astro + Claude Code + $0 Hosting.',
  sourceLabel: 'CEGTEC ACADEMY',
  badgeText: 'BUILD GUIDE',
  stack: [
    { tool: 'Astro', role: 'Static Site Generator', cost: '$0' },
    { tool: 'Tailwind CSS', role: 'Styling', cost: '$0' },
    { tool: 'Claude Code', role: 'Build-Prozess', cost: '~$20–50' },
    { tool: 'Cloudflare Pages', role: 'Hosting + SSL', cost: '$0' },
  ],
  phases: [
    { label: 'PROJEKT-SETUP', duration: '30 Min', description: 'CLAUDE.md als Projektbrief, Design-System, Constraints' },
    { label: 'CONTENT-STRUKTUR', duration: '2–3 Std', description: 'Content Collections, Markdown-Schemas, Migration' },
    { label: 'DESIGN & BUILD', duration: '4–8 Std', description: 'Komponenten aus Beschreibungen, Islands Architecture' },
    { label: 'AGENT-READY', duration: '2–3 Std', description: 'Schema Markup, llms.txt, semantisches HTML, robots.txt' },
    { label: 'DEPLOYMENT', duration: '1 Std', description: 'Git Push, Static Hosting, Lighthouse 90+' },
  ],
  compareRows: [
    { label: 'Hosting', before: '20–50€/Mo', after: '0€/Mo' },
    { label: 'JavaScript', before: '100–200KB', after: 'Near-Zero' },
    { label: 'AI-Discovery', before: '0 Features', after: 'llms.txt + Schema + A2A' },
    { label: 'Content', before: 'Vendor Lock-in', after: 'Markdown in Git' },
  ],
  totalCost: '~$20–50/Mo',
  totalCostLabel: 'Nur während des Builds — danach $0/Mo Hosting',
  resultMetrics: 'Lighthouse 90+ · AI-Discovery ab Tag 1 · Content-Ownership 100% · 1–3 Wochen Projektdauer',
  resultSource: 'CegTec Benchmark-Daten',
  ...CEGTEC_LIGHT_DEFAULTS,
};

const PHASE_COLORS = ['#2563EB', '#0891B2', '#D97706', '#059669', '#7C3AED'];

const PHASE_ICONS = [
  (sz: number, c: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <rect x="8" y="2" width="8" height="4" rx="1" stroke={c} strokeWidth="2" />
      <rect x="4" y="6" width="16" height="16" rx="2" stroke={c} strokeWidth="2" />
    </svg>
  ),
  (sz: number, c: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <path d="M3 3h7l2 2h9v16H3V3z" stroke={c} strokeWidth="2" strokeLinejoin="round" />
      <path d="M10 13h7M10 17h4" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  (sz: number, c: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <path d="M18.37 2.63a2.12 2.12 0 013 3L14 13H10V9l7.37-6.37z" stroke={c} strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 17a3 3 0 100 6 3 3 0 000-6z" stroke={c} strokeWidth="2" />
    </svg>
  ),
  (sz: number, c: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="8" width="18" height="12" rx="2" stroke={c} strokeWidth="2" />
      <circle cx="9" cy="14" r="2" stroke={c} strokeWidth="2" />
      <circle cx="15" cy="14" r="2" stroke={c} strokeWidth="2" />
      <path d="M12 2v4M6 8V6M18 8V6" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  (sz: number, c: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" stroke={c} strokeWidth="2" />
      <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11.95A22 22 0 0112 15z" stroke={c} strokeWidth="2" />
    </svg>
  ),
];

const STACK_ICONS = [
  // Astro — star/bolt
  (sz: number, c: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={c} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  ),
  // Tailwind — wind
  (sz: number, c: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <path d="M17.7 7.7A2.5 2.5 0 0121 10c0 2-3 2-3 2H2M9.6 4.6A2 2 0 0112 6c0 2-3 2-3 2H2M12.6 19.4A2 2 0 0015 18c0-2-3-2-3-2H2" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // Claude — terminal
  (sz: number, c: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="3" width="20" height="18" rx="2" stroke={c} strokeWidth="2" />
      <path d="M6 9l4 3-4 3" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="14" y1="15" x2="18" y2="15" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  // Cloudflare — cloud
  (sz: number, c: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" stroke={c} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
];

export function BuildGuideGraphic({
  data, width, height,
}: {
  data: BuildGuideData; width: number; height: number;
}) {
  const isLandscape = width > height;
  return isLandscape
    ? <Landscape data={data} width={width} height={height} />
    : <Portrait data={data} width={width} height={height} />;
}

/* ═══════════════════════════════════════════════════════
   SVG ATMOSPHERE — shared between layouts
   ═══════════════════════════════════════════════════════ */

function SvgAtmosphere({ width, height, s, accent, dark, uid }: {
  width: number; height: number; s: number; accent: string; dark: boolean; uid: string;
}) {
  const [ar, ag, ab] = hexToRgb(accent);
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
        <linearGradient id={`${uid}-topline`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0" />
          <stop offset="25%" stopColor={accent} />
          <stop offset="75%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Ambient orbs */}
      <ellipse cx={width * 0.2} cy={height * 0.18} rx={300 * s} ry={200 * s}
        fill={accent} opacity={dark ? 0.07 : 0.04} filter={`url(#${uid}-blur)`} />
      <ellipse cx={width * 0.75} cy={height * 0.5} rx={250 * s} ry={180 * s}
        fill="#7C3AED" opacity={dark ? 0.05 : 0.03} filter={`url(#${uid}-blur)`} />
      <ellipse cx={width * 0.4} cy={height * 0.85} rx={280 * s} ry={160 * s}
        fill="#059669" opacity={dark ? 0.04 : 0.025} filter={`url(#${uid}-blur)`} />

      {/* Accent top stripe */}
      <rect y={0} width={width} height={4 * s} fill={`url(#${uid}-topline)`} />

      {/* Subtle grid dots at intersections */}
      {Array.from({ length: Math.ceil(width / (80 * s)) }).map((_, xi) =>
        Array.from({ length: Math.ceil(height / (80 * s)) }).map((_, yi) => (
          <circle key={`${xi}-${yi}`}
            cx={xi * 80 * s} cy={yi * 80 * s} r={1.2 * s}
            fill={dark ? '#ffffff' : '#000000'} opacity={dark ? 0.06 : 0.04}
          />
        ))
      )}

      {/* Noise texture */}
      <rect width={width} height={height} opacity="0.012" filter={`url(#${uid}-noise)`} />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   PORTRAIT (9:16)
   ═══════════════════════════════════════════════════════ */

function Portrait({ data, width, height }: { data: BuildGuideData; width: number; height: number }) {
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
      <SvgAtmosphere width={width} height={height} s={s} accent={accent} dark={dark} uid="bg-p" />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        padding: `${56 * s}px ${68 * s}px ${44 * s}px`,
      }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 32 * s }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 * s }}>
            <img src={LOGO_URL} alt="CegTec" style={{ height: 32 * s, ...logoFilter(bg) }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 * s }}>
              <span style={{
                width: 5 * s, height: 5 * s, borderRadius: '50%',
                background: accent, opacity: 0.5, display: 'inline-block',
              }} />
              <span style={{
                fontFamily: FONTS.mono, fontSize: 11 * s, fontWeight: 600,
                color: textDim, letterSpacing: 2.5 * s, textTransform: 'uppercase' as const,
              }}>{data.sourceLabel}</span>
            </div>
          </div>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10 * s,
            marginBottom: 16 * s,
          }}>
            <div style={{ width: 3.5 * s, height: 22 * s, borderRadius: 2 * s, background: accent }} />
            <span style={{
              fontFamily: FONTS.mono, fontSize: 14 * s, fontWeight: 700,
              letterSpacing: 3.5 * s, textTransform: 'uppercase' as const, color: accent,
            }}>{data.badgeText}</span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 56 * s, fontWeight: 800, lineHeight: 1.04,
            letterSpacing: -2.5 * s, margin: 0, marginBottom: 14 * s,
            whiteSpace: 'pre-line' as const,
          }}>
            {data.title.split('\n').map((line, i, arr) => (
              <span key={i}>
                {i === arr.length - 1 ? <span style={{ color: accent }}>{line}</span> : line}
                {i < arr.length - 1 && '\n'}
              </span>
            ))}
          </h1>
          <p style={{
            fontFamily: FONTS.mono, fontSize: 16 * s, color: textMuted,
            margin: 0, lineHeight: 1.4, letterSpacing: 0.2 * s, fontWeight: 500,
          }}>{data.subtitle}</p>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1.5, background: cardBorder, marginBottom: 32 * s, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 120 * s, height: 1.5, background: accent }} />
        </div>

        {/* ── STACK — horizontal pill row ── */}
        <div style={{ marginBottom: 32 * s }}>
          <div style={{
            fontFamily: FONTS.mono, fontSize: 10 * s, fontWeight: 600,
            letterSpacing: 3 * s, textTransform: 'uppercase' as const, color: textDim,
            marginBottom: 16 * s, display: 'flex', alignItems: 'center', gap: 8 * s,
          }}>
            Der Stack
            <span style={{ flex: 1, height: 1, background: cardBorder }} />
            <span style={{
              fontFamily: FONTS.mono, fontSize: 16 * s, fontWeight: 800, color: accent,
              letterSpacing: -0.5 * s,
            }}>{data.totalCost}</span>
          </div>

          <div style={{ display: 'flex', gap: 12 * s }}>
            {data.stack.map((t, i) => {
              const pc = PHASE_COLORS[i % PHASE_COLORS.length];
              const iconFn = STACK_ICONS[i % STACK_ICONS.length];
              return (
                <div key={i} style={{
                  flex: 1, padding: `${18 * s}px ${10 * s}px`,
                  background: cardBg, borderRadius: 12 * s,
                  border: `1px solid ${cardBorder}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 * s,
                  position: 'relative', overflow: 'hidden',
                }}>
                  {/* Top glow bar */}
                  <div style={{
                    position: 'absolute', top: 0, left: '15%', right: '15%', height: 3 * s,
                    background: pc, borderRadius: `0 0 ${4 * s}px ${4 * s}px`,
                  }} />
                  {/* Icon circle */}
                  <div style={{
                    width: 40 * s, height: 40 * s, borderRadius: '50%',
                    background: dark ? `${pc}18` : `${pc}0C`,
                    border: `1.5px solid ${pc}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {iconFn(20 * s, pc)}
                  </div>
                  <div style={{
                    fontSize: 17 * s, fontWeight: 700, letterSpacing: -0.3 * s,
                    textAlign: 'center' as const,
                  }}>{t.tool}</div>
                  <div style={{
                    fontFamily: FONTS.mono, fontSize: 9.5 * s,
                    color: textMuted, textAlign: 'center' as const, lineHeight: 1.3,
                  }}>{t.role}</div>
                  {/* Cost pill */}
                  <div style={{
                    fontFamily: FONTS.mono, fontSize: 14 * s, fontWeight: 700,
                    color: t.cost === '$0' ? '#059669' : accent,
                    background: t.cost === '$0'
                      ? (dark ? 'rgba(5,150,105,0.1)' : '#ECFDF5')
                      : (dark ? `${accent}12` : `${accent}08`),
                    padding: `${4 * s}px ${14 * s}px`, borderRadius: 6 * s,
                  }}>{t.cost}</div>
                </div>
              );
            })}
          </div>

          {/* Total bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: 12 * s, padding: `${10 * s}px ${20 * s}px`,
            fontFamily: FONTS.mono, fontSize: 12 * s, color: textMuted,
            letterSpacing: 0.3 * s,
          }}>
            {data.totalCostLabel}
          </div>
        </div>

        {/* ── PHASEN — timeline ── */}
        <div style={{ marginBottom: 32 * s, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontFamily: FONTS.mono, fontSize: 10 * s, fontWeight: 600,
            letterSpacing: 3 * s, textTransform: 'uppercase' as const, color: textDim,
            marginBottom: 16 * s, display: 'flex', alignItems: 'center', gap: 8 * s,
          }}>
            Workflow — {data.phases.length} Phasen
            <span style={{ flex: 1, height: 1, background: cardBorder }} />
          </div>

          <div style={{
            display: 'flex', flexDirection: 'column', position: 'relative',
            flex: 1, justifyContent: 'space-between',
          }}>
            {/* Gradient connector line */}
            <div style={{
              position: 'absolute', left: 25 * s, top: 28 * s, bottom: 28 * s,
              width: 2.5 * s, zIndex: 0, borderRadius: 2 * s,
              background: `linear-gradient(to bottom, ${PHASE_COLORS[0]}50, ${PHASE_COLORS[2]}50, ${PHASE_COLORS[4]}50)`,
            }} />

            {data.phases.map((phase, i) => {
              const pc = PHASE_COLORS[i % PHASE_COLORS.length];
              const iconFn = PHASE_ICONS[i % PHASE_ICONS.length];
              const isLast = i === data.phases.length - 1;
              const isFirst = i === 0;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  {/* Circle with icon */}
                  <div style={{
                    width: 50 * s, height: 50 * s, borderRadius: '50%', flexShrink: 0,
                    background: isLast ? accent : cardBg,
                    border: `2.5px solid ${isLast ? accent : isFirst ? accent : pc}40`,
                    boxShadow: isLast ? `0 0 ${16 * s}px ${accent}30` : isFirst ? `0 0 ${12 * s}px ${accent}18` : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', zIndex: 2,
                  }}>
                    {isLast ? (
                      PHASE_ICONS[4](22 * s, '#fff')
                    ) : (
                      <span style={{
                        fontFamily: FONTS.mono, fontSize: 16 * s, fontWeight: 800,
                        color: isFirst ? accent : pc,
                      }}>{i + 1}</span>
                    )}
                  </div>

                  {/* Card */}
                  <div style={{
                    flex: 1, marginLeft: 16 * s,
                    background: cardBg,
                    border: isLast ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
                    borderRadius: 10 * s, padding: `${16 * s}px ${20 * s}px`,
                    display: 'flex', alignItems: 'center', gap: 14 * s,
                    boxShadow: isLast
                      ? `0 ${4 * s}px ${20 * s}px ${accent}12`
                      : `0 ${2 * s}px ${8 * s}px rgba(0,0,0,0.03)`,
                    position: 'relative', overflow: 'hidden',
                  }}>
                    {/* Left accent bar */}
                    <div style={{
                      position: 'absolute', left: 0, top: '20%', bottom: '20%',
                      width: 3 * s, borderRadius: `0 ${2 * s}px ${2 * s}px 0`,
                      background: pc,
                    }} />

                    <div style={{
                      width: 40 * s, height: 40 * s, borderRadius: 10 * s,
                      background: dark ? `${pc}18` : `${pc}0B`,
                      border: `1px solid ${pc}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {iconFn(20 * s, pc)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: FONTS.mono, fontSize: 10 * s, fontWeight: 700,
                        letterSpacing: 2.5 * s, textTransform: 'uppercase' as const,
                        color: pc, marginBottom: 3 * s,
                      }}>{phase.label}</div>
                      <div style={{
                        fontSize: 14 * s, color: textMuted, lineHeight: 1.35,
                        fontFamily: FONTS.mono, fontWeight: 500,
                      }}>{phase.description}</div>
                    </div>
                    <span style={{
                      fontFamily: FONTS.mono, fontSize: 13 * s, fontWeight: 700,
                      color: pc, flexShrink: 0,
                      background: dark ? `${pc}15` : `${pc}08`,
                      border: `1px solid ${pc}20`,
                      padding: `${5 * s}px ${12 * s}px`, borderRadius: 6 * s,
                    }}>{phase.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── VORHER / NACHHER — visual cards ── */}
        <div style={{ marginBottom: 28 * s }}>
          <div style={{
            fontFamily: FONTS.mono, fontSize: 10 * s, fontWeight: 600,
            letterSpacing: 3 * s, textTransform: 'uppercase' as const, color: textDim,
            marginBottom: 14 * s, display: 'flex', alignItems: 'center', gap: 8 * s,
          }}>
            Vorher → Nachher
            <span style={{ flex: 1, height: 1, background: cardBorder }} />
          </div>

          <div style={{ display: 'flex', gap: 12 * s }}>
            {/* VORHER column */}
            <div style={{
              flex: 1, borderRadius: 12 * s, overflow: 'hidden',
              border: `1.5px solid ${dark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.12)'}`,
              background: dark ? 'rgba(239,68,68,0.04)' : 'rgba(239,68,68,0.02)',
            }}>
              <div style={{
                padding: `${10 * s}px ${16 * s}px`,
                background: dark ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.05)',
                fontFamily: FONTS.mono, fontSize: 9 * s, fontWeight: 700,
                letterSpacing: 2.5 * s, textTransform: 'uppercase' as const,
                color: '#EF4444', textAlign: 'center' as const,
              }}>Typische B2B-Website</div>
              {data.compareRows.map((row, i) => (
                <div key={i} style={{
                  padding: `${10 * s}px ${16 * s}px`,
                  borderTop: `1px solid ${dark ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.06)'}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 10 * s, fontWeight: 600, color: textMuted }}>{row.label}</span>
                  <span style={{
                    fontFamily: FONTS.mono, fontSize: 13 * s, fontWeight: 700, color: '#EF4444',
                    opacity: 0.75, textDecoration: 'line-through',
                    textDecorationColor: 'rgba(239,68,68,0.4)', textDecorationThickness: `${1.5 * s}px`,
                  }}>{row.before}</span>
                </div>
              ))}
            </div>

            {/* Arrow in the middle */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, width: 36 * s,
            }}>
              <svg width={24 * s} height={24 * s} viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* NACHHER column */}
            <div style={{
              flex: 1, borderRadius: 12 * s, overflow: 'hidden',
              border: `1.5px solid ${dark ? 'rgba(5,150,105,0.2)' : 'rgba(5,150,105,0.15)'}`,
              background: dark ? 'rgba(5,150,105,0.04)' : 'rgba(5,150,105,0.02)',
            }}>
              <div style={{
                padding: `${10 * s}px ${16 * s}px`,
                background: dark ? 'rgba(5,150,105,0.08)' : 'rgba(5,150,105,0.05)',
                fontFamily: FONTS.mono, fontSize: 9 * s, fontWeight: 700,
                letterSpacing: 2.5 * s, textTransform: 'uppercase' as const,
                color: '#059669', textAlign: 'center' as const,
              }}>Astro + Claude Code</div>
              {data.compareRows.map((row, i) => (
                <div key={i} style={{
                  padding: `${10 * s}px ${16 * s}px`,
                  borderTop: `1px solid ${dark ? 'rgba(5,150,105,0.08)' : 'rgba(5,150,105,0.06)'}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 10 * s, fontWeight: 600, color: textMuted }}>{row.label}</span>
                  <span style={{
                    fontFamily: FONTS.mono, fontSize: 13 * s, fontWeight: 700, color: '#059669',
                  }}>{row.after}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RESULT BANNER ── */}
        <div style={{
          padding: `${22 * s}px ${28 * s}px`,
          borderRadius: 12 * s,
          background: dark ? `${accent}10` : `${accent}05`,
          border: `2px solid ${accent}20`,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Subtle gradient glow */}
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: 2.5 * s,
            background: `linear-gradient(90deg, transparent, ${accent}, #7C3AED, transparent)`,
            opacity: 0.4,
          }} />
          <div style={{
            fontFamily: FONTS.mono, fontSize: 15 * s, fontWeight: 600,
            color: titleCol, lineHeight: 1.5, letterSpacing: -0.2 * s,
            textAlign: 'center' as const,
          }}>{data.resultMetrics}</div>
          <div style={{
            fontFamily: FONTS.mono, fontSize: 10 * s, color: textDim,
            marginTop: 8 * s, letterSpacing: 1.5 * s,
            textAlign: 'center' as const, textTransform: 'uppercase' as const,
          }}>Quelle: {data.resultSource}</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LANDSCAPE (16:9)
   ═══════════════════════════════════════════════════════ */

function Landscape({ data, width, height }: { data: BuildGuideData; width: number; height: number }) {
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
      <SvgAtmosphere width={width} height={height} s={s} accent={accent} dark={dark} uid="bg-l" />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        padding: `${24 * s}px ${40 * s}px ${18 * s}px`,
      }}>

        {/* ── TOP BAR ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16 * s,
          marginBottom: 12 * s, flexShrink: 0,
        }}>
          <img src={LOGO_URL} alt="CegTec" style={{ height: 26 * s, ...logoFilter(bg) }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 * s, marginRight: 'auto' }}>
            <div style={{ width: 3 * s, height: 16 * s, borderRadius: 2 * s, background: accent }} />
            <span style={{
              fontFamily: FONTS.mono, fontSize: 9 * s, fontWeight: 700,
              letterSpacing: 3 * s, textTransform: 'uppercase' as const, color: accent,
            }}>{data.badgeText}</span>
          </div>
          <div style={{
            fontSize: 24 * s, fontWeight: 800, lineHeight: 1.1,
            letterSpacing: -1.5 * s, flex: 1, textAlign: 'center' as const,
          }}>{data.title.replace(/\n/g, ' ')}</div>
          <div style={{
            fontFamily: FONTS.mono, fontSize: 9 * s, color: textMuted,
            maxWidth: 280 * s, lineHeight: 1.3, textAlign: 'right' as const,
          }}>{data.subtitle}</div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1.5, background: cardBorder, marginBottom: 14 * s, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 80 * s, height: 1.5, background: accent }} />
        </div>

        {/* ── 3-COLUMN LAYOUT ── */}
        <div style={{ flex: 1, display: 'flex', gap: 20 * s, minHeight: 0 }}>

          {/* LEFT: Stack */}
          <div style={{ width: '22%', display: 'flex', flexDirection: 'column' }}>
            <div style={{
              fontFamily: FONTS.mono, fontSize: 7 * s, fontWeight: 600,
              letterSpacing: 2.5 * s, textTransform: 'uppercase' as const, color: textDim,
              marginBottom: 8 * s, display: 'flex', alignItems: 'center', gap: 6 * s,
            }}>
              Der Stack
              <span style={{ flex: 1, height: 1, background: cardBorder }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 * s, flex: 1, justifyContent: 'space-between' }}>
              {data.stack.map((t, i) => {
                const pc = PHASE_COLORS[i % PHASE_COLORS.length];
                const iconFn = STACK_ICONS[i % STACK_ICONS.length];
                return (
                  <div key={i} style={{
                    padding: `${10 * s}px ${12 * s}px`,
                    background: cardBg, borderRadius: 8 * s,
                    border: `1px solid ${cardBorder}`,
                    display: 'flex', alignItems: 'center', gap: 10 * s,
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', left: 0, top: '15%', bottom: '15%',
                      width: 3 * s, background: pc, borderRadius: `0 ${2 * s}px ${2 * s}px 0`,
                    }} />
                    <div style={{
                      width: 28 * s, height: 28 * s, borderRadius: '50%',
                      background: dark ? `${pc}18` : `${pc}0C`,
                      border: `1px solid ${pc}25`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>{iconFn(14 * s, pc)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 10 * s, fontWeight: 700 }}>{t.tool}</div>
                      <div style={{ fontFamily: FONTS.mono, fontSize: 7 * s, color: textMuted }}>{t.role}</div>
                    </div>
                    <span style={{
                      fontFamily: FONTS.mono, fontSize: 9 * s, fontWeight: 700,
                      color: t.cost === '$0' ? '#059669' : accent,
                    }}>{t.cost}</span>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div style={{
              marginTop: 8 * s, textAlign: 'center' as const,
              padding: `${8 * s}px ${12 * s}px`, borderRadius: 8 * s,
              background: dark ? `${accent}10` : `${accent}06`,
              border: `1.5px solid ${accent}20`,
            }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 18 * s, fontWeight: 800, color: accent }}>{data.totalCost}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 7 * s, color: textMuted, marginTop: 2 * s }}>{data.totalCostLabel}</div>
            </div>
          </div>

          {/* CENTER: Phases */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{
              fontFamily: FONTS.mono, fontSize: 7 * s, fontWeight: 600,
              letterSpacing: 2.5 * s, textTransform: 'uppercase' as const, color: textDim,
              marginBottom: 8 * s, display: 'flex', alignItems: 'center', gap: 6 * s,
            }}>
              Workflow — {data.phases.length} Phasen
              <span style={{ flex: 1, height: 1, background: cardBorder }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {data.phases.map((phase, i) => {
                const pc = PHASE_COLORS[i % PHASE_COLORS.length];
                const iconFn = PHASE_ICONS[i % PHASE_ICONS.length];
                const isLast = i === data.phases.length - 1;
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10 * s,
                    background: cardBg,
                    border: isLast ? `1.5px solid ${accent}` : `1px solid ${cardBorder}`,
                    borderRadius: 8 * s, padding: `${9 * s}px ${12 * s}px`,
                    boxShadow: isLast ? `0 ${3 * s}px ${12 * s}px ${accent}12` : `0 ${1 * s}px ${4 * s}px rgba(0,0,0,0.02)`,
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', left: 0, top: '15%', bottom: '15%',
                      width: 3 * s, background: pc, borderRadius: `0 ${2 * s}px ${2 * s}px 0`,
                    }} />
                    <div style={{
                      width: 28 * s, height: 28 * s, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: FONTS.mono, fontSize: 10 * s, fontWeight: 800, flexShrink: 0,
                      background: isLast ? accent : cardBg,
                      border: isLast ? 'none' : `1.5px solid ${pc}40`,
                      color: isLast ? '#fff' : pc,
                      boxShadow: isLast ? `0 0 ${8 * s}px ${accent}30` : 'none',
                    }}>{isLast ? '✓' : i + 1}</div>
                    <div style={{
                      width: 26 * s, height: 26 * s, borderRadius: 6 * s,
                      background: dark ? `${pc}18` : `${pc}0B`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>{iconFn(14 * s, pc)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 10 * s, fontWeight: 700, letterSpacing: -0.2 * s }}>{phase.label}</div>
                      <div style={{ fontFamily: FONTS.mono, fontSize: 7.5 * s, color: textMuted, lineHeight: 1.25 }}>{phase.description}</div>
                    </div>
                    <span style={{
                      fontFamily: FONTS.mono, fontSize: 9 * s, fontWeight: 700,
                      color: pc, flexShrink: 0,
                      background: dark ? `${pc}15` : `${pc}08`,
                      border: `1px solid ${pc}18`,
                      padding: `${3 * s}px ${8 * s}px`, borderRadius: 5 * s,
                    }}>{phase.duration}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Compare + Result */}
          <div style={{ width: '26%', display: 'flex', flexDirection: 'column', gap: 10 * s }}>
            <div style={{
              fontFamily: FONTS.mono, fontSize: 7 * s, fontWeight: 600,
              letterSpacing: 2.5 * s, textTransform: 'uppercase' as const, color: textDim,
              display: 'flex', alignItems: 'center', gap: 6 * s,
            }}>
              Vorher → Nachher
              <span style={{ flex: 1, height: 1, background: cardBorder }} />
            </div>

            {/* Compare rows as side-by-side mini cards */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 * s }}>
              {data.compareRows.map((row, i) => (
                <div key={i} style={{
                  flex: 1, borderRadius: 8 * s, overflow: 'hidden',
                  border: `1px solid ${cardBorder}`, background: cardBg,
                }}>
                  <div style={{
                    fontFamily: FONTS.mono, fontSize: 8 * s, fontWeight: 700,
                    color: titleCol, padding: `${5 * s}px ${10 * s}px`,
                    borderBottom: `1px solid ${cardBorder}`,
                    letterSpacing: 0.5 * s,
                  }}>{row.label}</div>
                  <div style={{ display: 'flex' }}>
                    <div style={{
                      flex: 1, padding: `${6 * s}px ${10 * s}px`,
                      borderRight: `1px solid ${cardBorder}`,
                      fontFamily: FONTS.mono, fontSize: 10 * s, fontWeight: 600,
                      color: '#EF4444', opacity: 0.7, textAlign: 'center' as const,
                      textDecoration: 'line-through', textDecorationColor: '#EF444450',
                    }}>{row.before}</div>
                    <div style={{
                      flex: 1, padding: `${6 * s}px ${10 * s}px`,
                      fontFamily: FONTS.mono, fontSize: 10 * s, fontWeight: 700,
                      color: '#059669', textAlign: 'center' as const,
                    }}>{row.after}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Result Banner */}
            <div style={{
              padding: `${12 * s}px ${14 * s}px`,
              borderRadius: 10 * s,
              background: dark ? `${accent}10` : `${accent}05`,
              border: `1.5px solid ${accent}20`,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: '10%', right: '10%', height: 2 * s,
                background: `linear-gradient(90deg, transparent, ${accent}, #7C3AED, transparent)`,
                opacity: 0.4,
              }} />
              <div style={{
                fontFamily: FONTS.mono, fontSize: 9.5 * s, fontWeight: 600,
                color: titleCol, lineHeight: 1.5, letterSpacing: -0.1 * s,
                textAlign: 'center' as const,
              }}>{data.resultMetrics}</div>
              <div style={{
                fontFamily: FONTS.mono, fontSize: 7 * s, color: textDim,
                marginTop: 5 * s, letterSpacing: 1.5 * s,
                textAlign: 'center' as const, textTransform: 'uppercase' as const,
              }}>Quelle: {data.resultSource}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
