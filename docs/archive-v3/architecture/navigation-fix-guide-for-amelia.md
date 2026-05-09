# Navigation Architecture Fix Guide for Amelia

> **Status:** ACTIVE - Phase 0/1 Completion
> **Created:** 2026-01-08
> **Authors:** Winston (Architect) + Gemini 3 Pro Deep Think
> **For:** Amelia (Developer Agent)

---

## Executive Summary

This document provides a complete, step-by-step guide to fix all navigation and architectural issues identified in the 16BitFit V3 mobile app. Follow this guide exactly in the order specified to minimize risk of breaking the app mid-fix.

**Total Issues:** 24
- 2 CRITICAL (runtime crash potential)
- 5 HIGH (navigation failures)
- 17 MEDIUM (route name mismatches)

**Estimated Time:** 2-3 hours

---

## Table of Contents

1. [Pre-Flight Checklist](#1-pre-flight-checklist)
2. [Issue Priority Matrix](#2-issue-priority-matrix)
3. [Step 1: Fix Duplicate HomeScreen Files (CRITICAL)](#step-1-fix-duplicate-homescreen-files-critical)
4. [Step 2: Fix React Hooks Violation (CRITICAL)](#step-2-fix-react-hooks-violation-critical)
5. [Step 3: Fix Navigation Route Names (17 Errors)](#step-3-fix-navigation-route-names-17-errors)
6. [Step 4: Fix Cross-Navigator Navigation](#step-4-fix-cross-navigator-navigation)
7. [Step 5: Fix Missing Route References](#step-5-fix-missing-route-references)
8. [Step 6: Polish Issues](#step-6-polish-issues)
9. [Post-Fix Verification](#post-fix-verification)
10. [Navigation Architecture Reference](#navigation-architecture-reference)

---

## 1. Pre-Flight Checklist

Before starting any fixes, verify your environment:

```bash
cd /Users/seanwinslow/.gemini/antigravity/scratch/16BitFit-V3/apps/mobile-shell

# 1. Check current TypeScript status
npx tsc --noEmit 2>&1 | head -50

# 2. Ensure dependencies are installed
npm install

# 3. Create archive folder for deprecated files
mkdir -p src/screens/_archive

# 4. Verify git status (commit current state)
git status
```

**Important:** Commit your current state before starting fixes so you can revert if needed.

---

## 2. Issue Priority Matrix

| Priority | Issue | File(s) | Risk |
|----------|-------|---------|------|
| **P0** | Duplicate HomeScreen Files | `home/HomeScreen.tsx` vs `home/HomeScreen/` | Navigation may use wrong file |
| **P0** | React Hooks Rules Violation | `TrainingSelectionScreen/index.tsx` | Runtime crash |
| **P1** | 17 Route Name Errors | Multiple screens | "Screen not found" errors |
| **P2** | Cross-Navigator Navigation | SettingsScreen, ProfileAvatarScreen | Features won't work |
| **P2** | Missing Route References | FTUEWorkoutVideoScreen, HomeScreen | Navigation errors |
| **P3** | Hardcoded Colors | HomeScreen/index.tsx | Design system violation |
| **P3** | Progress Step Inconsistency | Onboarding screens | UX confusion |

---

## Step 1: Fix Duplicate HomeScreen Files (CRITICAL)

### Problem

There are TWO HomeScreen files with different implementations:

| File | Export Type | Status |
|------|-------------|--------|
| `src/screens/home/HomeScreen.tsx` | Named: `export const HomeScreen` | OLD - Being used |
| `src/screens/home/HomeScreen/index.tsx` | Default: `export default HomeScreen` | NEW - Orphaned |

The navigation currently imports from the OLD file.

### Solution

#### 1.1 Archive the old file

```bash
# Move old file to archive (don't delete - preserve history)
mv apps/mobile-shell/src/screens/home/HomeScreen.tsx \
   apps/mobile-shell/src/screens/_archive/HomeScreen.tsx.deprecated
```

#### 1.2 Update the import in navigation/index.tsx

**File:** `apps/mobile-shell/src/navigation/index.tsx`

**Line 42 - CHANGE FROM:**
```typescript
import { HomeScreen } from '../screens/home/HomeScreen';
```

**CHANGE TO:**
```typescript
import HomeScreen from '../screens/home/HomeScreen';
```

#### 1.3 Verify

```bash
npx tsc --noEmit
```

Expected: No errors related to HomeScreen imports.

---

## Step 2: Fix React Hooks Violation (CRITICAL)

### Problem

**File:** `apps/mobile-shell/src/screens/workout/TrainingSelectionScreen/index.tsx`

The `renderWorkoutCard` function (lines 98-156) calls `useRef` and `useEffect` inside a render helper function. This violates React's Rules of Hooks because hooks are called in a different order on each render when the `.map()` iterates.

```typescript
// ❌ WRONG - hooks called inside renderWorkoutCard
const renderWorkoutCard = (workout: Workout) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;  // ❌ Hook in helper
  useEffect(() => { /* ... */ }, []);  // ❌ Hook in helper
  // ...
};

{MOCK_WORKOUTS.map(renderWorkoutCard)}  // ❌ Hooks called dynamically
```

### Solution

Extract `WorkoutCard` into a proper React component.

#### 2.1 Create the WorkoutCard component file

**Create file:** `apps/mobile-shell/src/screens/workout/TrainingSelectionScreen/components/WorkoutCard.tsx`

```typescript
/**
 * WorkoutCard - Selectable workout card for TrainingSelectionScreen
 *
 * Extracted to fix React Hooks rules violation.
 */

import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Animated,
  View,
  StyleSheet,
} from 'react-native';

import { tokens, typography, durations, easings } from '@/design-system';
import { PixelText } from '@/components/atoms';
import { useReducedMotion } from '@/hooks';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

export interface Workout {
  id: string;
  title: string;
  type: string;
  duration: number;
  goal: string;
  rewards: {
    xp: number;
  };
}

interface WorkoutCardProps {
  workout: Workout;
  isSelected: boolean;
  onSelect: () => void;
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  isSelected,
  onSelect,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (prefersReducedMotion) return;

    Animated.timing(scaleAnim, {
      toValue: isSelected ? 1.02 : 1,
      duration: durations.fast,
      easing: easings.sharp,
      useNativeDriver: true,
    }).start();
  }, [isSelected, prefersReducedMotion, scaleAnim]);

  const cardStyle = [
    styles.card,
    isSelected ? styles.cardSelected : styles.cardUnselected,
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onSelect}
      accessible={true}
      accessibilityRole="radio"
      accessibilityLabel={`${workout.title}, ${workout.type}, ${workout.duration} minutes. Goal: ${workout.goal}. Reward: ${workout.rewards.xp} XP. ${isSelected ? 'Currently selected.' : 'Not selected.'}`}
      accessibilityState={{ checked: isSelected }}
      accessibilityHint={isSelected ? "Double tap to keep this workout selected" : "Double tap to select this workout"}
    >
      <Animated.View style={[cardStyle, { transform: [{ scale: scaleAnim }] }]}>
        <PixelText
          variant="buttonSecondary"
          style={[styles.workoutTitle, { color: tokens.colors.text.primary }]}
        >
          {workout.title}
        </PixelText>

        <PixelText variant="bodySmall" style={styles.workoutType}>
          {workout.type} • {workout.duration} MIN
        </PixelText>

        <View style={styles.detailsContainer}>
          <PixelText variant="bodySmall" style={styles.detailText}>
            Goal: {workout.goal}
          </PixelText>
          <PixelText variant="bodySmall" style={styles.rewardText}>
            Reward: +{workout.rewards.xp} XP
          </PixelText>
        </View>

        <PixelText variant="caption" style={styles.selectionHint}>
          {isSelected ? '[✓ SELECTED]' : '[TAP TO SELECT]'}
        </PixelText>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    padding: tokens.spacing[3], // 16px
    marginHorizontal: tokens.spacing[4], // 24px
    marginBottom: 12, // Wireframe spec: 12px
    minHeight: tokens.touchTarget.large, // 80dp
    borderRadius: tokens.border.radius, // 0
  },
  cardSelected: {
    backgroundColor: tokens.colors.background.secondary, // #8BAC0F
    borderWidth: tokens.border.width.thick, // 4px
    borderColor: tokens.colors.dmg.darkest, // #0F380F per wireframe
    ...tokens.shadow.medium,
  },
  cardUnselected: {
    backgroundColor: tokens.colors.background.primary, // #9BBC0F
    borderWidth: tokens.border.width.thin, // 2px
    borderColor: tokens.colors.border.default, // #306230
  },
  workoutTitle: {
    marginBottom: tokens.spacing[1], // 4px
    textAlign: 'left',
  },
  workoutType: {
    color: tokens.colors.text.secondary, // #306230
    marginBottom: tokens.spacing[2], // 8px
  },
  detailsContainer: {
    marginBottom: tokens.spacing[2], // 8px
  },
  detailText: {
    color: tokens.colors.text.primary, // #0F380F
    marginBottom: tokens.spacing[1], // 4px
  },
  rewardText: {
    color: tokens.colors.text.primary, // #0F380F
    fontWeight: '600',
  },
  selectionHint: {
    color: tokens.colors.text.secondary, // #306230
    marginTop: tokens.spacing[1], // 4px
  },
});

export default WorkoutCard;
```

#### 2.2 Create barrel export

**Create file:** `apps/mobile-shell/src/screens/workout/TrainingSelectionScreen/components/index.ts`

```typescript
export { WorkoutCard } from './WorkoutCard';
export type { Workout } from './WorkoutCard';
```

#### 2.3 Update TrainingSelectionScreen/index.tsx

**Replace the entire file with:**

```typescript
/**
 * TrainingSelectionScreen - Select from available daily workouts
 *
 * @wireframe docs/wireframes/training-selection-screen.md
 * @story 1.7
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { tokens, typography } from '@/design-system';
import { PixelText, PixelButton } from '@/components/atoms';
import { useReducedMotion } from '@/hooks';

// Local components
import { WorkoutCard, Workout } from './components';

// ─────────────────────────────────────────────────────────
// Mock Data (Simulating Supabase Response)
// ─────────────────────────────────────────────────────────

const MOCK_WORKOUTS: Workout[] = [
  {
    id: 'morning_jog',
    title: 'MORNING JOG',
    type: 'CARDIO',
    duration: 30,
    goal: '3,000 steps',
    rewards: { xp: 100 },
  },
  {
    id: 'sprint_intervals',
    title: 'SPRINT INTERVALS',
    type: 'CARDIO',
    duration: 20,
    goal: '2,000 steps',
    rewards: { xp: 80 },
  },
  {
    id: 'long_run',
    title: 'LONG RUN',
    type: 'CARDIO',
    duration: 60,
    goal: '6,000 steps',
    rewards: { xp: 150 },
  },
];

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

const TrainingSelectionScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const prefersReducedMotion = useReducedMotion();
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

  // ─── Selection Logic ───

  const handleSelectWorkout = useCallback((id: string) => {
    if (selectedWorkoutId !== id) {
      setSelectedWorkoutId(id);
      ReactNativeHapticFeedback.trigger('impactLight');
    }
  }, [selectedWorkoutId]);

  const handleConfirm = useCallback(() => {
    if (!selectedWorkoutId) return;

    ReactNativeHapticFeedback.trigger('impactMedium');
    // Navigate back to Home (dismiss modal)
    navigation.getParent()?.goBack();
  }, [selectedWorkoutId, navigation]);

  // ─── Render ───

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <PixelText variant="h3" style={styles.headerTitle}>
          CHOOSE WORKOUT
        </PixelText>
        <PixelText variant="bodySmall" style={styles.headerDate}>
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </PixelText>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_WORKOUTS.map(workout => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            isSelected={selectedWorkoutId === workout.id}
            onSelect={() => handleSelectWorkout(workout.id)}
          />
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <PixelButton
          onPress={handleConfirm}
          disabled={!selectedWorkoutId}
          style={styles.confirmButton}
          accessibilityLabel="Confirm selected workout"
          accessibilityHint="Double tap to start your selected workout"
        >
          CONFIRM WORKOUT
        </PixelButton>
      </View>
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background.primary, // #9BBC0F
  },
  header: {
    backgroundColor: tokens.colors.background.primary, // #9BBC0F
    borderBottomWidth: tokens.border.width.thin, // 2px
    borderBottomColor: tokens.colors.border.default, // #306230
    paddingVertical: tokens.spacing[3], // 16px
    paddingHorizontal: tokens.spacing[4], // 24px
    marginBottom: tokens.spacing[3], // 16px
    alignItems: 'center',
  },
  headerTitle: {
    color: tokens.colors.text.primary, // #0F380F
    textAlign: 'center',
    marginBottom: tokens.spacing[1], // 4px
  },
  headerDate: {
    color: tokens.colors.text.secondary, // #306230
    textAlign: 'center',
    fontFamily: typography.fonts.body, // Montserrat
  },
  scrollContent: {
    paddingBottom: tokens.spacing[4], // 24px
  },
  footer: {
    paddingHorizontal: tokens.spacing[4], // 24px
    paddingBottom: tokens.spacing[4], // 24px
    backgroundColor: tokens.colors.background.primary, // #9BBC0F
  },
  confirmButton: {
    width: '100%',
  },
});

export default TrainingSelectionScreen;
```

#### 2.4 Verify

```bash
npx tsc --noEmit
npm run lint  # Should pass React Hooks rules
```

---

## Step 3: Fix Navigation Route Names (17 Errors)

### The Problem

Screens use `'RouteNameScreen'` but routes are defined as `'RouteName'` (no suffix).

### Route Name Reference Table

| Navigator | Route Name | Component | Params |
|-----------|------------|-----------|--------|
| **Onboarding** | `Welcome` | WelcomeScreen | `undefined` |
| | `ArchetypeSelection` | ArchetypeSelectionScreen | `undefined` |
| | `PhotoUpload` | PhotoUploadScreen | `{ regenerating?: boolean }` |
| | `AvatarBootSequence` | AvatarBootSequenceScreen | `{ selfieUri: string }` |
| | `AvatarDraftPick` | AvatarDraftPickScreen | `{ variants: AvatarVariant[] }` |
| | `TutorialWorkoutAssignment` | TutorialWorkoutAssignmentScreen | `undefined` |
| | `FTUEWorkoutVideo` | FTUEWorkoutVideoScreen | `undefined` |
| | `HealthConnectPermission` | HealthConnectPermissionScreen | `undefined` |
| **MainTab** | `Home` | HomeScreen | `undefined` |
| | `Profile` | ProfileAvatarScreen | `undefined` |
| | `Settings` | SettingsScreen | `undefined` |
| | `Diagnostics` | DiagnosticScreen | `undefined` |
| **RootStack** | `Tabs` | MainTabNavigator | nested |
| | `Workout` | WorkoutNavigator | nested |
| | `StatsPanel` | StatsPanelScreen | `undefined` |
| **Workout** | `DailyWorkoutAssignment` | DailyWorkoutAssignmentScreen | `undefined` |
| | `TrainingSelection` | TrainingSelectionScreen | `undefined` |
| | `WorkoutTracker` | WorkoutTrackerScreen | `{ workoutType: string }` |

### Fix Each File

#### 3.1 FTUEWorkoutVideoScreen/index.tsx

**Lines 119 and 130 - CHANGE FROM:**
```typescript
navigation.navigate('BattleModeTransitionVideo');
```

**CHANGE TO:**
```typescript
navigation.navigate('HealthConnectPermission');
```

#### 3.2 HomeScreen/index.tsx (the NEW one in HomeScreen/)

**Line 70 - CHANGE FROM:**
```typescript
navigation.navigate('ProfileAvatarScreen');
```
**CHANGE TO:**
```typescript
navigation.navigate('Profile');
```

**Line 83 - CHANGE FROM:**
```typescript
navigation.navigate('WorkoutAssignmentScreen');
```
**CHANGE TO:**
```typescript
navigation.navigate('Workout');
```

**Line 88 - CHANGE FROM:**
```typescript
navigation.navigate('TrainingSelectionScreen');
```
**CHANGE TO:**
```typescript
navigation.navigate('Workout');
```

**Line 95 - CHANGE FROM:**
```typescript
navigation.navigate('BattleModeTransitionVideo');
```
**CHANGE TO (Phase 3 not implemented):**
```typescript
// TODO: Phase 3 - Battle Mode not yet implemented
console.log('Battle Mode coming soon!');
// Show toast or alert
```

**Line 97 - CHANGE FROM:**
```typescript
navigation.navigate('ProfileAvatarScreen');
```
**CHANGE TO:**
```typescript
navigation.navigate('Profile');
```

**Line 99 - CHANGE FROM:**
```typescript
navigation.navigate('SettingsScreen');
```
**CHANGE TO:**
```typescript
navigation.navigate('Settings');
```

#### 3.3 SettingsScreen/index.tsx

**Line 85 - Comment out or disable:**
```typescript
// TODO: Cross-navigator navigation not supported
// navigation.navigate('TutorialWorkoutAssignmentScreen', { isReplay: true });
console.log('Replay Tutorial feature coming soon');
```

**Line 90 - Comment out or disable:**
```typescript
// TODO: Cross-navigator navigation not supported
// navigation.navigate('HealthConnectPermissionScreen');
console.log('Reconnect Health feature coming soon');
```

#### 3.4 ProfileAvatarScreen/index.tsx

**Line 79 - CHANGE FROM:**
```typescript
navigation.navigate('PhotoUploadScreen');
```
**CHANGE TO:**
```typescript
// TODO: Re-upload photo flow needs separate Main App route
console.log('Re-upload avatar feature coming soon');
```

#### 3.5 WorkoutTrackerScreen/index.tsx

**Line 71 - CHANGE FROM:**
```typescript
navigation.navigate('WorkoutCompleteCeremonyScreen', { ... });
```
**CHANGE TO (Phase 2 not implemented):**
```typescript
// TODO: Phase 2 - WorkoutCompleteCeremony not yet implemented
// Navigate back to Home for now
navigation.getParent()?.navigate('Tabs');
```

#### 3.6 Verify After Each File

```bash
npx tsc --noEmit
```

---

## Step 4: Fix Cross-Navigator Navigation

### Problem

SettingsScreen and ProfileAvatarScreen try to navigate to routes that only exist in OnboardingNavigator. This is architecturally invalid.

### Solution

For MVP, disable these features with user-friendly messaging.

#### 4.1 Update SettingsScreen confirmReplay handler

**File:** `apps/mobile-shell/src/screens/settings/SettingsScreen/index.tsx`

**Replace confirmReplay function:**
```typescript
const confirmReplay = useCallback(() => {
  ReactNativeHapticFeedback.trigger('impactMedium');
  setShowReplayModal(false);
  // TODO: Implement replay tutorial - requires navigation architecture update
  // For MVP, show coming soon message
  Alert.alert(
    'Coming Soon',
    'Replay Tutorial will be available in a future update.',
    [{ text: 'OK' }]
  );
}, []);
```

**Add import at top:**
```typescript
import { Alert } from 'react-native';
```

#### 4.2 Update SettingsScreen handleReconnectHealth handler

```typescript
const handleReconnectHealth = useCallback(() => {
  ReactNativeHapticFeedback.trigger('impactLight');
  // TODO: Implement health reconnection flow
  Alert.alert(
    'Coming Soon',
    'Health reconnection will be available in a future update.',
    [{ text: 'OK' }]
  );
}, []);
```

#### 4.3 Update ProfileAvatarScreen handleUpdateAvatar handler

**File:** `apps/mobile-shell/src/screens/profile/ProfileAvatarScreen/index.tsx`

```typescript
const handleUpdateAvatar = useCallback(() => {
  ReactNativeHapticFeedback.trigger('impactMedium');
  // TODO: Implement avatar re-upload flow in Main App
  Alert.alert(
    'Coming Soon',
    'Avatar updates will be available in a future update.',
    [{ text: 'OK' }]
  );
}, []);
```

**Add import at top:**
```typescript
import { Alert } from 'react-native';
```

---

## Step 5: Fix Missing Route References

### Problem

Multiple screens reference routes that don't exist yet (Phase 2/3 features).

### Solution

Replace with appropriate fallbacks.

#### 5.1 FTUEWorkoutVideoScreen - Already fixed in Step 3.1

Changed `BattleModeTransitionVideo` → `HealthConnectPermission`

#### 5.2 HomeScreen Battle Mode - Already addressed in Step 3.2

Added console.log placeholder for Phase 3.

---

## Step 6: Polish Issues

### 6.1 Add Hardware Palette to Design Tokens

**File:** `apps/mobile-shell/src/design-system/tokens.ts`

**Add to colors object:**
```typescript
export const colors = {
  // ... existing dmg colors ...

  // Hardware Shell (outside LCD area)
  hardware: {
    shellBody: '#D7D5CA',
    bezel: '#9A9A9A',
    text: '#1C1C1C',
    shadow: '#6D6D6D',
  },
};
```

#### 6.2 Update HomeScreen to use hardware tokens

**File:** `apps/mobile-shell/src/screens/home/HomeScreen/index.tsx`

**Replace hardcoded colors in styles:**
```typescript
hardwareRibbon: {
  backgroundColor: tokens.colors.hardware.shellBody,
  // ...
  borderTopColor: tokens.colors.hardware.bezel,
},
hardwareText: {
  // ...
  color: tokens.colors.hardware.text,
},
```

---

## Post-Fix Verification

### Verification Checklist

Run these commands after completing ALL fixes:

```bash
cd /Users/seanwinslow/.gemini/antigravity/scratch/16BitFit-V3/apps/mobile-shell

# 1. TypeScript compilation (MUST pass with 0 errors)
npx tsc --noEmit

# 2. Lint check
npm run lint

# 3. Run tests
npm test

# 4. Start Metro and test in simulator
npm start
# In another terminal:
npm run ios
```

### Manual Testing Flow

Test the complete user flow:

1. **Onboarding Flow:**
   - [ ] Welcome → Tap START → ArchetypeSelection
   - [ ] ArchetypeSelection → Select archetype → Tap CONTINUE → PhotoUpload
   - [ ] PhotoUpload → Tap GENERATE or SKIP → AvatarBootSequence (or TutorialWorkoutAssignment if skipped)
   - [ ] AvatarBootSequence → Wait for completion → AvatarDraftPick
   - [ ] AvatarDraftPick → Select variant → TutorialWorkoutAssignment
   - [ ] TutorialWorkoutAssignment → Tap START → FTUEWorkoutVideo
   - [ ] FTUEWorkoutVideo → Wait or tap SKIP → HealthConnectPermission
   - [ ] HealthConnectPermission → Tap either button → Home (Main App)

2. **Main App Navigation:**
   - [ ] Home tab is visible
   - [ ] Tap Profile → Profile tab
   - [ ] Tap Settings → Settings tab
   - [ ] Tap Home → Home tab

3. **Workout Flow:**
   - [ ] Home → Tap Training Cartridge → DailyWorkoutAssignment (modal)
   - [ ] Tap workout → TrainingSelection
   - [ ] Select workout → Tap CONFIRM → Back to Home

4. **Disabled Features (should show alerts):**
   - [ ] Settings → Replay Tutorial → "Coming Soon" alert
   - [ ] Settings → Reconnect Health → "Coming Soon" alert
   - [ ] Profile → Update Avatar → "Coming Soon" alert

---

## Navigation Architecture Reference

### Navigator Hierarchy

```
ROOT NAVIGATOR (State Switch)
├── isLoading → Splash Screen
├── !isOnboardingCompleted → OnboardingNavigator (Stack)
│   ├── Welcome
│   ├── ArchetypeSelection
│   ├── PhotoUpload
│   ├── AvatarBootSequence
│   ├── AvatarDraftPick
│   ├── TutorialWorkoutAssignment
│   ├── FTUEWorkoutVideo
│   └── HealthConnectPermission
│
└── isOnboardingCompleted → MainAppNavigator (Stack)
    ├── Tabs (MainTabNavigator)
    │   ├── Home
    │   ├── Profile
    │   ├── Settings
    │   └── Diagnostics
    │
    ├── Workout (WorkoutNavigator - Modal)
    │   ├── DailyWorkoutAssignment
    │   ├── TrainingSelection
    │   └── WorkoutTracker
    │
    └── StatsPanel (transparentModal)
```

### Navigation Patterns

**Pattern 1: Same Navigator**
```typescript
// Within OnboardingNavigator
navigation.navigate('PhotoUpload');
```

**Pattern 2: Tab Switch**
```typescript
// Within MainTabNavigator
navigation.navigate('Profile');
```

**Pattern 3: Open Modal Stack**
```typescript
// From Tab to Modal Stack
navigation.navigate('Workout');
```

**Pattern 4: Dismiss Modal**
```typescript
// From within WorkoutNavigator
navigation.getParent()?.goBack();
```

**Pattern 5: Complete Onboarding (State Switch)**
```typescript
// From HealthConnectPermissionScreen
import { markOnboardingComplete } from '@/navigation';
await markOnboardingComplete();
// Navigator automatically switches to MainAppNavigator
```

---

## Files to Archive (Deprecated)

Move these to `src/screens/_archive/`:

```bash
# Execute from apps/mobile-shell directory
mkdir -p src/screens/_archive

# Old HomeScreen (uses named export, different implementation)
mv src/screens/home/HomeScreen.tsx src/screens/_archive/HomeScreen.tsx.deprecated

# Old single-file onboarding screens (if any exist)
# Check git status for deleted files mentioned in status
```

---

## Summary

After completing all steps:

1. **Critical Issues Fixed:** 2
   - Duplicate HomeScreen files resolved
   - React Hooks violation fixed

2. **Navigation Errors Fixed:** 17+
   - All route names corrected
   - Cross-navigator navigation disabled with user-friendly alerts
   - Missing routes handled with fallbacks

3. **Polish Applied:** 2
   - Hardware palette added to design tokens
   - HomeScreen updated to use tokens

4. **Files Archived:** 1
   - Old HomeScreen.tsx moved to _archive

---

## Questions?

If you encounter issues not covered in this guide, consult:

1. **Navigation Docs:** `docs/architecture/navigation-architecture.md` (create if needed)
2. **Design System:** `docs/design-system/design-tokens-LCD.md`
3. **Multi-Model Strategy:** `docs/plans/multi-model-ux-ui-execution-strategy.md`

Or escalate to Winston (Architect) for architectural decisions.

---

**Document Version:** 1.0
**Created By:** Winston (Architect) + Gemini 3 Pro Deep Think
**For:** Amelia (Developer Agent)
**Date:** 2026-01-08
