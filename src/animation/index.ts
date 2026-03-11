import { ANIMATION_PRESETS, PRESET_CATEGORIES } from './presets';
import type { AnimationPreset, AnimationCategory } from '../types/animation';

export { ANIMATION_PRESETS, PRESET_CATEGORIES } from './presets';
export { compileKeyframes, compileAnimationProperty, compileAllKeyframes, compileScrollTriggerCSS } from './cssCompiler';
export { compileToSVGAnimate } from './svgCompiler';

export function getPreset(id: string): AnimationPreset | undefined {
  return ANIMATION_PRESETS.find((p) => p.id === id);
}

export function getPresetsByCategory(category: AnimationCategory): AnimationPreset[] {
  return ANIMATION_PRESETS.filter((p) => p.category === category);
}

export function getNodePresets(): AnimationPreset[] {
  return ANIMATION_PRESETS.filter((p) =>
    !['drawLine', 'strokeDraw', 'dashFlow'].includes(p.id),
  );
}

export function getEdgePresets(): AnimationPreset[] {
  return ANIMATION_PRESETS.filter((p) =>
    ['drawLine', 'strokeDraw', 'dashFlow', 'fadeIn', 'glowPulse'].includes(p.id),
  );
}
