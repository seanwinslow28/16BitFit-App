# Battle Mode Main Menu - Wireframe Specification

**Screen ID**: BATTLE-01
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
> - ✅ 44×44dp minimum touch targets
> - ✅ WCAG 2.1 AA accessibility compliance
> - ✅ Usability Traps Prevention guidelines

---

## Purpose

The Battle Mode Main Menu is the central hub after entering Battle Mode via the Transition Video. It provides access to:
- **Start Battle** - Begin a combat session
- **Choose Your Champion** - Select/change your fighter character
- **Settings** - Audio, controls, accessibility options
- **Back to Home** - Exit Battle Mode and return to Home Dashboard

---

## Rendering Environment

| Property | Value |
|----------|-------|
| Engine | Phaser 3 (WebView) |
| Orientation | Landscape |
| Canvas Size | 844 × 390 (iPhone logical) |
| Color Palette | Full color (not LCD-restricted) |
| Entry Point | Battle Mode Transition Video completion |

---

## Layout Structure

### Main Menu (Landscape, Phaser)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  PHASER CANVAS (844 × 390)                                                     │
│  Background: Animated arena/dojo backdrop with subtle particles                │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                                                                                  │
│    ╔════════════════════════════════════════════════════════════════════╗      │
│    ║                         BATTLE MODE                                 ║      │
│    ╚════════════════════════════════════════════════════════════════════╝      │
│                                                                                  │
│    ┌────────────────────────────────────────────────────────────────────────┐  │
│    │                                                                        │  │
│    │    [Selected Champion Sprite]        ┌─────────────────────────────┐   │  │
│    │    Idle animation                    │      START BATTLE           │   │  │
│    │                                      └─────────────────────────────┘   │  │
│    │    Champion Name: SEAN               ┌─────────────────────────────┐   │  │
│    │                                      │   CHOOSE YOUR CHAMPION      │   │  │
│    │                                      └─────────────────────────────┘   │  │
│    │                                      ┌─────────────────────────────┐   │  │
│    │                                      │      SETTINGS               │   │  │
│    │                                      └─────────────────────────────┘   │  │
│    │                                      ┌─────────────────────────────┐   │  │
│    │                                      │      BACK TO HOME           │   │  │
│    │                                      └─────────────────────────────┘   │  │
│    │                                                                        │  │
│    └────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│    [Player Stats: HP 65 | ATK 12 | DEF 10 | SPD 8]                             │
│                                                                                  │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### 1. Background

```typescript
// Animated arena backdrop
{
  image: 'arena_dojo_bg',
  width: 844,
  height: 390,
  parallaxLayers: [
    { image: 'bg_layer_1', scrollSpeed: 0.1 },  // Far clouds
    { image: 'bg_layer_2', scrollSpeed: 0.2 },  // Mountains
    { image: 'bg_layer_3', scrollSpeed: 0.0 },  // Arena floor (static)
  ],
  particles: {
    type: 'dust',
    density: 10,
    color: '#FFFFFF',
    alpha: 0.3,
  },
}
```

### 2. Title Banner

```typescript
// "BATTLE MODE" title
{
  text: 'BATTLE MODE',
  fontFamily: 'PressStart2P',
  fontSize: 24,
  color: '#FFD700',  // Gold
  stroke: '#000000',
  strokeThickness: 4,
  shadow: {
    offsetX: 3,
    offsetY: 3,
    color: '#000000',
    blur: 0,
    fill: true,
  },
  x: canvasWidth / 2,
  y: 40,
  origin: { x: 0.5, y: 0.5 },
}
```

### 3. Champion Display (Left Side)

```typescript
// Selected champion sprite with idle animation
{
  x: 180,
  y: 220,
  width: 150,
  height: 150,
  animation: 'idle',
  animationFrameRate: 8,
}

// Champion name label
{
  text: selectedChampion.name.toUpperCase(),
  fontFamily: 'PressStart2P',
  fontSize: 12,
  color: '#FFFFFF',
  x: 180,
  y: 310,
  origin: { x: 0.5, y: 0 },
}
```

### 4. Menu Options (Right Side)

```typescript
// Menu button container
const MENU_CONFIG = {
  startX: 550,
  startY: 130,
  buttonWidth: 280,
  buttonHeight: 52,
  spacing: 12,
};

// Menu options array
const MENU_OPTIONS = [
  {
    id: 'start_battle',
    text: 'START BATTLE',
    icon: '⚔️',
    color: '#228B22',  // Green - primary action
    action: () => navigation.navigate('BattleScreen'),
  },
  {
    id: 'choose_champion',
    text: 'CHOOSE YOUR CHAMPION',
    icon: '👤',
    color: '#4169E1',  // Royal blue
    action: () => navigation.navigate('ChampionSelect'),
  },
  {
    id: 'settings',
    text: 'SETTINGS',
    icon: '⚙️',
    color: '#555555',  // Gray
    action: () => showSettingsModal(),
  },
  {
    id: 'back_home',
    text: 'BACK TO HOME',
    icon: '🏠',
    color: '#8B0000',  // Dark red
    action: () => exitBattleMode(),
  },
];
```

### 5. Individual Menu Button

```typescript
// Button style
{
  width: 280,
  height: 52,
  backgroundColor: option.color,
  borderWidth: 3,
  borderColor: '#FFFFFF',
  borderRadius: 0,  // Pixel perfect

  // Text
  text: option.text,
  fontFamily: 'PressStart2P',
  fontSize: 10,
  color: '#FFFFFF',

  // Hover state
  hoverBackgroundColor: lighten(option.color, 0.2),
  hoverBorderColor: '#FFD700',

  // Touch target (meets 44dp minimum)
  touchPadding: { horizontal: 16, vertical: 8 },
}

// Button hover animation
button.on('pointerover', () => {
  this.tweens.add({
    targets: button,
    scaleX: 1.02,
    duration: 100,
    ease: 'Power1',
  });
  SoundManager.play('menu_hover');
});
```

### 6. Player Stats Bar

```typescript
// Stats display (bottom of screen)
{
  x: canvasWidth / 2,
  y: 370,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  padding: 8,
  borderWidth: 2,
  borderColor: '#FFD700',

  stats: [
    { label: 'HP', value: playerStats.hpMax, color: '#FF6B6B' },
    { label: 'ATK', value: playerStats.attack, color: '#FFA500' },
    { label: 'DEF', value: playerStats.defense, color: '#4169E1' },
    { label: 'SPD', value: playerStats.speed, color: '#32CD32' },
  ],

  fontFamily: 'PressStart2P',
  fontSize: 8,
  spacing: 24,
}
```

---

## Menu Selection Logic

### Cursor Navigation

```typescript
interface MenuState {
  selectedIndex: number;
  options: MenuOption[];
}

const [menuState, setMenuState] = useState<MenuState>({
  selectedIndex: 0,  // Start Battle is pre-selected
  options: MENU_OPTIONS,
});

// Keyboard/gamepad navigation
const handleNavigation = (direction: 'up' | 'down') => {
  let newIndex = menuState.selectedIndex;

  if (direction === 'up') {
    newIndex = (newIndex - 1 + MENU_OPTIONS.length) % MENU_OPTIONS.length;
  } else {
    newIndex = (newIndex + 1) % MENU_OPTIONS.length;
  }

  setMenuState({ ...menuState, selectedIndex: newIndex });
  SoundManager.play('menu_move');
  Haptics.impact(Haptics.ImpactFeedbackStyle.Light);
};

// Confirm selection
const handleConfirm = () => {
  const selectedOption = MENU_OPTIONS[menuState.selectedIndex];
  SoundManager.play('menu_confirm');
  Haptics.impact(Haptics.ImpactFeedbackStyle.Medium);
  selectedOption.action();
};
```

---

## Animations

### Champion Idle Animation

```typescript
// Loop idle animation for selected champion
this.anims.create({
  key: 'champion_idle',
  frames: this.anims.generateFrameNumbers('champion_spritesheet', {
    start: 0,
    end: 7,
  }),
  frameRate: 8,
  repeat: -1,
});

championSprite.play('champion_idle');
```

### Menu Button Selection

```typescript
// Highlight effect on selected button
const updateSelection = (index: number) => {
  MENU_OPTIONS.forEach((option, i) => {
    const button = buttons[i];

    if (i === index) {
      // Selected state
      button.setStrokeStyle(4, 0xFFD700);  // Gold border
      this.tweens.add({
        targets: button,
        scaleX: 1.05,
        duration: 100,
        ease: 'Back.easeOut',
      });
    } else {
      // Unselected state
      button.setStrokeStyle(2, 0xFFFFFF);  // White border
      button.setScale(1.0);
    }
  });
};
```

### Background Particles

```typescript
// Subtle dust particles
const particles = this.add.particles(0, 0, 'particle_dust', {
  x: { min: 0, max: 844 },
  y: { min: 0, max: 390 },
  speed: { min: 10, max: 30 },
  alpha: { start: 0.3, end: 0 },
  scale: { start: 0.5, end: 0 },
  lifespan: 3000,
  frequency: 200,
});
```

---

## Sound Effects

| Sound ID | Description | Trigger |
|----------|-------------|---------|
| `menu_move` | 8-bit navigation tick | Up/Down navigation |
| `menu_hover` | Soft highlight sound | Button hover |
| `menu_confirm` | Selection confirmation | Button press |
| `menu_back` | Cancel/back sound | Back to Home |
| `battle_start` | Energetic battle intro | Start Battle |
| `ambient_dojo` | Low background ambiance | Continuous loop |

---

## Accessibility

### Screen Reader Support

```typescript
// Menu buttons
accessibilityLabel={`${option.text}. Button ${index + 1} of ${MENU_OPTIONS.length}`}
accessibilityRole="button"
accessibilityHint="Double tap to select"

// Champion display
accessibilityLabel={`Selected champion: ${champion.name}. ${champion.tagline}`}
accessibilityRole="image"

// Stats bar
accessibilityLabel={`Your stats: HP ${stats.hp}, Attack ${stats.attack}, Defense ${stats.defense}, Speed ${stats.speed}`}
accessibilityRole="text"
```

### Reduce Motion Support

```typescript
if (prefersReducedMotion) {
  // Disable background parallax
  // Disable particle effects
  // Use static button states instead of animations
  // Champion sprite shows static pose instead of idle animation
}
```

---

## Navigation

### Entry Points
- Battle Mode Transition Video completion
- ChampionSelect → Back button (returns here)
- Settings modal → Close (returns here)

### Exit Points
- START BATTLE → Battle Screen
- CHOOSE YOUR CHAMPION → Champion Select Screen
- SETTINGS → Settings Modal (overlay)
- BACK TO HOME → Transition Video (reverse) → Home Dashboard

### Flow Diagram

```
[Battle Mode Transition Video completes]
                │
                ▼
       BATTLE MODE MAIN MENU
       (Landscape, Phaser)
                │
    ┌───────────┼───────────┬──────────────┐
    │           │           │              │
    ▼           ▼           ▼              ▼
START       CHAMPION    SETTINGS      BACK TO
BATTLE      SELECT      (Modal)        HOME
    │           │           │              │
    ▼           │           │              ▼
Battle          │           │         Transition
Screen          │           │         Video (Rev)
                │           │              │
                ▼           │              ▼
        [Select/Back]       │         Home
                │           │         Dashboard
                └───────────┘
```

---

## Exit Battle Mode Flow

### Back to Home Sequence

```typescript
const exitBattleMode = async () => {
  // Play exit sound
  SoundManager.play('menu_back');

  // Fade out Phaser scene
  this.cameras.main.fadeOut(300, 0, 0, 0);

  // Wait for fade
  await delay(300);

  // Play transition video (reverse)
  await playTransitionVideo({ direction: 'exit' });

  // Lock back to portrait
  await ScreenOrientation.lockAsync(
    ScreenOrientation.OrientationLock.PORTRAIT_UP
  );

  // Navigate to Home
  navigation.navigate('Home');
};
```

---

## State Management

### Load Player Data

```typescript
// On menu load, fetch current player stats and champion
useEffect(() => {
  const loadPlayerData = async () => {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select(`
        hp_max,
        attack,
        defense,
        speed,
        selected_champion_id
      `)
      .eq('id', userId)
      .single();

    setPlayerStats({
      hpMax: profile.hp_max,
      attack: profile.attack,
      defense: profile.defense,
      speed: profile.speed,
    });

    setSelectedChampion(
      CHAMPIONS.find(c => c.id === profile.selected_champion_id) || CHAMPIONS[0]
    );
  };

  loadPlayerData();
}, []);
```

---

## Design System Compliance Checklist

- [x] Full color palette (Phaser scene)
- [x] Press Start 2P for headers/buttons
- [x] All touch targets ≥ 44×44dp (52dp button height)
- [x] Screen reader labels on all interactive elements
- [x] Reduce Motion preference respected
- [x] Landscape orientation (Phaser)
- [x] Clear menu hierarchy (primary action highlighted)
- [x] Player stats always visible
- [x] Selected champion displayed with idle animation

---

**Priority**: HIGH - Battle Mode entry hub
**Estimated Implementation**: 6-8 hours (Phaser scene + navigation)
**Dependencies**: Champion assets, Phaser WebView bridge, Transition Video
**Technical Note**: Runs in Phaser 3, communicates via WebView bridge
