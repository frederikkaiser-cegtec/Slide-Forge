import { LOGO_URL } from '../../utils/assets';
import { logoFilter, adjustBrightness, FONTS } from '../../utils/cegtecTheme';

export interface RawDataEntry {
  company: string;
  domain: string;
  country: string;
  phone: string;
  email: string;
  revenue: string;
  employees: string;
  industry: string;
}

export interface RawDataData {
  title: string;
  subtitle: string;
  entries: RawDataEntry[];
  totalCount: string;
  sourceLabel: string;
  backgroundColor?: string;
  textColor?: string;
  labelColor?: string;
  filledColor?: string;
  emptyColor?: string;
  borderColor?: string;
  warningColor?: string;
}

export const defaultRawDataData: RawDataData = {
  title: '4.200+ Raw Companies',
  subtitle: 'Nur Name und Domain. Sonst nichts.',
  totalCount: '4.217',
  sourceLabel: 'CSV Import \u2014 unverified',
  backgroundColor: '#F8F7F4',
  textColor: '#1A1A2E',
  labelColor: '#8A8A9A',
  filledColor: '#2563EB',
  emptyColor: '#D4D4D8',
  borderColor: '#E5E5EA',
  warningColor: '#1A3FD4',
  entries: [
    { company: 'Nexavion GmbH', domain: 'nexavion.de', country: 'DE', phone: '\u2013', email: '\u2013', revenue: '\u2013', employees: '\u2013', industry: '\u2013' },
    { company: 'Corebridge Systems AG', domain: 'corebridge.ch', country: 'CH', phone: '\u2013', email: '\u2013', revenue: '\u2013', employees: '\u2013', industry: '\u2013' },
    { company: 'Veltora Consulting GmbH', domain: 'veltora.at', country: 'AT', phone: '', email: '', revenue: '\u2013', employees: '', industry: '' },
    { company: 'Greyline Technologies AG', domain: 'greyline-tech.de', country: 'DE', phone: '\u2013', email: '', revenue: '', employees: '\u2013', industry: '\u2013' },
    { company: 'Halbfeld Digital GmbH', domain: 'halbfeld.de', country: 'DE', phone: '', email: '\u2013', revenue: '\u2013', employees: '', industry: '' },
    { company: 'Probau Systeme GmbH', domain: 'probau-sys.de', country: 'DE', phone: '', email: '', revenue: '', employees: '', industry: '' },
    { company: 'Alpenvolt Energy AG', domain: 'alpenvolt.ch', country: 'CH', phone: '\u2013', email: '', revenue: '\u2013', employees: '', industry: '\u2013' },
    { company: 'Kreiswerk Solutions', domain: 'kreiswerk.de', country: 'DE', phone: '', email: '', revenue: '', employees: '', industry: '' },
  ],
};

const MONO = FONTS.mono;
const DISPLAY = FONTS.display;

const COLUMNS = [
  { key: 'company', label: 'Company', width: 0.22 },
  { key: 'domain', label: 'Domain', width: 0.16 },
  { key: 'country', label: 'Country', width: 0.07 },
  { key: 'phone', label: 'Phone', width: 0.12 },
  { key: 'email', label: 'Email', width: 0.15 },
  { key: 'revenue', label: 'Revenue', width: 0.10 },
  { key: 'employees', label: 'Employees', width: 0.09 },
  { key: 'industry', label: 'Industry', width: 0.09 },
] as const;

export function RawDataGraphic({
  data,
  width,
  height,
}: {
  data: RawDataData;
  width: number;
  height: number;
}) {
  const s = Math.min(width / 1200, height / 630);
  const tableLeft = 40 * s;
  const tableRight = 40 * s;
  const indexW = 36 * s;
  const tableW = width - tableLeft - tableRight - indexW;
  const rowH = 32 * s;
  const headerH = 28 * s;

  const isDark = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  };
  const bg = data.backgroundColor || '#F8F7F4';
  const dark = isDark(bg);
  const warning = data.warningColor || '#1A3FD4';
  const borderBase = data.borderColor || '#E5E5EA';
  const borderCol = borderBase;
  const borderLight = adjustBrightness(borderBase, -8);
  const textFilled = data.filledColor || '#2563EB';
  const textMuted = data.labelColor || '#8A8A9A';
  const textDim = adjustBrightness(textMuted, -18);
  const textLabel = adjustBrightness(textMuted, -34);
  const emptyCol = data.emptyColor || '#D4D4D8';
  const titleCol = data.textColor || '#1A1A2E';

  const topArea = 130 * s;
  const bottomArea = 60 * s;
  const availableH = height - topArea - bottomArea;
  const maxRows = Math.min(data.entries.length, Math.floor(availableH / rowH));

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
          <filter id="rd-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="overlay" />
          </filter>
          <linearGradient id="rd-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={bg} stopOpacity="0" />
            <stop offset="70%" stopColor={bg} stopOpacity="0" />
            <stop offset="100%" stopColor={bg} stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <rect width={width} height={height} opacity="0.02" filter="url(#rd-noise)" />
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
        <rect width={width} height={height} fill="url(#rd-fade)" />
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
        {/* Header */}
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
                UNPROCESSED
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
              <div style={{ fontSize: 22 * s, fontWeight: 700, color: textMuted, fontFamily: DISPLAY }}>{data.totalCount}</div>
              <div style={{ fontSize: 7.5 * s, color: textDim, letterSpacing: 1.5 * s, textTransform: 'uppercase' as const }}>ROWS TOTAL</div>
            </div>
            <img
              src={LOGO_URL}
              alt="CegTec"
              style={{ height: 18 * s, opacity: 0.85, ...logoFilter(bg) }}
            />
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            margin: `0 ${tableRight}px 0 ${tableLeft}px`,
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: 'flex',
              borderBottom: `1px solid ${borderCol}`,
              height: headerH,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 36 * s,
                flexShrink: 0,
                fontSize: 7.5 * s,
                color: textLabel,
                letterSpacing: 1 * s,
                textTransform: 'uppercase' as const,
              }}
            >
              #
            </div>
            {COLUMNS.map((col) => (
              <div
                key={col.key}
                style={{
                  width: tableW * col.width,
                  flexShrink: 0,
                  fontSize: 7.5 * s,
                  fontWeight: 600,
                  color: textLabel,
                  letterSpacing: 1.5 * s,
                  textTransform: 'uppercase' as const,
                }}
              >
                {col.label}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {data.entries.slice(0, maxRows).map((entry, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  height: rowH,
                  alignItems: 'center',
                  borderBottom: `1px solid ${borderLight}`,
                  background: isEven ? 'transparent' : (dark ? 'rgba(255,255,255,0.008)' : 'rgba(0,0,0,0.02)'),
                }}
              >
                <div
                  style={{
                    width: 36 * s,
                    flexShrink: 0,
                    fontSize: 8.5 * s,
                    color: textLabel,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {String(i + 1).padStart(3, '0')}
                </div>
                {COLUMNS.map((col) => {
                  const val = entry[col.key as keyof RawDataEntry];
                  const isEmpty = !val || val === '\u2013' || val === '';
                  const isFilled = col.key === 'company' || col.key === 'domain' || col.key === 'country';

                  return (
                    <div
                      key={col.key}
                      style={{
                        width: tableW * col.width,
                        flexShrink: 0,
                        fontSize: 9.5 * s,
                        fontWeight: isFilled && !isEmpty ? 500 : 400,
                        color: isEmpty ? emptyCol : (isFilled ? textFilled : textDim),
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap' as const,
                        paddingRight: 8 * s,
                      }}
                    >
                      {isEmpty ? (
                        <span style={{ color: emptyCol, fontSize: 10 * s }}>
                          {val === '\u2013' ? '\u2013' : '\u2014'}
                        </span>
                      ) : val}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Ghost rows — fading out */}
          {[0, 1, 2].map((gi) => (
            <div
              key={`ghost-${gi}`}
              style={{
                display: 'flex',
                height: rowH,
                alignItems: 'center',
                borderBottom: `1px solid ${borderLight}`,
                opacity: 0.4 - gi * 0.15,
              }}
            >
              <div style={{ width: 36 * s, flexShrink: 0, fontSize: 8.5 * s, color: textLabel }}>
                {String(maxRows + gi + 1).padStart(3, '0')}
              </div>
              {COLUMNS.map((col) => (
                <div
                  key={col.key}
                  style={{
                    width: tableW * col.width,
                    flexShrink: 0,
                    height: 8 * s,
                  }}
                >
                  <div
                    style={{
                      width: col.key === 'company' ? '75%' : col.key === 'domain' ? '60%' : '30%',
                      height: '100%',
                      background: borderLight,
                      borderRadius: 3 * s,
                      opacity: (col.key === 'company' || col.key === 'domain' || col.key === 'country') ? 0.6 : 0.2,
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer — enrichment status bars */}
        <div
          style={{
            padding: `${12 * s}px ${40 * s}px ${20 * s}px`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 * s }}>
            {[
              { label: 'Phone', pct: '0%' },
              { label: 'Email', pct: '0%' },
              { label: 'Revenue', pct: '0%' },
              { label: 'Industry', pct: '0%' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 * s }}>
                <div
                  style={{
                    width: 32 * s,
                    height: 3 * s,
                    background: borderCol,
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ width: '0%', height: '100%', background: '#EF4444', borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 7.5 * s, color: textDim, letterSpacing: 0.5 * s }}>
                  {item.label} {item.pct}
                </span>
              </div>
            ))}
          </div>
          <span
            style={{
              fontSize: 8 * s,
              color: textDim,
              letterSpacing: 1 * s,
              opacity: 0.5,
            }}
          >
            ENRICHMENT NEEDED \u2192
          </span>
        </div>
      </div>
    </div>
  );
}
