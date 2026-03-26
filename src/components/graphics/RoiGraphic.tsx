import type { RoiData } from '../../types/graphics';
import { BrandedChart } from './BrandedChart';
import { LOGO_URL } from '../../utils/assets';
import { logoFilter } from '../../utils/cegtecTheme';

function lighten(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mix = (c: number) => Math.min(255, c + Math.round((255 - c) * 0.35));
  return `#${mix(r).toString(16).padStart(2, '0')}${mix(g).toString(16).padStart(2, '0')}${mix(b).toString(16).padStart(2, '0')}`;
}

export function RoiGraphic({ data, width, height }: { data: RoiData; width: number; height: number }) {
  const BLUE = data.accentColor || '#3B4BF9';
  const PINK = data.accentColor2 || '#E93BCD';
  const BLUE_L = lighten(BLUE);
  const PINK_L = lighten(PINK);
  const bg = data.backgroundColor || '#070718';
  const textCol = data.textColor || '#ffffff';
  const labelCol = data.labelColor || '#8888a0';
  const tagline = data.tagline || 'ROI Report';
  const footerL = data.footerLeft || 'cegtec.net';
  const footerR = data.footerRight || 'AI Sales Automation';
  const cardCol = data.cardColor || 'rgba(255,255,255,0.02)';
  const cardBorder = data.cardBorderColor || 'rgba(255,255,255,0.04)';
  const s = Math.min(width / 1200, height / 627);
  const isTall = height > width * 1.2;
  const hasChart = data.chart.type !== 'none' && data.chart.data.length > 0;

  return (
    <div style={{
      width, height, position: 'relative', overflow: 'hidden',
      fontFamily: "'Inter', system-ui, sans-serif",
      background: bg,
    }}>
      {/* SVG Background */}
      <svg viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <filter id="roi-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={100 * s} />
          </filter>
          <filter id="roi-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
          <linearGradient id="roi-top" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={BLUE} stopOpacity="0" />
            <stop offset="40%" stopColor={BLUE} />
            <stop offset="60%" stopColor={PINK} />
            <stop offset="100%" stopColor={PINK} stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width={width} height={height} fill={bg} />

        {/* Atmospheric */}
        <ellipse cx={width * 0.3} cy={height * 0.3} rx={400 * s} ry={300 * s} fill={BLUE} opacity="0.04" filter="url(#roi-soft)" />
        <ellipse cx={width * 0.8} cy={height * 0.7} rx={350 * s} ry={250 * s} fill={PINK} opacity="0.035" filter="url(#roi-soft)" />

        {/* Grid dots */}
        {Array.from({ length: 15 }).map((_, row) =>
          Array.from({ length: 25 }).map((_, col) => (
            <circle
              key={`dot-${row}-${col}`}
              cx={width * 0.04 + col * (width * 0.04)}
              cy={height * 0.08 + row * (height * 0.065)}
              r={1 * s}
              fill="white"
              opacity="0.03"
            />
          ))
        )}

        {/* Geometric arcs */}
        <circle cx={width * 0.12} cy={height * 1.05} r={300 * s} fill="none" stroke={BLUE} strokeWidth={1} opacity="0.05" />
        <circle cx={width * 0.88} cy={-height * 0.1} r={280 * s} fill="none" stroke={PINK} strokeWidth={0.7} opacity="0.04" />

        {/* Accent line */}
        <rect y={0} width={width} height={2.5 * s} fill="url(#roi-top)" />

        {/* Noise */}
        <rect width={width} height={height} opacity="0.01" filter="url(#roi-noise)" />
      </svg>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 1, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        padding: `${28 * s}px ${40 * s}px`,
      }}>
        {/* Top */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 * s }}>
          <div style={{
            fontSize: 10 * s, fontWeight: 700, color: BLUE,
            letterSpacing: 3 * s, textTransform: 'uppercase', opacity: 0.7,
          }}>
            {tagline}
          </div>
          <img src={LOGO_URL} alt="CegTec" style={{ height: 18 * s, ...logoFilter(bg) }} />
        </div>

        {/* Title */}
        <div style={{
          fontSize: 36 * s, fontWeight: 800, color: textCol,
          lineHeight: 1.05, letterSpacing: -1.5 * s,
        }}>
          {data.title}
        </div>
        {data.subtitle && (
          <div style={{
            fontSize: 13 * s, color: labelCol,
            marginTop: 6 * s, marginBottom: 20 * s, fontWeight: 500,
          }}>
            {data.subtitle}
          </div>
        )}

        {/* Main: metrics + chart */}
        <div style={{
          flex: 1, display: 'flex',
          flexDirection: isTall ? 'column' : 'row',
          gap: 20 * s, minHeight: 0,
        }}>
          {/* Metrics column */}
          <div style={{
            display: 'flex',
            flexDirection: hasChart || isTall ? 'column' : 'row',
            gap: 12 * s,
            flex: hasChart ? 'none' : 1,
            width: hasChart && !isTall ? '30%' : undefined,
            justifyContent: 'center',
          }}>
            {data.metrics.map((m, i) => {
              const isBlue = m.color === 'blue';
              const accent = isBlue ? BLUE : PINK;
              const accentL = isBlue ? BLUE_L : PINK_L;
              return (
                <div key={i} style={{
                  flex: 1, position: 'relative',
                  background: cardCol,
                  border: `1px solid ${cardBorder}`,
                  borderRadius: 16 * s,
                  padding: `${18 * s}px ${16 * s}px`,
                  display: 'flex', flexDirection: hasChart ? 'row' : 'column',
                  alignItems: 'center',
                  gap: hasChart ? 14 * s : 6 * s,
                  justifyContent: hasChart ? 'flex-start' : 'center',
                  textAlign: hasChart ? 'left' : 'center',
                }}>
                  <div style={{
                    fontSize: (hasChart ? 34 : 44) * s, fontWeight: 900, lineHeight: 0.9,
                    letterSpacing: -2 * s,
                    background: `linear-gradient(180deg, ${accentL}, ${accent})`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    filter: `drop-shadow(0 0 ${18 * s}px ${accent}44)`,
                  } as React.CSSProperties}>
                    {m.value}
                  </div>
                  <div style={{
                    fontSize: 10 * s, color: labelCol,
                    fontWeight: 500, lineHeight: 1.3, letterSpacing: 0.3 * s,
                  }}>
                    {m.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart */}
          {hasChart && (
            <div style={{
              flex: 1,
              background: cardCol,
              border: `1px solid ${cardBorder}`,
              borderRadius: 16 * s,
              padding: `${20 * s}px`,
              backdropFilter: `blur(${10 * s}px)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minHeight: 0,
            }}>
              <BrandedChart
                config={data.chart}
                width={isTall ? (width - 120 * s) : (width * 0.52)}
                height={isTall ? height * 0.28 : height * 0.55}
                scale={s}
                bgColor={bg}
                accentColor={BLUE}
                accentColor2={PINK}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 12 * s,
        }}>
          <span style={{ fontSize: 9 * s, color: labelCol, opacity: 0.5, letterSpacing: 1.5 * s }}>{footerL}</span>
          <span style={{ fontSize: 9 * s, color: labelCol, opacity: 0.5, letterSpacing: 1.5 * s }}>{footerR}</span>
        </div>
      </div>
    </div>
  );
}
