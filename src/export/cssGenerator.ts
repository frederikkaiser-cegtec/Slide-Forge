import type { Diagram } from '../types/diagram';
import { getPreset, compileKeyframes, compileAnimationProperty } from '../animation';
import { FONTS } from '../utils/cegtecTheme';

function generateShimmerCSS(diagram: Diagram, prefix: string): string {
  const shimmerNodes = diagram.nodes.filter((n) => n.animation?.presetId === 'shimmer');
  if (shimmerNodes.length === 0) return '';

  const rules: string[] = [
    `@keyframes ${prefix}-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`,
  ];

  for (const node of shimmerNodes) {
    const duration = node.animation?.config.duration ?? 2;
    rules.push(`.${prefix}-node[data-id="${node.id}"]::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 75%, transparent 100%);
  background-size: 200% 100%;
  animation: ${prefix}-shimmer ${duration}s ease-in-out infinite;
  border-radius: inherit;
  pointer-events: none;
}`);
  }

  return rules.join('\n');
}

function generateGradientTextCSS(diagram: Diagram, prefix: string): string {
  const gradientNodes = diagram.nodes.filter((n) => n.animation?.presetId === 'gradientText');
  if (gradientNodes.length === 0) return '';

  const rules: string[] = [
    `@keyframes ${prefix}-gradientText { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }`,
  ];

  for (const node of gradientNodes) {
    const borderColor = node.style.borderColor || '#3B4BF9';
    const duration = node.animation?.config.duration ?? 3;
    rules.push(`.${prefix}-node[data-id="${node.id}"] .${prefix}-node-label {
  background: linear-gradient(90deg, ${borderColor}, #E93BCD, #8B5CF6, ${borderColor});
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${prefix}-gradientText ${duration}s linear infinite;
}`);
  }

  return rules.join('\n');
}

function generateGlowBorderCSS(diagram: Diagram, prefix: string): string {
  const glowNodes = diagram.nodes.filter((n) => n.animation?.presetId === 'glowBorder');
  if (glowNodes.length === 0) return '';

  const rules: string[] = [
    `@property --${prefix}-angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; }`,
    `@keyframes ${prefix}-glowSpin { from { --${prefix}-angle: 0deg; } to { --${prefix}-angle: 360deg; } }`,
  ];

  for (const node of glowNodes) {
    const borderColor = node.style.borderColor || '#3B4BF9';
    const duration = node.animation?.config.duration ?? 3;
    rules.push(`.${prefix}-node[data-id="${node.id}"] {
  border: 2px solid transparent;
  background-origin: border-box;
  background-clip: padding-box, border-box;
  background-image:
    linear-gradient(${node.style.backgroundColor || '#ffffff'}, ${node.style.backgroundColor || '#ffffff'}),
    conic-gradient(from var(--${prefix}-angle), ${borderColor}, ${borderColor}40, ${borderColor});
  animation: ${prefix}-glowSpin ${duration}s linear infinite;
  box-shadow: 0 0 16px ${borderColor}20, 0 0 4px ${borderColor}10;
}`);
  }

  return rules.join('\n');
}

export function generateDiagramCSS(diagram: Diagram, prefix: string): string {
  // Collect unique animation presets used in this diagram
  const usedPresetIds = new Set<string>();
  for (const node of diagram.nodes) {
    if (node.animation) usedPresetIds.add(node.animation.presetId);
  }
  for (const edge of diagram.edges) {
    if (edge.animation) usedPresetIds.add(edge.animation.presetId);
  }

  // Generate @keyframes blocks (one per preset type, shared)
  const keyframeBlocks: string[] = [];
  for (const pid of usedPresetIds) {
    const preset = getPreset(pid);
    if (preset) keyframeBlocks.push(compileKeyframes(preset, prefix));
  }

  // Generate per-node animation styles
  const staggerDelay = diagram.animationSettings?.staggerDelay ?? 0.1;
  const edgeDelay = diagram.animationSettings?.edgeDelay ?? 0.3;

  const nodeAnimStyles: string[] = [];
  diagram.nodes.forEach((node, i) => {
    if (node.animation) {
      const preset = getPreset(node.animation.presetId);
      if (preset) {
        const config = { ...node.animation.config, delay: node.animation.config.delay + i * staggerDelay };
        const animProp = compileAnimationProperty(preset, config, prefix);
        nodeAnimStyles.push(`.${prefix}-node[data-id="${node.id}"] { animation: ${animProp}; }`);
      }
    }
  });

  const edgeAnimStyles: string[] = [];
  diagram.edges.forEach((edge, i) => {
    if (edge.animation) {
      const preset = getPreset(edge.animation.presetId);
      if (preset) {
        const config = { ...edge.animation.config, delay: edge.animation.config.delay + edgeDelay + i * 0.1 };
        const animProp = compileAnimationProperty(preset, config, prefix);
        edgeAnimStyles.push(`.${prefix}-edge[data-id="${edge.id}"] { animation: ${animProp}; }`);
      }
    }
  });

  // Scroll-trigger observe class
  const hasScrollTrigger = [...diagram.nodes, ...diagram.edges].some(
    (el) => el.animation?.config.trigger === 'onScroll'
  );
  const observeCSS = hasScrollTrigger
    ? `.${prefix}-observe { opacity: 0; }\n.${prefix}-observe.${prefix}-visible { animation-play-state: running; }`
    : '';

  // Fallback: if no per-element animations, use the default fadeIn stagger
  const hasAnyAnimation = usedPresetIds.size > 0;
  const defaultFadeIn = hasAnyAnimation ? '' : `
@keyframes ${prefix}-fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.${prefix}-node {
  animation: ${prefix}-fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
}
${diagram.nodes.map((_, i) => `.${prefix}-node:nth-child(${i + 1}) { animation-delay: ${i * 0.1}s; }`).join('\n')}
@keyframes ${prefix}-edgeDraw {
  from { stroke-dashoffset: 1000; }
  to { stroke-dashoffset: 0; }
}`;

  return `
.${prefix} {
  position: relative;
  width: 100%;
  max-width: 900px;
  min-height: 500px;
  margin: 0 auto;
  background: #f8f9fb;
  font-family: ${FONTS.display};
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid #e2e5ea;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
}
.${prefix} * { box-sizing: border-box; margin: 0; padding: 0; }
.${prefix}-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
}
.${prefix}-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.${prefix}-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}
.${prefix}-node {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8px 12px;
  cursor: pointer;
  user-select: none;
  backdrop-filter: blur(8px);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.${prefix}-node:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(59,75,249,0.12), 0 2px 6px rgba(0,0,0,0.06);
  z-index: 10;
}
.${prefix}-node-label {
  line-height: 1.3;
  word-break: break-word;
}
.${prefix}-node-sublabel {
  opacity: 0.5;
  margin-top: 3px;
  font-weight: 400;
  letter-spacing: 0.02em;
}
.${prefix}-node-icon {
  margin-bottom: 4px;
}
.${prefix}-edge-label {
  font-family: ${FONTS.display};
}
.${prefix}-tooltip {
  position: absolute;
  background: rgba(255,255,255,0.95);
  color: #1a1a2e;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 11px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  white-space: nowrap;
  backdrop-filter: blur(12px);
  border: 1px solid #e2e5ea;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  letter-spacing: 0.02em;
}
.${prefix}-tooltip.visible {
  opacity: 1;
}
${defaultFadeIn}
${keyframeBlocks.join('\n')}
${nodeAnimStyles.join('\n')}
${edgeAnimStyles.join('\n')}
${observeCSS}
${generateGlowBorderCSS(diagram, prefix)}
${generateShimmerCSS(diagram, prefix)}
${generateGradientTextCSS(diagram, prefix)}
`;
}
