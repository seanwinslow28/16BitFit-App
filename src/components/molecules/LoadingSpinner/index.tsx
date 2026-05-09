/**
 * LoadingSpinner - Rotating pixel icon loading indicator
 *
 * Animated loading spinner using PixelIcon with rotation animation.
 * Optimized for 60fps performance with native driver.
 *
 * @example
 * <LoadingSpinner size={32} />
 * <LoadingSpinner size={24} message="Generating avatar..." />
 */

import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';
import {PixelIcon, PixelText} from '../../atoms';
import {tokens} from '../../../design-system';
import type {IconSize} from '../../atoms/PixelIcon';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

export interface LoadingSpinnerProps {
  /** Spinner size (default: 32) */
  size?: IconSize;
  /** Loading message to display below spinner */
  message?: string;
  /** Spinner color (default: DMG light) */
  color?: string;
  /** Test ID for testing */
  testID?: string;
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const LoadingSpinner: React.FC<LoadingSpinnerProps> = React.memo(
  ({size = 32, message, color = tokens.colors.button.primary, testID}) => {
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      // Create infinite rotation animation
      const animation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1200, // 1.2 seconds per rotation
          easing: Easing.linear,
          useNativeDriver: true, // GPU acceleration
        }),
      );

      animation.start();

      // Cleanup on unmount
      return () => {
        animation.stop();
      };
    }, [rotateAnim]);

    // Interpolate rotation value to degrees
    const rotate = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View style={styles.container} testID={testID}>
        {/* Rotating Icon */}
        <Animated.View
          style={{
            transform: [{rotate}],
          }}
          accessible={false}>
          <PixelIcon
            name="settings"
            size={size}
            color={color}
            accessibilityLabel="Loading"
          />
        </Animated.View>

        {/* Optional Message */}
        {message && (
          <PixelText
            variant="body"
            colorKey="secondary"
            align="center"
            style={styles.message}>
            {message}
          </PixelText>
        )}
      </View>
    );
  },
);

LoadingSpinner.displayName = 'LoadingSpinner';

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing[3], // 16px
  },
  message: {
    marginTop: tokens.spacing[2], // 8px
  },
});

export {LoadingSpinner};
export default LoadingSpinner;
