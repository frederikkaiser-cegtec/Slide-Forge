import type { DiagramTemplate, DiagramNode, DiagramEdge } from '../types/diagram';
import type { ElementAnimation } from '../types/animation';
import { generateId } from '../utils/id';
import { createDefaultPorts } from '../utils/edgePaths';

function node(
  overrides: Partial<DiagramNode> & Pick<DiagramNode, 'x' | 'y' | 'label'>
): DiagramNode {
  return {
    id: generateId(),
    type: 'process',
    width: 140,
    height: 50,
    sublabel: undefined,
    icon: undefined,
    style: {
      backgroundColor: '#ffffff',
      borderColor: '#3B4BF9',
      borderWidth: 1,
      color: '#1a1a2e',
      fontSize: 13,
      fontWeight: 500,
      borderRadius: 12,
    },
    ports: createDefaultPorts(),
    ...overrides,
  };
}

function edge(
  source: string,
  sourcePort: string,
  target: string,
  targetPort: string,
  overrides?: Partial<DiagramEdge>
): DiagramEdge {
  return {
    id: generateId(),
    source,
    sourcePort,
    target,
    targetPort,
    type: 'bezier',
    style: { strokeColor: '#3B4BF9', strokeWidth: 2 },
    ...overrides,
  };
}

export const diagramTemplates: DiagramTemplate[] = [
  {
    id: 'flowchart-basic',
    name: 'Einfacher Flowchart',
    description: 'Start → Prozess → Entscheidung → Ende',
    diagramType: 'flowchart',
    icon: '🔀',
    create: (c) => {
      const n1 = node({ x: 200, y: 40, label: 'Start', type: 'terminal', width: 120, height: 50, style: { backgroundColor: '#ffffff', borderColor: c.primary, borderWidth: 2, color: '#1a1a2e', fontSize: 14, fontWeight: 600, borderRadius: 25 } });
      const n2 = node({ x: 190, y: 140, label: 'Daten verarbeiten', width: 160, height: 50, style: { backgroundColor: '#ffffff', borderColor: c.primary, borderWidth: 2, color: '#1a1a2e', fontSize: 13, fontWeight: 500, borderRadius: 8 } });
      const n3 = node({ x: 200, y: 250, label: 'Gültig?', type: 'decision', width: 80, height: 80, style: { backgroundColor: '#ffffff', borderColor: c.secondary, borderWidth: 2, color: '#1a1a2e', fontSize: 12, fontWeight: 600, borderRadius: 0 } });
      const n4 = node({ x: 380, y: 260, label: 'Fehlerbehandlung', width: 150, height: 50, style: { backgroundColor: '#ffffff', borderColor: '#ef4444', borderWidth: 2, color: '#1a1a2e', fontSize: 13, fontWeight: 500, borderRadius: 8 } });
      const n5 = node({ x: 200, y: 380, label: 'Ende', type: 'terminal', width: 120, height: 50, style: { backgroundColor: '#ffffff', borderColor: c.accent, borderWidth: 2, color: '#1a1a2e', fontSize: 14, fontWeight: 600, borderRadius: 25 } });

      return {
        title: 'Einfacher Flowchart',
        diagramType: 'flowchart',
        nodes: [n1, n2, n3, n4, n5],
        edges: [
          edge(n1.id, 'bottom', n2.id, 'top'),
          edge(n2.id, 'bottom', n3.id, 'top'),
          edge(n3.id, 'right', n4.id, 'left', { label: 'Nein' }),
          edge(n3.id, 'bottom', n5.id, 'top', { label: 'Ja' }),
          edge(n4.id, 'bottom', n2.id, 'right', { style: { strokeColor: '#ef4444', strokeWidth: 2, strokeDasharray: '6 4' } }),
        ],
        background: '#f8f9fb',
        gridSize: 20,
        themeId: 'cegtec',
      };
    },
  },
  {
    id: 'orgchart',
    name: 'Organigramm',
    description: 'Hierarchische Teamstruktur',
    diagramType: 'orgchart',
    icon: '👥',
    create: (c) => {
      const ceo = node({ x: 250, y: 40, label: 'CEO', sublabel: 'Geschäftsführer', type: 'card', width: 160, height: 70, style: { backgroundColor: '#ffffff', borderColor: c.primary, borderWidth: 2, color: '#1a1a2e', fontSize: 14, fontWeight: 700, borderRadius: 12 } });
      const vps = node({ x: 80, y: 160, label: 'VP Sales', sublabel: 'Vertrieb', type: 'card', width: 140, height: 60, style: { backgroundColor: '#ffffff', borderColor: c.secondary, borderWidth: 2, color: '#1a1a2e', fontSize: 13, fontWeight: 600, borderRadius: 10 } });
      const vpm = node({ x: 260, y: 160, label: 'VP Marketing', sublabel: 'Marketing', type: 'card', width: 140, height: 60, style: { backgroundColor: '#ffffff', borderColor: c.secondary, borderWidth: 2, color: '#1a1a2e', fontSize: 13, fontWeight: 600, borderRadius: 10 } });
      const vpt = node({ x: 440, y: 160, label: 'VP Tech', sublabel: 'Entwicklung', type: 'card', width: 140, height: 60, style: { backgroundColor: '#ffffff', borderColor: c.secondary, borderWidth: 2, color: '#1a1a2e', fontSize: 13, fontWeight: 600, borderRadius: 10 } });

      return {
        title: 'Organigramm',
        diagramType: 'orgchart',
        nodes: [ceo, vps, vpm, vpt],
        edges: [
          edge(ceo.id, 'bottom', vps.id, 'top'),
          edge(ceo.id, 'bottom', vpm.id, 'top'),
          edge(ceo.id, 'bottom', vpt.id, 'top'),
        ],
        background: '#f8f9fb',
        gridSize: 20,
        themeId: 'cegtec',
      };
    },
  },
  {
    id: 'timeline',
    name: 'Timeline',
    description: 'Horizontale Zeitleiste mit Meilensteinen',
    diagramType: 'timeline',
    icon: '📅',
    create: (c) => {
      const steps = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'].map((label, i) =>
        node({
          x: 40 + i * 200,
          y: 100,
          label,
          sublabel: `Phase ${i + 1}`,
          type: 'card',
          width: 150,
          height: 60,
          style: {
            backgroundColor: '#ffffff',
            borderColor: i === 0 ? c.accent : c.primary,
            borderWidth: 2,
            color: '#1a1a2e',
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 10,
          },
        })
      );

      const edges: DiagramEdge[] = [];
      for (let i = 0; i < steps.length - 1; i++) {
        edges.push(edge(steps[i].id, 'right', steps[i + 1].id, 'left'));
      }

      return {
        title: 'Projekt-Timeline',
        diagramType: 'timeline',
        nodes: steps,
        edges,
        background: '#f8f9fb',
        gridSize: 20,
        themeId: 'cegtec',
      };
    },
  },
  {
    id: 'techstack',
    name: 'Tech Stack',
    description: 'Schichten-Architektur',
    diagramType: 'techstack',
    icon: '🏗️',
    create: (c) => {
      const layers = [
        { label: 'Frontend', sublabel: 'React + Tailwind', icon: '⚛️' },
        { label: 'API', sublabel: 'Node.js + Express', icon: '🔌' },
        { label: 'Backend', sublabel: 'PostgreSQL + Redis', icon: '🗄️' },
        { label: 'Infra', sublabel: 'AWS + Docker', icon: '☁️' },
      ].map((data, i) =>
        node({
          x: 150,
          y: 30 + i * 100,
          label: data.label,
          sublabel: data.sublabel,
          icon: data.icon,
          type: 'card',
          width: 220,
          height: 70,
          style: {
            backgroundColor: '#ffffff',
            borderColor: c.primary,
            borderWidth: 2,
            color: '#1a1a2e',
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 12,
          },
        })
      );

      const edges: DiagramEdge[] = [];
      for (let i = 0; i < layers.length - 1; i++) {
        edges.push(edge(layers[i].id, 'bottom', layers[i + 1].id, 'top', {
          style: { strokeColor: c.primary, strokeWidth: 2, strokeDasharray: '4 4' },
        }));
      }

      return {
        title: 'Tech Stack',
        diagramType: 'techstack',
        nodes: layers,
        edges,
        background: '#f8f9fb',
        gridSize: 20,
        themeId: 'cegtec',
      };
    },
  },
  {
    id: 'process-flow',
    name: 'Prozess-Flow',
    description: 'Lead-Generierung Pipeline',
    diagramType: 'process',
    icon: '⚡',
    create: (c) => {
      const steps = [
        { label: 'Lead Scraping', icon: '🔍' },
        { label: 'Enrichment', icon: '📊' },
        { label: 'Sequencing', icon: '📧' },
        { label: 'Follow-Up', icon: '🔄' },
        { label: 'Meeting', icon: '🤝' },
      ].map((data, i) =>
        node({
          x: 30 + i * 170,
          y: 120,
          label: data.label,
          icon: data.icon,
          type: 'process',
          width: 130,
          height: 55,
          style: {
            backgroundColor: '#ffffff',
            borderColor: i === 4 ? c.accent : c.primary,
            borderWidth: 2,
            color: '#1a1a2e',
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 10,
          },
        })
      );

      const edges: DiagramEdge[] = [];
      for (let i = 0; i < steps.length - 1; i++) {
        edges.push(edge(steps[i].id, 'right', steps[i + 1].id, 'left'));
      }

      return {
        title: 'Lead-Gen Pipeline',
        diagramType: 'process',
        nodes: steps,
        edges,
        background: '#f8f9fb',
        gridSize: 20,
        themeId: 'cegtec',
      };
    },
  },
  {
    id: 'kpi-counter',
    name: 'KPI Counter',
    description: 'Premium KPI-Dashboard mit animierten Countern & Conversion-Funnel',
    diagramType: 'process',
    icon: '🚀',
    create: (c) => {
      // Animation helper — delays compensate for staggerIndex offset (+nodeIdx * 0.1s)
      const anim = (presetId: string, delay: number, overrides?: Partial<ElementAnimation['config']>): ElementAnimation => ({
        presetId,
        config: {
          duration: 0.7,
          delay,
          easing: 'spring',
          trigger: 'onScroll',
          iterationCount: 1,
          fillMode: 'both',
          ...overrides,
        },
      });

      // Tinted white card — subtle accent color shift
      const kpiCard = (tint: string, accentBorder: string) => ({
        backgroundColor: tint,
        borderColor: accentBorder,
        borderWidth: 2,
        color: '#1a1a2e',
        fontSize: 20,
        fontWeight: 700,
        borderRadius: 16,
      });

      // === 3 KPI CARDS ===
      // fontSize 20 → icon 32px, label 20px bold, sublabel 15px @ 50% opacity
      const n1 = node({
        x: 80, y: 60,
        label: '112', sublabel: 'Leads generiert', icon: '📧',
        type: 'card', width: 200, height: 150,
        style: kpiCard('#f0f4ff', '#3B4BF9'),
        data: { counter: 112 },
        animation: anim('clipReveal', 0.1),
      });

      const n2 = node({
        x: 360, y: 60,
        label: '7', sublabel: 'Meetings gebucht', icon: '🤝',
        type: 'card', width: 200, height: 150,
        style: kpiCard('#f5f0ff', '#8B5CF6'),
        data: { counter: 7 },
        animation: anim('clipReveal', 0.15),
      });

      const n3 = node({
        x: 640, y: 60,
        label: '1', sublabel: 'Deal closed', icon: '💰',
        type: 'card', width: 200, height: 150,
        style: kpiCard('#fef0fa', '#E93BCD'),
        data: { counter: 1 },
        animation: anim('clipReveal', 0.2),
      });

      // === CONVERSION RATE BADGES ===
      const badge1 = node({
        x: 276, y: 121,
        label: '6.3%',
        type: 'card', width: 68, height: 28,
        style: {
          backgroundColor: '#eef0ff',
          borderColor: '#3B4BF9',
          borderWidth: 1,
          color: '#3B4BF9',
          fontSize: 10,
          fontWeight: 700,
          borderRadius: 14,
        },
        animation: anim('fadeIn', 0.35, { duration: 0.4, easing: 'ease-out' }),
      });

      const badge2 = node({
        x: 556, y: 121,
        label: '14.3%',
        type: 'card', width: 68, height: 28,
        style: {
          backgroundColor: '#f3eeff',
          borderColor: '#8B5CF6',
          borderWidth: 1,
          color: '#8B5CF6',
          fontSize: 10,
          fontWeight: 700,
          borderRadius: 14,
        },
        animation: anim('fadeIn', 0.4, { duration: 0.4, easing: 'ease-out' }),
      });

      // === ROI PUNCH-LINE ===
      const punchLine = node({
        x: 260, y: 260,
        label: '22x ROI', sublabel: 'Return on Investment',
        type: 'card', width: 400, height: 72,
        style: {
          backgroundColor: 'linear-gradient(135deg, #3B4BF9 0%, #7C3AED 50%, #E93BCD 100%)',
          borderColor: 'transparent',
          borderWidth: 0,
          color: '#ffffff',
          fontSize: 20,
          fontWeight: 800,
          borderRadius: 16,
        },
        animation: anim('glowBorder', 0, { duration: 3, easing: 'linear', iterationCount: 'infinite', fillMode: 'none' }),
      });

      return {
        title: 'Von Kaltakquise zu warmen Leads',
        diagramType: 'process',
        nodes: [n1, n2, n3, badge1, badge2, punchLine],
        edges: [
          edge(n1.id, 'right', n2.id, 'left', {
            style: { strokeColor: '#3B4BF9', strokeWidth: 2 },
            animation: anim('drawLine', 0.0, { duration: 0.5, easing: 'ease-in-out' }),
          }),
          edge(n2.id, 'right', n3.id, 'left', {
            style: { strokeColor: '#8B5CF6', strokeWidth: 2 },
            animation: anim('drawLine', 0.1, { duration: 0.5, easing: 'ease-in-out' }),
          }),
        ],
        background: '#f8f9fb',
        gridSize: 20,
        themeId: 'cegtec',
      };
    },
  },
  {
    id: 'growth-engine',
    name: 'Growth Engine',
    description: 'Dark minimalist B2B Sales Funnel — Linear/Vercel inspired',
    diagramType: 'process',
    icon: '🎯',
    create: () => {
      const anim = (presetId: string, delay: number, overrides?: Partial<ElementAnimation['config']>): ElementAnimation => ({
        presetId,
        config: {
          duration: 0.7,
          delay,
          easing: 'vercel',
          trigger: 'onScroll',
          iterationCount: 1,
          fillMode: 'both',
          ...overrides,
        },
      });

      // Palette: near-black cards, single blue accent, white text
      const dark = '#0c0c14';
      const darkCard = '#12121e';
      const accent = '#6366f1';
      const accentMuted = '#4f46e5';
      const textPrimary = '#f0f0f5';
      const textMuted = '#64748b';
      const border = '#1e1e2e';

      // === HEADLINE ===
      const headline = node({
        x: 220, y: 24,
        label: 'Growth Engine',
        type: 'card', width: 260, height: 36,
        style: {
          backgroundColor: 'transparent', borderColor: 'transparent', borderWidth: 0,
          color: textPrimary, fontSize: 20, fontWeight: 700, borderRadius: 0,
        },
        animation: anim('gradientText', 0, { duration: 4, easing: 'linear', iterationCount: 'infinite', fillMode: 'none' }),
      });

      // === 4 METRIC CARDS — dark glass, shimmer ===
      const card = (x: number, value: string, label: string, counter: number, delay: number) => node({
        x, y: 80,
        label: value, sublabel: label,
        type: 'card', width: 148, height: 100,
        style: {
          backgroundColor: darkCard, borderColor: border, borderWidth: 1,
          color: textPrimary, fontSize: 24, fontWeight: 700, borderRadius: 12,
        },
        data: { counter },
        animation: anim('shimmer', delay, { duration: 3, easing: 'ease-in-out', iterationCount: 'infinite', fillMode: 'none' }),
      });

      const c1 = card(30,  '2.847', 'Prospects', 2847, 0.1);
      const c2 = card(206, '342',   'Qualified',  342, 0.2);
      const c3 = card(382, '47',    'Meetings',    47, 0.3);
      const c4 = card(558, '12',    'Closed',      12, 0.4);

      // === CONVERSION RATES — minimal pills ===
      const pill = (x: number, label: string, delay: number) => node({
        x, y: 118,
        label,
        type: 'card', width: 46, height: 20,
        style: {
          backgroundColor: '#1a1a2e', borderColor: accent, borderWidth: 1,
          color: accent, fontSize: 8, fontWeight: 600, borderRadius: 10,
        },
        animation: anim('fadeIn', delay, { duration: 0.5 }),
      });

      const p1 = pill(172, '12%',   0.5);
      const p2 = pill(348, '13.7%', 0.55);
      const p3 = pill(524, '25.5%', 0.6);

      // === THIN PROGRESS LINE ===
      const progressLine = node({
        x: 30, y: 202,
        label: '',
        type: 'card', width: 676, height: 2,
        style: {
          backgroundColor: border, borderColor: 'transparent', borderWidth: 0,
          color: 'transparent', fontSize: 1, fontWeight: 400, borderRadius: 1,
        },
        animation: anim('clipReveal', 0.3, { duration: 0.8 }),
      });

      const progressFill = node({
        x: 30, y: 202,
        label: '',
        type: 'card', width: 676, height: 2,
        style: {
          backgroundColor: `linear-gradient(90deg, ${accent}, ${accentMuted}40)`,
          borderColor: 'transparent', borderWidth: 0,
          color: 'transparent', fontSize: 1, fontWeight: 400, borderRadius: 1,
        },
        animation: anim('clipReveal', 0.5, { duration: 1.0 }),
      });

      // === RESULT ROW ===
      const resultValue = node({
        x: 30, y: 224,
        label: '€2.4M', sublabel: 'Pipeline Value',
        type: 'card', width: 200, height: 56,
        style: {
          backgroundColor: darkCard, borderColor: accent, borderWidth: 1,
          color: textPrimary, fontSize: 22, fontWeight: 700, borderRadius: 12,
        },
        data: { counter: 2400000 },
        animation: anim('glowBorder', 0, { duration: 4, easing: 'linear', iterationCount: 'infinite', fillMode: 'none' }),
      });

      const resultRoi = node({
        x: 254, y: 224,
        label: '38x', sublabel: 'ROI',
        type: 'card', width: 100, height: 56,
        style: {
          backgroundColor: darkCard, borderColor: border, borderWidth: 1,
          color: accent, fontSize: 22, fontWeight: 700, borderRadius: 12,
        },
        animation: anim('clipReveal', 0.6, { duration: 0.6 }),
      });

      const resultDays = node({
        x: 378, y: 224,
        label: '90d', sublabel: 'Time to Pipeline',
        type: 'card', width: 110, height: 56,
        style: {
          backgroundColor: darkCard, borderColor: border, borderWidth: 1,
          color: textMuted, fontSize: 20, fontWeight: 600, borderRadius: 12,
        },
        animation: anim('clipReveal', 0.65, { duration: 0.6 }),
      });

      // === TAGLINE ===
      const tagline = node({
        x: 220, y: 306,
        label: 'CegTec Revenue Architecture',
        type: 'card', width: 260, height: 24,
        style: {
          backgroundColor: 'transparent', borderColor: 'transparent', borderWidth: 0,
          color: textMuted, fontSize: 9, fontWeight: 500, borderRadius: 0,
        },
        animation: anim('typewriter', 0.8, { duration: 1.5, easing: 'linear' }),
      });

      return {
        title: 'Growth Engine',
        diagramType: 'process',
        nodes: [
          headline,
          c1, c2, c3, c4,
          p1, p2, p3,
          progressLine, progressFill,
          resultValue, resultRoi, resultDays,
          tagline,
        ],
        edges: [
          edge(c1.id, 'right', c2.id, 'left', {
            style: { strokeColor: accent, strokeWidth: 1 },
            animation: anim('glowPulse', 0, { duration: 2.5, easing: 'ease-in-out', iterationCount: 'infinite', fillMode: 'none' }),
          }),
          edge(c2.id, 'right', c3.id, 'left', {
            style: { strokeColor: accent, strokeWidth: 1 },
            animation: anim('glowPulse', 0.1, { duration: 2.5, easing: 'ease-in-out', iterationCount: 'infinite', fillMode: 'none' }),
          }),
          edge(c3.id, 'right', c4.id, 'left', {
            style: { strokeColor: accent, strokeWidth: 1 },
            animation: anim('glowPulse', 0.2, { duration: 2.5, easing: 'ease-in-out', iterationCount: 'infinite', fillMode: 'none' }),
          }),
        ],
        background: dark,
        gridSize: 20,
        themeId: 'cegtec',
      };
    },
  },
];
