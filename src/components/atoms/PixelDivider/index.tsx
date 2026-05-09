/**
 * PixelDivider - Horizontal divider for visual separation
 *
 * Simple, chunky retro divider with configurable thickness.
 * Used to separate content sections with authentic Game Boy aesthetics.
 *
 * @example
 * <PixelDivider thickness="medium" color={tokens.colors.text.secondary} />
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {tokens} from '../../../design-system';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

export type DividerThickness = 'thin' | 'medium' | 'thick';

export interface PixelDividerProps {
  /** Thickness variant (default: medium) */
  thickness?: DividerThickness;
  /** Divider color (default: DMG dark) */
  color?: string;
  /** Vertical margin (default: 24) */
  marginVertical?: number;
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const PixelDivider: React.FC<PixelDividerProps> = React.memo(
  ({
    thickness = 'medium',
    color = tokens.colors.text.secondary,
    marginVertical = 24,
  }) => {
    // Map thickness to pixel values
    const heightMap: Record<DividerThickness, number> = {
      thin: tokens.border.width.thin, // 2px
      medium: tokens.border.width.default, // 3px
      thick: tokens.border.width.thick, // 4px
    };

    const height = heightMap[thickness];

    return (
      <View
        style={[
          styles.divider,
          {
            height,
            backgroundColor: color,
            marginVertical,
          },
        ]}
        accessible={false} // Dividers are decorative, not interactive
      />
    );
  },
);

PixelDivider.displayName = 'PixelDivider';

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});

export default PixelDivider;
