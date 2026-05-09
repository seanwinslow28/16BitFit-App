/**
 * EvolutionResults - Phase 2: Stats comparison with count-up animation
 *
 * Displays new abilities and stat bonuses after evolution completes.
 *
 * @wireframe docs/wireframes/evolution-ceremony-screen.md
 */

// REWORK-V4: copied from V3 as-is. Rework after design brainstorm + Pokemon-flow decisions land.
import React, {useEffect, useCallback} from 'react';
import {View, StyleSheet, ScrollView, Image} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  useDerivedValue,
  interpolate,
  type SharedValue,
} from 'react-native-reanimated';
// REWORK-V4: react-native-haptic-feedback not installed in V4 — stub trigger.
// import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
const ReactNativeHapticFeedback = {
  trigger: (_type: string, _options?: object) => {
    // REWORK-V4: stubbed haptic feedback
  },
};
import {SafeAreaView} from 'react-native-safe-area-context';

import {tokens} from '../../../../design-system';
import {PixelText, PixelButton, PixelBorder, PixelDivider} from '../../../../components/atoms';
import type {EvolutionCeremonyParams} from '../index';

const HAPTIC_CONFIG = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

interface EvolutionResultsProps {
  /** Evolution data including stats and abilities */
  evolutionData: EvolutionCeremonyParams;
  /** Callback when continue button pressed */
  onContinue: () => void;
}

// Animated stat row component
interface StatRowProps {
  label: string;
  before: number;
  after: number;
  progress: SharedValue<number>;
  index: number;
}

const AnimatedStatRow: React.FC<StatRowProps> = ({
  label,
  before,
  after,
  progress,
  index,
}) => {
  // Stagger the animations by index
  const animatedValue = useDerivedValue(() => {
    const staggerDelay = index * 0.15;
    return interpolate(progress.value, [staggerDelay, staggerDelay + 0.5], [0, 1], 'clamp');
  });

  const displayedValue = useDerivedValue(() => {
    return Math.round(before + (after - before) * animatedValue.value);
  });

  const rowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedValue.value, [0, 0.3], [0, 1], 'clamp'),
    transform: [{translateX: interpolate(animatedValue.value, [0, 1], [-20, 0], 'clamp')}],
  }));

  return (
    <Animated.View style={[styles.statRow, rowStyle]}>
      <View style={styles.statLabel}>
        <PixelText variant="bodySmall" colorKey="secondary">
          {label}
        </PixelText>
      </View>
      <PixelText variant="bodySmall" colorKey="primary" style={styles.statValue}>
        {`${before} → ${after}`}
      </PixelText>
    </Animated.View>
  );
};

export const EvolutionResults: React.FC<EvolutionResultsProps> = ({
  evolutionData,
  onContinue,
}) => {
  const {
    statChanges,
    abilities,
    previousStage,
    newStage,
    previousAvatarUrl,
    newAvatarUrl,
  } = evolutionData;

  // Stat count-up animation progress (0 to 1)
  const statProgress = useSharedValue(0);

  useEffect(() => {
    // Trigger count-up on mount
    statProgress.value = withTiming(1, {
      duration: 1200,
      easing: Easing.out(Easing.quad),
    });

    // Haptic for stat reveals
    const intervals = [0, 150, 300, 450];
    intervals.forEach(delay => {
      setTimeout(() => {
        ReactNativeHapticFeedback.trigger('selection', HAPTIC_CONFIG);
      }, delay);
    });
  }, [statProgress]);

  const handleContinue = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactMedium', HAPTIC_CONFIG);
    onContinue();
  }, [onContinue]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <PixelBorder
          borderWidth="thick"
          borderColor={tokens.colors.text.primary /* REWORK-V4: was tokens.colors.dmg.darkest */}
          backgroundColorKey="secondary"
          shadow="medium"
          padding={3}
          style={styles.header}>
          <PixelText
            variant="h2"
            colorKey="primary"
            align="center"
            accessibilityRole="header"
            accessibilityLabel="Evolution complete! Your avatar has evolved.">
            EVOLUTION COMPLETE!
          </PixelText>
        </PixelBorder>

        {/* Sprite Comparison */}
        <PixelBorder
          borderWidth="default"
          borderColor={tokens.colors.border.default}
          backgroundColorKey="primary"
          padding={3}
          style={styles.comparisonContainer}>
          <View style={styles.stageLabels}>
            <PixelText variant="caption" colorKey="primary">
              STAGE {previousStage}
            </PixelText>
            <PixelText variant="caption" colorKey="secondary">
              →
            </PixelText>
            <PixelText variant="caption" colorKey="primary">
              STAGE {newStage}
            </PixelText>
          </View>

          <View
            style={styles.spriteRow}
            accessibilityLabel={`Avatar evolved from Stage ${previousStage} to Stage ${newStage}`}>
            {/* Old sprite (dimmed) */}
            <View style={styles.oldSpriteContainer}>
              <Image
                source={{uri: previousAvatarUrl}}
                style={styles.oldSprite}
                resizeMode="contain"
              />
            </View>

            <PixelText variant="h3" colorKey="secondary">
              →
            </PixelText>

            {/* New sprite (full size) */}
            <View style={styles.newSpriteContainer}>
              <Image
                source={{uri: newAvatarUrl}}
                style={styles.newSprite}
                resizeMode="contain"
              />
            </View>
          </View>
        </PixelBorder>

        {/* New Abilities */}
        <PixelBorder
          borderWidth="default"
          borderColor={tokens.colors.border.default}
          backgroundColorKey="primary"
          padding={3}
          style={styles.sectionContainer}>
          <PixelText variant="caption" colorKey="primary" style={styles.sectionTitle}>
            NEW ABILITIES
          </PixelText>
          <PixelDivider
            color={tokens.colors.border.default}
            thickness="thin"
            marginVertical={8}
          />
          <View
            accessibilityLabel={`New abilities: ${abilities.join(', ')}`}
            accessibilityRole="list">
            {abilities.map((ability, index) => (
              <PixelText
                key={index}
                variant="bodySmall"
                colorKey="primary"
                style={styles.abilityItem}>
                • {ability}
              </PixelText>
            ))}
          </View>
        </PixelBorder>

        {/* Stat Bonuses */}
        <PixelBorder
          borderWidth="default"
          borderColor={tokens.colors.border.default}
          backgroundColorKey="primary"
          padding={3}
          style={styles.sectionContainer}>
          <PixelText variant="caption" colorKey="primary" style={styles.sectionTitle}>
            STAT BONUSES
          </PixelText>
          <PixelDivider
            color={tokens.colors.border.default}
            thickness="thin"
            marginVertical={8}
          />
          <View
            accessibilityLabel={`Stat bonuses: HP Max ${statChanges.hpMax.before} to ${statChanges.hpMax.after}, Attack ${statChanges.attack.before} to ${statChanges.attack.after}, Defense ${statChanges.defense.before} to ${statChanges.defense.after}, Speed ${statChanges.speed.before} to ${statChanges.speed.after}`}>
            <AnimatedStatRow
              label="HP Max:"
              before={statChanges.hpMax.before}
              after={statChanges.hpMax.after}
              progress={statProgress}
              index={0}
            />
            <AnimatedStatRow
              label="Attack:"
              before={statChanges.attack.before}
              after={statChanges.attack.after}
              progress={statProgress}
              index={1}
            />
            <AnimatedStatRow
              label="Defense:"
              before={statChanges.defense.before}
              after={statChanges.defense.after}
              progress={statProgress}
              index={2}
            />
            <AnimatedStatRow
              label="Speed:"
              before={statChanges.speed.before}
              after={statChanges.speed.after}
              progress={statProgress}
              index={3}
            />
          </View>
        </PixelBorder>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <PixelButton
          variant="primary"
          onPress={handleContinue}
          style={styles.continueButton}
          accessibilityLabel="Awesome - return to home"
          accessibilityHint="Double tap to return to the home screen">
          AWESOME!
        </PixelButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background.primary,
  },
  scrollContent: {
    paddingVertical: tokens.spacing[5],
    paddingHorizontal: tokens.spacing[4],
  },
  header: {
    marginBottom: tokens.spacing[4],
  },
  comparisonContainer: {
    marginBottom: tokens.spacing[4],
    alignItems: 'center',
  },
  stageLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: tokens.spacing[2],
  },
  spriteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  oldSpriteContainer: {
    width: 64,
    height: 64,
    opacity: 0.7,
  },
  oldSprite: {
    width: 64,
    height: 64,
  },
  newSpriteContainer: {
    width: 128,
    height: 128,
  },
  newSprite: {
    width: 128,
    height: 128,
  },
  sectionContainer: {
    marginBottom: tokens.spacing[4],
  },
  sectionTitle: {
    marginBottom: tokens.spacing[1],
  },
  abilityItem: {
    marginBottom: tokens.spacing[1],
    paddingLeft: tokens.spacing[2],
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing[1],
  },
  statLabel: {
    width: 80,
  },
  statValue: {
    fontWeight: '600',
  },
  footer: {
    padding: tokens.spacing[4],
    borderTopWidth: tokens.border.width.thin,
    borderTopColor: tokens.colors.border.default,
  },
  continueButton: {
    minHeight: 52,
    width: '100%',
  },
});

export default EvolutionResults;
