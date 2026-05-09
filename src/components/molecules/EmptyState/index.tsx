/**
 * EmptyState - Placeholder for empty content
 *
 * Displays icon, title, description, and optional action button
 * for empty data states.
 *
 * @example
 * <EmptyState
 *   title="No Workouts Yet"
 *   description="Start your first workout to track progress"
 *   actionLabel="Start Workout"
 *   onAction={handleStartWorkout}
 * />
 */

import React from 'react';
import {View, StyleSheet, ImageSourcePropType} from 'react-native';
import {PixelSprite, PixelText, PixelButton} from '../../atoms';
import {tokens} from '../../../design-system';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

export interface EmptyStateProps {
  /** Optional icon/sprite source */
  iconSource?: ImageSourcePropType;
  /** Title text */
  title: string;
  /** Description text */
  description: string;
  /** Optional action button label */
  actionLabel?: string;
  /** Action button callback */
  onAction?: () => void;
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const EmptyState: React.FC<EmptyStateProps> = React.memo(
  ({iconSource, title, description, actionLabel, onAction}) => {
    return (
      <View style={styles.container}>
        {iconSource && (
          <View style={styles.iconContainer}>
            <PixelSprite source={iconSource} size={96} alt={title} />
          </View>
        )}

        <PixelText variant="h2" style={styles.title}>
          {title}
        </PixelText>

        <PixelText
          variant="body"
          colorKey="secondary"
          style={styles.description}>
          {description}
        </PixelText>

        {actionLabel && onAction && (
          <View style={styles.action}>
            <PixelButton onPress={onAction} variant="primary">
              {actionLabel}
            </PixelButton>
          </View>
        )}
      </View>
    );
  },
);

EmptyState.displayName = 'EmptyState';

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  iconContainer: {
    opacity: 0.5,
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    maxWidth: 300,
    textAlign: 'center',
  },
  action: {
    marginTop: 16,
  },
});

export default EmptyState;
