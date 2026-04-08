import { LOGO_URL } from '../../utils/assets';
import {
  FONTS, COLORS, CEGTEC_LIGHT_DEFAULTS,
  isDark, logoFilter, hexToRgb,
} from '../../utils/cegtecTheme';

// ── Data Interface ──────────────────────────────────────────────

export interface LinkedInBannerData {
  tagline: string;
  headline: string;
  subtitle: string;
  url: string;
  backgroundColor?: string;
  textColor?: string;
  labelColor?: string;
  filledColor?: string;
  borderColor?: string;
  warningColor?: string;
}

export const defaultLinkedInBannerData: LinkedInBannerData = {
  tagline: 'AI-POWERED GTM ARCHITECTURE',
  headline: 'Revenue Systeme\nfür Premium B2B',
  subtitle: '',
  url: 'cegtec.net',
  ...CEGTEC_LIGHT_DEFAULTS,
};

// ── Component ───────────────────────────────────────────────────

export function LinkedInBannerGraphic({
  data, width, height,
}: {
  data: LinkedInBannerData; width: number; height: number;
}) {
  const s = Math.min(width / 1584, height / 396);

  const bg = data.backgroundColor || COLORS.bgLight;
  const dark = isDark(bg);
  const textFilled = data.filledColor || COLORS.filled;
  const textMuted = data.labelColor || COLORS.labelLight;
  const titleCol = data.textColor || COLORS.titleLight;
  const borderCol = data.borderColor || COLORS.border;

  const [fr, fg, fb] = hexToRgb(textFilled);
  const dp = COLORS.filledDark;
  const pk = COLORS.accent2;
  const [pr, pg, pb] = hexToRgb(pk);

  const headlineLines = data.headline.split('\n');
  const safeLeft = 200 * s;

  return (
    <div style={{
      width, height, position: 'relative', overflow: 'hidden',
      fontFamily: FONTS.display, background: bg,
    }}>
      {/* ── SVG: refined atmosphere ── */}
      <svg viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <filter id="lb-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={120 * s} />
          </filter>
          <filter id="lb-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>

          {/* Diagonal gradient — flows from bottom-left to top-right across full banner */}
          <linearGradient id="lb-flow" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor={dp} stopOpacity={dark ? '0.14' : '0.09'} />
            <stop offset="25%" stopColor={textFilled} stopOpacity={dark ? '0.10' : '0.06'} />
            <stop offset="50%" stopColor={pk} stopOpacity={dark ? '0.06' : '0.035'} />
            <stop offset="75%" stopColor={textFilled} stopOpacity={dark ? '0.03' : '0.015'} />
            <stop offset="100%" stopColor={bg} stopOpacity="0" />
          </linearGradient>

          {/* Top accent — thin, elegant */}
          <linearGradient id="lb-topline" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={dp} stopOpacity="0.7" />
            <stop offset="40%" stopColor={textFilled} stopOpacity="0.5" />
            <stop offset="75%" stopColor={pk} stopOpacity="0.3" />
            <stop offset="100%" stopColor={pk} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Base */}
        <rect width={width} height={height} fill={bg} />

        {/* Main diagonal gradient — deep blue (bottom-left) → blue → pink → fade (top-right) */}
        <rect width={width} height={height} fill="url(#lb-flow)" />

        {/* Soft orb to reinforce the blue on left */}
        <ellipse cx={width * 0.15} cy={height * 0.7} rx={350 * s} ry={250 * s}
          fill={dp} opacity={dark ? 0.06 : 0.04} filter="url(#lb-blur)" />

        {/* Pink orb center — blends into the flow */}
        <ellipse cx={width * 0.5} cy={height * 0.2} rx={300 * s} ry={180 * s}
          fill={pk} opacity={dark ? 0.025 : 0.015} filter="url(#lb-blur)" />

        {/* Top accent line */}
        <rect y={0} width={width} height={3 * s} fill="url(#lb-topline)" />

        {/* Noise — texture */}
        <rect width={width} height={height} opacity="0.013" filter="url(#lb-noise)" />
      </svg>

      {/* ── Content overlay ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center',
        justifyContent: 'flex-end',
        padding: `${20 * s}px ${60 * s}px`,
      }}>

        {/* ── Text content — right-aligned, vertically centered ── */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'flex-end',
          gap: 14 * s, textAlign: 'right' as const,
          height: '100%',
        }}>

          {/* Logo + Tagline */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16 * s,
          }}>
            <span style={{
              fontFamily: FONTS.mono, fontSize: 11 * s, fontWeight: 600,
              letterSpacing: 3.5 * s, textTransform: 'uppercase' as const,
              color: textMuted,
            }}>
              {data.tagline}
            </span>
            <div style={{
              width: 1.5 * s, height: 20 * s,
              background: borderCol, opacity: 0.3,
            }} />
            <img src={LOGO_URL} alt="CegTec" style={{
              height: 38 * s, opacity: 0.9, ...logoFilter(bg),
            }} />
          </div>

          {/* Headline — big, confident */}
          <h1 style={{
            fontSize: 64 * s, fontWeight: 800, color: titleCol,
            lineHeight: 1.02, letterSpacing: -2.5 * s,
            margin: 0, whiteSpace: 'pre-line' as const,
          }}>
            {headlineLines.map((line, i) => (
              <span key={i}>
                {i === headlineLines.length - 1 ? (
                  <span style={{
                    backgroundImage: `linear-gradient(105deg, ${dp} 0%, ${textFilled} 28%, #8DB4FF 48%, ${textFilled} 68%, ${dp} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}>{line}</span>
                ) : line}
                {i < headlineLines.length - 1 && '\n'}
              </span>
            ))}
          </h1>


          {/* Subtitle — only if set */}
          {data.subtitle && (
            <p style={{
              fontSize: 15 * s, fontWeight: 500, color: textMuted,
              lineHeight: 1.45, margin: 0, maxWidth: 560 * s,
              letterSpacing: -0.2 * s,
            }}>
              {data.subtitle}
            </p>
          )}

          {/* URL — integrated with a subtle line */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12 * s,
          }}>
            <div style={{
              width: 32 * s, height: 1.5 * s,
              background: `linear-gradient(90deg, transparent, ${textFilled})`,
              opacity: 0.2,
            }} />
            <span style={{
              fontFamily: FONTS.mono, fontSize: 13 * s, fontWeight: 700,
              color: textMuted, letterSpacing: 2 * s,
            }}>
              {data.url}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
