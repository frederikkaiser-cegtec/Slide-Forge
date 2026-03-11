import { useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { parseDiagramPrompt } from '../../utils/diagramParser';
import { autoLayoutDiagram } from '../../utils/diagramLayout';
import { useDiagramStore } from '../../stores/diagramStore';
import { generateId } from '../../utils/id';

const EXAMPLES = [
  'Lead Scraping → Enrichment → Sequencing → Follow-Up → Meeting',
  'CEO\n  VP Sales\n  VP Marketing\n  VP Tech\n    Frontend\n    Backend',
  'Q1 Planung → Q2 Entwicklung → Q3 Launch → Q4 Skalierung',
  '🔍 Research → 📊 Analyse → 💡 Strategie → 🚀 Umsetzung → 📈 Optimierung',
];

export function PromptInput() {
  const [value, setValue] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { loadDiagram } = useDiagramStore();

  const handleGenerate = () => {
    console.log('[PromptInput] value:', JSON.stringify(value));
    if (!value.trim()) return;

    const parsed = parseDiagramPrompt(value);
    console.log('[PromptInput] parsed:', parsed.nodes.length, 'nodes,', parsed.edges.length, 'edges');
    if (parsed.nodes.length === 0) return;

    // Auto-layout for hierarchy types
    let { nodes, edges } = parsed;
    if (parsed.diagramType === 'orgchart' || parsed.diagramType === 'techstack') {
      const laid = autoLayoutDiagram(nodes, edges, parsed.diagramType);
      nodes = laid.nodes;
      edges = laid.edges;
    }

    console.log('[PromptInput] loading diagram...');
    loadDiagram({
      id: generateId(),
      title: parsed.title || 'Neues Diagramm',
      diagramType: parsed.diagramType,
      nodes,
      edges,
      background: '#f8f9fb',
      gridSize: 20,
      themeId: 'cegtec',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleExample = (ex: string) => {
    setValue(ex);
    setShowExamples(false);
    textareaRef.current?.focus();
  };

  return (
    <div style={{
      padding: '12px 16px',
      borderBottom: '1px solid #e8eaef',
      background: '#fff',
    }}>
      <div style={{
        display: 'flex',
        gap: 8,
        alignItems: 'flex-end',
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => !value && setShowExamples(true)}
            onBlur={() => setTimeout(() => setShowExamples(false), 200)}
            placeholder="Beschreibe dein Diagramm... z.B. 'Scraping → Enrichment → Outreach → Meeting'"
            rows={value.includes('\n') ? Math.min(value.split('\n').length, 6) : 1}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 10,
              border: '1px solid #e2e5ea',
              background: '#f8f9fb',
              color: '#1a1a2e',
              fontSize: 13,
              fontFamily: 'Inter, sans-serif',
              resize: 'none',
              outline: 'none',
              lineHeight: 1.5,
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#c7cbff';
            }}
            onMouseLeave={(e) => {
              if (document.activeElement !== e.currentTarget) {
                e.currentTarget.style.borderColor = '#e2e5ea';
              }
            }}
          />

          {/* Examples dropdown */}
          {showExamples && !value && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: 4,
              background: '#fff',
              border: '1px solid #e2e5ea',
              borderRadius: 10,
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              zIndex: 50,
              overflow: 'hidden',
            }}>
              <div style={{ padding: '8px 12px', fontSize: 10, color: '#9ca3af', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Beispiele
              </div>
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onMouseDown={(e) => { e.preventDefault(); handleExample(ex); }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: 12,
                    color: '#4b5563',
                    fontFamily: 'Inter, sans-serif',
                    whiteSpace: 'pre-line',
                    lineHeight: 1.4,
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {ex.length > 80 ? ex.slice(0, 80) + '...' : ex}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={!value.trim()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 18px',
            borderRadius: 10,
            border: 'none',
            background: value.trim() ? 'linear-gradient(135deg, #3B4BF9, #6875FF)' : '#e8eaef',
            color: value.trim() ? '#fff' : '#9ca3af',
            fontSize: 13,
            fontWeight: 600,
            cursor: value.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            boxShadow: value.trim() ? '0 2px 8px rgba(59,75,249,0.3)' : 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          <Sparkles size={14} /> Generieren
        </button>
      </div>

      <div style={{ marginTop: 6, fontSize: 10, color: '#b0b8c4' }}>
        Pfeile (→ oder -&gt;) für Flows · Einrückungen für Hierarchien · Emojis als Icons · Ctrl+Enter zum Generieren
      </div>
    </div>
  );
}
