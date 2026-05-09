/**
 * PixelIcon - Pixel art icons using pure React Native Views
 *
 * Authentic Game Boy-style icons created with positioned Views for pixel-perfect rendering.
 * Supports 10 core icons in 4 sizes.
 *
 * @example
 * <PixelIcon name="check" size={24} color={tokens.colors.button.primary} />
 */

import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {tokens} from '../../../design-system';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

export type IconName =
  | 'arrow-right'
  | 'arrow-left'
  | 'check'
  | 'close'
  | 'error'
  | 'info'
  | 'user'
  | 'heart'
  | 'star'
  | 'settings';

export type IconSize = 16 | 20 | 24 | 32;

export interface PixelIconProps {
  /** Icon name */
  name: IconName;
  /** Icon size in pixels (default: 24) */
  size?: IconSize;
  /** Icon color (default: DMG darkest) */
  color?: string;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
}

// ─────────────────────────────────────────────────────────
// Icon Pixel Data (8x8 grid base, scaled to size)
// ─────────────────────────────────────────────────────────

// Each icon is defined as an 8x8 grid where 1 = filled pixel, 0 = empty
const iconPixelData: Record<IconName, number[][]> = {
  'arrow-right': [
    [0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0],
  ],
  'arrow-left': [
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0],
  ],
  check: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1, 1, 0, 0],
    [0, 1, 0, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  close: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  error: [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 0, 0, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 0, 0, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
  ],
  info: [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
  ],
  user: [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0, 1, 1, 1],
  ],
  heart: [
    [0, 1, 1, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  star: [
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 0, 0, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  settings: [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
  ],
};

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const PixelIcon: React.FC<PixelIconProps> = React.memo(
  ({
    name,
    size = 24,
    color = tokens.colors.text.primary,
    accessibilityLabel,
  }) => {
    const pixelSize = size / 8; // 8x8 grid
    const pixels = iconPixelData[name];

    if (!pixels) {
      console.warn(`[PixelIcon] Unknown icon name: ${name}`);
      return null;
    }

    return (
      <View
        style={[styles.container, {width: size, height: size}]}
        accessible={true}
        accessibilityLabel={accessibilityLabel || `${name} icon`}
        accessibilityRole="image">
        {pixels.map((row, rowIndex) =>
          row.map((pixel, colIndex) => {
            if (pixel === 0) {
              return null;
            }

            const pixelStyle: ViewStyle = {
              position: 'absolute',
              width: pixelSize,
              height: pixelSize,
              backgroundColor: color,
              left: colIndex * pixelSize,
              top: rowIndex * pixelSize,
            };

            return <View key={`${rowIndex}-${colIndex}`} style={pixelStyle} />;
          }),
        )}
      </View>
    );
  },
);

PixelIcon.displayName = 'PixelIcon';

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});

export default PixelIcon;
