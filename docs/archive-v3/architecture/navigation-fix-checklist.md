# Navigation Fix Checklist for Amelia

> **Quick Reference:** Use this checklist to track progress through the fixes.
> **Full Guide:** See `navigation-fix-guide-for-amelia.md` for detailed instructions.

---

## Pre-Flight

- [ ] Run `npx tsc --noEmit` to see current state
- [ ] Run `git status` to verify clean working directory
- [ ] Create archive folder: `mkdir -p src/screens/_archive`

---

## Step 1: Fix Duplicate HomeScreen (CRITICAL)

- [ ] Archive old file:
  ```bash
  mv src/screens/home/HomeScreen.tsx src/screens/_archive/HomeScreen.tsx.deprecated
  ```

- [ ] Update import in `navigation/index.tsx` line 42:
  ```typescript
  // FROM:
  import { HomeScreen } from '../screens/home/HomeScreen';
  // TO:
  import HomeScreen from '../screens/home/HomeScreen';
  ```

- [ ] Verify: `npx tsc --noEmit`

---

## Step 2: Fix Hooks Violation (CRITICAL)

- [ ] Create folder: `src/screens/workout/TrainingSelectionScreen/components/`

- [ ] Create `WorkoutCard.tsx` (see full guide for code)

- [ ] Create `index.ts` barrel export

- [ ] Replace `TrainingSelectionScreen/index.tsx` (see full guide for code)

- [ ] Verify: `npx tsc --noEmit`

---

## Step 3: Fix Route Names

### 3.1 FTUEWorkoutVideoScreen/index.tsx
- [ ] Line 119: `'BattleModeTransitionVideo'` → `'HealthConnectPermission'`
- [ ] Line 130: `'BattleModeTransitionVideo'` → `'HealthConnectPermission'`

### 3.2 HomeScreen/index.tsx (NEW one in HomeScreen/)
- [ ] Line 70: `'ProfileAvatarScreen'` → `'Profile'`
- [ ] Line 83: `'WorkoutAssignmentScreen'` → `'Workout'`
- [ ] Line 88: `'TrainingSelectionScreen'` → `'Workout'`
- [ ] Line 95: Comment out (Phase 3)
- [ ] Line 97: `'ProfileAvatarScreen'` → `'Profile'`
- [ ] Line 99: `'SettingsScreen'` → `'Settings'`

### 3.3 SettingsScreen/index.tsx
- [ ] Line 85: Comment out (cross-navigator)
- [ ] Line 90: Comment out (cross-navigator)

### 3.4 ProfileAvatarScreen/index.tsx
- [ ] Line 79: Comment out (cross-navigator)

### 3.5 WorkoutTrackerScreen/index.tsx
- [ ] Line 71: Replace with `navigation.getParent()?.navigate('Tabs');`

- [ ] Verify after each file: `npx tsc --noEmit`

---

## Step 4: Add Alerts for Disabled Features

### SettingsScreen/index.tsx
- [ ] Add `import { Alert } from 'react-native';`
- [ ] Update `confirmReplay` to show Alert
- [ ] Update `handleReconnectHealth` to show Alert

### ProfileAvatarScreen/index.tsx
- [ ] Add `import { Alert } from 'react-native';`
- [ ] Update `handleUpdateAvatar` to show Alert

---

## Step 5: Polish (Optional)

- [ ] Add `hardware` palette to `design-system/tokens.ts`
- [ ] Update HomeScreen to use `tokens.colors.hardware.*`

---

## Post-Fix Verification

- [ ] `npx tsc --noEmit` - **0 errors**
- [ ] `npm run lint` - **passes**
- [ ] `npm test` - **passes**
- [ ] `npm run ios` - **app launches**

### Manual Flow Test

- [ ] Complete onboarding: Welcome → ... → HealthConnectPermission → Home
- [ ] Navigate between tabs: Home ↔ Profile ↔ Settings
- [ ] Open workout flow: Home → Cartridge → DailyWorkoutAssignment
- [ ] Verify alerts show for disabled features

---

## Files Changed Summary

| File | Action |
|------|--------|
| `src/screens/home/HomeScreen.tsx` | ARCHIVED |
| `src/navigation/index.tsx` | Import fixed |
| `src/screens/workout/TrainingSelectionScreen/components/WorkoutCard.tsx` | CREATED |
| `src/screens/workout/TrainingSelectionScreen/components/index.ts` | CREATED |
| `src/screens/workout/TrainingSelectionScreen/index.tsx` | REPLACED |
| `src/screens/onboarding/FTUEWorkoutVideoScreen/index.tsx` | 2 lines |
| `src/screens/home/HomeScreen/index.tsx` | 6 lines |
| `src/screens/settings/SettingsScreen/index.tsx` | 4 lines + Alert |
| `src/screens/profile/ProfileAvatarScreen/index.tsx` | 1 line + Alert |
| `src/screens/workout/WorkoutTrackerScreen/index.tsx` | 1 line |
| `src/design-system/tokens.ts` | Hardware palette (optional) |

---

**Total Estimated Time:** 2-3 hours
**Priority:** Complete Steps 1-4 before any testing
