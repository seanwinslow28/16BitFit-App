// REWORK-V4: copied from V3. Restyle palette + redrive flow off the new sprite/Pokemon-battle architecture after design brainstorm.
/**
 * WelcomeScreen - First touchpoint for the user.
 * "PRESS START" moment with no friction.
 *
 * @wireframe docs/wireframes/welcome-screen.md
 * @story 1.4
 */

import React, {useEffect, useRef, useCallback} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
// REWORK-V4: @react-navigation/stack not installed in V4 — use minimal local nav prop type.
// import {StackScreenProps} from '@react-navigation/stack';
import {tokens, typography, easings} from '@/design-system';
import {PixelButton, PixelText} from '@/components/atoms';
import {useReducedMotion} from '@/hooks';
// REWORK-V4: OnboardingNavigator not yet ported to V4 — minimal local param list.
// import {OnboardingStackParamList} from '../navigation/OnboardingNavigator';
type OnboardingStackParamList = {
  Welcome: undefined;
  ProfileSetup: undefined;
  ArchetypeSelection: undefined;
  PhotoUpload: undefined;
};

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

// REWORK-V4: minimal nav prop shape (StackScreenProps unavailable).
type WelcomeScreenProps = {
  navigation: {
    navigate: (screen: keyof OnboardingStackParamList) => void;
    goBack: () => void;
  };
};

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({navigation}) => {
  // ─── Hooks ───
  const prefersReducedMotion = useReducedMotion();

  // ─── Animations ───
  // Screen fade-in on mount
  const screenOpacity = useRef(new Animated.Value(0)).current;

  // Logo Breathing: Scale 1.0 -> 1.02 -> 1.0
  const logoScaleAnim = useRef(new Animated.Value(1)).current;

  // ─── Effects ───

  // Screen fade-in on mount
  useEffect(() => {
    if (prefersReducedMotion) {
      screenOpacity.setValue(1);
    } else {
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: 300,
        easing: easings.standard,
        useNativeDriver: true,
      }).start();
    }
  }, [prefersReducedMotion, screenOpacity]);

  // Logo breathing animation
  useEffect(() => {
    if (prefersReducedMotion) {
      logoScaleAnim.setValue(1);
      return;
    }

    const breatheAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(logoScaleAnim, {
          toValue: 1.02, // Slight expansion
          duration: 1000,
          easing: easings.standard,
          useNativeDriver: true,
        }),
        Animated.timing(logoScaleAnim, {
          toValue: 1.0, // Back to normal
          duration: 1000,
          easing: easings.standard,
          useNativeDriver: true,
        }),
      ]),
    );

    breatheAnimation.start();

    return () => {
      breatheAnimation.stop();
    };
  }, [prefersReducedMotion, logoScaleAnim]);

  // ─── Callbacks ───

  const handleStartPress = useCallback(() => {
    // Navigation to Archetype Selection
    navigation.navigate('ArchetypeSelection');
  }, [navigation]);

  // ─── Render ───

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[styles.contentContainer, {opacity: screenOpacity}]}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <PixelText variant="h1" align="center" colorKey="primary">
            16BITFIT
          </PixelText>
          <View style={styles.spacerSmall} />
          <PixelText variant="body" align="center" colorKey="secondary">
            Fitness Battles Fueled by Your Steps
          </PixelText>
        </View>

        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Animated.View
            style={[
              styles.logoContainer,
              {transform: [{scale: logoScaleAnim}]},
            ]}
            accessibilityRole="image"
            accessibilityLabel="16BitFit animated logo">
            {/* Placeholder - logo asset not yet available */}
            <PixelText
              variant="h2"
              align="center"
              style={styles.logoPlaceholder}>
              16BF
            </PixelText>
          </Animated.View>
        </View>

        {/* Footer Section */}
        <View style={styles.footerSection}>
          <PixelButton
            variant="primary"
            onPress={handleStartPress}
            accessibilityLabel="Start your journey"
            accessibilityRole="button"
            accessibilityHint="Begins the onboarding process">
            START YOUR JOURNEY
          </PixelButton>

          <View style={styles.spacerMedium} />

          <PixelText variant="caption" align="center" colorKey="secondary">
            No account needed
          </PixelText>
        </View>
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: tokens.component.screenPaddingX, // 24px
    paddingVertical: tokens.component.screenPaddingY, // 32px
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    width: '100%',
    marginTop: tokens.spacing[4], // Visual balance
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 128,
    height: 128,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: tokens.colors.border.default, // #306230
  },
  footerSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: tokens.spacing[4],
  },
  spacerSmall: {
    height: tokens.spacing[2], // 8px
  },
  spacerMedium: {
    height: tokens.spacing[3], // 16px
  },
  logoPlaceholder: {
    color: tokens.colors.text.primary,
  },
});

export default WelcomeScreen;

/**
 * SELF-QA CHECKLIST
 * ✅ Palette: Only DMG colors via tokens.colors (lines 160, 188)
 * ✅ Border radius: All 0 (PixelButton handles, logoContainer has none)
 * ✅ Touch targets: PixelButton minHeight 48 ensures ≥44dp (line 134)
 * ✅ Accessibility: Labels on Button (137-139), role on logo (121-122)
 * ✅ Reduce Motion: Screen fade (47-56), logo pulse (60-88)
 * ✅ Haptics: PixelButton handles impactMedium on press (Atom default)
 * ✅ Terminology: "Start Your Journey" (Party Mode compliant)
 * ✅ Screen entry animation: 300ms fade-in (lines 50-55)
 */
