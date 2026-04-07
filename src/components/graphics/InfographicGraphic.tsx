import { LOGO_URL } from '../../utils/assets';
import { logoFilter, isDark, FONTS } from '../../utils/cegtecTheme';

export interface InfographicData {
  companyName: string;
  industry: string;
  headline: string;
  subline: string;
  metrics: { value: string; label: string; icon: string; tag?: string }[];
  funnelSteps: { label: string; value: string; pct: number }[];
  quote: string;
  ctaText: string;
  backgroundColor?: string;
  accentColor: string;
  accentColor2?: string;
  textColor?: string;
  labelColor?: string;
  funnelTitle?: string;
  funnelSubtitle?: string;
  cardColor?: string;
  cardBorderColor?: string;
  kpiTagColor?: string;
}

export const defaultInfographicData: InfographicData = {
  companyName: 'Jomavis Solar',
  industry: 'Erneuerbare Energien',
  headline: 'Wie Jomavis Solar 3x mehr Leads generiert',
  subline: 'CegTec AI Sales Automation — Ergebnisse nach 90 Tagen',
  metrics: [
    { value: '312%', label: 'Mehr qualifizierte Leads', icon: '\u2191', tag: 'KPI 01' },
    { value: '14 Tage', label: 'Time-to-First-Meeting', icon: '\u23F1', tag: 'KPI 02' },
    { value: '67%', label: 'Weniger manueller Aufwand', icon: '\u26A1', tag: 'KPI 03' },
  ],
  funnelSteps: [
    { label: 'Kontaktiert', value: '1.976', pct: 100 },
    { label: 'Geöffnet', value: '1.284', pct: 65 },
    { label: 'Replies', value: '118', pct: 9.4 },
    { label: 'Meetings', value: '42', pct: 3.4 },
    { label: 'Deals', value: '6', pct: 0.5 },
  ],
  quote: '\u201eCegTec hat unseren Vertrieb komplett transformiert.\u201c',
  ctaText: 'cegtec.net/case-studies',
  accentColor: '#3B4BF9',
  accentColor2: '#E93BCD',
  backgroundColor: '#FAFAFA',
  textColor: '#0A0A0A',
  labelColor: '#71717A',
  cardColor: '#FFFFFF',
  cardBorderColor: '#E5E7EB',
  kpiTagColor: '#9CA3AF',
};

const DISPLAY = FONTS.display;
const MONO = FONTS.mono;

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

export function InfographicGraphic({
  data,
  width,
  height,
}: {
  data: InfographicData;
  width: number;
  height: number;
}) {
  const s = Math.min(width / 1200, height / 630);
  const bg = data.backgroundColor || '#FAFAFA';
  const dark = isDark(bg);
  const accent = data.accentColor || '#3B4BF9';
  const accent2 = data.accentColor2 || '#E93BCD';
  const [ar, ag, ab] = hexToRgb(accent);
  const [a2r, a2g, a2b] = hexToRgb(accent2);
  const textCol = data.textColor || (dark ? '#f0f0f5' : '#0A0A0A');
  const labelCol = data.labelColor || (dark ? '#9090a5' : '#71717A');
  const kpiTagCol = data.kpiTagColor || (dark ? '#7a7a90' : '#9CA3AF');
  const funnelTitle = data.funnelTitle || 'Sales Funnel';
  const funnelSub = data.funnelSubtitle || '90-DAY WINDOW';

  // Glassmorphism card styles
  const glassCard = dark
    ? `rgba(255,255,255,0.04)`
    : `rgba(255,255,255,0.65)`;
  const glassBorder = dark
    ? `rgba(255,255,255,0.08)`
    : `rgba(255,255,255,0.9)`;
  const glassShadow = dark
    ? `0 8px 32px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.05) inset`
    : `0 8px 32px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,1) inset`;
  const glassBlur = 16 * s;

  // Funnel
  const stepCount = data.funnelSteps.length;
  const maxPct = Math.max(...data.funnelSteps.map((f) => f.pct), 1);

  // Subtle background tints
  const bgTint1 = dark ? `rgba(${ar},${ag},${ab},0.08)` : `rgba(${ar},${ag},${ab},0.05)`;
  const bgTint2 = dark ? `rgba(${a2r},${a2g},${a2b},0.06)` : `rgba(${a2r},${a2g},${a2b},0.04)`;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: DISPLAY,
        background: bg,
      }}
    >
      {/* === SVG Background === */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <filter id="ig-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={160 * s} />
          </filter>
          <filter id="ig-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="overlay" />
          </filter>
          <linearGradient id="ig-topAccent" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={accent} stopOpacity="0" />
            <stop offset="25%" stopColor={accent} stopOpacity="1" />
            <stop offset="75%" stopColor={accent2} stopOpacity="0.8" />
            <stop offset="100%" stopColor={accent2} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ig-funnelGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={accent} />
            <stop offset="100%" stopColor={accent2} />
          </linearGradient>
          <radialGradient id="ig-glow1" cx="0.2" cy="0.3" r="0.5">
            <stop offset="0%" stopColor={accent} stopOpacity={dark ? '0.12' : '0.08'} />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ig-glow2" cx="0.85" cy="0.75" r="0.45">
            <stop offset="0%" stopColor={accent2} stopOpacity={dark ? '0.08' : '0.06'} />
            <stop offset="100%" stopColor={accent2} stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width={width} height={height} fill={bg} />

        {/* Large gradient orbs — more diffuse than before */}
        <rect width={width} height={height} fill="url(#ig-glow1)" />
        <rect width={width} height={height} fill="url(#ig-glow2)" />

        {/* Dot grid pattern — modern, subtle */}
        {Array.from({ length: 20 }).map((_, row) =>
          Array.from({ length: 30 }).map((_, col) => (
            <circle
              key={`d-${row}-${col}`}
              cx={width * 0.02 + col * (width / 30)}
              cy={height * 0.02 + row * (height / 20)}
              r={0.8 * s}
              fill={dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
            />
          ))
        )}

        {/* Top accent line — thicker, bolder */}
        <rect y={0} width={width} height={3 * s} fill="url(#ig-topAccent)" />

        {/* Noise grain overlay */}
        <rect width={width} height={height} opacity={dark ? '0.03' : '0.025'} filter="url(#ig-noise)" />
      </svg>

      {/* === Content Layer === */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: `${28 * s}px ${44 * s}px ${20 * s}px`,
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 24 * s,
          }}
        >
          <div>
            {/* Industry + Company pill row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8 * s,
                marginBottom: 10 * s,
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 9 * s,
                  fontWeight: 600,
                  color: dark ? accent : '#fff',
                  letterSpacing: 1.5 * s,
                  textTransform: 'uppercase',
                  background: dark ? `rgba(${ar},${ag},${ab},0.15)` : accent,
                  padding: `${2.5 * s}px ${10 * s}px`,
                  borderRadius: 100,
                }}
              >
                {data.industry}
              </span>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 9 * s,
                  fontWeight: 500,
                  color: labelCol,
                  letterSpacing: 1 * s,
                }}
              >
                {data.companyName}
              </span>
            </div>
            {/* Headline — Plus Jakarta Sans, heavy */}
            <h1
              style={{
                fontSize: 30 * s,
                fontWeight: 800,
                color: textCol,
                lineHeight: 1.1,
                letterSpacing: -1 * s,
                margin: 0,
                maxWidth: 580 * s,
              }}
            >
              {data.headline}
            </h1>
            <p
              style={{
                fontSize: 11.5 * s,
                color: labelCol,
                marginTop: 6 * s,
                fontWeight: 500,
                letterSpacing: 0.1 * s,
              }}
            >
              {data.subline}
            </p>
          </div>
          <img
            src={LOGO_URL}
            alt="CegTec"
            style={{ height: 16 * s, marginTop: 4 * s, opacity: 0.7, ...logoFilter(bg) }}
          />
        </div>

        {/* ── KPI Cards — Glassmorphism ── */}
        <div
          style={{
            display: 'flex',
            gap: 14 * s,
            marginBottom: 22 * s,
          }}
        >
          {data.metrics.map((m, i) => {
            const accentColors = [accent, accent2, accent];
            const cardAccent = accentColors[i % accentColors.length];
            const [cr, cg, cb] = hexToRgb(cardAccent);
            const glowBg = dark
              ? `rgba(${cr},${cg},${cb},0.06)`
              : `rgba(${cr},${cg},${cb},0.04)`;

            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: glassCard,
                  backdropFilter: `blur(${glassBlur}px)`,
                  WebkitBackdropFilter: `blur(${glassBlur}px)`,
                  border: `1px solid ${glassBorder}`,
                  borderRadius: 14 * s,
                  padding: `${18 * s}px ${18 * s}px ${16 * s}px`,
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: glassShadow,
                }}
              >
                {/* Colored glow behind card */}
                <div
                  style={{
                    position: 'absolute',
                    top: -20 * s,
                    right: -20 * s,
                    width: 100 * s,
                    height: 100 * s,
                    borderRadius: '50%',
                    background: glowBg,
                    filter: `blur(${30 * s}px)`,
                    pointerEvents: 'none',
                  }}
                />

                {/* Top accent bar */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 16 * s,
                    right: 16 * s,
                    height: 2 * s,
                    borderRadius: 2,
                    background: `linear-gradient(90deg, ${cardAccent}, transparent)`,
                    opacity: 0.7,
                  }}
                />

                {/* Tag + Icon row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10 * s,
                  }}
                >
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 8.5 * s,
                      fontWeight: 600,
                      color: kpiTagCol,
                      letterSpacing: 1.5 * s,
                      textTransform: 'uppercase',
                    }}
                  >
                    {m.tag || `KPI 0${i + 1}`}
                  </span>
                  <span
                    style={{
                      fontSize: 16 * s,
                      width: 30 * s,
                      height: 30 * s,
                      borderRadius: 8 * s,
                      background: dark
                        ? `rgba(${cr},${cg},${cb},0.1)`
                        : `rgba(${cr},${cg},${cb},0.08)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: cardAccent,
                      flexShrink: 0,
                    }}
                  >
                    {m.icon}
                  </span>
                </div>

                {/* Value — large, with accent color */}
                <div
                  style={{
                    fontSize: 34 * s,
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: -1.5 * s,
                    color: cardAccent,
                    marginBottom: 6 * s,
                  }}
                >
                  {m.value}
                </div>

                {/* Label */}
                <div
                  style={{
                    fontSize: 10.5 * s,
                    color: labelCol,
                    fontWeight: 500,
                    lineHeight: 1.3,
                  }}
                >
                  {m.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Funnel Section — Glass Card ── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: glassCard,
            backdropFilter: `blur(${glassBlur}px)`,
            WebkitBackdropFilter: `blur(${glassBlur}px)`,
            border: `1px solid ${glassBorder}`,
            borderRadius: 16 * s,
            padding: `${16 * s}px ${22 * s}px ${14 * s}px`,
            minHeight: 0,
            boxShadow: glassShadow,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle gradient tint inside funnel card */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60%',
              background: `linear-gradient(to top, ${bgTint1}, transparent)`,
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12 * s,
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 * s }}>
              <span
                style={{
                  fontFamily: DISPLAY,
                  fontSize: 13 * s,
                  fontWeight: 700,
                  color: textCol,
                  letterSpacing: -0.3 * s,
                }}
              >
                {funnelTitle}
              </span>
              <span
                style={{
                  width: 4 * s,
                  height: 4 * s,
                  borderRadius: '50%',
                  background: accent,
                  display: 'inline-block',
                }}
              />
            </div>
            <span
              style={{
                fontFamily: MONO,
                fontSize: 8.5 * s,
                color: kpiTagCol,
                letterSpacing: 1.5 * s,
                textTransform: 'uppercase',
                background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                padding: `${2 * s}px ${8 * s}px`,
                borderRadius: 4 * s,
              }}
            >
              {funnelSub}
            </span>
          </div>

          {/* Funnel bars */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 5 * s,
              position: 'relative',
            }}
          >
            {data.funnelSteps.map((step, i) => {
              const barPct = (step.pct / maxPct) * 100;
              const isLast = i === stepCount - 1;
              const progress = i / (stepCount - 1);
              // Interpolate color from accent to accent2 along funnel
              const barR = Math.round(ar + (a2r - ar) * progress);
              const barG = Math.round(ag + (a2g - ag) * progress);
              const barB = Math.round(ab + (a2b - ab) * progress);
              const barColor = `rgb(${barR},${barG},${barB})`;

              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10 * s,
                  }}
                >
                  {/* Step number */}
                  <div
                    style={{
                      width: 18 * s,
                      height: 18 * s,
                      borderRadius: '50%',
                      background: isLast ? barColor : 'transparent',
                      border: isLast ? 'none' : `1.5px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 8 * s,
                      fontFamily: MONO,
                      fontWeight: 600,
                      color: isLast ? '#fff' : labelCol,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>

                  {/* Label */}
                  <div
                    style={{
                      width: 72 * s,
                      fontSize: 10.5 * s,
                      color: isLast ? textCol : labelCol,
                      fontWeight: isLast ? 700 : 500,
                      flexShrink: 0,
                    }}
                  >
                    {step.label}
                  </div>

                  {/* Bar track */}
                  <div
                    style={{
                      flex: 1,
                      height: 28 * s,
                      background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                      borderRadius: 8 * s,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: `${Math.max(barPct, 4)}%`,
                        borderRadius: 8 * s,
                        background: isLast
                          ? `linear-gradient(90deg, ${accent}, ${accent2})`
                          : barColor,
                        opacity: isLast ? 1 : 0.75 + (0.25 * (1 - progress)),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: 10 * s,
                      }}
                    >
                      {barPct > 15 && (
                        <span
                          style={{
                            fontFamily: MONO,
                            fontSize: 10 * s,
                            color: '#fff',
                            fontWeight: isLast ? 700 : 500,
                            whiteSpace: 'nowrap',
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                          }}
                        >
                          {step.value}
                        </span>
                      )}
                    </div>
                    {barPct <= 15 && (
                      <span
                        style={{
                          position: 'absolute',
                          left: `calc(${Math.max(barPct, 4)}% + ${6 * s}px)`,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontFamily: MONO,
                          fontSize: 10 * s,
                          color: isLast ? textCol : labelCol,
                          fontWeight: isLast ? 700 : 500,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {step.value}
                      </span>
                    )}
                  </div>

                  {/* Percentage */}
                  <div
                    style={{
                      width: 44 * s,
                      fontFamily: MONO,
                      fontSize: 10 * s,
                      color: isLast ? accent : (dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)'),
                      fontWeight: isLast ? 700 : 400,
                      textAlign: 'right',
                      flexShrink: 0,
                    }}
                  >
                    {step.pct}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 14 * s,
          }}
        >
          <div
            style={{
              fontSize: 10 * s,
              color: labelCol,
              fontStyle: 'italic',
              maxWidth: '55%',
              lineHeight: 1.4,
              borderLeft: `2.5px solid ${accent}`,
              paddingLeft: 10 * s,
              opacity: 0.8,
            }}
          >
            {data.quote}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8 * s,
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: 8.5 * s,
                color: accent,
                letterSpacing: 1 * s,
                opacity: 0.5,
              }}
            >
              {data.ctaText}
            </span>
            <svg width={16 * s} height={8 * s} viewBox="0 0 16 8" fill="none">
              <path d="M0 4h14M11 1l3 3-3 3" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
