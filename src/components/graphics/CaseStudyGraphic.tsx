import type { CaseStudyData } from '../../types/graphics';
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

export function CaseStudyGraphic({ data, width, height }: { data: CaseStudyData; width: number; height: number }) {
  const BLUE = data.accentColor || '#3B4BF9';
  const PINK = data.accentColor2 || '#E93BCD';
  const BLUE_L = lighten(BLUE);
  const PINK_L = lighten(PINK);
  const bg = data.backgroundColor || '#080820';
  const textCol = data.textColor || '#ffffff';
  const labelCol = data.labelColor || '#8888a0';
  const tagline = data.tagline || 'Case Study';
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
          <filter id="cs-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={90 * s} />
          </filter>
          <filter id="cs-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
          <linearGradient id="cs-topLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={PINK} stopOpacity="0" />
            <stop offset="30%" stopColor={PINK} />
            <stop offset="70%" stopColor={BLUE} />
            <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="cs-heroGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={BLUE_L} />
            <stop offset="100%" stopColor={PINK} />
          </linearGradient>
        </defs>

        <rect width={width} height={height} fill={bg} />

        {/* Atmospheric orbs */}
        <ellipse cx={width * 0.7} cy={height * 0.2} rx={350 * s} ry={250 * s} fill={BLUE} opacity="0.06" filter="url(#cs-soft)" />
        <ellipse cx={width * 0.2} cy={height * 0.8} rx={300 * s} ry={200 * s} fill={PINK} opacity="0.05" filter="url(#cs-soft)" />
        <circle cx={width * 0.5} cy={height * 0.5} r={400 * s} fill={BLUE} opacity="0.015" filter="url(#cs-soft)" />

        {/* Geometric rings */}
        <circle cx={hasChart ? width * 0.72 : width * 0.75} cy={height * 0.45} r={140 * s} fill="none" stroke={BLUE} strokeWidth={1.5} opacity="0.06" />
        <circle cx={hasChart ? width * 0.72 : width * 0.75} cy={height * 0.45} r={180 * s} fill="none" stroke={BLUE} strokeWidth={0.5} opacity="0.04" />
        <circle cx={hasChart ? width * 0.72 : width * 0.75} cy={height * 0.45} r={220 * s} fill="none" stroke={PINK} strokeWidth={0.3} opacity="0.03" />

        {/* Corner accent arcs */}
        <path d={`M 0 ${height * 0.6} Q ${width * 0.15} ${height * 0.9} ${width * 0.35} ${height}`} fill="none" stroke={PINK} strokeWidth={0.8} opacity="0.05" />
        <path d={`M ${width * 0.7} 0 Q ${width * 0.9} ${height * 0.1} ${width} ${height * 0.35}`} fill="none" stroke={BLUE} strokeWidth={0.8} opacity="0.05" />

        {/* Accent line top */}
        <rect y={0} width={width} height={2.5 * s} fill="url(#cs-topLine)" />

        {/* Noise */}
        <rect width={width} height={height} opacity="0.012" filter="url(#cs-noise)" />

        {/* Hero metric glow */}
        {!hasChart && (
          <ellipse cx={width * 0.72} cy={height * 0.42} rx={120 * s} ry={80 * s} fill={BLUE} opacity="0.08" filter="url(#cs-soft)" />
        )}
      </svg>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 1, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        padding: `${28 * s}px ${40 * s}px`,
      }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 * s }}>
          <div style={{
            fontSize: 10 * s, fontWeight: 700, color: PINK,
            letterSpacing: 3 * s, textTransform: 'uppercase',
            opacity: 0.8,
          }}>
            {tagline} — {data.industry}
          </div>
          <img src={LOGO_URL} alt="CegTec" style={{ height: 18 * s, ...logoFilter(bg) }} />
        </div>

        {/* Main */}
        <div style={{
          flex: 1, display: 'flex',
          flexDirection: isTall ? 'column' : 'row',
          gap: 32 * s, minHeight: 0, alignItems: 'center',
        }}>
          {/* Left: text */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              fontSize: 12 * s, fontWeight: 700, color: BLUE,
              letterSpacing: 2 * s, textTransform: 'uppercase', marginBottom: 10 * s, opacity: 0.7,
            }}>
              {data.companyName}
            </div>
            <div style={{
              fontSize: (hasChart ? 30 : 36) * s, fontWeight: 800, color: textCol,
              lineHeight: 1.08, letterSpacing: -1 * s, marginBottom: 24 * s,
            }}>
              {data.headline}
            </div>

            {/* Hero metric inline */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 * s, marginBottom: 20 * s }}>
              <span style={{
                fontSize: 64 * s, fontWeight: 900, lineHeight: 0.85,
                letterSpacing: -3 * s,
                background: `linear-gradient(135deg, ${BLUE_L}, ${PINK})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                filter: `drop-shadow(0 0 ${25 * s}px ${BLUE}55)`,
              } as React.CSSProperties}>
                {data.metricValue}
              </span>
              <span style={{ fontSize: 13 * s, color: labelCol, fontWeight: 500, maxWidth: 120 * s, lineHeight: 1.3 }}>
                {data.metricLabel}
              </span>
            </div>

            {/* Secondary metrics */}
            <div style={{ display: 'flex', gap: 28 * s }}>
              {[
                { value: data.metric2Value, label: data.metric2Label, color: PINK },
                { value: data.metric3Value, label: data.metric3Label, color: BLUE },
              ].map((m, i) => (
                <div key={i}>
                  <div style={{
                    fontSize: 26 * s, fontWeight: 800, lineHeight: 1,
                    letterSpacing: -1 * s,
                    background: `linear-gradient(180deg, ${m.color === PINK ? PINK_L : BLUE_L}, ${m.color})`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    filter: `drop-shadow(0 0 ${12 * s}px ${m.color}33)`,
                  } as React.CSSProperties}>
                    {m.value}
                  </div>
                  <div style={{ fontSize: 9.5 * s, color: labelCol, marginTop: 4 * s, fontWeight: 500, letterSpacing: 0.3 * s }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            {data.quote && !hasChart && (
              <div style={{
                fontSize: 11.5 * s, color: labelCol, fontStyle: 'italic',
                marginTop: 20 * s, lineHeight: 1.5, maxWidth: 380 * s,
                borderLeft: `2px solid ${PINK}33`, paddingLeft: 14 * s,
              }}>
                {data.quote}
              </div>
            )}
          </div>

          {/* Right: chart */}
          {hasChart && (
            <div style={{
              flex: isTall ? 'none' : 0.9,
              width: isTall ? '100%' : undefined,
              background: cardCol,
              border: `1px solid ${cardBorder}`,
              borderRadius: 20 * s,
              padding: `${20 * s}px`,
              backdropFilter: `blur(${10 * s}px)`,
            }}>
              <BrandedChart
                config={data.chart}
                width={isTall ? (width - 120 * s) : (width * 0.38)}
                height={isTall ? height * 0.28 : height * 0.58}
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
          {data.quote && hasChart && (
            <span style={{ fontSize: 9 * s, color: labelCol, opacity: 0.5, fontStyle: 'italic', maxWidth: '55%', textAlign: 'right' }}>
              {data.quote}
            </span>
          )}
          {!hasChart && <span style={{ fontSize: 9 * s, color: labelCol, opacity: 0.5, letterSpacing: 1.5 * s }}>{footerR}</span>}
        </div>
      </div>
    </div>
  );
}
