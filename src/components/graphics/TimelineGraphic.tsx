import { LOGO_URL } from '../../utils/assets';
import {
  FONTS, COLORS, CEGTEC_LIGHT_DEFAULTS,
  isDark, adjustBrightness, logoFilter, hexToRgb,
} from '../../utils/cegtecTheme';

// ── Data Interface ──────────────────────────────────────────────

export interface TimelineData {
  topLabel: string;
  headline: string;
  steps: { title: string; description: string; duration?: string }[];
  bottomLine: string;
  backgroundColor?: string;
  textColor?: string;
  labelColor?: string;
  filledColor?: string;
  borderColor?: string;
  warningColor?: string;
}

export const defaultTimelineData: TimelineData = {
  topLabel: 'IMPLEMENTATION ROADMAP',
  headline: 'In 4 Schritten zum\ndatengetriebenen Vertrieb',
  steps: [
    { title: 'Daten-Audit', description: 'Bestehende Quellen analysieren und Qualität bewerten', duration: 'Woche 1-2' },
    { title: 'Enrichment Setup', description: 'Datenanreicherung und Scoring-Modelle konfigurieren', duration: 'Woche 3-4' },
    { title: 'Outreach Launch', description: 'Personalisierte Multichannel-Kampagnen starten', duration: 'Woche 5-6' },
    { title: 'Optimierung', description: 'A/B-Tests, Feedback-Loops und Pipeline-Skalierung', duration: 'Fortlaufend' },
  ],
  bottomLine: 'cegtec.net — Vom Audit zur Pipeline in 6 Wochen',
  ...CEGTEC_LIGHT_DEFAULTS,
};

// ── Component ───────────────────────────────────────────────────

const REF_W = 1920;
const REF_H = 1080;

export function TimelineGraphic({
  data,
  width,
  height,
}: {
  data: TimelineData;
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
  const borderCol = data.borderColor || COLORS.border;

  const [fr, fg, fb] = hexToRgb(textFilled);

  const pad = 72 * s;
  const steps = data.steps;
  const stepCount = steps.length;

  // Timeline geometry
  const timelineY = height * 0.54;
  const nodeRadius = 18 * s;
  const xStart = pad + 60 * s;
  const xEnd = width - pad - 60 * s;
  const stepSpacing = stepCount > 1 ? (xEnd - xStart) / (stepCount - 1) : 0;

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
          <filter id="tl-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={120 * s} />
          </filter>
          <filter id="tl-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="overlay" />
          </filter>
          <linearGradient id="tl-accent-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={textFilled} stopOpacity="0" />
            <stop offset="15%" stopColor={textFilled} />
            <stop offset="85%" stopColor={textFilled} />
            <stop offset="100%" stopColor={textFilled} stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width={width} height={height} fill={bg} />

        {/* Atmospheric orbs */}
        <ellipse cx={width * 0.2} cy={height * 0.15} rx={350 * s} ry={250 * s}
          fill={textFilled} opacity={dark ? 0.06 : 0.04} filter="url(#tl-blur)" />
        <ellipse cx={width * 0.8} cy={height * 0.85} rx={300 * s} ry={200 * s}
          fill={textFilled} opacity={dark ? 0.04 : 0.025} filter="url(#tl-blur)" />

        {/* Top accent stripe */}
        <rect y={0} width={width} height={4 * s} fill="url(#tl-accent-line)" />

        {/* Subtle grid lines */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i}
            x1={0} y1={((i + 1) * height) / 9}
            x2={width} y2={((i + 1) * height) / 9}
            stroke={dark ? '#ffffff' : '#000000'}
            strokeWidth={0.5} opacity={0.015}
          />
        ))}

        {/* Timeline connecting line */}
        <line
          x1={xStart} y1={timelineY}
          x2={xEnd} y2={timelineY}
          stroke={dark ? 'rgba(255,255,255,0.08)' : borderCol}
          strokeWidth={3 * s}
          strokeLinecap="round"
        />

        {/* Timeline progress line */}
        <line
          x1={xStart} y1={timelineY}
          x2={xEnd} y2={timelineY}
          stroke={`rgba(${fr},${fg},${fb},0.25)`}
          strokeWidth={3 * s}
          strokeLinecap="round"
        />

        {/* Noise */}
        <rect width={width} height={height} opacity="0.015" filter="url(#tl-noise)" />
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

        {/* Spacer to push timeline to vertical center */}
        <div style={{ flex: 1 }} />

        {/* ── TIMELINE NODES ── */}
        <div style={{ position: 'relative', height: 320 * s }}>
          {steps.map((step, i) => {
            const cx = xStart + i * stepSpacing;
            const isAbove = i % 2 === 0;
            const topForNode = timelineY - 40 * s - (height * 0.04); // offset from container top

            return (
              <div key={i} style={{ position: 'absolute', left: cx - 100 * s, width: 200 * s }}>
                {/* Node circle */}
                <div style={{
                  position: 'absolute',
                  left: '50%', top: topForNode,
                  transform: 'translate(-50%, -50%)',
                  width: nodeRadius * 2, height: nodeRadius * 2,
                  borderRadius: '50%',
                  background: textFilled,
                  border: `3px solid ${bg}`,
                  boxShadow: `0 0 0 ${3 * s}px rgba(${fr},${fg},${fb},0.15)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: FONTS.mono, fontSize: 14 * s, fontWeight: 700,
                  color: '#ffffff',
                  zIndex: 2,
                }}>
                  {i + 1}
                </div>

                {/* Content card */}
                <div style={{
                  position: 'absolute',
                  left: '50%', transform: 'translateX(-50%)',
                  top: isAbove ? topForNode - nodeRadius - 16 * s - 120 * s : topForNode + nodeRadius + 16 * s,
                  width: 190 * s,
                  padding: `${14 * s}px ${16 * s}px`,
                  background: dark ? 'rgba(255,255,255,0.03)' : '#ffffff',
                  borderRadius: 10 * s,
                  border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : borderCol}`,
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontFamily: FONTS.display,
                    fontSize: 16 * s, fontWeight: 700,
                    color: titleCol, lineHeight: 1.2,
                    marginBottom: 6 * s,
                  }}>
                    {step.title}
                  </div>
                  <div style={{
                    fontSize: 13 * s, fontWeight: 500,
                    color: textMuted, lineHeight: 1.35,
                    marginBottom: step.duration ? 8 * s : 0,
                  }}>
                    {step.description}
                  </div>
                  {step.duration && (
                    <div style={{
                      display: 'inline-block',
                      padding: `${3 * s}px ${10 * s}px`,
                      background: `rgba(${fr},${fg},${fb},${dark ? 0.1 : 0.06})`,
                      borderRadius: 6 * s,
                      fontFamily: FONTS.mono, fontSize: 11 * s, fontWeight: 600,
                      color: textFilled, letterSpacing: 1 * s,
                    }}>
                      {step.duration}
                    </div>
                  )}
                </div>

                {/* Connector line from node to card */}
                <div style={{
                  position: 'absolute',
                  left: '50%', transform: 'translateX(-50%)',
                  top: isAbove ? topForNode - nodeRadius - 16 * s : topForNode + nodeRadius,
                  width: 2 * s, height: 16 * s,
                  background: `rgba(${fr},${fg},${fb},0.2)`,
                }} />
              </div>
            );
          })}
        </div>

        <div style={{ flex: 1 }} />

        {/* ── CTA FOOTER ── */}
        <div style={{
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
