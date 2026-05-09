/**
 * ActionSheet - Bottom sheet menu for contextual actions
 *
 * Modal bottom sheet with list of actions and cancel button.
 *
 * @example
 * <ActionSheet
 *   visible={showSheet}
 *   onClose={() => setShowSheet(false)}
 *   actions={[
 *     { label: 'Edit Profile', icon: 'user', onPress: handleEdit },
 *     { label: 'Delete', icon: 'close', onPress: handleDelete, destructive: true }
 *   ]}
 * />
 */

import React, {useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import {PixelText, PixelIcon, IconName} from '../../atoms';
import {tokens, durations} from '../../../design-system';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

export interface Action {
  label: string;
  icon?: IconName;
  onPress: () => void;
  destructive?: boolean;
}

export interface ActionSheetProps {
  /** Whether sheet is visible */
  visible: boolean;
  /** Close callback */
  onClose: () => void;
  /** List of actions */
  actions: Action[];
  /** Optional title */
  title?: string;
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const ActionSheet: React.FC<ActionSheetProps> = React.memo(
  ({visible, onClose, actions, title}) => {
    const translateY = useRef(new Animated.Value(500)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (visible) {
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            damping: 20,
            stiffness: 150,
            useNativeDriver: true,
          }),
          Animated.timing(backdropOpacity, {
            toValue: 1,
            duration: durations.normal,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 500,
            duration: durations.normal,
            useNativeDriver: true,
          }),
          Animated.timing(backdropOpacity, {
            toValue: 0,
            duration: durations.fast,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, [visible, translateY, backdropOpacity]);

    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={onClose}>
        <Pressable onPress={onClose} style={StyleSheet.absoluteFill}>
          <Animated.View
            style={[styles.backdrop, {opacity: backdropOpacity}]}
          />
        </Pressable>

        <Animated.View style={[styles.container, {transform: [{translateY}]}]}>
          <View style={styles.handle} />

          {title && (
            <PixelText variant="h3" style={styles.title}>
              {title}
            </PixelText>
          )}

          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.actionButton,
                action.destructive && styles.destructiveAction,
              ]}
              onPress={() => {
                action.onPress();
                onClose();
              }}>
              {action.icon && (
                <PixelIcon
                  name={action.icon}
                  size={20}
                  color={
                    action.destructive
                      ? tokens.colors.text.secondary
                      : tokens.colors.text.primary
                  }
                />
              )}
              <PixelText
                variant="body"
                colorKey={action.destructive ? 'secondary' : 'primary'}>
                {action.label}
              </PixelText>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={onClose}>
            <PixelText variant="body" colorKey="secondary">
              Cancel
            </PixelText>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    );
  },
);

ActionSheet.displayName = 'ActionSheet';

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: tokens.colors.background.elevated,
    borderTopWidth: 4,
    borderTopColor: tokens.colors.border.highlight,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: tokens.colors.border.default,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  actionButton: {
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 3,
    borderRadius: 0,
    borderColor: tokens.colors.border.default,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  destructiveAction: {
    borderColor: tokens.colors.text.secondary,
  },
  cancelButton: {
    marginTop: 8,
  },
});

export default ActionSheet;
