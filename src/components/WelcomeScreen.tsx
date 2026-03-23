import { Palette, GitBranch, Presentation, ArrowRight } from 'lucide-react';
import { useEditorStore } from '../stores/editorStore';
import { LOGO_URL } from '../utils/assets';

const cards = [
  {
    id: 'graphic' as const,
    icon: Palette,
    title: 'Grafiken',
    description: '13 Vorlagen für Case Studies, KPIs, Daten-Pipelines und Outreach – direkt im CegTec Design exportieren.',
    accent: '#6366f1',
  },
  {
    id: 'diagram' as const,
    icon: GitBranch,
    title: 'Diagramme',
    description: 'Flowcharts und Prozesse mit Animationen bauen. Export als SVG, GIF oder Video.',
    accent: '#22c55e',
  },
  {
    id: 'slides' as const,
    icon: Presentation,
    title: 'Slides',
    description: 'Präsentationen erstellen und als PDF exportieren. Fullscreen-Modus inklusive.',
    accent: '#f59e0b',
  },
];

export function WelcomeScreen() {
  const { setMode } = useEditorStore();

  return (
    <div className="h-full flex flex-col items-center justify-center bg-bg px-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-3">
        <img src={LOGO_URL} alt="CegTec" className="h-8" />
        <div className="w-px h-8 bg-border" />
        <h1 className="text-2xl font-bold text-text tracking-tight">SlideForge</h1>
      </div>
      <p className="text-text-muted text-sm mb-12">
        Grafiken, Diagramme und Präsentationen im CegTec Design
      </p>

      {/* Mode Cards */}
      <div className="flex gap-5 max-w-3xl w-full">
        {cards.map(({ id, icon: Icon, title, description, accent }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className="group flex-1 bg-surface border border-border rounded-xl p-6 text-left hover:border-primary/50 hover:bg-surface-hover transition-all duration-200 cursor-pointer"
          >
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: `${accent}15`, color: accent }}
            >
              <Icon size={22} />
            </div>
            <h2 className="text-lg font-semibold text-text mb-2">{title}</h2>
            <p className="text-text-muted text-sm leading-relaxed mb-4">{description}</p>
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Öffnen <ArrowRight size={12} />
            </div>
          </button>
        ))}
      </div>

      {/* Keyboard hint */}
      <p className="text-text-muted text-[11px] mt-10 opacity-60">
        Tipp: Strg+S zum Speichern, Strg+E zum Exportieren
      </p>
    </div>
  );
}
