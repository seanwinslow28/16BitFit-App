/**
 * PixelButton - Primary interactive element with Game Boy aesthetics.
 * Features press animation (scale and shadow shift simulation) and haptic feedback.
 *
 * @example
 * <PixelButton variant="primary" onPress={handlePress} isLoading={false}>
 *   START GAME
 * </PixelButton>
 */

import React, {useRef, useCallback, useMemo} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
  AccessibilityRole,
  AccessibilityState,
} from 'react-native';
// REWORK-V4: pending haptics integration
// import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {tokens, typography, durations, easings} from '../../../design-system';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'icon';

interface PixelButtonProps {
  /** Children (text or icon component) */
  children: React.ReactNode;
  /** Callback function when the button is pressed */
  onPress: (event: GestureResponderEvent) => void;
  /** Style variant of the button */
  variant?: ButtonVariant;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Accessibility hint for screen readers */
  accessibilityHint?: string;
  /** Accessibility role override (defaults to 'button') */
  accessibilityRole?: AccessibilityRole;
  /** Accessibility state override */
  accessibilityState?: AccessibilityState;
  /** Optional style override for the button container */
  style?: ViewStyle;
}

export type {PixelButtonProps};

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const PixelButton: React.FC<PixelButtonProps> = React.memo(
  ({
    children,
    onPress,
    variant = 'primary',
    disabled = false,
    isLoading = false,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole = 'button',
    accessibilityState,
    style,
  }) => {
    // ─── Refs ───
    // Animated value (0 = default, 1 = pressed)
    const pressAnim = useRef(new Animated.Value(0)).current;

    const isDisabled = disabled || isLoading;

    // ─── Callbacks ───

    const animatePress = useCallback(
      (toValue: number) => {
        Animated.timing(pressAnim, {
          toValue,
          duration: durations.fast, // 100ms
          easing: easings.sharp,
          useNativeDriver: true, // Using transform (translate/scale)
        }).start();
      },
      [pressAnim],
    );

    const handlePressIn = useCallback(() => {
      if (isDisabled) {
        return;
      }
      // REWORK-V4: pending haptics integration
      // ReactNativeHapticFeedback.trigger('impactMedium');
      animatePress(1);
    }, [isDisabled, animatePress]);

    const handlePressOut = useCallback(() => {
      if (isDisabled) {
        return;
      }
      animatePress(0);
    }, [isDisabled, animatePress]);

    const handlePress = useCallback(
      (event: GestureResponderEvent) => {
        if (isDisabled) {
          return;
        }
        onPress?.(event);
      },
      [isDisabled, onPress],
    );

    // ─── Computed Styles ───
    const {variantStyles, textStyle} = useMemo(() => {
      const getStyles = (
        v: ButtonVariant,
      ): {variantStyles: ViewStyle; textStyle: TextStyle} => {
        const baseButton: ViewStyle = {
          ...styles.content,
          backgroundColor: tokens.colors.button.primary,
          borderColor: tokens.colors.border.default,
        };
        const baseText: TextStyle = {
          ...styles.text,
          color: tokens.colors.text.primary,
        };

        switch (v) {
          case 'primary':
            return {variantStyles: baseButton, textStyle: baseText};
          case 'secondary':
            return {
              variantStyles: {
                ...baseButton,
                backgroundColor: tokens.colors.background.primary,
              },
              textStyle: baseText,
            };
          case 'tertiary':
            return {
              variantStyles: {
                ...baseButton,
                backgroundColor: 'transparent',
                borderColor: 'transparent',
              },
              textStyle: {...baseText, color: tokens.colors.text.secondary},
            };
          case 'icon':
            return {
              variantStyles: {...baseButton, ...styles.iconButton},
              textStyle: baseText,
            };
        }
      };
      return getStyles(variant);
    }, [variant]);

    const {disabledStyle, disabledTextStyle} = useMemo(() => {
      if (isDisabled) {
        return {
          disabledStyle: styles.disabled,
          disabledTextStyle: styles.disabledText,
        };
      }
      return {disabledStyle: {}, disabledTextStyle: {}};
    }, [isDisabled]);

    // Animation for simulating the shadow shift and slight scale down
    const animatedStyle = useMemo(() => {
      // Requirement: Shadow shift 4x4 -> 2x2.
      // Achieved by translating the content down-right by 2px relative to the shadow container.
      const translation = pressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 2], // Move 2px
      });

      // Requirement: Scale 1 -> 0.95
      const scale = pressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.95],
      });

      // Tertiary buttons don't have shadows, so they shouldn't translate, only scale.
      const translateValue = variant === 'tertiary' ? 0 : translation;

      return {
        transform: [
          {translateX: translateValue},
          {translateY: translateValue},
          {scale},
        ],
      };
    }, [pressAnim, variant]);

    // ─── Render ───

    const renderContent = () => {
      if (isLoading) {
        return (
          <ActivityIndicator
            size="small"
            color={isDisabled ? tokens.colors.text.secondary : textStyle.color}
          />
        );
      }

      if (typeof children === 'string') {
        return <Text style={[textStyle, disabledTextStyle]}>{children}</Text>;
      }
      return children;
    };

    // Apply the shadow to the container. Tertiary buttons and disabled buttons do not have prominent shadows.
    const shadowStyle =
      variant !== 'tertiary' && !isDisabled ? tokens.shadow.medium : {};

    return (
      <TouchableOpacity
        testID="pixel-button"
        activeOpacity={1} // We manage visual feedback manually via animations
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={isDisabled}
        accessible={true}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={
          accessibilityLabel ||
          (typeof children === 'string' ? children : undefined)
        }
        accessibilityHint={accessibilityHint}
        accessibilityState={
          accessibilityState ?? {disabled: isDisabled, busy: isLoading}
        }
        // The container holds the shadow and base dimensions
        style={[
          styles.container,
          variant === 'icon' ? styles.iconContainer : styles.standardContainer,
          shadowStyle,
          style,
        ]}>
        <Animated.View
          // The content layer moves and scales
          style={[variantStyles, disabledStyle, animatedStyle]}>
          {renderContent()}
        </Animated.View>
      </TouchableOpacity>
    );
  },
);

PixelButton.displayName = 'PixelButton';

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    // This view primarily serves as the shadow container
    alignSelf: 'flex-start',
  },
  standardContainer: {
    minWidth: 160,
    minHeight: 48,
  },
  iconContainer: {
    width: 48,
    height: 48,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing[3],
    borderWidth: tokens.border.width.default, // 3px
    borderRadius: tokens.border.radius, // 0
  },
  iconButton: {
    paddingHorizontal: 0,
  },
  text: {
    ...typography.styles.buttonPrimary,
    textAlign: 'center',
  },
  disabled: {
    backgroundColor: tokens.colors.background.elevated,
    borderColor: tokens.colors.border.default, // FIXED: was background.surface
  },
  disabledText: {
    color: tokens.colors.text.secondary,
  },
});

export {PixelButton};
export default PixelButton;
