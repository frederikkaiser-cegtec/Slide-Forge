import { LOGO_URL } from '../../utils/assets';
import { logoFilter } from '../../utils/cegtecTheme';

export interface AcademyData {
  title: string;
  subtitle: string;
  badge: string;
  steps: { action: string; tool: string; desc: string; cost: string }[];
  ourPrice: string;
  ourLabel: string;
  theirPrice: string;
  theirLabel: string;
  resultBanner: string;
  resultSource: string;
  ctaText: string;
  ctaButton: string;
  ctaUrl: string;
  backgroundColor?: string;
  accentColor?: string;
  accentColor2?: string;
  textColor?: string;
  labelColor?: string;
  theme?: 'light' | 'dark';
}

export const defaultAcademyData: AcademyData = {
  title: 'Personalisierter Outbound\nfür unter 500€/Monat',
  subtitle: 'Ohne Clay. Ohne Sales Navigator. Mit Claude Code.',
  badge: 'Academy',
  steps: [
    { action: 'Leads Scrapen', tool: 'Apify GMaps Scraper', desc: '1.000 Leads für ~$10', cost: '~$10' },
    { action: 'Research', tool: 'CegTec Enrichment Agent', desc: 'Deep Research pro Lead, DACH-optimiert', cost: 'custom' },
    { action: 'Anreichern', tool: 'FullEnrich API', desc: 'E-Mail + Telefon, 60–75% Hit Rate', cost: '~$48' },
    { action: 'Outreach', tool: 'Instantly', desc: 'Personalisierte 4-Step Sequenz', cost: '$30' },
    { action: 'Orchestrieren', tool: 'Claude Code', desc: 'Ein Prompt steuert alles', cost: '$20' },
  ],
  ourPrice: '~$158/Monat',
  ourLabel: 'Unser Stack',
  theirPrice: '$400+/Monat',
  theirLabel: 'Clay + Tools',
  resultBanner: '500–1.000 Leads → 60–75% Enrichment → 3–6% Reply Rate → Meetings ab Woche 2',
  resultSource: 'CegTec Benchmark-Daten',
  ctaText: 'Den kompletten Guide mit Templates, Prompts & Video-Walkthrough gibt\'s in der CegTec Academy.',
  ctaButton: 'Jetzt Zugang sichern →',
  ctaUrl: 'cegtec.de/academy',
  backgroundColor: '#F5F5F0',
  accentColor: '#2563EB',
  accentColor2: '#1A3FD4',
  textColor: '#1A1A2E',
  labelColor: '#7A7A8E',
  theme: 'light',
};

const STEP_COLORS = ['#2563EB', '#0891B2', '#D97706', '#DB2777', '#4F46E5'];

export function AcademyGraphic({ data, width, height }: { data: AcademyData; width: number; height: number }) {
  const isLandscape = width > height;
  return isLandscape
    ? <AcademyLandscape data={data} width={width} height={height} />
    : <AcademyPortrait data={data} width={width} height={height} />;
}

/* ═══════════════════════════════════════════════════════
   SHARED
   ═══════════════════════════════════════════════════════ */

function useTheme(data: AcademyData, bg: string) {
  const isDark = (data.theme === 'dark') || luminance(bg) < 0.3;
  return {
    isDark,
    cardBg: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
    cardBorder: isDark ? 'rgba(255,255,255,0.08)' : '#E2E2DA',
    dimText: isDark ? 'rgba(255,255,255,0.3)' : '#A0A0AE',
    mutedText: isDark ? 'rgba(255,255,255,0.5)' : '#7A7A8E',
    greenBg: isDark ? 'rgba(5,150,105,0.12)' : '#ECFDF5',
    greenBorder: isDark ? 'rgba(5,150,105,0.3)' : '#059669',
    grayBg: isDark ? 'rgba(255,255,255,0.03)' : '#F0F0EA',
  };
}

function GridBg({ width, height, accent, isDark }: { width: number; height: number; accent: string; isDark: boolean }) {
  const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  return (
    <>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
        backgroundSize: '72px 72px',
      }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: accent }} />
      {[[128, 72], [128, width - 72], [height * 0.5, 72], [height * 0.5, width - 72]].map(([top, left], i) => (
        <div key={i} style={{
          position: 'absolute', top, left, width: 6, height: 6, borderRadius: '50%',
          background: accent, opacity: 0.08,
        }} />
      ))}
    </>
  );
}

function StepIcon({ index, color, size }: { index: number; color: string; size: number }) {
  const icons = [
    <svg key={0} width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke={color} strokeWidth="2" /><circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2" /></svg>,
    <svg key={1} width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" /><path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round" /></svg>,
    <svg key={2} width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" /></svg>,
    <svg key={3} width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" /></svg>,
    <svg key={4} width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" /></svg>,
  ];
  return icons[index % icons.length];
}

function luminance(hex: string): number {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return 0.5;
  const [r, g, b] = [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/* ═══════════════════════════════════════════════════════
   PORTRAIT (9:16)
   Header → Pipeline → Kosten-Vergleich → Ergebnis-Banner → CTA
   ═══════════════════════════════════════════════════════ */

function AcademyPortrait({ data, width, height }: { data: AcademyData; width: number; height: number }) {
  const bg = data.backgroundColor || '#F5F5F0';
  const accent = data.accentColor || '#2563EB';
  const text = data.textColor || '#1A1A2E';
  const t = useTheme(data, bg);
  const s = Math.min(width / 1080, height / 1920);

  const titleParts = data.title.split('\n');
  const lastLine = titleParts[titleParts.length - 1];
  const highlightMatch = lastLine.match(/(.*?)([\d]+€\/\w+)(.*)/);

  const ICON_BGS = ['#F0F4FF', '#ECFEFF', '#FFFBEB', '#FDF2F8', '#EEF2FF'];
  const ICON_BGS_DARK = ['rgba(37,99,235,0.15)', 'rgba(8,145,178,0.15)', 'rgba(217,119,6,0.15)', 'rgba(219,39,119,0.15)', 'rgba(79,70,229,0.15)'];

  return (
    <div style={{
      width, height, position: 'relative', overflow: 'hidden',
      fontFamily: "'DM Sans', system-ui, sans-serif",
      background: bg, color: text,
    }}>
      <GridBg width={width} height={height} accent={accent} isDark={t.isDark} />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        padding: `${56 * s}px ${72 * s}px ${44 * s}px`,
      }}>

        {/* ── 1. HEADER ── */}
        <div style={{ marginBottom: 36 * s }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 * s }}>
            <img src={LOGO_URL} alt="CegTec" style={{ height: 32 * s, ...logoFilter(bg) }} />
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11 * s, fontWeight: 600, letterSpacing: 3 * s,
              textTransform: 'uppercase' as const, color: accent,
              border: `1.5px solid ${accent}`,
              padding: `${6 * s}px ${16 * s}px`, borderRadius: 4 * s,
            }}>{data.badge}</span>
          </div>
          <div style={{
            fontSize: 48 * s, fontWeight: 800, lineHeight: 1.08,
            letterSpacing: -1.5 * s, marginBottom: 14 * s,
          }}>
            {titleParts.length > 1 && <div>{titleParts[0]}</div>}
            <div>
              {highlightMatch ? (
                <>{highlightMatch[1]}<span style={{ color: accent }}>{highlightMatch[2]}</span>{highlightMatch[3]}</>
              ) : titleParts[titleParts.length - 1]}
            </div>
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 15 * s, color: t.mutedText, letterSpacing: 0.3 * s,
          }}>{data.subtitle}</div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1, background: t.cardBorder, marginBottom: 36 * s, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 120 * s, height: 1, background: accent }} />
        </div>

        {/* ── 2. PIPELINE ── */}
        <div style={{ marginBottom: 40 * s, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10 * s, fontWeight: 600, letterSpacing: 3 * s,
            textTransform: 'uppercase' as const, color: t.dimText,
            marginBottom: 24 * s,
          }}>Die Pipeline — {data.steps.length} Schritte</div>

          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', flex: 1, justifyContent: 'space-between' }}>
            {/* Dashed vertical connector */}
            <div style={{
              position: 'absolute', left: 24 * s, top: 40 * s, bottom: 40 * s,
              width: 2 * s, zIndex: 0,
              backgroundImage: `repeating-linear-gradient(to bottom, ${accent}40 0px, ${accent}40 ${6 * s}px, transparent ${6 * s}px, transparent ${12 * s}px)`,
            }} />

            {data.steps.map((step, i) => {
              const sc = STEP_COLORS[i % STEP_COLORS.length];
              const isFirst = i === 0;
              const isLast = i === data.steps.length - 1;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'stretch', position: 'relative' }}>
                  {/* Number circle */}
                  <div style={{ width: 48 * s, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
                    <div style={{
                      width: 48 * s, height: 48 * s, borderRadius: '50%',
                      background: isLast ? accent : t.cardBg,
                      border: isLast ? `2px solid ${accent}` : isFirst ? `2px solid ${accent}` : `2px solid ${t.cardBorder}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 14 * s, fontWeight: 700,
                      color: isLast ? '#fff' : isFirst ? accent : t.mutedText,
                    }}>{String(i + 1).padStart(2, '0')}</div>
                  </div>

                  {/* Card */}
                  <div style={{
                    flex: 1, marginLeft: 16 * s,
                    background: t.cardBg,
                    border: isLast ? `1.5px solid ${accent}` : `1px solid ${t.cardBorder}`,
                    borderRadius: 8 * s,
                    padding: `${18 * s}px ${20 * s}px`,
                    display: 'flex', alignItems: 'center', gap: 16 * s,
                    boxShadow: isLast ? `0 0 0 ${3 * s}px ${accent}0F` : 'none',
                  }}>
                    <div style={{
                      width: 44 * s, height: 44 * s, borderRadius: 8 * s,
                      background: t.isDark ? ICON_BGS_DARK[i % 5] : ICON_BGS[i % 5],
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <StepIcon index={i} color={sc} size={22 * s} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 9 * s, fontWeight: 600, letterSpacing: 2.5 * s,
                        textTransform: 'uppercase' as const, color: accent,
                        marginBottom: 3 * s,
                      }}>{step.action}</div>
                      <div style={{
                        fontSize: 17 * s, fontWeight: 700, letterSpacing: -0.3 * s,
                        marginBottom: 3 * s,
                      }}>{step.tool}</div>
                      <div style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 12 * s, color: t.mutedText, lineHeight: 1.3,
                      }}>{step.desc}</div>
                    </div>
                    <div style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 15 * s, fontWeight: 700, color: '#059669', flexShrink: 0,
                    }}>{step.cost}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 3. KOSTEN-VERGLEICH ── */}
        <div style={{
          display: 'flex', gap: 16 * s, marginBottom: 32 * s,
        }}>
          {/* Unser Stack */}
          <div style={{
            flex: 1, borderRadius: 10 * s, padding: `${20 * s}px ${24 * s}px`,
            background: t.greenBg, border: `1.5px solid ${t.greenBorder}33`,
          }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 9 * s, fontWeight: 600, letterSpacing: 2 * s,
              textTransform: 'uppercase' as const, color: '#059669',
              marginBottom: 8 * s,
            }}>{data.ourLabel}</div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 32 * s, fontWeight: 700, color: '#059669',
              letterSpacing: -1 * s, lineHeight: 1,
            }}>{data.ourPrice}</div>
          </div>
          {/* Clay + Tools */}
          <div style={{
            flex: 1, borderRadius: 10 * s, padding: `${20 * s}px ${24 * s}px`,
            background: t.grayBg, border: `1px solid ${t.cardBorder}`,
          }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 9 * s, fontWeight: 600, letterSpacing: 2 * s,
              textTransform: 'uppercase' as const, color: t.dimText,
              marginBottom: 8 * s,
            }}>{data.theirLabel}</div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 32 * s, fontWeight: 700, color: t.dimText,
              letterSpacing: -1 * s, lineHeight: 1,
              textDecoration: 'line-through', textDecorationColor: '#DC2626',
              textDecorationThickness: `${2.5 * s}px`,
            }}>{data.theirPrice}</div>
          </div>
        </div>

        {/* ── 4. ERGEBNIS-BANNER ── */}
        <div style={{
          background: t.isDark ? `${accent}15` : `${accent}08`,
          border: `1.5px solid ${accent}25`,
          borderRadius: 10 * s, padding: `${24 * s}px ${28 * s}px`,
          marginBottom: 32 * s,
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 16 * s, fontWeight: 600, color: text,
            lineHeight: 1.5, letterSpacing: -0.3 * s,
          }}>{data.resultBanner}</div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10 * s, color: t.dimText, marginTop: 10 * s,
            letterSpacing: 1 * s,
          }}>Quelle: {data.resultSource}</div>
        </div>

        {/* ── 5. CTA FOOTER ── */}
        <div style={{
          paddingTop: 20 * s, borderTop: `1px solid ${t.cardBorder}`,
        }}>
          <div style={{
            fontSize: 14 * s, color: t.mutedText, lineHeight: 1.5,
            marginBottom: 16 * s,
          }}>{data.ctaText}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11 * s, color: t.dimText, letterSpacing: 0.5 * s,
            }}>{data.ctaUrl}</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8 * s,
              background: accent, color: '#fff',
              fontSize: 15 * s, fontWeight: 700,
              padding: `${14 * s}px ${32 * s}px`, borderRadius: 6 * s,
              letterSpacing: -0.2 * s,
            }}>{data.ctaButton}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LANDSCAPE (16:9)
   2 columns: Pipeline left | Comparison + Result + CTA right
   ═══════════════════════════════════════════════════════ */

function AcademyLandscape({ data, width, height }: { data: AcademyData; width: number; height: number }) {
  const bg = data.backgroundColor || '#F5F5F0';
  const accent = data.accentColor || '#2563EB';
  const text = data.textColor || '#1A1A2E';
  const t = useTheme(data, bg);
  const s = Math.min(width / 1920, height / 1080);

  const ICON_BGS = ['#F0F4FF', '#ECFEFF', '#FFFBEB', '#FDF2F8', '#EEF2FF'];
  const ICON_BGS_DARK = ['rgba(37,99,235,0.15)', 'rgba(8,145,178,0.15)', 'rgba(217,119,6,0.15)', 'rgba(219,39,119,0.15)', 'rgba(79,70,229,0.15)'];

  return (
    <div style={{
      width, height, position: 'relative', overflow: 'hidden',
      fontFamily: "'DM Sans', system-ui, sans-serif",
      background: bg, color: text,
    }}>
      <GridBg width={width} height={height} accent={accent} isDark={t.isDark} />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        padding: `${24 * s}px ${40 * s}px ${18 * s}px`,
      }}>

        {/* ── TOP BAR ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20 * s,
          marginBottom: 14 * s, flexShrink: 0,
        }}>
          <img src={LOGO_URL} alt="CegTec" style={{ height: 28 * s, ...logoFilter(bg) }} />
          <div style={{
            fontSize: 24 * s, fontWeight: 800, lineHeight: 1.1,
            letterSpacing: -1.5 * s, flex: 1,
          }}>{data.title.replace(/\n/g, ' ')}</div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11 * s, color: t.mutedText,
            maxWidth: 340 * s, lineHeight: 1.3, textAlign: 'right' as const,
          }}>{data.subtitle}</div>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9 * s, fontWeight: 600, letterSpacing: 2.5 * s,
            textTransform: 'uppercase' as const, color: accent,
            border: `1.5px solid ${accent}`,
            padding: `${5 * s}px ${14 * s}px`, borderRadius: 4 * s, flexShrink: 0,
          }}>{data.badge}</span>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1, background: t.cardBorder, marginBottom: 14 * s, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 80 * s, height: 1, background: accent }} />
        </div>

        {/* ── 2-COLUMN ── */}
        <div style={{ flex: 1, display: 'flex', gap: 28 * s, minHeight: 0 }}>

          {/* LEFT: Pipeline */}
          <div style={{ width: '52%', display: 'flex', flexDirection: 'column' }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 8 * s, fontWeight: 600, letterSpacing: 2.5 * s,
              textTransform: 'uppercase' as const, color: t.dimText,
              marginBottom: 10 * s, display: 'flex', alignItems: 'center', gap: 8 * s,
            }}>
              Pipeline — {data.steps.length} Schritte
              <span style={{ flex: 1, height: 1, background: t.cardBorder }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {data.steps.map((step, i) => {
                const sc = STEP_COLORS[i % STEP_COLORS.length];
                const isLast = i === data.steps.length - 1;
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10 * s,
                    background: t.cardBg,
                    border: isLast ? `1.5px solid ${accent}` : `1px solid ${t.cardBorder}`,
                    borderRadius: 8 * s, padding: `${9 * s}px ${14 * s}px`,
                    boxShadow: isLast ? `0 0 0 ${2 * s}px ${accent}0F` : 'none',
                  }}>
                    <div style={{
                      width: 28 * s, height: 28 * s, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: 10 * s, fontWeight: 700,
                      flexShrink: 0,
                      border: isLast ? 'none' : i === 0 ? `1.5px solid ${accent}` : `1.5px solid ${t.cardBorder}`,
                      background: isLast ? accent : t.cardBg,
                      color: isLast ? '#fff' : i === 0 ? accent : t.mutedText,
                    }}>{String(i + 1).padStart(2, '0')}</div>
                    <div style={{
                      width: 28 * s, height: 28 * s, borderRadius: 6 * s,
                      background: t.isDark ? ICON_BGS_DARK[i % 5] : ICON_BGS[i % 5],
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <StepIcon index={i} color={sc} size={14 * s} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12 * s, fontWeight: 700, letterSpacing: -0.3 * s }}>{step.tool}</div>
                      <div style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: 8.5 * s, color: t.mutedText, lineHeight: 1.2,
                      }}>{step.desc}</div>
                    </div>
                    <div style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 11 * s, fontWeight: 700, color: '#059669', flexShrink: 0,
                    }}>{step.cost}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Comparison + Result + CTA */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 * s }}>

            {/* Kosten-Vergleich */}
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 8 * s, fontWeight: 600, letterSpacing: 2.5 * s,
              textTransform: 'uppercase' as const, color: t.dimText,
              display: 'flex', alignItems: 'center', gap: 8 * s,
            }}>
              Kosten-Vergleich
              <span style={{ flex: 1, height: 1, background: t.cardBorder }} />
            </div>
            <div style={{ display: 'flex', gap: 12 * s }}>
              <div style={{
                flex: 1, borderRadius: 8 * s, padding: `${14 * s}px ${16 * s}px`,
                background: t.greenBg, border: `1.5px solid ${t.greenBorder}33`,
              }}>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 8 * s, fontWeight: 600, letterSpacing: 2 * s,
                  textTransform: 'uppercase' as const, color: '#059669',
                  marginBottom: 6 * s,
                }}>{data.ourLabel}</div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 24 * s, fontWeight: 700, color: '#059669',
                  letterSpacing: -1 * s, lineHeight: 1,
                }}>{data.ourPrice}</div>
              </div>
              <div style={{
                flex: 1, borderRadius: 8 * s, padding: `${14 * s}px ${16 * s}px`,
                background: t.grayBg, border: `1px solid ${t.cardBorder}`,
              }}>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 8 * s, fontWeight: 600, letterSpacing: 2 * s,
                  textTransform: 'uppercase' as const, color: t.dimText,
                  marginBottom: 6 * s,
                }}>{data.theirLabel}</div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 24 * s, fontWeight: 700, color: t.dimText,
                  letterSpacing: -1 * s, lineHeight: 1,
                  textDecoration: 'line-through', textDecorationColor: '#DC2626',
                  textDecorationThickness: `${2 * s}px`,
                }}>{data.theirPrice}</div>
              </div>
            </div>

            {/* Ergebnis-Banner */}
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 8 * s, fontWeight: 600, letterSpacing: 2.5 * s,
              textTransform: 'uppercase' as const, color: t.dimText,
              display: 'flex', alignItems: 'center', gap: 8 * s, marginTop: 4 * s,
            }}>
              Ergebnis
              <span style={{ flex: 1, height: 1, background: t.cardBorder }} />
            </div>
            <div style={{
              flex: 1, background: t.isDark ? `${accent}15` : `${accent}08`,
              border: `1.5px solid ${accent}25`,
              borderRadius: 10 * s, padding: `${18 * s}px ${22 * s}px`,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 13 * s, fontWeight: 600, color: text,
                lineHeight: 1.6, letterSpacing: -0.2 * s,
              }}>{data.resultBanner}</div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 8 * s, color: t.dimText, marginTop: 8 * s,
                letterSpacing: 1 * s,
              }}>Quelle: {data.resultSource}</div>
            </div>

            {/* CTA */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              paddingTop: 10 * s, borderTop: `1px solid ${t.cardBorder}`,
            }}>
              <div>
                <div style={{ fontSize: 10 * s, color: t.mutedText, lineHeight: 1.4, maxWidth: 320 * s }}>{data.ctaText}</div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 8 * s, color: t.dimText, marginTop: 4 * s,
                }}>{data.ctaUrl}</div>
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6 * s,
                background: accent, color: '#fff',
                fontSize: 12 * s, fontWeight: 700,
                padding: `${9 * s}px ${20 * s}px`, borderRadius: 6 * s,
                flexShrink: 0,
              }}>{data.ctaButton}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
