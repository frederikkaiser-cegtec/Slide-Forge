import { useState, useEffect, useRef, createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { X, Search, Check, Loader } from 'lucide-react';
import { LIBRARY_ASSETS, ASSET_CATEGORIES, type AssetCategory, type LibraryAsset } from '../../data/library';
import { SHAPES, SHAPE_CATEGORIES, type ShapeCategory } from '../../data/shapes';

type Tab = 'icons' | 'illustrations' | 'shapes' | 'svgrepo';

// ── unDraw ────────────────────────────────────────────────────
const UNDRAW_PRIMARY = '#6C63FF';

interface UnDrawResult {
  _id: string;
  title: string;
  newSlug: string;
  media: string;
}

const PROXY = 'https://corsproxy.io/?';

async function searchUnDraw(q: string): Promise<UnDrawResult[]> {
  const url = `https://undraw.co/api/search?q=${encodeURIComponent(q)}`;
  const res = await fetch(PROXY + encodeURIComponent(url));
  if (!res.ok) throw new Error('unDraw API error');
  const data = await res.json();
  return (data.results ?? []) as UnDrawResult[];
}

async function fetchUnDrawSvg(url: string, color: string): Promise<string> {
  const res = await fetch(PROXY + encodeURIComponent(url));
  if (!res.ok) throw new Error('SVG fetch failed');
  let svg = await res.text();
  svg = svg.replace(new RegExp(UNDRAW_PRIMARY, 'gi'), color);
  return svg;
}

// ── SVGRepo ───────────────────────────────────────────────────
interface SVGRepoResult {
  id: string;
  title: string;
  svg: string;
}

async function searchSVGRepo(query: string): Promise<SVGRepoResult[]> {
  const res = await fetch(`https://api.svgrepo.com/svg/search?query=${encodeURIComponent(query)}&limit=24`);
  if (!res.ok) throw new Error('SVGRepo error');
  const data = await res.json();
  return (data.collection ?? data.results ?? []) as SVGRepoResult[];
}

// ── Helpers ───────────────────────────────────────────────────
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  });
}

function getTablerSvg(asset: LibraryAsset): string {
  return renderToStaticMarkup(createElement(asset.Icon, { size: 24, stroke: 1.5 }));
}

// ── Cards ─────────────────────────────────────────────────────
function Card({
  id,
  name,
  copiedId,
  onCopy,
  children,
}: {
  id: string;
  name: string;
  copiedId: string | null;
  onCopy: () => void;
  children: React.ReactNode;
}) {
  const isCopied = copiedId === id;
  return (
    <button
      onClick={onCopy}
      title={`${name} — klicken zum Kopieren`}
      style={{
        background: isCopied ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isCopied ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 10,
        padding: '10px 6px 7px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        transition: 'all 0.15s',
        position: 'relative',
        minWidth: 0,
      }}
      onMouseEnter={(e) => { if (!isCopied) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}
      onMouseLeave={(e) => { if (!isCopied) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)'; }}
    >
      {children}
      <span style={{ fontSize: 9, color: isCopied ? '#818cf8' : 'rgba(255,255,255,0.3)', textAlign: 'center', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', maxWidth: '100%', wordBreak: 'break-word' }}>
        {name}
      </span>
      {isCopied && <div style={{ position: 'absolute', top: 3, right: 3, color: '#818cf8' }}><Check size={9} /></div>}
    </button>
  );
}

// ── Main Modal ────────────────────────────────────────────────
export function AssetLibraryModal({ onClose, onInsert }: { onClose: () => void; onInsert?: (svg: string) => void }) {
  const [tab, setTab] = useState<Tab>('icons');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Icons state
  const [iconCategory, setIconCategory] = useState<AssetCategory | 'all'>('all');
  const [iconSearch, setIconSearch] = useState('');

  // Shapes state
  const [shapeCategory, setShapeCategory] = useState<ShapeCategory | 'all'>('all');
  const [shapeColor, setShapeColor] = useState('#6366f1');

  // unDraw state
  const [unDrawQuery, setUnDrawQuery] = useState('');
  const [unDrawResults, setUnDrawResults] = useState<UnDrawResult[]>([]);
  const [unDrawLoading, setUnDrawLoading] = useState(false);
  const [unDrawError, setUnDrawError] = useState<string | null>(null);
  const [unDrawColor, setUnDrawColor] = useState('#6366f1');
  const [unDrawCopying, setUnDrawCopying] = useState<string | null>(null);

  // SVGRepo state
  const [svgRepoQuery, setSvgRepoQuery] = useState('');
  const [svgRepoResults, setSvgRepoResults] = useState<SVGRepoResult[]>([]);
  const [svgRepoLoading, setSvgRepoLoading] = useState(false);
  const [svgRepoError, setSvgRepoError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = (id: string, svg: string) => {
    copyToClipboard(svg);
    if (onInsert) {
      onInsert(svg);
      onClose();
      return;
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ── unDraw search debounce
  useEffect(() => {
    if (tab !== 'illustrations') return;
    if (!unDrawQuery.trim()) { setUnDrawResults([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setUnDrawLoading(true);
      setUnDrawError(null);
      try { setUnDrawResults(await searchUnDraw(unDrawQuery)); }
      catch { setUnDrawError('unDraw nicht erreichbar.'); setUnDrawResults([]); }
      finally { setUnDrawLoading(false); }
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [unDrawQuery, tab]);

  // ── SVGRepo search debounce
  useEffect(() => {
    if (tab !== 'svgrepo') return;
    if (!svgRepoQuery.trim()) { setSvgRepoResults([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSvgRepoLoading(true);
      setSvgRepoError(null);
      try { setSvgRepoResults(await searchSVGRepo(svgRepoQuery)); }
      catch { setSvgRepoError('SVGRepo nicht erreichbar.'); setSvgRepoResults([]); }
      finally { setSvgRepoLoading(false); }
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [svgRepoQuery, tab]);

  // ── Filtered lists
  const filteredIcons = LIBRARY_ASSETS.filter((a) => {
    if (iconCategory !== 'all' && a.category !== iconCategory) return false;
    if (iconSearch.trim()) {
      const q = iconSearch.toLowerCase();
      return a.name.toLowerCase().includes(q) || a.tags.some((t) => t.includes(q));
    }
    return true;
  });

  const filteredShapes = SHAPES.filter((s) =>
    shapeCategory === 'all' || s.category === shapeCategory,
  );

  // ── Styles
  const tabBtn = (active: boolean) => ({
    padding: '5px 11px', borderRadius: 7, fontSize: 11, fontWeight: 600 as const,
    cursor: 'pointer' as const, border: 'none',
    background: active ? 'rgba(99,102,241,0.2)' : 'transparent',
    color: active ? '#818cf8' : 'rgba(255,255,255,0.35)',
    transition: 'all 0.15s', whiteSpace: 'nowrap' as const,
  });

  const catBtn = (active: boolean) => ({
    padding: '3px 9px', borderRadius: 6, fontSize: 11, fontWeight: 500 as const,
    cursor: 'pointer' as const,
    border: `1px solid ${active ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)'}`,
    background: active ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
    color: active ? '#818cf8' : 'rgba(255,255,255,0.35)',
    transition: 'all 0.15s',
  });

  const searchInput = (placeholder: string, value: string, onChange: (v: string) => void, autoFocus = false) => (
    <div style={{ position: 'relative' }}>
      <Search size={12} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '7px 10px 7px 28px', fontSize: 12, color: '#f0f0f5', outline: 'none', boxSizing: 'border-box' }}
      />
    </div>
  );

  const grid8 = { display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6 } as const;
  const emptyState = (msg: string) => (
    <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>{msg}</div>
  );

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div
        style={{ background: '#12121e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, width: 740, maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f0f0f5', marginRight: 4 }}>Assets</span>
            {(['icons', 'illustrations', 'shapes', 'svgrepo'] as Tab[]).map((t) => (
              <button key={t} style={tabBtn(tab === t)} onClick={() => setTab(t)}>
                {t === 'icons' ? `Icons (${LIBRARY_ASSETS.length})` : t === 'illustrations' ? 'Illustrationen' : t === 'shapes' ? `Shapes (${SHAPES.length})` : 'SVGRepo'}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {copiedId && <span style={{ fontSize: 11, color: '#818cf8', display: 'flex', alignItems: 'center', gap: 3 }}><Check size={11} /> Kopiert</span>}
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4 }}><X size={15} /></button>
          </div>
        </div>

        {/* ── Icons tab */}
        {tab === 'icons' && (
          <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 7 }}>
            {searchInput('Suchen... (z.B. email, funnel, roi)', iconSearch, setIconSearch)}
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {ASSET_CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => setIconCategory(c.id)} style={catBtn(iconCategory === c.id)}>{c.label}</button>
              ))}
            </div>
          </div>
        )}

        {/* ── Illustrations tab controls */}
        {tab === 'illustrations' && (
          <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                {searchInput('Illustrationen suchen... (z.B. marketing, team, analytics)', unDrawQuery, setUnDrawQuery, true)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Farbe</span>
                <input
                  type="color"
                  value={unDrawColor}
                  onChange={(e) => setUnDrawColor(e.target.value)}
                  style={{ width: 28, height: 28, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, cursor: 'pointer', padding: 2, background: 'transparent' }}
                />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{unDrawColor}</span>
              </div>
            </div>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', margin: 0 }}>
              Klicken fetcht das SVG, ersetzt die Primärfarbe und kopiert es in die Zwischenablage.
            </p>
          </div>
        )}

        {/* ── Shapes tab controls */}
        {tab === 'shapes' && (
          <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', flex: 1 }}>
              {SHAPE_CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => setShapeCategory(c.id)} style={catBtn(shapeCategory === c.id)}>{c.label}</button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Vorschau-Farbe</span>
              <input
                type="color"
                value={shapeColor}
                onChange={(e) => setShapeColor(e.target.value)}
                style={{ width: 28, height: 28, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, cursor: 'pointer', padding: 2, background: 'transparent' }}
              />
            </div>
          </div>
        )}

        {/* ── SVGRepo tab controls */}
        {tab === 'svgrepo' && (
          <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={12} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
              {svgRepoLoading && <Loader size={12} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', animation: 'spin 1s linear infinite' }} />}
              <input
                type="text"
                placeholder="Millionen SVGs... (z.B. rocket, handshake, chart)"
                value={svgRepoQuery}
                onChange={(e) => setSvgRepoQuery(e.target.value)}
                autoFocus
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '7px 10px 7px 28px', fontSize: 12, color: '#f0f0f5', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        )}

        {/* Grid content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>

          {/* Icons */}
          {tab === 'icons' && (
            filteredIcons.length === 0
              ? emptyState('Keine Icons gefunden.')
              : <div style={grid8}>
                  {filteredIcons.map((asset) => (
                    <Card key={asset.id} id={asset.id} name={asset.name} copiedId={copiedId} onCopy={() => handleCopy(asset.id, getTablerSvg(asset))}>
                      <asset.Icon size={30} stroke={1.5} color={copiedId === asset.id ? '#818cf8' : 'rgba(255,255,255,0.7)'} />
                    </Card>
                  ))}
                </div>
          )}

          {/* Illustrations — unDraw */}
          {tab === 'illustrations' && (
            <>
              {unDrawLoading && <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Suche läuft...</div>}
              {unDrawError && <div style={{ textAlign: 'center', padding: '20px 0', color: '#f87171', fontSize: 12 }}>{unDrawError}</div>}
              {!unDrawLoading && !unDrawError && unDrawResults.length === 0 && emptyState(unDrawQuery.trim() ? 'Keine Illustrationen gefunden.' : 'Begriff eingeben — z.B. "team", "data", "success"')}
              {unDrawResults.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  {unDrawResults.map((r) => {
                    const id = `undraw-${r._id}`;
                    const isCopying = unDrawCopying === id;
                    const isCopied = copiedId === id;
                    return (
                      <button
                        key={r._id}
                        onClick={async () => {
                          if (isCopying) return;
                          setUnDrawCopying(id);
                          try {
                            const svg = await fetchUnDrawSvg(r.media, unDrawColor);
                            handleCopy(id, svg);
                          } catch {
                            // fallback: copy URL
                            handleCopy(id, r.media);
                          } finally {
                            setUnDrawCopying(null);
                          }
                        }}
                        title={`${r.title} — klicken zum Kopieren`}
                        style={{
                          background: isCopied ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isCopied ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)'}`,
                          borderRadius: 10, padding: 10, cursor: 'pointer',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                          transition: 'all 0.15s', position: 'relative',
                        }}
                        onMouseEnter={(e) => { if (!isCopied) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}
                        onMouseLeave={(e) => { if (!isCopied) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)'; }}
                      >
                        {isCopying
                          ? <div style={{ width: '100%', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader size={20} style={{ animation: 'spin 1s linear infinite', color: 'rgba(255,255,255,0.3)' }} /></div>
                          : <img src={r.media} alt={r.title} style={{ width: '100%', height: 80, objectFit: 'contain', filter: 'brightness(0.9)' }} />
                        }
                        <span style={{ fontSize: 10, color: isCopied ? '#818cf8' : 'rgba(255,255,255,0.4)', textAlign: 'center' }}>{r.title}</span>
                        {isCopied && <div style={{ position: 'absolute', top: 4, right: 4, color: '#818cf8' }}><Check size={10} /></div>}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Shapes */}
          {tab === 'shapes' && (
            <div style={grid8}>
              {filteredShapes.map((shape) => (
                <Card
                  key={shape.id}
                  id={shape.id}
                  name={shape.name}
                  copiedId={copiedId}
                  onCopy={() => {
                    const colored = shape.svg.replace(/currentColor/g, shapeColor);
                    handleCopy(shape.id, colored);
                  }}
                >
                  <div
                    style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: copiedId === shape.id ? '#818cf8' : shapeColor }}
                    dangerouslySetInnerHTML={{ __html: shape.svg }}
                  />
                </Card>
              ))}
            </div>
          )}

          {/* SVGRepo */}
          {tab === 'svgrepo' && (
            <>
              {svgRepoError && <div style={{ textAlign: 'center', padding: '20px 0', color: '#f87171', fontSize: 12 }}>{svgRepoError}</div>}
              {!svgRepoError && svgRepoResults.length === 0 && !svgRepoLoading && emptyState(svgRepoQuery.trim() ? 'Keine Ergebnisse.' : 'Suchbegriff eingeben.')}
              {svgRepoResults.length > 0 && (
                <div style={grid8}>
                  {svgRepoResults.map((r) => (
                    <Card key={r.id} id={`svgrepo-${r.id}`} name={r.title} copiedId={copiedId} onCopy={() => handleCopy(`svgrepo-${r.id}`, r.svg)}>
                      <div style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)' }} dangerouslySetInnerHTML={{ __html: r.svg }} />
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '7px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
            Klicken kopiert SVG-Code in die Zwischenablage.
            {tab === 'illustrations' && ' Farbe wird vor dem Kopieren ersetzt.'}
            {tab === 'shapes' && ' Vorschau-Farbe wird als Fill-Farbe ins SVG eingesetzt.'}
          </span>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: translateY(-50%) rotate(0deg); } to { transform: translateY(-50%) rotate(360deg); } }`}</style>
    </div>
  );
}
