// REWORK-V4: copied from V3 as-is. Rework after design brainstorm + Pokemon-flow decisions land.
/**
 * ProfileHeader - User avatar and metadata display
 *
 * Shows user avatar, username, display name, and optional metadata.
 *
 * @example
 * <ProfileHeader
 *   avatarSource={avatarUrl}
 *   username="@fittrainer"
 *   displayName="Fit Trainer"
 *   meta="Level 5 • 150 workouts"
 * />
 */

import React from 'react';
import {View, StyleSheet, ImageSourcePropType} from 'react-native';
import {PixelSprite, PixelText} from '../../atoms';
import {tokens} from '../../../design-system';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

export interface ProfileHeaderProps {
  /** Avatar image source */
  avatarSource: ImageSourcePropType;
  /** Username */
  username: string;
  /** Optional display name */
  displayName?: string;
  /** Optional metadata text */
  meta?: string;
  /** Avatar size variant */
  size?: 'small' | 'medium' | 'large';
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const ProfileHeader: React.FC<ProfileHeaderProps> = React.memo(
  ({avatarSource, username, displayName, meta, size = 'medium'}) => {
    const avatarSize = size === 'small' ? 32 : size === 'large' ? 80 : 64;

    return (
      <View style={styles.container}>
        <PixelSprite source={avatarSource} size={avatarSize} alt={username} />

        <View style={styles.info}>
          <PixelText variant="h3" style={styles.username}>
            {username}
          </PixelText>

          {displayName && (
            <PixelText variant="bodySmall" colorKey="secondary">
              {displayName}
            </PixelText>
          )}

          {meta && (
            <PixelText variant="caption" colorKey="muted">
              {meta}
            </PixelText>
          )}
        </View>
      </View>
    );
  },
);

ProfileHeader.displayName = 'ProfileHeader';

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
    borderWidth: 3,
    borderRadius: 0,
    borderColor: tokens.colors.border.default,
    backgroundColor: tokens.colors.background.elevated,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  username: {
    marginBottom: 0,
  },
});

export default ProfileHeader;
