import { LOGO_URL } from '../../utils/assets';
import {
  FONTS, COLORS, CEGTEC_LIGHT_DEFAULTS,
  isDark, adjustBrightness, logoFilter, hexToRgb,
} from '../../utils/cegtecTheme';

// ── Data Interface ──────────────────────────────────────────────

export interface ComparisonData {
  topLabel: string;
  headline: string;
  leftTitle: string;
  rightTitle: string;
  rows: { label: string; leftValue: string; rightValue: string }[];
  bottomLine: string;
  backgroundColor?: string;
  textColor?: string;
  labelColor?: string;
  filledColor?: string;
  borderColor?: string;
  warningColor?: string;
}

export const defaultComparisonData: ComparisonData = {
  topLabel: 'VORHER / NACHHER',
  headline: 'Was passiert, wenn\nDatenqualität stimmt?',
  leftTitle: 'Ohne CegTec',
  rightTitle: 'Mit CegTec',
  rows: [
    { label: 'Qualifizierte Leads / Monat', leftValue: '23', rightValue: '187' },
    { label: 'Response Rate', leftValue: '2,1%', rightValue: '14,8%' },
    { label: 'Pipeline-Wert', leftValue: '€12k', rightValue: '€142k' },
    { label: 'Cost per Lead', leftValue: '€340', rightValue: '€38' },
  ],
  bottomLine: 'cegtec.net — Datengetriebener B2B-Vertrieb',
  ...CEGTEC_LIGHT_DEFAULTS,
};

// ── Component ───────────────────────────────────────────────────

const REF_W = 1080;
const REF_H = 1080;

export function ComparisonGraphic({
  data,
  width,
  height,
}: {
  data: ComparisonData;
  width: number;
  height: number;
}) {
  const s = Math.min(width / REF_W, height / REF_H);

  const bg = data.backgroundColor || COLORS.bgLight;
  const dark = isDark(bg);
  const textFilled = data.filledColor || COLORS.filled;
  const textMuted = data.labelColor || COLORS.labelLight;
  const textDim = adjustBrightness(textMuted, -18);
  const titleCol = data.textColor || COLORS.titleLight;
  const borderCol = data.borderColor || COLORS.border;

  const [fr, fg, fb] = hexToRgb(textFilled);
  const leftColor = COLORS.danger;
  const rightColor = COLORS.success;
  const [lr, lg, lb] = hexToRgb(leftColor);
  const [rr, rg, rb] = hexToRgb(rightColor);

  const pad = 52 * s;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: FONTS.display,
        background: bg,
      }}
    >
      {/* ── SVG Atmosphere ── */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <defs>
          <filter id="cmp-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={120 * s} />
          </filter>
          <filter id="cmp-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="overlay" />
          </filter>
          <linearGradient id="cmp-accent-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={leftColor} stopOpacity="0" />
            <stop offset="30%" stopColor={leftColor} />
            <stop offset="50%" stopColor={textFilled} />
            <stop offset="70%" stopColor={rightColor} />
            <stop offset="100%" stopColor={rightColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width={width} height={height} fill={bg} />

        {/* Atmospheric orbs */}
        <ellipse cx={width * 0.15} cy={height * 0.5} rx={300 * s} ry={250 * s}
          fill={leftColor} opacity={dark ? 0.05 : 0.03} filter="url(#cmp-blur)" />
        <ellipse cx={width * 0.85} cy={height * 0.5} rx={300 * s} ry={250 * s}
          fill={rightColor} opacity={dark ? 0.05 : 0.03} filter="url(#cmp-blur)" />

        {/* Top accent stripe */}
        <rect y={0} width={width} height={4 * s} fill="url(#cmp-accent-line)" />

        {/* Subtle grid lines */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i}
            x1={0} y1={((i + 1) * height) / 9}
            x2={width} y2={((i + 1) * height) / 9}
            stroke={dark ? '#ffffff' : '#000000'}
            strokeWidth={0.5} opacity={0.015}
          />
        ))}

        {/* Noise */}
        <rect width={width} height={height} opacity="0.015" filter="url(#cmp-noise)" />
      </svg>

      {/* ── Content ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        padding: `${40 * s}px ${pad}px ${32 * s}px`,
      }}>

        {/* ── HEADER ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 20 * s,
        }}>
          <img src={LOGO_URL} alt="CegTec" style={{ height: 26 * s, opacity: 0.9, ...logoFilter(bg) }} />
          <div style={{
            fontFamily: FONTS.mono, fontSize: 12 * s, fontWeight: 600,
            color: textDim, letterSpacing: 2.5 * s, textTransform: 'uppercase' as const,
            display: 'flex', alignItems: 'center', gap: 8 * s,
          }}>
            <span style={{
              width: 6 * s, height: 6 * s, borderRadius: '50%',
              background: textFilled, opacity: 0.4, display: 'inline-block',
            }} />
            CEGTEC INSIGHTS
          </div>
        </div>

        {/* ── BADGE ── */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10 * s,
          marginBottom: 14 * s,
        }}>
          <div style={{
            width: 3.5 * s, height: 22 * s, borderRadius: 2 * s,
            background: textFilled,
          }} />
          <span style={{
            fontFamily: FONTS.mono, fontSize: 13 * s, fontWeight: 700,
            letterSpacing: 3 * s, textTransform: 'uppercase' as const,
            color: textFilled,
          }}>
            {data.topLabel}
          </span>
        </div>

        {/* ── HEADLINE ── */}
        <h1 style={{
          fontFamily: "'DM Sans', 'Plus Jakarta Sans', sans-serif",
          fontSize: 48 * s,
          fontWeight: 800,
          color: titleCol,
          lineHeight: 1.05,
          letterSpacing: -2 * s,
          margin: 0, marginBottom: 28 * s,
          whiteSpace: 'pre-line' as const,
        }}>
          {data.headline}
        </h1>

        {/* ── COMPARISON TABLE ── */}
        <div style={{
          flex: 1, minHeight: 0,
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Column Headers */}
          <div style={{
            display: 'flex', alignItems: 'center',
            marginBottom: 12 * s,
            gap: 0,
          }}>
            {/* Label column spacer */}
            <div style={{ flex: 1.2, minWidth: 0 }} />

            {/* Left Title */}
            <div style={{
              flex: 1, minWidth: 0, textAlign: 'center',
              fontFamily: FONTS.mono, fontSize: 13 * s, fontWeight: 700,
              letterSpacing: 2 * s, textTransform: 'uppercase' as const,
              color: leftColor,
            }}>
              {data.leftTitle}
            </div>

            {/* VS Divider */}
            <div style={{
              width: 44 * s, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 36 * s, height: 36 * s, borderRadius: '50%',
                background: `rgba(${fr},${fg},${fb},${dark ? 0.1 : 0.06})`,
                border: `2px solid rgba(${fr},${fg},${fb},0.2)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONTS.display, fontSize: 14 * s, fontWeight: 800,
                color: textFilled,
              }}>
                VS
              </div>
            </div>

            {/* Right Title */}
            <div style={{
              flex: 1, minWidth: 0, textAlign: 'center',
              fontFamily: FONTS.mono, fontSize: 13 * s, fontWeight: 700,
              letterSpacing: 2 * s, textTransform: 'uppercase' as const,
              color: rightColor,
            }}>
              {data.rightTitle}
            </div>
          </div>

          {/* Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 * s }}>
            {data.rows.map((row, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center',
                padding: `${14 * s}px ${18 * s}px`,
                background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
                borderRadius: 10 * s,
                border: `1px solid ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
              }}>
                {/* Label */}
                <div style={{
                  flex: 1.2, minWidth: 0,
                  fontSize: 14 * s, fontWeight: 600,
                  color: textMuted, lineHeight: 1.3,
                }}>
                  {row.label}
                </div>

                {/* Left Value */}
                <div style={{
                  flex: 1, minWidth: 0, textAlign: 'center',
                  padding: `${8 * s}px ${12 * s}px`,
                  background: `rgba(${lr},${lg},${lb},${dark ? 0.08 : 0.04})`,
                  borderRadius: 8 * s,
                  border: `1px solid rgba(${lr},${lg},${lb},0.12)`,
                }}>
                  <div style={{
                    fontFamily: FONTS.display,
                    fontSize: 28 * s, fontWeight: 800,
                    color: leftColor, lineHeight: 1,
                    letterSpacing: -0.5 * s,
                  }}>
                    {row.leftValue}
                  </div>
                </div>

                {/* VS spacer */}
                <div style={{ width: 44 * s, flexShrink: 0 }} />

                {/* Right Value */}
                <div style={{
                  flex: 1, minWidth: 0, textAlign: 'center',
                  padding: `${8 * s}px ${12 * s}px`,
                  background: `rgba(${rr},${rg},${rb},${dark ? 0.08 : 0.04})`,
                  borderRadius: 8 * s,
                  border: `1px solid rgba(${rr},${rg},${rb},0.12)`,
                }}>
                  <div style={{
                    fontFamily: FONTS.display,
                    fontSize: 28 * s, fontWeight: 800,
                    color: rightColor, lineHeight: 1,
                    letterSpacing: -0.5 * s,
                  }}>
                    {row.rightValue}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 0, minHeight: 8 * s }} />

        {/* ── CTA FOOTER ── */}
        <div style={{
          marginTop: 16 * s,
          padding: `${14 * s}px ${20 * s}px`,
          background: `rgba(${fr},${fg},${fb},${dark ? 0.06 : 0.03})`,
          borderRadius: 10 * s,
          border: `1px solid rgba(${fr},${fg},${fb},${dark ? 0.12 : 0.06})`,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
        }}>
          <div style={{
            fontSize: 15 * s, fontWeight: 700,
            color: titleCol, lineHeight: 1.3,
            fontFamily: FONTS.mono, letterSpacing: 1.5 * s,
          }}>
            {data.bottomLine}
          </div>
        </div>
      </div>
    </div>
  );
}
