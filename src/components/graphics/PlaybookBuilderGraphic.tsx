import { LOGO_URL } from '../../utils/assets';
import {
  FONTS, COLORS, CEGTEC_LIGHT_DEFAULTS,
  isDark, adjustBrightness, logoFilter, hexToRgb,
} from '../../utils/cegtecTheme';

export interface PlaybookStep {
  label: string;
  duration: string;
  description: string;
}

export interface PlaybookStat {
  value: string;
  label: string;
}

export interface CompareRow {
  label: string;
  before: string;
  after: string;
}

export interface PlaybookBuilderData {
  title: string;
  subtitle: string;
  sourceLabel: string;
  badgeText: string;
  steps: PlaybookStep[];
  stats: PlaybookStat[];
  compareRows: CompareRow[];
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

export const defaultPlaybookBuilderData: PlaybookBuilderData = {
  title: 'Dein CRM weiß bereits,\nwas funktioniert.',
  subtitle: 'In 2 Stunden zum datenbasierten Outreach-Playbook — mit Claude + HubSpot MCP.',
  sourceLabel: 'CEGTEC ACADEMY',
  badgeText: 'PLAYBOOK BUILDER',
  steps: [
    { label: 'CRM AUDIT', duration: '~20 Min', description: 'Datenqualität prüfen, Readiness Score, Cleanup-Prioritäten' },
    { label: 'WIN/LOSS ANALYSE', duration: '~25 Min', description: 'Gewonnene vs. verlorene Deals nach Branche, Größe, Kanal' },
    { label: 'ICP EXTRAKTION', duration: '~20 Min', description: 'Idealprofil aus echten Conversion-Daten ableiten' },
    { label: 'MESSAGING', duration: '~25 Min', description: 'Angles & Value Props aus Won-Deal Patterns extrahieren' },
    { label: 'PLAYBOOK ASSEMBLY', duration: '~30 Min', description: 'ICP + Kanäle + Sequenzen + Messaging zusammenführen' },
  ],
  stats: [
    { value: '5', label: 'Schritte zum fertigen Playbook' },
    { value: '~2h', label: 'statt 2–4 Wochen manuell' },
    { value: '100+', label: 'CRM-Datenpunkte analysiert' },
  ],
  compareRows: [
    { label: 'ICP', before: '"Mittelständler — war schon immer so"', after: 'Basiert auf Win Rate + Deal Size Daten' },
    { label: 'Branchen', before: 'Alle gleich bearbeitet', after: 'Top 3 nach Conversion priorisiert' },
    { label: 'Messaging', before: 'Gleiche Message an alle', after: 'Pro Persona aus Won-Deal Patterns' },
    { label: 'Kanal', before: 'Persönliche Vorliebe', after: 'First-Touch Attribution der Won-Deals' },
    { label: 'Playbook', before: 'Bauchgefühl im Kopf', after: 'Schriftliches Dokument für das Team' },
  ],
  resultMetrics: 'Datenbasiertes ICP · Priorisierte Branchen · Kanal-Mix nach Attribution · Messaging pro Persona · Sofort einsetzbar',
  resultSource: 'CegTec Playbook-Builder Workflow',
  ...CEGTEC_LIGHT_DEFAULTS,
};

const STEP_COLORS = ['#2563EB', '#7C3AED', '#0891B2', '#D97706', '#059669'];
const STAT_COLORS = ['#2563EB', '#059669', '#D97706'];

// ── Step Icons ───────────────────────────────────────────
const STEP_ICONS = [
  // Audit — magnifier with chart bars
  (sz: number, c: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <circle cx="10.5" cy="10.5" r="6.5" stroke={c} strokeWidth="2" />
      <line x1="15.5" y1="15.5" x2="21" y2="21" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <path d="M8 12V9M10.5 12V7.5M13 12V10" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  // Win/Loss — bar chart comparison
  (sz: number, c: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="12" width="4" height="8" rx="1" stroke={c} strokeWidth="2" />
      <rect x="10" y="4" width="4" height="16" rx="1" stroke={c} strokeWidth="2" />
      <rect x="17" y="8" width="4" height="12" rx="1" stroke={c} strokeWidth="2" />
      <path d="M2 22h20" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  // ICP — target/bullseye
  (sz: number, c: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2" />
      <circle cx="12" cy="12" r="5" stroke={c} strokeWidth="2" />
      <circle cx="12" cy="12" r="1.5" fill={c} />
    </svg>
  ),
  // Messaging — speech bubble with lines
  (sz: number, c: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke={c} strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 8h8M8 12h5" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  // Assembly — document/clipboard
  (sz: number, c: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <rect x="8" y="2" width="8" height="4" rx="1" stroke={c} strokeWidth="2" />
      <rect x="4" y="6" width="16" height="16" rx="2" stroke={c} strokeWidth="2" />
      <path d="M8 12h8M8 16h5" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
];

// ── Shared Components ────────────────────────────────────
export function PlaybookBuilderGraphic({
  data, width, height,
}: {
  data: PlaybookBuilderData; width: number; height: number;
}) {
  const isLandscape = width > height;
  return isLandscape
    ? <Landscape data={data} width={width} height={height} />
    : <Portrait data={data} width={width} height={height} />;
}

/* ═══════════════════════════════════════════════════════ */

function SvgAtmosphere({ width, height, s, accent, dark, uid }: {
  width: number; height: number; s: number; accent: string; dark: boolean; uid: string;
}) {
  return (
    <svg viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <defs>
        <filter id={`${uid}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={100 * s} />
        </filter>
        <filter id={`${uid}-noise`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
        <linearGradient id={`${uid}-topline`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0" />
          <stop offset="20%" stopColor={accent} />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="80%" stopColor="#059669" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Blue orb top-left */}
      <ellipse cx={width * 0.15} cy={height * 0.12} rx={280 * s} ry={180 * s}
        fill={accent} opacity={dark ? 0.06 : 0.035} filter={`url(#${uid}-blur)`} />
      {/* Purple orb mid-right */}
      <ellipse cx={width * 0.82} cy={height * 0.4} rx={240 * s} ry={160 * s}
        fill="#7C3AED" opacity={dark ? 0.05 : 0.03} filter={`url(#${uid}-blur)`} />
      {/* Green orb bottom */}
      <ellipse cx={width * 0.3} cy={height * 0.88} rx={300 * s} ry={150 * s}
        fill="#059669" opacity={dark ? 0.05 : 0.025} filter={`url(#${uid}-blur)`} />
      {/* Top gradient stripe */}
      <rect y={0} width={width} height={4 * s} fill={`url(#${uid}-topline)`} />
      {/* Dot grid */}
      {Array.from({ length: Math.ceil(width / (80 * s)) }).map((_, xi) =>
        Array.from({ length: Math.ceil(height / (80 * s)) }).map((_, yi) => (
          <circle key={`${xi}-${yi}`}
            cx={xi * 80 * s} cy={yi * 80 * s} r={1.2 * s}
            fill={dark ? '#ffffff' : '#000000'} opacity={dark ? 0.06 : 0.04}
          />
        ))
      )}
      <rect width={width} height={height} opacity="0.012" filter={`url(#${uid}-noise)`} />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   PORTRAIT (9:16)
   ═══════════════════════════════════════════════════════ */

function Portrait({ data, width, height }: { data: PlaybookBuilderData; width: number; height: number }) {
  const bg = data.backgroundColor || COLORS.bgLightAlt;
  const dark = isDark(bg);
  const accent = data.filledColor || COLORS.filled;
  const titleCol = data.textColor || COLORS.titleLight;
  const textMuted = data.labelColor || COLORS.labelLight;
  const textDim = adjustBrightness(textMuted, -18);
  const borderCol = data.borderColor || COLORS.border;
  const s = Math.min(width / 1080, height / 1920);

  const cardBg = dark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const cardBorder = dark ? 'rgba(255,255,255,0.08)' : borderCol;

  return (
    <div style={{
      width, height, position: 'relative', overflow: 'hidden',
      fontFamily: FONTS.display, background: bg, color: titleCol,
    }}>
      <SvgAtmosphere width={width} height={height} s={s} accent={accent} dark={dark} uid="pb-p" />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        padding: `${56 * s}px ${68 * s}px ${44 * s}px`,
      }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 20 * s }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 * s }}>
            <img src={LOGO_URL} alt="CegTec" style={{ height: 32 * s, ...logoFilter(bg) }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 * s }}>
              <span style={{
                width: 5 * s, height: 5 * s, borderRadius: '50%',
                background: accent, opacity: 0.5, display: 'inline-block',
              }} />
              <span style={{
                fontFamily: FONTS.mono, fontSize: 11 * s, fontWeight: 600,
                color: textDim, letterSpacing: 2.5 * s, textTransform: 'uppercase' as const,
              }}>{data.sourceLabel}</span>
            </div>
          </div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10 * s,
            marginBottom: 16 * s,
          }}>
            <div style={{ width: 3.5 * s, height: 22 * s, borderRadius: 2 * s, background: accent }} />
            <span style={{
              fontFamily: FONTS.mono, fontSize: 14 * s, fontWeight: 700,
              letterSpacing: 3.5 * s, textTransform: 'uppercase' as const, color: accent,
            }}>{data.badgeText}</span>
          </div>

          <h1 style={{
            fontSize: 52 * s, fontWeight: 800, lineHeight: 1.06,
            letterSpacing: -2.5 * s, margin: 0, marginBottom: 12 * s,
            whiteSpace: 'pre-line' as const,
          }}>
            {data.title.split('\n').map((line, i, arr) => (
              <span key={i}>
                {i === arr.length - 1 ? <span style={{ color: accent }}>{line}</span> : line}
                {i < arr.length - 1 && '\n'}
              </span>
            ))}
          </h1>
          <p style={{
            fontFamily: FONTS.mono, fontSize: 15 * s, color: textMuted,
            margin: 0, lineHeight: 1.4, letterSpacing: 0.2 * s, fontWeight: 500,
            fontStyle: 'italic',
          }}>{data.subtitle}</p>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1.5, background: cardBorder, marginBottom: 20 * s, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 120 * s, height: 1.5, background: accent }} />
        </div>

        {/* ── HERO STATS ── */}
        <div style={{
          display: 'flex', gap: 14 * s, marginBottom: 20 * s,
        }}>
          {data.stats.map((stat, i) => {
            const sc = STAT_COLORS[i % STAT_COLORS.length];
            return (
              <div key={i} style={{
                flex: 1, padding: `${20 * s}px ${14 * s}px`,
                background: cardBg, borderRadius: 14 * s,
                border: `1.5px solid ${cardBorder}`,
                borderTop: `4px solid ${sc}`,
                textAlign: 'center' as const,
              }}>
                <div style={{
                  fontSize: 44 * s, fontWeight: 800, color: sc,
                  lineHeight: 1.05, letterSpacing: -2 * s,
                  marginBottom: 8 * s,
                }}>{stat.value}</div>
                <div style={{
                  fontFamily: FONTS.mono, fontSize: 13 * s,
                  color: textMuted, lineHeight: 1.35,
                }}>{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* ── SECTION LABEL ── */}
        <div style={{
          fontFamily: FONTS.mono, fontSize: 12 * s, fontWeight: 600,
          color: textDim, letterSpacing: 3 * s, textTransform: 'uppercase' as const,
          marginBottom: 14 * s,
        }}>DER WORKFLOW</div>

        {/* ── STEPS TIMELINE ── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', position: 'relative',
          marginBottom: 20 * s,
        }}>
          {/* Timeline connector line */}
          <div style={{
            position: 'absolute', left: 30 * s, top: 30 * s,
            bottom: 30 * s, width: 2.5 * s,
            background: `linear-gradient(to bottom, ${STEP_COLORS[0]}, ${STEP_COLORS[2]}, ${STEP_COLORS[4]})`,
            borderRadius: 2 * s, opacity: 0.25,
          }} />

          {data.steps.map((step, i) => {
            const col = STEP_COLORS[i % STEP_COLORS.length];
            const Icon = STEP_ICONS[i % STEP_ICONS.length];
            const rgb = hexToRgb(col);
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 18 * s,
                position: 'relative',
              }}>
                {/* Circle */}
                <div style={{
                  width: 60 * s, height: 60 * s, borderRadius: '50%',
                  background: cardBg, border: `2px solid ${col}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, position: 'relative', zIndex: 2,
                  boxShadow: `0 0 20px rgba(${rgb},0.12)`,
                }}>
                  {Icon(28 * s, col)}
                </div>

                {/* Card */}
                <div style={{
                  flex: 1, minWidth: 0, display: 'flex', alignItems: 'center',
                  gap: 14 * s, padding: `${18 * s}px ${20 * s}px`,
                  background: cardBg, borderRadius: 14 * s,
                  border: `1.5px solid ${cardBorder}`,
                  borderLeft: `4 * s solid ${col}`,
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: 4 * s, background: col, borderRadius: `${14 * s}px 0 0 ${14 * s}px`,
                  }} />
                  <div style={{ flex: 1, minWidth: 0, paddingLeft: 8 * s }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginBottom: 4 * s,
                    }}>
                      <span style={{
                        fontFamily: FONTS.mono, fontSize: 15 * s, fontWeight: 700,
                        color: col, letterSpacing: 1.5 * s,
                        textTransform: 'uppercase' as const,
                      }}>{step.label}</span>
                      <span style={{
                        fontFamily: FONTS.mono, fontSize: 12 * s, fontWeight: 600,
                        color: textMuted, opacity: 0.7,
                      }}>{step.duration}</span>
                    </div>
                    <div style={{
                      fontSize: 18 * s, color: textMuted, lineHeight: 1.35,
                      fontWeight: 500,
                    }}>{step.description}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── RESULT BANNER ── */}
        <div style={{
          padding: `${22 * s}px ${26 * s}px`,
          background: `linear-gradient(135deg, ${accent}12, ${accent}08)`,
          borderRadius: 16 * s,
          border: `1.5px solid ${accent}25`,
        }}>
          <div style={{
            fontSize: 17 * s, fontWeight: 600, color: titleCol,
            lineHeight: 1.5, letterSpacing: 0.2 * s,
          }}>
            {data.resultMetrics.split('·').map((part, i, arr) => (
              <span key={i}>
                <span style={{ color: accent, fontWeight: 700 }}>✓</span>{' '}
                {part.trim()}
                {i < arr.length - 1 && <span style={{ color: accent, margin: `0 ${6 * s}px`, opacity: 0.4 }}> · </span>}
              </span>
            ))}
          </div>
          <div style={{
            fontFamily: FONTS.mono, fontSize: 11 * s, color: textMuted,
            marginTop: 10 * s, opacity: 0.65,
          }}>{data.resultSource}</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LANDSCAPE (16:9)
   ═══════════════════════════════════════════════════════ */

function Landscape({ data, width, height }: { data: PlaybookBuilderData; width: number; height: number }) {
  const bg = data.backgroundColor || COLORS.bgLightAlt;
  const dark = isDark(bg);
  const accent = data.filledColor || COLORS.filled;
  const titleCol = data.textColor || COLORS.titleLight;
  const textMuted = data.labelColor || COLORS.labelLight;
  const textDim = adjustBrightness(textMuted, -18);
  const borderCol = data.borderColor || COLORS.border;
  const s = Math.min(width / 1920, height / 1080);

  const cardBg = dark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const cardBorder = dark ? 'rgba(255,255,255,0.08)' : borderCol;

  return (
    <div style={{
      width, height, position: 'relative', overflow: 'hidden',
      fontFamily: FONTS.display, background: bg, color: titleCol,
    }}>
      <SvgAtmosphere width={width} height={height} s={s} accent={accent} dark={dark} uid="pb-l" />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        padding: `${44 * s}px ${56 * s}px ${36 * s}px`,
      }}>
        {/* ── TOP ROW: Header + Stats ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 40 * s, marginBottom: 28 * s }}>
          {/* Left — title */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 * s }}>
              <img src={LOGO_URL} alt="CegTec" style={{ height: 28 * s, ...logoFilter(bg) }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 * s }}>
                <div style={{ width: 3 * s, height: 18 * s, borderRadius: 2 * s, background: accent }} />
                <span style={{
                  fontFamily: FONTS.mono, fontSize: 11 * s, fontWeight: 700,
                  letterSpacing: 3 * s, color: accent, textTransform: 'uppercase' as const,
                }}>{data.badgeText}</span>
              </div>
            </div>
            <h1 style={{
              fontSize: 40 * s, fontWeight: 800, lineHeight: 1.08,
              letterSpacing: -1.5 * s, margin: 0, marginBottom: 10 * s,
              whiteSpace: 'pre-line' as const,
            }}>
              {data.title.split('\n').map((line, i, arr) => (
                <span key={i}>
                  {i === arr.length - 1 ? <span style={{ color: accent }}>{line}</span> : line}
                  {i < arr.length - 1 && '\n'}
                </span>
              ))}
            </h1>
            <p style={{
              fontFamily: FONTS.mono, fontSize: 13 * s, color: textMuted,
              margin: 0, lineHeight: 1.4, fontStyle: 'italic', fontWeight: 500,
            }}>{data.subtitle}</p>
          </div>

          {/* Right — stats */}
          <div style={{ display: 'flex', gap: 12 * s, flexShrink: 0 }}>
            {data.stats.map((stat, i) => {
              const sc = STAT_COLORS[i % STAT_COLORS.length];
              return (
                <div key={i} style={{
                  width: 140 * s, padding: `${16 * s}px ${12 * s}px`,
                  background: cardBg, borderRadius: 12 * s,
                  border: `1.5px solid ${cardBorder}`,
                  borderTop: `3px solid ${sc}`,
                  textAlign: 'center' as const,
                }}>
                  <div style={{
                    fontSize: 32 * s, fontWeight: 800, color: sc,
                    lineHeight: 1.1, letterSpacing: -1 * s, marginBottom: 6 * s,
                  }}>{stat.value}</div>
                  <div style={{
                    fontFamily: FONTS.mono, fontSize: 10 * s,
                    color: textMuted, lineHeight: 1.3,
                  }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1.5, background: cardBorder, marginBottom: 24 * s, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 120 * s, height: 1.5, background: accent }} />
        </div>

        {/* ── MAIN: Steps + Compare ── */}
        <div style={{ flex: 1, display: 'flex', gap: 32 * s, minHeight: 0 }}>
          {/* Left — Steps (horizontal timeline) */}
          <div style={{ flex: 3, display: 'flex', flexDirection: 'column' }}>
            <div style={{
              fontFamily: FONTS.mono, fontSize: 11 * s, fontWeight: 600,
              color: textDim, letterSpacing: 3 * s, textTransform: 'uppercase' as const,
              marginBottom: 16 * s,
            }}>WORKFLOW</div>

            <div style={{
              flex: 1, display: 'flex', gap: 12 * s,
            }}>
              {data.steps.map((step, i) => {
                const col = STEP_COLORS[i % STEP_COLORS.length];
                const Icon = STEP_ICONS[i % STEP_ICONS.length];
                return (
                  <div key={i} style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    padding: `${16 * s}px ${14 * s}px`,
                    background: cardBg, borderRadius: 12 * s,
                    border: `1.5px solid ${cardBorder}`,
                    borderTop: `3px solid ${col}`,
                    position: 'relative',
                  }}>
                    <div style={{
                      width: 40 * s, height: 40 * s, borderRadius: '50%',
                      border: `2px solid ${col}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 12 * s,
                    }}>
                      {Icon(20 * s, col)}
                    </div>
                    <span style={{
                      fontFamily: FONTS.mono, fontSize: 10 * s, fontWeight: 700,
                      color: col, letterSpacing: 1.5 * s,
                      textTransform: 'uppercase' as const, marginBottom: 4 * s,
                    }}>{step.label}</span>
                    <span style={{
                      fontFamily: FONTS.mono, fontSize: 10 * s,
                      color: textMuted, opacity: 0.6, marginBottom: 8 * s,
                    }}>{step.duration}</span>
                    <div style={{
                      fontSize: 13 * s, color: textMuted, lineHeight: 1.4,
                      fontWeight: 500,
                    }}>{step.description}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — Compare */}
          <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
            <div style={{
              fontFamily: FONTS.mono, fontSize: 11 * s, fontWeight: 600,
              color: textDim, letterSpacing: 3 * s, textTransform: 'uppercase' as const,
              marginBottom: 16 * s,
            }}>BAUCHGEFÜHL → DATEN</div>

            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              gap: 8 * s,
            }}>
              {data.compareRows.map((row, i) => (
                <div key={i} style={{
                  flex: 1, display: 'flex', gap: 10 * s, minHeight: 0,
                }}>
                  <div style={{
                    flex: 1, padding: `${10 * s}px ${12 * s}px`,
                    background: dark ? 'rgba(220,38,38,0.06)' : '#FEF2F2',
                    borderRadius: 10 * s, border: `1px solid ${dark ? 'rgba(220,38,38,0.12)' : '#FECACA'}`,
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  }}>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 9 * s, color: '#DC2626', fontWeight: 700, letterSpacing: 1.5 * s, marginBottom: 2 * s }}>{row.label}</div>
                    <div style={{ fontSize: 11 * s, color: textMuted, lineHeight: 1.3 }}>{row.before}</div>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    fontSize: 14 * s, color: accent, fontWeight: 700,
                  }}>→</div>
                  <div style={{
                    flex: 1, padding: `${10 * s}px ${12 * s}px`,
                    background: dark ? 'rgba(5,150,105,0.06)' : '#F0FDF4',
                    borderRadius: 10 * s, border: `1px solid ${dark ? 'rgba(5,150,105,0.12)' : '#BBF7D0'}`,
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  }}>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 9 * s, color: '#059669', fontWeight: 700, letterSpacing: 1.5 * s, marginBottom: 2 * s }}>DATEN</div>
                    <div style={{ fontSize: 11 * s, color: textMuted, lineHeight: 1.3 }}>{row.after}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RESULT BANNER ── */}
        <div style={{
          padding: `${16 * s}px ${22 * s}px`, marginTop: 20 * s,
          background: `linear-gradient(135deg, ${accent}10, ${accent}06)`,
          borderRadius: 14 * s, border: `1.5px solid ${accent}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            fontSize: 13 * s, fontWeight: 600, color: titleCol,
            lineHeight: 1.5,
          }}>
            {data.resultMetrics.split('·').map((part, i, arr) => (
              <span key={i}>
                <span style={{ color: accent, fontWeight: 700 }}>✓</span>{' '}
                {part.trim()}
                {i < arr.length - 1 && <span style={{ margin: `0 ${4 * s}px`, opacity: 0.3 }}> · </span>}
              </span>
            ))}
          </div>
          <span style={{
            fontFamily: FONTS.mono, fontSize: 10 * s, color: textMuted, opacity: 0.6,
          }}>{data.resultSource}</span>
        </div>
      </div>
    </div>
  );
}
