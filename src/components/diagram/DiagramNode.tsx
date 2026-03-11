import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { DiagramNode as DiagramNodeType, Port } from '../../types/diagram';
import { getPortPosition } from '../../utils/edgePaths';
import { useAnimationPreview } from '../../hooks/useAnimationPreview';

const BLUE = '#3B4BF9';
const PINK = '#E93BCD';
const BLUE_L = '#6875FF';

interface Props {
  node: DiagramNodeType;
  selected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onMoveEnd: () => void;
  onPortClick: (nodeId: string, portId: string) => void;
  zoom: number;
  activeTool: string;
  animationPlaying?: boolean;
  staggerIndex?: number;
}

export function DiagramNodeComponent({
  node,
  selected,
  onSelect,
  onMove,
  onMoveEnd,
  onPortClick,
  zoom,
  activeTool,
  animationPlaying = false,
  staggerIndex = 0,
}: Props) {
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; nodeX: number; nodeY: number } | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (activeTool !== 'select') return;
      e.stopPropagation();
      onSelect(node.id);
      setDragging(true);
      dragRef.current = { startX: e.clientX, startY: e.clientY, nodeX: node.x, nodeY: node.y };

      const onMouseMove = (ev: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = (ev.clientX - dragRef.current.startX) / zoom;
        const dy = (ev.clientY - dragRef.current.startY) / zoom;
        onMove(node.id, dragRef.current.nodeX + dx, dragRef.current.nodeY + dy);
      };

      const onMouseUp = () => {
        setDragging(false);
        dragRef.current = null;
        onMoveEnd();
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [node.id, node.x, node.y, zoom, activeTool, onSelect, onMove, onMoveEnd]
  );

  const {
    backgroundColor = '#ffffff',
    borderColor = BLUE,
    borderWidth = 1,
    color = '#1a1a2e',
    fontSize = 14,
    fontWeight = 500,
    borderRadius = 12,
    opacity = 1,
  } = node.style;

  const isDecision = node.type === 'decision';
  const isCircle = node.type === 'circle';
  const isTerminal = node.type === 'terminal';
  const isCard = node.type === 'card';

  const br = isCircle ? '50%' : isTerminal ? `${node.height / 2}px` : isDecision ? 0 : borderRadius;

  // Premium glow based on border color
  const glowColor = borderColor === PINK || borderColor === '#E93BCD' ? PINK : BLUE;
  const glowIntensity = selected ? 0.5 : hovered ? 0.3 : 0.12;

  const shapeStyle: React.CSSProperties = {
    position: 'absolute',
    left: node.x,
    top: node.y,
    width: node.width,
    height: node.height,
    background: backgroundColor,
    border: `${borderWidth}px solid ${selected ? PINK : hovered ? BLUE_L : adjustAlpha(borderColor, 0.3)}`,
    borderRadius: br,
    opacity,
    color,
    fontSize,
    fontWeight,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: activeTool === 'select' ? (dragging ? 'grabbing' : 'grab') : 'crosshair',
    userSelect: 'none',
    transition: dragging ? 'none' : 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: selected
      ? `0 0 0 2px ${PINK}40, 0 4px 20px rgba(59,75,249,0.15), 0 1px 3px rgba(0,0,0,0.08)`
      : hovered
        ? `0 8px 24px rgba(59,75,249,0.12), 0 2px 6px rgba(0,0,0,0.06)`
        : `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`,
    overflow: 'hidden',
    textAlign: 'center',
    padding: isCard ? '12px 16px' : '8px 12px',
    transform: isDecision ? 'rotate(45deg)' : hovered && !dragging ? 'translateY(-2px)' : undefined,
    zIndex: selected ? 10 : hovered ? 5 : 1,
    letterSpacing: '-0.01em',
  };

  const textTransform: React.CSSProperties =
    isDecision ? { transform: 'rotate(-45deg)' } : {};

  const motionProps = useAnimationPreview(node.animation, animationPlaying, staggerIndex);

  return (
    <>
      <motion.div
        style={shapeStyle}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        initial={motionProps?.initial}
        animate={motionProps?.animate}
        transition={motionProps?.transition as never}
      >
        {/* Top highlight */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: br,
          background: `linear-gradient(180deg, ${adjustAlpha(glowColor, 0.04)} 0%, transparent 50%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ ...textTransform, position: 'relative', zIndex: 1 }}>
          {node.icon && (
            <span style={{
              fontSize: fontSize * 1.6,
              marginBottom: 4,
              display: 'block',
              filter: `drop-shadow(0 1px 2px rgba(0,0,0,0.1))`,
            }}>
              {node.icon}
            </span>
          )}
          <div style={{
            lineHeight: 1.3,
            wordBreak: 'break-word',
          }}>
            {node.label}
          </div>
          {node.sublabel && (
            <div style={{
              fontSize: fontSize * 0.75,
              opacity: 0.5,
              marginTop: 3,
              fontWeight: 400,
              letterSpacing: '0.02em',
            }}>
              {node.sublabel}
            </div>
          )}
        </div>
      </motion.div>

      {/* Ports */}
      {(activeTool === 'drawEdge' || selected) &&
        node.ports.map((port) => (
          <PortDot
            key={port.id}
            node={node}
            port={port}
            onClick={() => onPortClick(node.id, port.id)}
          />
        ))}
    </>
  );
}

function PortDot({
  node,
  port,
  onClick,
}: {
  node: DiagramNodeType;
  port: Port;
  onClick: () => void;
}) {
  const pos = getPortPosition(node, port);
  return (
    <div
      onMouseDown={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{
        position: 'absolute',
        left: pos.x - 5,
        top: pos.y - 5,
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: BLUE,
        border: '2px solid #fff',
        cursor: 'crosshair',
        zIndex: 20,
        transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s',
        boxShadow: `0 1px 4px rgba(59,75,249,0.3)`,
      }}
      onMouseEnter={(e) => {
        const el = e.target as HTMLElement;
        el.style.transform = 'scale(1.6)';
        el.style.boxShadow = `0 2px 8px rgba(59,75,249,0.5)`;
      }}
      onMouseLeave={(e) => {
        const el = e.target as HTMLElement;
        el.style.transform = 'scale(1)';
        el.style.boxShadow = `0 1px 4px rgba(59,75,249,0.3)`;
      }}
    />
  );
}

function adjustAlpha(hex: string, alpha: number): string {
  const a = Math.round(alpha * 255).toString(16).padStart(2, '0');
  if (hex.length === 7) return hex + a;
  if (hex.length === 9) return hex.slice(0, 7) + a;
  return hex;
}
