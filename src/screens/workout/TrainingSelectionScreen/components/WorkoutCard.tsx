/**
 * WorkoutCard - Selectable workout card for TrainingSelectionScreen
 *
 * Extracted to fix React Hooks rules violation.
 */

import React, {useRef, useEffect} from 'react';
import {TouchableOpacity, Animated, View, StyleSheet} from 'react-native';

import {tokens, durations, easings} from '@/design-system';
import {PixelText} from '@/components/atoms';
import {useReducedMotion} from '@/hooks';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

export interface Workout {
  id: string;
  title: string;
  type: string;
  duration: number;
  goal: string;
  rewards: {
    xp: number;
  };
}

interface WorkoutCardProps {
  workout: Workout;
  isSelected: boolean;
  onSelect: () => void;
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  isSelected,
  onSelect,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    Animated.timing(scaleAnim, {
      toValue: isSelected ? 1.02 : 1,
      duration: durations.fast,
      easing: easings.sharp,
      useNativeDriver: true,
    }).start();
  }, [isSelected, prefersReducedMotion, scaleAnim]);

  const cardStyle = [
    styles.card,
    isSelected ? styles.cardSelected : styles.cardUnselected,
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onSelect}
      accessible={true}
      accessibilityRole="radio"
      accessibilityLabel={`${workout.title}, ${workout.type}, ${workout.duration} minutes. Goal: ${workout.goal}. Reward: ${workout.rewards.xp} XP. ${isSelected ? 'Currently selected.' : 'Not selected.'}`}
      accessibilityState={{checked: isSelected}}
      accessibilityHint={
        isSelected
          ? 'Double tap to keep this workout selected'
          : 'Double tap to select this workout'
      }>
      <Animated.View style={[cardStyle, {transform: [{scale: scaleAnim}]}]}>
        <PixelText
          variant="buttonSecondary"
          style={[styles.workoutTitle, {color: tokens.colors.text.primary}]}>
          {workout.title}
        </PixelText>

        <PixelText variant="bodySmall" style={styles.workoutType}>
          {workout.type} • {workout.duration} MIN
        </PixelText>

        <View style={styles.detailsContainer}>
          <PixelText variant="bodySmall" style={styles.detailText}>
            Goal: {workout.goal}
          </PixelText>
          <PixelText variant="bodySmall" style={styles.rewardText}>
            Reward: +{workout.rewards.xp} XP
          </PixelText>
        </View>

        <PixelText variant="caption" style={styles.selectionHint}>
          {isSelected ? '[✓ SELECTED]' : '[TAP TO SELECT]'}
        </PixelText>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    padding: tokens.spacing[3], // 16px
    marginHorizontal: tokens.spacing[4], // 24px
    marginBottom: 12, // Wireframe spec: 12px
    minHeight: tokens.touchTarget.large, // 80dp
    borderRadius: tokens.border.radius, // 0
  },
  cardSelected: {
    backgroundColor: tokens.colors.background.secondary, // #8BAC0F
    borderWidth: tokens.border.width.thick, // 4px
    borderColor: tokens.colors.text.primary, // #0F380F per wireframe
    ...tokens.shadow.medium,
  },
  cardUnselected: {
    backgroundColor: tokens.colors.background.primary, // #9BBC0F
    borderWidth: tokens.border.width.thin, // 2px
    borderColor: tokens.colors.border.default, // #306230
  },
  workoutTitle: {
    marginBottom: tokens.spacing[1], // 4px
    textAlign: 'left',
  },
  workoutType: {
    color: tokens.colors.text.secondary, // #306230
    marginBottom: tokens.spacing[2], // 8px
  },
  detailsContainer: {
    marginBottom: tokens.spacing[2], // 8px
  },
  detailText: {
    color: tokens.colors.text.primary, // #0F380F
    marginBottom: tokens.spacing[1], // 4px
  },
  rewardText: {
    color: tokens.colors.text.primary, // #0F380F
    fontWeight: '600',
  },
  selectionHint: {
    color: tokens.colors.text.secondary, // #306230
    marginTop: tokens.spacing[1], // 4px
  },
});

export default WorkoutCard;
