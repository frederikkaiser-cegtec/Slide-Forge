import { LOGO_URL } from '../../utils/assets';
import {
  FONTS,
  isDark, hexToRgb, logoFilter,
} from '../../utils/cegtecTheme';

const BASE = import.meta.env.BASE_URL;

// ── Data Interface ──────────────────────────────────────────────

export interface QuoteCardData {
  quote: string;
  personName: string;
  personTitle: string;
  photoUrl: string;
  ctaText: string;
  topLabel: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  labelColor?: string;
}

export const defaultQuoteCardData: QuoteCardData = {
  quote: 'In 20 Minuten zeig\nich dir, wie wir\nqualifizierte Termine\naufbauen.',
  personName: 'Luca Ceglie',
  personTitle: 'Geschäftsführer, CegTec',
  photoUrl: `${BASE}luca-ceglie.png`,
  ctaText: '20 Min Live-Demo buchen',
  topLabel: 'Mit echten Zahlen.',
  backgroundColor: '#F2EDE8',
  textColor: '#1A1A2E',
  accentColor: '#4f46e5',
  labelColor: '#8A8A9A',
};

// ── Component ───────────────────────────────────────────────────

export function QuoteCardGraphic({
  data,
  width,
  height,
}: {
  data: QuoteCardData;
  width: number;
  height: number;
}) {
  const s = Math.min(width / 1080, height / 1080);

  const bg = data.backgroundColor || '#F2EDE8';
  const titleCol = data.textColor || '#1A1A2E';
  const accent = data.accentColor || '#4f46e5';
  const labelCol = data.labelColor || '#8A8A9A';
  const [ar, ag, ab] = hexToRgb(accent);

  const quoteLines = data.quote.split('\n');

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

      {/* ── Layer 0: Subtle texture ── */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
      >
        <defs>
          <filter id="qc-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="overlay" />
          </filter>
        </defs>
        <rect width={width} height={height} opacity="0.025" filter="url(#qc-noise)" />
      </svg>

      {/* ── Layer 1: Giant decorative quotation mark ── */}
      <div style={{
        position: 'absolute',
        zIndex: 1,
        top: 60 * s,
        right: 40 * s,
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: 680 * s,
        fontWeight: 700,
        lineHeight: 0.65,
        color: accent,
        opacity: 0.045,
        pointerEvents: 'none',
        userSelect: 'none' as const,
      }}>
        {'\u201C'}
      </div>

      {/* ── Layer 2: Photo — centered, dominant ── */}
      <div style={{
        position: 'absolute',
        zIndex: 2,
        bottom: 0,
        left: '50%',
        transform: 'translateX(-42%)',
        width: 700 * s,
        height: 780 * s,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}>
        <img
          src={data.photoUrl}
          alt={data.personName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'bottom center',
          }}
        />
      </div>


      {/* ── Layer 4: All text content ── */}
      <div style={{
        position: 'relative', zIndex: 4,
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
      }}>

        {/* ── Top block: logo + quote ── */}
        <div style={{ padding: `${40 * s}px ${52 * s}px 0` }}>

          {/* Logo row */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 32 * s,
          }}>
            <img src={LOGO_URL} alt="CegTec" style={{ height: 46 * s, opacity: 0.9, ...logoFilter(bg) }} />
            <span style={{
              fontFamily: FONTS.mono,
              fontSize: 10 * s,
              fontWeight: 600,
              letterSpacing: 2.5 * s,
              color: labelCol,
              textTransform: 'uppercase' as const,
              opacity: 0.6,
            }}>
              GTM Engineering Partner
            </span>
          </div>

          {/* Quote */}
          <h1 style={{
            fontFamily: FONTS.display,
            fontSize: 72 * s,
            fontWeight: 800,
            color: titleCol,
            lineHeight: 1.04,
            letterSpacing: -2.5 * s,
            margin: 0,
            marginBottom: 16 * s,
            whiteSpace: 'pre-line' as const,
          }}>
            {quoteLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < quoteLines.length - 1 && <br />}
              </span>
            ))}
          </h1>

          {/* Accent subline */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10 * s,
          }}>
            <div style={{
              width: 3 * s, height: 20 * s, borderRadius: 2 * s,
              background: accent,
            }} />
            <span style={{
              fontFamily: FONTS.display,
              fontSize: 26 * s,
              fontWeight: 700,
              color: accent,
              letterSpacing: -0.3 * s,
            }}>
              {data.topLabel}
            </span>
          </div>
        </div>

        {/* ── Bottom block: name + CTA ── */}
        <div style={{
          padding: `0 ${52 * s}px ${40 * s}px`,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}>

          {/* Person info — left */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 2 * s,
          }}>
            <div style={{
              fontFamily: FONTS.display,
              fontSize: 28 * s,
              fontWeight: 700,
              color: titleCol,
              letterSpacing: -0.3 * s,
            }}>
              {data.personName}
            </div>
            <div style={{
              fontFamily: FONTS.mono,
              fontSize: 15 * s,
              fontWeight: 500,
              color: labelCol,
              letterSpacing: 0.5 * s,
            }}>
              {data.personTitle}
            </div>
          </div>

          {/* Brand URL — right */}
          <span style={{
            fontFamily: FONTS.mono,
            fontSize: 12 * s,
            fontWeight: 600,
            color: titleCol,
            letterSpacing: 1.5 * s,
          }}>
            cegtec.net
          </span>
        </div>
      </div>
    </div>
  );
}
