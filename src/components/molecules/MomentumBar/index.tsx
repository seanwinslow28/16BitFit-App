import React from 'react';
import {View, StyleSheet} from 'react-native';
import {PixelText} from '../../atoms';
import {colors, spacing} from '../../../design-system';

export interface MomentumBarProps {
  days: number;
  progress?: number;
}

export const MomentumBar: React.FC<MomentumBarProps> = ({
  days,
  progress = 0,
}) => {
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <PixelText variant="caption" style={styles.label}>
          MOMENTUM
        </PixelText>
        <PixelText variant="h3" style={styles.count}>
          {days} DAYS
        </PixelText>
      </View>

      <View style={styles.daysContainer}>
        {dayLabels.map((day, index) => {
          // Placeholder logic for active days
          const isActive = index < days % 8;

          return (
            <View key={index} style={styles.dayBox}>
              <View style={[styles.pixel, isActive && styles.pixelActive]} />
              <PixelText variant="caption" style={styles.dayText}>
                {day}
              </PixelText>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing[2],
    backgroundColor: colors.background.primary,
    borderWidth: 2,
    borderColor: colors.text.secondary,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  label: {
    color: colors.text.secondary,
  },
  count: {
    color: colors.text.primary,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayBox: {
    alignItems: 'center',
  },
  pixel: {
    width: 12,
    height: 12,
    backgroundColor: colors.button.primary,
    marginBottom: 4,
  },
  pixelActive: {
    backgroundColor: colors.text.primary,
  },
  dayText: {
    fontSize: 8,
    color: colors.text.secondary,
  },
});
