/**
 * 16BitFit Animation System
 *
 * Duration system, easing functions, and animation guidelines.
 * Optimized for 60fps performance with native driver support.
 */

import {Easing} from 'react-native';

// ─────────────────────────────────────────────────────────
// Duration System (milliseconds)
// ─────────────────────────────────────────────────────────

/**
 * Animation duration constants based on psychological research:
 * - <100ms: Feels instant, no perceived delay
 * - 100-300ms: Noticeable but comfortable, standard UI transitions
 * - 300-500ms: Deliberate, draws attention to important changes
 * - 500ms+: Feels slow unless it's a celebration/reward moment
 */
export const durations = {
  instant: 0, // No animation (accessibility, reduced motion)
  micro: 50, // Extremely subtle (tooltip fade)
  fast: 100, // Button press, checkbox toggle, micro-interactions
  normal: 200, // Standard transitions, hover states, simple reveals
  moderate: 300, // Screen transitions, success animations, modal open
  slow: 500, // Dramatic reveals, onboarding moments
  epic: 800, // Level-up celebrations, major achievements
  extended: 1200, // Rare - complex multi-stage animations only
};

// ─────────────────────────────────────────────────────────
// Easing Functions
// ─────────────────────────────────────────────────────────

/**
 * Easing curves create different emotional responses:
 * - easeOut: Elements entering screen (most common)
 * - easeIn: Elements exiting screen
 * - easeInOut: Symmetrical movements
 * - sharp: Retro snappy feel
 * - snappy: Responsive micro-interactions
 * - spring: Success/achievement moments (bouncy overshoot)
 * - springGentle: Subtle playful interactions
 */
export const easings = {
  // Standard easing
  linear: Easing.linear,
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),
  standard: Easing.bezier(0.4, 0.0, 0.2, 1), // Material Design standard curve

  // Custom retro easing
  sharp: Easing.bezier(0.4, 0, 0.6, 1), // Fast snap (retro game feel)
  snappy: Easing.bezier(0.25, 0.1, 0.25, 1), // Quick response (button press)

  // Spring physics (joyful, playful)
  spring: Easing.bezier(0.34, 1.56, 0.64, 1), // Bouncy overshoot (success moments)
  springGentle: Easing.bezier(0.5, 1.25, 0.75, 1), // Subtle bounce (hover effects)
};

// ─────────────────────────────────────────────────────────
// Native Driver Compatibility Rules
// ─────────────────────────────────────────────────────────

/**
 * CRITICAL for 60fps Performance:
 *
 * ✅ ALWAYS use native driver for:
 *    - transform (translateX, translateY, scale, rotate)
 *    - opacity
 *
 * ❌ NEVER use native driver for:
 *    - width, height (use scaleX/scaleY instead)
 *    - backgroundColor (swap elements or use opacity)
 *    - borderColor (swap elements or use overlay)
 *    - shadowOpacity (pre-render shadow states)
 *    - shadowOffset (use transform instead)
 *
 * Performance Tips:
 * 1. Prefer transform and opacity over layout properties
 * 2. Use InteractionManager for non-critical animations
 * 3. Avoid animating shadowOffset/shadowOpacity on Android (CPU-intensive)
 * 4. Clean up animations on unmount to prevent memory leaks
 */

// ─────────────────────────────────────────────────────────
// Animation Usage Examples
// ─────────────────────────────────────────────────────────

/**
 * @example Button Press Animation
 * ```typescript
 * Animated.timing(scaleAnim, {
 *   toValue: 0.95,
 *   duration: durations.fast,
 *   easing: easings.sharp,
 *   useNativeDriver: true, // ✅ scale is GPU-accelerated
 * }).start();
 * ```
 *
 * @example Modal Open Animation
 * ```typescript
 * Animated.parallel([
 *   Animated.timing(scaleAnim, {
 *     toValue: 1,
 *     duration: durations.moderate,
 *     easing: easings.spring,
 *     useNativeDriver: true,
 *   }),
 *   Animated.timing(opacityAnim, {
 *     toValue: 1,
 *     duration: durations.normal,
 *     easing: easings.easeOut,
 *     useNativeDriver: true,
 *   }),
 * ]).start();
 * ```
 *
 * @example Screen Transition
 * ```typescript
 * Animated.timing(translateXAnim, {
 *   toValue: 0,
 *   duration: durations.moderate,
 *   easing: easings.easeOut,
 *   useNativeDriver: true,
 * }).start();
 * ```
 */
