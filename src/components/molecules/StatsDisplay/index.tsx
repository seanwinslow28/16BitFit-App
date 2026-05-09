import React from 'react';
import {View, StyleSheet} from 'react-native';
import {PixelText} from '../../atoms';
import {colors, spacing} from '../../../design-system';

export interface StatsDisplayProps {
  level: number;
  exp: number;
  nextLevelExp: number;
  steps: number;
  calories: number;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({
  level,
  exp,
  nextLevelExp,
  steps,
  calories,
}) => {
  return (
    <View style={styles.container}>
      {/* Level and EXP */}
      <View style={styles.row}>
        <PixelText variant="caption" style={styles.label}>
          LVL {level}
        </PixelText>
        <PixelText variant="caption" style={styles.value}>
          {exp}/{nextLevelExp} XP
        </PixelText>
      </View>

      {/* Steps and Calories */}
      <View style={styles.row}>
        <View style={styles.statItem}>
          <PixelText variant="caption" style={styles.label}>
            STEPS
          </PixelText>
          <PixelText variant="bodySmall" style={styles.value}>
            {steps}
          </PixelText>
        </View>
        <View style={styles.statItem}>
          <PixelText variant="caption" style={styles.label}>
            CALS
          </PixelText>
          <PixelText variant="bodySmall" style={styles.value}>
            {calories}
          </PixelText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing[2],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[1],
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  label: {
    color: colors.text.primary,
    marginRight: 4,
  },
  value: {
    color: colors.text.primary,
    fontWeight: 'bold',
  },
});
