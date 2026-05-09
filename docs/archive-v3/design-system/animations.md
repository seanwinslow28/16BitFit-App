# 16BitFit Animation Specifications
## Version 1.0 | Foundation Document

This document defines the complete animation system for 16BitFit, including timing, easing functions, haptic feedback, and micro-interaction patterns designed to create a satisfying, retro-modern user experience.

---

## Animation Philosophy

### The Retro-Modern Balance
16BitFit animations honor both classic Game Boy aesthetics and modern mobile UX expectations:

- **Retro Elements**: Snappy transitions, frame-based sprite animations, chunky movements
- **Modern Elements**: Smooth 60fps performance, physics-based springs, subtle micro-interactions
- **Psychological Goal**: Create satisfying feedback loops that reward user actions and build habit formation

**Core Principle:** Every animation must serve a purpose (provide feedback, guide attention, or delight). No animation for animation's sake.

---

## Duration System

### The 100ms Rule
Based on research from Apple HIG and psychological studies on perceived responsiveness:
- **<100ms**: Feels instant, no perceived delay
- **100-300ms**: Noticeable but comfortable, standard UI transitions
- **300-500ms**: Deliberate, draws attention to important changes
- **500ms+**: Feels slow unless it's a celebration/reward moment

```javascript
duration: {
  instant:    0,      // No animation (accessibility, reduced motion preference)
  micro:      50,     // Extremely subtle (tooltip fade)
  fast:       100,    // Button press, checkbox toggle, micro-interactions
  normal:     200,    // Standard transitions, hover states, simple reveals
  moderate:   300,    // Screen transitions, success animations, modal open
  slow:       500,    // Dramatic reveals, onboarding moments
  epic:       800,    // Level-up celebrations, major achievements
  extended:   1200,   // Rare - complex multi-stage animations only
}
```

---

## Easing Functions

### Purpose-Driven Easing
Each easing curve creates a different emotional response:

```javascript
easing: {
  // Standard CSS Easing
  linear:       'linear',                          // Constant speed (rare, robotic feel)
  easeIn:       'cubic-bezier(0.4, 0, 1, 1)',     // Accelerate (element exits)
  easeOut:      'cubic-bezier(0, 0, 0.2, 1)',     // Decelerate (element enters) - MOST COMMON
  easeInOut:    'cubic-bezier(0.4, 0, 0.2, 1)',   // Smooth both ends (screen transitions)

  // Custom Retro Easing
  sharp:        'cubic-bezier(0.4, 0, 0.6, 1)',   // Fast snap (retro game feel)
  snappy:       'cubic-bezier(0.25, 0.1, 0.25, 1)', // Quick response (button press)

  // Spring Physics (Joyful, Playful)
  spring:       'cubic-bezier(0.34, 1.56, 0.64, 1)', // Bouncy overshoot (success moments)
  springGentle: 'cubic-bezier(0.5, 1.25, 0.75, 1)',  // Subtle bounce (hover effects)

  // Retro Game-Specific
  retroSnap:    'steps(4, end)',                  // 4-frame pixel art animation
  retroSlow:    'steps(8, end)',                  // 8-frame pixel art animation
  retroFast:    'steps(2, end)',                  // 2-frame pixel art animation
}
```

### When to Use Each Easing

| Easing | Use Case | Example |
|--------|----------|---------|
| **easeOut** | Elements entering screen | Modal opening, page transition in |
| **easeIn** | Elements exiting screen | Modal closing, page transition out |
| **easeInOut** | Symmetrical movements | Screen slide transitions, carousels |
| **sharp** | Retro snappy feel | Pixel button press, quick state changes |
| **snappy** | Responsive micro-interactions | Toggle switches, checkbox checks |
| **spring** | Success/achievement moments | Level-up animation, goal completion |
| **springGentle** | Subtle playful interactions | Hover scale effects, icon bounces |
| **retroSnap** | Pixel art sprite animations | Character walk cycles, 8-bit effects |
| **linear** | Continuous loops, loading | Spinner rotation, progress bars |

---

## Animation Patterns by Component

### Buttons

#### Primary Button Press (Pixel Art Style)
```javascript
buttonPress: {
  // Visual press-down effect
  scale: {
    from: 1,
    to: 0.95,
    duration: 100,
    easing: 'sharp',
  },
  // Subtle shadow shift (pixel shadow moves)
  shadowOffset: {
    from: { x: 4, y: 4 },
    to: { x: 2, y: 2 },
    duration: 100,
    easing: 'sharp',
  },
  // Release (spring back)
  release: {
    scale: 0.95,
    to: 1,
    duration: 100,
    easing: 'easeOut',
  },
}
```

**React Native Implementation:**
```javascript
import { Animated, Pressable } from 'react-native';

const PixelButton = ({ children, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(4)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnim, {
        toValue: 2,
        duration: 100,
        useNativeDriver: false, // Shadow doesn't support native driver
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnim, {
        toValue: 4,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          shadowOffset: { width: shadowAnim, height: shadowAnim },
        }}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};
```

---

#### Secondary Button Hover (Modern Style)
```javascript
buttonHover: {
  backgroundColor: {
    from: tokens.interactive.primary,
    to: tokens.interactive.hover,
    duration: 200,
    easing: 'easeOut',
  },
  scale: {
    from: 1,
    to: 1.05,
    duration: 200,
    easing: 'springGentle',
  },
}
```

---

### Screen Transitions

#### Slide Transition (Standard Navigation)
```javascript
slideTransition: {
  // New screen enters from right
  enter: {
    translateX: {
      from: '100%',  // Start off-screen right
      to: '0%',      // End at natural position
      duration: 300,
      easing: 'easeOut',
    },
    opacity: {
      from: 0.9,
      to: 1,
      duration: 300,
      easing: 'easeOut',
    },
  },
  // Current screen exits to left
  exit: {
    translateX: {
      from: '0%',
      to: '-30%',    // Slight parallax effect
      duration: 300,
      easing: 'easeIn',
    },
    opacity: {
      from: 1,
      to: 0.7,
      duration: 300,
      easing: 'easeIn',
    },
  },
}
```

**React Navigation Implementation:**
```javascript
const screenOptions = {
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 300,
        easing: Easing.out(Easing.ease),
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 300,
        easing: Easing.in(Easing.ease),
      },
    },
  },
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
      ],
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0.9, 1],
      }),
    },
  }),
};
```

---

#### Fade Transition (Subtle, Content-Focused)
```javascript
fadeTransition: {
  duration: 250,
  opacity: {
    from: 0,
    to: 1,
    easing: 'easeOut',
  },
  // Subtle scale for depth
  scale: {
    from: 0.98,
    to: 1,
    duration: 250,
    easing: 'easeOut',
  },
}
```

---

### Modal & Overlay Animations

#### Modal Open (Scale + Fade)
```javascript
modalOpen: {
  backdrop: {
    opacity: {
      from: 0,
      to: 0.8,
      duration: 200,
      easing: 'easeOut',
    },
  },
  modal: {
    scale: {
      from: 0.9,
      to: 1,
      duration: 300,
      easing: 'spring',  // Slight bounce for delight
    },
    opacity: {
      from: 0,
      to: 1,
      duration: 200,
      easing: 'easeOut',
    },
    translateY: {
      from: 50,  // Slide up slightly
      to: 0,
      duration: 300,
      easing: 'easeOut',
    },
  },
}
```

---

#### Toast Notification (Slide In from Top)
```javascript
toastNotification: {
  enter: {
    translateY: {
      from: -100,  // Start above screen
      to: 0,       // Stop at top edge
      duration: 300,
      easing: 'spring',  // Bouncy entrance
    },
    opacity: {
      from: 0,
      to: 1,
      duration: 200,
      easing: 'easeOut',
    },
  },
  exit: {
    translateY: {
      from: 0,
      to: -100,
      duration: 200,
      easing: 'easeIn',
    },
    opacity: {
      from: 1,
      to: 0,
      duration: 150,
      easing: 'easeIn',
    },
  },
  // Auto-dismiss after delay
  autoHideDuration: 3000,
}
```

---

### Form Elements

#### Input Focus State
```javascript
inputFocus: {
  borderWidth: {
    from: 3,
    to: 4,
    duration: 150,
    easing: 'easeOut',
  },
  borderColor: {
    from: tokens.border.default,
    to: tokens.border.focus,
    duration: 150,
    easing: 'easeOut',
  },
  // Subtle glow (for neon palettes)
  shadowOpacity: {
    from: 0,
    to: 0.3,
    duration: 150,
    easing: 'easeOut',
  },
}
```

---

#### Input Error Shake
```javascript
inputError: {
  // Classic error shake (left-right-left)
  translateX: [0, -10, 10, -10, 10, -5, 5, 0],
  duration: 500,
  easing: 'easeInOut',
  // Simultaneous color change
  borderColor: {
    from: tokens.border.default,
    to: tokens.feedback.error,
    duration: 200,
    easing: 'easeOut',
  },
}
```

**React Native Implementation:**
```javascript
const shakeAnimation = useRef(new Animated.Value(0)).current;

const triggerErrorShake = () => {
  Animated.sequence([
    Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnimation, { toValue: -5, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnimation, { toValue: 5, duration: 50, useNativeDriver: true }),
    Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
  ]).start();
};

<Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
  <TextInput {...props} />
</Animated.View>
```

---

#### Checkbox/Toggle Check
```javascript
checkboxCheck: {
  // Scale bounce
  scale: [1, 0.8, 1.2, 1],
  duration: 300,
  easing: 'spring',
  // Rotation for checkmark icon
  rotate: {
    from: '-45deg',
    to: '0deg',
    duration: 200,
    easing: 'easeOut',
  },
}
```

---

### Selection States

#### Archetype Card Selection (Story 1.4)
```javascript
archetypeSelection: {
  // Deselected → Selected
  select: {
    borderWidth: {
      from: 3,
      to: 4,
      duration: 150,
      easing: 'sharp',
    },
    borderColor: {
      from: tokens.border.default,
      to: tokens.border.highlight,
      duration: 150,
      easing: 'easeOut',
    },
    scale: {
      from: 1,
      to: 1.05,
      duration: 200,
      easing: 'springGentle',
    },
    // Neon glow effect (for Synthwave palette)
    shadowOpacity: {
      from: 0,
      to: 0.6,
      duration: 200,
      easing: 'easeOut',
    },
  },
  // Selected → Deselected
  deselect: {
    borderWidth: {
      from: 4,
      to: 3,
      duration: 150,
      easing: 'easeOut',
    },
    borderColor: {
      from: tokens.border.highlight,
      to: tokens.border.default,
      duration: 150,
      easing: 'easeOut',
    },
    scale: {
      from: 1.05,
      to: 1,
      duration: 150,
      easing: 'easeOut',
    },
    shadowOpacity: {
      from: 0.6,
      to: 0,
      duration: 150,
      easing: 'easeOut',
    },
  },
}
```

---

### Loading States

#### Spinner (Pixel Art Style)
```javascript
pixelSpinner: {
  // 4-frame rotation (90° steps)
  rotate: {
    from: '0deg',
    to: '360deg',
    duration: 800,  // 200ms per frame
    easing: 'steps(4, end)',  // retroSnap
    iterations: Infinity,
  },
}
```

**React Native Implementation:**
```javascript
const spinValue = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 800,
      easing: Easing.step0, // Step easing for retro look
      useNativeDriver: true,
    })
  ).start();
}, []);

const spin = spinValue.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg'],
});

<Animated.View style={{ transform: [{ rotate: spin }] }}>
  <PixelSpinnerIcon />
</Animated.View>
```

---

#### Progress Bar Fill
```javascript
progressBarFill: {
  width: {
    from: '0%',
    to: '[TARGET]%',  // Dynamic based on progress
    duration: 500,
    easing: 'easeOut',
  },
  // Color shift as progress increases
  backgroundColor: {
    from: tokens.feedback.warning,   // Yellow at 0-50%
    to: tokens.feedback.success,     // Green at 100%
    duration: 500,
    easing: 'easeOut',
  },
}
```

---

#### Skeleton Loading (Shimmer Effect)
```javascript
skeletonShimmer: {
  // Left-to-right shimmer gradient
  translateX: {
    from: '-100%',
    to: '100%',
    duration: 1500,
    easing: 'linear',
    iterations: Infinity,
  },
  opacity: [0.5, 1, 0.5],  // Pulse while shimmering
  duration: 1500,
  easing: 'easeInOut',
  iterations: Infinity,
}
```

---

### Success & Celebration Animations

#### Achievement Unlock (Epic Moment)
```javascript
achievementUnlock: {
  // Stage 1: Scale in with bounce (300ms)
  scaleIn: {
    scale: {
      from: 0,
      to: 1.1,
      duration: 300,
      easing: 'spring',  // Overshoot to 1.1
    },
    opacity: {
      from: 0,
      to: 1,
      duration: 200,
      easing: 'easeOut',
    },
  },
  // Stage 2: Settle to normal size (200ms)
  settle: {
    scale: {
      from: 1.1,
      to: 1,
      duration: 200,
      easing: 'easeOut',
    },
  },
  // Stage 3: Particle burst (500ms, simultaneous)
  particles: {
    scale: {
      from: 0.5,
      to: 2,
      duration: 500,
      easing: 'easeOut',
    },
    opacity: {
      from: 1,
      to: 0,
      duration: 500,
      easing: 'easeOut',
    },
    translateY: {
      from: 0,
      to: -50,  // Float upward
      duration: 500,
      easing: 'easeOut',
    },
  },
  // Total duration: 500ms (stages overlap)
  totalDuration: 500,
}
```

---

#### Level Up Animation
```javascript
levelUp: {
  // Number scale bounce
  numberScale: {
    scale: [0, 1.5, 1],
    duration: 500,
    easing: 'spring',
  },
  // Glow pulse
  glowPulse: {
    shadowOpacity: [0, 1, 0.5],
    duration: 800,
    easing: 'easeInOut',
  },
  // Confetti burst (random particles)
  confetti: {
    particles: 12,  // Number of confetti pieces
    initialVelocity: { min: 200, max: 400 },
    angle: { min: 60, max: 120 },  // Upward cone
    duration: 1200,
    gravity: 980,  // Pixels per second squared
  },
}
```

---

#### Success Checkmark
```javascript
successCheckmark: {
  // Draw checkmark path (SVG animation)
  strokeDashoffset: {
    from: 100,  // Fully hidden
    to: 0,      // Fully drawn
    duration: 300,
    easing: 'easeOut',
  },
  // Simultaneous circle scale
  circleScale: {
    scale: {
      from: 0,
      to: 1,
      duration: 300,
      easing: 'spring',
    },
  },
}
```

---

### Micro-Interactions

#### Icon Bounce (Attention Grabber)
```javascript
iconBounce: {
  // Quick attention bounce
  translateY: [0, -8, 0, -4, 0],
  duration: 500,
  easing: 'easeInOut',
}
```

---

#### Like/Heart Animation
```javascript
heartLike: {
  // Scale burst
  scale: [1, 1.3, 1.1],
  duration: 300,
  easing: 'spring',
  // Color change
  color: {
    from: tokens.text.secondary,
    to: tokens.pulse.heartbeat,  // Red
    duration: 200,
    easing: 'easeOut',
  },
}
```

---

#### Notification Badge Pulse
```javascript
badgePulse: {
  scale: [1, 1.2, 1],
  duration: 1000,
  easing: 'easeInOut',
  iterations: Infinity,  // Continuous pulse
  iterationDelay: 2000,  // 2s pause between pulses
}
```

---

## Haptic Feedback System

### Haptic Intensity Levels
Based on iOS UIImpactFeedbackGenerator and Android VibrationEffect:

```javascript
haptic: {
  // iOS: UIImpactFeedbackGenerator.light
  // Android: VibrationEffect.createOneShot(10, 50)
  light: {
    duration: 10,
    intensity: 'light',
    use: 'Selection changes, toggle switches, checkboxes',
  },

  // iOS: UIImpactFeedbackGenerator.medium
  // Android: VibrationEffect.createOneShot(20, 100)
  medium: {
    duration: 20,
    intensity: 'medium',
    use: 'Button taps, archetype selection, form submission',
  },

  // iOS: UIImpactFeedbackGenerator.heavy
  // Android: VibrationEffect.createOneShot(30, 150)
  heavy: {
    duration: 30,
    intensity: 'heavy',
    use: 'Success moments, level-ups, achievements',
  },

  // iOS: UINotificationFeedbackGenerator.success
  // Android: VibrationEffect.createWaveform([0, 50, 50, 100], -1)
  success: {
    pattern: [0, 50, 50, 100],  // Double pulse
    use: 'Profile created, workout completed, goal reached',
  },

  // iOS: UINotificationFeedbackGenerator.error
  // Android: VibrationEffect.createWaveform([0, 100, 100, 100], -1)
  error: {
    pattern: [0, 100, 100, 100],  // Triple buzz
    use: 'Form validation errors, failed actions',
  },

  // iOS: UINotificationFeedbackGenerator.warning
  // Android: VibrationEffect.createOneShot(40, 120)
  warning: {
    duration: 40,
    intensity: 'medium',
    use: 'Warnings, destructive actions, streak at risk',
  },
}
```

---

### Haptic Implementation (React Native)

```javascript
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const hapticOptions = {
  enableVibrateFallback: true,  // Android fallback
  ignoreAndroidSystemSettings: false,
};

// Light haptic (selection)
const triggerLightHaptic = () => {
  ReactNativeHapticFeedback.trigger('selection', hapticOptions);
};

// Medium haptic (button tap)
const triggerMediumHaptic = () => {
  ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);
};

// Heavy haptic (success)
const triggerHeavyHaptic = () => {
  ReactNativeHapticFeedback.trigger('impactHeavy', hapticOptions);
};

// Success notification
const triggerSuccessHaptic = () => {
  ReactNativeHapticFeedback.trigger('notificationSuccess', hapticOptions);
};

// Error notification
const triggerErrorHaptic = () => {
  ReactNativeHapticFeedback.trigger('notificationError', hapticOptions);
};

// Warning notification
const triggerWarningHaptic = () => {
  ReactNativeHapticFeedback.trigger('notificationWarning', hapticOptions);
};
```

---

### Haptic + Animation Pairing Guide

| Interaction | Animation | Haptic | Timing |
|-------------|-----------|--------|--------|
| Button press | Scale 0.95 (100ms) | Medium | Simultaneous with press |
| Archetype selection | Scale 1.05 + border (200ms) | Medium | Simultaneous with scale start |
| Checkbox toggle | Scale bounce (300ms) | Light | At peak of bounce (150ms in) |
| Form submission | Button press + modal open | Medium → Heavy | Medium on press, Heavy on success |
| Success animation | Checkmark draw (300ms) | Success (double pulse) | At checkmark completion |
| Error shake | Translate shake (500ms) | Error (triple buzz) | At start of shake |
| Level up | Scale + particles (800ms) | Heavy | At peak of scale (300ms in) |
| Achievement unlock | Multi-stage (500ms) | Success | At settle stage (300ms in) |

---

## Performance Optimization

### 60 FPS Target
All animations must maintain 60fps (16.67ms per frame) on mid-range devices.

**Rules for 60fps:**
1. ✅ **Use `useNativeDriver: true`** whenever possible
2. ✅ **Animate only transform and opacity** (GPU-accelerated properties)
3. ❌ **Avoid animating layout properties** (width, height, padding, margin)
4. ❌ **Avoid animating shadowOffset, shadowOpacity** (CPU-intensive on Android)
5. ✅ **Use `InteractionManager`** to defer non-critical animations

```javascript
// Good - GPU accelerated
Animated.timing(value, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true,  // ✅ Runs on GPU thread
}).start();

// Bad - CPU bound
Animated.timing(value, {
  toValue: 100,
  duration: 300,
  useNativeDriver: false,  // ❌ Blocks JS thread
}).start();
```

---

### Native Driver Compatibility

| Property | Native Driver Support | Alternative |
|----------|----------------------|-------------|
| `opacity` | ✅ Yes | - |
| `translateX/Y` | ✅ Yes | - |
| `scale` | ✅ Yes | - |
| `rotate` | ✅ Yes | - |
| `width/height` | ❌ No | Use `scaleX/scaleY` instead |
| `backgroundColor` | ❌ No | Swap elements or use opacity |
| `borderColor` | ❌ No | Swap elements or use overlay |
| `shadowOpacity` | ❌ No | Pre-render shadow states |

---

### Animation Cleanup
Always clean up animations to prevent memory leaks:

```javascript
useEffect(() => {
  const animation = Animated.loop(
    Animated.timing(value, { toValue: 1, duration: 1000, useNativeDriver: true })
  );
  animation.start();

  // Cleanup on unmount
  return () => {
    animation.stop();
  };
}, []);
```

---

### Reduced Motion Accessibility

Respect user's accessibility preferences:

```javascript
import { AccessibilityInfo } from 'react-native';

const [reduceMotion, setReduceMotion] = useState(false);

useEffect(() => {
  AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
    setReduceMotion(enabled);
  });

  const subscription = AccessibilityInfo.addEventListener(
    'reduceMotionChanged',
    setReduceMotion
  );

  return () => {
    subscription.remove();
  };
}, []);

// Use instant transitions when reduce motion is enabled
const animationDuration = reduceMotion ? 0 : 300;

Animated.timing(value, {
  toValue: 1,
  duration: animationDuration,
  useNativeDriver: true,
}).start();
```

---

## Animation Patterns by Screen (Story 1.4)

### Welcome Screen

#### Page Load
```javascript
welcomeScreenEnter: {
  // Logo fade + scale
  logo: {
    opacity: { from: 0, to: 1, duration: 400, easing: 'easeOut' },
    scale: { from: 0.9, to: 1, duration: 400, easing: 'easeOut' },
    delay: 0,
  },
  // Tagline fade
  tagline: {
    opacity: { from: 0, to: 1, duration: 300, easing: 'easeOut' },
    translateY: { from: 20, to: 0, duration: 300, easing: 'easeOut' },
    delay: 200,  // Stagger after logo
  },
  // CTA button fade + scale
  ctaButton: {
    opacity: { from: 0, to: 1, duration: 300, easing: 'easeOut' },
    scale: { from: 0.95, to: 1, duration: 300, easing: 'springGentle' },
    delay: 400,  // Stagger after tagline
  },
  // Total staggered duration: ~700ms
}
```

---

### Profile Setup Screen

#### Input Focus Flow
```javascript
profileInputFlow: {
  // Label highlight
  labelHighlight: {
    color: { from: tokens.text.secondary, to: tokens.text.primary, duration: 150 },
    scale: { from: 1, to: 1.05, duration: 150, easing: 'easeOut' },
  },
  // Input border expand
  inputFocus: {
    borderWidth: { from: 3, to: 4, duration: 150 },
    borderColor: { from: tokens.border.default, to: tokens.border.focus, duration: 150 },
  },
  // Haptic feedback
  haptic: 'light',
}
```

---

#### Validation Success
```javascript
validationSuccess: {
  // Green checkmark icon slide in from right
  checkmark: {
    translateX: { from: 20, to: 0, duration: 200, easing: 'easeOut' },
    opacity: { from: 0, to: 1, duration: 200, easing: 'easeOut' },
    scale: { from: 0.8, to: 1, duration: 200, easing: 'springGentle' },
  },
  // Input border color change
  inputBorder: {
    borderColor: { from: tokens.border.focus, to: tokens.feedback.success, duration: 200 },
  },
  // Haptic feedback
  haptic: 'light',
}
```

---

### Archetype Selection Screen

#### Card Grid Entrance (Staggered)
```javascript
archetypeGridEnter: {
  card1: {
    opacity: { from: 0, to: 1, duration: 250, easing: 'easeOut' },
    translateY: { from: 30, to: 0, duration: 250, easing: 'easeOut' },
    delay: 0,
  },
  card2: {
    opacity: { from: 0, to: 1, duration: 250, easing: 'easeOut' },
    translateY: { from: 30, to: 0, duration: 250, easing: 'easeOut' },
    delay: 50,  // 50ms stagger
  },
  card3: {
    delay: 100,  // 50ms stagger
  },
  card4: {
    delay: 150,  // 50ms stagger
  },
  card5: {
    delay: 200,  // 50ms stagger
  },
  // Total staggered duration: ~450ms
}
```

---

#### Archetype Selection Interaction
```javascript
archetypeSelect: {
  // Deselect previous card
  previousCard: {
    scale: { from: 1.05, to: 1, duration: 150, easing: 'easeOut' },
    borderColor: { from: tokens.border.highlight, to: tokens.border.default, duration: 150 },
    shadowOpacity: { from: 0.6, to: 0, duration: 150 },
  },
  // Select new card
  newCard: {
    scale: { from: 1, to: 1.05, duration: 200, easing: 'springGentle' },
    borderColor: { from: tokens.border.default, to: tokens.border.highlight, duration: 150 },
    shadowOpacity: { from: 0, to: 0.6, duration: 200 },
  },
  // Haptic feedback
  haptic: 'medium',
  // Both animations run in parallel (150-200ms total)
}
```

---

## Sound Effects (Optional Enhancement)

While not part of the core MVP, sound effects can be paired with animations:

```javascript
soundEffects: {
  buttonPress:     'click.mp3',       // 8-bit click (50ms)
  buttonRelease:   'release.mp3',     // Subtle pop (30ms)
  selection:       'select.mp3',      // Retro menu select (100ms)
  success:         'success.mp3',     // Success jingle (500ms)
  error:           'error.mp3',       // Error buzz (300ms)
  levelUp:         'levelup.mp3',     // Achievement fanfare (1200ms)
  notification:    'notification.mp3', // Gentle chime (200ms)
}
```

**Implementation Note:** Use `react-native-sound` or `expo-av` with very short, compressed audio files (<50KB each).

---

## Testing Animations

### Manual Testing Checklist
- [ ] All animations complete in stated duration
- [ ] No jank/stuttering on mid-range devices (60fps)
- [ ] Haptics fire at correct moments
- [ ] Reduced motion preference disables animations
- [ ] Animations feel purposeful, not distracting
- [ ] Staggered animations have pleasant rhythm
- [ ] No animation "pops" or sudden jumps

### Performance Testing
```javascript
// Measure frame drops
import { PerformanceObserver } from 'react-native';

const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.duration > 16.67) {
      console.warn('Frame drop detected:', entry.duration);
    }
  });
});

observer.observe({ entryTypes: ['measure'] });
```

---

## Next Steps

1. ✅ **Design Tokens Complete**
2. ✅ **Typography System Complete**
3. ✅ **Animation Specifications Complete** (This Document)
4. ⏭️ **Atomic Components Spec** (Buttons, inputs, sprites, borders)
5. ⏭️ **Molecular Components Spec** (Cards, progress indicators)
6. ⏭️ **Organism Components Spec** (Screen layouts, navigation)

---

## Version History
- **v1.0** (2025-10-31): Initial animation specifications - duration system, easing functions, component patterns, haptic feedback, performance optimization, Story 1.4 screen animations.

---

**Document Owner:** UI/UX Specialist (Sally)
**Approved By:** Architect (Pending)
**Last Updated:** 2025-10-31
