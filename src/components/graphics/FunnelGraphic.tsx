import { LOGO_URL } from '../../utils/assets';
import {
  FONTS, COLORS, CEGTEC_LIGHT_DEFAULTS,
  isDark, adjustBrightness, logoFilter, hexToRgb,
} from '../../utils/cegtecTheme';

// ── Data Interface ──────────────────────────────────────────────

export interface FunnelData {
  topLabel: string;
  headline: string;
  stages: { label: string; value: string; pct: number }[];
  bottomLine: string;
  backgroundColor?: string;
  textColor?: string;
  labelColor?: string;
  filledColor?: string;
  borderColor?: string;
  warningColor?: string;
}

export const defaultFunnelData: FunnelData = {
  topLabel: 'DAS READINESS-GAP',
  headline: 'Alle nutzen KI.\nFast keiner ist sichtbar.',
  stages: [
    { label: 'B2B-K\u00e4ufer nutzen LLMs im Kaufprozess', value: '94%', pct: 94 },
    { label: 'Marketer nutzen AI f\u00fcr Content Creation', value: '55%', pct: 55 },
    { label: 'Websites haben Schema Markup', value: '31%', pct: 31 },
    { label: 'Websites sind f\u00fcr AI-Agents sichtbar', value: '5%', pct: 5 },
    { label: 'Websites haben llms.txt', value: '0,015%', pct: 1 },
  ],
  bottomLine: 'Quellen: 6sense 2025 \u00b7 HubSpot 2025 \u00b7 W3Techs \u00b7 Majestic Million 2025',
  ...CEGTEC_LIGHT_DEFAULTS,
};

// ── Component ───────────────────────────────────────────────────

const REF_W = 1080;
const REF_H = 1080;

export function FunnelGraphic({
  data,
  width,
  height,
}: {
  data: FunnelData;
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

  const [fr, fg, fb] = hexToRgb(textFilled);
  const successColor = COLORS.success;
  const [sr, sg, sb] = hexToRgb(successColor);

  const pad = 52 * s;
  const stages = data.stages;
  const stageCount = stages.length;

  // Funnel geometry
  const funnelTop = 340 * s;
  const funnelBottom = height - 120 * s;
  const funnelHeight = funnelBottom - funnelTop;
  const stageHeight = stageCount > 0 ? funnelHeight / stageCount : 0;
  const maxWidth = width - pad * 2 - 120 * s;
  const minWidth = maxWidth * 0.25;

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
          <filter id="fn-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={120 * s} />
          </filter>
          <filter id="fn-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="overlay" />
          </filter>
          <linearGradient id="fn-accent-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={textFilled} stopOpacity="0" />
            <stop offset="15%" stopColor={textFilled} />
            <stop offset="85%" stopColor={successColor} />
            <stop offset="100%" stopColor={successColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width={width} height={height} fill={bg} />

        {/* Atmospheric orbs */}
        <ellipse cx={width * 0.5} cy={height * 0.15} rx={400 * s} ry={200 * s}
          fill={textFilled} opacity={dark ? 0.06 : 0.04} filter="url(#fn-blur)" />
        <ellipse cx={width * 0.5} cy={height * 0.9} rx={250 * s} ry={150 * s}
          fill={successColor} opacity={dark ? 0.05 : 0.03} filter="url(#fn-blur)" />

        {/* Top accent stripe */}
        <rect y={0} width={width} height={4 * s} fill="url(#fn-accent-line)" />

        {/* Subtle grid lines */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i}
            x1={0} y1={((i + 1) * height) / 9}
            x2={width} y2={((i + 1) * height) / 9}
            stroke={dark ? '#ffffff' : '#000000'}
            strokeWidth={0.5} opacity={0.015}
          />
        ))}

        {/* Funnel trapezoids */}
        {stages.map((stage, i) => {
          const t = stageCount > 1 ? i / (stageCount - 1) : 0;
          const tNext = stageCount > 1 ? (i + 1) / (stageCount - 1) : 1;
          const topW = maxWidth - t * (maxWidth - minWidth);
          const bottomW = i === stageCount - 1 ? topW * 0.7 : maxWidth - tNext * (maxWidth - minWidth);
          const y = funnelTop + i * stageHeight;
          const cx = width / 2;
          const gap = 2 * s;

          // Interpolate color from blue (top) to green (bottom)
          const colorT = stageCount > 1 ? i / (stageCount - 1) : 0;
          const r = Math.round(fr + (sr - fr) * colorT);
          const g = Math.round(fg + (sg - fg) * colorT);
          const b = Math.round(fb + (sb - fb) * colorT);
          const opacity = dark ? 0.25 - colorT * 0.08 : 0.15 - colorT * 0.04;

          return (
            <polygon
              key={i}
              points={`
                ${cx - topW / 2},${y + gap}
                ${cx + topW / 2},${y + gap}
                ${cx + bottomW / 2},${y + stageHeight - gap}
                ${cx - bottomW / 2},${y + stageHeight - gap}
              `}
              fill={`rgba(${r},${g},${b},${opacity})`}
              stroke={`rgba(${r},${g},${b},0.3)`}
              strokeWidth={1.5 * s}
            />
          );
        })}

        {/* Noise */}
        <rect width={width} height={height} opacity="0.015" filter="url(#fn-noise)" />
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
          margin: 0, marginBottom: 0,
          whiteSpace: 'pre-line' as const,
        }}>
          {data.headline}
        </h1>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* ── FUNNEL LABELS (overlaid on SVG trapezoids) ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
        }}>
          {stages.map((stage, i) => {
            const y = funnelTop + i * stageHeight;
            const t = stageCount > 1 ? i / (stageCount - 1) : 0;
            const colorT = t;
            const r = Math.round(fr + (sr - fr) * colorT);
            const g = Math.round(fg + (sg - fg) * colorT);
            const b = Math.round(fb + (sb - fb) * colorT);

            return (
              <div key={i} style={{
                position: 'absolute',
                top: y,
                left: 0, width: '100%',
                height: stageHeight,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 20 * s,
              }}>
                {/* Label + Value centered */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 16 * s,
                }}>
                  <span style={{
                    fontFamily: FONTS.display,
                    fontSize: 32 * s, fontWeight: 800,
                    color: `rgb(${r},${g},${b})`,
                    lineHeight: 1, letterSpacing: -1 * s,
                  }}>
                    {stage.value}
                  </span>
                  <span style={{
                    fontSize: 15 * s, fontWeight: 600,
                    color: titleCol, lineHeight: 1.2,
                  }}>
                    {stage.label}
                  </span>
                </div>

                {/* Percentage badge on the right */}
                <div style={{
                  position: 'absolute',
                  right: pad + 10 * s,
                  fontFamily: FONTS.mono, fontSize: 12 * s, fontWeight: 700,
                  color: `rgb(${r},${g},${b})`,
                  background: `rgba(${r},${g},${b},${dark ? 0.1 : 0.06})`,
                  padding: `${3 * s}px ${10 * s}px`,
                  borderRadius: 6 * s,
                  letterSpacing: 1 * s,
                }}>
                  {stage.pct}%
                </div>
              </div>
            );
          })}
        </div>

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
