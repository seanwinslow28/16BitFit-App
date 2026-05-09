/**
 * ProgressIndicator - Step-based progress dots
 *
 * Visual indicator for multi-step flows like onboarding.
 * Shows current step, completed steps, and upcoming steps.
 *
 * @example
 * <ProgressIndicator currentStep={2} totalSteps={4} />
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {PixelText} from '../../atoms';
import {tokens} from '../../../design-system';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

export interface ProgressIndicatorProps {
  /** Current step (1-indexed) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Show step label (default: true) */
  showLabel?: boolean;
  /** Dot shape (default: square) */
  dotShape?: 'square' | 'circle';
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const ProgressIndicator: React.FC<ProgressIndicatorProps> = React.memo(
  ({currentStep, totalSteps, showLabel = true, dotShape = 'square'}) => {
    return (
      <View style={styles.container}>
        {/* Dots */}
        <View style={styles.dots}>
          {Array.from({length: totalSteps}).map((_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            const dotStyle = [
              styles.dot,
              dotShape === 'circle' && styles.circleDot,
              isCompleted && styles.completedDot,
              isCurrent && styles.currentDot,
            ];

            return (
              <View
                key={index}
                style={dotStyle}
                accessible={false} // Decorative, label provides context
              />
            );
          })}
        </View>

        {/* Label */}
        {showLabel && (
          <PixelText
            variant="caption"
            colorKey="secondary"
            style={styles.label}>
            Step {currentStep} of {totalSteps}
          </PixelText>
        )}
      </View>
    );
  },
);

ProgressIndicator.displayName = 'ProgressIndicator';

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    backgroundColor: tokens.colors.border.default,
    opacity: 0.4,
  },
  circleDot: {
    borderRadius: 6,
  },
  completedDot: {
    backgroundColor: tokens.colors.text.secondary,
    opacity: 1,
  },
  currentDot: {
    width: 16,
    height: 16,
    backgroundColor: tokens.colors.button.primary,
    opacity: 1,
  },
  label: {
    marginTop: 8,
    textAlign: 'center',
  },
});

export {ProgressIndicator};
export default ProgressIndicator;
