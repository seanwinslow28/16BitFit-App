/**
 * PixelSprite - Image container for displaying pixel art assets (sprites).
 * Ensures crisp rendering and consistent sizing.
 *
 * @example
 * <PixelSprite
 *   source={require('./assets/sprites/heart.png')}
 *   size={32}
 *   alt="Health Points"
 * />
 */

import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageSourcePropType,
  ImageErrorEventData,
  NativeSyntheticEvent,
} from 'react-native';
import {tokens} from '../../../design-system';
import PixelText from '../PixelText';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

type SpriteSize = 8 | 16 | 32 | 64 | 80 | 96 | 128;

interface PixelSpriteProps {
  /** Image source (require() or { uri: '...' }) */
  source: ImageSourcePropType;
  /** Size of the sprite (square dimensions in pixels) */
  size?: SpriteSize;
  /** Optional tint color for the sprite */
  tintColor?: string;
  /** Alternative text for accessibility (required) */
  alt: string;
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const PixelSprite: React.FC<PixelSpriteProps> = React.memo(
  ({source, size = 32, tintColor, alt}) => {
    // ─── State ───
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // ─── Callbacks ───
    const handleLoadStart = useCallback(() => {
      setIsLoading(true);
      setHasError(false);
    }, []);

    const handleLoadEnd = useCallback(() => {
      setIsLoading(false);
    }, []);

    const handleError = useCallback(
      (event: NativeSyntheticEvent<ImageErrorEventData>) => {
        setIsLoading(false);
        setHasError(true);
        console.error('PixelSprite failed to load:', event.nativeEvent.error);
      },
      [],
    );

    // ─── Computed Styles ───
    const containerStyle = useMemo(
      () => ({
        width: size,
        height: size,
      }),
      [size],
    );

    const imageStyle = useMemo(
      () => ({
        width: size,
        height: size,
        tintColor: tintColor,
        // 'contain' maintains aspect ratio.
        resizeMode: 'contain' as const,
      }),
      [size, tintColor],
    );

    // ─── Render ───

    if (hasError) {
      return (
        <View
          style={[styles.container, containerStyle, styles.errorPlaceholder]}
          testID="pixel-sprite-error">
          <PixelText variant="caption">ERR</PixelText>
        </View>
      );
    }

    return (
      <View style={[styles.container, containerStyle]} testID="pixel-sprite">
        {isLoading && (
          <View style={styles.placeholder} testID="pixel-sprite-loading" />
        )}
        <Image
          source={source}
          style={imageStyle}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel={alt}
          fadeDuration={0} // Remove default fade animation on Android for crisp appearance
        />
      </View>
    );
  },
);

PixelSprite.displayName = 'PixelSprite';

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  placeholder: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: tokens.colors.background.elevated, // Loading placeholder
  },
  errorPlaceholder: {
    backgroundColor: tokens.colors.background.elevated, // FIXED: was background.surface
  },
});

export default PixelSprite;
