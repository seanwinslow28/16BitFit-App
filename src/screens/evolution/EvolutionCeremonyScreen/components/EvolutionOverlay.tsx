/**
 * EvolutionOverlay - Phase 1: Pokemon-style blink animation
 *
 * Uses dual-image opacity technique (both sprites rendered, toggle opacity)
 * to prevent image flickering during rapid toggles.
 *
 * @wireframe docs/wireframes/evolution-ceremony-screen.md
 */

// REWORK-V4: copied from V3 as-is. Rework after design brainstorm + Pokemon-flow decisions land.
import React, {useEffect, useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
// REWORK-V4: react-native-haptic-feedback not installed in V4 — stub trigger.
// import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
const ReactNativeHapticFeedback = {
  trigger: (_type: string, _options?: object) => {
    // REWORK-V4: stubbed haptic feedback
  },
};

import {tokens} from '../../../../design-system';
import {PixelText, PixelBorder} from '../../../../components/atoms';
import {useEvolutionAnimation} from '../hooks/useEvolutionAnimation';
// import {useSoundPool} from '../hooks/useSoundPool';

const HAPTIC_CONFIG = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

interface EvolutionOverlayProps {
  /** Previous avatar image URL */
  previousAvatarUrl: string;
  /** New evolved avatar image URL */
  newAvatarUrl: string;
  /** Callback when animation completes */
  onComplete: () => void;
}

export const EvolutionOverlay: React.FC<EvolutionOverlayProps> = ({
  previousAvatarUrl,
  newAvatarUrl,
  onComplete,
}) => {
  // Sound pool for rapid blink audio (ADR-004)
  // TODO: Add actual sound asset when available
  // const {play: playBlink} = useSoundPool(
  //   require('@/assets/audio/evolution_blink.mp3'),
  //   4,
  // );

  const handleToggle = useCallback(() => {
    // Haptic on each toggle
    ReactNativeHapticFeedback.trigger('selection', HAPTIC_CONFIG);
    // playBlink(); // Uncomment when audio asset available
  }, []);

  const {showNewSprite, flashOpacity, start, skip} = useEvolutionAnimation({
    onToggle: handleToggle,
    onComplete,
  });

  // Start animation on mount
  useEffect(() => {
    // Small delay to ensure images are loaded
    const timer = setTimeout(() => {
      start();
    }, 500);
    return () => clearTimeout(timer);
  }, [start]);

  // Animated styles for dual-image opacity toggle
  const oldSpriteStyle = useAnimatedStyle(() => ({
    opacity: showNewSprite.value === 0 ? 1 : 0,
  }));

  const newSpriteStyle = useAnimatedStyle(() => ({
    opacity: showNewSprite.value === 1 ? 1 : 0,
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      <View style={styles.backdrop} />

      {/* Interactive content - tap to skip */}
      <TouchableOpacity
        style={styles.content}
        activeOpacity={1}
        onPress={skip}
        accessibilityLabel="Evolution animation in progress"
        accessibilityHint="Tap to skip evolution animation"
        accessibilityRole="button">
        {/* Header */}
        <PixelBorder
          borderWidth="thick"
          borderColor={tokens.colors.text.primary /* REWORK-V4: was tokens.colors.dmg.darkest */}
          backgroundColorKey="secondary"
          shadow="medium"
          padding={3}
          style={styles.headerContainer}>
          <PixelText
            variant="h3"
            colorKey="primary"
            align="center"
            accessibilityRole="header">
            YOUR CHAMPION IS{'\n'}EVOLVING!
          </PixelText>
        </PixelBorder>

        {/* Sprite Stage - Dual image opacity technique */}
        <PixelBorder
          borderWidth="thick"
          borderColor={tokens.colors.border.default}
          backgroundColorKey="primary"
          style={styles.spriteFrame}>
          <View style={styles.spriteContainer}>
            {/* Old sprite */}
            <Animated.Image
              source={{uri: previousAvatarUrl}}
              style={[styles.sprite, oldSpriteStyle]}
              resizeMode="contain"
              accessibilityElementsHidden
            />
            {/* New sprite */}
            <Animated.Image
              source={{uri: newAvatarUrl}}
              style={[styles.sprite, styles.absoluteSprite, newSpriteStyle]}
              resizeMode="contain"
              accessibilityElementsHidden
            />
          </View>
        </PixelBorder>

        {/* Skip hint */}
        <PixelText
          variant="caption"
          colorKey="secondary"
          align="center"
          style={styles.skipHint}>
          Tap to skip
        </PixelText>
      </TouchableOpacity>

      {/* Flash overlay (ADR-003: Animated.View, NOT Skia) */}
      <Animated.View
        style={[styles.flashOverlay, flashStyle]}
        pointerEvents="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: tokens.colors.background.primary,
    opacity: 0.95,
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing[4],
  },
  headerContainer: {
    marginBottom: tokens.spacing[6],
    maxWidth: 300,
  },
  spriteFrame: {
    marginBottom: tokens.spacing[5],
  },
  spriteContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sprite: {
    width: 128,
    height: 128,
  },
  absoluteSprite: {
    position: 'absolute',
  },
  skipHint: {
    opacity: 0.7,
    marginTop: tokens.spacing[4],
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: tokens.colors.button.primary, // REWORK-V4: was tokens.colors.dmg.light (#8BAC0F)
    pointerEvents: 'none',
  },
});

export default EvolutionOverlay;
