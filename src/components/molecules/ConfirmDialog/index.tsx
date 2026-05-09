/**
 * ConfirmDialog - Simple confirmation modal
 *
 * Modal dialog for confirmations with confirm/cancel buttons.
 *
 * @example
 * <ConfirmDialog
 *   visible={showDialog}
 *   title="Delete Workout?"
 *   message="This action cannot be undone."
 *   confirmLabel="Delete"
 *   destructive
 *   onConfirm={handleDelete}
 *   onCancel={() => setShowDialog(false)}
 * />
 */

import React from 'react';
import {View, Modal, StyleSheet} from 'react-native';
import {PixelText, PixelButton} from '../../atoms';
import {tokens} from '../../../design-system';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

export interface ConfirmDialogProps {
  /** Whether dialog is visible */
  visible: boolean;
  /** Dialog title */
  title: string;
  /** Dialog message */
  message: string;
  /** Confirm button label */
  confirmLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Whether confirm action is destructive */
  destructive?: boolean;
  /** Confirm callback */
  onConfirm: () => void;
  /** Cancel callback */
  onCancel: () => void;
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const ConfirmDialog: React.FC<ConfirmDialogProps> = React.memo(
  ({
    visible,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    destructive = false,
    onConfirm,
    onCancel,
  }) => {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onCancel}>
        <View style={styles.backdrop}>
          <View style={styles.container}>
            <PixelText variant="h3" style={styles.title}>
              {title}
            </PixelText>

            <PixelText
              variant="body"
              colorKey="secondary"
              style={styles.message}>
              {message}
            </PixelText>

            <View style={styles.buttons}>
              <View style={styles.buttonWrapper}>
                <PixelButton onPress={onCancel} variant="secondary">
                  {cancelLabel}
                </PixelButton>
              </View>

              <View style={styles.buttonWrapper}>
                <PixelButton onPress={onConfirm} variant="primary">
                  {confirmLabel}
                </PixelButton>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  },
);

ConfirmDialog.displayName = 'ConfirmDialog';

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderWidth: 4,
    borderRadius: 0,
    borderColor: tokens.colors.border.highlight,
    backgroundColor: tokens.colors.background.elevated,
    gap: 16,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  buttonWrapper: {
    flex: 1,
  },
});

export default ConfirmDialog;
