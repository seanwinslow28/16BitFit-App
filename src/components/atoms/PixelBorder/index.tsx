/**
 * PixelBorder - A retro border wrapper component.
 * Applies consistent borders, background colors, and hard pixel shadows
 * according to the 16BitFit design system.
 *
 * @example
 * <PixelBorder shadow="medium" backgroundColorKey="elevated" padding={3}>
 *   <PixelText>Content inside the box</PixelText>
 * </PixelBorder>
 */

import React, {useMemo} from 'react';
import {View, StyleSheet, ViewStyle, StyleProp, Platform} from 'react-native';
import {tokens} from '../../../design-system';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

type BorderWidth = keyof typeof tokens.border.width;
type ShadowSize = keyof typeof tokens.shadow | 'none';
type BackgroundColor = keyof typeof tokens.colors.background;

interface PixelBorderProps {
  /** Content to be wrapped by the border */
  children: React.ReactNode;
  /** Thickness of the border */
  borderWidth?: BorderWidth;
  /** Color of the border (hex value) */
  borderColor?: string;
  /** Background color key from design tokens (e.g., 'primary', 'elevated') */
  backgroundColorKey?: BackgroundColor;
  /** Size of the hard pixel shadow */
  shadow?: ShadowSize;
  /** Optional custom styles for the container */
  style?: StyleProp<ViewStyle>;
  /** Padding inside the border (using spacing tokens index) */
  padding?: keyof typeof tokens.spacing;
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const PixelBorder: React.FC<PixelBorderProps> = React.memo(
  ({
    children,
    borderWidth = 'default',
    borderColor = tokens.colors.border.default,
    backgroundColorKey = 'primary',
    shadow = 'none',
    style,
    padding,
  }) => {
    // ─── Computed Styles ───
    const computedStyles = useMemo(() => {
      const width =
        tokens.border.width[borderWidth] || tokens.border.width.default;
      const bgColor =
        tokens.colors.background[backgroundColorKey] ||
        tokens.colors.background.primary;
      const shadowStyle = shadow !== 'none' ? tokens.shadow[shadow] : {};
      const paddingValue =
        padding !== undefined ? tokens.spacing[padding] : undefined;

      // Handle Android elevation (as a fallback, though it won't be pixelated)
      let elevation = 0;
      if (Platform.OS === 'android' && shadow !== 'none') {
        if (shadow === 'small') {
          elevation = 2;
        }
        if (shadow === 'medium') {
          elevation = 4;
        }
        if (shadow === 'large') {
          elevation = 6;
        }
      }

      return StyleSheet.flatten([
        styles.container,
        {
          borderWidth: width,
          borderColor: borderColor,
          backgroundColor: bgColor,
          padding: paddingValue,
          elevation: elevation,
        },
        shadowStyle,
        style,
      ]);
    }, [borderWidth, borderColor, backgroundColorKey, shadow, style, padding]);

    // ─── Render ───
    return (
      <View style={computedStyles} testID="pixel-border">
        {children}
      </View>
    );
  },
);

PixelBorder.displayName = 'PixelBorder';

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    borderRadius: tokens.border.radius, // 0
  },
});

export {PixelBorder};
export default PixelBorder;
