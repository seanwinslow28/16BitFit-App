/**
 * useEvolutionAnimation - Reanimated hook for Pokemon-style blink sequence
 *
 * Architecture: useFrameCallback for UI thread timing (ADR-001)
 * Timing: Phase-based delays, NOT geometric decay (ADR-002)
 *
 * @see docs/plans/winston-evolution-ceremony-architecture-validation.md
 */

import {useCallback, useRef} from 'react';
import {
  Easing,
  runOnJS,
  useFrameCallback,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
// REWORK-V4: copied from V3 — path remapped from @/hooks to relative.
import {useReducedMotion} from '../../../../hooks/useReducedMotion';

// Phase-based timing (ADR-002) - captures Pokemon Red/Blue feel
// [800*3, 600*3, 400*3, 200*4, 100*5, 50*6]
const BLINK_DELAYS = [
  800, 800, 800, // Phase A: Slow heartbeat
  600, 600, 600, // Phase B: Building tension
  400, 400, 400, // Phase C: Accelerating
  200, 200, 200, 200, // Phase D: Fast
  100, 100, 100, 100, 100, // Phase E: Very fast
  50, 50, 50, 50, 50, 50, // Phase F: Rapid climax
];

// Pre-calculate toggle timestamps for UI thread lookup
const TOGGLE_SCHEDULE_MS = (() => {
  const timestamps: number[] = [];
  let elapsed = 0;
  BLINK_DELAYS.forEach(delay => {
    timestamps.push(elapsed);
    elapsed += delay;
  });
  return timestamps;
})();

export type EvolutionPhase = 'IDLE' | 'BLINKING' | 'FLASHING' | 'COMPLETE';

interface UseEvolutionAnimationProps {
  /** Called on each sprite toggle (for audio/haptic) */
  onToggle?: () => void;
  /** Called when animation completes */
  onComplete: () => void;
}

interface UseEvolutionAnimationReturn {
  /** SharedValue: 0 = old sprite, 1 = new sprite */
  showNewSprite: {value: number};
  /** SharedValue: flash overlay opacity */
  flashOpacity: {value: number};
  /** Start the animation */
  start: () => void;
  /** Skip to the end (tap to skip) */
  skip: () => void;
}

export const useEvolutionAnimation = ({
  onToggle,
  onComplete,
}: UseEvolutionAnimationProps): UseEvolutionAnimationReturn => {
  const prefersReducedMotion = useReducedMotion();

  // Shared values (UI thread state)
  const showNewSprite = useSharedValue(0); // 0 = old, 1 = new
  const flashOpacity = useSharedValue(0);
  const animationStartTime = useSharedValue(0);
  const nextToggleIndex = useSharedValue(0);
  const isRunning = useSharedValue(false);

  // Track if we've already completed to prevent double-firing
  const hasCompleted = useRef(false);

  // Memoized JS callbacks for runOnJS
  const triggerToggleCallback = useCallback(() => {
    onToggle?.();
  }, [onToggle]);

  const triggerComplete = useCallback(() => {
    if (hasCompleted.current) return;
    hasCompleted.current = true;
    onComplete();
  }, [onComplete]);

  // Frame callback for UI-thread timing (ADR-001)
  useFrameCallback(frameInfo => {
    'worklet';
    if (!isRunning.value || animationStartTime.value === 0) return;

    // Initialize start time on first frame (sentinel value -1)
    if (animationStartTime.value === -1) {
      animationStartTime.value = frameInfo.timestamp || 0;
      return;
    }

    const elapsed = (frameInfo.timestamp || 0) - animationStartTime.value;
    const nextToggleTime = TOGGLE_SCHEDULE_MS[nextToggleIndex.value];

    // Check if it's time for next toggle
    if (nextToggleTime !== undefined && elapsed >= nextToggleTime) {
      // Toggle sprite
      showNewSprite.value = showNewSprite.value === 0 ? 1 : 0;

      // Trigger audio callback via bridge
      runOnJS(triggerToggleCallback)();

      // Advance to next toggle
      nextToggleIndex.value += 1;

      // Check if animation complete
      if (nextToggleIndex.value >= TOGGLE_SCHEDULE_MS.length) {
        isRunning.value = false;

        // Ensure we end on new sprite
        showNewSprite.value = 1;

        // Trigger flash (ADR-003: Animated.View, not Skia)
        flashOpacity.value = withSequence(
          withTiming(1, {duration: 50}),
          withTiming(0, {duration: 800, easing: Easing.out(Easing.quad)}),
        );

        // Complete after flash starts
        runOnJS(triggerComplete)();
      }
    }
  });

  // Start animation
  const start = useCallback(() => {
    hasCompleted.current = false;

    if (prefersReducedMotion) {
      // Reduced motion: 1500ms crossfade instead of blink
      showNewSprite.value = withTiming(1, {duration: 1500});
      setTimeout(() => {
        flashOpacity.value = withSequence(
          withTiming(1, {duration: 50}),
          withTiming(0, {duration: 400}),
        );
        triggerComplete();
      }, 1500);
      return;
    }

    // Reset state
    showNewSprite.value = 0;
    nextToggleIndex.value = 0;
    animationStartTime.value = -1; // Sentinel for first frame
    isRunning.value = true;
  }, [
    prefersReducedMotion,
    triggerComplete,
    showNewSprite,
    nextToggleIndex,
    animationStartTime,
    isRunning,
    flashOpacity,
  ]);

  // Skip animation (tap to skip)
  const skip = useCallback(() => {
    isRunning.value = false;
    showNewSprite.value = 1;
    flashOpacity.value = withSequence(
      withTiming(1, {duration: 50}),
      withTiming(0, {duration: 400}),
    );
    triggerComplete();
  }, [triggerComplete, isRunning, showNewSprite, flashOpacity]);

  return {
    showNewSprite,
    flashOpacity,
    start,
    skip,
  };
};

export default useEvolutionAnimation;
