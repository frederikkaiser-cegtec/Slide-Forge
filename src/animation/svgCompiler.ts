import type { AnimationConfig, AnimationPreset } from '../types/animation';

/**
 * Compile an AnimationPreset + Config into SVG <animate> / <animateTransform> elements.
 * For use inside <svg> exports.
 */
export function compileToSVGAnimate(
  preset: AnimationPreset,
  config: AnimationConfig,
  targetSelector?: string,
): string {
  const dur = `${config.duration}s`;
  const begin = config.delay > 0 ? `${config.delay}s` : '0s';
  const repeatCount = config.iterationCount === 'infinite' ? 'indefinite' : String(config.iterationCount);
  const fill = config.fillMode === 'none' ? 'remove' : 'freeze';

  switch (preset.effectType) {
    case 'fadeIn':
    case 'blurIn':
      return `<animate attributeName="opacity" from="0" to="1" dur="${dur}" begin="${begin}" fill="${fill}" repeatCount="${repeatCount}" />`;

    case 'slideUp':
      return `<animateTransform attributeName="transform" type="translate" from="0 30" to="0 0" dur="${dur}" begin="${begin}" fill="${fill}" repeatCount="${repeatCount}" />
<animate attributeName="opacity" from="0" to="1" dur="${dur}" begin="${begin}" fill="${fill}" repeatCount="${repeatCount}" />`;

    case 'slideDown':
      return `<animateTransform attributeName="transform" type="translate" from="0 -30" to="0 0" dur="${dur}" begin="${begin}" fill="${fill}" repeatCount="${repeatCount}" />
<animate attributeName="opacity" from="0" to="1" dur="${dur}" begin="${begin}" fill="${fill}" repeatCount="${repeatCount}" />`;

    case 'slideLeft':
      return `<animateTransform attributeName="transform" type="translate" from="30 0" to="0 0" dur="${dur}" begin="${begin}" fill="${fill}" repeatCount="${repeatCount}" />
<animate attributeName="opacity" from="0" to="1" dur="${dur}" begin="${begin}" fill="${fill}" repeatCount="${repeatCount}" />`;

    case 'slideRight':
      return `<animateTransform attributeName="transform" type="translate" from="-30 0" to="0 0" dur="${dur}" begin="${begin}" fill="${fill}" repeatCount="${repeatCount}" />
<animate attributeName="opacity" from="0" to="1" dur="${dur}" begin="${begin}" fill="${fill}" repeatCount="${repeatCount}" />`;

    case 'scaleIn':
      return `<animateTransform attributeName="transform" type="scale" from="0.8" to="1" dur="${dur}" begin="${begin}" fill="${fill}" repeatCount="${repeatCount}" />
<animate attributeName="opacity" from="0" to="1" dur="${dur}" begin="${begin}" fill="${fill}" repeatCount="${repeatCount}" />`;

    case 'popIn':
      return `<animateTransform attributeName="transform" type="scale" values="0.5;1.05;1" keyTimes="0;0.7;1" dur="${dur}" begin="${begin}" fill="${fill}" repeatCount="${repeatCount}" />
<animate attributeName="opacity" values="0;1;1" keyTimes="0;0.7;1" dur="${dur}" begin="${begin}" fill="${fill}" repeatCount="${repeatCount}" />`;

    case 'drawLine':
    case 'strokeDraw':
      return `<animate attributeName="stroke-dashoffset" from="1000" to="0" dur="${dur}" begin="${begin}" fill="${fill}" repeatCount="${repeatCount}" />`;

    case 'dashFlow':
      return `<animate attributeName="stroke-dashoffset" from="24" to="0" dur="${dur}" begin="${begin}" fill="remove" repeatCount="indefinite" />`;

    case 'growBar':
      return `<animateTransform attributeName="transform" type="scale" from="1 0" to="1 1" dur="${dur}" begin="${begin}" fill="${fill}" repeatCount="${repeatCount}" />`;

    case 'pulse':
      return `<animateTransform attributeName="transform" type="scale" values="1;1.05;1" dur="${dur}" begin="${begin}" fill="remove" repeatCount="indefinite" />`;

    case 'countUp':
    case 'typewriter':
      // No JS in SVG — just fade in the final value
      return `<animate attributeName="opacity" from="0" to="1" dur="${dur}" begin="${begin}" fill="${fill}" repeatCount="${repeatCount}" />`;

    default:
      return `<animate attributeName="opacity" from="0" to="1" dur="${dur}" begin="${begin}" fill="${fill}" repeatCount="${repeatCount}" />`;
  }
}
