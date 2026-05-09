/**
 * FormField - Label + Input + Validation + Error
 *
 * Composite form field component that handles input with validation, error states,
 * and helper text. Uses atomic components for consistent styling.
 *
 * @example
 * <FormField
 *   label="Username"
 *   value={username}
 *   onChangeText={setUsername}
 *   placeholder="Enter username..."
 *   error={usernameError}
 *   helperText="3-20 characters"
 *   required
 * />
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {PixelInput, PixelText, PixelIcon} from '../../atoms';
import {tokens} from '../../../design-system';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

export interface FormFieldProps {
  /** Field label */
  label: string;
  /** Input value */
  value: string;
  /** Change handler */
  onChangeText: (text: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Error message (if validation failed) */
  error?: string;
  /** Helper text below input */
  helperText?: string;
  /** Whether field is required */
  required?: boolean;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Input type (default: 'text') */
  type?: 'text' | 'email' | 'password' | 'numeric';
  /** Maximum character length */
  maxLength?: number;
  /** Autocapitalize mode */
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  /** Autocorrect enabled */
  autoCorrect?: boolean;
  /** Test ID for testing */
  testID?: string;
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const FormField: React.FC<FormFieldProps> = React.memo(
  ({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    helperText,
    required = false,
    disabled = false,
    type = 'text',
    maxLength,
    autoCapitalize,
    autoCorrect,
    testID,
  }) => {
    // Determine input props based on type
    const getInputProps = () => {
      switch (type) {
        case 'email':
          return {
            keyboardType: 'email-address' as const,
            autoCapitalize: 'none' as const,
            autoCorrect: false,
          };
        case 'password':
          return {
            secureTextEntry: true,
            autoCapitalize: 'none' as const,
            autoCorrect: false,
          };
        case 'numeric':
          return {
            keyboardType: 'numeric' as const,
          };
        default:
          return {
            autoCapitalize: autoCapitalize || 'sentences',
            autoCorrect: autoCorrect !== undefined ? autoCorrect : true,
          };
      }
    };

    const inputProps = getInputProps();
    const hasError = !!error;
    const showHelperText = helperText && !hasError;

    return (
      <View style={styles.container} testID={testID}>
        {/* Label */}
        <View style={styles.labelContainer}>
          <PixelText
            variant="bodySmall"
            colorKey="primary"
            style={styles.label}>
            {label}
            {required && (
              <PixelText variant="bodySmall" colorKey="primary">
                {' *'}
              </PixelText>
            )}
          </PixelText>
        </View>

        {/* Input */}
        <PixelInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          editable={!disabled}
          maxLength={maxLength}
          error={error || false}
          testID={testID ? `${testID}-input` : undefined}
          {...inputProps}
        />

        {/* Error Message */}
        {hasError && (
          <View style={styles.errorContainer}>
            <PixelIcon
              name="error"
              size={16}
              color={tokens.colors.feedback.error}
            />
            <PixelText
              variant="caption"
              style={[styles.messageText, styles.errorText]}>
              {error}
            </PixelText>
          </View>
        )}

        {/* Helper Text */}
        {showHelperText && (
          <View style={styles.helperContainer}>
            <PixelText
              variant="caption"
              colorKey="muted"
              style={styles.messageText}>
              {helperText}
            </PixelText>
          </View>
        )}
      </View>
    );
  },
);

FormField.displayName = 'FormField';

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    marginBottom: tokens.spacing[2], // 8px
  },
  label: {
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: tokens.spacing[2], // 8px
    gap: tokens.spacing[1], // 4px
  },
  helperContainer: {
    marginTop: tokens.spacing[2], // 8px
  },
  messageText: {
    flex: 1,
  },
  errorText: {
    color: tokens.colors.feedback.error,
  },
});

export default FormField;
