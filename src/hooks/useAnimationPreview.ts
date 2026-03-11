import { useMemo } from 'react';
import type { ElementAnimation } from '../types/animation';
import { getPreset } from '../animation';
import type { MotionProps } from 'framer-motion';

interface AnimationMotionProps {
  initial: Record<string, unknown>;
  animate: Record<string, unknown>;
  transition: Record<string, unknown>;
}

/**
 * Convert an ElementAnimation config into framer-motion props.
 * Returns undefined if no animation is set.
 */
export function useAnimationPreview(
  animation: ElementAnimation | undefined,
  isPlaying: boolean,
  staggerIndex?: number,
): AnimationMotionProps | undefined {
  return useMemo(() => {
    if (!animation || !isPlaying) return undefined;

    const preset = getPreset(animation.presetId);
    if (!preset) return undefined;

    const { config } = animation;
    const staggerDelay = staggerIndex != null ? staggerIndex * 0.1 : 0;

    const easingMap: Record<string, unknown> = {
      'ease': [0.25, 0.1, 0.25, 1],
      'ease-in': [0.42, 0, 1, 1],
      'ease-out': [0, 0, 0.58, 1],
      'ease-in-out': [0.42, 0, 0.58, 1],
      'linear': [0, 0, 1, 1],
      'spring': undefined, // use type: 'spring'
    };

    const transition: Record<string, unknown> = {
      ...preset.motionTransition,
      duration: config.duration,
      delay: config.delay + staggerDelay,
    };

    if (config.easing === 'spring') {
      transition.type = 'spring';
      transition.stiffness = 300;
      transition.damping = 15;
      delete transition.ease;
    } else {
      transition.ease = easingMap[config.easing] || easingMap['ease-out'];
    }

    if (config.iterationCount === 'infinite') {
      transition.repeat = Infinity;
    } else if (config.iterationCount > 1) {
      transition.repeat = config.iterationCount - 1;
    }

    return {
      initial: { ...preset.motionInitial },
      animate: { ...preset.motionAnimate },
      transition,
    };
  }, [animation, isPlaying, staggerIndex]);
}

/**
 * Convert an ElementAnimation for an SVG path (edge) into motion.path props.
 */
export function useEdgeAnimationPreview(
  animation: ElementAnimation | undefined,
  isPlaying: boolean,
  staggerIndex?: number,
): AnimationMotionProps | undefined {
  return useMemo(() => {
    if (!animation || !isPlaying) return undefined;

    const preset = getPreset(animation.presetId);
    if (!preset) return undefined;

    const { config } = animation;
    const staggerDelay = staggerIndex != null ? staggerIndex * 0.1 : 0;

    const transition: Record<string, unknown> = {
      ...preset.motionTransition,
      duration: config.duration,
      delay: config.delay + staggerDelay,
    };

    if (config.iterationCount === 'infinite') {
      transition.repeat = Infinity;
    }

    return {
      initial: { ...preset.motionInitial },
      animate: { ...preset.motionAnimate },
      transition,
    };
  }, [animation, isPlaying, staggerIndex]);
}
