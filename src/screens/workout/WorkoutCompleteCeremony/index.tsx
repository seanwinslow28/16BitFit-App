// REWORK-V4: copied from V3. Restyle palette + redrive flow off the new sprite/Pokemon-battle architecture after design brainstorm.
/**
 * WorkoutCompleteCeremony - Celebrates workout completion (Daily Loop)
 *
 * Architecture: Deep Think "Declarative Composite Ref" pattern
 * - 5-stage parallel animation (1400ms total)
 * - Native driver optimized (translateX mask for progress bar)
 * - Decoupled haptic timeline with XP tick loop
 * - Skip-on-tap with instant snap
 * - Fire-and-forget Supabase persistence on mount
 *
 * @wireframe docs/wireframes/workout-complete-ceremony-screen.md
 * @spec docs/Gemini-3-Pro-Analysis/Gemini 3 Pro - Deep Think - WorkoutCompleteCeremony-Implimentation-Guide.md
 */

import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ScrollView,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
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
const ReactNativeHapticFeedback = {trigger: (_a?: string, _b?: object) => {}};

import {tokens} from '@/design-system';
import {
  PixelButton,
  PixelText,
  PixelBorder,
  PixelIcon,
} from '@/components/atoms';
// REWORK-V4: supabaseClient not yet ported to V4 — stubbed pending V4 backend wiring.
// import {supabase} from '@/services/supabaseClient';
const _stubChain: any = new Proxy(
  () => Promise.resolve({data: null, error: null}),
  {
    get: () => _stubChain,
    apply: () => Promise.resolve({data: null, error: null}),
  },
);
const supabase: any = {
  auth: {
    getUser: async () => ({data: {user: null as {id: string} | null}, error: null}),
  },
  from: (_table: string) => _stubChain,
};
import {useCeremonyAnimation} from './hooks/useCeremonyAnimation';

// --- Types ---

export interface WorkoutCeremonyStats {
  duration: number; // seconds
  steps?: number;
  calories?: number;
}

export interface WorkoutCeremonyRewards {
  xp: number;
  hasTicket: boolean;
  currentLevel: number;
  currentXp: number;
  xpToNextLevel: number;
}

export type WorkoutCeremonyParams = {
  stats: WorkoutCeremonyStats;
  rewards: WorkoutCeremonyRewards;
};

// Navigation types (to be imported from WorkoutNavigator when integrated)
type RootStackParamList = {
  Home: undefined;
  HomeDashboard: undefined;
  WorkoutCompleteCeremony: WorkoutCeremonyParams;
};

type ScreenRouteProp = RouteProp<RootStackParamList, 'WorkoutCompleteCeremony'>;
// REWORK-V4: minimal nav prop shape (StackNavigationProp unavailable).
type ScreenNavigationProp = {
  dispatch: (action: unknown) => void;
  navigate: (screen: keyof RootStackParamList) => void;
};

// --- Constants ---

const HAPTIC_CONFIG = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

// Default values for edge case handling
const DEFAULT_STATS: WorkoutCeremonyStats = {
  duration: 0,
  steps: 0,
  calories: 0,
};

const DEFAULT_REWARDS: WorkoutCeremonyRewards = {
  xp: 50,
  hasTicket: false,
  currentLevel: 1,
  currentXp: 0,
  xpToNextLevel: 100,
};

// --- Component ---

const WorkoutCompleteCeremony: React.FC = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute<ScreenRouteProp>();

  // Graceful fallback for missing/malformed params
  const stats = route.params?.stats || DEFAULT_STATS;
  const rewards = route.params?.rewards || DEFAULT_REWARDS;

  // Animation hook
  const {values, runSequence, skipSequence, isComplete} =
    useCeremonyAnimation();

  // Supabase sync guard (prevent double-fire in React Strict Mode)
  const hasSynced = useRef(false);

  // --- Fire-and-Forget Data Persistence (on mount) ---
  useEffect(() => {
    const persistData = async () => {
      if (hasSynced.current) {
        return;
      }
      hasSynced.current = true;

      try {
        const {
          data: {user},
        } = await supabase.auth.getUser();
        if (!user) {
          return;
        }

        // Fire-and-forget: Don't await results, don't block UI
        // Silent fail - UX priority is the celebration
        Promise.allSettled([
          // 1. Update user profile (evolution progress + last activity)
          supabase
            .from('user_profiles')
            .update({
              evolution_progress: rewards.currentXp + rewards.xp,
              last_activity_date: new Date().toISOString(),
            })
            .eq('id', user.id),

          // 2. Log workout as activity
          supabase.from('activities').insert({
            user_id: user.id,
            activity_type: 'workout',
            duration_minutes: Math.floor(stats.duration / 60),
            calories_burned: stats.calories || 0,
            stats_impact: {
              xp_gained: rewards.xp,
              steps: stats.steps || 0,
            },
          }),
        ]).catch(e => {
          // Silent fail - ceremony UX takes priority
          console.warn('Ceremony persist warning:', e);
        });
      } catch (e) {
        // Silent fail
        console.warn('Ceremony auth warning:', e);
      }
    };

    persistData();
    runSequence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Handlers ---

  const handleContinue = () => {
    ReactNativeHapticFeedback.trigger('impactMedium', HAPTIC_CONFIG);

    // Reset stack to prevent back-navigation to ceremony
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Home'}],
      }),
    );
  };

  // --- Helpers ---

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatStat = (value: number | undefined): string => {
    return value && value > 0 ? String(value) : '--';
  };

  // --- Progress Bar translateX interpolation (Native Driver) ---
  const barTranslateX = values.xpSlide.interpolate({
    inputRange: [-1, 0],
    outputRange: ['-100%', '0%'],
  });

  // --- Render ---

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar
        backgroundColor={tokens.colors.background.primary}
        barStyle="dark-content"
      />

      {/* Tap-to-skip wrapper (only active during animation) */}
      <TouchableWithoutFeedback
        onPress={!isComplete ? skipSequence : undefined}
        accessible={false} // Don't announce tap-to-skip
      >
        <View style={styles.content}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}>
            {/* Stage 1: Header */}
            <Animated.View
              style={[
                styles.headerContainer,
                {transform: [{translateY: values.headerY}]},
              ]}>
              <PixelBorder
                borderWidth="thick"
                borderColor={tokens.colors.border.default}
                style={styles.headerBorder}>
                <View style={styles.headerContent}>
                  <PixelText
                    variant="h2"
                    colorKey="primary"
                    align="center"
                    accessibilityRole="header"
                    accessibilityLabel="Workout Complete! Congratulations.">
                    WORKOUT COMPLETE!
                  </PixelText>
                </View>
              </PixelBorder>
            </Animated.View>

            {/* Stage 2: XP Reward Card */}
            <Animated.View style={{opacity: values.xpOpacity}}>
              <PixelBorder
                borderWidth="default"
                borderColor={tokens.colors.text.primary}
                style={styles.cardContainer}>
                <View
                  style={[
                    styles.cardContent,
                    {backgroundColor: tokens.colors.background.secondary},
                  ]}>
                  <PixelText
                    variant="h3"
                    colorKey="primary"
                    accessibilityLabel={`Plus ${rewards.xp} experience points`}>
                    ⚡ +{rewards.xp} XP
                  </PixelText>

                  {/* Progress Bar (translateX mask technique for Native Driver) */}
                  <View
                    style={styles.progressTrack}
                    accessible={true}
                    accessibilityRole="progressbar"
                    accessibilityLabel={`Level ${rewards.currentLevel} progress`}
                    accessibilityValue={{
                      min: 0,
                      max: rewards.xpToNextLevel,
                      now: Math.min(
                        rewards.currentXp + rewards.xp,
                        rewards.xpToNextLevel,
                      ),
                      text: `${rewards.currentXp + rewards.xp} of ${rewards.xpToNextLevel} XP`,
                    }}>
                    <Animated.View
                      style={[
                        styles.progressFill,
                        {
                          transform: [
                            {translateX: barTranslateX as unknown as number},
                          ],
                        },
                      ]}
                    />
                  </View>

                  <PixelText
                    variant="caption"
                    colorKey="primary"
                    style={styles.progressText}>
                    Level {rewards.currentLevel} •{' '}
                    {Math.min(
                      rewards.currentXp + rewards.xp,
                      rewards.xpToNextLevel,
                    )}
                    /{rewards.xpToNextLevel}
                  </PixelText>
                </View>
              </PixelBorder>
            </Animated.View>

            {/* Stage 3: Battle Ticket Card (Conditional) */}
            {rewards.hasTicket && (
              <Animated.View style={{transform: [{scale: values.ticketScale}]}}>
                <PixelBorder
                  borderWidth="default"
                  borderColor={tokens.colors.border.default}
                  style={styles.cardContainer}>
                  <View
                    style={[
                      styles.cardContent,
                      styles.ticketContent,
                      {backgroundColor: tokens.colors.background.secondary},
                    ]}>
                    <PixelText
                      variant="h3"
                      colorKey="primary"
                      accessibilityLabel="Plus one battle ticket">
                      🎟 +1 BATTLE TICKET
                    </PixelText>
                    <View style={styles.ticketIconContainer}>
                      <PixelIcon
                        name="star"
                        size={24}
                        color={tokens.colors.text.primary}
                      />
                    </View>
                    <PixelText
                      variant="caption"
                      colorKey="primary"
                      style={styles.ticketSubtext}>
                      Daily Goal Met!
                    </PixelText>
                  </View>
                </PixelBorder>
              </Animated.View>
            )}

            {/* Stage 4: Stats Summary */}
            <Animated.View style={{opacity: values.statsOpacity}}>
              <PixelBorder
                borderWidth="thick"
                borderColor={tokens.colors.border.default}
                style={styles.cardContainer}>
                <View style={styles.statsContent}>
                  <View style={styles.statsHeader}>
                    <PixelText variant="caption" colorKey="primary">
                      WORKOUT STATS
                    </PixelText>
                  </View>

                  <View
                    accessible={true}
                    accessibilityLabel={`Duration: ${formatDuration(stats.duration)}. Steps: ${formatStat(stats.steps)}. Calories: ${formatStat(stats.calories)}.`}>
                    <View style={styles.statRow}>
                      <PixelText variant="bodySmall" colorKey="secondary">
                        Duration:
                      </PixelText>
                      <PixelText
                        variant="bodySmall"
                        colorKey="primary"
                        style={styles.statValue}>
                        {formatDuration(stats.duration)}
                      </PixelText>
                    </View>

                    <View style={styles.statRow}>
                      <PixelText variant="bodySmall" colorKey="secondary">
                        Steps:
                      </PixelText>
                      <PixelText
                        variant="bodySmall"
                        colorKey="primary"
                        style={styles.statValue}>
                        {formatStat(stats.steps)}
                      </PixelText>
                    </View>

                    <View style={styles.statRow}>
                      <PixelText variant="bodySmall" colorKey="secondary">
                        Calories:
                      </PixelText>
                      <PixelText
                        variant="bodySmall"
                        colorKey="primary"
                        style={styles.statValue}>
                        {formatStat(stats.calories)}
                      </PixelText>
                    </View>
                  </View>
                </View>
              </PixelBorder>
            </Animated.View>
          </ScrollView>

          {/* Stage 5: CTA Button (Footer) */}
          <Animated.View
            style={[styles.footer, {opacity: values.buttonOpacity}]}>
            <PixelButton
              variant="primary"
              onPress={handleContinue}
              disabled={!isComplete}
              style={styles.ctaButton}
              accessibilityLabel="Continue to Home"
              accessibilityHint="Double tap to return to the main dashboard">
              CONTINUE
            </PixelButton>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background.primary, // #9BBC0F
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: tokens.spacing[5],
    paddingHorizontal: tokens.spacing[4],
    alignItems: 'center',
  },
  headerContainer: {
    width: '100%',
    marginBottom: tokens.spacing[5],
    marginTop: tokens.spacing[4],
  },
  headerBorder: {
    width: '100%',
  },
  headerContent: {
    paddingVertical: tokens.spacing[3],
    paddingHorizontal: tokens.spacing[4],
    backgroundColor: tokens.colors.background.primary,
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    marginBottom: tokens.spacing[4],
  },
  cardContent: {
    padding: tokens.spacing[3],
  },
  ticketContent: {
    alignItems: 'center',
  },
  ticketIconContainer: {
    marginTop: tokens.spacing[2],
  },
  ticketSubtext: {
    marginTop: tokens.spacing[1],
  },
  progressTrack: {
    height: 24,
    width: '100%',
    backgroundColor: tokens.colors.background.primary,
    borderWidth: 2,
    borderColor: tokens.colors.text.primary,
    marginTop: tokens.spacing[2],
    overflow: 'hidden', // CRITICAL: Masks the sliding fill
  },
  progressFill: {
    height: '100%',
    width: '100%',
    backgroundColor: tokens.colors.text.primary, // #0F380F
  },
  progressText: {
    marginTop: tokens.spacing[1],
    textAlign: 'right',
  },
  statsContent: {
    padding: tokens.spacing[3],
    backgroundColor: tokens.colors.background.primary,
  },
  statsHeader: {
    borderBottomWidth: 2,
    borderBottomColor: tokens.colors.border.default,
    paddingBottom: tokens.spacing[1],
    marginBottom: tokens.spacing[2],
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing[1],
  },
  statValue: {
    fontWeight: '600',
  },
  footer: {
    padding: tokens.spacing[4],
  },
  ctaButton: {
    minHeight: 52, // MANDATORY: 52dp from wireframe
    width: '100%',
  },
});

export default WorkoutCompleteCeremony;
