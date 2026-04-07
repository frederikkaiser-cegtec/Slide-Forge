import { LOGO_URL } from '../../utils/assets';
import { logoFilter, adjustBrightness, FONTS } from '../../utils/cegtecTheme';

export interface VariableTag {
  key: string;
  value: string;
}

export interface MessageCard {
  to: string;
  subject: string;
  variables: VariableTag[];
  preview: string;
  status: string;
}

export interface PersonalizedOutreachData {
  title: string;
  subtitle: string;
  sourceLabel: string;
  badgeText: string;
  messageCount: string;
  counterLabel: string;
  footerLabel: string;
  footerStats: { label: string; value: string }[];
  messages: MessageCard[];
  backgroundColor?: string;
  textColor?: string;
  labelColor?: string;
  filledColor?: string;
  emptyColor?: string;
  borderColor?: string;
  warningColor?: string;
}

export const defaultPersonalizedOutreachData: PersonalizedOutreachData = {
  title: '1 Lead. 1 Message. 0 Templates.',
  subtitle: 'Jede Nachricht individuell. Keine Massenmails.',
  sourceLabel: 'PERSONALIZATION ENGINE',
  badgeText: 'GENERATED \u2022 UNIQUE',
  messageCount: '109',
  counterLabel: 'MESSAGES READY',
  footerLabel: 'PERSONALIZATION COMPLETE \u2713 109/109',
  footerStats: [
    { label: 'Messages Generated', value: '109' },
    { label: 'Unique', value: '109' },
    { label: 'Templates', value: '0' },
    { label: 'Avg. Personalization Score', value: '94%' },
  ],
  backgroundColor: '#F8F7F4',
  textColor: '#1A1A2E',
  labelColor: '#8A8A9A',
  filledColor: '#2563EB',
  emptyColor: '#D4D4D8',
  borderColor: '#E5E5EA',
  warningColor: '#2563EB',
  messages: [
    {
      to: 'm.breitenbach@nexavion.de',
      subject: 'Sales-Pipeline bei Nexavion, Markus?',
      variables: [
        { key: '{{firmenname}}', value: 'Nexavion' },
        { key: '{{trigger}}', value: '3 neue Sales-Stellen' },
        { key: '{{pain}}', value: 'Neukundengewinnung' },
        { key: '{{branche}}', value: 'B2B SaaS' },
      ],
      preview: 'Hi Markus, habe gesehen, dass Nexavion gerade 3 neue Sales-Stellen ausgeschrieben hat. Wenn ihr bei der Neukundengewinnung skaliert \u2013 wir generieren qualifizierte Termine f\u00fcr B2B-SaaS-Unternehmen im DACH-Raum. Kurzer Austausch n\u00e4chste Woche?',
      status: '\u2705 READY TO SEND',
    },
    {
      to: 'p.richter@greyline-tech.de',
      subject: 'Cybersecurity-Vertrieb skalieren, Patrick?',
      variables: [
        { key: '{{firmenname}}', value: 'Greyline Technologies' },
        { key: '{{trigger}}', value: 'Series B Funding' },
        { key: '{{pain}}', value: 'Pipeline-Aufbau' },
        { key: '{{branche}}', value: 'Cybersecurity' },
      ],
      preview: 'Hi Patrick, Gl\u00fcckwunsch zur Series B. Wenn Greyline jetzt den Vertrieb im DACH-Raum hochf\u00e4hrt \u2013 wir bauen qualifizierte Pipelines f\u00fcr Cybersecurity-Unternehmen auf. 15 Min n\u00e4chste Woche?',
      status: '\u2705 READY TO SEND',
    },
    {
      to: 'c.mayer@pronau-sys.de',
      subject: 'ERP-Neukunden im Mittelstand, Christian?',
      variables: [
        { key: '{{firmenname}}', value: 'Pronau Systems' },
        { key: '{{trigger}}', value: 'Neues Partnermodell' },
        { key: '{{pain}}', value: 'Reseller-Akquise' },
        { key: '{{branche}}', value: 'ERP Software' },
      ],
      preview: 'Hi Christian, habe gesehen, dass Pronau ein neues Partnermodell gelauncht hat. Wir helfen ERP-Anbietern dabei, systematisch neue Reseller im DACH-Raum zu gewinnen. Lohnt sich ein kurzer Call?',
      status: '\u2705 READY TO SEND',
    },
  ],
};

const MONO = FONTS.mono;
const DISPLAY = FONTS.display;

function renderPreviewWithHighlights(
  preview: string,
  variables: VariableTag[],
  filledColor: string,
  fontSize: number,
  textColor: string,
) {
  // Find all variable values in the preview text and highlight them
  const parts: { text: string; highlight: boolean }[] = [];
  let remaining = preview;

  // Collect all match positions
  const values = variables.map((v) => v.value).filter((v) => v.length > 0);

  if (values.length === 0) {
    return <span style={{ color: textColor }}>{preview}</span>;
  }

  // Build a regex that matches any variable value
  const escaped = values.map((v) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'g');

  let lastIndex = 0;
  const matches: { start: number; end: number; text: string }[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(preview)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length, text: match[0] });
  }

  if (matches.length === 0) {
    return <span style={{ color: textColor }}>{preview}</span>;
  }

  for (const m of matches) {
    if (m.start > lastIndex) {
      parts.push({ text: preview.slice(lastIndex, m.start), highlight: false });
    }
    parts.push({ text: m.text, highlight: true });
    lastIndex = m.end;
  }
  if (lastIndex < preview.length) {
    parts.push({ text: preview.slice(lastIndex), highlight: false });
  }

  return (
    <span>
      {parts.map((p, i) =>
        p.highlight ? (
          <span key={i} style={{ color: filledColor, fontWeight: 600 }}>{p.text}</span>
        ) : (
          <span key={i} style={{ color: textColor }}>{p.text}</span>
        ),
      )}
    </span>
  );
}

export function PersonalizedOutreachGraphic({
  data,
  width,
  height,
}: {
  data: PersonalizedOutreachData;
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
          <filter id="po-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="overlay" />
          </filter>
          <linearGradient id="po-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={bg} stopOpacity="0" />
            <stop offset="70%" stopColor={bg} stopOpacity="0" />
            <stop offset="100%" stopColor={bg} stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <rect width={width} height={height} opacity="0.02" filter="url(#po-noise)" />
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
        <rect width={width} height={height} fill="url(#po-fade)" />
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
              <div style={{ fontSize: 22 * s, fontWeight: 700, color: textFilled, fontFamily: DISPLAY }}>{data.messageCount}</div>
              <div style={{ fontSize: 7.5 * s, color: textDim, letterSpacing: 1.5 * s, textTransform: 'uppercase' as const }}>{data.counterLabel}</div>
            </div>
            <img
              src={LOGO_URL}
              alt="CegTec"
              style={{ height: 18 * s, opacity: 0.85, ...logoFilter(bg) }}
            />
          </div>
        </div>

        {/* Message Cards */}
        <div
          style={{
            margin: `0 ${40 * s}px`,
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 8 * s,
          }}
        >
          {data.messages.map((msg, i) => (
            <div
              key={i}
              style={{
                border: `1px solid ${borderCol}`,
                borderRadius: 6 * s,
                padding: `${10 * s}px ${14 * s}px`,
                background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
                flex: 1,
                minHeight: 0,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 5 * s,
                overflow: 'hidden',
              }}
            >
              {/* TO + SUBJECT row */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 * s }}>
                <span style={{ fontSize: 7 * s, fontWeight: 600, color: textLabel, letterSpacing: 1.5 * s, textTransform: 'uppercase' as const, flexShrink: 0 }}>TO:</span>
                <span style={{ fontSize: 9 * s, fontWeight: 500, color: textFilled, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, minWidth: 0 }}>{msg.to}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 * s }}>
                <span style={{ fontSize: 7 * s, fontWeight: 600, color: textLabel, letterSpacing: 1.5 * s, textTransform: 'uppercase' as const, flexShrink: 0 }}>SUBJ:</span>
                <span style={{ fontSize: 9 * s, fontWeight: 600, color: titleCol, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, minWidth: 0 }}>{msg.subject}</span>
              </div>

              {/* Variables */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 * s, marginTop: 2 * s }}>
                {msg.variables.map((v, vi) => (
                  <span
                    key={vi}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3 * s,
                      fontSize: 7 * s,
                      background: dark ? 'rgba(37,99,235,0.08)' : 'rgba(37,99,235,0.06)',
                      border: `1px solid ${adjustBrightness(textFilled, 80)}`,
                      borderRadius: 3 * s,
                      padding: `${1.5 * s}px ${5 * s}px`,
                    }}
                  >
                    <span style={{ color: textFilled, fontWeight: 600 }}>{v.key}</span>
                    <span style={{ color: textLabel }}>{'\u2192'}</span>
                    <span style={{ color: titleCol, fontWeight: 500 }}>{v.value}</span>
                  </span>
                ))}
              </div>

              {/* Preview text */}
              <div
                style={{
                  fontSize: 8.5 * s,
                  lineHeight: 1.55,
                  color: textDim,
                  marginTop: 2 * s,
                  flex: 1,
                  overflow: 'hidden',
                }}
              >
                <span style={{ fontSize: 7 * s, fontWeight: 600, color: textLabel, letterSpacing: 1 * s, marginRight: 4 * s }}>PREVIEW:</span>
                {'\u201C'}
                {renderPreviewWithHighlights(msg.preview, msg.variables, textFilled, 8.5 * s, textDim)}
                {'\u201D'}
              </div>

              {/* Status */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 'auto' }}>
                <span
                  style={{
                    fontSize: 7.5 * s,
                    fontWeight: 600,
                    color: textFilled,
                    letterSpacing: 1 * s,
                  }}
                >
                  {msg.status}
                </span>
              </div>
            </div>
          ))}
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
