import type { DiagramNode, DiagramEdge, DiagramType } from '../types/diagram';
import { generateId } from './id';
import { createDefaultPorts } from './edgePaths';

interface ParseResult {
  title: string;
  diagramType: DiagramType;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

const ARROW_REGEX = /\s*(?:→|->|-->|=>|>>|—>|\|)\s*/;

const NODE_COLORS = [
  '#3B4BF9', '#E93BCD', '#22c55e', '#f59e0b', '#06b6d4', '#8b5cf6', '#ef4444', '#14b8a6',
];

export function parseDiagramPrompt(input: string): ParseResult {
  // Keep raw lines for indent detection, trimmed lines for content
  const rawLines = input.trim().split('\n').filter((l) => l.trim());
  const trimmedLines = rawLines.map((l) => l.trim());
  if (trimmedLines.length === 0) {
    return { title: '', diagramType: 'flowchart', nodes: [], edges: [] };
  }

  // Check for hierarchy FIRST (before title extraction eats the root node)
  const hasIndent = rawLines.some((l, i) => i > 0 && /^\s{2,}/.test(l));
  if (hasIndent) {
    // Title only if first line looks like a heading (starts with # or ends with :)
    let title = '';
    let hierLines = rawLines;
    const first = trimmedLines[0];
    if (first.startsWith('#') || first.endsWith(':')) {
      title = first.replace(/^#+\s*/, '').replace(/:$/, '');
      hierLines = rawLines.slice(1);
    }
    return parseHierarchy(title, hierLines);
  }

  // Check if first line is a title (no arrows, no list markers, multi-line input)
  let title = '';
  let contentLines = trimmedLines;
  const firstLine = trimmedLines[0];
  if (
    !ARROW_REGEX.test(firstLine) &&
    !firstLine.startsWith('-') &&
    !firstLine.startsWith('*') &&
    (firstLine.startsWith('#') || firstLine.endsWith(':')) &&
    trimmedLines.length > 1
  ) {
    title = firstLine.replace(/^#+\s*/, '').replace(/:$/, '');
    contentLines = trimmedLines.slice(1);
  }

  // Detect format
  const joinedContent = contentLines.join(' ');
  if (ARROW_REGEX.test(joinedContent)) {
    return parseArrowFlow(title, contentLines);
  }

  // Simple list → linear flow
  return parseList(title, contentLines);
}

function parseArrowFlow(title: string, lines: string[]): ParseResult {
  // Could be single line: A → B → C → D
  // Or multi-line with arrows
  const allText = lines.join(' ');
  const parts = allText.split(ARROW_REGEX).map((s) => s.trim()).filter(Boolean);

  const nodes = parts.map((label, i) => createNode(label, i, parts.length, 'process'));
  const edges = createLinearEdges(nodes);

  // Detect type from keyword hints
  const diagramType = detectType(title + ' ' + allText);

  return {
    title: title || inferTitle(parts),
    diagramType,
    nodes: layoutHorizontal(nodes),
    edges,
  };
}

function parseList(title: string, lines: string[]): ParseResult {
  const items = lines.map((l) => l.replace(/^[-*•]\s*/, '').replace(/^\d+[.)]\s*/, '').trim());
  const nodes = items.map((label, i) => createNode(label, i, items.length, 'process'));
  const edges = createLinearEdges(nodes);
  const diagramType = detectType(title + ' ' + items.join(' '));

  return {
    title: title || inferTitle(items),
    diagramType,
    nodes: layoutHorizontal(nodes),
    edges,
  };
}

function parseHierarchy(title: string, rawLines: string[]): ParseResult {
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  const stack: { id: string; indent: number }[] = [];

  for (const raw of rawLines) {
    const indentMatch = raw.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1].length : 0;
    const label = raw.trim().replace(/^[-*•]\s*/, '').replace(/^\d+[.)]\s*/, '');
    if (!label) continue;

    const node = createNode(label, nodes.length, rawLines.length, indent === 0 ? 'card' : 'process');
    nodes.push(node);

    // Find parent
    while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    if (stack.length > 0) {
      edges.push({
        id: generateId(),
        source: stack[stack.length - 1].id,
        sourcePort: 'bottom',
        target: node.id,
        targetPort: 'top',
        type: 'bezier',
        style: { strokeColor: '#3B4BF9', strokeWidth: 2 },
      });
    }

    stack.push({ id: node.id, indent });
  }

  return {
    title: title || 'Diagramm',
    diagramType: 'orgchart',
    nodes,
    edges,
  };
}

function createNode(label: string, index: number, total: number, type: DiagramNode['type']): DiagramNode {
  // Extract emoji if present
  const emojiMatch = label.match(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F?)\s*/u);
  const icon = emojiMatch ? emojiMatch[1] : undefined;
  const cleanLabel = emojiMatch ? label.slice(emojiMatch[0].length) : label;

  // Split on " - " or " | " for sublabel
  const parts = cleanLabel.split(/\s[-–|]\s/);
  const mainLabel = parts[0].trim();
  const sublabel = parts[1]?.trim();

  const color = NODE_COLORS[index % NODE_COLORS.length];
  const isLast = index === total - 1;

  return {
    id: generateId(),
    type,
    x: 0,
    y: 0,
    width: type === 'card' ? 180 : 150,
    height: type === 'card' ? 70 : sublabel ? 60 : 50,
    label: mainLabel,
    sublabel,
    icon,
    style: {
      backgroundColor: '#ffffff',
      borderColor: isLast ? '#E93BCD' : color,
      borderWidth: 1,
      color: '#1a1a2e',
      fontSize: type === 'card' ? 15 : 13,
      fontWeight: 600,
      borderRadius: type === 'card' ? 14 : 12,
    },
    ports: createDefaultPorts(),
  };
}

function createLinearEdges(nodes: DiagramNode[]): DiagramEdge[] {
  const edges: DiagramEdge[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      id: generateId(),
      source: nodes[i].id,
      sourcePort: 'right',
      target: nodes[i + 1].id,
      targetPort: 'left',
      type: 'bezier',
      style: { strokeColor: '#3B4BF9', strokeWidth: 2 },
    });
  }
  return edges;
}

function layoutHorizontal(nodes: DiagramNode[]): DiagramNode[] {
  const gap = 40;
  let x = 40;
  const maxH = Math.max(...nodes.map((n) => n.height));
  return nodes.map((n) => {
    const positioned = { ...n, x, y: 40 + (maxH - n.height) / 2 };
    x += n.width + gap;
    return positioned;
  });
}

function detectType(text: string): DiagramType {
  const lower = text.toLowerCase();
  if (/org|team|hierarch|struktur|abteilung/i.test(lower)) return 'orgchart';
  if (/timeline|zeit|quarter|q[1-4]|phase|monat|meilenstein/i.test(lower)) return 'timeline';
  if (/stack|layer|schicht|architektur|infra/i.test(lower)) return 'techstack';
  if (/pipeline|prozess|workflow|flow|schritt|step/i.test(lower)) return 'process';
  return 'flowchart';
}

function inferTitle(parts: string[]): string {
  if (parts.length <= 3) return parts.join(' → ');
  return parts[0] + ' → ... → ' + parts[parts.length - 1];
}
