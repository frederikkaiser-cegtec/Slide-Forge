import type { CaseStudyData } from '../../App';
import { BrandedChart } from './BrandedChart';
import { LOGO_URL } from '../../utils/assets';

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
  subline: 'CegTec AI Sales Automation \u2014 Ergebnisse nach 90 Tagen',
  metrics: [
    { value: '312%', label: 'Mehr qualifizierte Leads', icon: '\u2191', tag: 'KPI 01' },
    { value: '14 Tage', label: 'Time-to-First-Meeting', icon: '\u23F1', tag: 'KPI 02' },
    { value: '67%', label: 'Weniger manueller Aufwand', icon: '\u26A1', tag: 'KPI 03' },
  ],
  funnelSteps: [
    { label: 'Kontaktiert', value: '1.976', pct: 100 },
    { label: 'Ge\u00f6ffnet', value: '1.284', pct: 65 },
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

const MONO = "'JetBrains Mono', 'IBM Plex Mono', 'SF Mono', monospace";

function isDarkBg(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
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
  const dark = isDarkBg(bg);
  const accent = data.accentColor || '#3B4BF9';
  const accent2 = data.accentColor2 || '#E93BCD';
  const accentFaded = accent + '18';
  const textCol = data.textColor || (dark ? '#f0f0f5' : '#0A0A0A');
  const labelCol = data.labelColor || (dark ? '#9090a5' : '#71717A');
  const cardCol = data.cardColor || (dark ? '#141420' : '#FFFFFF');
  const cardBorder = data.cardBorderColor || (dark ? '#2a2a3e' : '#E5E7EB');
  const kpiTagCol = data.kpiTagColor || (dark ? '#7a7a90' : '#9CA3AF');
  const funnelTitle = data.funnelTitle || 'Sales Funnel';
  const funnelSub = data.funnelSubtitle || '90-DAY WINDOW';

  // Theme-aware subtle colors
  const subtleLine = dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.04)';
  const barTrack = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const barText = dark ? 'rgba(255,255,255,0.95)' : '#FFFFFF';
  const pctMuted = dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)';

  // Funnel geometry
  const stepCount = data.funnelSteps.length;
  const maxPct = Math.max(...data.funnelSteps.map((f) => f.pct), 1);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
        background: bg,
      }}
    >
      {/* SVG background layer */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          <filter id="ig-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={120 * s} />
          </filter>
          <filter id="ig-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
          <linearGradient id="ig-topLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={accent} stopOpacity="0" />
            <stop offset="40%" stopColor={accent} stopOpacity="0.8" />
            <stop offset="60%" stopColor={accent2} stopOpacity="0.6" />
            <stop offset="100%" stopColor={accent2} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ig-funnelGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={accent} />
            <stop offset="100%" stopColor={accent2} />
          </linearGradient>
        </defs>

        <rect width={width} height={height} fill={bg} />

        {/* Atmospheric orbs */}
        <ellipse
          cx={width * 0.15}
          cy={height * 0.3}
          rx={300 * s}
          ry={200 * s}
          fill={accent}
          opacity={dark ? '0.04' : '0.06'}
          filter="url(#ig-blur)"
        />
        <ellipse
          cx={width * 0.85}
          cy={height * 0.7}
          rx={250 * s}
          ry={180 * s}
          fill={accent2}
          opacity={dark ? '0.03' : '0.05'}
          filter="url(#ig-blur)"
        />

        {/* Grid pattern */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={`hg-${i}`}
            x1={0}
            y1={(height / 12) * (i + 1)}
            x2={width}
            y2={(height / 12) * (i + 1)}
            stroke={subtleLine}
            strokeWidth={0.5}
          />
        ))}

        {/* Accent line top */}
        <rect y={0} width={width} height={2.5 * s} fill="url(#ig-topLine)" />

        {/* Noise texture */}
        <rect
          width={width}
          height={height}
          opacity="0.015"
          filter="url(#ig-noise)"
        />
      </svg>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: `${32 * s}px ${48 * s}px ${24 * s}px`,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 28 * s,
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10 * s,
                marginBottom: 8 * s,
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 9.5 * s,
                  fontWeight: 500,
                  color: accent,
                  letterSpacing: 2.5 * s,
                  textTransform: 'uppercase',
                }}
              >
                {data.industry}
              </span>
              <span
                style={{
                  width: 40 * s,
                  height: 1,
                  background: `linear-gradient(90deg, ${accent}, transparent)`,
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 9.5 * s,
                  fontWeight: 500,
                  color: labelCol,
                  letterSpacing: 1.5 * s,
                }}
              >
                {data.companyName}
              </span>
            </div>
            <h1
              style={{
                fontSize: 28 * s,
                fontWeight: 800,
                color: textCol,
                lineHeight: 1.15,
                letterSpacing: -0.8 * s,
                margin: 0,
                maxWidth: 600 * s,
              }}
            >
              {data.headline}
            </h1>
            <p
              style={{
                fontSize: 12 * s,
                color: labelCol,
                marginTop: 6 * s,
                fontWeight: 400,
                letterSpacing: 0.2 * s,
              }}
            >
              {data.subline}
            </p>
          </div>
          <img
            src={LOGO_URL}
            alt="CegTec"
            style={{ height: 16 * s, marginTop: 4 * s }}
          />
        </div>

        {/* Metric cards */}
        <div
          style={{
            display: 'flex',
            gap: 16 * s,
            marginBottom: 28 * s,
          }}
        >
          {data.metrics.map((m, i) => {
            const colors = [accent, accent2, accent];
            const colors2 = [accent2, accent, accent2];
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: cardCol,
                  border: `1px solid ${cardBorder}`,
                  borderRadius: 12 * s,
                  padding: `${18 * s}px ${20 * s}px`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Subtle top gradient */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: `linear-gradient(90deg, transparent, ${colors[i % colors.length]}, transparent)`,
                    opacity: 0.6,
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8 * s,
                    marginBottom: 8 * s,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14 * s,
                      width: 28 * s,
                      height: 28 * s,
                      borderRadius: 8 * s,
                      background: accentFaded,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: accent,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {m.icon}
                  </span>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 9 * s,
                      color: kpiTagCol,
                      letterSpacing: 1 * s,
                      textTransform: 'uppercase',
                    }}
                  >
                    {m.tag || `KPI 0${i + 1}`}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 32 * s,
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: -1.5 * s,
                    background: `linear-gradient(135deg, ${colors[i % colors.length]}, ${colors2[i % colors2.length]})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: 6 * s,
                  }}
                >
                  {m.value}
                </div>
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

        {/* Funnel section */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: cardCol,
            border: `1px solid ${cardBorder}`,
            borderRadius: 14 * s,
            padding: `${16 * s}px ${24 * s}px ${14 * s}px`,
            minHeight: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14 * s,
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: 9.5 * s,
                fontWeight: 500,
                color: labelCol,
                letterSpacing: 2 * s,
                textTransform: 'uppercase',
              }}
            >
              {funnelTitle}
            </span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: 9 * s,
                color: kpiTagCol,
                letterSpacing: 1 * s,
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
              gap: 6 * s,
            }}
          >
            {data.funnelSteps.map((step, i) => {
              const barPct = (step.pct / maxPct) * 100;
              const isLast = i === stepCount - 1;
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12 * s,
                  }}
                >
                  {/* Label */}
                  <div
                    style={{
                      width: 85 * s,
                      fontSize: 10.5 * s,
                      color: isLast ? textCol : labelCol,
                      fontWeight: isLast ? 700 : 500,
                      textAlign: 'right',
                      flexShrink: 0,
                    }}
                  >
                    {step.label}
                  </div>

                  {/* Bar track */}
                  <div
                    style={{
                      flex: 1,
                      height: 26 * s,
                      background: barTrack,
                      borderRadius: 6 * s,
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
                        width: `${Math.max(barPct, 3)}%`,
                        borderRadius: 6 * s,
                        background: isLast
                          ? `linear-gradient(90deg, ${accent}, ${accent2})`
                          : `linear-gradient(90deg, ${accent}cc, ${accent}90)`,
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: 10 * s,
                        transition: 'width 0.6s cubic-bezier(0.32,0.72,0,1)',
                      }}
                    >
                      {barPct > 12 && (
                        <span
                          style={{
                            fontFamily: MONO,
                            fontSize: 9.5 * s,
                            color: barText,
                            fontWeight: isLast ? 700 : 500,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {step.value}
                        </span>
                      )}
                    </div>
                    {barPct <= 12 && (
                      <span
                        style={{
                          position: 'absolute',
                          left: `calc(${Math.max(barPct, 3)}% + ${6 * s}px)`,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontFamily: MONO,
                          fontSize: 9.5 * s,
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
                      width: 48 * s,
                      fontFamily: MONO,
                      fontSize: 10 * s,
                      color: isLast ? accent : pctMuted,
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

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16 * s,
          }}
        >
          <div
            style={{
              fontSize: 10 * s,
              color: labelCol,
              fontStyle: 'italic',
              maxWidth: '55%',
              lineHeight: 1.4,
              borderLeft: `2px solid ${accent}30`,
              paddingLeft: 10 * s,
            }}
          >
            {data.quote}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12 * s,
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: 9 * s,
                color: accent,
                letterSpacing: 1 * s,
                opacity: 0.6,
              }}
            >
              {data.ctaText}
            </span>
            <div
              style={{
                width: 24 * s,
                height: 1,
                background: `linear-gradient(90deg, ${accent}, transparent)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
