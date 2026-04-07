export interface RevenueSystemsData {
  cards: {
    system: string;
    headline: string;
    tag: string;
    tagFilled: boolean;
    description: string;
    dataLine: string;
  }[];
  footer: string;
  backgroundColor?: string;
  accentColor?: string;
  textColor?: string;
  labelColor?: string;
  cardColor?: string;
  cardBorderColor?: string;
}

export const defaultRevenueSystemsData: RevenueSystemsData = {
  cards: [
    {
      system: 'SYSTEM 01',
      headline: 'AI Search Visibility',
      tag: 'Self-Service',
      tagFilled: false,
      description: 'The Invisible Moat',
      dataLine: '4-8 Artikel/Monat · Automatisiert',
    },
    {
      system: 'SYSTEM 02',
      headline: 'LinkedIn Authority Engine',
      tag: 'Self-Service',
      tagFilled: false,
      description: 'The Trust Builder',
      dataLine: '2-4 Posts/Woche · Ready-to-Publish',
    },
    {
      system: 'SYSTEM 03',
      headline: 'Precision Outreach',
      tag: 'Managed Service',
      tagFilled: true,
      description: 'The Demand Capture',
      dataLine: '50+ Opportunities · €89k Pipeline',
    },
  ],
  footer: 'Drei Systeme. Eine Revenue-Architektur.',
};

function getColors(data: RevenueSystemsData) {
  const accent = data.accentColor || '#2563EB';
  const bg = data.backgroundColor || '#FAFAFA';
  // Detect if bg is dark
  const r = parseInt(bg.slice(1, 3), 16);
  const g = parseInt(bg.slice(3, 5), 16);
  const b = parseInt(bg.slice(5, 7), 16);
  const isDark = (r * 299 + g * 587 + b * 114) / 1000 < 128;
  return {
    bg,
    card: data.cardColor || (isDark ? '#1a1a2e' : '#FFFFFF'),
    border: data.cardBorderColor || (isDark ? '#2a2a3e' : '#E5E5E5'),
    accent,
    headline: data.textColor || (isDark ? '#f0f0f5' : '#0A0A0A'),
    label: data.labelColor || (isDark ? '#9999aa' : '#71717A'),
    line: isDark ? '#3a3a4e' : '#D4D4D8',
  };
}

import { FONTS } from '../../utils/cegtecTheme';

const MONO = FONTS.mono;

export function RevenueSystemsGraphic({
  data,
  width,
  height,
}: {
  data: RevenueSystemsData;
  width: number;
  height: number;
}) {
  const COLORS = getColors(data);
  const s = Math.min(width / 1200, height / 630);
  const cardCount = data.cards.length;

  const cardGap = 24 * s;
  const sidePad = 56 * s;
  const totalCardsW = width - sidePad * 2 - cardGap * (cardCount - 1);
  const cardW = totalCardsW / cardCount;
  const cardRadius = 10 * s;

  // Cards are auto-height, centered vertically in the frame
  // We estimate card content height for SVG connection line placement
  const estimatedCardH = 220 * s;
  const cardTopY = (height - estimatedCardH - 30 * s) / 2;
  const connY = cardTopY + estimatedCardH / 2;
  const knotR = 4 * s;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        background: COLORS.bg,
        fontFamily: FONTS.display,
      }}
    >
      {/* SVG layer for connection lines + knots */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {data.cards.slice(1).map((_, i) => {
          const x1 = sidePad + cardW * (i + 1) + cardGap * i;
          const x2 = x1 + cardGap;
          return (
            <g key={`conn-${i}`}>
              <line
                x1={x1} y1={connY} x2={x2} y2={connY}
                stroke={COLORS.line}
                strokeWidth={1.5 * s}
                strokeDasharray={`${5 * s} ${3 * s}`}
              />
              <circle cx={x1} cy={connY} r={knotR} fill={COLORS.accent} />
              <circle cx={x2} cy={connY} r={knotR} fill={COLORS.accent} />
            </g>
          );
        })}
      </svg>

      {/* Centered content wrapper */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `0 ${sidePad}px`,
          gap: 28 * s,
        }}
      >
        {/* Cards row */}
        <div style={{ display: 'flex', gap: cardGap, width: '100%' }}>
          {data.cards.map((card, i) => {
            const hl = card.tagFilled;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: hl ? COLORS.accent : COLORS.card,
                  border: `1px solid ${hl ? COLORS.accent : COLORS.border}`,
                  borderRadius: cardRadius,
                  padding: `${22 * s}px ${24 * s}px ${20 * s}px`,
                  boxShadow: hl
                    ? '0 4px 20px rgba(37,99,235,0.18)'
                    : 'none',
                }}
              >
                {/* System number */}
                <div style={{
                  fontFamily: MONO,
                  fontSize: 10.5 * s,
                  fontWeight: 500,
                  color: hl ? 'rgba(255,255,255,0.45)' : COLORS.label,
                  letterSpacing: 1.5 * s,
                  marginBottom: 10 * s,
                }}>
                  {card.system}
                </div>

                {/* Headline */}
                <div style={{
                  fontSize: 20 * s,
                  fontWeight: 700,
                  color: hl ? '#fff' : COLORS.headline,
                  lineHeight: 1.2,
                  marginBottom: 12 * s,
                  letterSpacing: -0.3 * s,
                }}>
                  {card.headline}
                </div>

                {/* Tag pill */}
                <span style={{
                  display: 'inline-block',
                  padding: `${3.5 * s}px ${11 * s}px`,
                  borderRadius: 100,
                  fontSize: 10.5 * s,
                  fontWeight: 600,
                  marginBottom: 14 * s,
                  ...(hl
                    ? { background: 'rgba(255,255,255,0.18)', color: '#fff', border: `1.5px solid rgba(255,255,255,0.25)` }
                    : { background: 'transparent', color: COLORS.accent, border: `1.5px solid ${COLORS.accent}` }),
                }}>
                  {card.tag}
                </span>

                {/* Separator */}
                <div style={{
                  width: 28 * s, height: 1,
                  background: hl ? 'rgba(255,255,255,0.18)' : COLORS.border,
                  margin: `${10 * s}px 0`,
                }} />

                {/* Description */}
                <div style={{
                  fontSize: 13.5 * s,
                  fontWeight: 500,
                  color: hl ? 'rgba(255,255,255,0.8)' : COLORS.label,
                  fontStyle: 'italic',
                  marginBottom: 6 * s,
                }}>
                  {card.description}
                </div>

                {/* Data line */}
                <div style={{
                  fontFamily: MONO,
                  fontSize: 10 * s,
                  color: hl ? 'rgba(255,255,255,0.45)' : COLORS.label,
                  opacity: hl ? 1 : 0.65,
                  letterSpacing: 0.2 * s,
                }}>
                  {card.dataLine}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          fontSize: 14 * s,
          fontWeight: 500,
          color: COLORS.label,
          letterSpacing: 0.3 * s,
        }}>
          {data.footer}
        </div>
      </div>
    </div>
  );
}
