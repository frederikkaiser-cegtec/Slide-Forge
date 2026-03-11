import type { AnimationConfig, AnimationKeyframe, AnimationPreset } from '../types/animation';

/**
 * Compile keyframes from a preset into a CSS @keyframes block.
 * Returns one block per preset type (shared across elements).
 */
export function compileKeyframes(preset: AnimationPreset, prefix: string): string {
  const name = `${prefix}-${preset.id}`;
  const frames = preset.keyframes
    .map((kf: AnimationKeyframe) => {
      const percent = Math.round(kf.offset * 100);
      const props = Object.entries(kf.properties)
        .map(([k, v]) => `    ${k}: ${v};`)
        .join('\n');
      return `  ${percent}% {\n${props}\n  }`;
    })
    .join('\n');
  return `@keyframes ${name} {\n${frames}\n}`;
}

/**
 * Compile the CSS `animation` shorthand property for an element.
 */
export function compileAnimationProperty(
  preset: AnimationPreset,
  config: AnimationConfig,
  prefix: string,
): string {
  const name = `${prefix}-${preset.id}`;
  const iterations = config.iterationCount === 'infinite' ? 'infinite' : config.iterationCount;
  const easing = config.easing === 'spring'
    ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    : config.easing === 'vercel'
      ? 'cubic-bezier(0.32, 0.72, 0, 1)'
      : config.easing;
  return `${name} ${config.duration}s ${easing} ${config.delay}s ${iterations} ${config.fillMode}`;
}

/**
 * Collect unique keyframe blocks for a list of presets (deduped by preset ID).
 */
export function compileAllKeyframes(
  presets: AnimationPreset[],
  prefix: string,
): string {
  const seen = new Set<string>();
  const blocks: string[] = [];
  for (const preset of presets) {
    if (!seen.has(preset.id)) {
      seen.add(preset.id);
      blocks.push(compileKeyframes(preset, prefix));
    }
  }
  return blocks.join('\n\n');
}

/**
 * Generate a scroll-trigger CSS class (opacity 0 initially, animation on .visible).
 */
export function compileScrollTriggerCSS(prefix: string): string {
  return `.${prefix}-observe { opacity: 0; }
.${prefix}-observe.${prefix}-visible { opacity: 1; }`;
}
