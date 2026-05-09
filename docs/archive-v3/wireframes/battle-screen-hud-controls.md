# Battle Screen (HUD + Control Overlay) - Wireframe Specification

**Screen ID**: BATTLE-01
**Batch**: 2 (HIGH - Core Loop Functionality)
**Status**: ✅ Spec Complete
**Design Date**: 2025-11-30
**Last Updated**: 2025-12-31
**Spec Version**: 3.0 (Party Mode Aligned)

---

## Party Mode Alignment (2025-12-29)

### Key Changes in This Version
- ✅ "Fighter" → "Champion" throughout (cosmetic selection model)
- ✅ No-defeat philosophy: outcomes are "victory" or "continue_training"
- ✅ No "YOU LOST" or "DEFEAT" screens - only encouraging messages
- ✅ `continue_training` message: "Your champion is resting... time to train more!"
- ✅ Champions are purely cosmetic - all share identical stats
- ✅ Entry via Battle Mode Transition Video (NOT Cartridge Load)

---

## Design System Compliance

> **Reference Document**: `docs/front-end-spec.md` v2.0
>
> This wireframe adheres to all MANDATORY DESIGN REQUIREMENTS including:
> - ⚠️ **SPECIAL CASE**: Battle scene uses SF2-inspired palette (documented exception)
> - ✅ Control overlays and Pause menu use DMG palette
> - ✅ Typography: Press Start 2P throughout
> - ✅ 44×44dp minimum touch targets
> - ✅ WCAG 2.1 AA accessibility compliance
> - ✅ Usability Traps Prevention guidelines

---

## Purpose

Display the core fighting game combat within a Phaser 3 WebView. This screen combines Phaser-rendered game content with React Native overlay controls, creating an authentic Street Fighter 2-inspired fighting experience. **Training Dummy is forgiving** - players cannot fail the tutorial.

---

## Palette Exception Documentation

> **Why SF2 Palette is Allowed:**
>
> The Battle Screen is the ONLY screen that uses colors outside the DMG palette. This is a documented exception because:
> 1. The SF2 fighting game aesthetic is core to the product identity
> 2. Health bars, combo counters, and stage backgrounds require broader color range
> 3. The Phaser WebView operates independently from React Native DMG components
>
> **DMG Compliance Within Battle:**
> - Control overlay buttons: DMG palette (translucent)
> - Pause menu: DMG palette (full)
> - All text: Press Start 2P font

---

## Layout Structure

### Full Screen (Landscape Mode - 844×390pt iPhone 14 Pro)

```
┌────────────────────────────────────────────────────────────┐
│  PHASER WEBVIEW (Full Screen, Landscape)                   │
│  Background: Stage-specific (Dojo, Street, etc.)           │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────┐        ROUND 1        ┌──────────────┐  │ ← HUD (Phaser)
│  │ PLAYER HP    │         0:59          │ OPPONENT HP  │  │   SF2 style
│  │ ▓▓▓▓▓▓▓▓░░░░ │                       │ ▓▓▓▓▓▓▓▓▓▓▓▓ │  │
│  │ 80/100       │                       │ 100/100      │  │ ← RAW HP visible
│  └──────────────┘                       └──────────────┘  │
│                                                            │
│                                                            │
│                    [Stage Background]                      │ ← Phaser Scene
│                                                            │
│         [Player Sprite]        [Opponent Sprite]           │ ← Characters
│         Sean (64×64)           Training Dummy              │   Pixel art
│    ──────────────────────────────────────────────          │ ← Ground line
│                                                            │
│                                                            │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ ENERGY: ▓▓▓▓▓▓░░░░░░  50/100   Steps: 7,234        │  │ ← Energy Bar
│  └─────────────────────────────────────────────────────┘  │   RAW values
│                                                            │
│  ┌─────────┐                             ┌──────────────┐ │ ← Controls
│  │    ↑    │                             │  LP  MP  HP  │ │   (RN Overlay)
│  │  ←   →  │                             │  LK  MK  HK  │ │   Translucent DMG
│  │    ↓    │                             │              │ │   Touch: 44dp each
│  └─────────┘                             └──────────────┘ │
│  D-Pad                                   Action Buttons   │
│  (Left)                                  (Right)          │
└────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### 1. Phaser WebView Container
```typescript
{
  flex: 1,
  backgroundColor: '#000000',      // Black fallback
}

// WebView props
{
  source: { uri: 'http://localhost:3000/battle' },
  style: { flex: 1 },
  allowsInlineMediaPlayback: true,
  mediaPlaybackRequiresUserAction: false,
  javaScriptEnabled: true,
}
```

### 2. HUD Elements (Rendered by Phaser)

#### Player Health Bar (Top Left)
```javascript
// Phaser scene - SF2 style with RAW HP VISIBLE
const playerHealthBar = this.add.graphics();
playerHealthBar.fillStyle(0xFF0000, 1);  // Red fill
playerHealthBar.fillRect(20, 20, (playerHP / maxHP) * 200, 20);

// Border
playerHealthBar.lineStyle(2, 0xFFFFFF, 1);
playerHealthBar.strokeRect(20, 20, 200, 20);

// Label
const playerLabel = this.add.text(20, 45, 'PLAYER', {
  fontFamily: 'PressStart2P',
  fontSize: '10px',
  color: '#FFFFFF',
});

// RAW HP TEXT (MANDATORY - raw data visible)
const hpText = this.add.text(120, 22, `${playerHP}/${maxHP}`, {
  fontFamily: 'PressStart2P',
  fontSize: '8px',
  color: '#FFFFFF',
});
```

#### Opponent Health Bar (Top Right)
```javascript
const opponentHealthBar = this.add.graphics();
opponentHealthBar.fillStyle(0xFF0000, 1);
opponentHealthBar.fillRect(
  width - 20 - (opponentHP / maxHP) * 200,
  20,
  (opponentHP / maxHP) * 200,
  20
);

// Border
opponentHealthBar.lineStyle(2, 0xFFFFFF, 1);
opponentHealthBar.strokeRect(width - 220, 20, 200, 20);

// Label
const opponentLabel = this.add.text(width - 220, 45, 'OPPONENT', {
  fontFamily: 'PressStart2P',
  fontSize: '10px',
  color: '#FFFFFF',
});

// RAW HP TEXT (MANDATORY)
const opponentHpText = this.add.text(width - 120, 22, `${opponentHP}/${maxHP}`, {
  fontFamily: 'PressStart2P',
  fontSize: '8px',
  color: '#FFFFFF',
});
```

#### Round Timer (Top Center)
```javascript
const roundText = this.add.text(width / 2, 20, 'ROUND 1', {
  fontFamily: 'PressStart2P',
  fontSize: '12px',
  color: '#FFFF00',  // Yellow
  align: 'center',
}).setOrigin(0.5, 0);

const timerText = this.add.text(width / 2, 40, '0:59', {
  fontFamily: 'PressStart2P',
  fontSize: '16px',
  color: '#FFFFFF',
  align: 'center',
}).setOrigin(0.5, 0);
```

#### Energy Meter (Bottom - RAW DATA)
```javascript
const energyBar = this.add.graphics();
energyBar.fillStyle(0x00FF00, 1);  // Green
energyBar.fillRect(20, height - 40, (currentEnergy / maxEnergy) * 400, 20);

// Border
energyBar.lineStyle(2, 0xFFFFFF, 1);
energyBar.strokeRect(20, height - 40, 400, 20);

// Label with RAW VALUE (MANDATORY)
const energyLabel = this.add.text(20, height - 60, `ENERGY: ${currentEnergy}/${maxEnergy}`, {
  fontFamily: 'PressStart2P',
  fontSize: '10px',
  color: '#FFFFFF',
});

// Steps display (RAW DATA)
const stepsText = this.add.text(width - 200, height - 60, `Steps: ${steps}`, {
  fontFamily: 'PressStart2P',
  fontSize: '10px',
  color: '#FFFFFF',
});
```

### 3. Control Overlay (React Native - DMG Palette)

#### D-Pad (Left Side)
```typescript
{
  position: 'absolute',
  left: 40,
  bottom: 60,
  width: 120,
  height: 120,
}

// D-Pad Button (Individual) - DMG PALETTE
{
  position: 'absolute',
  width: 44,                        // MANDATORY: Touch target
  height: 44,                       // MANDATORY: Touch target
  backgroundColor: 'rgba(139, 172, 15, 0.6)',  // #8BAC0F at 60%
  borderWidth: 2,
  borderColor: 'rgba(15, 56, 15, 0.8)',        // #0F380F at 80%
  borderRadius: 0,                 // MANDATORY: No rounded corners
  justifyContent: 'center',
  alignItems: 'center',
}

// Button positions
const dPadButtons = {
  up: { top: 0, left: 38 },
  down: { bottom: 0, left: 38 },
  left: { top: 38, left: 0 },
  right: { top: 38, right: 0 },
};

// Arrow icons
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 12,
  color: 'rgba(15, 56, 15, 0.9)',  // #0F380F at 90%
}
```

#### Action Buttons (Right Side) - DMG Palette
```typescript
{
  position: 'absolute',
  right: 40,
  bottom: 60,
  width: 180,
  height: 120,
}

// Action Button (Individual)
{
  width: 50,
  height: 50,
  backgroundColor: 'rgba(139, 172, 15, 0.6)',  // #8BAC0F at 60%
  borderWidth: 2,
  borderColor: 'rgba(15, 56, 15, 0.8)',
  borderRadius: 0,                 // MANDATORY: No rounded corners (NOT circular)
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: 44,                    // MANDATORY: Touch target
  minHeight: 44,                   // MANDATORY: Touch target
}

// Button Grid Layout
const actionButtons = [
  { id: 'LP', label: 'LP', position: { top: 0, left: 0 } },
  { id: 'MP', label: 'MP', position: { top: 0, left: 60 } },
  { id: 'HP', label: 'HP', position: { top: 0, left: 120 } },
  { id: 'LK', label: 'LK', position: { bottom: 0, left: 0 } },
  { id: 'MK', label: 'MK', position: { bottom: 0, left: 60 } },
  { id: 'HK', label: 'HK', position: { bottom: 0, left: 120 } },
];

// Button Label
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 8,
  color: 'rgba(15, 56, 15, 0.9)',  // #0F380F at 90%
}
```

---

## Usability Compliance

> **Reference**: front-end-spec.md "Usability Traps Prevention" section

### Trap 1: Information Density ✅
- **Compliance**: All combat stats show raw numerical values
- **Implementation**:
  - HP: "80/100" format (not just bar)
  - Energy: "50/100" format (not just bar)
  - Steps: Actual count visible
  - Timer: MM:SS format

### Trap 2: AI Summaries ✅
- **Compliance**: No AI commentary during battle
- **Implementation**: Pure numeric feedback, no "Great job!" messages

### Trap 3: Punishment Mechanics ✅
- **Compliance**: Training Dummy is forgiving
- **Implementation**:
  - Tutorial mode: Cannot fail (dummy never defeats player)
  - Real battles: No "You lost!" shaming, neutral "Battle Complete"
  - No comparison to other players
  - Helpful hints after 5 failed attempts (not criticism)

### Trap 4: Onboarding Overload ✅
- **Compliance**: Controls introduced progressively
- **Implementation**: Tutorial introduces one move at a time

### Trap 5: Feature Labyrinths ✅
- **Compliance**: Pause menu has 3 options max
- **Implementation**: Resume, Restart, Quit - clear choices

---

## Touch Target Requirements

| Element | Visual Size | Touch Target | Compliant |
|---------|-------------|--------------|-----------|
| D-Pad Up | 44×44dp | 44×44dp | ✅ |
| D-Pad Down | 44×44dp | 44×44dp | ✅ |
| D-Pad Left | 44×44dp | 44×44dp | ✅ |
| D-Pad Right | 44×44dp | 44×44dp | ✅ |
| LP Button | 50×50dp | 50×50dp | ✅ |
| MP Button | 50×50dp | 50×50dp | ✅ |
| HP Button | 50×50dp | 50×50dp | ✅ |
| LK Button | 50×50dp | 50×50dp | ✅ |
| MK Button | 50×50dp | 50×50dp | ✅ |
| HK Button | 50×50dp | 50×50dp | ✅ |
| Pause Button | 44×44dp | 44×44dp | ✅ |

---

## Accessibility

### Screen Reader Announcements

```typescript
// Battle screen announcement
accessibilityLabel="Battle in progress. Player health: 80 of 100. Opponent health: 100 of 100. Round 1."
accessibilityRole="application"

// D-Pad buttons
accessibilityLabel="Move up"
accessibilityRole="button"
accessibilityHint="Press to jump"

accessibilityLabel="Move left"
accessibilityRole="button"
accessibilityHint="Press to move left"

// Action buttons
accessibilityLabel="Light punch"
accessibilityRole="button"
accessibilityHint="Quick attack with short range"

accessibilityLabel="Heavy kick"
accessibilityRole="button"
accessibilityHint="Powerful attack with longer recovery"

// Pause button
accessibilityLabel="Pause battle"
accessibilityRole="button"
accessibilityHint="Double tap to pause and see menu options"
```

### Focus Order
1. Pause Button (always accessible)
2. D-Pad Up
3. D-Pad Left
4. D-Pad Down
5. D-Pad Right
6. LP Button
7. MP Button
8. HP Button
9. LK Button
10. MK Button
11. HK Button

### Reduce Motion Support
```typescript
const prefersReducedMotion = useReducedMotion();

// Button press animation
const pressAnimation = prefersReducedMotion
  ? null  // Instant visual feedback
  : scaleDownAnimation;

// Camera shake on hit
const cameraShake = prefersReducedMotion
  ? false  // Disabled
  : true;

// Screen flash on hit
const screenFlash = prefersReducedMotion
  ? false  // Disabled (uses border highlight instead)
  : true;

// Combo text animation
const comboAnimation = prefersReducedMotion
  ? { duration: 0 }  // Instant
  : fadeInOutAnimation;
```

### Alternative Feedback for Reduce Motion
```typescript
// Instead of screen flash, use border highlight
if (prefersReducedMotion && isHit) {
  // Show thick border briefly
  showBorderHighlight('#FFFF00', 200);
}

// Instead of camera shake, use opacity pulse
if (prefersReducedMotion && isHeavyHit) {
  opacityPulse(0.8, 150);
}
```

---

## Bridge Communication

### React Native → Phaser (Input Commands)
```typescript
// Send input via WebSocket Bridge
const sendInput = (action: string, pressed: boolean) => {
  const message = msgpack.encode({
    type: 'INPUT',
    action,
    pressed,
    timestamp: Date.now(),
  });

  webSocketBridge.send(message);
};

// D-Pad example
<TouchableOpacity
  onPressIn={() => sendInput('MOVE_LEFT', true)}
  onPressOut={() => sendInput('MOVE_LEFT', false)}
  accessibilityLabel="Move left"
  accessibilityRole="button"
>
  {/* D-Pad Left */}
</TouchableOpacity>
```

### Phaser → React Native (Game Events)
```javascript
// Phaser sends game state updates
this.bridge.send({
  type: 'GAME_STATE',
  playerHP: this.player.hp,
  playerMaxHP: this.player.maxHP,
  opponentHP: this.opponent.hp,
  opponentMaxHP: this.opponent.maxHP,
  energy: this.player.energy,
  maxEnergy: this.player.maxEnergy,
  roundTime: this.roundTimer,
  combo: this.currentCombo,
});

// Battle complete
this.bridge.send({
  type: 'BATTLE_COMPLETE',
  result: 'victory',  // or 'continue_training' (neutral, no shame - never 'defeat')
  stats: {
    damage_dealt: 450,
    combos: 5,
    perfect_blocks: 3,
    // NOTE: No 'damage_taken' displayed (Trap 3 compliance)
  },
});
```

---

## State Variations

### Pre-Battle (Character Intro)
```
┌────────────────────────────────────┐
│                                    │
│         [Player Sprite]            │
│         Intro animation            │
│                                    │
│         VS                         │
│                                    │
│         [Opponent Sprite]          │
│         Intro animation            │
│                                    │
│         READY?                     │
│                                    │
│         [3... 2... 1... FIGHT!]    │
└────────────────────────────────────┘
```

### Pause Menu Overlay (DMG Palette)
```
┌────────────────────────────────────┐
│  [Battle scene dimmed 50%]         │
│  rgba(15, 56, 15, 0.5)             │
│                                    │
│   ╔═══════════════════════════╗   │ ← DMG palette
│   ║  PAUSED                   ║   │   Background: #9BBC0F
│   ║                           ║   │   Border: #0F380F
│   ║  ┌───────────────────┐    ║   │
│   ║  │   RESUME          │    ║   │ ← Touch: 44dp height
│   ║  └───────────────────┘    ║   │
│   ║  ┌───────────────────┐    ║   │
│   ║  │   RESTART         │    ║   │ ← Touch: 44dp height
│   ║  └───────────────────┘    ║   │
│   ║  ┌───────────────────┐    ║   │
│   ║  │   QUIT            │    ║   │ ← Touch: 44dp height
│   ║  └───────────────────┘    ║   │
│   ╚═══════════════════════════╝   │
└────────────────────────────────────┘
```

### Round End (Neutral Framing)
```
┌────────────────────────────────────┐
│                                    │
│         [Winner sprite]            │
│         Victory pose               │
│                                    │
│         PLAYER WINS!               │  ← Or "TRAINING COMPLETE" (neutral)
│                                    │
│         [Auto-advance 3s]          │
└────────────────────────────────────┘

// NOTE: No "YOU LOST" screen - use "continue_training" state with encouraging message
// Message: "Your champion is resting... time to train more!"
// Instead: "BATTLE COMPLETE" with stats
```

### Tutorial Hint (After 5 Attempts)
```
┌────────────────────────────────────┐
│                                    │
│   ╔═══════════════════════════╗   │
│   ║  TIP                      ║   │ ← Helpful, not critical
│   ║                           ║   │
│   ║  Try pressing LP + LK     ║   │
│   ║  together for a combo!    ║   │
│   ║                           ║   │
│   ║  ┌───────────────────┐    ║   │
│   ║  │   GOT IT!         │    ║   │
│   ║  └───────────────────┘    ║   │
│   ╚═══════════════════════════╝   │
└────────────────────────────────────┘
```

---

## Performance Targets

- ✅ 60fps average (90% consistency)
- ✅ <50ms input latency (touch → Phaser action)
- ✅ <150MB peak memory
- ✅ <10ms bridge communication latency

---

## Implementation Notes

### Phaser Scene Setup
```javascript
class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleScene' });
  }

  preload() {
    // Load sprites, backgrounds, sounds
    this.load.image('stage_bg', 'assets/stages/dojo.png');
    this.load.spritesheet('sean', 'assets/characters/sean.png', {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    // Check reduce motion preference from React Native
    this.prefersReducedMotion = this.registry.get('prefersReducedMotion');

    // Initialize bridge
    this.bridge = new BridgeClient('ws://localhost:8080');

    // Setup stage
    this.add.image(0, 0, 'stage_bg').setOrigin(0);

    // Create characters
    this.player = new Champion(this, 200, 300, 'sean');
    this.opponent = new Champion(this, 600, 300, 'dummy');

    // Setup HUD with RAW VALUES
    this.createHUD();

    // Listen for input from bridge
    this.bridge.on('INPUT', this.handleInput.bind(this));

    // Listen for reduce motion updates
    this.bridge.on('REDUCE_MOTION', (value) => {
      this.prefersReducedMotion = value;
    });
  }

  update(time, delta) {
    // Update game logic
    this.player.update(delta);
    this.opponent.update(delta);

    // Check collisions
    this.physics.overlap(
      this.player.hitbox,
      this.opponent.hurtbox,
      this.handleHit,
      null,
      this
    );

    // Update HUD with RAW VALUES
    this.updateHUD();
  }

  handleHit() {
    // Camera effects respect reduce motion
    if (!this.prefersReducedMotion) {
      this.cameras.main.flash(100, 255, 255, 255);
      this.cameras.main.shake(200, 0.01);
    } else {
      // Alternative: border highlight
      this.showBorderHighlight();
    }
  }
}
```

---

## Navigation

### Entry
- From Workout Complete Ceremony (FTUE)
- From Home Dashboard → Battle Tab (Daily Loop)
- Via "Cartridge Load" transition animation

### Exit
- To Victory Ceremony (win)
- To Home Dashboard (continue_training - encouraging framing, no separate screen)
- To Home Dashboard (quit via pause menu)

---

## Related Screens

- **Previous**: Cartridge Load Transition
- **Next**: Victory Ceremony OR Battle Complete Screen
- **Flow**: FTUE Phase 1 & Daily Engagement Loop

---

## Design System Compliance Checklist

- [x] SF2 palette documented exception for battle scene
- [x] Control overlay uses DMG palette (translucent)
- [x] Pause menu uses DMG palette (full)
- [x] No border radius on control buttons (`borderRadius: 0`)
- [x] Typography: Press Start 2P throughout
- [x] All touch targets ≥ 44×44dp
- [x] Screen reader labels on all interactive elements
- [x] Reduce Motion preference respected (alternative feedback)
- [x] Raw numerical data visible (HP, Energy, Steps)
- [x] No punishment messaging (neutral "Battle Complete")
- [x] Helpful hints after 5 attempts (not criticism)
- [x] Training Dummy cannot result in continue_training in tutorial

---

**Priority**: HIGH - Core combat experience
**Estimated Implementation**: 40-60 hours (Phaser + Bridge + Polish)
**Technical Risk**: HIGH (WebView performance, bridge latency)
