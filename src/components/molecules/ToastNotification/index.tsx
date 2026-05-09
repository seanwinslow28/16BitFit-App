/**
 * ToastNotification - Temporary message overlay
 *
 * Slide-in notification for success, error, info, or warning feedback.
 * Auto-dismisses after configured duration.
 *
 * @example
 * <ToastNotification
 *   message="Profile saved successfully!"
 *   variant="success"
 *   visible={showToast}
 *   onDismiss={() => setShowToast(false)}
 * />
 */

import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {PixelText, PixelIcon, IconName} from '../../atoms';
import {tokens, durations} from '../../../design-system';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastNotificationProps {
  /** Message to display */
  message: string;
  /** Visual variant */
  variant?: ToastVariant;
  /** Whether toast is visible */
  visible: boolean;
  /** Dismiss callback */
  onDismiss: () => void;
  /** Auto-dismiss duration in ms (default: 3000) */
  duration?: number;
}

// Helper to get icon and color for variant
const getVariantStyle = (
  variant: ToastVariant,
): {icon: IconName; color: string} => {
  switch (variant) {
    case 'success':
      return {icon: 'check', color: tokens.colors.button.primary};
    case 'error':
      return {icon: 'error', color: tokens.colors.text.secondary};
    case 'warning':
      return {icon: 'info', color: tokens.colors.text.primary};
    case 'info':
    default:
      return {icon: 'info', color: tokens.colors.button.primary};
  }
};

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const ToastNotification: React.FC<ToastNotificationProps> = React.memo(
  ({message, variant = 'info', visible, onDismiss, duration = 3000}) => {
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (visible) {
        // Slide in
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            damping: 15,
            stiffness: 150,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: durations.normal,
            useNativeDriver: true,
          }),
        ]).start();

        // Auto-dismiss
        const timeout = setTimeout(() => {
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: -100,
              duration: durations.normal,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: durations.fast,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onDismiss();
          });
        }, duration);

        return () => clearTimeout(timeout);
      }
    }, [visible, duration, onDismiss, translateY, opacity]);

    if (!visible) {
      return null;
    }

    const {icon, color} = getVariantStyle(variant);

    return (
      <Animated.View
        style={[
          styles.container,
          {borderColor: color},
          {
            transform: [{translateY}],
            opacity,
          },
        ]}>
        <PixelIcon name={icon} size={20} color={color} />
        <PixelText variant="bodySmall" style={styles.message} numberOfLines={2}>
          {message}
        </PixelText>
      </Animated.View>
    );
  },
);

ToastNotification.displayName = 'ToastNotification';

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 24,
    right: 24,
    zIndex: tokens.zIndex.toast,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 3,
    borderRadius: 0,
    backgroundColor: tokens.colors.background.elevated,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...tokens.shadow.medium,
  },
  message: {
    flex: 1,
  },
});

export {ToastNotification};
export default ToastNotification;
