import { useRef, useCallback } from 'react';
import { useDiagramStore } from '../../stores/diagramStore';
import { useEditorStore } from '../../stores/editorStore';
import { DiagramNodeComponent } from './DiagramNode';
import { DiagramEdgeComponent } from './DiagramEdge';
import { EdgeDrawing } from './EdgeDrawing';
import { generateId } from '../../utils/id';
import { createDefaultPorts } from '../../utils/edgePaths';

const BLUE = '#3B4BF9';
const PINK = '#E93BCD';

export function DiagramCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { diagram, moveNode, addNode, addEdge, pushUndo } = useDiagramStore();
  const animationPlaying = useEditorStore((s) => s.animationPreviewPlaying);
  const animationEpoch = useEditorStore((s) => s.animationEpoch);
  const {
    diagramTool,
    selectedNodeId,
    selectedEdgeId,
    drawingEdgeFrom,
    diagramZoom,
    diagramPan,
    selectNode,
    selectEdge,
    setDrawingEdgeFrom,
    setDiagramZoom,
    setDiagramPan,
    clearDiagramSelection,
  } = useEditorStore();

  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setDiagramZoom(diagramZoom * delta);
      } else {
        setDiagramPan({
          x: diagramPan.x - e.deltaX,
          y: diagramPan.y - e.deltaY,
        });
      }
    },
    [diagramZoom, diagramPan, setDiagramZoom, setDiagramPan]
  );

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target !== e.currentTarget && diagramTool !== 'pan') return;

      if (diagramTool === 'pan' || e.button === 1) {
        isPanning.current = true;
        panStart.current = { x: e.clientX, y: e.clientY, panX: diagramPan.x, panY: diagramPan.y };

        const onMove = (ev: MouseEvent) => {
          setDiagramPan({
            x: panStart.current.panX + (ev.clientX - panStart.current.x),
            y: panStart.current.panY + (ev.clientY - panStart.current.y),
          });
        };
        const onUp = () => {
          isPanning.current = false;
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return;
      }

      if (diagramTool === 'addNode') {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - rect.left - diagramPan.x) / diagramZoom;
        const y = (e.clientY - rect.top - diagramPan.y) / diagramZoom;

        const snapX = Math.round(x / diagram.gridSize) * diagram.gridSize;
        const snapY = Math.round(y / diagram.gridSize) * diagram.gridSize;

        addNode({
          id: generateId(),
          type: 'process',
          x: snapX - 70,
          y: snapY - 25,
          width: 140,
          height: 50,
          label: 'Neuer Node',
          style: {
            backgroundColor: '#ffffff',
            borderColor: BLUE,
            borderWidth: 1,
            color: '#1a1a2e',
            fontSize: 13,
            fontWeight: 500,
            borderRadius: 12,
          },
          ports: createDefaultPorts(),
        });
        return;
      }

      if (diagramTool === 'drawEdge' && drawingEdgeFrom) {
        setDrawingEdgeFrom(null);
        return;
      }

      clearDiagramSelection();
    },
    [diagramTool, diagramPan, diagramZoom, diagram.gridSize, drawingEdgeFrom, addNode, clearDiagramSelection, setDrawingEdgeFrom, setDiagramPan]
  );

  const handleNodeMove = useCallback(
    (nodeId: string, x: number, y: number) => {
      const snap = diagram.gridSize;
      moveNode(nodeId, Math.round(x / snap) * snap, Math.round(y / snap) * snap);
    },
    [diagram.gridSize, moveNode]
  );

  const handleNodeMoveEnd = useCallback(() => {
    pushUndo();
  }, [pushUndo]);

  const handlePortClick = useCallback(
    (nodeId: string, portId: string) => {
      if (diagramTool !== 'drawEdge') return;

      if (!drawingEdgeFrom) {
        setDrawingEdgeFrom({ nodeId, portId });
      } else {
        if (drawingEdgeFrom.nodeId === nodeId) return;
        addEdge({
          id: generateId(),
          source: drawingEdgeFrom.nodeId,
          sourcePort: drawingEdgeFrom.portId,
          target: nodeId,
          targetPort: portId,
          type: 'bezier',
          style: { strokeColor: BLUE, strokeWidth: 2 },
        });
        setDrawingEdgeFrom(null);
      }
    },
    [diagramTool, drawingEdgeFrom, addEdge, setDrawingEdgeFrom]
  );

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-hidden relative"
      style={{
        background: diagram.background || '#f8f9fb',
        cursor: diagramTool === 'pan' ? 'grab' : diagramTool === 'addNode' ? 'crosshair' : 'default',
      }}
      onWheel={handleWheel}
      onMouseDown={handleCanvasMouseDown}
    >
      {/* Light Background with subtle accents */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <filter id="dc-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="100" />
          </filter>
          <linearGradient id="dc-topLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={PINK} stopOpacity="0" />
            <stop offset="30%" stopColor={PINK} stopOpacity="0.6" />
            <stop offset="70%" stopColor={BLUE} stopOpacity="0.6" />
            <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Soft colored orbs */}
        <ellipse cx="80%" cy="15%" rx="350" ry="250" fill={BLUE} opacity="0.04" filter="url(#dc-soft)" />
        <ellipse cx="15%" cy="80%" rx="300" ry="200" fill={PINK} opacity="0.03" filter="url(#dc-soft)" />

        {/* Top accent line */}
        <rect y="0" width="100%" height="2" fill="url(#dc-topLine)" />
      </svg>

      {/* Grid dots */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <pattern
            id="diagram-grid"
            width={diagram.gridSize * diagramZoom}
            height={diagram.gridSize * diagramZoom}
            patternUnits="userSpaceOnUse"
            x={diagramPan.x % (diagram.gridSize * diagramZoom)}
            y={diagramPan.y % (diagram.gridSize * diagramZoom)}
          >
            <circle cx={1} cy={1} r={0.6} fill="rgba(59,75,249,0.15)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagram-grid)" />
      </svg>

      {/* Zoom/Pan container */}
      <div
        style={{
          transform: `translate(${diagramPan.x}px, ${diagramPan.y}px) scale(${diagramZoom})`,
          transformOrigin: '0 0',
          position: 'absolute',
          inset: 0,
        }}
      >
        {/* SVG layer for edges */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '5000px',
            height: '5000px',
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          <g style={{ pointerEvents: 'auto' }}>
            {diagram.edges.map((edge, edgeIdx) => {
              const src = diagram.nodes.find((n) => n.id === edge.source);
              const tgt = diagram.nodes.find((n) => n.id === edge.target);
              if (!src || !tgt) return null;
              return (
                <DiagramEdgeComponent
                  key={`${edge.id}-${animationEpoch}`}
                  edge={edge}
                  sourceNode={src}
                  targetNode={tgt}
                  selected={selectedEdgeId === edge.id}
                  onSelect={selectEdge}
                  animationPlaying={animationPlaying}
                  staggerIndex={diagram.nodes.length + edgeIdx}
                />
              );
            })}
          </g>

          {/* Drawing edge preview */}
          {drawingEdgeFrom && (
            <EdgeDrawing
              fromNodeId={drawingEdgeFrom.nodeId}
              fromPortId={drawingEdgeFrom.portId}
              nodes={diagram.nodes}
              zoom={diagramZoom}
              panX={diagramPan.x}
              panY={diagramPan.y}
              containerRef={containerRef}
            />
          )}
        </svg>

        {/* HTML layer for nodes */}
        {diagram.nodes.map((node, nodeIdx) => (
          <DiagramNodeComponent
            key={`${node.id}-${animationEpoch}`}
            node={node}
            selected={selectedNodeId === node.id}
            onSelect={selectNode}
            onMove={handleNodeMove}
            onMoveEnd={handleNodeMoveEnd}
            onPortClick={handlePortClick}
            zoom={diagramZoom}
            activeTool={diagramTool}
            animationPlaying={animationPlaying}
            staggerIndex={nodeIdx}
          />
        ))}
      </div>

      {/* Zoom indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          fontSize: 11,
          color: '#8890a0',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(8px)',
          padding: '4px 10px',
          borderRadius: 6,
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.05em',
        }}
      >
        {Math.round(diagramZoom * 100)}%
      </div>
    </div>
  );
}
