import dagre from 'dagre';
import type { DiagramNode, DiagramEdge, DiagramType } from '../types/diagram';

export function autoLayoutDiagram(
  nodes: DiagramNode[],
  edges: DiagramEdge[],
  diagramType: DiagramType
): { nodes: DiagramNode[]; edges: DiagramEdge[] } {
  if (nodes.length === 0) return { nodes, edges };

  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: getDirection(diagramType),
    nodesep: 60,
    ranksep: 80,
    marginx: 40,
    marginy: 40,
  });
  g.setDefaultEdgeLabel(() => ({}));

  for (const node of nodes) {
    g.setNode(node.id, { width: node.width, height: node.height });
  }

  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  const layoutNodes = nodes.map((node) => {
    const n = g.node(node.id);
    if (!n) return node;
    return {
      ...node,
      x: Math.round(n.x - node.width / 2),
      y: Math.round(n.y - node.height / 2),
    };
  });

  return { nodes: layoutNodes, edges };
}

function getDirection(type: DiagramType): string {
  switch (type) {
    case 'orgchart':
      return 'TB';
    case 'timeline':
      return 'LR';
    case 'process':
      return 'LR';
    case 'techstack':
      return 'TB';
    case 'flowchart':
    default:
      return 'TB';
  }
}
