/**
 * PixelBadge - Notification badge with count or dot indicator
 *
 * Small badge component for displaying notification counts or status indicators.
 * Supports semantic variants mapped to DMG Game Boy color palette.
 *
 * @example
 * <PixelBadge count={5} variant="success" />
 * <PixelBadge dot variant="error" />
 */

import React from 'react';
import {View, Text, StyleSheet, TextStyle} from 'react-native';
import {tokens, typography} from '../../../design-system';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

export type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';

export interface PixelBadgeProps {
  /** Count to display (hidden if 0 and not dot mode) */
  count?: number;
  /** Visual variant for semantic meaning */
  variant?: BadgeVariant;
  /** Dot mode - shows indicator without number */
  dot?: boolean;
  /** Size of the badge (default: 20) */
  size?: number;
}

// ─────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────

/**
 * Maps semantic variants to DMG color palette
 * All colors use the 4-color DMG palette
 */
const getVariantColors = (
  variant: BadgeVariant,
): {background: string; text: string; border: string} => {
  switch (variant) {
    case 'success':
      return {
        background: tokens.colors.button.primary, // #8BAC0F - Lime highlight
        text: tokens.colors.text.primary, // #0F380F - Dark text for contrast
        border: tokens.colors.button.primary,
      };
    case 'error':
      return {
        background: tokens.colors.text.secondary, // #306230 - Pine border
        text: tokens.colors.background.primary, // #9BBC0F - Light text for contrast
        border: tokens.colors.text.secondary,
      };
    case 'warning':
      return {
        background: tokens.colors.text.primary, // #0F380F - Forest shadow
        text: tokens.colors.background.primary, // #9BBC0F - Bright contrast
        border: tokens.colors.text.primary,
      };
    case 'info':
      return {
        background: tokens.colors.background.primary, // #9BBC0F - Neon grass
        text: tokens.colors.text.primary, // #0F380F - Dark text
        border: tokens.colors.text.secondary,
      };
    case 'neutral':
    default:
      return {
        background: tokens.colors.text.secondary, // #306230
        text: tokens.colors.background.primary, // #9BBC0F
        border: tokens.colors.text.secondary,
      };
  }
};

/**
 * Formats count for display
 * Shows "99+" for counts over 99
 */
const formatCount = (count: number): string => {
  if (count > 99) {
    return '99+';
  }
  return count.toString();
};

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const PixelBadge: React.FC<PixelBadgeProps> = React.memo(
  ({count = 0, variant = 'neutral', dot = false, size = 20}) => {
    const colors = getVariantColors(variant);

    // Don't render if count is 0 and not in dot mode
    if (count === 0 && !dot) {
      return null;
    }

    // Dot mode: small circular indicator
    if (dot) {
      const dotSize = size * 0.6; // 60% of badge size
      return (
        <View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              backgroundColor: colors.background,
              borderColor: colors.border,
              borderRadius: dotSize / 2, // Circular
            },
          ]}
          accessible={true}
          accessibilityLabel={`${variant} indicator`}
          accessibilityRole="text"
        />
      );
    }

    // Count mode: badge with number
    const displayText = formatCount(count);

    const textStyle: TextStyle = {
      ...styles.text,
      color: colors.text,
      fontSize: size * 0.5, // Scale font with badge size
      lineHeight: size * 0.6,
    };

    return (
      <View
        style={[
          styles.badge,
          {
            minWidth: size,
            minHeight: size,
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
        accessible={true}
        accessibilityLabel={`${count} ${variant} notifications`}
        accessibilityRole="text">
        <Text style={textStyle}>{displayText}</Text>
      </View>
    );
  },
);

PixelBadge.displayName = 'PixelBadge';

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderRadius: 0, // Retro square badge
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  dot: {
    borderWidth: 2,
  },
  text: {
    fontFamily: typography.fonts.body, // Montserrat for readability at small sizes
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default PixelBadge;
