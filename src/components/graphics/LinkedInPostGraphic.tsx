import { LOGO_URL } from '../../utils/assets';
import {
  FONTS, COLORS, CEGTEC_LIGHT_DEFAULTS,
  isDark, adjustBrightness, logoFilter, hexToRgb,
} from '../../utils/cegtecTheme';

// ── Data Interface ──────────────────────────────────────────────

export interface GapBar {
  value: string;
  label: string;
  pct: number;
  color?: string;
}

export interface LinkedInPostData {
  topLabel: string;
  headline: string;
  subline: string;
  gapTitle: string;
  gapBars: GapBar[];
  stats: { value: string; label: string; source?: string }[];
  bullets: { text: string }[];
  ctaQuestion: string;
  ctaLine: string;
  backgroundColor?: string;
  textColor?: string;
  labelColor?: string;
  filledColor?: string;
  emptyColor?: string;
  borderColor?: string;
  warningColor?: string;
}

export const defaultLinkedInPostData: LinkedInPostData = {
  topLabel: 'KI-READINESS CHECK',
  headline: 'Mangelnde Datenqualität\nist das größte Risiko\nfür KI-Projekte.',
  subline: 'Die meisten Entscheider übersehen, was das wirklich bedeutet.',
  gapTitle: 'READINESS GAP',
  gapBars: [
    { value: '87%', label: 'wollen KI einsetzen — nur 23% sind datenseitig bereit', pct: 87 },
    { value: '65%', label: 'der KI-Projekte scheitern an mangelnder Datenqualität', pct: 65, color: '#F59E0B' },
    { value: '12%', label: 'haben einen strukturierten Daten-Audit-Prozess', pct: 12, color: '#EF4444' },
  ],
  stats: [
    { value: '85%', label: 'der KI-Projekte liefern nicht den erwarteten ROI', source: 'GARTNER' },
    { value: '$3,1T', label: 'jährliche Kosten schlechter Daten in den USA', source: 'IBM RESEARCH' },
    { value: '+40%', label: 'Effizienzgewinn bei sauberer Datenbasis', source: 'MCKINSEY' },
  ],
  bullets: [
    { text: 'Daten-Audit statt Tool-Suche — Quellen prüfen, bevor du eine Lizenz kaufst' },
    { text: 'Infrastruktur skalierbar machen — Cloud-Ressourcen für KI-Last auslegen' },
    { text: 'KI-Literacy im Team — ohne Schulung bleibt jedes Tool eine teure Spielerei' },
  ],
  ctaQuestion: 'Wo steht eure Datenqualität auf einer Skala von 1–10? 📈',
  ctaLine: 'cegtec.net',
  ...CEGTEC_LIGHT_DEFAULTS,
};

// ── Component ───────────────────────────────────────────────────

export function LinkedInPostGraphic({
  data,
  width,
  height,
}: {
  data: LinkedInPostData;
  width: number;
  height: number;
}) {
  const s = Math.min(width / 1080, height / 1080);

  const bg = data.backgroundColor || COLORS.bgLight;
  const dark = isDark(bg);
  const textFilled = data.filledColor || COLORS.filled;
  const textMuted = data.labelColor || COLORS.labelLight;
  const textDim = adjustBrightness(textMuted, -18);
  const titleCol = data.textColor || COLORS.titleLight;
  const borderCol = data.borderColor || COLORS.border;

  const [fr, fg, fb] = hexToRgb(textFilled);

  const headlineLines = data.headline.split('\n');
  const lastLineIdx = headlineLines.length - 1;

  const barColors = data.gapBars.map((b) => b.color || textFilled);

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
          <filter id="lp-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={120 * s} />
          </filter>
          <filter id="lp-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="overlay" />
          </filter>
          <linearGradient id="lp-accent-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={textFilled} stopOpacity="0" />
            <stop offset="15%" stopColor={textFilled} />
            <stop offset="50%" stopColor={barColors[1] || textFilled} />
            <stop offset="85%" stopColor={barColors[2] || textFilled} />
            <stop offset="100%" stopColor={barColors[2] || textFilled} stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width={width} height={height} fill={bg} />

        {/* Atmospheric orbs */}
        <ellipse cx={width * 0.2} cy={height * 0.12} rx={350 * s} ry={250 * s}
          fill={textFilled} opacity={dark ? 0.06 : 0.04} filter="url(#lp-blur)" />
        <ellipse cx={width * 0.85} cy={height * 0.9} rx={300 * s} ry={200 * s}
          fill={barColors[2] || '#EF4444'} opacity={dark ? 0.05 : 0.03} filter="url(#lp-blur)" />

        {/* Top accent stripe */}
        <rect y={0} width={width} height={4 * s} fill="url(#lp-accent-line)" />

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
        <rect width={width} height={height} opacity="0.015" filter="url(#lp-noise)" />
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
          fontSize: 54 * s,
          fontWeight: 800,
          color: titleCol,
          lineHeight: 1.0,
          letterSpacing: -2.5 * s,
          margin: 0, marginBottom: 8 * s,
          whiteSpace: 'pre-line' as const,
        }}>
          {headlineLines.map((line, i) => (
            <span key={i}>
              {i === lastLineIdx ? (
                <span style={{ color: textFilled }}>{line}</span>
              ) : line}
              {i < lastLineIdx && '\n'}
            </span>
          ))}
        </h1>

        <p style={{
          fontSize: 17 * s, color: textMuted,
          fontWeight: 500, fontStyle: 'italic',
          margin: 0, marginBottom: 22 * s, lineHeight: 1.4,
        }}>
          {data.subline}
        </p>

        {/* ── GAP BARS — horizontal, full-width ── */}
        <div style={{
          marginBottom: 18 * s,
          padding: `${16 * s}px ${18 * s}px`,
          background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
          borderRadius: 10 * s,
          border: `1px solid ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
        }}>
          <div style={{
            fontFamily: FONTS.mono, fontSize: 11 * s, fontWeight: 700,
            letterSpacing: 3 * s, textTransform: 'uppercase' as const,
            color: textDim, marginBottom: 14 * s,
            display: 'flex', alignItems: 'center', gap: 8 * s,
          }}>
            <span style={{
              width: 14 * s, height: 1.5 * s,
              background: textFilled, opacity: 0.3, display: 'inline-block',
            }} />
            {data.gapTitle}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 * s }}>
            {data.gapBars.map((bar, i) => {
              const barColor = bar.color || textFilled;
              const [br, bg2, bb] = hexToRgb(barColor);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 * s }}>
                  {/* Big value */}
                  <div style={{
                    width: 68 * s, flexShrink: 0,
                    fontFamily: FONTS.display,
                    fontSize: 34 * s, fontWeight: 800,
                    color: barColor, lineHeight: 1,
                    letterSpacing: -1 * s, textAlign: 'right',
                  }}>
                    {bar.value}
                  </div>

                  {/* Bar + label */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Track */}
                    <div style={{
                      width: '100%', height: 22 * s,
                      background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)',
                      borderRadius: 4 * s,
                      position: 'relative', overflow: 'hidden',
                      marginBottom: 4 * s,
                    }}>
                      <div style={{
                        position: 'absolute', top: 0, left: 0, bottom: 0,
                        width: `${bar.pct}%`,
                        borderRadius: 4 * s,
                        background: `linear-gradient(90deg, rgba(${br},${bg2},${bb},${dark ? 0.5 : 0.3}), rgba(${br},${bg2},${bb},${dark ? 0.25 : 0.12}))`,
                        borderRight: `2px solid rgba(${br},${bg2},${bb},0.6)`,
                      }} />
                    </div>
                    {/* Label */}
                    <div style={{
                      fontSize: 13 * s, color: textMuted,
                      fontWeight: 500, lineHeight: 1.2,
                    }}>
                      {bar.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── STATS ROW — three cards side by side ── */}
        <div style={{ display: 'flex', gap: 10 * s, marginBottom: 16 * s }}>
          {data.stats.map((stat, i) => {
            const isLast = i === data.stats.length - 1;
            const statColor = isLast ? COLORS.success : (i === 0 ? COLORS.danger : textFilled);
            const [sr, sg, sb] = hexToRgb(statColor);

            return (
              <div key={i} style={{
                flex: 1, minWidth: 0,
                padding: `${12 * s}px ${14 * s}px`,
                background: dark ? 'rgba(255,255,255,0.02)' : '#ffffff',
                borderRadius: 8 * s,
                border: `1px solid ${dark ? 'rgba(255,255,255,0.04)' : borderCol}`,
                borderTop: `3px solid rgba(${sr},${sg},${sb},0.5)`,
              }}>
                {stat.source && (
                  <div style={{
                    fontFamily: FONTS.mono, fontSize: 10 * s,
                    color: textDim, letterSpacing: 1.5 * s,
                    textTransform: 'uppercase' as const, marginBottom: 4 * s,
                  }}>
                    {stat.source}
                  </div>
                )}
                <div style={{
                  fontFamily: FONTS.display,
                  fontSize: 36 * s, fontWeight: 800,
                  color: statColor, lineHeight: 1,
                  letterSpacing: -1 * s, marginBottom: 5 * s,
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: 13 * s, color: textMuted,
                  fontWeight: 500, lineHeight: 1.3,
                }}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── BULLETS — action steps ── */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 9 * s,
          marginBottom: 0,
        }}>
          {data.bullets.map((b, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12 * s,
            }}>
              <div style={{
                width: 24 * s, height: 24 * s,
                borderRadius: 6 * s,
                background: i === 0 ? textFilled : 'transparent',
                border: i === 0 ? 'none' : `1.5px solid ${dark ? 'rgba(255,255,255,0.08)' : borderCol}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONTS.mono,
                fontSize: 13 * s, fontWeight: 700,
                color: i === 0 ? '#ffffff' : textMuted,
                flexShrink: 0, marginTop: 1 * s,
              }}>
                {i + 1}
              </div>
              <span style={{
                fontSize: 15 * s,
                color: i === 0 ? titleCol : textMuted,
                fontWeight: i === 0 ? 600 : 500,
                lineHeight: 1.35, minWidth: 0,
              }}>
                {b.text}
              </span>
            </div>
          ))}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, minHeight: 8 * s }} />

        {/* ── CTA FOOTER ── */}
        <div style={{
          padding: `${14 * s}px ${20 * s}px`,
          background: `rgba(${fr},${fg},${fb},${dark ? 0.06 : 0.03})`,
          borderRadius: 10 * s,
          border: `1px solid rgba(${fr},${fg},${fb},${dark ? 0.12 : 0.06})`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{
            fontSize: 16 * s, fontWeight: 700,
            color: titleCol, lineHeight: 1.3,
          }}>
            {data.ctaQuestion}
          </div>
          <div style={{
            fontFamily: FONTS.mono, fontSize: 12 * s,
            color: textFilled, letterSpacing: 2 * s,
            textTransform: 'uppercase' as const, fontWeight: 700,
            flexShrink: 0, marginLeft: 16 * s,
            padding: `${6 * s}px ${14 * s}px`,
            border: `1.5px solid rgba(${fr},${fg},${fb},0.3)`,
            borderRadius: 6 * s,
          }}>
            {data.ctaLine}
          </div>
        </div>
      </div>
    </div>
  );
}
