// REWORK-V4: copied from V3 as-is. Rework after design brainstorm + Pokemon-flow decisions land.
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {PixelText} from '../../atoms';
import {colors, spacing} from '../../../design-system';

export interface TrainingCartridgeProps {
  title: string;
  subtitle?: string;
  description?: string;
  reward?: string;
  onPress: () => void;
  active?: boolean;
}

export const TrainingCartridge: React.FC<TrainingCartridgeProps> = ({
  title,
  subtitle,
  description,
  reward,
  onPress,
  active = true,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.container, !active && styles.containerInactive]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle || description || ''}`}
      accessibilityHint="Double tap to start training">
      {/* Cartridge Top Label Area */}
      <View style={styles.labelArea}>
        <PixelText variant="caption" style={styles.label}>
          TRAINING
        </PixelText>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <PixelText variant="h3" style={styles.title}>
          {title}
        </PixelText>
        {(subtitle || description) && (
          <PixelText variant="bodySmall" style={styles.description}>
            {subtitle || description}
          </PixelText>
        )}

        {reward && (
          <View style={styles.rewardContainer}>
            <PixelText variant="caption" style={styles.rewardLabel}>
              REWARD:
            </PixelText>
            <PixelText variant="caption" style={styles.rewardValue}>
              {reward}
            </PixelText>
          </View>
        )}
      </View>

      {/* Cartridge Grip Lines */}
      <View style={styles.gripLines}>
        <View style={styles.line} />
        <View style={styles.line} />
        <View style={styles.line} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.button.primary, // Cartridge body
    borderWidth: 3,
    borderColor: colors.text.primary,
    borderRadius: 0, // DMG RULE: Zero radius everywhere
    marginBottom: spacing[3],
    marginHorizontal: spacing[3],
    overflow: 'hidden',
  },
  containerInactive: {
    opacity: 0.6,
  },
  labelArea: {
    backgroundColor: colors.text.secondary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: colors.text.primary,
  },
  label: {
    color: colors.background.primary,
    fontSize: 8,
  },
  content: {
    padding: spacing[2],
  },
  title: {
    color: colors.text.primary,
    marginBottom: 4,
  },
  description: {
    color: colors.text.primary,
    marginBottom: 8,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardLabel: {
    color: colors.text.secondary,
    marginRight: 4,
  },
  rewardValue: {
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  gripLines: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 4,
    backgroundColor: colors.button.primary,
  },
  line: {
    width: 2,
    height: 10,
    backgroundColor: colors.text.secondary,
    marginHorizontal: 2,
  },
});
