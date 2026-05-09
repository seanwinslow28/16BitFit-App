/**
 * 16BitFit Design System Types
 *
 * Shared TypeScript types and interfaces used across the design system.
 */

import {TextStyle, ViewStyle} from 'react-native';

// ─────────────────────────────────────────────────────────
// Component Variant Types
// ─────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'icon';
export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'button';
export type SpriteSize = 8 | 16 | 32 | 64 | 80 | 96;

// ─────────────────────────────────────────────────────────
// Input State Types
// ─────────────────────────────────────────────────────────

export type InputState =
  | 'default'
  | 'focused'
  | 'error'
  | 'success'
  | 'disabled';

// ─────────────────────────────────────────────────────────
// Shadow Size Types
// ─────────────────────────────────────────────────────────

export type ShadowSize = 'small' | 'medium' | 'large';

// ─────────────────────────────────────────────────────────
// Animation Types
// ─────────────────────────────────────────────────────────

export type DurationName =
  | 'instant'
  | 'micro'
  | 'fast'
  | 'normal'
  | 'moderate'
  | 'slow'
  | 'epic'
  | 'extended';
export type EasingName =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'sharp'
  | 'snappy'
  | 'spring'
  | 'springGentle';

// ─────────────────────────────────────────────────────────
// Haptic Feedback Types
// ─────────────────────────────────────────────────────────

/**
 * Haptic feedback types from react-native-haptic-feedback
 * iOS: UIImpactFeedbackGenerator / UINotificationFeedbackGenerator
 * Android: VibrationEffect
 */
export type HapticType =
  | 'selection' // Light tap (selection changes, toggles)
  | 'impactLight' // Light impact
  | 'impactMedium' // Medium impact (button taps, selections)
  | 'impactHeavy' // Heavy impact (success moments, level-ups)
  | 'notificationSuccess' // Success notification (double pulse)
  | 'notificationWarning' // Warning notification
  | 'notificationError'; // Error notification (triple buzz)

// ─────────────────────────────────────────────────────────
// Spacing Types
// ─────────────────────────────────────────────────────────

export type SpacingKey = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

// ─────────────────────────────────────────────────────────
// Color Token Types
// ─────────────────────────────────────────────────────────

export type ColorTokenCategory =
  | 'background'
  | 'text'
  | 'border'
  | 'interactive'
  | 'feedback'
  | 'dmg';

// ─────────────────────────────────────────────────────────
// Typography Types
// ─────────────────────────────────────────────────────────

export type FontFamily = 'heading' | 'body';
export type FontSize =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | 'xxl'
  | 'xxxl'
  | 'pixelXS'
  | 'pixelSM'
  | 'pixelBase'
  | 'pixelLG'
  | 'pixelXL'
  | 'pixelXXL'
  | 'pixelHero';
export type LineHeight =
  | 'tight'
  | 'snug'
  | 'normal'
  | 'relaxed'
  | 'loose'
  | 'pixelTight'
  | 'pixelNormal'
  | 'pixelRelaxed';

// ─────────────────────────────────────────────────────────
// Icon Types
// ─────────────────────────────────────────────────────────

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'hero';
export type TouchTargetSize = 'minimum' | 'comfortable' | 'optimal' | 'large';

// ─────────────────────────────────────────────────────────
// Border Types
// ─────────────────────────────────────────────────────────

export type BorderWidth =
  | 'none'
  | 'thin'
  | 'default'
  | 'thick'
  | 'heavy'
  | 'pixel';
