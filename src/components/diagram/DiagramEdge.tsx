import { useState } from 'react';
import { motion } from 'framer-motion';
import type { DiagramEdge as DiagramEdgeType, DiagramNode } from '../../types/diagram';
import { getEdgePath } from '../../utils/edgePaths';
import { useEdgeAnimationPreview } from '../../hooks/useAnimationPreview';
import { FONTS } from '../../utils/cegtecTheme';

const PINK = '#E93BCD';

interface Props {
  edge: DiagramEdgeType;
  sourceNode: DiagramNode;
  targetNode: DiagramNode;
  selected: boolean;
  onSelect: (id: string) => void;
  animationPlaying?: boolean;
  staggerIndex?: number;
}

export function DiagramEdgeComponent({ edge, sourceNode, targetNode, selected, onSelect, animationPlaying = false, staggerIndex = 0 }: Props) {
  const [hovered, setHovered] = useState(false);
  const edgeMotion = useEdgeAnimationPreview(edge.animation, animationPlaying, staggerIndex);
  const { path, labelPos } = getEdgePath(edge, sourceNode, targetNode);
  if (!path) return null;

  const {
    strokeColor = '#3B4BF9',
    strokeWidth = 2,
    strokeDasharray,
    animated,
  } = edge.style;

  const actualColor = selected ? PINK : hovered ? '#6875FF' : strokeColor;
  const glowOpacity = selected ? 0.5 : hovered ? 0.3 : 0.15;
  const filterId = `edge-glow-${edge.id}`;

  return (
    <g
      onClick={(e) => { e.stopPropagation(); onSelect(edge.id); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      <defs>
        {/* Arrowhead */}
        <marker
          id={`arrow-${edge.id}`}
          markerWidth="12"
          markerHeight="8"
          refX="10"
          refY="4"
          orient="auto"
        >
          <path d="M 0 0.5 L 10 4 L 0 7.5 L 2.5 4 Z" fill={actualColor} />
        </marker>
        {/* Glow filter */}
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Invisible wide path for click target */}
      <path d={path} fill="none" stroke="transparent" strokeWidth={16} />

      {/* Glow path (behind) */}
      <path
        d={path}
        fill="none"
        stroke={actualColor}
        strokeWidth={(selected ? strokeWidth + 2 : strokeWidth) + 3}
        strokeLinecap="round"
        opacity={glowOpacity}
        filter={`url(#${filterId})`}
        style={{ transition: 'all 0.2s ease' }}
      />

      {/* Visible path */}
      <motion.path
        d={path}
        fill="none"
        stroke={actualColor}
        strokeWidth={selected ? strokeWidth + 1 : strokeWidth}
        strokeDasharray={animated ? '8 4' : strokeDasharray}
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={`url(#arrow-${edge.id})`}
        style={{ transition: 'all 0.2s ease' }}
        initial={edgeMotion?.initial as never}
        animate={edgeMotion?.animate as never}
        transition={edgeMotion?.transition as never}
      >
        {animated && !edge.animation && (
          <animate
            attributeName="stroke-dashoffset"
            from="24"
            to="0"
            dur="1s"
            repeatCount="indefinite"
          />
        )}
      </motion.path>

      {/* Label */}
      {edge.label && (
        <g style={{ transition: 'all 0.2s ease' }}>
          <rect
            x={labelPos.x - edge.label.length * 4 - 4}
            y={labelPos.y - 11}
            width={edge.label.length * 8 + 8}
            height={22}
            rx={6}
            fill="rgba(255,255,255,0.95)"
            stroke={actualColor}
            strokeWidth={1}
            strokeOpacity={0.3}
          />
          <text
            x={labelPos.x}
            y={labelPos.y + 4}
            textAnchor="middle"
            fill="#1a1a2e"
            fontSize={11}
            fontFamily={FONTS.display}
            fontWeight={500}
            letterSpacing="0.02em"
          >
            {edge.label}
          </text>
        </g>
      )}
    </g>
  );
}
