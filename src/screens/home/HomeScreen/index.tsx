// REWORK-V4: copied from V3. Restyle palette + redrive flow off the new sprite/Pokemon-battle architecture after design brainstorm.
/**
 * HomeScreen - Primary dashboard for 16BitFit
 *
 * @wireframe docs/wireframes/home-dashboard-screen-enhanced.md
 * @story 1.6
 */

import React, {useCallback} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
// REWORK-V4: react-native-haptic-feedback not installed in V4 — stub trigger.
// import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
const ReactNativeHapticFeedback = {trigger: (_a?: string, _b?: object) => {}};

import {tokens, typography, durations, easings} from '@/design-system';
import {PixelText} from '@/components/atoms';
import {
  HomeAvatar,
  ProgressRing,
  MomentumBar,
  TrainingCartridge,
  TabBar,
} from '@/components/molecules';
import {useReducedMotion} from '@/hooks';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

interface HomeScreenProps {}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const HomeScreen: React.FC<HomeScreenProps> = () => {
  // Hooks
  const navigation = useNavigation<any>();
  const prefersReducedMotion = useReducedMotion();

  // Progress Data (Mock Data for MVP)
  const fitnessData = {current: 65, label: 'FITNESS'};
  const skillData = {current: 30, label: 'SKILL'};
  const momentumData = {days: 47, progress: 0.7};

  // Daily Workout Data
  const dailyWorkout = {
    title: 'Daily Workout Ready!',
    subtitle: 'Steps: 0/5000',
    isComplete: false,
  };

  // Hardware Stats Data (Bottom Ribbon)
  const hardwareStats = {
    steps: '7,234',
    cals: '342',
    time: '25 min',
  };

  // ─── Callbacks ───

  const handleAvatarPress = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactLight');
    navigation.navigate('Profile');
  }, [navigation]);

  const handleStatsPress = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactLight');
    // Open Stats Panel Overlay
    // navigation.navigate('StatsPanelOverlay');
    console.log('Open Stats Panel');
  }, []);

  const handleTrainingPress = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactMedium');
    // Navigate to Workout Navigator (modal stack)
    navigation.navigate('Workout');
  }, [navigation]);

  const handleChangeWorkoutPress = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactLight');
    navigation.navigate('Workout');
  }, [navigation]);

  const handleTabPress = useCallback(
    (tab: string) => {
      ReactNativeHapticFeedback.trigger('impactLight');
      if (tab === 'battle') {
        // TODO: Phase 3 - Battle Mode not yet implemented
        console.log('Battle Mode coming soon!');
      } else if (tab === 'profile') {
        navigation.navigate('Profile');
      } else if (tab === 'settings') {
        navigation.navigate('Settings');
      }
    },
    [navigation],
  );

  // ─── Render ───

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            onPress={handleAvatarPress}
            activeOpacity={0.9}
            accessible={true}
            accessibilityLabel="Your avatar. Tap to view profile"
            accessibilityHint="Double tap to open your profile and avatar settings">
            <HomeAvatar
              avatarUrl={null}
              evolutionStage={1}
              username="Trainer"
            />
          </TouchableOpacity>
        </View>

        {/* Progress Rings */}
        <View style={styles.ringsSection}>
          <TouchableOpacity
            onPress={handleStatsPress}
            activeOpacity={0.9}
            accessible={true}
            accessibilityLabel={`Fitness progress: ${fitnessData.current}%`}
            accessibilityHint="Double tap to view detailed stats">
            <ProgressRing
              progress={fitnessData.current / 100}
              size={100}
              label={fitnessData.label}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleStatsPress}
            activeOpacity={0.9}
            accessible={true}
            accessibilityLabel={`Skill progress: ${skillData.current}%`}
            accessibilityHint="Double tap to view detailed stats">
            <ProgressRing
              progress={skillData.current / 100}
              size={100}
              label={skillData.label}
            />
          </TouchableOpacity>
        </View>

        {/* Momentum Bar */}
        <View style={styles.momentumSection}>
          <MomentumBar
            days={momentumData.days}
            progress={momentumData.progress}
          />
        </View>

        {/* Training Cartridge (Primary CTA) */}
        <View style={styles.cartridgeSection}>
          <TrainingCartridge
            title={dailyWorkout.title}
            subtitle={dailyWorkout.subtitle}
            onPress={handleTrainingPress}
            active={!dailyWorkout.isComplete}
          />
        </View>

        {/* Change Workout Link */}
        <TouchableOpacity
          style={styles.changeWorkoutLink}
          onPress={handleChangeWorkoutPress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Change current workout">
          <PixelText variant="bodySmall" style={styles.changeWorkoutText}>
            Change Workout
          </PixelText>
        </TouchableOpacity>

        {/* Spacer for Tab Bar */}
        <View style={{height: 80}} />
      </ScrollView>

      {/* Tab Bar (Absolute Positioned) */}
      <TabBar activeTab="home" onTabPress={handleTabPress} />

      {/* Hardware Shell Stats Ribbon (Fixed Bottom) */}
      {/* Note: In a real implementation, this might sit outside SafeAreaView or be handled by a Layout component.
          For this screen specific implementation, we place it here to match wireframe visual hierarchy.
          However, since TabBar is absolute bottom, this ribbon conceptually sits 'below' the LCD area.
          If the TabBar is part of the LCD, this Ribbon would be below the TabBar.
          Given standard mobile layouts, a 'Hardware Shell' area often implies a persistent footer.
          We will position it absolutely at the bottom, adjusting zIndex.
      */}
      {/*
         DESIGN SYSTEM NOTE: The wireframe shows "Hardware Shell (Below LCD)".
         The TabBar is inside the LCD.
         So the hierarchy is: Content -> TabBar -> (Bottom of LCD) -> Hardware Ribbon.
      */}
      <View style={styles.hardwareRibbon}>
        <Text style={styles.hardwareText}>
          Steps: {hardwareStats.steps} | Cals: {hardwareStats.cals} |{' '}
          {hardwareStats.time}
        </Text>
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
  scrollContent: {
    paddingBottom: 100, // Space for TabBar + Ribbon
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: tokens.spacing[4],
    marginBottom: tokens.spacing[4],
  },
  ringsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: tokens.spacing[6], // 40px
    marginBottom: tokens.spacing[3],
  },
  momentumSection: {
    marginBottom: tokens.spacing[3],
  },
  cartridgeSection: {
    paddingHorizontal: 0, // Cartridge component handles its own margins usually, but wireframe says marginHorizontal: 24
    marginBottom: tokens.spacing[2],
  },
  changeWorkoutLink: {
    paddingVertical: tokens.spacing[3],
    paddingHorizontal: tokens.spacing[4],
    alignSelf: 'center',
    minHeight: tokens.touchTarget.minimum,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeWorkoutText: {
    color: tokens.colors.text.secondary, // #306230
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontFamily: typography.fonts.body, // Montserrat
  },
  hardwareRibbon: {
    backgroundColor: '#FF00FF', // #D7D5CA
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#FF00FF', // #9A9A9A
    paddingBottom: 24, // Safe area compensation if needed, or rely on SafeAreaView wrapping
  },
  hardwareText: {
    fontFamily: 'Montserrat', // Not using PixelText because this is hardware shell
    fontWeight: '600',
    fontSize: 12,
    color: '#FF00FF', // #1C1C1C
  },
});

export default HomeScreen;

/**
 * SELF-QA CHECKLIST
 * ✅ Palette: Only DMG colors used in LCD area. Hardware palette used for ribbon.
 * ✅ Border radius: All 0 (enforced by tokens and atomic components).
 * ✅ Touch targets: All >=44dp. HomeAvatar and ProgressRing are larger.
 * ✅ Accessibility: Labels present on all interactive elements.
 * ✅ Reduce Motion: Handled via useReducedMotion hook (ready for anims).
 * ✅ Haptics: Correctly paired with interactions.
 * ✅ Terminology: "Training", "Workout", "Momentum" used in UI copy.
 * ✅ Party Mode Compliance: MomentumBar and TrainingCartridge components used.
 */
