import { LOGO_URL } from '../../utils/assets';
import {
  FONTS, COLORS, CEGTEC_LIGHT_DEFAULTS,
  isDark, adjustBrightness, cardStyle, monoLabel, scanlineProps, noiseFilterDef, logoFilter,
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
  topLabel: 'UNPOPULAR OPINION',
  headline: 'Deine First-Party-Daten\nsind eine Belastung,\nkein Asset.',
  subline: 'Alle sammeln Daten. Die wenigsten machen sie profitabel.',
  gapTitle: 'PERCEPTION GAP',
  gapBars: [
    { value: '90%', label: 'sagen, CRM-Daten sind Grundlage ihrer Arbeit', pct: 90 },
    { value: '76%', label: 'sagen, weniger als die H\u00e4lfte ist korrekt', pct: 76, color: '#F59E0B' },
    { value: '32%', label: 'sehen \u00fcberhaupt ein Datenqualit\u00e4tsproblem', pct: 32, color: '#EF4444' },
  ],
  stats: [
    { value: '$3,1T', label: 'j\u00e4hrliche Kosten schlechter Daten in den USA', source: 'IBM RESEARCH' },
    { value: '70,3%', label: 'der B2B-Kontakte veralten pro Jahr', source: 'LANDBASE' },
    { value: '+40%', label: 'Umsatz durch personalisierte Kampagnen', source: 'MCKINSEY' },
  ],
  bullets: [
    { text: '37% der Mitarbeiter geben regelm\u00e4\u00dfig erfundene Daten ins CRM ein' },
    { text: '13 Stunden pro Woche verschwenden Mitarbeiter mit CRM-Suche' },
    { text: '45% der CRM-Daten sind nicht bereit f\u00fcr KI-Einsatz' },
  ],
  ctaQuestion: 'Wertvolles Fundament oder teures digitales Archiv?',
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
  const borderCol = data.borderColor || COLORS.border;
  const textFilled = data.filledColor || COLORS.filled;
  const textMuted = data.labelColor || COLORS.labelLight;
  const textDim = adjustBrightness(textMuted, -18);
  const titleCol = data.textColor || COLORS.titleLight;
  const warning = data.warningColor || COLORS.filledDark;

  const padX = 48 * s;
  const padTop = 40 * s;

  const headlineLines = data.headline.split('\n');
  const lastLineIdx = headlineLines.length - 1;

  const noise = noiseFilterDef('lp');
  const sl = scanlineProps({ height, s, dark });

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: FONTS.mono,
        background: bg,
      }}
    >
      {/* ── Scanline + Noise ── */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <defs>
          <filter id={noise.id}>
            <feTurbulence type="fractalNoise" baseFrequency={noise.baseFrequency} numOctaves={noise.numOctaves} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="overlay" />
          </filter>
        </defs>
        <rect width={width} height={height} opacity="0.02" filter={`url(#${noise.id})`} />
        {Array.from({ length: sl.count }).map((_, i) => (
          <rect key={i} x={0} y={i * sl.gap} width={width} height={sl.lineHeight} fill={sl.fill} opacity={sl.opacity} />
        ))}
      </svg>

      {/* ── Content ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: `${padTop}px ${padX}px ${32 * s}px`,
        }}
      >
        {/* ── HEADER ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 * s }}>
          <img src={LOGO_URL} alt="CegTec" style={{ height: 24 * s, opacity: 0.85, ...logoFilter(bg) }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 * s }}>
            <span style={{ ...monoLabel(s, textDim), fontSize: 10 * s, letterSpacing: 2 * s }}>
              CEGTEC INSIGHTS
            </span>
            <span style={{
              width: 6 * s, height: 6 * s, borderRadius: '50%',
              background: warning, opacity: 0.5, display: 'inline-block',
            }} />
          </div>
        </div>

        {/* Badge */}
        <div
          style={{
            display: 'inline-block',
            padding: `${4 * s}px ${12 * s}px`,
            border: `2px solid ${textFilled}`,
            borderRadius: 4 * s,
            ...monoLabel(s, textFilled),
            fontSize: 10 * s,
            fontWeight: 700,
            letterSpacing: 2.5 * s,
            marginBottom: 14 * s,
            alignSelf: 'flex-start',
          }}
        >
          {data.topLabel}
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: FONTS.display,
            fontSize: 42 * s,
            fontWeight: 800,
            color: titleCol,
            lineHeight: 1.06,
            letterSpacing: -1.5 * s,
            margin: 0,
            marginBottom: 6 * s,
            whiteSpace: 'pre-line',
          }}
        >
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
          fontSize: 13 * s, color: textMuted, fontFamily: FONTS.display,
          fontWeight: 500, fontStyle: 'italic', margin: 0, marginBottom: 16 * s,
        }}>
          {data.subline}
        </p>

        {/* Separator */}
        <div style={{ height: 1.5 * s, background: borderCol, marginBottom: 16 * s }} />

        {/* ── PERCEPTION GAP — Hero Section ── */}
        <div style={{ ...cardStyle(s, dark, borderCol), padding: `${14 * s}px ${16 * s}px`, marginBottom: 14 * s }}>
          <div style={{ ...monoLabel(s, textDim), fontSize: 9 * s, marginBottom: 12 * s }}>
            {data.gapTitle}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 * s }}>
            {data.gapBars.map((bar, i) => {
              const barColor = bar.color || textFilled;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 * s }}>
                  {/* Value */}
                  <div style={{
                    width: 56 * s,
                    fontFamily: FONTS.display,
                    fontSize: 22 * s,
                    fontWeight: 800,
                    color: barColor,
                    lineHeight: 1,
                    textAlign: 'right',
                    flexShrink: 0,
                  }}>
                    {bar.value}
                  </div>

                  {/* Bar track */}
                  <div style={{
                    flex: 1, height: 24 * s,
                    background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                    borderRadius: 4 * s,
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', top: 0, left: 0, bottom: 0,
                      width: `${bar.pct}%`,
                      borderRadius: 4 * s,
                      background: barColor,
                      opacity: i === 0 ? 0.2 : (i === 1 ? 0.35 : 0.5),
                    }} />
                    <div style={{
                      position: 'relative', zIndex: 1,
                      padding: `0 ${8 * s}px`,
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 9.5 * s,
                      color: i === 0 ? textMuted : (dark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.5)'),
                      fontFamily: FONTS.display,
                      fontWeight: 500,
                    }}>
                      {bar.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{ display: 'flex', gap: 10 * s, marginBottom: 14 * s }}>
          {data.stats.map((stat, i) => {
            const isLast = i === data.stats.length - 1;
            const statColor = isLast ? COLORS.success : (i === 0 ? COLORS.danger : textFilled);

            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  minWidth: 0,
                  ...cardStyle(s, dark, borderCol),
                  padding: `${12 * s}px ${12 * s}px ${10 * s}px`,
                  position: 'relative',
                }}
              >
                <div style={{ ...monoLabel(s, textDim), fontSize: 7.5 * s, marginBottom: 6 * s, letterSpacing: 1.5 * s }}>
                  {stat.source || `STAT 0${i + 1}`}
                </div>
                <div style={{
                  fontFamily: FONTS.display,
                  fontSize: 28 * s,
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: -1 * s,
                  color: statColor,
                  marginBottom: 5 * s,
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: 9 * s, color: textMuted, fontWeight: 500,
                  lineHeight: 1.3, fontFamily: FONTS.display,
                }}>
                  {stat.label}
                </div>
                <div style={{
                  position: 'absolute', bottom: 0, left: 12 * s, right: 12 * s,
                  height: 2 * s, borderRadius: 1,
                  background: statColor, opacity: 0.2,
                }} />
              </div>
            );
          })}
        </div>

        {/* ── BULLETS ── */}
        <div style={{ ...cardStyle(s, dark, borderCol), padding: `${12 * s}px ${14 * s}px`, marginBottom: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 * s }}>
            {data.bullets.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 * s }}>
                <div
                  style={{
                    width: 20 * s, height: 20 * s, borderRadius: '50%',
                    background: i === 0 ? textFilled : 'transparent',
                    border: i === 0 ? 'none' : `1.5px solid ${borderCol}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9 * s, fontWeight: 700,
                    color: i === 0 ? '#fff' : textMuted,
                    flexShrink: 0, marginTop: 1 * s,
                  }}
                >
                  {i + 1}
                </div>
                <span style={{
                  fontFamily: FONTS.display, fontSize: 11.5 * s,
                  color: i === 0 ? titleCol : textMuted,
                  fontWeight: i === 0 ? 600 : 500, lineHeight: 1.35, minWidth: 0,
                }}>
                  {b.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, minHeight: 6 * s }} />

        {/* ── CTA ── */}
        <div
          style={{
            ...cardStyle(s, dark, borderCol),
            background: dark ? 'rgba(37,99,235,0.06)' : 'rgba(37,99,235,0.04)',
            padding: `${12 * s}px ${16 * s}px`,
            textAlign: 'center',
          }}
        >
          <div style={{
            fontFamily: FONTS.display, fontSize: 13 * s, fontWeight: 700,
            color: titleCol, lineHeight: 1.3, marginBottom: 4 * s,
          }}>
            {data.ctaQuestion}
          </div>
          <div style={{ ...monoLabel(s, textDim), fontSize: 8.5 * s }}>
            {data.ctaLine}
          </div>
        </div>
      </div>
    </div>
  );
}
