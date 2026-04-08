import { LOGO_URL } from '../../utils/assets';
import {
  FONTS, COLORS, CEGTEC_LIGHT_DEFAULTS,
  isDark, adjustBrightness, logoFilter, hexToRgb,
} from '../../utils/cegtecTheme';

// ── Data Interface ──────────────────────────────────────────────

export interface UtilizationPoint {
  year: string;
  pct: number;
}

export interface StatCard {
  value: string;
  label: string;
  source?: string;
  color?: string;
}

export interface InsightRow {
  icon: string;
  text: string;
  highlight?: string;
}

export interface MartechStackData {
  topLabel: string;
  headline: string;
  subline: string;
  utilizationTitle: string;
  utilization: UtilizationPoint[];
  stats: StatCard[];
  insights: InsightRow[];
  bottomLine: string;
  sourceText: string;
  ctaLine: string;
  backgroundColor?: string;
  textColor?: string;
  labelColor?: string;
  filledColor?: string;
  borderColor?: string;
  accentColor?: string;
  dangerColor?: string;
}

export const defaultMartechStackData: MartechStackData = {
  topLabel: 'MARTECH REPORT 2025',
  headline: 'Dein Stack wächst.\nDeine Nutzung sinkt.',
  subline: 'Marketer nutzen nur noch ein Drittel ihres Martech-Stacks. Die Ausgaben steigen trotzdem.',
  utilizationTitle: 'CAPABILITY UTILIZATION (GARTNER)',
  utilization: [
    { year: '2020', pct: 58 },
    { year: '2022', pct: 42 },
    { year: '2023', pct: 33 },
  ],
  stats: [
    { value: '1.200', label: 'Tool-Wechsel pro Tag', source: 'ORANGELOGIC' },
    { value: '25-30%', label: 'Ausgaben verschwendet', source: 'MARTECHINTENTS' },
    { value: '15.384', label: 'MarTech-Lösungen am Markt', source: 'CHIEFMARTEC' },
  ],
  insights: [
    { icon: '📉', text: 'Ausgaben +35% gestiegen', highlight: '15,3 → 23,6 Mrd. USD' },
    { icon: '🔄', text: '70–80 Tools pro Unternehmen', highlight: 'nur ⅓ der Features genutzt' },
    { icon: '💀', text: '1.000+ Tools vom Markt verschwunden', highlight: 'allein 2025' },
    { icon: '✂️', text: '43,8% ersetzen Tools', highlight: 'wegen Kostenreduktion' },
    { icon: '🤖', text: '68,6% nutzen bereits GenAI', highlight: 'als MarTech-Layer' },
    { icon: '🧠', text: 'Nur 12% der Features', highlight: 'machen den Großteil der Nutzung' },
  ],
  bottomLine: 'KI ist kein neues Tool. KI ist der Layer, der deinen Stack endlich nutzbar macht.',
  sourceText: 'Quellen: Gartner 2023/2025, martech.org, chiefmartec.com, McKinsey, Pendo',
  ctaLine: 'cegtec.net',
  ...CEGTEC_LIGHT_DEFAULTS,
  accentColor: '#F59E0B',
  dangerColor: '#EF4444',
};

// ── Component ───────────────────────────────────────────────────

export function MartechStackGraphic({
  data, width, height,
}: {
  data: MartechStackData; width: number; height: number;
}) {
  const s = Math.min(width / 1080, height / 1080);

  const bg = data.backgroundColor || COLORS.bgLight;
  const dark = isDark(bg);
  const filled = data.filledColor || COLORS.filled;
  const accent = data.accentColor || '#F59E0B';
  const danger = data.dangerColor || '#EF4444';
  const textCol = data.textColor || COLORS.titleLight;
  const labelCol = data.labelColor || COLORS.labelLight;
  const borderCol = data.borderColor || COLORS.border;
  const labelDim = adjustBrightness(labelCol, -12);

  const [fr, fg, fb] = hexToRgb(filled);
  const [dr, dg, db] = hexToRgb(danger);
  const [ar, ag, ab] = hexToRgb(accent);

  const headlineLines = data.headline.split('\n');
  const pad = 48 * s;

  // Utilization chart calculations
  const chartPoints = data.utilization;
  const maxPct = 70; // Fixed scale for visual clarity
  const chartH = 155 * s;

  return (
    <div style={{
      width, height, position: 'relative', overflow: 'hidden',
      fontFamily: FONTS.display, background: bg,
    }}>
      {/* ── SVG Atmosphere ── */}
      <svg viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <defs>
          <filter id="ms-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={140 * s} />
          </filter>
          <filter id="ms-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="overlay" />
          </filter>
          <linearGradient id="ms-topline" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={danger} stopOpacity="0" />
            <stop offset="20%" stopColor={danger} />
            <stop offset="50%" stopColor={accent} />
            <stop offset="80%" stopColor={filled} />
            <stop offset="100%" stopColor={filled} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ms-decline" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={filled} />
            <stop offset="100%" stopColor={danger} />
          </linearGradient>
        </defs>

        <rect width={width} height={height} fill={bg} />

        {/* Atmospheric orbs */}
        <ellipse cx={width * 0.15} cy={height * 0.1} rx={300 * s} ry={200 * s}
          fill={danger} opacity={dark ? 0.06 : 0.035} filter="url(#ms-blur)" />
        <ellipse cx={width * 0.85} cy={height * 0.85} rx={280 * s} ry={180 * s}
          fill={accent} opacity={dark ? 0.05 : 0.025} filter="url(#ms-blur)" />
        <ellipse cx={width * 0.5} cy={height * 0.45} rx={250 * s} ry={150 * s}
          fill={filled} opacity={dark ? 0.04 : 0.02} filter="url(#ms-blur)" />

        {/* Top accent stripe */}
        <rect y={0} width={width} height={4 * s} fill="url(#ms-topline)" />

        {/* Subtle grid */}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`h${i}`}
            x1={0} y1={((i + 1) * height) / 11}
            x2={width} y2={((i + 1) * height) / 11}
            stroke={dark ? '#ffffff' : '#000000'}
            strokeWidth={0.5} opacity={0.012}
          />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`v${i}`}
            x1={((i + 1) * width) / 7} y1={0}
            x2={((i + 1) * width) / 7} y2={height}
            stroke={dark ? '#ffffff' : '#000000'}
            strokeWidth={0.5} opacity={0.008}
          />
        ))}

        {/* Noise */}
        <rect width={width} height={height} opacity="0.012" filter="url(#ms-noise)" />
      </svg>

      {/* ── Content ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        padding: `${36 * s}px ${pad}px ${28 * s}px`,
      }}>

        {/* ── HEADER ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 16 * s,
        }}>
          <img src={LOGO_URL} alt="CegTec" style={{ height: 24 * s, opacity: 0.9, ...logoFilter(bg) }} />
          <div style={{
            fontFamily: FONTS.mono, fontSize: 11 * s, fontWeight: 600,
            color: labelDim, letterSpacing: 2.5 * s, textTransform: 'uppercase' as const,
            display: 'flex', alignItems: 'center', gap: 7 * s,
          }}>
            <span style={{
              width: 6 * s, height: 6 * s, borderRadius: '50%',
              background: danger, opacity: 0.6, display: 'inline-block',
            }} />
            CEGTEC INSIGHTS
          </div>
        </div>

        {/* ── BADGE ── */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 9 * s,
          marginBottom: 10 * s,
        }}>
          <div style={{
            width: 3.5 * s, height: 20 * s, borderRadius: 2 * s,
            background: `linear-gradient(180deg, ${danger}, ${accent})`,
          }} />
          <span style={{
            fontFamily: FONTS.mono, fontSize: 12 * s, fontWeight: 700,
            letterSpacing: 3 * s, textTransform: 'uppercase' as const,
            color: danger,
          }}>
            {data.topLabel}
          </span>
        </div>

        {/* ── HEADLINE ── */}
        <h1 style={{
          fontFamily: "'DM Sans', 'Plus Jakarta Sans', sans-serif",
          fontSize: 52 * s, fontWeight: 800,
          color: textCol, lineHeight: 1.02,
          letterSpacing: -2.2 * s,
          margin: 0, marginBottom: 6 * s,
          whiteSpace: 'pre-line' as const,
        }}>
          {headlineLines.map((line, i) => (
            <span key={i}>
              {i === headlineLines.length - 1
                ? <span style={{ color: danger }}>{line}</span>
                : line}
              {i < headlineLines.length - 1 && '\n'}
            </span>
          ))}
        </h1>

        <p style={{
          fontSize: 14.5 * s, color: labelCol,
          fontWeight: 500, fontStyle: 'italic',
          margin: 0, marginBottom: 16 * s, lineHeight: 1.35,
          maxWidth: 800 * s,
        }}>
          {data.subline}
        </p>

        {/* ── UTILIZATION DECLINE CHART ── */}
        <div style={{
          marginBottom: 14 * s,
          padding: `${14 * s}px ${16 * s}px ${12 * s}px`,
          background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
          borderRadius: 10 * s,
          border: `1px solid ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
        }}>
          <div style={{
            fontFamily: FONTS.mono, fontSize: 10 * s, fontWeight: 700,
            letterSpacing: 2.5 * s, textTransform: 'uppercase' as const,
            color: labelDim, marginBottom: 10 * s,
            display: 'flex', alignItems: 'center', gap: 8 * s,
          }}>
            <span style={{
              width: 14 * s, height: 1.5 * s,
              background: danger, opacity: 0.4, display: 'inline-block',
            }} />
            {data.utilizationTitle}
          </div>

          {/* Declining bars */}
          <div style={{ display: 'flex', gap: 8 * s, alignItems: 'flex-end', height: chartH }}>
            {chartPoints.map((pt, i) => {
              const barH = (pt.pct / maxPct) * chartH;
              const t = chartPoints.length > 1 ? i / (chartPoints.length - 1) : 0;
              // Gradient from blue to red
              const bR = Math.round(fr + (dr - fr) * t);
              const bG = Math.round(fg + (dg - fg) * t);
              const bB = Math.round(fb + (db - fb) * t);
              const barColor = `rgb(${bR},${bG},${bB})`;

              return (
                <div key={i} style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'flex-end', height: '100%',
                }}>
                  {/* Percentage on top */}
                  <div style={{
                    fontFamily: FONTS.display,
                    fontSize: 26 * s, fontWeight: 800,
                    color: barColor, lineHeight: 1,
                    letterSpacing: -1 * s, marginBottom: 6 * s,
                  }}>
                    {pt.pct}%
                  </div>
                  {/* Bar */}
                  <div style={{
                    width: '100%', height: barH,
                    borderRadius: `${6 * s}px ${6 * s}px ${3 * s}px ${3 * s}px`,
                    background: `linear-gradient(180deg, rgba(${bR},${bG},${bB},0.7), rgba(${bR},${bG},${bB},0.25))`,
                    border: `1px solid rgba(${bR},${bG},${bB},0.3)`,
                    position: 'relative',
                  }}>
                    {/* Shimmer line at top */}
                    <div style={{
                      position: 'absolute', top: 0, left: '10%', right: '10%',
                      height: 2 * s, borderRadius: 2,
                      background: barColor, opacity: 0.5,
                    }} />
                  </div>
                  {/* Year label */}
                  <div style={{
                    fontFamily: FONTS.mono, fontSize: 11 * s, fontWeight: 600,
                    color: labelCol, marginTop: 6 * s, letterSpacing: 0.5 * s,
                  }}>
                    {pt.year}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decline annotation + trend hint */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8 * s, marginTop: 8 * s,
          }}>
            <div style={{
              height: 1 * s, flex: 1,
              background: `linear-gradient(90deg, transparent, rgba(${dr},${dg},${db},0.3), transparent)`,
            }} />
            <span style={{
              fontFamily: FONTS.mono, fontSize: 10.5 * s, fontWeight: 700,
              color: danger, letterSpacing: 1 * s,
            }}>
              ▼ -43% IN 3 JAHREN
            </span>
            <span style={{
              fontFamily: FONTS.mono, fontSize: 9.5 * s, fontWeight: 600,
              color: labelCol, letterSpacing: 0.5 * s, opacity: 0.7,
            }}>
              TREND HÄLT AN →
            </span>
            <div style={{
              height: 1 * s, flex: 1,
              background: `linear-gradient(90deg, transparent, rgba(${dr},${dg},${db},0.3), transparent)`,
            }} />
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <div style={{ display: 'flex', gap: 8 * s, marginBottom: 12 * s }}>
          {data.stats.map((stat, i) => {
            const colors = [danger, accent, filled];
            const statColor = stat.color || colors[i % colors.length];
            const [sr, sg, sb] = hexToRgb(statColor);

            return (
              <div key={i} style={{
                flex: 1, minWidth: 0,
                padding: `${14 * s}px ${14 * s}px`,
                background: dark ? 'rgba(255,255,255,0.02)' : '#ffffff',
                borderRadius: 8 * s,
                border: `1px solid ${dark ? 'rgba(255,255,255,0.04)' : borderCol}`,
                borderTop: `3px solid rgba(${sr},${sg},${sb},0.5)`,
              }}>
                {stat.source && (
                  <div style={{
                    fontFamily: FONTS.mono, fontSize: 8.5 * s,
                    color: labelDim, letterSpacing: 1.5 * s,
                    textTransform: 'uppercase' as const, marginBottom: 3 * s,
                  }}>
                    {stat.source}
                  </div>
                )}
                <div style={{
                  fontFamily: FONTS.display,
                  fontSize: 34 * s, fontWeight: 800,
                  color: statColor, lineHeight: 1,
                  letterSpacing: -1 * s, marginBottom: 4 * s,
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: 12.5 * s, color: labelCol,
                  fontWeight: 500, lineHeight: 1.25,
                }}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── INSIGHT ROWS (2-column grid) ── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: `${6 * s}px ${10 * s}px`,
          marginBottom: 12 * s,
        }}>
          {data.insights.map((row, i) => {
            const dotColors = [danger, accent, labelCol, danger, filled, accent];
            const dotColor = dotColors[i % dotColors.length];
            const [cr, cg, cb] = hexToRgb(dotColor);

            return (
              <div key={i} style={{
                width: `calc(50% - ${5 * s}px)`,
                display: 'flex', alignItems: 'flex-start', gap: 10 * s,
                padding: `${9 * s}px 0`,
              }}>
                <div style={{
                  width: 32 * s, height: 32 * s, borderRadius: 8 * s,
                  background: `rgba(${cr},${cg},${cb},${dark ? 0.12 : 0.08})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18 * s, lineHeight: 1, flexShrink: 0,
                }}>
                  {row.icon}
                </div>
                <div style={{ minWidth: 0, paddingTop: 3 * s }}>
                  <span style={{
                    fontSize: 14 * s, color: textCol,
                    fontWeight: 600, lineHeight: 1.3,
                  }}>
                    {row.text}
                  </span>
                  {row.highlight && (
                    <span style={{
                      fontSize: 12.5 * s, color: labelCol,
                      fontWeight: 500, marginLeft: 4 * s,
                    }}>
                      — {row.highlight}
                  </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── BOTTOM LINE ── */}
        <div style={{
          padding: `${14 * s}px ${18 * s}px`,
          background: `rgba(${fr},${fg},${fb},${dark ? 0.06 : 0.03})`,
          borderRadius: 10 * s,
          border: `1px solid rgba(${fr},${fg},${fb},${dark ? 0.12 : 0.06})`,
          marginBottom: 8 * s,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{
            fontSize: 15.5 * s, fontWeight: 700,
            color: textCol, lineHeight: 1.3,
            flex: 1,
          }}>
            {data.bottomLine}
          </div>
          <div style={{
            fontFamily: FONTS.mono, fontSize: 11 * s,
            color: filled, letterSpacing: 2 * s,
            textTransform: 'uppercase' as const, fontWeight: 700,
            flexShrink: 0, marginLeft: 14 * s,
            padding: `${5 * s}px ${12 * s}px`,
            border: `1.5px solid rgba(${fr},${fg},${fb},0.3)`,
            borderRadius: 6 * s,
          }}>
            {data.ctaLine}
          </div>
        </div>

        {/* ── SOURCES — direkt am Footer ── */}
        <div style={{
          fontFamily: FONTS.mono, fontSize: 8.5 * s,
          color: labelDim, letterSpacing: 0.5 * s,
          textAlign: 'center' as const, opacity: 0.6,
        }}>
          {data.sourceText}
        </div>
      </div>
    </div>
  );
}
