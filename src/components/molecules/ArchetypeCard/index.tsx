// REWORK-V4: copied from V3 as-is. Rework after design brainstorm + Pokemon-flow decisions land.
/**
 * ArchetypeCard - Selectable fitness archetype card
 *
 * Card component for selecting fitness archetype during onboarding (Story 1.4).
 * Features selection animation with scale and glow effects.
 *
 * @example
 * <ArchetypeCard
 *   archetype={archetypeData}
 *   selected={isSelected}
 *   onSelect={() => handleSelect(archetype.id)}
 * />
 */

import React, {useEffect, useRef} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
  ImageSourcePropType,
  ViewStyle,
} from 'react-native';
// REWORK-V4: react-native-haptic-feedback not yet installed in V4 — stub trigger.
// import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
const ReactNativeHapticFeedback = {trigger: (_type: string) => {}};
import {PixelSprite, PixelText} from '../../atoms';
import {tokens, durations} from '../../../design-system';

// ─────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────

export interface Archetype {
  id: string;
  name: string;
  description: string;
  avatarSource?: ImageSourcePropType;
}

export interface ArchetypeCardProps {
  /** Archetype data */
  archetype: Archetype;
  /** Whether this card is selected */
  selected: boolean;
  /** Callback when card is selected */
  onSelect: () => void;
  /** Whether the card is disabled */
  disabled?: boolean;
  /** Card size variant (default: 'default') */
  variant?: 'default' | 'small';
  /** Optional container style override */
  style?: ViewStyle;
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const ArchetypeCard: React.FC<ArchetypeCardProps> = React.memo(
  ({
    archetype,
    selected,
    onSelect,
    disabled = false,
    variant = 'default',
    style,
  }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const borderWidthAnim = useRef(new Animated.Value(3)).current;
    const isSmall = variant === 'small';

    // Animate selection state
    useEffect(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: selected ? 1.05 : 1,
          damping: 12,
          stiffness: 150,
          useNativeDriver: true,
        }),
        Animated.timing(borderWidthAnim, {
          toValue: selected ? 4 : 3,
          duration: durations.fast, // 150ms
          useNativeDriver: false, // borderWidth doesn't support native driver
        }),
      ]).start();
    }, [selected, scaleAnim, borderWidthAnim]);

    const handlePress = () => {
      if (disabled) {
        return;
      }
      ReactNativeHapticFeedback.trigger('impactMedium');
      onSelect();
    };

    // Note: borderWidth animation requires non-native driver, so we use
    // a simpler approach - just change the style
    const containerStyle = [
      styles.container,
      isSmall && styles.containerSmall,
      selected && styles.selected,
      disabled && styles.disabled,
      style,
    ];

    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.9}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Select ${archetype.name} archetype`}
        accessibilityHint={archetype.description}
        accessibilityState={{selected, disabled}}>
        <Animated.View
          style={[
            containerStyle,
            {
              transform: [{scale: scaleAnim}],
            },
          ]}>
          {/* Avatar - show placeholder if no source available */}
          {archetype.avatarSource ? (
            <PixelSprite
              source={archetype.avatarSource}
              size={isSmall ? 32 : 80}
              alt={archetype.name}
            />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                isSmall && styles.avatarPlaceholderSmall,
              ]}>
              <PixelText
                variant="caption"
                align="center"
                style={styles.avatarPlaceholderText}>
                {archetype.name.substring(0, 2).toUpperCase()}
              </PixelText>
            </View>
          )}

          {/* Name */}
          <PixelText
            variant={isSmall ? 'caption' : 'h3'}
            style={[styles.name, isSmall && styles.nameSmall]}
            numberOfLines={1}>
            {archetype.name.toUpperCase()}
          </PixelText>

          {/* Description */}
          <PixelText
            variant="bodySmall"
            colorKey="secondary"
            style={isSmall ? styles.descriptionSmall : undefined}
            numberOfLines={2}>
            {archetype.description}
          </PixelText>
        </Animated.View>
      </TouchableOpacity>
    );
  },
);

ArchetypeCard.displayName = 'ArchetypeCard';

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: 160,
    minHeight: 200,
    padding: 16,
    borderWidth: 3,
    borderRadius: 0,
    borderColor: tokens.colors.border.default,
    backgroundColor: tokens.colors.background.elevated,
    alignItems: 'center',
    gap: 12,
  },
  containerSmall: {
    width: 96,
    minHeight: 120,
    padding: 8,
    gap: 4,
  },
  selected: {
    borderWidth: 4,
    borderColor: tokens.colors.border.highlight,
    shadowOffset: {width: 0, height: 0},
    shadowColor: tokens.colors.border.highlight,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  avatar: {
    marginBottom: 8,
  },
  name: {
    marginBottom: 4,
    textAlign: 'center',
  },
  nameSmall: {
    fontSize: 10,
    marginBottom: 2,
  },
  description: {
    flex: 1,
    textAlign: 'center',
  },
  descriptionSmall: {
    fontSize: 9,
    lineHeight: 11,
    textAlign: 'center',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: tokens.colors.border.default,
    backgroundColor: tokens.colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderSmall: {
    width: 32,
    height: 32,
  },
  avatarPlaceholderText: {
    color: tokens.colors.text.secondary,
    fontSize: 12,
  },
});

export default ArchetypeCard;
