// REWORK-V4: copied from V3 as-is. Rework after design brainstorm + Pokemon-flow decisions land.
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {PixelText} from '../../atoms';
import {colors, spacing} from '../../../design-system';

export interface QuestCartridgeProps {
  title: string;
  description: string;
  reward: string;
  onPress: () => void;
}

export const QuestCartridge: React.FC<QuestCartridgeProps> = ({
  title,
  description,
  reward,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.container}>
      {/* Cartridge Top Label Area */}
      <View style={styles.labelArea}>
        <PixelText variant="caption" style={styles.label}>
          QUEST
        </PixelText>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <PixelText variant="h3" style={styles.title}>
          {title}
        </PixelText>
        <PixelText variant="bodySmall" style={styles.description}>
          {description}
        </PixelText>

        <View style={styles.rewardContainer}>
          <PixelText variant="caption" style={styles.rewardLabel}>
            REWARD:
          </PixelText>
          <PixelText variant="caption" style={styles.rewardValue}>
            {reward}
          </PixelText>
        </View>
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
    backgroundColor: colors.button.primary, // Cartridge gray
    borderWidth: 3,
    borderColor: colors.text.primary,
    borderRadius: 4, // Slight rounding for cartridge shape
    marginBottom: spacing[3],
    overflow: 'hidden',
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
