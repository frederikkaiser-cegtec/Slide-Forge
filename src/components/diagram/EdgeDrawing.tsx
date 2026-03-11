import { useState, useEffect } from 'react';
import type { DiagramNode } from '../../types/diagram';
import { getPortPosition } from '../../utils/edgePaths';

interface Props {
  fromNodeId: string;
  fromPortId: string;
  nodes: DiagramNode[];
  zoom: number;
  panX: number;
  panY: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function EdgeDrawing({ fromNodeId, fromPortId, nodes, zoom, panX, panY, containerRef }: Props) {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const sourceNode = nodes.find((n) => n.id === fromNodeId);
  const sourcePort = sourceNode?.ports.find((p) => p.id === fromPortId);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / zoom - panX / zoom,
        y: (e.clientY - rect.top) / zoom - panY / zoom,
      });
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [zoom, panX, panY, containerRef]);

  if (!sourceNode || !sourcePort || !mousePos) return null;

  const start = getPortPosition(sourceNode, sourcePort);

  return (
    <line
      x1={start.x}
      y1={start.y}
      x2={mousePos.x}
      y2={mousePos.y}
      stroke="#E93BCD"
      strokeWidth={2}
      strokeDasharray="6 4"
      pointerEvents="none"
    />
  );
}
