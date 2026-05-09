# Champion Select Screen - Wireframe Specification

**Screen ID**: BATTLE-02
**Batch**: 2 (HIGH - Core Loop Functionality)
**Status**: Draft
**Design Date**: 2025-12-29
**Spec Version**: 1.0

---

## Design System Compliance

> **Reference Document**: `docs/front-end-spec.md` v2.0
>
> This wireframe adheres to all MANDATORY DESIGN REQUIREMENTS including:
> - ✅ Full Color Palette (Phaser scene, not LCD-restricted)
> - ✅ Typography Separation (Press Start 2P for UI elements)
> - ✅ 44×44dp minimum touch targets (champion portraits)
> - ✅ WCAG 2.1 AA accessibility compliance
> - ✅ Usability Traps Prevention guidelines

---

## Context

> **Important Design Decision (Party Mode 2025-12-29)**
>
> Champions are **purely cosmetic** - they have no stat differences.
> This follows the **Mario Party model** where character selection is about
> identity and preference, not strategic advantage.
>
> All champions are powered equally by the user's real-world fitness activities.
> The user's workouts fuel their champion's performance, not the champion choice.

---

## Purpose

Allow players to select their champion (fighter character) before entering battle. This screen is inspired by **Street Fighter 2's character select grid** and runs in **Phaser 3 (landscape mode)**.

---

## Rendering Environment

| Property | Value |
|----------|-------|
| Engine | Phaser 3 (WebView) |
| Orientation | Landscape |
| Canvas Size | 844 × 390 (iPhone logical) |
| Color Palette | Full color (not LCD-restricted) |
| Entry Point | Battle Mode Main Menu → "Choose Your Champion" |

---

## Layout Structure

### SF2-Style Champion Select Grid (Landscape)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  PHASER CANVAS (844 × 390)                                                     │
│  Background: Dark arena stage backdrop                                          │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│    ╔════════════════════════════════════════════════════════════════════╗      │
│    ║                    CHOOSE YOUR CHAMPION                             ║      │
│    ╚════════════════════════════════════════════════════════════════════╝      │
│                                                                                  │
│         ┌──────────┐    ┌──────────┐    ┌──────────┐                            │
│         │          │    │          │    │          │                            │
│         │   SEAN   │    │   MARY   │    │  MARCUS  │                            │
│         │  (MMA)   │    │ (Kickbox)│    │  (Boxer) │                            │
│         └──────────┘    └──────────┘    └──────────┘                            │
│              ▲                                                                   │
│          [CURSOR]                                                               │
│         ┌──────────┐    ┌──────────┐    ┌──────────┐                            │
│         │          │    │          │    │          │                            │
│         │   ARIA   │    │  KENJI   │    │   ZARA   │                            │
│         │(Capoeira)│    │ (Aikido) │    │(PowerLft)│                            │
│         └──────────┘    └──────────┘    └──────────┘                            │
│                                                                                  │
│    ┌─────────────────────────────────────────────────────────────────────────┐  │
│    │ Character Preview (selected champion full sprite + name + tagline)      │  │
│    │                                                                         │  │
│    │   [SEAN - Full Sprite]        "Sean - MMA Fighter"                      │  │
│    │                               "Powered by YOUR workouts!"               │  │
│    │                                                                         │  │
│    └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│    [BACK]                                                         [SELECT]      │
│                                                                                  │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### 1. Header Title

```typescript
// "CHOOSE YOUR CHAMPION" title
{
  text: 'CHOOSE YOUR CHAMPION',
  fontFamily: 'PressStart2P',
  fontSize: 18,
  color: '#FFFFFF',
  stroke: '#000000',
  strokeThickness: 3,
  align: 'center',
  x: canvasWidth / 2,
  y: 30,
}
```

### 2. Champion Grid (2 rows × 3 columns = 6 champions)

```typescript
// Grid configuration
const GRID_CONFIG = {
  cols: 3,
  rows: 2,
  portraitWidth: 100,
  portraitHeight: 100,
  spacing: 16,
  startX: 172,  // Centered on canvas
  startY: 70,
};

// Individual portrait frame
{
  width: 80,
  height: 80,
  borderWidth: 3,
  borderColor: '#444444',  // Unselected
  borderColorSelected: '#FFD700',  // Gold highlight
  borderColorHover: '#AAAAAA',
  imageScale: 1.0,
}

// Portrait image (pixel art headshot)
{
  width: 76,
  height: 76,
  // Grayscale filter for locked champions (future)
}
```

### 3. Selection Cursor

```typescript
// Animated selection indicator
{
  width: 88,
  height: 88,
  borderWidth: 4,
  borderColor: '#FFD700',  // Gold
  animation: 'pulse',
  animationDuration: 500,
  animationEasing: 'sine.inOut',
}

// Cursor movement
const moveCursor = (direction: 'left' | 'right' | 'up' | 'down') => {
  // Wrap around grid edges
  // Play 8-bit selection sound
  SoundManager.play('menu_move');
  // Haptic feedback
  Haptics.impact(Haptics.ImpactFeedbackStyle.Light);
};
```

### 4. Character Preview Panel

```typescript
// Preview container (bottom section)
{
  x: canvasWidth / 2,
  y: 280,
  width: 700,
  height: 120,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  borderWidth: 2,
  borderColor: '#FFD700',
}

// Full character sprite (left side of preview)
{
  x: 150,
  y: 280,
  width: 100,
  height: 100,
  // Full-body sprite, idle animation
}

// Character name
{
  text: championName,
  fontFamily: 'PressStart2P',
  fontSize: 14,
  color: '#FFFFFF',
  x: 300,
  y: 250,
}

// Character tagline
{
  text: championTagline,
  fontFamily: 'Montserrat',
  fontSize: 12,
  color: '#CCCCCC',
  x: 300,
  y: 275,
}

// "Powered by YOUR workouts!" reminder
{
  text: 'Powered by YOUR workouts!',
  fontFamily: 'Montserrat',
  fontSize: 10,
  color: '#8BC0F0',  // Light blue accent
  x: 300,
  y: 295,
}
```

### 5. Action Buttons

```typescript
// Back button (bottom-left)
{
  text: 'BACK',
  fontFamily: 'PressStart2P',
  fontSize: 12,
  x: 60,
  y: 360,
  padding: 12,
  backgroundColor: '#333333',
  hoverColor: '#555555',
  touchTarget: { width: 100, height: 48 },
}

// Select button (bottom-right)
{
  text: 'SELECT',
  fontFamily: 'PressStart2P',
  fontSize: 12,
  x: canvasWidth - 60,
  y: 360,
  padding: 12,
  backgroundColor: '#228B22',  // Green
  hoverColor: '#32CD32',
  touchTarget: { width: 120, height: 48 },
}
```

---

## Champion Data Model

### Champion Definition

```typescript
interface Champion {
  id: string;
  name: string;
  tagline: string;
  portraitUrl: string;      // 80×80 headshot
  spriteSheetUrl: string;   // Full sprite sheet for battle
  idleAnimationUrl: string; // Preview idle animation
  unlocked: boolean;        // For future unlockable champions
}

// All 6 champions (all unlocked)
const CHAMPIONS: Champion[] = [
  {
    id: 'sean',
    name: 'Sean',
    tagline: 'MMA Fighter',
    portraitUrl: '/assets/champions/sean/portrait.png',
    spriteSheetUrl: '/assets/champions/sean/spritesheet.png',
    idleAnimationUrl: '/assets/champions/sean/idle.png',
    unlocked: true,
  },
  {
    id: 'mary',
    name: 'Mary',
    tagline: 'Kickboxing Trainer',
    portraitUrl: '/assets/champions/mary/portrait.png',
    spriteSheetUrl: '/assets/champions/mary/spritesheet.png',
    idleAnimationUrl: '/assets/champions/mary/idle.png',
    unlocked: true,
  },
  {
    id: 'marcus',
    name: 'Marcus',
    tagline: 'Urban Boxer',
    portraitUrl: '/assets/champions/marcus/portrait.png',
    spriteSheetUrl: '/assets/champions/marcus/spritesheet.png',
    idleAnimationUrl: '/assets/champions/marcus/idle.png',
    unlocked: true,
  },
  {
    id: 'aria',
    name: 'Aria',
    tagline: 'Dance Combat Instructor',
    portraitUrl: '/assets/champions/aria/portrait.png',
    spriteSheetUrl: '/assets/champions/aria/spritesheet.png',
    idleAnimationUrl: '/assets/champions/aria/idle.png',
    unlocked: true,
  },
  {
    id: 'kenji',
    name: 'Kenji',
    tagline: 'Aikido/Tai Chi Master',
    portraitUrl: '/assets/champions/kenji/portrait.png',
    spriteSheetUrl: '/assets/champions/kenji/spritesheet.png',
    idleAnimationUrl: '/assets/champions/kenji/idle.png',
    unlocked: true,
  },
  {
    id: 'zara',
    name: 'Zara',
    tagline: 'Power Lifter',
    portraitUrl: '/assets/champions/zara/portrait.png',
    spriteSheetUrl: '/assets/champions/zara/spritesheet.png',
    idleAnimationUrl: '/assets/champions/zara/idle.png',
    unlocked: true,
  },
];
```

### No Stat Differences (Mario Party Model)

```typescript
// Champions have NO gameplay stat differences
// This is intentional - all champions are purely cosmetic

// ❌ DO NOT implement:
// - Unique abilities per champion
// - Different base stats (HP, ATK, DEF, SPD)
// - Champion-specific combos

// ✅ All champions share:
// - Same base stats (determined by user profile)
// - Same move sets
// - Same combat mechanics
// - Power comes from user's real-world fitness
```

---

## Input Handling

### Touch/Tap Controls

```typescript
// Direct portrait tap to select
champion.on('pointerdown', () => {
  setSelectedChampion(champion);
  playCursorMoveSound();
  playHapticFeedback();
});

// Confirm selection
selectButton.on('pointerdown', () => {
  confirmChampionSelection(selectedChampion);
});
```

### Gamepad/Keyboard Support (Future)

```typescript
// D-pad navigation
cursors.left.on('down', () => moveCursor('left'));
cursors.right.on('down', () => moveCursor('right'));
cursors.up.on('down', () => moveCursor('up'));
cursors.down.on('down', () => moveCursor('down'));

// A button = confirm, B button = back
gamepad.A.on('down', () => confirmChampionSelection());
gamepad.B.on('down', () => goBack());
```

---

## Animations

### Cursor Pulse

```typescript
// Gold border pulses when hovering
this.tweens.add({
  targets: cursorBorder,
  alpha: { from: 1, to: 0.7 },
  duration: 500,
  yoyo: true,
  repeat: -1,
  ease: 'Sine.easeInOut',
});
```

### Portrait Hover Scale

```typescript
// Slight scale up on hover
portrait.on('pointerover', () => {
  this.tweens.add({
    targets: portrait,
    scale: 1.05,
    duration: 100,
    ease: 'Back.easeOut',
  });
});

portrait.on('pointerout', () => {
  this.tweens.add({
    targets: portrait,
    scale: 1.0,
    duration: 100,
    ease: 'Back.easeIn',
  });
});
```

### Selection Confirmation

```typescript
// Flash selected champion on confirm
const confirmChampionSelection = async (champion: Champion) => {
  // Flash animation
  await flashPortrait(champion, 3);  // 3 quick flashes

  // Play confirm sound
  SoundManager.play('champion_selected');

  // Haptic
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

  // Save selection
  await saveChampionSelection(champion.id);

  // Navigate to battle or back to menu
  navigation.navigate('BattleModeMenu');
};
```

---

## Sound Effects

| Sound ID | Description | Trigger |
|----------|-------------|---------|
| `menu_move` | 8-bit selection tick | Cursor movement |
| `champion_hover` | Soft preview sound | Portrait hover |
| `champion_selected` | Triumphant confirmation | SELECT button |
| `menu_back` | Cancel/back sound | BACK button |

---

## Accessibility

### Screen Reader Support

```typescript
// Champion portrait
accessibilityLabel={`${champion.name}. ${champion.tagline}. ${champion.unlocked ? 'Available' : 'Locked'}`}
accessibilityRole="button"
accessibilityHint="Double tap to select this champion"

// Confirm button
accessibilityLabel={`Select ${selectedChampion.name} as your champion`}
accessibilityRole="button"
```

### Reduce Motion Support

```typescript
if (prefersReducedMotion) {
  // Disable cursor pulse animation
  // Use solid highlight instead
  // Skip flash animation on confirm
}
```

---

## Navigation

### Entry Points
- Battle Mode Main Menu → "Choose Your Champion"
- Settings → "Change Champion" (future)

### Exit Points
- BACK → Battle Mode Main Menu
- SELECT → Battle Mode Main Menu (with champion saved)

### Flow Diagram

```
Battle Mode Main Menu
     │
     └─ [Choose Your Champion]
          │
          ▼
     CHAMPION SELECT SCREEN
     (Landscape, Phaser)
          │
          ├─ [BACK] → Battle Mode Main Menu
          │
          └─ [SELECT] → Save champion → Battle Mode Main Menu
```

---

## State Management

### Champion Selection Persistence

```typescript
// Save to Supabase user_profiles
const saveChampionSelection = async (championId: string) => {
  await supabase
    .from('user_profiles')
    .update({ selected_champion_id: championId })
    .eq('id', userId);
};

// Load on app start
const loadChampionSelection = async () => {
  const { data } = await supabase
    .from('user_profiles')
    .select('selected_champion_id')
    .eq('id', userId)
    .single();

  return data?.selected_champion_id || 'sean';  // Default to Sean
};
```

---

## Design System Compliance Checklist

- [x] Full color palette (Phaser scene)
- [x] Press Start 2P for headers/buttons
- [x] All touch targets ≥ 44×44dp
- [x] Screen reader labels on all interactive elements
- [x] Reduce Motion preference respected
- [x] No stat differences between champions (Mario Party model)
- [x] Clear "Powered by YOUR workouts!" messaging
- [x] SF2-style grid layout (2×3)
- [x] Landscape orientation (Phaser)

---

**Priority**: HIGH - Core identity selection
**Estimated Implementation**: 8-10 hours (Phaser scene + assets)
**Dependencies**: Champion sprite assets, Phaser WebView bridge
**Technical Note**: Runs in Phaser 3, communicates via WebView bridge
