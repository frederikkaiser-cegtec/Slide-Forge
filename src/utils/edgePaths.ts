import type { DiagramNode, DiagramEdge, Port } from '../types/diagram';

interface Point {
  x: number;
  y: number;
}

export function getPortPosition(node: DiagramNode, port: Port): Point {
  const offset = port.offset ?? 0.5;
  switch (port.side) {
    case 'top':
      return { x: node.x + node.width * offset, y: node.y };
    case 'bottom':
      return { x: node.x + node.width * offset, y: node.y + node.height };
    case 'left':
      return { x: node.x, y: node.y + node.height * offset };
    case 'right':
      return { x: node.x + node.width, y: node.y + node.height * offset };
  }
}

export function getEdgePath(
  edge: DiagramEdge,
  sourceNode: DiagramNode,
  targetNode: DiagramNode
): { path: string; labelPos: Point } {
  const sourcePort = sourceNode.ports.find((p) => p.id === edge.sourcePort);
  const targetPort = targetNode.ports.find((p) => p.id === edge.targetPort);

  if (!sourcePort || !targetPort) {
    return { path: '', labelPos: { x: 0, y: 0 } };
  }

  const start = getPortPosition(sourceNode, sourcePort);
  const end = getPortPosition(targetNode, targetPort);

  switch (edge.type) {
    case 'straight':
      return straightPath(start, end);
    case 'step':
      return stepPath(start, end, sourcePort.side, targetPort.side);
    case 'bezier':
    default:
      return bezierPath(start, end, sourcePort.side, targetPort.side);
  }
}

function straightPath(start: Point, end: Point): { path: string; labelPos: Point } {
  return {
    path: `M ${start.x} ${start.y} L ${end.x} ${end.y}`,
    labelPos: { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 },
  };
}

function bezierPath(
  start: Point,
  end: Point,
  startSide: string,
  endSide: string
): { path: string; labelPos: Point } {
  const dist = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
  const offset = Math.max(50, dist * 0.4);

  const cp1 = getControlPoint(start, startSide, offset);
  const cp2 = getControlPoint(end, endSide, offset);

  const path = `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`;
  // Approximate midpoint of cubic bezier
  const t = 0.5;
  const labelPos = {
    x: (1 - t) ** 3 * start.x + 3 * (1 - t) ** 2 * t * cp1.x + 3 * (1 - t) * t ** 2 * cp2.x + t ** 3 * end.x,
    y: (1 - t) ** 3 * start.y + 3 * (1 - t) ** 2 * t * cp1.y + 3 * (1 - t) * t ** 2 * cp2.y + t ** 3 * end.y,
  };

  return { path, labelPos };
}

function stepPath(
  start: Point,
  end: Point,
  startSide: string,
  endSide: string
): { path: string; labelPos: Point } {
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  let path: string;

  if (
    (startSide === 'bottom' || startSide === 'top') &&
    (endSide === 'top' || endSide === 'bottom')
  ) {
    path = `M ${start.x} ${start.y} L ${start.x} ${midY} L ${end.x} ${midY} L ${end.x} ${end.y}`;
  } else if (
    (startSide === 'left' || startSide === 'right') &&
    (endSide === 'left' || endSide === 'right')
  ) {
    path = `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
  } else {
    path = `M ${start.x} ${start.y} L ${start.x} ${end.y} L ${end.x} ${end.y}`;
  }

  return { path, labelPos: { x: midX, y: midY } };
}

function getControlPoint(point: Point, side: string, offset: number): Point {
  switch (side) {
    case 'top':
      return { x: point.x, y: point.y - offset };
    case 'bottom':
      return { x: point.x, y: point.y + offset };
    case 'left':
      return { x: point.x - offset, y: point.y };
    case 'right':
      return { x: point.x + offset, y: point.y };
    default:
      return point;
  }
}

export function createDefaultPorts(): Port[] {
  return [
    { id: 'top', side: 'top', offset: 0.5 },
    { id: 'right', side: 'right', offset: 0.5 },
    { id: 'bottom', side: 'bottom', offset: 0.5 },
    { id: 'left', side: 'left', offset: 0.5 },
  ];
}
