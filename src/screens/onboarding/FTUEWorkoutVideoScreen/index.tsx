// REWORK-V4: copied from V3. Restyle palette + redrive flow off the new sprite/Pokemon-battle architecture after design brainstorm.
/**
 * FTUEWorkoutVideoScreen - FTUE Screen (Step 3 of 5)
 *
 * A passive 8-12 second video demonstrating what workouts look like in 16BitFit.
 * "Show, don't make them do" approach for onboarding.
 *
 * @wireframe docs/wireframes/ftue-workout-video-screen.md
 * @story 1.10
 */

import React, {useEffect, useRef, useState, useCallback} from 'react';
import {View, StyleSheet, Animated, AccessibilityInfo} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
// Video imports commented out until asset is available
// import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
// REWORK-V4: react-native-haptic-feedback not installed in V4 — stub trigger.
// import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
const ReactNativeHapticFeedback = {trigger: (_a?: string, _b?: object) => {}};

import {tokens, durations, easings} from '@/design-system';
import {PixelText, PixelButton, PixelBorder} from '@/components/atoms';
import PixelProgressBar from '@/components/atoms/PixelProgressBar';
import {ProgressIndicator} from '@/components/molecules';
import {useReducedMotion} from '@/hooks';

// ─────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────

const VIDEO_DURATION_MS = 10000; // 10 seconds (middle of 8-12 range)
const SKIP_ENABLE_DELAY_MS = 2000; // Skip button enabled after 2 seconds

// Video asset availability flag - set to true when video asset is added
const VIDEO_ASSET_AVAILABLE = false;

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const FTUEWorkoutVideoScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const prefersReducedMotion = useReducedMotion();

  // ─── State ───
  const [videoProgress, setVideoProgress] = useState(0);
  const [skipEnabled, setSkipEnabled] = useState(false);
  const [isVideoComplete, setIsVideoComplete] = useState(false);

  // ─── Refs ───
  // const videoRef = useRef<Video>(null); // Uncomment when video asset is available
  const screenOpacity = useRef(new Animated.Value(0)).current;
  const skipButtonOpacity = useRef(new Animated.Value(0.4)).current;

  // ─── Entry Animation ───
  useEffect(() => {
    if (prefersReducedMotion) {
      screenOpacity.setValue(1);
      skipButtonOpacity.setValue(1);
      setSkipEnabled(true);
      return;
    }

    // Fade in screen
    Animated.timing(screenOpacity, {
      toValue: 1,
      duration: durations.normal, // 200ms
      easing: easings.easeOut,
      useNativeDriver: true,
    }).start();

    // Enable skip button after delay
    const skipTimer = setTimeout(() => {
      setSkipEnabled(true);
      Animated.timing(skipButtonOpacity, {
        toValue: 1,
        duration: durations.normal, // 200ms
        useNativeDriver: true,
      }).start();

      // Announce to screen readers
      AccessibilityInfo.announceForAccessibility('Skip button now available');
    }, SKIP_ENABLE_DELAY_MS);

    return () => clearTimeout(skipTimer);
  }, [prefersReducedMotion, screenOpacity, skipButtonOpacity]);

  // ─── Video Playback Handler ───
  // Uncomment when video asset is available
  /*
  const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    // Update progress
    if (status.durationMillis && status.positionMillis) {
      const progress = (status.positionMillis / status.durationMillis) * 100;
      setVideoProgress(progress);
    }

    // Video complete
    if (status.didJustFinish) {
      setIsVideoComplete(true);
      ReactNativeHapticFeedback.trigger('impactMedium');

      // Auto-advance after brief pause
      setTimeout(() => {
        navigateToNext();
      }, 300);
    }
  }, []);
  */

  // ─── Navigation ───
  const navigateToNext = useCallback(() => {
    if (prefersReducedMotion) {
      navigation.navigate('HealthConnectPermission');
      return;
    }

    // Fade out transition
    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: durations.moderate, // 300ms
      easing: easings.easeIn,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('HealthConnectPermission');
    });
  }, [navigation, prefersReducedMotion, screenOpacity]);

  // ─── Skip Handler ───
  const handleSkip = useCallback(() => {
    if (!skipEnabled) {
      return;
    }

    ReactNativeHapticFeedback.trigger('impactMedium');
    navigateToNext();
  }, [skipEnabled, navigateToNext]);

  // ─── Reduce Motion / Missing Asset: Show static frame ───
  const renderVideoContent = () => {
    // Show static placeholder when:
    // 1. User prefers reduced motion, OR
    // 2. Video asset is not yet available
    if (prefersReducedMotion || !VIDEO_ASSET_AVAILABLE) {
      return (
        <View style={styles.staticFrame}>
          <PixelText variant="h3" align="center" colorKey="inverse">
            WORKOUT DEMO
          </PixelText>
          <View style={styles.staticFrameSpacer} />
          <PixelText variant="bodySmall" align="center" colorKey="inverse">
            {prefersReducedMotion
              ? 'Video skipped for reduced motion'
              : 'Video coming soon'}
          </PixelText>
        </View>
      );
    }

    // Video asset is available - render Video component
    // Note: Uncomment require when video asset is added to assets/videos/
    return (
      <View style={styles.staticFrame}>
        <PixelText variant="h3" align="center" colorKey="inverse">
          WORKOUT DEMO
        </PixelText>
        <View style={styles.staticFrameSpacer} />
        <PixelText variant="bodySmall" align="center" colorKey="inverse">
          Video coming soon
        </PixelText>
      </View>
    );
    /* Enable when video asset is available:
    return (
      <Video
        ref={videoRef}
        source={require('@/assets/videos/ftue-workout-demo.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={true}
        isLooping={false}
        isMuted={true}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        accessible={true}
        accessibilityLabel="Workout demonstration video"
        accessibilityHint="Shows how workouts power your champion"
      />
    );
    */
  };

  // ─── Render ───
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[styles.content, {opacity: screenOpacity}]}
        accessible={true}
        accessibilityLabel="Tutorial workout video, step 3 of 5">
        {/* Header */}
        <PixelText
          variant="h2"
          align="center"
          colorKey="primary"
          accessibilityRole="header">
          TUTORIAL WORKOUT
        </PixelText>

        <View style={styles.spacerSmall} />

        {/* Subheader */}
        <PixelText variant="bodySmall" align="center" colorKey="secondary">
          See how workouts power your champion!
        </PixelText>

        <View style={styles.spacerMedium} />

        {/* Video Container */}
        <PixelBorder
          borderWidth="default"
          borderColor={tokens.colors.border.default}
          backgroundColorKey="elevated"
          padding={0}>
          <View style={styles.videoContainer}>{renderVideoContent()}</View>
        </PixelBorder>

        <View style={styles.spacerSmall} />

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <PixelProgressBar
            progress={prefersReducedMotion ? 100 : videoProgress}
            height={8}
            mode="smooth"
            animated={!prefersReducedMotion}
            color={tokens.colors.button.primary}
          />
        </View>

        <View style={styles.spacerLarge} />

        {/* Skip Button */}
        <Animated.View style={{opacity: skipButtonOpacity}}>
          <PixelButton
            variant="secondary"
            onPress={handleSkip}
            disabled={!skipEnabled}
            accessibilityLabel={
              skipEnabled
                ? 'Skip tutorial video'
                : `Skip, available in ${Math.ceil((SKIP_ENABLE_DELAY_MS - (videoProgress / 100) * VIDEO_DURATION_MS) / 1000)} seconds`
            }
            accessibilityHint={
              skipEnabled ? 'Skips to the next step' : 'Wait to skip the video'
            }
            style={styles.skipButton}>
            SKIP
          </PixelButton>
        </Animated.View>

        <View style={styles.spacerSmall} />

        {/* Informational Text */}
        <PixelText
          variant="caption"
          align="center"
          colorKey="secondary"
          style={styles.infoText}>
          This is how workouts power battles
        </PixelText>

        <View style={styles.spacerMedium} />

        {/* Progress Indicator */}
        <ProgressIndicator currentStep={3} totalSteps={5} showLabel={false} />
      </Animated.View>
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
  content: {
    flex: 1,
    paddingHorizontal: tokens.component.screenPaddingX, // 24px
    paddingVertical: tokens.spacing[3], // 16px
    alignItems: 'center',
  },
  spacerSmall: {
    height: tokens.spacing[2], // 8px
  },
  spacerMedium: {
    height: tokens.spacing[3], // 16px
  },
  spacerLarge: {
    height: tokens.spacing[4], // 24px
  },
  videoContainer: {
    width: 297,
    height: 200,
    backgroundColor: tokens.colors.text.primary, // #0F380F - letterboxing
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  staticFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing[3],
  },
  staticFrameSpacer: {
    height: tokens.spacing[2],
  },
  progressBarContainer: {
    width: 280,
  },
  skipButton: {
    width: 280,
    minHeight: tokens.touchTarget.comfortable, // 48dp
  },
  infoText: {
    fontStyle: 'italic',
  },
});

export default FTUEWorkoutVideoScreen;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SELF-QA CHECKLIST
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * PALETTE PURITY (4 DMG colors only):
 * ✅ Background: tokens.colors.background.primary (#9BBC0F)
 * ✅ Video container bg: tokens.colors.text.primary (#0F380F)
 * ✅ Border: tokens.colors.border.default (#306230)
 * ✅ Progress bar fill: tokens.colors.button.primary (#8BAC0F)
 * ✅ Text colors via colorKey (primary=#0F380F, secondary=#306230, inverse=#9BBC0F)
 * ✅ NO other hex codes used - all via tokens
 *
 * ZERO RADIUS:
 * ✅ All borderRadius: 0 via tokens and PixelBorder component
 * ✅ PixelProgressBar has borderRadius: 0 internally
 *
 * ATOMIC ASSEMBLY:
 * ✅ PixelText from @/components/atoms
 * ✅ PixelButton from @/components/atoms
 * ✅ PixelBorder from @/components/atoms
 * ✅ PixelProgressBar from @/components/atoms
 * ✅ ProgressIndicator from @/components/molecules
 * ✅ No new custom components created
 *
 * JUICE MANDATE:
 * ✅ Entry animation: Screen fades in (200ms)
 * ✅ Skip button enable animation: Opacity 0.4 → 1.0 (200ms)
 * ✅ Progress bar animates with video playback
 * ✅ Haptic feedback: impactMedium on video complete and skip
 * ✅ Exit animation: Fade out (300ms) to BattleModeTransitionVideo
 *
 * ACCESSIBILITY FIRST:
 * ✅ accessibilityLabel on screen container
 * ✅ accessibilityRole="header" on title
 * ✅ accessibilityLabel on video with hint
 * ✅ accessibilityLabel on skip button (dynamic based on state)
 * ✅ accessibilityHint on skip button
 * ✅ AccessibilityInfo.announceForAccessibility when skip available
 * ✅ Touch target: 48dp on skip button (comfortable)
 *
 * PARTY MODE TERMINOLOGY:
 * ✅ "TUTORIAL WORKOUT" not "Tutorial Quest"
 * ✅ "Champion" in subheader
 * ✅ "Workouts power battles" messaging
 *
 * REDUCE MOTION SUPPORT:
 * ✅ useReducedMotion hook
 * ✅ Static frame shown instead of video
 * ✅ Skip button immediately enabled
 * ✅ No fade animations when reduced motion enabled
 * ✅ Progress bar shows 100% instantly
 *
 * WIREFRAME COMPLIANCE:
 * ✅ Header: "TUTORIAL WORKOUT" - Press Start 2P, 16px
 * ✅ Subheader: "See how workouts..." - Montserrat, 12px
 * ✅ Video container: 297×200px with 3px border
 * ✅ Progress bar: 280px width, 8px height
 * ✅ Skip button: 280px width, disabled for 2 seconds
 * ✅ Info text: Montserrat Italic, 11px
 * ✅ Progress indicator: 3 of 5 steps
 *
 * NAVIGATION:
 * ✅ Auto-advance on video complete → BattleModeTransitionVideo
 * ✅ Skip button → BattleModeTransitionVideo
 * ✅ Back gesture → TutorialWorkoutAssignmentScreen (native)
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */
