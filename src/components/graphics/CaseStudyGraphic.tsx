import { LOGO_URL } from '../../utils/assets';
import { FONTS, COLORS, isDark, logoFilter, hexToRgb } from '../../utils/cegtecTheme';
import type { CaseStudyData } from '../../types/graphics';

const REF_W = 1240;
const REF_H = 1754;

export function CaseStudyGraphic({ data, width, height }: { data: CaseStudyData; width: number; height: number }) {
  const s = Math.min(width / REF_W, height / REF_H);
  const accent = data.accentColor || '#2E75B6';
  const accentDark = '#1F4E79';
  const pink = '#E040FB';
  const purple = '#6B5CE7';
  const [ar, ag, ab] = hexToRgb(accent);
  const titleCol = data.textColor || '#1a1a2e';
  const labelCol = data.labelColor || '#6b7280';
  const bodyCol = '#374151';
  const cardBg = '#ffffff';
  const pageBg = `linear-gradient(135deg, #f0f0ff 0%, #fce4ff 40%, #e8f0ff 100%)`;
  const shadow = '0 2px 16px rgba(0,0,0,0.06)';
  const radius = 16 * s;
  const pad = 32 * s;
  const sectionColors = [accent, purple, '#10b981'];

  const hasFunnel = data.funnelSteps && data.funnelSteps.length > 0;
  const hasChart = data.chart.type !== 'none' && data.chart.data.length > 0;

  return (
    <div style={{ width, height, position: 'relative', overflow: 'hidden', fontFamily: "'Inter', sans-serif", background: pageBg }}>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: `${24 * s}px ${pad}px ${20 * s}px`, gap: 14 * s }}>

        {/* ═══ HERO CARD ═══ */}
        <div style={{
          background: cardBg, borderRadius: radius, padding: `${28 * s}px ${32 * s}px`,
          boxShadow: shadow, position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative orb */}
          <div style={{ position: 'absolute', top: -50 * s, right: -50 * s, width: 200 * s, height: 200 * s, borderRadius: '50%', background: `linear-gradient(135deg, rgba(224,64,251,0.1), rgba(107,92,231,0.08))` }} />

          {/* Tag */}
          <div style={{
            display: 'inline-block', background: `linear-gradient(135deg, rgba(107,92,231,0.1), rgba(224,64,251,0.08))`,
            padding: `${3 * s}px ${12 * s}px`, borderRadius: 100, marginBottom: 12 * s,
            fontFamily: "'Inter', sans-serif", fontSize: 10 * s, fontWeight: 600, color: purple,
            letterSpacing: 1.5 * s, textTransform: 'uppercase' as const,
          }}>
            {data.tagline || 'Case Study'}
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 30 * s, fontWeight: 800, color: titleCol, lineHeight: 1.15,
            margin: 0, marginBottom: 10 * s, maxWidth: '75%', whiteSpace: 'pre-line',
          }}>
            {data.headline}
          </h1>
          <p style={{ fontSize: 13 * s, color: labelCol, margin: 0, marginBottom: 20 * s, maxWidth: '70%', lineHeight: 1.5 }}>
            {data.sections[0]?.intro || `${data.companyName} — ${data.industry}`}
          </p>

          {/* Client logo badge */}
          {data.clientLogoUrl && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10 * s,
              border: `1.5px solid #e5e7eb`, borderRadius: 10 * s,
              padding: `${8 * s}px ${18 * s}px`, background: '#fafafa', marginBottom: 16 * s,
            }}>
              <img src={data.clientLogoUrl} alt={data.companyName} style={{ height: 20 * s, objectFit: 'contain' as const }} />
              <div>
                <div style={{ fontSize: 12 * s, fontWeight: 800, color: titleCol, letterSpacing: 0.5 * s }}>{data.companyName}</div>
                <div style={{ fontSize: 9 * s, color: labelCol }}>{data.industry}</div>
              </div>
            </div>
          )}

          {/* Stats strip */}
          <div style={{
            display: 'flex', background: '#e5e7eb', gap: 1, borderRadius: 12 * s, overflow: 'hidden',
            border: `1.5px solid #e5e7eb`,
          }}>
            {data.metrics.map((m, i) => (
              <div key={i} style={{ flex: 1, background: cardBg, padding: `${14 * s}px ${16 * s}px` }}>
                <div style={{ fontSize: 9.5 * s, fontWeight: 500, color: labelCol, textTransform: 'uppercase' as const, letterSpacing: 0.8 * s, marginBottom: 4 * s }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 14 * s, fontWeight: 700, color: titleCol, lineHeight: 1.2 }}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ TWO-COLUMN: Ausgangssituation + Funnel ═══ */}
        <div style={{ display: 'flex', gap: 14 * s }}>
          {/* Section text */}
          <div style={{
            flex: 1, background: cardBg, borderRadius: radius, padding: `${24 * s}px ${28 * s}px`,
            boxShadow: shadow,
          }}>
            <div style={{ fontSize: 10 * s, fontWeight: 600, color: labelCol, letterSpacing: 1.5 * s, textTransform: 'uppercase' as const, marginBottom: 6 * s }}>
              {data.sections[0]?.title || 'Ausgangssituation'}
            </div>
            <h2 style={{ fontSize: 20 * s, fontWeight: 800, color: titleCol, margin: 0, marginBottom: 14 * s, lineHeight: 1.2 }}>
              {data.sections[0]?.title === 'Ausgangssituation' ? 'Viel Potenzial — fehlende Skalierung' : data.sections[0]?.title}
            </h2>
            {data.sections[0]?.bullets.map((b, j) => (
              <div key={j} style={{ display: 'flex', gap: 8 * s, alignItems: 'flex-start', marginBottom: 7 * s }}>
                <div style={{ width: 6 * s, height: 6 * s, borderRadius: '50%', background: `linear-gradient(135deg, ${purple}, ${pink})`, marginTop: 6 * s, flexShrink: 0 }} />
                <span style={{ fontSize: 12.5 * s, color: bodyCol, lineHeight: 1.55 }}>{b}</span>
              </div>
            ))}
          </div>

          {/* Funnel mock dashboard */}
          {hasFunnel && (
            <div style={{
              flex: 1, background: cardBg, borderRadius: radius,
              boxShadow: shadow, overflow: 'hidden',
            }}>
              {/* Dashboard topbar */}
              <div style={{
                background: '#f8f9fc', borderBottom: '1px solid #e5e7eb',
                padding: `${8 * s}px ${16 * s}px`, display: 'flex', alignItems: 'center', gap: 6 * s,
              }}>
                <div style={{ width: 7 * s, height: 7 * s, borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: 10 * s, fontWeight: 600, color: labelCol, letterSpacing: 0.5 * s }}>Lead Funnel Overview</span>
              </div>
              <div style={{ padding: `${12 * s}px ${16 * s}px`, display: 'flex', flexDirection: 'column', gap: 8 * s }}>
                {data.funnelSteps.map((step, i) => {
                  const maxPct = Math.max(...data.funnelSteps.map(f => f.pct), 1);
                  const widthPct = Math.max((step.pct / maxPct) * 100, 4);
                  const stepColor = step.color || accent;
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 * s, marginBottom: 3 * s }}>
                        <span style={{ color: labelCol }}>{step.label}</span>
                        <span style={{ fontWeight: 700, color: titleCol }}>{step.value} {step.pct < 100 ? `(${step.pct}%)` : ''}</span>
                      </div>
                      <div style={{ height: 5 * s, borderRadius: 100, background: '#f0f0f0', overflow: 'hidden' }}>
                        <div style={{ width: `${widthPct}%`, height: '100%', borderRadius: 100, background: stepColor }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ═══ TWO-COLUMN: Lösung + Metric Cards ═══ */}
        <div style={{ display: 'flex', gap: 14 * s }}>
          {/* Metric cards left */}
          <div style={{
            width: 280 * s, flexShrink: 0,
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 * s,
          }}>
            {[
              { val: data.heroValue, label: data.heroLabel, gradient: true },
              { val: data.metrics[3]?.value || '8', label: data.metrics[3]?.label || 'Opportunities', gradient: true },
              { val: '3-Step', label: 'Email-Sequenz', gradient: false },
              { val: '4 Wochen', label: 'Laufzeit', gradient: false },
            ].map((card, i) => (
              <div key={i} style={{
                borderRadius: 12 * s, padding: `${14 * s}px ${16 * s}px`,
                background: card.gradient ? `linear-gradient(135deg, ${accentDark}, ${accent})` : '#f0f4ff',
                color: card.gradient ? '#fff' : titleCol,
              }}>
                <div style={{ fontSize: 22 * s, fontWeight: 800, lineHeight: 1, marginBottom: 3 * s, color: card.gradient ? '#fff' : accentDark }}>
                  {card.val}
                </div>
                <div style={{ fontSize: 9.5 * s, fontWeight: 500, opacity: card.gradient ? 0.75 : 1, color: card.gradient ? undefined : labelCol }}>
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          {/* Lösung text right */}
          <div style={{
            flex: 1, background: cardBg, borderRadius: radius, padding: `${24 * s}px ${28 * s}px`,
            boxShadow: shadow,
          }}>
            <div style={{ fontSize: 10 * s, fontWeight: 600, color: labelCol, letterSpacing: 1.5 * s, textTransform: 'uppercase' as const, marginBottom: 6 * s }}>
              {data.sections[1]?.title || 'Lösung'}
            </div>
            <h2 style={{ fontSize: 20 * s, fontWeight: 800, color: titleCol, margin: 0, marginBottom: 6 * s, lineHeight: 1.2 }}>
              Automatisierte Ansprache mit System
            </h2>
            {data.sections[1]?.intro && (
              <p style={{ fontSize: 11.5 * s, color: labelCol, fontStyle: 'italic', margin: `0 0 ${12 * s}px`, lineHeight: 1.4 }}>{data.sections[1].intro}</p>
            )}
            {data.sections[1]?.bullets.map((b, j) => (
              <div key={j} style={{ display: 'flex', gap: 8 * s, alignItems: 'flex-start', marginBottom: 6 * s }}>
                <div style={{ width: 6 * s, height: 6 * s, borderRadius: '50%', background: `linear-gradient(135deg, ${purple}, ${pink})`, marginTop: 6 * s, flexShrink: 0 }} />
                <span style={{ fontSize: 12 * s, color: bodyCol, lineHeight: 1.55 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ ERGEBNISSE — big metric cards + results table ═══ */}
        <div style={{
          background: cardBg, borderRadius: radius, padding: `${24 * s}px ${28 * s}px`,
          boxShadow: shadow, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ fontSize: 10 * s, fontWeight: 600, color: labelCol, letterSpacing: 1.5 * s, textTransform: 'uppercase' as const, marginBottom: 4 * s }}>
            {data.sections[2]?.title || 'Ergebnisse'}
          </div>
          <h2 style={{ fontSize: 20 * s, fontWeight: 800, color: titleCol, margin: 0, marginBottom: 16 * s, lineHeight: 1.2 }}>
            Messbare Erfolge
          </h2>

          {/* Three big metric cards */}
          <div style={{ display: 'flex', gap: 10 * s, marginBottom: 16 * s }}>
            {data.metrics.slice(0, 3).map((m, i) => {
              const colors = [`linear-gradient(135deg, ${accentDark}, ${accent})`, `linear-gradient(135deg, ${purple}, #8B5CF6)`, `linear-gradient(135deg, #E040FB, ${purple})`];
              return (
                <div key={i} style={{
                  flex: 1, borderRadius: 12 * s, padding: `${16 * s}px ${18 * s}px`,
                  background: colors[i], color: '#fff', textAlign: 'center' as const,
                }}>
                  <div style={{ fontSize: 28 * s, fontWeight: 800, lineHeight: 1, marginBottom: 4 * s }}>{m.value}</div>
                  <div style={{ fontSize: 10 * s, fontWeight: 500, opacity: 0.8 }}>{m.label}</div>
                </div>
              );
            })}
          </div>

          {/* Results table */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', borderBottom: `2px solid #e5e7eb`, paddingBottom: 6 * s, marginBottom: 6 * s }}>
              <div style={{ flex: 1, fontSize: 10 * s, fontWeight: 600, color: labelCol, textTransform: 'uppercase' as const, letterSpacing: 0.8 * s }}>Kennzahl</div>
              <div style={{ width: 200 * s, fontSize: 10 * s, fontWeight: 600, color: labelCol, textTransform: 'uppercase' as const, letterSpacing: 0.8 * s }}>Ergebnis</div>
            </div>
            {data.sections[2]?.bullets.map((b, j) => {
              const parts = b.split(/[—–:]/);
              const label = parts[0]?.trim() || b;
              const val = parts[1]?.trim() || '';
              return (
                <div key={j} style={{
                  display: 'flex', padding: `${5 * s}px 0`,
                  borderBottom: `1px solid #f0f0f0`,
                }}>
                  <div style={{ flex: 1, fontSize: 12 * s, color: bodyCol }}>{label}</div>
                  <div style={{ width: 200 * s, fontSize: 12 * s, fontWeight: 600, color: titleCol }}>{val}</div>
                </div>
              );
            })}
          </div>

          {/* Quote */}
          {data.quote && (
            <div style={{ borderLeft: `3px solid ${purple}`, paddingLeft: 14 * s, marginTop: 12 * s }}>
              <span style={{ fontSize: 13 * s, fontStyle: 'italic', color: labelCol, lineHeight: 1.5 }}>{data.quote}</span>
            </div>
          )}
        </div>

        {/* ═══ CTA BAND ═══ */}
        <div style={{
          background: `linear-gradient(135deg, ${accentDark}, ${accent})`,
          borderRadius: radius, padding: `${24 * s}px ${32 * s}px`,
          textAlign: 'center' as const, color: '#fff',
        }}>
          <div style={{ fontSize: 20 * s, fontWeight: 800, marginBottom: 6 * s }}>
            {data.ctaText || 'Erstgespräch vereinbaren'}
          </div>
          {data.ctaSub && <div style={{ fontSize: 12 * s, opacity: 0.8, marginBottom: 10 * s }}>{data.ctaSub}</div>}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20 * s }}>
            <span style={{ fontSize: 11 * s, fontWeight: 600, opacity: 0.9 }}>{data.footerLeft || 'cegtec.net'}</span>
          </div>
        </div>

        {/* ═══ FOOTER ═══ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${4 * s}px ${8 * s}px` }}>
          <img src={LOGO_URL} alt="CegTec" style={{ height: 14 * s, opacity: 0.35, ...logoFilter('#f0f0ff') }} />
          <span style={{ fontSize: 8 * s, color: labelCol, opacity: 0.4 }}>© CegTec GmbH · {data.footerRight || 'GTM Engineering Partner'}</span>
        </div>
      </div>
    </div>
  );
}
