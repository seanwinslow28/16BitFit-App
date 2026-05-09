/**
 * PixelText - Typography wrapper component enforcing the 16BitFit design system fonts and styles.
 *
 * @example
 * <PixelText variant="h1">
 *   16BITFIT
 * </PixelText>
 */

import React, {useMemo} from 'react';
import {
  Text,
  StyleSheet,
  TextProps as RNTextProps,
  TextStyle,
  StyleProp,
  Platform,
} from 'react-native';
import {tokens, typography} from '../../../design-system';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

type TextVariant = keyof typeof typography.styles;
type TextColor = keyof typeof tokens.colors.text;
type TextAlign = 'left' | 'center' | 'right' | 'justify' | 'auto';

interface PixelTextProps extends RNTextProps {
  /** The typographic style variant */
  variant?: TextVariant;
  /** The text color key based on design tokens */
  colorKey?: TextColor;
  /** Text alignment */
  align?: TextAlign;
  /** Content of the text component */
  children: React.ReactNode;
  /** Optional custom styles to override defaults */
  style?: StyleProp<TextStyle>;
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const PixelText: React.FC<PixelTextProps> = React.memo(
  ({
    variant = 'body',
    colorKey = 'primary',
    align = 'auto',
    children,
    style,
    ...restProps
  }) => {
    // ─── Computed Styles ───
    const computedStyles = useMemo(() => {
      // 1. Get the base style from the typography system
      const baseStyle = typography.styles[variant] || typography.styles.body;

      // 2. Determine the color
      const textColor =
        tokens.colors.text[colorKey] || tokens.colors.text.primary;

      // 3. Platform specific adjustments (often needed for custom fonts on Android)
      const platformFixes =
        Platform.OS === 'android' &&
        baseStyle.fontFamily === typography.fonts.heading
          ? {includeFontPadding: false} // Helps mitigate vertical alignment issues with custom fonts
          : {};

      // 4. Combine styles
      return StyleSheet.flatten([
        baseStyle,
        platformFixes,
        {color: textColor, textAlign: align},
        style, // User overrides
      ]);
    }, [variant, colorKey, align, style]);

    // ─── Render ───
    return (
      <Text
        testID="pixel-text"
        style={computedStyles}
        accessible={true}
        allowFontScaling={true} // Respect user's device font size settings for accessibility
        {...restProps}>
        {children}
      </Text>
    );
  },
);

PixelText.displayName = 'PixelText';

export {PixelText};
export default PixelText;
