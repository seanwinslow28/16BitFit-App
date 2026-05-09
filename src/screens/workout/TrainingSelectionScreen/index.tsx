// REWORK-V4: copied from V3. Restyle palette + redrive flow off the new sprite/Pokemon-battle architecture after design brainstorm.
/**
 * TrainingSelectionScreen - Select from available daily workouts
 *
 * @wireframe docs/wireframes/training-selection-screen.md
 * @story 1.7
 */

import React, {useState, useCallback} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
// REWORK-V4: react-native-haptic-feedback not installed in V4 — stub trigger.
// import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
const ReactNativeHapticFeedback = {trigger: (_a?: string, _b?: object) => {}};

import {tokens, typography} from '@/design-system';
import {PixelText, PixelButton} from '@/components/atoms';
import {useReducedMotion} from '@/hooks';

// Local components
import {WorkoutCard, Workout} from './components';

// ─────────────────────────────────────────────────────────
// Mock Data (Simulating Supabase Response)
// ─────────────────────────────────────────────────────────

const MOCK_WORKOUTS: Workout[] = [
  {
    id: 'morning_jog',
    title: 'MORNING JOG',
    type: 'CARDIO',
    duration: 30,
    goal: '3,000 steps',
    rewards: {xp: 100},
  },
  {
    id: 'sprint_intervals',
    title: 'SPRINT INTERVALS',
    type: 'CARDIO',
    duration: 20,
    goal: '2,000 steps',
    rewards: {xp: 80},
  },
  {
    id: 'long_run',
    title: 'LONG RUN',
    type: 'CARDIO',
    duration: 60,
    goal: '6,000 steps',
    rewards: {xp: 150},
  },
];

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const TrainingSelectionScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const prefersReducedMotion = useReducedMotion();
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(
    null,
  );

  // ─── Selection Logic ───

  const handleSelectWorkout = useCallback(
    (id: string) => {
      if (selectedWorkoutId !== id) {
        setSelectedWorkoutId(id);
        ReactNativeHapticFeedback.trigger('impactLight');
      }
    },
    [selectedWorkoutId],
  );

  const handleConfirm = useCallback(() => {
    if (!selectedWorkoutId) {
      return;
    }

    ReactNativeHapticFeedback.trigger('impactMedium');
    // Navigate back to Home (dismiss modal)
    navigation.getParent()?.goBack();
  }, [selectedWorkoutId, navigation]);

  // ─── Render ───

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'left', 'right', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <PixelText variant="h3" style={styles.headerTitle}>
          CHOOSE WORKOUT
        </PixelText>
        <PixelText variant="bodySmall" style={styles.headerDate}>
          {new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </PixelText>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {MOCK_WORKOUTS.map(workout => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            isSelected={selectedWorkoutId === workout.id}
            onSelect={() => handleSelectWorkout(workout.id)}
          />
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <PixelButton
          onPress={handleConfirm}
          disabled={!selectedWorkoutId}
          style={styles.confirmButton}
          accessibilityLabel="Confirm selected workout"
          accessibilityHint="Double tap to start your selected workout">
          CONFIRM WORKOUT
        </PixelButton>
      </View>
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background.primary, // #9BBC0F
  },
  header: {
    backgroundColor: tokens.colors.background.primary, // #9BBC0F
    borderBottomWidth: tokens.border.width.thin, // 2px
    borderBottomColor: tokens.colors.border.default, // #306230
    paddingVertical: tokens.spacing[3], // 16px
    paddingHorizontal: tokens.spacing[4], // 24px
    marginBottom: tokens.spacing[3], // 16px
    alignItems: 'center',
  },
  headerTitle: {
    color: tokens.colors.text.primary, // #0F380F
    textAlign: 'center',
    marginBottom: tokens.spacing[1], // 4px
  },
  headerDate: {
    color: tokens.colors.text.secondary, // #306230
    textAlign: 'center',
    fontFamily: typography.fonts.body, // Montserrat
  },
  scrollContent: {
    paddingBottom: tokens.spacing[4], // 24px
  },
  footer: {
    paddingHorizontal: tokens.spacing[4], // 24px
    paddingBottom: tokens.spacing[4], // 24px
    backgroundColor: tokens.colors.background.primary, // #9BBC0F
  },
  confirmButton: {
    width: '100%',
  },
});

export default TrainingSelectionScreen;
