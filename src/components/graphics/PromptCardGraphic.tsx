import { LOGO_URL } from '../../utils/assets';
import { FONTS } from '../../utils/cegtecTheme';

// ── Data Interface ──────────────────────────────────────────────

export interface PromptCardData {
  topLabel: string;      // product name, e.g. "CegTec Code v1.0"
  headline: string;      // workspace line, e.g. "~/cegtec/campaigns/cold-outreach"
  subline: string;       // model line, e.g. "Opus 4.6 · Cold Outreach Builder"
  userPrompt: string;    // simulated user input
  promptText: string;    // the generated prompt / output
  bottomLine: string;    // status footer
  metaLabel?: string;    // right-top title bar label, e.g. "outreach-builder — 1/3"
  backgroundColor?: string;
  textColor?: string;
  labelColor?: string;
  filledColor?: string;
  borderColor?: string;
  warningColor?: string;
  promptFontSize?: number;  // default 42 — use ~34 for dense carousel slides
}

export const defaultPromptCardData: PromptCardData = {
  topLabel: 'CegTec Code v1.0',
  headline: '~/cegtec/campaigns/cold-outreach',
  subline: 'Opus 4.6 · Cold Outreach V3 · DACH B2B',
  userPrompt: 'Reply Rate > 10 %. Bau mir den Prompt.',
  promptFontSize: 16,
  promptText: `● Read(22 Kampagnen · Ø 11 % Reply)
  ⎿ Patterns geladen
● Write(cold-outreach-v3.md)

--- COPY START ---
PFLICHT-INPUT — ohne diese: STOPPE.
NIEMALS Zahlen/Namen/Anker erfinden.

1. SENDER — Firma + Produkt + USP
2. EMPFÄNGER — Firma, Stadt, Rolle
3. ANKER (echt, max 14 Tage alt)
   News > Stelle > LinkedIn > Podcast
4. QUICK WIN — Asset, versandfertig
5a. REF PRIMÄR — Ergebnis + Zeitraum
5b. REF SEKUNDÄR — anderer Angle
6. RESSOURCE — URL Case Study
7. SIGNATUR — Name, Titel, Telefon
Wenn 3/4/5a fehlt → STOPPE.
{{firma}} = Kurzname oder Nachname

TIMING — Delays werden LÄNGER
Tag 1 → 4 (+3) → 9 (+5) → 16 (+7)

EMAIL 1 — "Problem + Quick Win"
• Subject: {{firma}} + Nutzen, max 5 W.
• Preview: 1 Satz, max 90 Zeichen
• Anker Feld 3 + Quick Win Feld 4
• KEIN Meeting-CTA. Max 80 Wörter.

EMAIL 2 — "Social Proof + Risk Reversal"
• Subject: Re: [E1] (Threading!)
• Ref 5a + Zahl + Zeitraum
• Risk Reversal. Max 60 Wörter.

EMAIL 3 — "Einwand-Abfrage" (STÄRKSTER HEBEL)
• Subject: Re: [E1]
• "Bevor ich aufgebe — der Grund?"
    [ ] Kein Budget
    [ ] Zeitpunkt passt nicht
    [ ] Bereits andere Lösung
    [ ] Sonstiges
• Max 50 Wörter

EMAIL 4 — "Akte schließen" (Breakup)
• Subject: Akte [Firma] / [Stadt]
• Ref 5b oder USP-Zahl. Max 40 W.

VERBOTEN:
"Synergien", "ganzheitlich", "innovativ"
"Ich hoffe diese Mail findet Sie wohlauf"
Ausrufezeichen · Emojis · Konjunktiv
Generische Preview-Texte

PFLICHT:
Du/Sie konsistent (DACH = Sie)
Jede Email kürzer als vorige
Subject max 50 Zeichen
Preview immer, Pattern-brechend

OUTPUT: SUBJECT · PREVIEW · BODY · WORTZAHL
--- COPY END ---

  ⎿ V3 · 98 Zeilen · 18 Hard Rules`,
  bottomLine: 'cegtec.net  ·  Cold Outreach Prompt V3',
  backgroundColor: '#1A1815',
  textColor: '#E8E6E3',
  labelColor: '#8A8278',
  filledColor: '#D97757',
  borderColor: '#2E2A26',
  warningColor: '#5EC5D1',
};

// ── Component ───────────────────────────────────────────────────

const REF_W = 1080;
const REF_H = 1350;

export function PromptCardGraphic({
  data,
  width,
  height,
}: {
  data: PromptCardData;
  width: number;
  height: number;
}) {
  const s = Math.min(width / REF_W, height / REF_H);

  const bg = data.backgroundColor || '#1A1815';
  const textCol = data.textColor || '#E8E6E3';
  const dim = data.labelColor || '#8A8278';
  const accent = data.filledColor || '#D97757';
  const cyan = data.warningColor || '#5EC5D1';
  const borderCol = data.borderColor || '#2E2A26';
  const cardBg = '#131110';

  const promptSize = data.promptFontSize || 42;
  // Scale header/prompt proportionally when promptFontSize is small (dense mode)
  const dense = promptSize < 30;
  const headerSize = dense ? 28 : 40;
  const versionSize = dense ? 18 : 24;
  const sublineSize = dense ? 18 : 26;
  const headlineSize = dense ? 16 : 22;
  const userPromptSize = dense ? 30 : 44;
  const headerMargin = dense ? 8 : 14;
  const pad = 32 * s;
  const lines = data.promptText.split('\n');

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
      {/* ── Atmospheric backdrop ── */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <defs>
          <filter id="pc-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={140 * s} />
          </filter>
          <filter id="pc-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="overlay" />
          </filter>
        </defs>

        <rect width={width} height={height} fill={bg} />
        <ellipse cx={width * 0.15} cy={height * 0.1} rx={320 * s} ry={220 * s}
          fill={accent} opacity={0.08} filter="url(#pc-blur)" />
        <ellipse cx={width * 0.9} cy={height * 0.95} rx={280 * s} ry={200 * s}
          fill={accent} opacity={0.05} filter="url(#pc-blur)" />
        <rect width={width} height={height} opacity="0.025" filter="url(#pc-noise)" />
      </svg>

      {/* ── Terminal Card ── */}
      <div style={{
        position: 'absolute',
        inset: `${pad}px`,
        background: cardBg,
        borderRadius: 16 * s,
        border: `1px solid ${borderCol}`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.02) inset`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* ── Title Bar (light chrome) ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18 * s,
          padding: `${20 * s}px ${28 * s}px`,
          borderBottom: `1px solid #E5E2DD`,
          background: '#F5F2EC',
        }}>
          <div style={{ display: 'flex', gap: 10 * s }}>
            <span style={{ width: 18 * s, height: 18 * s, borderRadius: '50%', background: '#FF5F57' }} />
            <span style={{ width: 18 * s, height: 18 * s, borderRadius: '50%', background: '#FEBC2E' }} />
            <span style={{ width: 18 * s, height: 18 * s, borderRadius: '50%', background: '#28C840' }} />
          </div>
          <img src={LOGO_URL} alt="CegTec" style={{
            height: 36 * s,
            width: 'auto',
            display: 'block',
            marginLeft: 12 * s,
          }} />
          <span style={{
            marginLeft: 'auto',
            fontFamily: FONTS.mono,
            fontSize: 24 * s,
            color: '#6B6258',
            letterSpacing: 0.5 * s,
          }}>
            {data.metaLabel || 'outreach-builder — 82×32'}
          </span>
        </div>

        {/* ── Content Body ── */}
        <div style={{
          flex: 1,
          padding: `${18 * s}px ${24 * s}px`,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden',
        }}>

          {/* ── Session Header ── */}
          <div style={{ marginBottom: headerMargin * s }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 10 * s,
              fontFamily: FONTS.mono, fontSize: headerSize * s,
              marginBottom: 4 * s,
            }}>
              <span style={{ color: textCol, fontWeight: 700 }}>
                {data.topLabel.split(' v')[0]}
              </span>
              <span style={{ color: cyan, fontSize: versionSize * s }}>
                v{data.topLabel.split(' v')[1] || '1.0'}
              </span>
            </div>
            <div style={{
              fontFamily: FONTS.mono, fontSize: sublineSize * s, color: dim,
            }}>
              {data.subline}
            </div>
            <div style={{
              fontFamily: FONTS.mono, fontSize: headlineSize * s, color: dim,
              opacity: 0.75, marginTop: 2 * s,
            }}>
              {data.headline}
            </div>
          </div>

          {/* ── Divider ── */}
          <div style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${borderCol}, transparent)`,
            marginBottom: 16 * s,
          }} />

          {/* ── User Prompt ── */}
          <div style={{
            display: 'flex', gap: 10 * s,
            fontFamily: FONTS.mono,
            fontSize: userPromptSize * s,
            lineHeight: 1.3,
            marginBottom: headerMargin * s,
          }}>
            <span style={{ color: accent, fontWeight: 700, flexShrink: 0 }}>&gt;</span>
            <span style={{ color: textCol, fontWeight: 600 }}>
              {data.userPrompt}
            </span>
          </div>

          {/* ── Prompt Output (Tool Calls + Copy Block) ── */}
          <div style={{
            fontFamily: FONTS.mono,
            fontSize: promptSize * s,
            lineHeight: 1.4,
            color: textCol,
            flex: 1,
            overflow: 'hidden',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {(() => {
              const startIdx = lines.findIndex(l => l.trim() === '--- COPY START ---');
              const endIdx = lines.findIndex(l => l.trim() === '--- COPY END ---');
              const hasBlock = startIdx !== -1 && endIdx !== -1 && endIdx > startIdx;

              const renderLine = (line: string, i: number, insideBlock = false) => {
                const trimmed = line.trim();
                const isToolCall = trimmed.startsWith('●');
                const isToolResult = trimmed.startsWith('⎿');
                const isEmailHeader = /^EMAIL \d+/i.test(trimmed);
                const isRulesHeader = /^REGELN:?$/i.test(trimmed);
                const isTimingHeader = /^TIMING:/i.test(trimmed);
                const isBullet = trimmed.startsWith('•');
                const isCheckbox = trimmed.startsWith('[ ]');
                const isBracket = /^\[[A-ZÄÖÜ].+\]$/.test(trimmed);

                if (isToolCall) {
                  const match = line.match(/^(\s*)●\s+(\w+)\((.*)\)$/);
                  if (match) {
                    const [, indent, fn, args] = match;
                    return (
                      <div key={i} style={{ marginTop: i > 0 ? 6 * s : 0 }}>
                        <span>{indent}</span>
                        <span style={{ color: accent, fontWeight: 700 }}>● </span>
                        <span style={{ color: textCol, fontWeight: 600 }}>{fn}</span>
                        <span style={{ color: dim }}>(</span>
                        <span style={{ color: cyan }}>{args}</span>
                        <span style={{ color: dim }}>)</span>
                      </div>
                    );
                  }
                }
                if (isToolResult) return <div key={i} style={{ color: dim, fontSize: (promptSize - 6) * s }}>{line}</div>;
                if (isEmailHeader) return <div key={i} style={{ color: accent, fontWeight: 700, marginTop: 10 * s, marginBottom: 2 * s }}>{line}</div>;
                if (isRulesHeader || isTimingHeader) return <div key={i} style={{ color: accent, fontWeight: 700, marginTop: 10 * s }}>{line}</div>;
                if (isBracket) return <div key={i} style={{ color: cyan, fontWeight: 600, fontStyle: 'italic' }}>{line}</div>;
                if (isCheckbox) return <div key={i} style={{ color: cyan, opacity: 0.85 }}>{line}</div>;
                if (isBullet) return <div key={i} style={{ color: insideBlock ? textCol : textCol, opacity: 0.88 }}>{line}</div>;
                return <div key={i} style={{ color: textCol, opacity: 0.92 }}>{line || '\u00A0'}</div>;
              };

              if (!hasBlock) return lines.map((l, i) => renderLine(l, i));

              const before = lines.slice(0, startIdx);
              const inside = lines.slice(startIdx + 1, endIdx);
              const after = lines.slice(endIdx + 1);

              return (
                <>
                  {before.map((l, i) => renderLine(l, i))}

                  {/* ── COPY BLOCK ── */}
                  <div style={{
                    marginTop: 10 * s,
                    marginBottom: 10 * s,
                    border: `2px dashed ${accent}`,
                    borderRadius: 10 * s,
                    background: 'rgba(217,119,87,0.06)',
                    overflow: 'hidden',
                    boxShadow: `0 0 28px rgba(217,119,87,0.12)`,
                  }}>
                    {/* Header */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: `${10 * s}px ${16 * s}px`,
                      borderBottom: `1.5px dashed ${accent}40`,
                      background: 'rgba(217,119,87,0.08)',
                    }}>
                      <span style={{ fontSize: (promptSize - 12) * s, color: accent, fontWeight: 700, letterSpacing: 1.5 * s, textTransform: 'uppercase' as const }}>
                        ▼ PROMPT-BAUSTEIN
                      </span>
                      <span style={{ fontSize: 26 * s, color: dim, fontFamily: FONTS.mono }}>
                        cold-outreach.md
                      </span>
                    </div>

                    {/* Prompt body */}
                    <div style={{
                      padding: `${12 * s}px ${16 * s}px`,
                    }}>
                      {inside.map((l, i) => renderLine(l, i, true))}
                    </div>
                  </div>

                  {after.map((l, i) => renderLine(l, i))}
                </>
              );
            })()}
          </div>

          {/* ── Footer Status ── */}
          <div style={{
            marginTop: 14 * s,
            paddingTop: 10 * s,
            borderTop: `1px solid ${borderCol}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: FONTS.mono,
            fontSize: 26 * s,
            color: dim,
          }}>
            <span>
              <span style={{ color: cyan }}>●</span> {data.bottomLine}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
