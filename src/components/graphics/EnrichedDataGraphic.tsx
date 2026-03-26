import { LOGO_URL } from '../../utils/assets';
import { logoFilter, adjustBrightness } from '../../utils/cegtecTheme';

export interface EnrichedDataEntry {
  company: string;
  domain: string;
  country: string;
  phone: string;
  email: string;
  revenue: string;
  employees: string;
  industry: string;
}

export interface EnrichedDataData {
  title: string;
  subtitle: string;
  entries: EnrichedDataEntry[];
  totalCount: string;
  sourceLabel: string;
  backgroundColor?: string;
  textColor?: string;
  labelColor?: string;
  filledColor?: string;
  emptyColor?: string;
  borderColor?: string;
  warningColor?: string;
  completionStats: { label: string; pct: number }[];
  completionLabel: string;
}

export const defaultEnrichedDataData: EnrichedDataData = {
  title: '4.200+ Enriched Companies',
  subtitle: 'Clay enriched. Jede Firma vollst\u00e4ndig kartiert.',
  totalCount: '4.217',
  sourceLabel: 'CLAY ENRICHMENT',
  backgroundColor: '#F8F7F4',
  textColor: '#1A1A2E',
  labelColor: '#8A8A9A',
  filledColor: '#2563EB',
  emptyColor: '#D4D4D8',
  borderColor: '#E5E5EA',
  warningColor: '#10B981',
  completionLabel: 'ENRICHMENT COMPLETE \u2713 4.217/4.217',
  completionStats: [
    { label: 'Phone', pct: 97 },
    { label: 'Email', pct: 94 },
    { label: 'Revenue', pct: 89 },
    { label: 'Industry', pct: 96 },
  ],
  entries: [
    { company: 'Nexavion GmbH', domain: 'nexavion.de', country: 'DE', phone: '+49 89 2414\u2026', email: 'm.breitenbach@nexavion.de \u2713', revenue: '\u20AC10\u201325M', employees: '85', industry: 'B2B SaaS' },
    { company: 'Corebridge Systems AG', domain: 'corebridge.ch', country: 'CH', phone: '+41 44 5120\u2026', email: 'j.wegner@corebridge.ch \u2713', revenue: '\u20AC5\u201310M', employees: '42', industry: 'IT Services' },
    { company: 'Veltora Consulting GmbH', domain: 'veltora.at', country: 'AT', phone: '+43 1 7681\u2026', email: 's.eder@veltora.at \u2713', revenue: '\u20AC2\u20135M', employees: '28', industry: 'Consulting' },
    { company: 'Greyline Technologies AG', domain: 'greyline-tech.de', country: 'DE', phone: '+49 30 9918\u2026', email: 'p.richter@greyline-tech.de \u2713', revenue: '\u20AC25\u201350M', employees: '210', industry: 'Cybersecurity' },
    { company: 'Halbfeld Digital GmbH', domain: 'halbfeld.de', country: 'DE', phone: '+49 40 3310\u2026', email: 'l.brandt@halbfeld.de \u2713', revenue: '\u20AC5\u201310M', employees: '55', industry: 'Marketing Tech' },
    { company: 'Pronau Systems GmbH', domain: 'pronau-sys.de', country: 'DE', phone: '+49 711 8820\u2026', email: 'c.mayer@pronau-sys.de \u2713', revenue: '\u20AC10\u201325M', employees: '120', industry: 'ERP Software' },
    { company: 'Alpenvolt Energy AG', domain: 'alpenvolt.ch', country: 'CH', phone: '+41 31 3390\u2026', email: 'r.huber@alpenvolt.ch \u2713', revenue: '\u20AC25\u201350M', employees: '180', industry: 'Cleantech' },
    { company: 'Kreiswerk Solutions', domain: 'kreiswerk.de', country: 'DE', phone: '+49 221 5570\u2026', email: 'd.fischer@kreiswerk.de \u2713', revenue: '\u20AC2\u20135M', employees: '31', industry: 'Cloud Infra' },
  ],
};

const MONO = "'JetBrains Mono', 'IBM Plex Mono', 'SF Mono', monospace";
const DISPLAY = "'Plus Jakarta Sans', 'DM Sans', 'Inter', system-ui, sans-serif";

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

export function EnrichedDataGraphic({
  data,
  width,
  height,
}: {
  data: EnrichedDataData;
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
  const warning = data.warningColor || '#10B981';
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
          <filter id="ed-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="overlay" />
          </filter>
          <linearGradient id="ed-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={bg} stopOpacity="0" />
            <stop offset="70%" stopColor={bg} stopOpacity="0" />
            <stop offset="100%" stopColor={bg} stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <rect width={width} height={height} opacity="0.02" filter="url(#ed-noise)" />
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
        <rect width={width} height={height} fill="url(#ed-fade)" />
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
                VERIFIED \u2022 ENRICHED
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
                  const val = entry[col.key as keyof EnrichedDataEntry];
                  const isEmpty = !val || val === '\u2013' || val === '';

                  return (
                    <div
                      key={col.key}
                      style={{
                        width: tableW * col.width,
                        flexShrink: 0,
                        fontSize: 9.5 * s,
                        fontWeight: isEmpty ? 400 : 500,
                        color: isEmpty ? emptyCol : textFilled,
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

        {/* Footer — completion stats */}
        <div
          style={{
            padding: `${12 * s}px ${40 * s}px ${20 * s}px`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 * s }}>
            {data.completionStats.map((item) => (
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
                  <div style={{ width: `${item.pct}%`, height: '100%', background: warning, borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 7.5 * s, color: textDim, letterSpacing: 0.5 * s }}>
                  {item.label} {item.pct}%
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
            {data.completionLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
