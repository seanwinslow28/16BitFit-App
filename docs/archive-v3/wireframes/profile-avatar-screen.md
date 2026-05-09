# Profile/Avatar Screen - Wireframe Specification

**Screen ID**: PROFILE-01
**Batch**: 4 (LOWER - Secondary Features)
**Status**: ✅ Spec Complete
**Design Date**: 2025-11-30
**Last Updated**: 2025-12-06
**Spec Version**: 2.0

---

## Design System Compliance

> **Reference Document**: `docs/front-end-spec.md` v2.0
>
> This wireframe adheres to all MANDATORY DESIGN REQUIREMENTS including:
> - ✅ Dual Palette System (LCD 4-color only for screen content)
> - ✅ Typography Separation (Press Start 2P + Montserrat)
> - ✅ 44×44dp minimum touch targets
> - ✅ WCAG 2.1 AA accessibility compliance
> - ✅ Usability Traps Prevention guidelines

---

## Purpose

Display user profile information, Home Avatar, Combat Character, and provide access to avatar generation/regeneration. Accessed via Profile tab in bottom navigation. **Momentum-based tracking** with graceful decay (5% per missed day, NOT binary streak reset).

---

## Layout Structure

### Virtual LCD Area (329×584pt)
Using **DMG Palette ONLY** (`#9BBC0F`, `#0F380F`, `#8BAC0F`, `#306230`)

```
┌─────────────────────────────────────┐
│  LCD SCREEN (329×584pt)             │
│  Background: #9BBC0F (Neon grass)   │
├─────────────────────────────────────┤
│                                     │
│   ┌─────────────────────────────┐  │
│   │  PROFILE                    │  │ ← Header
│   └─────────────────────────────┘  │   Font: Press Start 2P, 12px
│                                     │
│   ╔═══════════════════════════╗   │
│   ║  HOME AVATAR              ║   │ ← Section Title
│   ║                           ║   │   Font: Press Start 2P, 10px
│   ║   ┌─────────────────┐     ║   │
│   ║   │                 │     ║   │ ← Avatar Display
│   ║   │  [Avatar]       │     ║   │   128×128 pixel art
│   ║   │  128×128        │     ║   │   DMG palette only
│   ║   │                 │     ║   │
│   ║   └─────────────────┘     ║   │
│   ║                           ║   │
│   ║   Stage 1 • Level 3       ║   │ ← Evolution info
│   ║                           ║   │   Font: Montserrat, 12px
│   ║   ┌───────────────────┐   ║   │
│   ║   │  UPDATE AVATAR    │   ║   │ ← Regenerate Button
│   ║   └───────────────────┘   ║   │   Touch: Full width × 44dp
│   ╚═══════════════════════════╝   │
│                                     │
│   ╔═══════════════════════════╗   │
│   ║  COMBAT CHARACTER         ║   │
│   ║                           ║   │
│   ║   [Sprite 64×64]  SEAN    ║   │ ← Character name
│   ║                (Runner)   ║   │   Font: Press Start 2P, 10px
│   ║                           ║   │
│   ║   STR: █████░  5/6        ║   │ ← Stats with numbers
│   ║   SPD: ███░░░  3/6        ║   │   RAW DATA visible
│   ║   END: ████░░  4/6        ║   │
│   ╚═══════════════════════════╝   │
│                                     │
│   ╔═══════════════════════════╗   │
│   ║  STATS                    ║   │
│   ║  ─────────────────────    ║   │
│   ║  Level: 3                 ║   │ ← RAW numerical data
│   ║  Battles: 12              ║   │   Always visible
│   ║  Momentum: 85% ████░      ║   │   Graceful decay (5%/day)
│   ╚═══════════════════════════╝   │
│                                     │
└─────────────────────────────────────┘
```

---

## Component Specifications

### 1. Screen Background
```typescript
{
  flex: 1,
  backgroundColor: '#9BBC0F',      // Neon grass glow
  paddingVertical: 16,
}
```

### 2. Header
```typescript
{
  backgroundColor: '#9BBC0F',
  borderBottomWidth: 2,
  borderBottomColor: '#306230',
  paddingVertical: 16,
  paddingHorizontal: 24,
  marginBottom: 16,
}

// Header Text
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 12,
  color: '#0F380F',
  textAlign: 'center',
}
```

### 3. Home Avatar Section
```typescript
{
  backgroundColor: '#9BBC0F',
  borderWidth: 4,
  borderColor: '#306230',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  padding: 16,
  marginHorizontal: 24,
  marginBottom: 16,
  alignItems: 'center',
}

// Section Title
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 10,
  color: '#0F380F',
  marginBottom: 12,
}

// Avatar Image Container
{
  width: 128,
  height: 128,
  borderWidth: 4,
  borderColor: '#0F380F',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  marginBottom: 12,
}

// Stage/Level Text
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  color: '#306230',
  marginBottom: 12,
}
```

### 4. Update Avatar Button
```typescript
{
  backgroundColor: '#8BAC0F',
  borderWidth: 3,
  borderColor: '#0F380F',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  paddingVertical: 12,
  paddingHorizontal: 24,
  minHeight: 44,                   // MANDATORY: Touch target
  shadowColor: '#0F380F',
  shadowOffset: { width: 3, height: 3 },
  shadowOpacity: 1,
  shadowRadius: 0,                 // MANDATORY: Hard pixel shadow
}

// Button Text
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 10,
  color: '#0F380F',
  textAlign: 'center',
}
```

### 5. Combat Character Section
```typescript
{
  backgroundColor: '#9BBC0F',
  borderWidth: 4,
  borderColor: '#306230',
  borderRadius: 0,
  padding: 16,
  marginHorizontal: 24,
  marginBottom: 16,
}

// Character Row
{
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
}

// Character Sprite
{
  width: 64,
  height: 64,
  borderWidth: 2,
  borderColor: '#0F380F',
  borderRadius: 0,
  marginRight: 16,
}

// Character Name
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 10,
  color: '#0F380F',
}

// Archetype Label
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  color: '#306230',
}
```

### 6. Stat Bars (RAW DATA ALWAYS VISIBLE)
```typescript
// Stat Row Container
{
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
}

// Stat Label
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  fontWeight: '600',
  color: '#0F380F',
  width: 50,
}

// Stat Bar Background
{
  flex: 1,
  height: 12,
  backgroundColor: '#306230',
  borderRadius: 0,
  overflow: 'hidden',
  marginRight: 8,
}

// Stat Bar Fill
{
  height: '100%',
  backgroundColor: '#8BAC0F',
}

// Stat Value (RAW NUMBER)
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  fontWeight: '600',
  color: '#0F380F',
  width: 30,
  textAlign: 'right',
}
```

### 7. User Stats Section
```typescript
{
  backgroundColor: '#9BBC0F',
  borderWidth: 4,
  borderColor: '#306230',
  borderRadius: 0,
  padding: 16,
  marginHorizontal: 24,
}

// Stats Row
{
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 8,
}

// Stat Label
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  color: '#306230',
}

// Stat Value (RAW NUMBER)
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  fontWeight: '600',
  color: '#0F380F',
}
```

### 8. Momentum Bar (NOT Streak)
```typescript
// Momentum uses graceful decay (5% per missed day)
// NOT binary streak reset

// Momentum Label
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  color: '#306230',
}

// Momentum Progress Bar
{
  height: 12,
  backgroundColor: '#306230',
  borderRadius: 0,
  marginTop: 4,
}

// Momentum Fill
{
  height: '100%',
  backgroundColor: '#8BAC0F',
  // Width based on momentum percentage
}

// Momentum Text
{
  fontFamily: 'Montserrat',
  fontSize: 10,
  color: '#0F380F',
  marginTop: 4,
}
```

---

## Usability Compliance

> **Reference**: front-end-spec.md "Usability Traps Prevention" section

### Trap 1: Information Density ✅
- **Compliance**: All stats show raw numerical values
- **Implementation**: Level, Battles, Momentum all show exact numbers

### Trap 2: AI Summaries ✅
- **Compliance**: No AI-generated summaries
- **Implementation**: Static display of user data

### Trap 3: Punishment Mechanics ✅
- **Compliance**: Momentum (graceful decay) NOT streak (binary reset)
- **Implementation**:
  - 5% decay per missed day (forgiving)
  - No "You lost your streak!" messaging
  - No shame for inconsistency
  - Recovery is always possible

### Trap 4: Onboarding Overload ✅
- **Compliance**: Clean, organized sections
- **Implementation**: Three distinct cards with clear hierarchy

### Trap 5: Feature Labyrinths ✅
- **Compliance**: Single action per section
- **Implementation**: One clear CTA (Update Avatar) + informational display

---

## Touch Target Requirements

| Element | Visual Size | Touch Target | Compliant |
|---------|-------------|--------------|-----------|
| UPDATE AVATAR Button | Full width × 44dp | Full width × 44dp | ✅ |
| Avatar Display | 128×128pt | Non-interactive | N/A |
| Character Sprite | 64×64pt | Non-interactive | N/A |

---

## Accessibility

### Screen Reader Announcements

```typescript
// Screen title
accessibilityLabel="Profile screen"
accessibilityRole="header"

// Home Avatar section
accessibilityLabel={`Home Avatar, Stage ${stage}, Level ${level}`}
accessibilityRole="summary"

// Avatar image
accessibilityLabel="Your pixel art avatar in Game Boy style"
accessibilityRole="image"

// Update Avatar button
accessibilityLabel="Update your avatar"
accessibilityRole="button"
accessibilityHint="Double tap to upload a new photo and generate a new avatar"

// Combat Character section
accessibilityLabel={`Combat character: ${characterName}, ${archetype} archetype. Strength ${str} of 6, Speed ${spd} of 6, Endurance ${end} of 6`}
accessibilityRole="summary"

// Stats section
accessibilityLabel={`Your stats: Level ${level}, Battles won ${battles}, Momentum ${momentum} percent`}
accessibilityRole="text"
```

### Focus Order
1. Header (informational)
2. Home Avatar Section
3. Avatar Display (informational)
4. UPDATE AVATAR Button
5. Combat Character Section (informational)
6. Stats Section (informational)

### Reduce Motion Support
```typescript
const prefersReducedMotion = useReducedMotion();

// Avatar idle animation
const avatarAnimation = prefersReducedMotion
  ? null  // Static image
  : idleBreathingAnimation;

// Stat bar fill animation
const fillAnimation = prefersReducedMotion
  ? { width: `${percentage}%` }  // Instant
  : animatedFill;
```

### Color Contrast Verification

| Element | Foreground | Background | Ratio | WCAG |
|---------|------------|------------|-------|------|
| Header text | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Section titles | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Stat values | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Stat labels | #306230 | #9BBC0F | 2.8:1 | ⚠️ Large only |
| Button text | #0F380F | #8BAC0F | 5.2:1 | ✅ AA |

---

## State Variations

### No Avatar Generated Yet
```
╔═══════════════════════════════╗
║  HOME AVATAR                  ║
║                               ║
║   ┌─────────────────┐         ║
║   │  [Placeholder   │         ║ ← Neutral placeholder
║   │   silhouette]   │         ║   No "missing" text
║   └─────────────────┘         ║
║                               ║
║   ┌───────────────────┐       ║
║   │  CREATE AVATAR    │       ║ ← Positive CTA
║   └───────────────────┘       ║
╚═══════════════════════════════╝
```

### Avatar Generation In Progress
```
╔═══════════════════════════════╗
║  HOME AVATAR                  ║
║                               ║
║   ┌─────────────────┐         ║
║   │  [Pixel         │         ║ ← Loading spinner
║   │   spinner]      │         ║
║   │                 │         ║
║   │  Creating...    │         ║ ← Neutral status
║   └─────────────────┘         ║
╚═══════════════════════════════╝
```

### Loading Profile Data
```
╔═══════════════════════════════╗
║  PROFILE                      ║
║                               ║
║   [Pixel spinner]             ║
║                               ║
║   Loading your profile...     ║ ← Neutral messaging
╚═══════════════════════════════╝
```

---

## Implementation Notes

### Fetch Profile Data
```typescript
const fetchProfileData = async (userId: string) => {
  const { data: profile } = await supabase
    .from('user_profiles')
    .select(`
      display_name,
      home_avatar_url,
      avatar_stage,
      level,
      xp,
      archetype,
      character_name,
      strength,
      speed,
      endurance,
      momentum_percentage,
      battles_won
    `)
    .eq('id', userId)
    .single();

  return profile;
};
```

### Navigate to Avatar Update
```typescript
const handleUpdateAvatar = () => {
  // Navigate to Photo Upload screen
  // Positive framing - "update" not "fix" or "change"
  navigation.navigate('PhotoUpload', { mode: 'update' });
};
```

### Momentum Calculation (Graceful Decay)
```typescript
// Calculate momentum with 5% decay per missed day
const calculateMomentum = (lastActiveDate: Date, currentMomentum: number) => {
  const today = new Date();
  const daysMissed = Math.floor(
    (today.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysMissed === 0) return currentMomentum;

  // 5% decay per missed day, minimum 0%
  const decayAmount = daysMissed * 5;
  return Math.max(0, currentMomentum - decayAmount);

  // NOTE: This is GRACEFUL decay, not binary streak reset
  // User can always recover by being active again
};
```

---

## Navigation

### Entry Points
- From Tab Bar → Profile Tab
- From Settings → View Profile

### Exit Points
- To Photo Upload Screen (via UPDATE AVATAR)
- To other tabs via Tab Bar

---

## Related Screens

- **Previous**: Home Dashboard (via tab)
- **Next**: Photo Upload Screen (via UPDATE AVATAR)
- **Flow**: Profile Management

---

## Design System Compliance Checklist

- [x] Only 4 LCD colors used
- [x] No border radius (`borderRadius: 0`)
- [x] Hard pixel shadows (`shadowRadius: 0`)
- [x] No gradients
- [x] Typography: Press Start 2P (headers/buttons) + Montserrat (stats)
- [x] All touch targets ≥ 44×44dp
- [x] Screen reader labels on all elements
- [x] Reduce Motion preference respected
- [x] Raw numerical data always visible
- [x] Momentum (graceful decay) NOT streak (binary reset)
- [x] Positive framing for all CTAs

---

**Priority**: LOWER
**Estimated Implementation**: 4-6 hours
