import { LOGO_URL } from '../../utils/assets';

export interface PyramidLayer {
  label: string;
  description: string;
  difficulty: string;
}

export interface KeyFact {
  value: string;
  label: string;
}

export interface AgentFriendlyData {
  title: string;
  subtitle: string;
  sourceLabel: string;
  badgeText: string;
  layers: PyramidLayer[];
  keyFacts: KeyFact[];
  toolsLine: string;
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

export const defaultAgentFriendlyData: AgentFriendlyData = {
  title: 'So machst du deine Website f\u00fcr AI-Agents lesbar',
  subtitle: '95% aller Websites sind f\u00fcr ChatGPT, Claude & Perplexity unsichtbar.',
  sourceLabel: 'CEGTEC ACADEMY',
  badgeText: 'AGENT-FRIENDLY GUIDE',
  layers: [
    { label: 'SEMANTISCHES HTML', description: 'Heading-Hierarchie, <article>, <section>, Alt-Texte', difficulty: 'Basics \u2013 2h Setup' },
    { label: 'SCHEMA MARKUP', description: 'JSON-LD Structured Data (Organization, Article, FAQ, HowTo)', difficulty: 'Basics \u2013 2h Setup' },
    { label: 'LLMS.TXT', description: 'Kuratierte Markdown-Datei im Root \u2013 sagt AI wo das Wichtigste ist', difficulty: 'Standard \u2013 15 Min' },
    { label: 'CONTENT KNOWLEDGE GRAPH', description: 'Entit\u00e4ten & Beziehungen zwischen Seiten verkn\u00fcpfen', difficulty: 'Advanced' },
    { label: 'MCP', description: 'Model Context Protocol \u2013 AI nutzt deine Website, nicht nur lesen', difficulty: 'Advanced' },
  ],
  keyFacts: [
    { value: '2,5x', label: 'h\u00f6here Chance in AI-Antworten mit Schema Markup' },
    { value: '<0,005%', label: 'der Websites nutzen llms.txt (Stand M\u00e4rz 2026)' },
    { value: '30%', label: 'weniger Token-Verbrauch mit Markdown vs. HTML' },
  ],
  toolsLine: 'Unterst\u00fctzt von: Claude \u00b7 ChatGPT \u00b7 Perplexity \u00b7 Google AI Overviews \u00b7 Yoast \u00b7 Cloudflare \u00b7 Vercel',
  resultMetrics: '',
  resultSource: '',
  backgroundColor: '#F5F5F0',
  textColor: '#1A1A2E',
  labelColor: '#8A8A9A',
  filledColor: '#2563EB',
  emptyColor: '#D4D4D8',
  borderColor: '#E5E5EA',
  warningColor: '#1A3FD4',
};

function adjustBrightness(hex: string, amount: number): string {
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(1, 3), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(3, 5), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(5, 7), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const MONO = "'IBM Plex Mono', 'JetBrains Mono', 'SF Mono', monospace";
const DISPLAY = "'DM Sans', 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif";

// Layer icons (bottom to top): HTML tags, JSON braces, TXT file, graph nodes, plug/protocol
const LAYER_ICONS = [
  // HTML tags
  (sz: number, color: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <path d="M7 8L3 12l4 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 8l4 4-4 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 4l-4 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  // JSON braces
  (sz: number, color: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <path d="M8 3H6a2 2 0 00-2 2v4a2 2 0 01-2 2 2 2 0 012 2v4a2 2 0 002 2h2" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M16 3h2a2 2 0 012 2v4a2 2 0 002 2 2 2 0 00-2 2v4a2 2 0 01-2 2h-2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  // File/TXT
  (sz: number, color: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 2v6h6" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 13h6M9 17h4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  // Graph / knowledge graph
  (sz: number, color: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <circle cx="6" cy="6" r="3" stroke={color} strokeWidth="2" />
      <circle cx="18" cy="6" r="3" stroke={color} strokeWidth="2" />
      <circle cx="12" cy="18" r="3" stroke={color} strokeWidth="2" />
      <path d="M8.5 7.5L10.5 16M15.5 7.5L13.5 16M9 6h6" stroke={color} strokeWidth="1.5" />
    </svg>
  ),
  // Plug / protocol
  (sz: number, color: string) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
      <path d="M12 2v4M8 4v2M16 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <rect x="6" y="6" width="12" height="8" rx="2" stroke={color} strokeWidth="2" />
      <path d="M10 14v4a2 2 0 002 2v0a2 2 0 002-2v-4" stroke={color} strokeWidth="2" />
    </svg>
  ),
];

export function AgentFriendlyGraphic({
  data,
  width,
  height,
}: {
  data: AgentFriendlyData;
  width: number;
  height: number;
}) {
  const s = Math.min(width / 1080, height / 1920);

  const isDark = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  };

  const bg = data.backgroundColor || '#F5F5F0';
  const dark = isDark(bg);
  const warning = data.warningColor || '#1A3FD4';
  const borderCol = data.borderColor || '#E5E5EA';
  const textFilled = data.filledColor || '#2563EB';
  const textMuted = data.labelColor || '#8A8A9A';
  const textDim = adjustBrightness(textMuted, -18);
  const titleCol = data.textColor || '#1A1A2E';

  const padX = 64 * s;
  const padTop = 76 * s;
  const iconSz = 32 * s;

  // Opacity levels for layers (bottom = darkest, top = lightest)
  const layerCount = data.layers.length;
  const getLayerOpacity = (i: number) => {
    const min = 0.12;
    const max = 0.55;
    return max - (i / (layerCount - 1)) * (max - min);
  };

  // Reversed: index 0 is bottom (darkest), render bottom-up
  const layersReversed = [...data.layers].reverse();

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
          <filter id="af-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="overlay" />
          </filter>
        </defs>
        <rect width={width} height={height} opacity="0.02" filter="url(#af-noise)" />
        {Array.from({ length: Math.floor(height / (5 * s)) }).map((_, i) => (
          <rect
            key={i}
            x={0}
            y={i * 5 * s}
            width={width}
            height={1 * s}
            fill={dark ? '#ffffff' : '#000000'}
            opacity={dark ? 0.006 : 0.01}
          />
        ))}
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
          justifyContent: 'space-between',
          padding: `${padTop}px ${padX}px ${64 * s}px`,
        }}
      >
        {/* HEADER */}
        <div>
          {/* Logo row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 * s }}>
            <img src={LOGO_URL} alt="CegTec" style={{ height: 36 * s, opacity: 0.85 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 * s }}>
              <span
                style={{
                  fontSize: 15 * s,
                  fontWeight: 600,
                  color: textDim,
                  letterSpacing: 3 * s,
                  textTransform: 'uppercase',
                }}
              >
                {data.sourceLabel}
              </span>
              <span
                style={{
                  width: 9 * s,
                  height: 9 * s,
                  borderRadius: '50%',
                  background: warning,
                  opacity: 0.5,
                  display: 'inline-block',
                }}
              />
            </div>
          </div>

          {/* Badge */}
          <div
            style={{
              display: 'inline-block',
              padding: `${8 * s}px ${22 * s}px`,
              border: `2px solid ${textFilled}`,
              borderRadius: 6 * s,
              fontSize: 17 * s,
              fontWeight: 700,
              color: textFilled,
              letterSpacing: 3.5 * s,
              marginBottom: 30 * s,
            }}
          >
            {data.badgeText}
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: DISPLAY,
              fontSize: 68 * s,
              fontWeight: 800,
              color: titleCol,
              lineHeight: 1.08,
              letterSpacing: -2 * s,
              margin: 0,
              marginBottom: 18 * s,
            }}
          >
            {data.title}
          </h1>
          <p
            style={{
              fontSize: 26 * s,
              color: textMuted,
              fontFamily: DISPLAY,
              fontWeight: 500,
              fontStyle: 'italic',
              margin: 0,
            }}
          >
            {data.subtitle}
          </p>
        </div>

        {/* Thin separator */}
        <div style={{ height: 1.5 * s, background: borderCol }} />

        {/* PYRAMID / LAYER MODEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {layersReversed.map((layer, ri) => {
            const originalIndex = layerCount - 1 - ri;
            const opacity = getLayerOpacity(ri);
            const iconFn = LAYER_ICONS[originalIndex % LAYER_ICONS.length];
            const isLast = ri === layerCount - 1;

            // Pyramid narrowing: top layers slightly indented
            const indent = ri * 12 * s;

            return (
              <div key={ri}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18 * s,
                    padding: `${26 * s}px ${28 * s}px`,
                    marginLeft: indent,
                    marginRight: indent,
                    border: `1.5px solid ${hexToRgba(textFilled, 0.2 + opacity * 0.5)}`,
                    borderRadius: 10 * s,
                    background: hexToRgba(textFilled, opacity),
                    position: 'relative',
                  }}
                >
                  {/* Layer number */}
                  <div
                    style={{
                      width: 40 * s,
                      height: 40 * s,
                      borderRadius: '50%',
                      background: hexToRgba(textFilled, Math.min(opacity * 2.5, 1)),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 18 * s, fontWeight: 700, color: '#fff' }}>{originalIndex + 1}</span>
                  </div>

                  {/* Icon */}
                  <div style={{ flexShrink: 0 }}>{iconFn(iconSz, opacity > 0.3 ? '#fff' : textFilled)}</div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 * s, marginBottom: 4 * s }}>
                      <span
                        style={{
                          fontSize: 16 * s,
                          fontWeight: 700,
                          color: opacity > 0.35 ? '#fff' : textFilled,
                          letterSpacing: 2.5 * s,
                        }}
                      >
                        {layer.label}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 17 * s,
                        color: opacity > 0.35 ? 'rgba(255,255,255,0.85)' : titleCol,
                        fontFamily: DISPLAY,
                        fontWeight: 500,
                        lineHeight: 1.3,
                      }}
                    >
                      {layer.description}
                    </div>
                  </div>

                  {/* Difficulty badge */}
                  <div
                    style={{
                      flexShrink: 0,
                      fontSize: 12 * s,
                      fontWeight: 600,
                      color: opacity > 0.35 ? 'rgba(255,255,255,0.7)' : textMuted,
                      letterSpacing: 1.5 * s,
                      textTransform: 'uppercase',
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {layer.difficulty}
                  </div>
                </div>

                {/* Connector line */}
                {!isLast && (
                  <div style={{ display: 'flex', justifyContent: 'center', height: 16 * s }}>
                    <div style={{ width: 3 * s, height: '100%', background: textFilled, opacity: 0.2, borderRadius: 2 }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* KEY FACTS */}
        <div
          style={{
            display: 'flex',
            gap: 16 * s,
          }}
        >
          {data.keyFacts.map((fact, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                padding: `${32 * s}px ${20 * s}px`,
                borderRadius: 10 * s,
                border: `1.5px solid ${borderCol}`,
                background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 50 * s,
                  fontWeight: 800,
                  fontFamily: DISPLAY,
                  color: textFilled,
                  lineHeight: 1.1,
                  marginBottom: 10 * s,
                }}
              >
                {fact.value}
              </div>
              <div
                style={{
                  fontSize: 14 * s,
                  color: textMuted,
                  lineHeight: 1.4,
                  fontFamily: MONO,
                }}
              >
                {fact.label}
              </div>
            </div>
          ))}
        </div>

        {/* TOOLS LINE */}
        <div
          style={{
            fontSize: 14 * s,
            color: textMuted,
            textAlign: 'center',
            fontFamily: MONO,
            letterSpacing: 0.5 * s,
          }}
        >
          {data.toolsLine}
        </div>

        {/* RESULT BANNER (only if content provided) */}
        {data.resultMetrics && (
          <div
            style={{
              padding: `${26 * s}px ${32 * s}px`,
              borderRadius: 12 * s,
              border: `2px solid ${textFilled}`,
              background: dark ? 'rgba(37,99,235,0.06)' : 'rgba(37,99,235,0.03)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 22 * s,
                fontWeight: 600,
                color: titleCol,
                lineHeight: 1.5,
                fontFamily: DISPLAY,
                marginBottom: data.resultSource ? 10 * s : 0,
              }}
            >
              {data.resultMetrics}
            </div>
            {data.resultSource && (
              <div
                style={{
                  fontSize: 15 * s,
                  color: textFilled,
                  fontWeight: 700,
                  fontFamily: MONO,
                  letterSpacing: 1 * s,
                }}
              >
                {data.resultSource}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
