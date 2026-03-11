import type { Diagram, DiagramNode, DiagramEdge } from '../types/diagram';
import { getEdgePath } from '../utils/edgePaths';
import { generateDiagramCSS } from './cssGenerator';
import { generateDiagramJS } from './jsGenerator';

export interface ExportOptions {
  includeInteractivity?: boolean;
  minify?: boolean;
  standalone?: boolean;
}

export function generateDiagramHTML(
  diagram: Diagram,
  options: ExportOptions = {}
): string {
  const { includeInteractivity = true, minify = false, standalone = true } = options;
  const prefix = `sf-${diagram.id.slice(0, 8)}`;

  const css = generateDiagramCSS(diagram, prefix);
  const js = includeInteractivity ? generateDiagramJS(prefix, diagram) : '';

  // Calculate bounds
  const bounds = calculateBounds(diagram.nodes);
  const offsetX = -bounds.minX + 40;
  const offsetY = -bounds.minY + 40;
  const canvasW = bounds.width + 80;
  const canvasH = bounds.height + 80;

  const nodesHtml = diagram.nodes.map((node) => renderNode(node, prefix, offsetX, offsetY)).join('\n');
  const edgesSvg = diagram.edges.map((edge) => {
    const src = diagram.nodes.find((n) => n.id === edge.source);
    const tgt = diagram.nodes.find((n) => n.id === edge.target);
    if (!src || !tgt) return '';
    // Offset the nodes for path calculation
    const offsetSrc = { ...src, x: src.x + offsetX, y: src.y + offsetY };
    const offsetTgt = { ...tgt, x: tgt.x + offsetX, y: tgt.y + offsetY };
    return renderEdge(edge, offsetSrc, offsetTgt, prefix);
  }).join('\n');

  const body = `<div class="${prefix}">
  <!-- Atmospheric Background -->
  <svg class="${prefix}-bg" viewBox="0 0 ${canvasW} ${canvasH}">
    <defs>
      <filter id="${prefix}-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="80"/></filter>
      <filter id="${prefix}-edgeGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="${prefix}-noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feBlend in="SourceGraphic" mode="multiply"/></filter>
      <linearGradient id="${prefix}-topLine" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#E93BCD" stop-opacity="0"/><stop offset="30%" stop-color="#E93BCD"/><stop offset="70%" stop-color="#3B4BF9"/><stop offset="100%" stop-color="#3B4BF9" stop-opacity="0"/></linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="#f8f9fb"/>
    <ellipse cx="80%" cy="15%" rx="350" ry="250" fill="#3B4BF9" opacity="0.03" filter="url(#${prefix}-soft)"/>
    <ellipse cx="15%" cy="80%" rx="300" ry="200" fill="#E93BCD" opacity="0.02" filter="url(#${prefix}-soft)"/>
    <rect y="0" width="100%" height="2" fill="url(#${prefix}-topLine)"/>
  </svg>
  <div class="${prefix}-canvas" style="width:${canvasW}px;height:${canvasH}px;">
    <svg class="${prefix}-svg" viewBox="0 0 ${canvasW} ${canvasH}">
      <defs>
${diagram.edges.map((e) => renderArrowDef(e, prefix)).join('\n')}
      </defs>
      <!-- Edge glow layer -->
${diagram.edges.map((edge) => {
    const src = diagram.nodes.find((n) => n.id === edge.source);
    const tgt = diagram.nodes.find((n) => n.id === edge.target);
    if (!src || !tgt) return '';
    const offsetSrc = { ...src, x: src.x + offsetX, y: src.y + offsetY };
    const offsetTgt = { ...tgt, x: tgt.x + offsetX, y: tgt.y + offsetY };
    const { path } = getEdgePath(edge, offsetSrc, offsetTgt);
    const color = edge.style.strokeColor ?? '#3B4BF9';
    return path ? `      <path d="${path}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" opacity="0.2" filter="url(#${prefix}-edgeGlow)"/>` : '';
  }).join('\n')}
${edgesSvg}
    </svg>
${nodesHtml}
  </div>
</div>`;

  if (standalone) {
    let html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(diagram.title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>${css}</style>
</head>
<body style="margin:0;padding:20px;background:#f0f1f5;display:flex;justify-content:center;align-items:center;min-height:100vh;">
${body}
${js ? `<script>${js}</script>` : ''}
</body>
</html>`;

    if (minify) {
      html = html.replace(/\n\s*/g, '').replace(/\s{2,}/g, ' ');
    }
    return html;
  }

  // Embed mode (for Webflow Custom Code)
  let embed = `<style>${css}</style>\n${body}`;
  if (js) embed += `\n<script>${js}</script>`;
  if (minify) {
    embed = embed.replace(/\n\s*/g, '').replace(/\s{2,}/g, ' ');
  }
  return embed;
}

function renderNode(node: DiagramNode, prefix: string, offsetX: number, offsetY: number): string {
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

  const x = node.x + offsetX;
  const y = node.y + offsetY;

  const isDecision = node.type === 'decision';
  const isCircle = node.type === 'circle';
  const isTerminal = node.type === 'terminal';
  const br = isCircle ? '50%' : isTerminal ? `${node.height / 2}px` : isDecision ? '0' : `${borderRadius}px`;
  const transform = isDecision ? 'transform:rotate(45deg);' : '';
  const innerTransform = isDecision ? ' style="transform:rotate(-45deg)"' : '';
  const shadow = 'box-shadow:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);';
  const observeClass = node.animation?.config.trigger === 'onScroll' ? ` ${prefix}-observe` : '';
  const typewriterAttr = node.animation?.presetId === 'typewriter'
    ? ` data-typewriter="${escapeHtml(node.label)}" data-tw-duration="${node.animation.config.duration}" data-tw-delay="${node.animation.config.delay}"`
    : '';

  const counterVal = node.data?.counter != null ? Number(node.data.counter) : null;
  const counterAttr = counterVal != null ? ` data-counter="${counterVal}"` : '';
  const labelText = counterVal != null ? '0' : escapeHtml(node.label);

  return `    <div class="${prefix}-node${observeClass}" data-id="${node.id}" data-label="${escapeHtml(node.label)}" data-sublabel="${escapeHtml(node.sublabel ?? '')}"${typewriterAttr} style="left:${x}px;top:${y}px;width:${node.width}px;height:${node.height}px;background:${backgroundColor};border:${borderWidth}px solid ${borderColor}4d;border-radius:${br};color:${color};font-size:${fontSize}px;font-weight:${fontWeight};opacity:${opacity};${shadow}letter-spacing:-0.01em;${transform}">
      <div${innerTransform}>
${node.icon ? `        <span class="${prefix}-node-icon" style="font-size:${fontSize * 1.6}px">${node.icon}</span>` : ''}
        <div class="${prefix}-node-label"${counterAttr}>${labelText}</div>
${node.sublabel ? `        <div class="${prefix}-node-sublabel" style="font-size:${fontSize * 0.75}px">${escapeHtml(node.sublabel)}</div>` : ''}
      </div>
    </div>`;
}

function renderEdge(edge: DiagramEdge, src: DiagramNode, tgt: DiagramNode, prefix: string): string {
  const { path, labelPos } = getEdgePath(edge, src, tgt);
  if (!path) return '';

  const { strokeColor = '#3B4BF9', strokeWidth = 2, strokeDasharray, animated } = edge.style;

  let animAttr = '';
  if (animated) {
    animAttr = ` stroke-dasharray="8 4"><animate attributeName="stroke-dashoffset" from="24" to="0" dur="1s" repeatCount="indefinite"/`;
  }

  let labelSvg = '';
  if (edge.label) {
    const tw = edge.label.length * 7 + 12;
    labelSvg = `
      <rect x="${labelPos.x - tw / 2}" y="${labelPos.y - 11}" width="${tw}" height="22" rx="6" fill="rgba(255,255,255,0.95)" stroke="${strokeColor}" stroke-width="1" stroke-opacity="0.3"/>
      <text class="${prefix}-edge-label" x="${labelPos.x}" y="${labelPos.y + 4}" text-anchor="middle" fill="#1a1a2e" font-size="11" font-weight="500" letter-spacing="0.02em">${escapeHtml(edge.label)}</text>`;
  }

  return `      <path d="${path}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}"${strokeDasharray ? ` stroke-dasharray="${strokeDasharray}"` : ''} stroke-linecap="round" marker-end="url(#${prefix}-arrow-${edge.id})"${animAttr}/>
${labelSvg}`;
}

function renderArrowDef(edge: DiagramEdge, prefix: string): string {
  const color = edge.style.strokeColor ?? '#3B4BF9';
  return `        <marker id="${prefix}-arrow-${edge.id}" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
          <path d="M 0 0 L 10 4 L 0 8 L 2 4 Z" fill="${color}"/>
        </marker>`;
}

function calculateBounds(nodes: DiagramNode[]): { minX: number; minY: number; width: number; height: number } {
  if (nodes.length === 0) return { minX: 0, minY: 0, width: 400, height: 300 };

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of nodes) {
    minX = Math.min(minX, n.x);
    minY = Math.min(minY, n.y);
    maxX = Math.max(maxX, n.x + n.width);
    maxY = Math.max(maxY, n.y + n.height);
  }

  return { minX, minY, width: maxX - minX, height: maxY - minY };
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
