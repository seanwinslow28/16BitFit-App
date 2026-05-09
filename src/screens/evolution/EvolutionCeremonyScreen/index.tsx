// REWORK-V4: copied from V3 as-is. Rework after design brainstorm + Pokemon-flow decisions land.
/**
 * EvolutionCeremonyScreen - Two-phase Pokemon-style evolution celebration
 *
 * Phase 1 (OVERLAY): Accelerating blink animation on Home Dashboard overlay
 * Phase 2 (RESULTS): Stats comparison with count-up animation
 *
 * Architecture: Winston-approved Reanimated + Phase-Based timing
 * @see docs/plans/winston-evolution-ceremony-architecture-validation.md
 * @wireframe docs/wireframes/evolution-ceremony-screen.md
 * @story 1.6
 */

import React, {useState, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  RouteProp,
  CommonActions,
} from '@react-navigation/native';
// REWORK-V4: @react-navigation/stack not installed in V4 — use minimal local nav prop type.
// import {StackNavigationProp} from '@react-navigation/stack';
// REWORK-V4: react-native-haptic-feedback not installed in V4 — stub trigger.
// import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
const ReactNativeHapticFeedback = {
  trigger: (_type: string, _options?: object) => {
    // REWORK-V4: stubbed haptic feedback
  },
};

import {tokens} from '../../../design-system';
import EvolutionOverlay from './components/EvolutionOverlay';
import EvolutionResults from './components/EvolutionResults';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

export interface EvolutionCeremonyParams {
  /** Previous evolution stage (1-5) */
  previousStage: number;
  /** New evolution stage (1-5) */
  newStage: number;
  /** Previous avatar image URL */
  previousAvatarUrl: string;
  /** New evolved avatar image URL */
  newAvatarUrl: string;
  /** List of new abilities unlocked */
  abilities: string[];
  /** Stat changes from evolution */
  statChanges: {
    hpMax: {before: number; after: number};
    attack: {before: number; after: number};
    defense: {before: number; after: number};
    speed: {before: number; after: number};
  };
}

type CeremonyPhase = 'OVERLAY' | 'RESULTS';

// REWORK-V4: minimal local nav param list — global RootStackParamList not yet defined in V4.
type RootStackParamList = {
  Home: undefined;
  EvolutionCeremony: EvolutionCeremonyParams;
};

type ScreenRouteProp = RouteProp<RootStackParamList, 'EvolutionCeremony'>;
// REWORK-V4: minimal nav prop shape (StackNavigationProp unavailable).
type ScreenNavigationProp = {
  dispatch: (action: unknown) => void;
  navigate: (name: keyof RootStackParamList) => void;
  goBack: () => void;
};

const HAPTIC_CONFIG = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

// ─────────────────────────────────────────────────────────
// Mock Data (for development/testing)
// ─────────────────────────────────────────────────────────

const MOCK_EVOLUTION_DATA: EvolutionCeremonyParams = {
  previousStage: 1,
  newStage: 2,
  previousAvatarUrl: 'https://via.placeholder.com/64/9BBC0F/0F380F?text=S1',
  newAvatarUrl: 'https://via.placeholder.com/128/8BAC0F/0F380F?text=S2',
  abilities: ['Idle animation', 'Happy expression', 'Stage 2 sprite'],
  statChanges: {
    hpMax: {before: 50, after: 65},
    attack: {before: 10, after: 12},
    defense: {before: 8, after: 10},
    speed: {before: 7, after: 8},
  },
};

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const EvolutionCeremonyScreen: React.FC = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute<ScreenRouteProp>();

  // Use route params or fall back to mock data for development
  const evolutionData = route.params || MOCK_EVOLUTION_DATA;

  const [phase, setPhase] = useState<CeremonyPhase>('OVERLAY');

  const handlePhase1Complete = useCallback(() => {
    ReactNativeHapticFeedback.trigger('notificationSuccess', HAPTIC_CONFIG);
    setPhase('RESULTS');
  }, []);

  const handleContinue = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactMedium', HAPTIC_CONFIG);

    // Reset stack to prevent back-navigation to ceremony
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Home'}],
      }),
    );
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {phase === 'OVERLAY' && (
          <EvolutionOverlay
            previousAvatarUrl={evolutionData.previousAvatarUrl}
            newAvatarUrl={evolutionData.newAvatarUrl}
            onComplete={handlePhase1Complete}
          />
        )}
        {phase === 'RESULTS' && (
          <EvolutionResults
            evolutionData={evolutionData}
            onContinue={handleContinue}
          />
        )}
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
    backgroundColor: tokens.colors.background.primary,
  },
  content: {
    flex: 1,
  },
});

export default EvolutionCeremonyScreen;
