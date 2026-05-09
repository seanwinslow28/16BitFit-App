/**
 * useCeremonyAnimation - Manages the 5-stage ceremony animation sequence
 *
 * Architecture: Declarative Composite Ref pattern (Deep Think spec)
 * - Single Animated.parallel() composite for 1400ms timeline
 * - Decoupled haptic schedulers (not tied to animation callbacks)
 * - Skip logic with instant snap to final values
 * - Native driver optimized (translateX mask for progress bar)
 *
 * @see docs/Gemini-3-Pro-Analysis/Gemini 3 Pro - Deep Think - WorkoutCompleteCeremony-Implimentation-Guide.md
 */

import {useRef, useState, useCallback, useEffect} from 'react';
import {Animated, Easing} from 'react-native';
// REWORK-V4: react-native-haptic-feedback not installed in V4 — stub trigger.
// import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
const ReactNativeHapticFeedback = {trigger: (_a?: string, _b?: object) => {}};
import {useReducedMotion} from '@/hooks/useReducedMotion';

const HAPTIC_CONFIG = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

// Animation timeline constants (in ms)
const TIMING = {
  HEADER_START: 0,
  HEADER_DURATION: 300,
  XP_CARD_START: 200,
  XP_CARD_DURATION: 200,
  XP_BAR_START: 300,
  XP_BAR_DURATION: 600,
  TICKET_START: 800,
  TICKET_DURATION: 300,
  STATS_START: 1000,
  STATS_DURATION: 300,
  BUTTON_START: 1200,
  BUTTON_DURATION: 200,
  TOTAL: 1400,
  XP_TICK_INTERVAL: 60,
};

export interface CeremonyAnimationValues {
  headerY: Animated.Value;
  xpOpacity: Animated.Value;
  xpSlide: Animated.Value;
  ticketScale: Animated.Value;
  statsOpacity: Animated.Value;
  buttonOpacity: Animated.Value;
}

export interface UseCeremonyAnimationReturn {
  values: CeremonyAnimationValues;
  runSequence: () => void;
  skipSequence: () => void;
  isComplete: boolean;
}

export const useCeremonyAnimation = (
  onComplete?: () => void,
): UseCeremonyAnimationReturn => {
  const prefersReducedMotion = useReducedMotion();
  const [isComplete, setIsComplete] = useState(false);

  // 1. Animated Values (Native Driver Optimized)
  const headerY = useRef(new Animated.Value(-100)).current;
  const xpOpacity = useRef(new Animated.Value(0)).current;
  const xpSlide = useRef(new Animated.Value(-1)).current; // -1 (off-screen) to 0 (filled)
  const ticketScale = useRef(new Animated.Value(0)).current;
  const statsOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  // 2. Logic Refs
  const timeline = useRef<Animated.CompositeAnimation | null>(null);
  const timeouts = useRef<NodeJS.Timeout[]>([]);
  const tickInterval = useRef<NodeJS.Timeout | null>(null);
  const isSkipped = useRef(false);

  // Helper: Schedule function (auto-clears on skip)
  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      if (!isSkipped.current) {
        fn();
      }
    }, ms);
    timeouts.current.push(id);
  }, []);

  // 3. Cleanup: The "Kill Switch"
  const cleanup = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    if (tickInterval.current) {
      clearInterval(tickInterval.current);
      tickInterval.current = null;
    }
  }, []);

  // 4. Skip Logic: The "Instant Snap"
  const skipSequence = useCallback(() => {
    if (isSkipped.current || isComplete) {
      return;
    }
    isSkipped.current = true;

    // A. Stop Engine
    timeline.current?.stop();
    cleanup();

    // B. Snap Values (Native Driver async sync)
    headerY.setValue(0);
    xpOpacity.setValue(1);
    xpSlide.setValue(0);
    ticketScale.setValue(1);
    statsOpacity.setValue(1);
    buttonOpacity.setValue(1);

    // C. Final State & Feedback
    setIsComplete(true);
    ReactNativeHapticFeedback.trigger('impactMedium', HAPTIC_CONFIG);
    if (onComplete) {
      onComplete();
    }
  }, [
    cleanup,
    onComplete,
    headerY,
    xpOpacity,
    xpSlide,
    ticketScale,
    statsOpacity,
    buttonOpacity,
    isComplete,
  ]);

  // 5. Sequence Runner
  const runSequence = useCallback(() => {
    // Reset skip flag for fresh runs
    isSkipped.current = false;

    if (prefersReducedMotion) {
      skipSequence();
      return;
    }

    // --- Haptic Timeline (Decoupled from Visuals) ---

    // Header reveal
    schedule(
      () => ReactNativeHapticFeedback.trigger('impactLight', HAPTIC_CONFIG),
      TIMING.HEADER_START,
    );

    // XP Tick Loop (Starts @ 300ms, Ends @ 900ms)
    schedule(() => {
      tickInterval.current = setInterval(() => {
        ReactNativeHapticFeedback.trigger('selection', HAPTIC_CONFIG);
      }, TIMING.XP_TICK_INTERVAL);
    }, TIMING.XP_BAR_START);

    schedule(() => {
      if (tickInterval.current) {
        clearInterval(tickInterval.current);
        tickInterval.current = null;
      }
    }, TIMING.XP_BAR_START + TIMING.XP_BAR_DURATION);

    // Ticket bounce peak
    schedule(
      () => ReactNativeHapticFeedback.trigger('impactMedium', HAPTIC_CONFIG),
      TIMING.TICKET_START,
    );

    // Button reveal (ready)
    schedule(
      () =>
        ReactNativeHapticFeedback.trigger('notificationSuccess', HAPTIC_CONFIG),
      TIMING.BUTTON_START,
    );

    // --- Visual Timeline (Composite) ---
    timeline.current = Animated.parallel([
      // 1. Header (0-300ms) - OutBack(1.5)
      Animated.timing(headerY, {
        toValue: 0,
        duration: TIMING.HEADER_DURATION,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),

      // 2A. XP Card (200-400ms) - Linear fade
      Animated.sequence([
        Animated.delay(TIMING.XP_CARD_START),
        Animated.timing(xpOpacity, {
          toValue: 1,
          duration: TIMING.XP_CARD_DURATION,
          useNativeDriver: true,
        }),
      ]),

      // 2B. XP Bar (300-900ms) - OutCubic slide (translateX mask)
      Animated.sequence([
        Animated.delay(TIMING.XP_BAR_START),
        Animated.timing(xpSlide, {
          toValue: 0,
          duration: TIMING.XP_BAR_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // 3. Ticket (800-1100ms) - Spring bounce
      Animated.sequence([
        Animated.delay(TIMING.TICKET_START),
        Animated.sequence([
          Animated.timing(ticketScale, {
            toValue: 1.2,
            duration: TIMING.TICKET_DURATION / 2,
            useNativeDriver: true,
          }),
          Animated.timing(ticketScale, {
            toValue: 1.0,
            duration: TIMING.TICKET_DURATION / 2,
            useNativeDriver: true,
          }),
        ]),
      ]),

      // 4. Stats (1000-1300ms) - OutQuad fade
      Animated.sequence([
        Animated.delay(TIMING.STATS_START),
        Animated.timing(statsOpacity, {
          toValue: 1,
          duration: TIMING.STATS_DURATION,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),

      // 5. Button (1200-1400ms) - Linear fade
      Animated.sequence([
        Animated.delay(TIMING.BUTTON_START),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: TIMING.BUTTON_DURATION,
          useNativeDriver: true,
        }),
      ]),
    ]);

    timeline.current.start(({finished}) => {
      if (finished && !isSkipped.current) {
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
      }
    });
  }, [
    prefersReducedMotion,
    skipSequence,
    schedule,
    onComplete,
    headerY,
    xpOpacity,
    xpSlide,
    ticketScale,
    statsOpacity,
    buttonOpacity,
  ]);

  // Safety Cleanup on unmount
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    values: {
      headerY,
      xpOpacity,
      xpSlide,
      ticketScale,
      statsOpacity,
      buttonOpacity,
    },
    runSequence,
    skipSequence,
    isComplete,
  };
};

export default useCeremonyAnimation;
