import { LOGO_URL } from '../../utils/assets';
import { logoFilter } from '../../utils/cegtecTheme';

export interface SequenceStep {
  day: string;
  action: string;
  entries: { name: string; status: string }[];
}

export interface ChannelColumn {
  icon: string;
  header: string;
  steps: SequenceStep[];
}

export interface MultichannelOutreachData {
  title: string;
  subtitle: string;
  sourceLabel: string;
  badgeText: string;
  counterValue: string;
  counterLabel: string;
  footerLabel: string;
  footerStats: { label: string; value: string }[];
  leftChannel: ChannelColumn;
  rightChannel: ChannelColumn;
  backgroundColor?: string;
  textColor?: string;
  labelColor?: string;
  filledColor?: string;
  emptyColor?: string;
  borderColor?: string;
  warningColor?: string;
}

export const defaultMultichannelOutreachData: MultichannelOutreachData = {
  title: '2 Kan\u00e4le. 72h bis zum ersten Meeting.',
  subtitle: 'Koordiniert. Nicht gespammt.',
  sourceLabel: 'MULTICHANNEL OUTREACH',
  badgeText: 'LIVE \u2022 SENDING',
  counterValue: '12',
  counterLabel: 'MEETINGS BOOKED',
  footerLabel: 'CAMPAIGN ACTIVE \ud83d\udfe2 DAY 5/14',
  footerStats: [
    { label: '\u00d8 Reply Rate', value: '6,8%' },
    { label: 'Meetings gebucht', value: '12' },
    { label: 'Time to first Meeting', value: '<72h' },
    { label: 'Conversion: Replied \u2192 Meeting', value: '68%' },
  ],
  backgroundColor: '#F8F7F4',
  textColor: '#1A1A2E',
  labelColor: '#8A8A9A',
  filledColor: '#2563EB',
  emptyColor: '#D4D4D8',
  borderColor: '#E5E5EA',
  warningColor: '#2563EB',
  leftChannel: {
    icon: '\u2709',
    header: 'EMAIL SEQUENZ',
    steps: [
      {
        day: 'DAY 1',
        action: 'Erste Mail',
        entries: [
          { name: 'm.breitenbach@nexavion.de', status: 'Opened \u2713' },
          { name: 'p.richter@greyline-tech.de', status: 'Opened \u2713' },
          { name: 'c.mayer@pronau-sys.de', status: 'Pending\u2026' },
        ],
      },
      {
        day: 'DAY 3',
        action: 'Follow-Up',
        entries: [
          { name: 'm.breitenbach@nexavion.de', status: 'Replied \u2713' },
          { name: 'p.richter@greyline-tech.de', status: 'Opened \u2713' },
        ],
      },
      {
        day: 'DAY 5',
        action: 'Breakup',
        entries: [
          { name: 'p.richter@greyline-tech.de', status: 'Replied \u2713' },
        ],
      },
    ],
  },
  rightChannel: {
    icon: '\ud83d\udd17',
    header: 'LINKEDIN SEQUENZ',
    steps: [
      {
        day: 'DAY 1',
        action: 'Connection Request',
        entries: [
          { name: 'Markus Breitenbach', status: 'Accepted \u2713' },
          { name: 'Patrick Richter', status: 'Accepted \u2713' },
          { name: 'Christian Mayer', status: 'Pending\u2026' },
        ],
      },
      {
        day: 'DAY 3',
        action: 'LinkedIn Message',
        entries: [
          { name: 'Markus Breitenbach', status: 'Seen \u2713' },
          { name: 'Patrick Richter', status: 'Seen \u2713' },
        ],
      },
      {
        day: 'DAY 5',
        action: 'Follow-Up',
        entries: [
          { name: 'Markus Breitenbach', status: 'Replied \u2713' },
        ],
      },
    ],
  },
};

function adjustBrightness(hex: string, amount: number): string {
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(1, 3), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(3, 5), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(5, 7), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

const MONO = "'JetBrains Mono', 'IBM Plex Mono', 'SF Mono', monospace";
const DISPLAY = "'Plus Jakarta Sans', 'DM Sans', 'Inter', system-ui, sans-serif";

function ChannelColumnView({
  channel,
  s,
  borderCol,
  borderLight,
  textFilled,
  textMuted,
  textDim,
  textLabel,
  titleCol,
  dark,
}: {
  channel: ChannelColumn;
  s: number;
  borderCol: string;
  borderLight: string;
  textFilled: string;
  textMuted: string;
  textDim: string;
  textLabel: string;
  titleCol: string;
  dark: boolean;
}) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        border: `1px solid ${borderCol}`,
        borderRadius: 6 * s,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Channel header */}
      <div
        style={{
          padding: `${8 * s}px ${12 * s}px`,
          borderBottom: `1px solid ${borderCol}`,
          background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: 8 * s,
        }}
      >
        <span style={{ fontSize: 12 * s }}>{channel.icon}</span>
        <span
          style={{
            fontSize: 8.5 * s,
            fontWeight: 700,
            color: titleCol,
            letterSpacing: 2 * s,
            textTransform: 'uppercase' as const,
          }}
        >
          {channel.header}
        </span>
      </div>

      {/* Steps */}
      <div style={{ flex: 1, padding: `${6 * s}px ${12 * s}px ${8 * s}px` }}>
        {channel.steps.map((step, si) => (
          <div key={si} style={{ marginBottom: si < channel.steps.length - 1 ? 8 * s : 0 }}>
            {/* Day header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6 * s,
                marginBottom: 4 * s,
              }}
            >
              <span
                style={{
                  fontSize: 7.5 * s,
                  fontWeight: 700,
                  color: textFilled,
                  letterSpacing: 1 * s,
                }}
              >
                {step.day}
              </span>
              <span
                style={{
                  fontSize: 7 * s,
                  color: textLabel,
                  letterSpacing: 0.5 * s,
                }}
              >
                {'\u2192'}
              </span>
              <span
                style={{
                  fontSize: 8 * s,
                  fontWeight: 600,
                  color: textDim,
                }}
              >
                {step.action}
              </span>
            </div>

            {/* Entries */}
            {step.entries.map((entry, ei) => {
              const isReplied = entry.status.toLowerCase().includes('replied');
              const isPending = entry.status.toLowerCase().includes('pending');
              return (
                <div
                  key={ei}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: `${3 * s}px ${6 * s}px`,
                    marginBottom: 2 * s,
                    borderRadius: 3 * s,
                    background: isReplied
                      ? (dark ? 'rgba(37,99,235,0.06)' : 'rgba(37,99,235,0.04)')
                      : 'transparent',
                    borderBottom: `1px solid ${borderLight}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 8 * s,
                      fontWeight: 500,
                      color: isPending ? textMuted : titleCol,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap' as const,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {entry.name}
                  </span>
                  <span
                    style={{
                      fontSize: 7.5 * s,
                      fontWeight: 600,
                      color: isReplied ? textFilled : isPending ? textMuted : textDim,
                      letterSpacing: 0.5 * s,
                      flexShrink: 0,
                      whiteSpace: 'nowrap' as const,
                    }}
                  >
                    {entry.status}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MultichannelOutreachGraphic({
  data,
  width,
  height,
}: {
  data: MultichannelOutreachData;
  width: number;
  height: number;
}) {
  const s = Math.min(width / 1200, height / 630);

  const isDark = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  };
  const bg = data.backgroundColor || '#F8F7F4';
  const dark = isDark(bg);
  const warning = data.warningColor || '#2563EB';
  const borderBase = data.borderColor || '#E5E5EA';
  const borderCol = borderBase;
  const borderLight = adjustBrightness(borderBase, -8);
  const textFilled = data.filledColor || '#2563EB';
  const textMuted = data.labelColor || '#8A8A9A';
  const textDim = adjustBrightness(textMuted, -18);
  const textLabel = adjustBrightness(textMuted, -34);
  const emptyCol = data.emptyColor || '#D4D4D8';
  const titleCol = data.textColor || '#1A1A2E';

  // Build connection lines between same-day entries across channels
  // We match entries by index within same day steps
  const connectionDays: string[] = [];
  const leftStepMap: Record<string, number> = {};
  const rightStepMap: Record<string, number> = {};
  data.leftChannel.steps.forEach((step, i) => {
    leftStepMap[step.day] = i;
    if (!connectionDays.includes(step.day)) connectionDays.push(step.day);
  });
  data.rightChannel.steps.forEach((step, i) => {
    rightStepMap[step.day] = i;
    if (!connectionDays.includes(step.day)) connectionDays.push(step.day);
  });

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
          <filter id="mc-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="overlay" />
          </filter>
          <linearGradient id="mc-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={bg} stopOpacity="0" />
            <stop offset="70%" stopColor={bg} stopOpacity="0" />
            <stop offset="100%" stopColor={bg} stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <rect width={width} height={height} opacity="0.02" filter="url(#mc-noise)" />
        {/* Horizontal scanlines */}
        {Array.from({ length: Math.floor(height / (4 * s)) }).map((_, i) => (
          <rect
            key={i}
            x={0}
            y={i * 4 * s}
            width={width}
            height={1 * s}
            fill={dark ? '#ffffff' : '#000000'}
            opacity={dark ? 0.008 : 0.012}
          />
        ))}
        {/* Bottom fade */}
        <rect width={width} height={height} fill="url(#mc-fade)" />
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
        }}
      >
        {/* Header — identical structure to RawDataGraphic */}
        <div
          style={{
            padding: `${28 * s}px ${40 * s}px ${16 * s}px`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10 * s,
                marginBottom: 6 * s,
              }}
            >
              <span
                style={{
                  fontSize: 8.5 * s,
                  fontWeight: 600,
                  color: textDim,
                  letterSpacing: 2 * s,
                  textTransform: 'uppercase',
                }}
              >
                {data.sourceLabel}
              </span>
              <span
                style={{
                  width: 6 * s,
                  height: 6 * s,
                  borderRadius: '50%',
                  background: warning,
                  opacity: 0.5,
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontSize: 8 * s,
                  color: warning,
                  opacity: 0.4,
                  letterSpacing: 1 * s,
                  textTransform: 'uppercase',
                }}
              >
                {data.badgeText}
              </span>
            </div>
            <h1
              style={{
                fontFamily: DISPLAY,
                fontSize: 32 * s,
                fontWeight: 800,
                color: titleCol,
                lineHeight: 1.1,
                letterSpacing: -1 * s,
                margin: 0,
              }}
            >
              {data.title}
            </h1>
            <p
              style={{
                fontSize: 11 * s,
                color: textMuted,
                marginTop: 5 * s,
                fontFamily: DISPLAY,
                fontWeight: 500,
                fontStyle: 'italic',
              }}
            >
              {data.subtitle}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 * s, marginTop: 4 * s }}>
            <div style={{ textAlign: 'right' as const }}>
              <div style={{ fontSize: 22 * s, fontWeight: 700, color: textFilled, fontFamily: DISPLAY }}>{data.counterValue}</div>
              <div style={{ fontSize: 7.5 * s, color: textDim, letterSpacing: 1.5 * s, textTransform: 'uppercase' as const }}>{data.counterLabel}</div>
            </div>
            <img
              src={LOGO_URL}
              alt="CegTec"
              style={{ height: 18 * s, opacity: 0.85, ...logoFilter(bg) }}
            />
          </div>
        </div>

        {/* Two columns with connection lines */}
        <div
          style={{
            margin: `0 ${40 * s}px`,
            flex: 1,
            minHeight: 0,
            display: 'flex',
            gap: 16 * s,
            position: 'relative',
          }}
        >
          {/* Dotted connection lines overlay */}
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            {/* Draw horizontal dotted lines at approximate positions linking same-day entries */}
            {(() => {
              const lines: { y: number }[] = [];
              // Approximate vertical positions for each day's entries
              const channelHeaderH = 30 * s;
              const dayHeaderH = 18 * s;
              const entryH = 18 * s;
              const dayGap = 8 * s;
              let yOffset = channelHeaderH + 6 * s;

              connectionDays.forEach((day) => {
                const leftIdx = leftStepMap[day];
                const rightIdx = rightStepMap[day];
                if (leftIdx === undefined || rightIdx === undefined) {
                  // Still advance offset for this day
                  const maxEntries = Math.max(
                    leftIdx !== undefined ? data.leftChannel.steps[leftIdx].entries.length : 0,
                    rightIdx !== undefined ? data.rightChannel.steps[rightIdx].entries.length : 0,
                  );
                  yOffset += dayHeaderH + maxEntries * entryH + dayGap;
                  return;
                }

                const leftStep = data.leftChannel.steps[leftIdx];
                const rightStep = data.rightChannel.steps[rightIdx];
                const minEntries = Math.min(leftStep.entries.length, rightStep.entries.length);

                for (let ei = 0; ei < minEntries; ei++) {
                  const lineY = yOffset + dayHeaderH + ei * entryH + entryH / 2;
                  lines.push({ y: lineY });
                }

                const maxEntries = Math.max(leftStep.entries.length, rightStep.entries.length);
                yOffset += dayHeaderH + maxEntries * entryH + dayGap;
              });

              return lines.map((line, li) => (
                <line
                  key={li}
                  x1="48%"
                  y1={line.y}
                  x2="52%"
                  y2={line.y}
                  stroke={textFilled}
                  strokeWidth={1.5 * s}
                  strokeDasharray={`${3 * s} ${3 * s}`}
                  opacity={0.35}
                />
              ));
            })()}
          </svg>

          <ChannelColumnView
            channel={data.leftChannel}
            s={s}
            borderCol={borderCol}
            borderLight={borderLight}
            textFilled={textFilled}
            textMuted={textMuted}
            textDim={textDim}
            textLabel={textLabel}
            titleCol={titleCol}
            dark={dark}
          />
          <ChannelColumnView
            channel={data.rightChannel}
            s={s}
            borderCol={borderCol}
            borderLight={borderLight}
            textFilled={textFilled}
            textMuted={textMuted}
            textDim={textDim}
            textLabel={textLabel}
            titleCol={titleCol}
            dark={dark}
          />
        </div>

        {/* Footer — identical structure to RawDataGraphic */}
        <div
          style={{
            padding: `${12 * s}px ${40 * s}px ${20 * s}px`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 * s }}>
            {data.footerStats.map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 * s }}>
                <div
                  style={{
                    width: 6 * s,
                    height: 6 * s,
                    borderRadius: '50%',
                    background: textFilled,
                    opacity: 0.5,
                  }}
                />
                <span style={{ fontSize: 7.5 * s, color: textDim, letterSpacing: 0.5 * s }}>
                  {item.label} <span style={{ color: titleCol, fontWeight: 600 }}>{item.value}</span>
                </span>
              </div>
            ))}
          </div>
          <span
            style={{
              fontSize: 8 * s,
              color: textFilled,
              letterSpacing: 1 * s,
              opacity: 0.6,
            }}
          >
            {data.footerLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
