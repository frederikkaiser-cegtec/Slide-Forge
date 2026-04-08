import { LOGO_URL } from '../../utils/assets';
import {
  FONTS, COLORS, CEGTEC_LIGHT_DEFAULTS,
  isDark, adjustBrightness, logoFilter, hexToRgb,
} from '../../utils/cegtecTheme';

export interface CleanupStep {
  label: string;
  description: string;
}

export interface CleanupStat {
  value: string;
  label: string;
}

export interface CrmCleanupData {
  title: string;
  subtitle: string;
  sourceLabel: string;
  badgeText: string;
  hookLine: string;
  steps: CleanupStep[];
  stats: CleanupStat[];
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

export const defaultCrmCleanupData: CrmCleanupData = {
  title: 'CRM-Cleanup\nmit Claude Code',
  subtitle: 'Dein HubSpot hat 5.000 Kontakte. 40% davon sind Müll.',
  sourceLabel: 'CEGTEC ACADEMY',
  badgeText: 'CRM CLEANUP',
  hookLine: 'HubSpot MCP · Claude Code · Kein CSV-Export · Kein manueller Reimport',
  steps: [
    { label: 'AUDIT', description: 'Datenqualitäts-Report: Lücken, Duplikate, verwaiste Records' },
    { label: 'DUPLIKATE', description: 'Exakt-, Domain- und Fuzzy-Matching über alle Kontakte' },
    { label: 'ANREICHERN', description: 'Fehlende Domains, Company-Zuordnungen, Lifecycle Stages' },
    { label: 'AUFRÄUMEN', description: 'Inaktive Kontakte taggen, stagnierende Deals markieren' },
    { label: 'PROPERTIES', description: 'Unbefüllte Fields löschen, Naming vereinheitlichen' },
    { label: 'AUTOMATISIEREN', description: 'Pflichtfelder, Validierung, regelmäßige Audits' },
  ],
  stats: [
    { value: '40–60%', label: 'der Records haben fehlende Pflichtfelder' },
    { value: '10–25%', label: 'Duplikat-Rate bei CRMs >2 Jahre' },
    { value: '4–8 Std', label: 'statt 2–4 Wochen manuell' },
  ],
  resultMetrics: 'Sauberere Reports · Bessere Segmentierung · Höhere Outbound-Qualität · Vertrauenswürdige Daten',
  resultSource: 'CegTec CRM-Cleanup Erfahrungswerte',
  ...CEGTEC_LIGHT_DEFAULTS,
};

const STEP_COLORS = ['#2563EB', '#7C3AED', '#0891B2', '#D97706', '#059669', '#DC2626'];
const STAT_COLORS = ['#DC2626', '#D97706', '#059669'];

const STEP_ICONS = [
  // Audit — magnifier chart
  (sz: number, c: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <circle cx="10.5" cy="10.5" r="6.5" stroke={c} strokeWidth="2" />
      <line x1="15.5" y1="15.5" x2="21" y2="21" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <path d="M8 12V9M10.5 12V7.5M13 12V10" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  // Duplikate — copy/stack
  (sz: number, c: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <rect x="8" y="8" width="12" height="12" rx="2" stroke={c} strokeWidth="2" />
      <path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" stroke={c} strokeWidth="2" />
    </svg>
  ),
  // Anreichern — database plus
  (sz: number, c: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="5" rx="8" ry="3" stroke={c} strokeWidth="2" />
      <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" stroke={c} strokeWidth="2" />
      <path d="M4 11v6c0 1.66 3.58 3 8 3" stroke={c} strokeWidth="2" />
      <path d="M18 16v4M16 18h4" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  // Aufräumen — trash/archive
  (sz: number, c: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <path d="M21 8H3l1.5 12A2 2 0 006.48 22h11.04a2 2 0 001.98-1.72L21 8z" stroke={c} strokeWidth="2" />
      <path d="M2 8h20" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <path d="M12 12v6M8 12v6M16 12v6" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 4h4a1 1 0 011 1v3H9V5a1 1 0 011-1z" stroke={c} strokeWidth="2" />
    </svg>
  ),
  // Properties — settings/sliders
  (sz: number, c: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <line x1="4" y1="6" x2="20" y2="6" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="12" x2="20" y2="12" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="18" x2="20" y2="18" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <circle cx="8" cy="6" r="2" fill={c} />
      <circle cx="16" cy="12" r="2" fill={c} />
      <circle cx="10" cy="18" r="2" fill={c} />
    </svg>
  ),
  // Automatisieren — repeat/cycle
  (sz: number, c: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <path d="M17 1l4 4-4 4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 11V9a4 4 0 014-4h14" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <path d="M7 23l-4-4 4-4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 13v2a4 4 0 01-4 4H3" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
];

export function CrmCleanupGraphic({
  data, width, height,
}: {
  data: CrmCleanupData; width: number; height: number;
}) {
  const isLandscape = width > height;
  return isLandscape
    ? <Landscape data={data} width={width} height={height} />
    : <Portrait data={data} width={width} height={height} />;
}

/* ═══════════════════════════════════════════════════════ */

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
        <linearGradient id={`${uid}-topline`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0" />
          <stop offset="20%" stopColor={accent} />
          <stop offset="50%" stopColor="#DC2626" />
          <stop offset="80%" stopColor="#059669" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx={width * 0.15} cy={height * 0.15} rx={280 * s} ry={180 * s}
        fill="#DC2626" opacity={dark ? 0.05 : 0.03} filter={`url(#${uid}-blur)`} />
      <ellipse cx={width * 0.8} cy={height * 0.45} rx={240 * s} ry={160 * s}
        fill={accent} opacity={dark ? 0.06 : 0.035} filter={`url(#${uid}-blur)`} />
      <ellipse cx={width * 0.35} cy={height * 0.88} rx={300 * s} ry={150 * s}
        fill="#059669" opacity={dark ? 0.05 : 0.025} filter={`url(#${uid}-blur)`} />
      <rect y={0} width={width} height={4 * s} fill={`url(#${uid}-topline)`} />
      {Array.from({ length: Math.ceil(width / (80 * s)) }).map((_, xi) =>
        Array.from({ length: Math.ceil(height / (80 * s)) }).map((_, yi) => (
          <circle key={`${xi}-${yi}`}
            cx={xi * 80 * s} cy={yi * 80 * s} r={1.2 * s}
            fill={dark ? '#ffffff' : '#000000'} opacity={dark ? 0.06 : 0.04}
          />
        ))
      )}
      <rect width={width} height={height} opacity="0.012" filter={`url(#${uid}-noise)`} />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   PORTRAIT (9:16)
   ═══════════════════════════════════════════════════════ */

function Portrait({ data, width, height }: { data: CrmCleanupData; width: number; height: number }) {
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
      <SvgAtmosphere width={width} height={height} s={s} accent={accent} dark={dark} uid="crm-p" />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        padding: `${56 * s}px ${68 * s}px ${44 * s}px`,
      }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 28 * s }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 * s }}>
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
            fontStyle: 'italic',
          }}>{data.subtitle}</p>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1.5, background: cardBorder, marginBottom: 24 * s, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 120 * s, height: 1.5, background: accent }} />
        </div>

        {/* ── HERO STATS ── */}
        <div style={{
          display: 'flex', gap: 14 * s, marginBottom: 36 * s,
        }}>
          {data.stats.map((stat, i) => {
            const sc = STAT_COLORS[i % STAT_COLORS.length];
            return (
              <div key={i} style={{
                flex: 1, padding: `${24 * s}px ${16 * s}px`,
                background: cardBg, borderRadius: 14 * s,
                border: `1.5px solid ${cardBorder}`,
                borderTop: `4px solid ${sc}`,
                textAlign: 'center' as const,
              }}>
                <div style={{
                  fontSize: 48 * s, fontWeight: 800, color: sc,
                  lineHeight: 1.05, letterSpacing: -2 * s,
                  marginBottom: 10 * s,
                }}>{stat.value}</div>
                <div style={{
                  fontFamily: FONTS.mono, fontSize: 14 * s,
                  color: textMuted, lineHeight: 1.35,
                }}>{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* ── 6 STEPS ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: 28 * s }}>
          <div style={{
            fontFamily: FONTS.mono, fontSize: 13 * s, fontWeight: 600,
            letterSpacing: 3 * s, textTransform: 'uppercase' as const, color: textDim,
            marginBottom: 16 * s, display: 'flex', alignItems: 'center', gap: 8 * s,
          }}>
            Cleanup — {data.steps.length} Schritte
            <span style={{ flex: 1, height: 1, background: cardBorder }} />
          </div>

          <div style={{
            display: 'flex', flexDirection: 'column', position: 'relative',
            flex: 1, justifyContent: 'space-between',
          }}>
            {/* Gradient connector */}
            <div style={{
              position: 'absolute', left: 30 * s, top: 30 * s, bottom: 30 * s,
              width: 3 * s, zIndex: 0, borderRadius: 2 * s,
              background: `linear-gradient(to bottom, ${STEP_COLORS[0]}50, ${STEP_COLORS[2]}50, ${STEP_COLORS[4]}50, ${STEP_COLORS[5]}50)`,
            }} />

            {data.steps.map((step, i) => {
              const pc = STEP_COLORS[i % STEP_COLORS.length];
              const iconFn = STEP_ICONS[i % STEP_ICONS.length];
              const isLast = i === data.steps.length - 1;
              const isFirst = i === 0;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  {/* Circle */}
                  <div style={{
                    width: 60 * s, height: 60 * s, borderRadius: '50%', flexShrink: 0,
                    background: isLast ? '#059669' : cardBg,
                    border: `2.5px solid ${isLast ? '#059669' : isFirst ? accent : pc}40`,
                    boxShadow: isLast ? `0 0 ${18 * s}px rgba(5,150,105,0.3)` : isFirst ? `0 0 ${14 * s}px ${accent}18` : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', zIndex: 2,
                  }}>
                    {isLast ? (
                      STEP_ICONS[5](30 * s, '#fff')
                    ) : (
                      <span style={{
                        fontFamily: FONTS.mono, fontSize: 24 * s, fontWeight: 800,
                        color: isFirst ? accent : pc,
                      }}>{i + 1}</span>
                    )}
                  </div>

                  {/* Card */}
                  <div style={{
                    flex: 1, marginLeft: 18 * s,
                    background: cardBg,
                    border: isLast ? `2px solid #059669` : `1.5px solid ${cardBorder}`,
                    borderRadius: 12 * s, padding: `${20 * s}px ${24 * s}px`,
                    display: 'flex', alignItems: 'center', gap: 18 * s,
                    boxShadow: isLast
                      ? `0 ${4 * s}px ${20 * s}px rgba(5,150,105,0.1)`
                      : `0 ${2 * s}px ${8 * s}px rgba(0,0,0,0.03)`,
                    position: 'relative', overflow: 'hidden',
                  }}>
                    {/* Left accent bar */}
                    <div style={{
                      position: 'absolute', left: 0, top: '10%', bottom: '10%',
                      width: 4 * s, borderRadius: `0 ${2 * s}px ${2 * s}px 0`,
                      background: pc,
                    }} />

                    <div style={{
                      width: 54 * s, height: 54 * s, borderRadius: 14 * s,
                      background: dark ? `${pc}18` : `${pc}0B`,
                      border: `1.5px solid ${pc}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {iconFn(30 * s, pc)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: FONTS.mono, fontSize: 16 * s, fontWeight: 700,
                        letterSpacing: 2 * s, textTransform: 'uppercase' as const,
                        color: pc, marginBottom: 5 * s,
                      }}>{step.label}</div>
                      <div style={{
                        fontSize: 19 * s, color: textMuted, lineHeight: 1.35,
                        fontFamily: FONTS.mono, fontWeight: 500,
                      }}>{step.description}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── HOOK LINE ── */}
        <div style={{
          fontFamily: FONTS.mono, fontSize: 14 * s, color: textMuted,
          textAlign: 'center' as const, letterSpacing: 0.5 * s,
          marginBottom: 20 * s,
        }}>{data.hookLine}</div>

        {/* ── RESULT BANNER ── */}
        <div style={{
          padding: `${26 * s}px ${32 * s}px`,
          borderRadius: 14 * s,
          background: dark ? `${accent}10` : `${accent}05`,
          border: `2px solid ${accent}20`,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: 3 * s,
            background: `linear-gradient(90deg, transparent, #DC2626, ${accent}, #059669, transparent)`,
            opacity: 0.4,
          }} />
          <div style={{
            fontFamily: FONTS.mono, fontSize: 18 * s, fontWeight: 600,
            color: titleCol, lineHeight: 1.5, letterSpacing: -0.3 * s,
            textAlign: 'center' as const,
          }}>{data.resultMetrics}</div>
          <div style={{
            fontFamily: FONTS.mono, fontSize: 12 * s, color: textDim,
            marginTop: 10 * s, letterSpacing: 1.5 * s,
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

function Landscape({ data, width, height }: { data: CrmCleanupData; width: number; height: number }) {
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
      <SvgAtmosphere width={width} height={height} s={s} accent={accent} dark={dark} uid="crm-l" />

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
            fontStyle: 'italic',
          }}>{data.subtitle}</div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1.5, background: cardBorder, marginBottom: 14 * s, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 80 * s, height: 1.5, background: accent }} />
        </div>

        {/* ── 2-COLUMN ── */}
        <div style={{ flex: 1, display: 'flex', gap: 24 * s, minHeight: 0 }}>

          {/* LEFT: Stats + Steps (3x2 grid) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 * s }}>
            {/* Stats row */}
            <div style={{ display: 'flex', gap: 8 * s }}>
              {data.stats.map((stat, i) => {
                const sc = STAT_COLORS[i % STAT_COLORS.length];
                return (
                  <div key={i} style={{
                    flex: 1, padding: `${10 * s}px ${10 * s}px`,
                    background: cardBg, borderRadius: 8 * s,
                    border: `1px solid ${cardBorder}`,
                    borderTop: `3px solid ${sc}`,
                    textAlign: 'center' as const,
                  }}>
                    <div style={{
                      fontSize: 22 * s, fontWeight: 800, color: sc,
                      lineHeight: 1.1, letterSpacing: -1 * s, marginBottom: 3 * s,
                    }}>{stat.value}</div>
                    <div style={{
                      fontFamily: FONTS.mono, fontSize: 7 * s,
                      color: textMuted, lineHeight: 1.3,
                    }}>{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Steps label */}
            <div style={{
              fontFamily: FONTS.mono, fontSize: 7 * s, fontWeight: 600,
              letterSpacing: 2.5 * s, textTransform: 'uppercase' as const, color: textDim,
              display: 'flex', alignItems: 'center', gap: 6 * s,
            }}>
              Cleanup — {data.steps.length} Schritte
              <span style={{ flex: 1, height: 1, background: cardBorder }} />
            </div>

            {/* 3x2 grid */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 * s, justifyContent: 'space-between' }}>
              {[0, 2, 4].map((rowStart) => (
                <div key={rowStart} style={{ display: 'flex', gap: 6 * s, flex: 1 }}>
                  {data.steps.slice(rowStart, rowStart + 2).map((step, j) => {
                    const i = rowStart + j;
                    const pc = STEP_COLORS[i % STEP_COLORS.length];
                    const iconFn = STEP_ICONS[i % STEP_ICONS.length];
                    return (
                      <div key={i} style={{
                        flex: 1, padding: `${8 * s}px ${10 * s}px`,
                        background: cardBg, borderRadius: 8 * s,
                        border: `1px solid ${cardBorder}`,
                        display: 'flex', alignItems: 'center', gap: 8 * s,
                        position: 'relative', overflow: 'hidden',
                        boxShadow: `0 ${1 * s}px ${4 * s}px rgba(0,0,0,0.02)`,
                      }}>
                        <div style={{
                          position: 'absolute', left: 0, top: '15%', bottom: '15%',
                          width: 2.5 * s, background: pc, borderRadius: `0 ${2 * s}px ${2 * s}px 0`,
                        }} />
                        <div style={{
                          width: 24 * s, height: 24 * s, borderRadius: '50%',
                          background: dark ? `${pc}18` : `${pc}0C`,
                          border: `1px solid ${pc}25`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <span style={{ fontFamily: FONTS.mono, fontSize: 10 * s, fontWeight: 800, color: pc }}>{i + 1}</span>
                        </div>
                        <div style={{
                          width: 22 * s, height: 22 * s, borderRadius: 5 * s,
                          background: dark ? `${pc}12` : `${pc}08`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>{iconFn(12 * s, pc)}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontFamily: FONTS.mono, fontSize: 8 * s, fontWeight: 700,
                            letterSpacing: 1.5 * s, color: pc, marginBottom: 1 * s,
                          }}>{step.label}</div>
                          <div style={{
                            fontFamily: FONTS.mono, fontSize: 7 * s, color: textMuted, lineHeight: 1.25,
                          }}>{step.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Result */}
          <div style={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 10 * s }}>
            <div style={{
              fontFamily: FONTS.mono, fontSize: 7 * s, fontWeight: 600,
              letterSpacing: 2.5 * s, textTransform: 'uppercase' as const, color: textDim,
              display: 'flex', alignItems: 'center', gap: 6 * s,
            }}>
              Was Claude übernimmt
              <span style={{ flex: 1, height: 1, background: cardBorder }} />
            </div>

            {/* Claude does / You decide */}
            <div style={{
              flex: 1, borderRadius: 10 * s, overflow: 'hidden',
              border: `1.5px solid ${dark ? `${accent}20` : `${accent}15`}`,
              background: dark ? `${accent}08` : `${accent}03`,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{
                padding: `${10 * s}px ${14 * s}px`,
                background: dark ? `${accent}12` : `${accent}06`,
                fontFamily: FONTS.mono, fontSize: 8 * s, fontWeight: 700,
                letterSpacing: 2 * s, color: accent, textTransform: 'uppercase' as const,
              }}>Claude übernimmt</div>
              {['Datenqualitäts-Audit', 'Duplikat-Identifikation', 'Bulk-Updates & Tags', 'Property-Analyse', 'Standardisierung'].map((item, i) => (
                <div key={i} style={{
                  padding: `${7 * s}px ${14 * s}px`,
                  borderTop: `1px solid ${dark ? `${accent}10` : `${accent}08`}`,
                  display: 'flex', alignItems: 'center', gap: 8 * s,
                }}>
                  <svg width={10 * s} height={10 * s} viewBox="0 0 16 16" fill="none">
                    <path d="M2 8l4 4 8-8" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 8.5 * s, color: titleCol, fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{
              flex: 1, borderRadius: 10 * s, overflow: 'hidden',
              border: `1.5px solid ${dark ? 'rgba(217,119,6,0.2)' : 'rgba(217,119,6,0.15)'}`,
              background: dark ? 'rgba(217,119,6,0.04)' : 'rgba(217,119,6,0.02)',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{
                padding: `${10 * s}px ${14 * s}px`,
                background: dark ? 'rgba(217,119,6,0.1)' : 'rgba(217,119,6,0.06)',
                fontFamily: FONTS.mono, fontSize: 8 * s, fontWeight: 700,
                letterSpacing: 2 * s, color: '#D97706', textTransform: 'uppercase' as const,
              }}>Du entscheidest</div>
              {['Merge-Entscheidungen', 'Archivieren vs. Behalten', 'Property-Löschungen', 'Regeln für die Zukunft'].map((item, i) => (
                <div key={i} style={{
                  padding: `${7 * s}px ${14 * s}px`,
                  borderTop: `1px solid ${dark ? 'rgba(217,119,6,0.08)' : 'rgba(217,119,6,0.06)'}`,
                  display: 'flex', alignItems: 'center', gap: 8 * s,
                }}>
                  <svg width={10 * s} height={10 * s} viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="#D97706" strokeWidth="2" />
                    <path d="M8 5v3M8 10v1" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 8.5 * s, color: titleCol, fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Result */}
            <div style={{
              padding: `${12 * s}px ${14 * s}px`,
              borderRadius: 10 * s,
              background: dark ? `${accent}10` : `${accent}05`,
              border: `1.5px solid ${accent}20`,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: '10%', right: '10%', height: 2 * s,
                background: `linear-gradient(90deg, transparent, #DC2626, ${accent}, #059669, transparent)`,
                opacity: 0.4,
              }} />
              <div style={{
                fontFamily: FONTS.mono, fontSize: 9.5 * s, fontWeight: 600,
                color: titleCol, lineHeight: 1.5, textAlign: 'center' as const,
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
