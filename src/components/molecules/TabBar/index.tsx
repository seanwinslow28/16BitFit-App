import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {PixelText} from '../../atoms';
import {colors, spacing} from '../../../design-system';

export interface TabBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({activeTab, onTabPress}) => {
  const tabs = [
    {key: 'Home', label: 'HOME'},
    {key: 'Workouts', label: 'WORK'},
    {key: 'Social', label: 'SOC'},
    {key: 'Profile', label: 'PROF'},
  ];

  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            style={[styles.tab, isActive && styles.tabActive]}>
            <PixelText
              variant="caption"
              style={[styles.label, isActive ? styles.labelActive : undefined]}>
              {tab.label}
            </PixelText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing[2],
    backgroundColor: colors.text.secondary,
    borderRadius: 8,
    marginTop: spacing[2],
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  tabActive: {
    backgroundColor: colors.background.primary,
  },
  label: {
    color: colors.background.primary,
  },
  labelActive: {
    color: colors.text.primary,
  },
});
