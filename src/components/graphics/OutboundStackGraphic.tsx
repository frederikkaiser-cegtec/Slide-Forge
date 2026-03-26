import { LOGO_URL } from '../../utils/assets';
import { logoFilter, adjustBrightness } from '../../utils/cegtecTheme';

export interface PipelineStep {
  label: string;
  tool: string;
  url: string;
  price: string;
  description: string;
}

export interface CostColumn {
  title: string;
  price: string;
  subtitle: string;
  highlight: boolean;
}

export interface OutboundStackData {
  title: string;
  subtitle: string;
  sourceLabel: string;
  badgeText: string;
  steps: PipelineStep[];
  costLeft: CostColumn;
  costRight: CostColumn;
  resultMetrics: string;
  resultSource: string;
  backgroundColor?: string;
  textColor?: string;
  labelColor?: string;
  filledColor?: string;
  emptyColor?: string;
  borderColor?: string;
  warningColor?: string;
}

export const defaultOutboundStackData: OutboundStackData = {
  title: 'So baust du personalisierten Outbound f\u00fcr unter 150\u20ac/Monat',
  subtitle: 'Ohne Clay. Ohne Sales Navigator. 4 Tools + Claude Code.',
  sourceLabel: 'CEGTEC ACADEMY',
  badgeText: 'DIY OUTBOUND GUIDE',
  steps: [
    { label: 'SOURCING & RESEARCH', tool: 'Research Agent', url: 'research-agent.net', price: '\u20ac49/Mo (500 Credits)', description: 'Deep Research pro Lead, DACH-optimiert' },
    { label: 'ANREICHERN', tool: 'FullEnrich API', url: 'fullenrich.com', price: '$29/Mo (500 Credits)', description: 'E-Mail + Telefon, 60\u201375% Hit Rate' },
    { label: 'OUTREACH', tool: 'Instantly', url: 'instantly.ai', price: '$37/Mo (Growth)', description: 'Personalisierte Multi-Step Sequenzen' },
    { label: 'ORCHESTRIEREN', tool: 'Claude Code', url: 'claude.ai', price: '~$20\u201350/Mo (API)', description: 'Ein Prompt steuert alles' },
  ],
  costLeft: { title: 'Dieser Stack', price: '~\u20ac140/Mo', subtitle: '', highlight: true },
  costRight: { title: 'Clay + Instantly', price: '~\u20ac205/Mo', subtitle: 'Clay Launch $185 + Instantly $37, ohne Live-Web-Research', highlight: false },
  resultMetrics: '500\u20131.000 Leads \u2192 60\u201375% Enrichment \u2192 3\u20138% Reply Rate \u2192 Meetings ab Woche 3',
  resultSource: 'CegTec Benchmark-Daten',
  backgroundColor: '#F5F5F0',
  textColor: '#1A1A2E',
  labelColor: '#8A8A9A',
  filledColor: '#2563EB',
  emptyColor: '#D4D4D8',
  borderColor: '#E5E5EA',
  warningColor: '#1A3FD4',
};

const MONO = "'IBM Plex Mono', 'JetBrains Mono', 'SF Mono', monospace";
const DISPLAY = "'DM Sans', 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif";

const STEP_ICONS = [
  (sz: number, color: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <circle cx="10.5" cy="10.5" r="6.5" stroke={color} strokeWidth="2" />
      <line x1="15.5" y1="15.5" x2="21" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  (sz: number, color: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 7l10 5 10-5-10-5z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M2 12l10 5 10-5" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M2 17l10 5 10-5" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
  (sz: number, color: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="5" rx="9" ry="3" stroke={color} strokeWidth="2" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" stroke={color} strokeWidth="2" />
      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" stroke={color} strokeWidth="2" />
    </svg>
  ),
  (sz: number, color: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <path d="M22 2L11 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2L15 22l-4-9-9-4 20-7z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
  (sz: number, color: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="3" width="20" height="18" rx="2" stroke={color} strokeWidth="2" />
      <path d="M6 9l4 3-4 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="14" y1="15" x2="18" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
];

export function OutboundStackGraphic({
  data,
  width,
  height,
}: {
  data: OutboundStackData;
  width: number;
  height: number;
}) {
  const s = Math.min(width / 1080, height / 1920);

  const isDark = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  };
  const bg = data.backgroundColor || '#F5F5F0';
  const dark = isDark(bg);
  const warning = data.warningColor || '#1A3FD4';
  const borderCol = data.borderColor || '#E5E5EA';
  const textFilled = data.filledColor || '#2563EB';
  const textMuted = data.labelColor || '#8A8A9A';
  const textDim = adjustBrightness(textMuted, -18);
  const textLabel = adjustBrightness(textMuted, -34);
  const emptyCol = data.emptyColor || '#D4D4D8';
  const titleCol = data.textColor || '#1A1A2E';

  const padX = 64 * s;
  const padTop = 76 * s;
  const iconSz = 38 * s;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: MONO,
        background: bg,
      }}
    >
      {/* Scanline / noise overlay */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <defs>
          <filter id="os-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="overlay" />
          </filter>
        </defs>
        <rect width={width} height={height} opacity="0.02" filter="url(#os-noise)" />
        {Array.from({ length: Math.floor(height / (5 * s)) }).map((_, i) => (
          <rect
            key={i}
            x={0}
            y={i * 5 * s}
            width={width}
            height={1 * s}
            fill={dark ? '#ffffff' : '#000000'}
            opacity={dark ? 0.006 : 0.01}
          />
        ))}
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
          padding: `${padTop}px ${padX}px ${56 * s}px`,
        }}
      >
        {/* ── HEADER ── */}
        <div style={{ marginBottom: 44 * s }}>
          {/* Logo row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 * s }}>
            <img src={LOGO_URL} alt="CegTec" style={{ height: 36 * s, opacity: 0.85, ...logoFilter(bg) }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 * s }}>
              <span
                style={{
                  fontSize: 15 * s,
                  fontWeight: 600,
                  color: textDim,
                  letterSpacing: 3 * s,
                  textTransform: 'uppercase',
                }}
              >
                {data.sourceLabel}
              </span>
              <span
                style={{
                  width: 9 * s,
                  height: 9 * s,
                  borderRadius: '50%',
                  background: warning,
                  opacity: 0.5,
                  display: 'inline-block',
                }}
              />
            </div>
          </div>

          {/* Badge */}
          <div
            style={{
              display: 'inline-block',
              padding: `${8 * s}px ${22 * s}px`,
              border: `2px solid ${textFilled}`,
              borderRadius: 6 * s,
              fontSize: 17 * s,
              fontWeight: 700,
              color: textFilled,
              letterSpacing: 3.5 * s,
              marginBottom: 30 * s,
            }}
          >
            {data.badgeText}
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: DISPLAY,
              fontSize: 74 * s,
              fontWeight: 800,
              color: titleCol,
              lineHeight: 1.08,
              letterSpacing: -2 * s,
              margin: 0,
              marginBottom: 18 * s,
            }}
          >
            {data.title}
          </h1>
          <p
            style={{
              fontSize: 28 * s,
              color: textMuted,
              fontFamily: DISPLAY,
              fontWeight: 500,
              fontStyle: 'italic',
              margin: 0,
            }}
          >
            {data.subtitle}
          </p>
        </div>

        {/* Thin separator */}
        <div style={{ height: 1.5 * s, background: borderCol, marginBottom: 40 * s }} />

        {/* ── PIPELINE FLOW ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 44 * s }}>
          {data.steps.map((step, i) => {
            const iconFn = STEP_ICONS[i % STEP_ICONS.length];
            const isLast = i === data.steps.length - 1;
            return (
              <div key={i}>
                {/* Step card */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 22 * s,
                    padding: `${24 * s}px ${28 * s}px`,
                    border: `1.5px solid ${borderCol}`,
                    borderRadius: 12 * s,
                    background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
                  }}
                >
                  {/* Number circle */}
                  <div
                    style={{
                      width: 52 * s,
                      height: 52 * s,
                      borderRadius: '50%',
                      background: textFilled,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 24 * s, fontWeight: 700, color: '#fff' }}>{i + 1}</span>
                  </div>

                  {/* Icon */}
                  <div style={{ flexShrink: 0 }}>{iconFn(iconSz, textFilled)}</div>

                  {/* Text block */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: 17 * s,
                        fontWeight: 700,
                        color: textFilled,
                        letterSpacing: 3 * s,
                        display: 'block',
                        marginBottom: 5 * s,
                      }}
                    >
                      {step.label}
                    </span>
                    <div
                      style={{
                        fontSize: 34 * s,
                        fontWeight: 700,
                        color: titleCol,
                        fontFamily: DISPLAY,
                        marginBottom: 4 * s,
                        lineHeight: 1.15,
                      }}
                    >
                      {step.tool}
                    </div>
                    <div style={{ fontSize: 20 * s, color: textDim, lineHeight: 1.3, marginBottom: 6 * s }}>
                      {step.description}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 * s }}>
                      <span style={{ fontSize: 16 * s, color: textMuted, fontFamily: MONO }}>{step.url}</span>
                      <span
                        style={{
                          fontSize: 16 * s,
                          fontWeight: 700,
                          color: textFilled,
                          fontFamily: MONO,
                          background: dark ? 'rgba(37,99,235,0.1)' : 'rgba(37,99,235,0.06)',
                          padding: `${2 * s}px ${10 * s}px`,
                          borderRadius: 4 * s,
                        }}
                      >
                        {step.price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Connector */}
                {!isLast && (
                  <div style={{ display: 'flex', justifyContent: 'center', height: 22 * s }}>
                    <div style={{ width: 3 * s, height: '100%', background: textFilled, opacity: 0.25, borderRadius: 2 }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── COST COMPARISON ── */}
        <div
          style={{
            display: 'flex',
            gap: 20 * s,
            marginBottom: 36 * s,
          }}
        >
          {[data.costLeft, data.costRight].map((col, ci) => (
            <div
              key={ci}
              style={{
                flex: 1,
                padding: `${28 * s}px ${24 * s}px`,
                borderRadius: 12 * s,
                border: `${col.highlight ? 2.5 : 1.5}px solid ${col.highlight ? textFilled : borderCol}`,
                background: col.highlight
                  ? (dark ? 'rgba(37,99,235,0.08)' : 'rgba(37,99,235,0.04)')
                  : (dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)'),
                textAlign: 'center' as const,
              }}
            >
              <div
                style={{
                  fontSize: 17 * s,
                  fontWeight: 600,
                  color: col.highlight ? textFilled : textLabel,
                  letterSpacing: 2.5 * s,
                  textTransform: 'uppercase' as const,
                  marginBottom: 10 * s,
                }}
              >
                {col.title}
              </div>
              <div
                style={{
                  fontSize: 52 * s,
                  fontWeight: 800,
                  fontFamily: DISPLAY,
                  color: col.highlight ? textFilled : textMuted,
                  lineHeight: 1.1,
                  marginBottom: 8 * s,
                }}
              >
                {col.price}
              </div>
              {col.subtitle && (
                <div
                  style={{
                    fontSize: 14 * s,
                    color: textMuted,
                    fontFamily: MONO,
                    lineHeight: 1.4,
                  }}
                >
                  ({col.subtitle})
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── RESULT BANNER ── */}
        <div
          style={{
            padding: `${28 * s}px ${32 * s}px`,
            borderRadius: 12 * s,
            border: `2px solid ${textFilled}`,
            background: dark ? 'rgba(37,99,235,0.06)' : 'rgba(37,99,235,0.03)',
          }}
        >
          <div
            style={{
              fontSize: 24 * s,
              fontWeight: 600,
              color: titleCol,
              lineHeight: 1.5,
              textAlign: 'center' as const,
              fontFamily: MONO,
            }}
          >
            {data.resultMetrics}
          </div>
          <div
            style={{
              fontSize: 14 * s,
              color: textMuted,
              textAlign: 'center' as const,
              marginTop: 12 * s,
              letterSpacing: 2 * s,
              textTransform: 'uppercase' as const,
            }}
          >
            Quelle: {data.resultSource}
          </div>
        </div>

      </div>
    </div>
  );
}
