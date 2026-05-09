// REWORK-V4: copied from V3 as-is. Rework after design brainstorm + Pokemon-flow decisions land.
import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {PixelText} from '../../atoms';
import {colors, spacing, typography} from '../../../design-system';

export interface HomeAvatarProps {
  avatarUrl: string | null;
  evolutionStage: number | string | null; // Handle both number and enum string
  username: string;
}

export const HomeAvatar: React.FC<HomeAvatarProps> = ({
  avatarUrl,
  evolutionStage,
  username,
}) => {
  // Parse evolution stage to display "LV X"
  const getLevel = (stage: number | string | null) => {
    if (!stage) {
      return 1;
    }
    if (typeof stage === 'number') {
      return stage;
    }
    if (stage === 'stage_1') {
      return 1;
    }
    if (stage === 'stage_2') {
      return 2;
    }
    if (stage === 'stage_3') {
      return 3;
    }
    return 1;
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image source={{uri: avatarUrl}} style={styles.avatarImage} />
        ) : (
          <View style={styles.placeholderAvatar} />
        )}
        <View style={styles.badge}>
          <PixelText variant="caption" style={styles.badgeText}>
            LV {getLevel(evolutionStage)}
          </PixelText>
        </View>
      </View>
      <PixelText variant="bodySmall" style={styles.username}>
        {username}
      </PixelText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderWidth: 3,
    borderColor: colors.text.secondary,
    backgroundColor: colors.background.primary,
    position: 'relative',
    marginBottom: spacing[2],
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  placeholderAvatar: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.button.primary,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.button.primary,
    borderWidth: 2,
    borderColor: colors.text.primary,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    color: colors.text.primary,
  },
  username: {
    fontFamily: typography.fonts.heading,
    fontSize: 14,
    color: colors.text.primary,
  },
});
