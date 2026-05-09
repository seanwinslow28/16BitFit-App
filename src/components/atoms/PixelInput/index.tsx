/**
 * PixelInput - Text input field with Game Boy aesthetics.
 * Includes states for focus, error (with shake animation), success, and disabled.
 *
 * @example
 * <PixelInput
 *   label="Username"
 *   value={username}
 *   onChangeText={setUsername}
 *   error={usernameError}
 * />
 */

import React, {useRef, useState, useCallback, useMemo, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  TextInputProps,
  type FocusEvent as RNFocusEvent,
  type BlurEvent as RNBlurEvent,
} from 'react-native';
import {tokens, typography, durations, easings} from '../../../design-system';
import PixelText from '../PixelText';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

interface PixelInputProps extends TextInputProps {
  /** Input field label */
  label?: string;
  /** Current value of the input */
  value: string;
  /** Callback when text changes */
  onChangeText: (text: string) => void;
  /** Error message (if any). Triggers error state and shake animation. */
  error?: string | false;
  /** Whether the input is in a success state */
  success?: boolean;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Optional left icon component */
  LeftIcon?: React.ReactNode;
  /** Optional helper text displayed below the input */
  helperText?: string;
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const PixelInput: React.FC<PixelInputProps> = React.memo(
  ({
    label,
    placeholder,
    value,
    onChangeText,
    error,
    success = false,
    disabled = false,
    LeftIcon,
    helperText,
    onFocus,
    onBlur,
    ...restProps
  }) => {
    // ─── State ───
    const [isFocused, setIsFocused] = useState(false);

    // ─── Refs ───
    // For border width/color animation (0 = default, 1 = focused)
    const focusAnim = useRef(new Animated.Value(0)).current;
    // For error shake animation
    const shakeAnim = useRef(new Animated.Value(0)).current;

    // ─── Effects ───

    // Trigger shake animation when error prop changes and is truthy
    useEffect(() => {
      if (error) {
        triggerShake();
      }
    }, [error]);

    // Animate border on focus change
    useEffect(() => {
      Animated.timing(focusAnim, {
        toValue: isFocused ? 1 : 0,
        duration: durations.normal, // 200ms
        easing: easings.snappy,
        useNativeDriver: false, // Animating borderWidth/Color requires false
      }).start();
    }, [isFocused, focusAnim]);

    // ─── Callbacks ───

    const handleFocus = useCallback(
      (e: RNFocusEvent) => {
        if (disabled) {
          return;
        }
        setIsFocused(true);
        onFocus?.(e);
      },
      [disabled, onFocus],
    );

    const handleBlur = useCallback(
      (e: RNBlurEvent) => {
        setIsFocused(false);
        onBlur?.(e);
      },
      [onBlur],
    );

    const triggerShake = useCallback(() => {
      // Shake animation: translateX sequence (approx 420ms total duration)
      shakeAnim.setValue(0);
      // Sequence: 0 -> -10 -> 10 -> -10 -> 10 -> -5 -> 5 -> 0
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 1,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 2,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 3,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 4,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 5,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 6,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 60,
          useNativeDriver: true,
        }),
      ]).start();
    }, [shakeAnim]);

    // ─── Computed Styles ───

    const determineBaseBorderColor = useMemo(() => {
      if (disabled) {
        return tokens.colors.border.default;
      }
      if (error) {
        return tokens.colors.feedback.error;
      }
      if (success) {
        return tokens.colors.feedback.success;
      }
      return tokens.colors.border.default; // Default state color
    }, [disabled, error, success]);

    const focusBorderColor = tokens.colors.border.focus;

    // Interpolate border width: 3px (default) -> 4px (thick)
    const animatedBorderWidth = focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [tokens.border.width.default, tokens.border.width.thick],
    });

    // Interpolate border color
    const animatedBorderColor = focusAnim.interpolate({
      inputRange: [0, 1],
      // If state is error/success, keep that color even when focused; otherwise transition to focus color
      outputRange: [
        determineBaseBorderColor,
        error || success ? determineBaseBorderColor : focusBorderColor,
      ],
    });

    // Interpolate shake translation
    const animatedShake = {
      transform: [
        {
          translateX: shakeAnim.interpolate({
            inputRange: [0, 1, 2, 3, 4, 5, 6],
            outputRange: [0, -10, 10, -10, 10, -5, 5],
          }),
        },
      ],
    };

    const containerStyle = useMemo(
      () => [
        styles.inputContainer,
        disabled && styles.disabledContainer,
        // Casting required by TS for non-transform/opacity animated properties
        {
          borderWidth: animatedBorderWidth as any,
          borderColor: animatedBorderColor as any,
        },
      ],
      [disabled, animatedBorderWidth, animatedBorderColor],
    );

    // ─── Render ───

    const renderValidationIcon = () => {
      // Placeholder validation icons (will be replaced with PixelIcon later)
      if (success) {
        return <PixelText colorKey="primary">✓</PixelText>;
      }
      if (error) {
        return <PixelText colorKey="primary">!</PixelText>;
      }
      return null;
    };

    return (
      <View style={styles.wrapper}>
        {label && (
          <PixelText variant="bodySmall" style={styles.label}>
            {label}
          </PixelText>
        )}
        <Animated.View style={animatedShake}>
          <Animated.View style={containerStyle}>
            {LeftIcon && <View style={styles.iconLeft}>{LeftIcon}</View>}
            <TextInput
              testID="pixel-input"
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor={tokens.colors.text.secondary}
              value={value}
              onChangeText={onChangeText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              editable={!disabled}
              selectionColor={tokens.colors.border.focus}
              accessible={true}
              accessibilityLabel={label}
              accessibilityHint={error || placeholder}
              accessibilityState={{disabled}}
              {...restProps}
            />
            <View style={styles.iconRight}>{renderValidationIcon()}</View>
          </Animated.View>
        </Animated.View>
        {error && typeof error === 'string' && (
          <PixelText
            variant="caption"
            colorKey="secondary"
            style={styles.errorText}
            accessibilityLiveRegion="assertive">
            {error}
          </PixelText>
        )}
        {!error && helperText && (
          <PixelText
            variant="caption"
            colorKey="secondary"
            style={styles.helperText}>
            {helperText}
          </PixelText>
        )}
      </View>
    );
  },
);

PixelInput.displayName = 'PixelInput';

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: tokens.spacing[3],
  },
  label: {
    marginBottom: tokens.spacing[1],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.background.primary,
    height: 48, // Minimum touch target
    borderRadius: tokens.border.radius, // 0
  },
  disabledContainer: {
    backgroundColor: tokens.colors.background.elevated,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: tokens.spacing[2],
    ...typography.styles.body,
    color: tokens.colors.text.primary,
  },
  iconLeft: {
    marginLeft: tokens.spacing[2],
  },
  iconRight: {
    marginRight: tokens.spacing[2],
  },
  errorText: {
    marginTop: tokens.spacing[1],
  },
  helperText: {
    marginTop: tokens.spacing[1],
  },
});

export default PixelInput;
