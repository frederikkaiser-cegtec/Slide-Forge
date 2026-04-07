import type { Diagram, DiagramNode, DiagramEdge } from '../types/diagram';
import { getEdgePath } from '../utils/edgePaths';
import { getPreset, compileKeyframes, compileAnimationProperty } from '../animation';
import { compileToSVGAnimate } from '../animation/svgCompiler';
import { FONTS } from '../utils/cegtecTheme';

export function generateAnimatedSVG(diagram: Diagram): string {
  if (diagram.nodes.length === 0) return '<svg xmlns="http://www.w3.org/2000/svg"></svg>';

  // Calculate bounds
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of diagram.nodes) {
    minX = Math.min(minX, n.x);
    minY = Math.min(minY, n.y);
    maxX = Math.max(maxX, n.x + n.width);
    maxY = Math.max(maxY, n.y + n.height);
  }
  const pad = 40;
  const offsetX = -minX + pad;
  const offsetY = -minY + pad;
  const w = maxX - minX + pad * 2;
  const h = maxY - minY + pad * 2;

  const prefix = `sf-${diagram.id.slice(0, 8)}`;
  const staggerDelay = diagram.animationSettings?.staggerDelay ?? 0.1;
  const edgeDelay = diagram.animationSettings?.edgeDelay ?? 0.3;

  // Collect CSS keyframes for animated nodes
  const usedPresets = new Set<string>();
  for (const node of diagram.nodes) {
    if (node.animation) usedPresets.add(node.animation.presetId);
  }
  const keyframeCSS = [...usedPresets]
    .map((pid) => {
      const p = getPreset(pid);
      return p ? compileKeyframes(p, prefix) : '';
    })
    .filter(Boolean)
    .join('\n');

  // Node animation CSS
  const nodeAnimCSS = diagram.nodes
    .map((node, i) => {
      if (!node.animation) return '';
      const preset = getPreset(node.animation.presetId);
      if (!preset) return '';
      const config = { ...node.animation.config, delay: node.animation.config.delay + i * staggerDelay };
      return `.${prefix}-n-${node.id} { animation: ${compileAnimationProperty(preset, config, prefix)}; }`;
    })
    .filter(Boolean)
    .join('\n');

  const styleBlock = keyframeCSS || nodeAnimCSS
    ? `<style>\n${keyframeCSS}\n${nodeAnimCSS}\n</style>`
    : '';

  // Render edges
  const edgesSvg = diagram.edges.map((edge, i) => {
    const src = diagram.nodes.find((n) => n.id === edge.source);
    const tgt = diagram.nodes.find((n) => n.id === edge.target);
    if (!src || !tgt) return '';

    const offsetSrc = { ...src, x: src.x + offsetX, y: src.y + offsetY };
    const offsetTgt = { ...tgt, x: tgt.x + offsetX, y: tgt.y + offsetY };
    const { path, labelPos } = getEdgePath(edge, offsetSrc, offsetTgt);
    if (!path) return '';

    const { strokeColor = '#3B4BF9', strokeWidth = 2, strokeDasharray, animated } = edge.style;

    let animateEl = '';
    if (edge.animation) {
      const preset = getPreset(edge.animation.presetId);
      if (preset) {
        const config = { ...edge.animation.config, delay: edge.animation.config.delay + edgeDelay + i * 0.1 };
        animateEl = compileToSVGAnimate(preset, config);
      }
    } else if (animated) {
      animateEl = '<animate attributeName="stroke-dashoffset" from="24" to="0" dur="1s" repeatCount="indefinite"/>';
    }

    const dashAttr = animated ? ' stroke-dasharray="8 4"' : strokeDasharray ? ` stroke-dasharray="${strokeDasharray}"` : '';
    const drawDash = edge.animation?.presetId === 'drawLine' || edge.animation?.presetId === 'strokeDraw'
      ? ' stroke-dasharray="1000" stroke-dashoffset="1000"'
      : '';

    // Arrow marker
    const arrowId = `arrow-${edge.id}`;
    const marker = `<marker id="${arrowId}" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M 0 0 L 10 4 L 0 8 L 2 4 Z" fill="${strokeColor}"/></marker>`;

    let labelSvg = '';
    if (edge.label) {
      const tw = edge.label.length * 7 + 12;
      labelSvg = `<rect x="${labelPos.x - tw / 2}" y="${labelPos.y - 11}" width="${tw}" height="22" rx="6" fill="rgba(255,255,255,0.95)" stroke="${strokeColor}" stroke-width="1" stroke-opacity="0.3"/><text x="${labelPos.x}" y="${labelPos.y + 4}" text-anchor="middle" fill="#1a1a2e" font-size="11" font-family="${FONTS.display}" font-weight="500">${escapeXml(edge.label)}</text>`;
    }

    return `<defs>${marker}</defs>
<path d="${path}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}"${dashAttr}${drawDash} stroke-linecap="round" marker-end="url(#${arrowId})">${animateEl}</path>
${labelSvg}`;
  }).join('\n');

  // Render nodes as foreignObject
  const nodesSvg = diagram.nodes.map((node) => {
    const x = node.x + offsetX;
    const y = node.y + offsetY;
    const {
      backgroundColor = '#ffffff',
      borderColor = '#3B4BF9',
      borderWidth = 1,
      color = '#1a1a2e',
      fontSize = 14,
      fontWeight = 500,
      borderRadius = 12,
      opacity = 1,
    } = node.style;

    const isCircle = node.type === 'circle';
    const isTerminal = node.type === 'terminal';
    const isDecision = node.type === 'decision';
    const br = isCircle ? '50%' : isTerminal ? `${node.height / 2}px` : isDecision ? '0' : `${borderRadius}px`;
    const transform = isDecision ? 'transform:rotate(45deg);' : '';
    const innerTransform = isDecision ? 'transform:rotate(-45deg);' : '';
    const animClass = node.animation ? ` ${prefix}-n-${node.id}` : '';

    // SVG animate for nodes without CSS support
    let svgAnimEl = '';
    if (node.animation) {
      const preset = getPreset(node.animation.presetId);
      if (preset && !['countUp', 'typewriter'].includes(preset.effectType)) {
        // Use CSS animation via class (above), SVG animate as fallback
      }
    }

    return `<foreignObject x="${x}" y="${y}" width="${node.width}" height="${node.height}">
  <div xmlns="http://www.w3.org/1999/xhtml" class="${prefix}-n${animClass}" style="width:${node.width}px;height:${node.height}px;background:${backgroundColor};border:${borderWidth}px solid ${borderColor}4d;border-radius:${br};color:${color};font-size:${fontSize}px;font-weight:${fontWeight};opacity:${opacity};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:8px 12px;font-family:${FONTS.display};letter-spacing:-0.01em;${transform}">
    <div style="${innerTransform}">
${node.icon ? `      <span style="font-size:${fontSize * 1.6}px;margin-bottom:4px;display:block">${node.icon}</span>` : ''}
      <div style="line-height:1.3;word-break:break-word">${escapeXml(node.label)}</div>
${node.sublabel ? `      <div style="font-size:${fontSize * 0.75}px;opacity:0.5;margin-top:3px;font-weight:400">${escapeXml(node.sublabel)}</div>` : ''}
    </div>
  </div>
</foreignObject>`;
  }).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
${styleBlock}
<rect width="${w}" height="${h}" fill="#f8f9fb"/>
${edgesSvg}
${nodesSvg}
</svg>`;
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
