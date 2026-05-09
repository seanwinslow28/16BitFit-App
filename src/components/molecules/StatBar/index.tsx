/**
 * StatBar - Labeled progress bar for stats
 *
 * Displays stat label, current/max value, and progress bar.
 *
 * @example
 * <StatBar
 *   label="Strength"
 *   value={75}
 *   maxValue={100}
 *   color={tokens.colors.button.primary}
 * />
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {PixelText, PixelProgressBar} from '../../atoms';
import {tokens} from '../../../design-system';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

export interface StatBarProps {
  /** Stat label */
  label: string;
  /** Current value */
  value: number;
  /** Maximum value */
  maxValue: number;
  /** Custom color */
  color?: string;
  /** Show value text */
  showValue?: boolean;
  /** Enable animation */
  animated?: boolean;
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const StatBar: React.FC<StatBarProps> = React.memo(
  ({
    label,
    value,
    maxValue,
    color = tokens.colors.button.primary,
    showValue = true,
    animated = true,
  }) => {
    const percentage = Math.min((value / maxValue) * 100, 100);

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <PixelText variant="inputLabel">{label}</PixelText>

          {showValue && (
            <PixelText variant="bodySmall" style={styles.value}>
              {value}/{maxValue}
            </PixelText>
          )}
        </View>

        <PixelProgressBar
          progress={percentage}
          height={20}
          color={color}
          animated={animated}
        />
      </View>
    );
  },
);

StatBar.displayName = 'StatBar';

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  value: {
    fontFamily: 'PressStart2P-Regular',
  },
});

export default StatBar;
