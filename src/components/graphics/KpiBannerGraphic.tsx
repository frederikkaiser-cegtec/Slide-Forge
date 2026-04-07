import { LOGO_URL } from '../../utils/assets';
import { logoFilter, FONTS } from '../../utils/cegtecTheme';

export interface KpiBannerData {
  title: string;
  backgroundColor?: string;
  accentColor?: string;
  accentColor2?: string;
  textColor?: string;
  labelColor?: string;
  kpis: { icon: string; value: string; label: string; color: 'blue' | 'green' }[];
}

function lighten(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mix = (c: number) => Math.min(255, c + Math.round((255 - c) * 0.35));
  return `#${mix(r).toString(16).padStart(2, '0')}${mix(g).toString(16).padStart(2, '0')}${mix(b).toString(16).padStart(2, '0')}`;
}

export function KpiBannerGraphic({ data, width, height }: { data: KpiBannerData; width: number; height: number }) {
  const BLUE = data.accentColor || '#3B82F6';
  const GREEN = data.accentColor2 || '#10B981';
  const BLUE_LIGHT = lighten(BLUE);
  const GREEN_LIGHT = lighten(GREEN);
  const s = Math.min(width / 1200, height / 400);
  const kpiCount = data.kpis.length;
  const colW = width / kpiCount;
  const bg = data.backgroundColor || '#0A1628';
  const titleCol = data.textColor || '#b0b0c0';
  const labelCol = data.labelColor || '#808090';

  return (
    <div style={{
      width, height, position: 'relative', overflow: 'hidden',
      fontFamily: FONTS.display,
      background: bg,
    }}>
      {/* === SVG Background Layer === */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Noise texture */}
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>

          {/* Glow filters */}
          <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={40 * s} result="blur" />
            <feFlood floodColor={BLUE} floodOpacity="0.35" result="color" />
            <feComposite in="color" in2="blur" operator="in" />
          </filter>
          <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={35 * s} result="blur" />
            <feFlood floodColor={GREEN} floodOpacity="0.3" result="color" />
            <feComposite in="color" in2="blur" operator="in" />
          </filter>
          <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={80 * s} />
          </filter>

          {/* Gradients */}
          <linearGradient id="topLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={BLUE} stopOpacity="0" />
            <stop offset="20%" stopColor={BLUE} />
            <stop offset="50%" stopColor={GREEN} />
            <stop offset="80%" stopColor={BLUE} />
            <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
          </linearGradient>

          <radialGradient id="orbBlue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={BLUE} stopOpacity="0.12" />
            <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="orbGreen" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={GREEN} stopOpacity="0.1" />
            <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Deep background gradient */}
        <rect width={width} height={height} fill={bg} />
        <rect x={-width * 0.1} y={-height * 0.3} width={width * 0.6} height={height * 1.6} fill="url(#orbBlue)" rx={300} />
        <rect x={width * 0.6} y={-height * 0.2} width={width * 0.5} height={height * 1.4} fill="url(#orbGreen)" rx={250} />

        {/* Large atmospheric orbs */}
        <circle cx={width * 0.15} cy={height * 0.3} r={220 * s} fill={BLUE} opacity="0.04" filter="url(#soft)" />
        <circle cx={width * 0.85} cy={height * 0.7} r={180 * s} fill={GREEN} opacity="0.04" filter="url(#soft)" />
        <circle cx={width * 0.5} cy={height * 0.1} r={300 * s} fill={BLUE} opacity="0.02" filter="url(#soft)" />

        {/* Geometric accents — large arcs */}
        <circle cx={width * 0.08} cy={height * 1.1} r={280 * s} fill="none" stroke={BLUE} strokeWidth={1} opacity="0.06" />
        <circle cx={width * 0.08} cy={height * 1.1} r={320 * s} fill="none" stroke={BLUE} strokeWidth={0.5} opacity="0.04" />
        <circle cx={width * 0.92} cy={-height * 0.15} r={250 * s} fill="none" stroke={GREEN} strokeWidth={1} opacity="0.06" />
        <circle cx={width * 0.92} cy={-height * 0.15} r={290 * s} fill="none" stroke={GREEN} strokeWidth={0.5} opacity="0.04" />

        {/* Diagonal accent lines */}
        <line x1={width * 0.3} y1={0} x2={width * 0.22} y2={height} stroke={BLUE} strokeWidth={0.5} opacity="0.04" />
        <line x1={width * 0.7} y1={0} x2={width * 0.78} y2={height} stroke={GREEN} strokeWidth={0.5} opacity="0.04" />

        {/* Top accent line — bright gradient */}
        <rect x={0} y={0} width={width} height={2.5 * s} fill="url(#topLine)" />

        {/* Subtle noise overlay */}
        <rect width={width} height={height} opacity="0.015" filter="url(#noise)" />

        {/* === Per-KPI glow spots behind numbers === */}
        {data.kpis.map((kpi, i) => {
          const cx = colW * i + colW / 2;
          const cy = height * 0.52;
          const color = kpi.color === 'blue' ? BLUE : GREEN;
          return (
            <g key={`glow-${i}`}>
              <ellipse cx={cx} cy={cy} rx={70 * s} ry={50 * s} fill={color} opacity="0.07" filter="url(#soft)" />
            </g>
          );
        })}

        {/* Vertical dividers between KPIs */}
        {data.kpis.slice(1).map((_, i) => {
          const x = colW * (i + 1);
          return (
            <line key={`div-${i}`}
              x1={x} y1={height * 0.25} x2={x} y2={height * 0.85}
              stroke="white" strokeWidth={0.5} opacity="0.06"
            />
          );
        })}
      </svg>

      {/* === Content Layer === */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Title bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: `${22 * s}px ${36 * s}px ${0}px`,
        }}>
          <div style={{
            fontSize: 13 * s, fontWeight: 600, color: titleCol,
            letterSpacing: 3 * s, textTransform: 'uppercase',
          }}>
            {data.title}
          </div>
          <img src={LOGO_URL} alt="CegTec" style={{ height: 16 * s, ...logoFilter(bg) }} />
        </div>

        {/* KPIs */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center',
        }}>
          {data.kpis.map((kpi, i) => {
            const accent = kpi.color === 'blue' ? BLUE : GREEN;
            const accentLight = kpi.color === 'blue' ? BLUE_LIGHT : GREEN_LIGHT;
            return (
              <div key={i} style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: `0 ${8 * s}px`,
              }}>
                {/* Icon — subtle, above the number */}
                <div style={{
                  fontSize: 20 * s, marginBottom: 6 * s,
                  opacity: 0.8,
                }}>
                  {kpi.icon}
                </div>

                {/* Number — the star */}
                <div style={{
                  fontSize: 48 * s, fontWeight: 900, lineHeight: 0.9,
                  letterSpacing: -2 * s,
                  background: `linear-gradient(180deg, ${accentLight} 0%, ${accent} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: `drop-shadow(0 0 ${20 * s}px ${accent}44)`,
                  marginBottom: 8 * s,
                } as React.CSSProperties}>
                  {kpi.value}
                </div>

                {/* Label */}
                <div style={{
                  fontSize: 10.5 * s, color: labelCol,
                  fontWeight: 500, textAlign: 'center',
                  letterSpacing: 0.5 * s,
                  lineHeight: 1.3,
                }}>
                  {kpi.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
