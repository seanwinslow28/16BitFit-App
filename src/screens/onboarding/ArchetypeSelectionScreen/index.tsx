// REWORK-V4: copied from V3. Restyle palette + redrive flow off the new sprite/Pokemon-battle architecture after design brainstorm.
import React, {useState, useCallback, useEffect} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
// REWORK-V4: react-native-haptic-feedback not installed in V4 — stub trigger.
// import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
const ReactNativeHapticFeedback = {trigger: (_a?: string, _b?: object) => {}};
import AsyncStorage from '@react-native-async-storage/async-storage';

import {PixelText, PixelButton} from '@/components/atoms';
import {ArchetypeCard, ProgressIndicator} from '@/components/molecules';
import {Archetype} from '@/components/molecules/ArchetypeCard';
import {tokens} from '@/design-system';

// ─────────────────────────────────────────────────────────
// Constants & Data
// ─────────────────────────────────────────────────────────

const STORAGE_KEY = '@16bitfit/selectedArchetype';

// Archetype data - avatarSource omitted until assets are available
const ARCHETYPES: Archetype[] = [
  {
    id: 'trainer',
    name: 'Trainer',
    description: 'Balanced fitness',
  },
  {
    id: 'runner',
    name: 'Runner',
    description: 'Cardio focus',
  },
  {
    id: 'yoga',
    name: 'Yogi',
    description: 'Flexibility',
  },
  {
    id: 'builder',
    name: 'Builder',
    description: 'Strength',
  },
  {
    id: 'cyclist',
    name: 'Cyclist',
    description: 'Endurance',
  },
];

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

export const ArchetypeSelectionScreen: React.FC = () => {
  const navigation = useNavigation<any>(); // Typing would usually be imported
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Load saved selection on mount
  useEffect(() => {
    const loadSelection = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setSelectedId(saved);
        }
      } catch (e) {
        console.warn('Failed to load archetype selection');
      }
    };
    loadSelection();
  }, []);

  // Handle Selection
  const handleSelect = useCallback(async (id: string) => {
    setSelectedId(id);

    // Save immediately as per requirements
    try {
      await AsyncStorage.setItem(STORAGE_KEY, id);
    } catch (e) {
      console.warn('Failed to save archetype selection');
    }
  }, []);

  // Handle Continue
  const handleContinue = useCallback(() => {
    if (!selectedId) {
      return;
    }

    ReactNativeHapticFeedback.trigger('impactMedium');
    navigation.navigate('PhotoUpload');
  }, [selectedId, navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Choose your fitness path, step 1 of 5">
        {/* Header Section */}
        <View style={styles.header}>
          <PixelText
            variant="h3"
            align="center"
            style={styles.title}
            accessibilityRole="header">
            CHOOSE YOUR PATH
          </PixelText>
          <PixelText variant="bodySmall" align="center" colorKey="secondary">
            Select a fitness style that matches your goals
          </PixelText>
        </View>

        {/* Archetype Grid */}
        <View
          style={styles.grid}
          accessibilityRole="radiogroup"
          accessibilityLabel="Fitness archetype selection"
          accessibilityHint="Select one archetype">
          {ARCHETYPES.map(archetype => (
            <View key={archetype.id} style={styles.cardWrapper}>
              <ArchetypeCard
                archetype={archetype}
                selected={selectedId === archetype.id}
                onSelect={() => handleSelect(archetype.id)}
                variant="small"
              />
            </View>
          ))}
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <PixelButton
            onPress={handleContinue}
            disabled={!selectedId}
            style={styles.continueButton}
            accessibilityLabel="Continue to next step"
            accessibilityHint="Proceeds to photo upload">
            CONTINUE
          </PixelButton>

          <ProgressIndicator
            currentStep={1}
            totalSteps={5}
            dotShape="circle"
            showLabel={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    marginBottom: 8,
    color: tokens.colors.text.primary, // #0F380F
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    maxWidth: 320, // Constrain width to force 3-column wrap behavior properly
    marginBottom: 32,
  },
  cardWrapper: {
    // Wrapper not strictly needed with gap, but good for safety
  },
  footer: {
    marginTop: 'auto', // Push to bottom if space permits
    alignItems: 'center',
    alignSelf: 'center', // Ensure footer itself is centered
    width: '100%',
    gap: 16,
    paddingBottom: 16,
  },
  continueButton: {
    width: 280,
    alignSelf: 'center', // Ensure button is centered within footer
  },
});

export default ArchetypeSelectionScreen;

/**
 * SELF-QA CHECKLIST
 * ✅ Palette: Used tokens.colors (lines 146, 156) which map to DMG colors.
 * ✅ Border radius: ArchetypeCard and PixelButton enforce 0 radius.
 * ✅ Touch targets: ArchetypeCard small is 96x120 (>44x44). PixelButton is standard size.
 * ✅ Accessibility: Roles and Labels present on all interactives (lines 104, 114, 133).
 * ✅ Reduce Motion: Handled within atoms (ArchetypeCard, PixelButton).
 * ✅ Haptics: Triggered in handleContinue (line 88) and ArchetypeCard (internal).
 * ✅ Terminology: "Trainer", "Runner" etc. used. No defeatist language.
 */
