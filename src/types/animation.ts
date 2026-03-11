// Animation Effect Types
export type AnimationEffectType =
  | 'fadeIn'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleIn'
  | 'countUp'
  | 'drawLine'
  | 'growBar'
  | 'pulse'
  | 'typewriter'
  | 'blurIn'
  | 'popIn'
  | 'dashFlow'
  | 'strokeDraw'
  | 'clipReveal'
  | 'glowBorder'
  | 'shimmer'
  | 'gradientText'
  | 'glowPulse';

export type AnimationTrigger = 'onLoad' | 'onScroll' | 'onHover' | 'stagger';

export type AnimationEasing =
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'linear'
  | 'spring'
  | 'vercel';

export type AnimationCategory =
  | 'einblenden'
  | 'bewegen'
  | 'skalieren'
  | 'zeichnen'
  | 'daten'
  | 'effekte';

export interface AnimationConfig {
  duration: number;       // seconds
  delay: number;          // seconds
  easing: AnimationEasing;
  trigger: AnimationTrigger;
  iterationCount: number | 'infinite';
  fillMode: 'forwards' | 'backwards' | 'both' | 'none';
}

export interface AnimationKeyframe {
  offset: number;  // 0–1
  properties: Record<string, string | number>;
}

export interface AnimationPreset {
  id: string;
  name: string;              // German display name
  category: AnimationCategory;
  effectType: AnimationEffectType;
  keyframes: AnimationKeyframe[];
  defaultConfig: AnimationConfig;
  // framer-motion equivalents
  motionInitial: Record<string, string | number>;
  motionAnimate: Record<string, string | number>;
  motionTransition: Record<string, string | number>;
}

export interface ElementAnimation {
  presetId: string;
  config: AnimationConfig;
}

export interface DiagramAnimationSettings {
  staggerDelay: number;    // seconds between elements
  edgeDelay: number;       // seconds after nodes before edges start
  autoPlay: boolean;
  loop: boolean;
}

export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  duration: 0.6,
  delay: 0,
  easing: 'ease-out',
  trigger: 'onLoad',
  iterationCount: 1,
  fillMode: 'both',
};

export const DEFAULT_DIAGRAM_ANIMATION_SETTINGS: DiagramAnimationSettings = {
  staggerDelay: 0.1,
  edgeDelay: 0.3,
  autoPlay: true,
  loop: false,
};
