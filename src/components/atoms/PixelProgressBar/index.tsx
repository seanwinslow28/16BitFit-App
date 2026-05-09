/**
 * PixelProgressBar - Street Fighter 2-inspired progress bar
 *
 * Animated progress bar with smooth and segmented modes.
 * Features dynamic color changes based on progress thresholds.
 *
 * @example
 * <PixelProgressBar progress={75} mode="smooth" animated />
 * <PixelProgressBar progress={30} mode="segmented" segments={10} />
 */

import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';
import {tokens, durations, easings} from '../../../design-system';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

export type ProgressMode = 'smooth' | 'segmented';

export interface PixelProgressBarProps {
  /** Progress value from 0 to 100 */
  progress: number;
  /** Display mode (default: smooth) */
  mode?: ProgressMode;
  /** Height of the progress bar (default: 24) */
  height?: number;
  /** Show percentage label (default: false) */
  showLabel?: boolean;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** Number of segments in segmented mode (default: 10) */
  segments?: number;
  /** Custom color (overrides threshold colors) */
  color?: string;
}

// ─────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────

/**
 * Gets color based on progress thresholds
 * Mimics SF2 health bar color changes
 */
const getProgressColor = (progress: number): string => {
  if (progress >= 67) {
    return tokens.colors.button.primary; // #8BAC0F - Healthy (67-100%)
  } else if (progress >= 34) {
    return tokens.colors.text.secondary; // #306230 - Warning (34-66%)
  } else {
    return tokens.colors.text.primary; // #0F380F - Critical (0-33%)
  }
};

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const PixelProgressBar: React.FC<PixelProgressBarProps> = React.memo(
  ({
    progress,
    mode = 'smooth',
    height = 24,
    showLabel = false,
    animated = true,
    segments = 10,
    color,
  }) => {
    const progressAnim = useRef(new Animated.Value(0)).current;

    // Clamp progress between 0 and 100
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    // Animate progress changes
    useEffect(() => {
      if (animated) {
        Animated.timing(progressAnim, {
          toValue: clampedProgress,
          duration: durations.moderate, // 300ms
          easing: easings.easeOut,
          useNativeDriver: false, // Width animation doesn't support native driver
        }).start();
      } else {
        progressAnim.setValue(clampedProgress);
      }
    }, [clampedProgress, animated, progressAnim]);

    const fillColor = color || getProgressColor(clampedProgress);

    // Smooth mode: single animated bar
    if (mode === 'smooth') {
      const fillWidth = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
      });

      return (
        <View
          style={[styles.container, {height}]}
          accessible={true}
          accessibilityLabel={`Progress: ${Math.round(clampedProgress)}%`}
          accessibilityRole="progressbar"
          accessibilityValue={{
            min: 0,
            max: 100,
            now: Math.round(clampedProgress),
          }}>
          <Animated.View
            style={[
              styles.fill,
              {
                width: fillWidth,
                backgroundColor: fillColor,
              },
            ]}
          />
        </View>
      );
    }

    // Segmented mode: SF2-style health bar segments
    const filledSegments = Math.floor((clampedProgress / 100) * segments);

    return (
      <View
        style={[styles.container, styles.segmentedContainer, {height}]}
        accessible={true}
        accessibilityLabel={`Progress: ${Math.round(clampedProgress)}%`}
        accessibilityRole="progressbar"
        accessibilityValue={{
          min: 0,
          max: 100,
          now: clampedProgress,
        }}>
        {Array.from({length: segments}).map((_, index) => (
          <View
            key={index}
            style={[
              styles.segment,
              {
                backgroundColor:
                  index < filledSegments
                    ? fillColor
                    : tokens.colors.background.primary,
              },
            ]}
          />
        ))}
      </View>
    );
  },
);

PixelProgressBar.displayName = 'PixelProgressBar';

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: tokens.border.width.default, // 3px
    borderRadius: 0, // Pure retro
    borderColor: tokens.colors.border.default,
    backgroundColor: tokens.colors.background.primary,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  segmentedContainer: {
    flexDirection: 'row',
    gap: 2, // 2px gap between segments
  },
  segment: {
    flex: 1,
    height: '100%',
  },
});

export default PixelProgressBar;
