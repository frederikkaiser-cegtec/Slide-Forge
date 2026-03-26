import { LOGO_URL } from '../../utils/assets';
import { logoFilter } from '../../utils/cegtecTheme';

export interface QualifiedDataEntry {
  company: string;
  domain: string;
  employees: string;
  revenue: string;
  industry: string;
  icpScore: number;
  status: string;
}

export interface QualifiedDataData {
  title: string;
  subtitle: string;
  entries: QualifiedDataEntry[];
  totalCount: string;
  qualifiedCount: string;
  sourceLabel: string;
  footerLabel: string;
  footerStats: { label: string; value: string }[];
  backgroundColor?: string;
  textColor?: string;
  labelColor?: string;
  filledColor?: string;
  emptyColor?: string;
  borderColor?: string;
  warningColor?: string;
}

export const defaultQualifiedDataData: QualifiedDataData = {
  title: '4.200 \u2192 109 Qualified',
  subtitle: 'AI-Scoring. Nur wer zum ICP passt, geht weiter.',
  totalCount: '4.217',
  qualifiedCount: '109',
  sourceLabel: 'AI QUALIFICATION',
  footerLabel: 'SCORING COMPLETE \u2713 4.217/4.217',
  footerStats: [
    { label: 'Qualified', value: '109 (2.6%)' },
    { label: 'Disqualified', value: '4.091' },
    { label: 'Review', value: '17' },
  ],
  backgroundColor: '#F8F7F4',
  textColor: '#1A1A2E',
  labelColor: '#8A8A9A',
  filledColor: '#2563EB',
  emptyColor: '#D4D4D8',
  borderColor: '#E5E5EA',
  warningColor: '#2563EB',
  entries: [
    { company: 'Nexavion GmbH', domain: 'nexavion.de', employees: '85', revenue: '\u20AC10\u201325M', industry: 'B2B SaaS', icpScore: 91, status: '\u2705 QUALIFIED' },
    { company: 'Corebridge Systems AG', domain: 'corebridge.ch', employees: '42', revenue: '\u20AC5\u201310M', industry: 'IT Services', icpScore: 34, status: '\u274C ZU KLEIN' },
    { company: 'Veltora Consulting GmbH', domain: 'veltora.at', employees: '28', revenue: '\u20AC2\u20135M', industry: 'Consulting', icpScore: 28, status: '\u274C FALSCHE BRANCHE' },
    { company: 'Greyline Technologies AG', domain: 'greyline-tech.de', employees: '210', revenue: '\u20AC25\u201350M', industry: 'Cybersecurity', icpScore: 87, status: '\u2705 QUALIFIED' },
    { company: 'Halbfeld Digital GmbH', domain: 'halbfeld.de', employees: '55', revenue: '\u20AC5\u201310M', industry: 'Marketing Tech', icpScore: 72, status: '\u26A0\uFE0F REVIEW' },
    { company: 'Pronau Systems GmbH', domain: 'pronau-sys.de', employees: '120', revenue: '\u20AC10\u201325M', industry: 'ERP Software', icpScore: 83, status: '\u2705 QUALIFIED' },
    { company: 'Alpenvolt Energy AG', domain: 'alpenvolt.ch', employees: '180', revenue: '\u20AC25\u201350M', industry: 'Cleantech', icpScore: 19, status: '\u274C KEIN ENTSCHEIDER' },
    { company: 'Kreiswerk Solutions', domain: 'kreiswerk.de', employees: '31', revenue: '\u20AC2\u20135M', industry: 'Cloud Infra', icpScore: 44, status: '\u274C ZU KLEIN' },
  ],
};

function adjustBrightness(hex: string, amount: number): string {
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(1, 3), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(3, 5), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(5, 7), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

const MONO = "'JetBrains Mono', 'IBM Plex Mono', 'SF Mono', monospace";
const DISPLAY = "'Plus Jakarta Sans', 'DM Sans', 'Inter', system-ui, sans-serif";

const COLUMNS = [
  { key: 'company', label: 'Company', width: 0.22 },
  { key: 'domain', label: 'Domain', width: 0.16 },
  { key: 'employees', label: 'Employees', width: 0.09 },
  { key: 'revenue', label: 'Revenue', width: 0.10 },
  { key: 'industry', label: 'Industry', width: 0.13 },
  { key: 'icpScore', label: 'ICP Score', width: 0.10 },
  { key: 'status', label: 'Status', width: 0.20 },
] as const;

export function QualifiedDataGraphic({
  data,
  width,
  height,
}: {
  data: QualifiedDataData;
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

  const topArea = 130 * s;
  const bottomArea = 60 * s;
  const availableH = height - topArea - bottomArea;
  const maxRows = Math.min(data.entries.length, Math.floor(availableH / rowH));

  const getRowStatus = (entry: QualifiedDataEntry): 'qualified' | 'review' | 'disqualified' => {
    if (entry.status.includes('QUALIFIED')) return 'qualified';
    if (entry.status.includes('REVIEW')) return 'review';
    return 'disqualified';
  };

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
          <filter id="qd-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="overlay" />
          </filter>
          <linearGradient id="qd-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={bg} stopOpacity="0" />
            <stop offset="70%" stopColor={bg} stopOpacity="0" />
            <stop offset="100%" stopColor={bg} stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <rect width={width} height={height} opacity="0.02" filter="url(#qd-noise)" />
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
        <rect width={width} height={height} fill="url(#qd-fade)" />
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
                SCORED \u2022 FILTERED
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
              <div style={{ fontSize: 22 * s, fontWeight: 700, color: textMuted, fontFamily: DISPLAY }}>{data.qualifiedCount}</div>
              <div style={{ fontSize: 7.5 * s, color: textDim, letterSpacing: 1.5 * s, textTransform: 'uppercase' as const }}>QUALIFIED OF {data.totalCount}</div>
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
            const rowStatus = getRowStatus(entry);
            const isQualified = rowStatus === 'qualified';
            const isReview = rowStatus === 'review';
            const isDisqualified = rowStatus === 'disqualified';

            const rowBg = isQualified
              ? (isEven ? 'rgba(37,99,235,0.04)' : 'rgba(37,99,235,0.07)')
              : isReview
              ? (isEven ? 'rgba(245,158,11,0.04)' : 'rgba(245,158,11,0.07)')
              : (isEven ? 'transparent' : (dark ? 'rgba(255,255,255,0.008)' : 'rgba(0,0,0,0.02)'));

            const rowOpacity = isDisqualified ? 0.45 : 1;

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  height: rowH,
                  alignItems: 'center',
                  borderBottom: `1px solid ${borderLight}`,
                  background: rowBg,
                  opacity: rowOpacity,
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
                  const val = col.key === 'icpScore' ? String(entry.icpScore) : entry[col.key as keyof QualifiedDataEntry] as string;
                  const isEmpty = !val || val === '\u2013' || val === '';

                  let cellColor = isEmpty ? emptyCol : textFilled;
                  if (col.key === 'icpScore') {
                    cellColor = entry.icpScore >= 80 ? '#2563EB' : entry.icpScore >= 60 ? '#F59E0B' : emptyCol;
                  } else if (col.key === 'status') {
                    cellColor = isQualified ? '#2563EB' : isReview ? '#F59E0B' : emptyCol;
                  }

                  return (
                    <div
                      key={col.key}
                      style={{
                        width: tableW * col.width,
                        flexShrink: 0,
                        fontSize: 9.5 * s,
                        fontWeight: (col.key === 'company' || col.key === 'icpScore' || col.key === 'status') ? 500 : 400,
                        color: cellColor,
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
                      opacity: (col.key === 'company' || col.key === 'domain') ? 0.6 : 0.2,
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
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
                    background: item.label === 'Qualified' ? '#2563EB' : item.label === 'Review' ? '#F59E0B' : emptyCol,
                  }}
                />
                <span style={{ fontSize: 7.5 * s, color: textDim, letterSpacing: 0.5 * s }}>
                  {item.label} {item.value}
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
            {data.footerLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
