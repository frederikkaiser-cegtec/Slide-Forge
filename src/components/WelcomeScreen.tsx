import { useState, useMemo } from 'react';
import {
  Palette, GitBranch, Presentation, ArrowUpRight,
  Search, Image, BarChart3, Trophy, Boxes, LayoutDashboard,
  GraduationCap, Database, DatabaseZap, ScanSearch,
  Mail, Radio, Layers, Bot,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BlurFade } from './ui/blur-fade';
import { DotPattern } from './ui/dot-pattern';
import { cn } from '@/lib/utils';
import { useEditorStore } from '../stores/editorStore';
import { LOGO_URL } from '../utils/assets';

// ── Graphic template data ────────────────────────────────────────
const TEMPLATES = [
  { id: 'case-study', label: 'Case Study', icon: Image, category: 'case-studies', desc: 'Kunden-Erfolgsgeschichten' },
  { id: 'roi', label: 'ROI', icon: BarChart3, category: 'case-studies', desc: 'Return on Investment' },
  { id: 'kpi-banner', label: 'KPI Banner', icon: Trophy, category: 'case-studies', desc: 'Performance-Metriken' },
  { id: 'infographic', label: 'Infografik', icon: LayoutDashboard, category: 'case-studies', desc: 'Funnel & Metriken' },
  { id: 'raw-data', label: 'Raw Data', icon: Database, category: 'pipeline', desc: 'Rohdaten-Tabelle' },
  { id: 'enriched-data', label: 'Enriched', icon: DatabaseZap, category: 'pipeline', desc: 'Angereicherte Daten' },
  { id: 'qualified-data', label: 'Qualified', icon: ScanSearch, category: 'pipeline', desc: 'Qualifizierte Leads' },
  { id: 'personalized-outreach', label: 'Outreach', icon: Mail, category: 'outreach', desc: 'Personalisierte E-Mails' },
  { id: 'multichannel-outreach', label: 'Multichannel', icon: Radio, category: 'outreach', desc: 'LinkedIn + Email' },
  { id: 'outbound-stack', label: 'Stack', icon: Layers, category: 'outreach', desc: 'Tool-Stack Übersicht' },
  { id: 'revenue-systems', label: 'Systems', icon: Boxes, category: 'other', desc: 'Revenue-Architektur' },
  { id: 'academy', label: 'Academy', icon: GraduationCap, category: 'other', desc: 'Schulungsmaterial' },
  { id: 'agent-friendly', label: 'AI-Ready', icon: Bot, category: 'other', desc: 'Agent-optimiert' },
];

const CATEGORIES = [
  { id: 'all', label: 'Alle' },
  { id: 'case-studies', label: 'Case Studies' },
  { id: 'pipeline', label: 'Daten-Pipeline' },
  { id: 'outreach', label: 'Outreach' },
  { id: 'other', label: 'Weitere' },
];

const MODES = [
  {
    id: 'graphic' as const,
    icon: Palette,
    title: 'Grafiken',
    desc: '13 Vorlagen im CegTec Design',
    gradient: 'from-indigo-500 to-violet-500',
    bg: 'bg-indigo-500/8',
  },
  {
    id: 'diagram' as const,
    icon: GitBranch,
    title: 'Diagramme',
    desc: 'Flowcharts mit Animationen',
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-500/8',
  },
  {
    id: 'slides' as const,
    icon: Presentation,
    title: 'Slides',
    desc: 'Präsentationen & PDF Export',
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-500/8',
  },
];

// ── Greeting ─────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Guten Morgen';
  if (h < 18) return 'Guten Tag';
  return 'Guten Abend';
}

// ── Component ────────────────────────────────────────────────────
export function WelcomeScreen() {
  const { setMode } = useEditorStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((t) => {
      const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
      const matchesSearch = !search || t.label.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const handleTemplateClick = (templateId: string) => {
    // Store the selected graphic type, then switch to graphic mode
    // We use a custom event that App.tsx listens to
    window.dispatchEvent(new CustomEvent('sf:select-graphic', { detail: templateId }));
    setMode('graphic');
  };

  return (
    <div className="h-full overflow-y-auto relative">
      {/* Background */}
      <div className="fixed inset-0 bg-bg" />
      <DotPattern
        width={32}
        height={32}
        cr={0.5}
        className={cn(
          "fixed inset-0 fill-text-muted/[0.07]",
          "[mask-image:radial-gradient(600px_circle_at_50%_200px,white,transparent)]",
        )}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* ── Header ─────────────────────────────────────── */}
        <BlurFade delay={0} inView>
          <div className="flex items-center gap-3 mb-8">
            <img src={LOGO_URL} alt="CegTec" className="h-6 opacity-70" />
            <div className="h-4 w-px bg-border/40" />
            <span className="text-[11px] font-semibold tracking-[0.1em] text-text-muted/50 uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              SlideForge
            </span>
          </div>
        </BlurFade>

        <BlurFade delay={0.08} inView>
          <h1
            className="text-[2.8rem] leading-[1.08] font-bold tracking-tight mb-3"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <span className="text-text">{getGreeting()}</span>
            <span className="text-text-muted/30">.</span>
          </h1>
        </BlurFade>

        <BlurFade delay={0.16} inView>
          <p className="text-text-muted text-lg mb-10 max-w-lg">
            Erstelle Grafiken, Diagramme und Präsentationen im CegTec Design.
          </p>
        </BlurFade>

        {/* ── Mode Cards ─────────────────────────────────── */}
        <BlurFade delay={0.24} inView>
          <div className="grid grid-cols-3 gap-3 mb-14">
            {MODES.map(({ id, icon: Icon, title, desc, gradient, bg }) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                className="group relative text-left rounded-xl border border-border/60 bg-surface shadow-sm px-5 py-4 transition-all duration-300 cursor-pointer hover:shadow-md hover:border-border"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", bg)}>
                    <Icon size={16} className={cn("bg-gradient-to-br bg-clip-text", gradient)} style={{ color: undefined }} />
                  </div>
                  <span className="text-[15px] font-semibold text-text" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {title}
                  </span>
                  <ArrowUpRight
                    size={13}
                    className="ml-auto text-text-muted/30 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <p className="text-[13px] text-text-muted/60 leading-relaxed">{desc}</p>
              </button>
            ))}
          </div>
        </BlurFade>

        {/* ── Templates Section ──────────────────────────── */}
        <BlurFade delay={0.32} inView>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-text mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Grafik-Vorlagen
              </h2>
              <p className="text-sm text-text-muted/50">Wähle eine Vorlage und starte direkt im Editor</p>
            </div>

            {/* Search */}
            <div className="relative w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Vorlage suchen..."
                className="w-full bg-surface border border-border/60 rounded-lg pl-9 pr-3 py-2 text-sm text-text placeholder:text-text-muted/40 outline-none focus:border-primary/40 shadow-sm transition-colors"
              />
            </div>
          </div>
        </BlurFade>

        {/* Category Filter */}
        <BlurFade delay={0.36} inView>
          <div className="flex gap-1 mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200",
                  activeCategory === cat.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-text-muted/50 hover:text-text-muted hover:bg-surface/40 border border-transparent"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </BlurFade>

        {/* Template Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pb-12">
          {filteredTemplates.map((template, i) => {
            const Icon = template.icon;
            return (
              <BlurFade key={template.id} delay={0.4 + i * 0.04} inView>
                <motion.button
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleTemplateClick(template.id)}
                  className="group w-full text-left rounded-xl border border-border/50 bg-surface shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-border cursor-pointer"
                >
                  {/* Preview area */}
                  <div className="aspect-[4/3] w-full bg-gradient-to-br from-muted/40 to-bg/60 flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                    {/* Decorative grid */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                      backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }} />

                    {/* Accent glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 w-10 h-10 rounded-xl bg-surface/60 border border-border/30 flex items-center justify-center group-hover:border-primary/20 group-hover:bg-primary/5 transition-all duration-300">
                      <Icon size={18} className="text-text-muted/40 group-hover:text-primary/70 transition-colors duration-300" />
                    </div>
                    <span className="relative z-10 text-[10px] font-medium text-text-muted/30 uppercase tracking-wider group-hover:text-text-muted/50 transition-colors">
                      {template.category === 'case-studies' ? 'Case Study' : template.category === 'pipeline' ? 'Pipeline' : template.category === 'outreach' ? 'Outreach' : 'Tool'}
                    </span>
                  </div>

                  {/* Label */}
                  <div className="px-3 py-3">
                    <p className="text-[13px] font-medium text-text/80 group-hover:text-text transition-colors">{template.label}</p>
                    <p className="text-[11px] text-text-muted/35 mt-0.5">{template.desc}</p>
                  </div>
                </motion.button>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </div>
  );
}
