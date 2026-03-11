export type DiagramType = 'flowchart' | 'orgchart' | 'timeline' | 'techstack' | 'process';

export type NodeShape = 'process' | 'decision' | 'terminal' | 'data' | 'circle' | 'card';

export interface DiagramNodeStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  color?: string;
  fontSize?: number;
  fontWeight?: number;
  borderRadius?: number;
  opacity?: number;
  width?: number;
  height?: number;
}

export interface Port {
  id: string;
  side: 'top' | 'right' | 'bottom' | 'left';
  offset?: number; // 0-1, default 0.5
}

export interface DiagramNode {
  id: string;
  type: NodeShape;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  sublabel?: string;
  icon?: string;
  style: DiagramNodeStyle;
  ports: Port[];
  data?: Record<string, unknown>;
  animation?: import('./animation').ElementAnimation;
}

export type EdgeType = 'bezier' | 'step' | 'straight';

export interface DiagramEdgeStyle {
  strokeColor?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  animated?: boolean;
}

export interface DiagramEdge {
  id: string;
  source: string; // node id
  sourcePort: string; // port id
  target: string;
  targetPort: string;
  type: EdgeType;
  label?: string;
  style: DiagramEdgeStyle;
  animation?: import('./animation').ElementAnimation;
}

export interface Diagram {
  id: string;
  title: string;
  diagramType: DiagramType;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  background: string;
  gridSize: number;
  themeId: string;
  createdAt: number;
  updatedAt: number;
  animationSettings?: import('./animation').DiagramAnimationSettings;
}

export type DiagramTool = 'select' | 'addNode' | 'drawEdge' | 'pan';

export interface DiagramTemplate {
  id: string;
  name: string;
  description: string;
  diagramType: DiagramType;
  icon: string;
  create: (themeColors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textMuted: string;
    accent: string;
  }) => Omit<Diagram, 'id' | 'createdAt' | 'updatedAt'>;
}
