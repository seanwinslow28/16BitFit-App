/**
 * PixelCheckbox - Toggle control with bounce animation
 *
 * Checkbox component with Game Boy aesthetics featuring bounce animation
 * on toggle and haptic feedback.
 *
 * @example
 * <PixelCheckbox
 *   checked={isChecked}
 *   onToggle={setIsChecked}
 *   label="Accept terms"
 * />
 */

import React, {useRef, useCallback} from 'react';
import {TouchableOpacity, View, Animated, StyleSheet, Text} from 'react-native';
// REWORK-V4: pending haptics integration
// import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {tokens, typography, durations} from '../../../design-system';
import PixelIcon from '../PixelIcon';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

export interface PixelCheckboxProps {
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Callback when checkbox is toggled */
  onToggle: (checked: boolean) => void;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Optional label text */
  label?: string;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const PixelCheckbox: React.FC<PixelCheckboxProps> = React.memo(
  ({
    checked,
    onToggle,
    disabled = false,
    label,
    accessibilityLabel,
    accessibilityHint,
  }) => {
    // Animation for bounce effect
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Bounce animation on toggle
    const animateBounce = useCallback(() => {
      // Sequence: Scale down → Spring back up with bounce
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: durations.fast, // 100ms
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3, // Low friction for bouncy feel
          tension: 200, // Higher tension for snappier bounce
          useNativeDriver: true,
        }),
      ]).start();
    }, [scaleAnim]);

    const handlePress = useCallback(() => {
      if (disabled) {
        return;
      }

      // REWORK-V4: pending haptics integration
      // ReactNativeHapticFeedback.trigger('impactLight');

      // Animate bounce
      animateBounce();

      // Toggle state
      onToggle(!checked);
    }, [disabled, checked, onToggle, animateBounce]);

    const checkboxStyle = [
      styles.checkbox,
      checked && styles.checked,
      disabled && styles.disabled,
    ];

    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={1} // We manage visual feedback via animation
        style={styles.touchArea}
        accessible={true}
        accessibilityRole="checkbox"
        accessibilityLabel={accessibilityLabel || label || 'Checkbox'}
        accessibilityHint={accessibilityHint}
        accessibilityState={{checked, disabled}}>
        <Animated.View
          style={[
            checkboxStyle,
            {
              transform: [{scale: scaleAnim}],
            },
          ]}>
          {checked && (
            <PixelIcon
              name="check"
              size={16}
              color={
                disabled
                  ? tokens.colors.text.secondary
                  : tokens.colors.text.primary
              }
            />
          )}
        </Animated.View>

        {label && (
          <Text style={[styles.label, disabled && styles.disabledLabel]}>
            {label}
          </Text>
        )}
      </TouchableOpacity>
    );
  },
);

PixelCheckbox.displayName = 'PixelCheckbox';

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  touchArea: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: tokens.touchTarget.minimum, // 44pt minimum touch target
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: tokens.border.width.default, // 3px
    borderRadius: 0, // Pure retro, no rounding
    borderColor: tokens.colors.border.default,
    backgroundColor: tokens.colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: tokens.colors.button.primary,
    borderColor: tokens.colors.border.highlight,
  },
  disabled: {
    opacity: 0.4,
    borderColor: tokens.colors.border.default,
    backgroundColor: tokens.colors.background.elevated,
  },
  label: {
    ...typography.styles.body,
    color: tokens.colors.text.primary,
    flex: 1,
  },
  disabledLabel: {
    color: tokens.colors.text.secondary,
    opacity: 0.6,
  },
});

export default PixelCheckbox;
