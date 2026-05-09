# 16BitFit Atomic Components Specification
## Version 1.0 | Component Library - Atoms

This document defines the atomic-level components (smallest building blocks) for 16BitFit. These are indivisible UI elements that cannot be broken down further while maintaining their function.

**Atomic Design Principle:** Atoms are the foundational elements. They combine to form molecules, which combine to form organisms, which create complete screens.

---

## Component Index

1. [PixelButton](#pixelbutton) - Primary interactive element
2. [PixelText](#pixeltext) - Typography wrapper
3. [PixelSprite](#pixelsprite) - Image/icon container
4. [PixelBorder](#pixelborder) - Retro border wrapper
5. [PixelInput](#pixelinput) - Text input field
6. [PixelIcon](#pixelicon) - Small UI icons
7. [PixelDivider](#pixeldivider) - Content separator
8. [PixelBadge](#pixelbadge) - Notification indicator
9. [PixelProgressBar](#pixelprogressbar) - Progress indicator
10. [PixelCheckbox](#pixelcheckbox) - Toggle/selection control

---

## 1. PixelButton

### Purpose
Primary interactive element for user actions (CTAs, form submissions, navigation).

### Variants

#### Primary Button (Pixel Art Style)
**Use Case:** Main CTAs, important actions ("Get Started", "Continue", "Create Account")

**Visual Specifications:**
```javascript
pixelButtonPrimary: {
  // Dimensions
  minWidth: 160,
  minHeight: 48,
  paddingX: 24,  // tokens.spacing[3]
  paddingY: 16,  // tokens.spacing[2]

  // Border
  borderWidth: 4,
  borderRadius: 0,  // Pure retro - no rounding
  borderColor: tokens.interactive.primary,

  // Background
  backgroundColor: tokens.interactive.primary,

  // Text
  fontFamily: typography.buttonPrimary.fontFamily,  // Press Start 2P
  fontSize: 16,
  textTransform: 'uppercase',
  color: tokens.text.inverse,  // Dark text on bright button

  // Shadow (Pixel Shadow)
  shadowOffset: { x: 4, y: 4 },
  shadowColor: tokens.background.primary,
  shadowOpacity: 1,
  shadowRadius: 0,  // Hard pixel shadow

  // Touch Target
  minTouchTarget: 48,  // Apple HIG minimum
}
```

**States:**

```javascript
states: {
  // Default (resting state)
  default: {
    scale: 1,
    opacity: 1,
    shadowOffset: { x: 4, y: 4 },
  },

  // Pressed (active)
  pressed: {
    scale: 0.95,
    opacity: 1,
    shadowOffset: { x: 2, y: 2 },  // Shadow moves closer
    animation: {
      duration: 100,
      easing: 'sharp',
    },
  },

  // Hover (web/tablet with pointer)
  hover: {
    scale: 1,
    opacity: 0.9,
    borderWidth: 5,  // Slightly thicker
    animation: {
      duration: 150,
      easing: 'easeOut',
    },
  },

  // Disabled
  disabled: {
    scale: 1,
    opacity: 0.4,
    backgroundColor: tokens.interactive.disabled,
    borderColor: tokens.interactive.disabled,
    shadowOpacity: 0.3,
  },

  // Loading
  loading: {
    opacity: 0.8,
    // Show spinner, hide text
  },
}
```

**React Native Implementation:**

```tsx
import React, { useRef } from 'react';
import { TouchableOpacity, Animated, Text, View, ActivityIndicator } from 'react-native';
import { typography, tokens, animations } from '@/design-system';

interface PixelButtonProps {
  onPress: () => void;
  children: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  haptic?: boolean;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  onPress,
  children,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  haptic = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(4)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shadowAnim, {
        toValue: 2,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();

    if (haptic) {
      triggerMediumHaptic();
    }
  };

  const handlePressOut = () => {
    if (disabled || loading) return;

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
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
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={1}
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      <Animated.View
        style={[
          styles.button,
          styles[variant],
          {
            transform: [{ scale: scaleAnim }],
            shadowOffset: {
              width: shadowAnim,
              height: shadowAnim,
            },
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={tokens.text.inverse} size="small" />
        ) : (
          <Text style={[typography.buttonPrimary, styles.text]}>
            {children}
          </Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  button: {
    minWidth: 160,
    minHeight: 48,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderWidth: 4,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    shadowRadius: 0,
    shadowOpacity: 1,
  },
  primary: {
    backgroundColor: tokens.interactive.primary,
    borderColor: tokens.interactive.primary,
    shadowColor: tokens.background.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: tokens.interactive.primary,
    shadowColor: tokens.interactive.primary,
  },
  tertiary: {
    backgroundColor: 'transparent',
    borderColor: tokens.border.default,
    shadowColor: 'transparent',
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    color: tokens.text.inverse,
  },
});
```

---

#### Secondary Button (Outlined Style)
**Use Case:** Secondary actions, back buttons, cancel actions

**Visual Specifications:**
```javascript
pixelButtonSecondary: {
  // Same dimensions as primary
  minWidth: 160,
  minHeight: 48,
  paddingX: 24,
  paddingY: 16,

  // Border
  borderWidth: 4,
  borderRadius: 0,
  borderColor: tokens.interactive.primary,

  // Background
  backgroundColor: 'transparent',

  // Text
  fontFamily: typography.buttonSecondary.fontFamily,  // Montserrat SemiBold
  fontSize: 16,
  fontWeight: '600',
  letterSpacing: 0.4,  // 0.025em * 16px
  color: tokens.interactive.primary,

  // Shadow (Pixel Shadow on Border)
  shadowOffset: { x: 3, y: 3 },
  shadowColor: tokens.interactive.primary,
  shadowOpacity: 0.5,
  shadowRadius: 0,
}
```

---

#### Tertiary Button (Text-Only)
**Use Case:** Low-priority actions, "Skip for now", "Learn more"

**Visual Specifications:**
```javascript
pixelButtonTertiary: {
  // Minimal dimensions
  minWidth: 'auto',
  minHeight: 44,
  paddingX: 16,
  paddingY: 12,

  // Border (subtle or none)
  borderWidth: 0,
  borderRadius: 0,

  // Background
  backgroundColor: 'transparent',

  // Text
  fontFamily: typography.link.fontFamily,  // Montserrat Medium
  fontSize: 14,
  fontWeight: '500',
  textDecoration: 'underline',
  color: tokens.interactive.primary,

  // No shadow
  shadowOpacity: 0,
}
```

---

#### Icon Button (Square, Icon Only)
**Use Case:** Back buttons, close buttons, icon-only actions

**Visual Specifications:**
```javascript
pixelButtonIcon: {
  // Square dimensions
  width: 48,
  height: 48,
  padding: 12,

  // Border
  borderWidth: 3,
  borderRadius: 0,
  borderColor: tokens.border.default,

  // Background
  backgroundColor: tokens.background.elevated,

  // Icon
  iconSize: 24,
  iconColor: tokens.text.primary,

  // Shadow
  shadowOffset: { x: 3, y: 3 },
  shadowColor: tokens.background.primary,
  shadowOpacity: 1,
  shadowRadius: 0,
}
```

---

### Accessibility

```javascript
accessibility: {
  role: 'button',
  minTouchTarget: 44,  // Minimum 44×44px
  label: '[Action description]',  // e.g., "Get Started"
  hint: '[Result description]',   // e.g., "Takes you to profile setup"
  state: {
    disabled: boolean,
    busy: boolean,  // When loading
  },
  // Support for screen readers
  accessibilityLabel: 'Descriptive button label',
  accessibilityHint: 'Explains what happens when pressed',
}
```

---

### MagicPath.ai Prompt
```
Pixel art button for retro fitness app.
Rectangle shape, zero border-radius.
4px solid border in bright accent color (#8BAC0F or #00D0FF).
Background filled with same accent color.
Text: "GET STARTED" in Press Start 2P font, 16px, uppercase, dark text.
Hard pixel shadow: 4px offset bottom-right, solid dark color.
Minimum size: 160×48px.
Touch-friendly for mobile (48px height minimum).
```

---

### 21st.dev/magic Prompt
```
/ui Retro pixel art button component for React Native
4px solid border, zero border-radius
Press-in animation: scale down to 0.95, shadow shifts from 4px to 2px (100ms sharp easing)
Variants: primary (filled), secondary (outlined), tertiary (text only)
Minimum 48px height for touch accessibility
Press Start 2P font for primary, Montserrat SemiBold for secondary
Support disabled and loading states with spinner
```

---

## 2. PixelText

### Purpose
Typography wrapper component that enforces design system font styles.

### Variants

```javascript
pixelTextVariants: {
  h1:         typography.h1,          // Press Start 2P, 32px
  h2:         typography.h2,          // Press Start 2P, 24px
  h3:         typography.h3,          // Press Start 2P, 16px
  body:       typography.body,        // Montserrat, 16px
  bodyLarge:  typography.bodyLarge,   // Montserrat, 18px
  bodySmall:  typography.bodySmall,   // Montserrat, 14px
  caption:    typography.caption,     // Montserrat, 12px
  label:      typography.inputLabel,  // Montserrat SemiBold, 14px
}
```

### React Native Implementation

```tsx
import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { typography, tokens } from '@/design-system';

interface PixelTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'bodyLarge' | 'bodySmall' | 'caption' | 'label';
  color?: string;
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
}

export const PixelText: React.FC<PixelTextProps> = ({
  variant = 'body',
  color,
  align = 'left',
  children,
  style,
  ...props
}) => {
  return (
    <Text
      style={[
        typography[variant],
        { textAlign: align },
        color && { color },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
```

### Usage Example
```tsx
<PixelText variant="h1" align="center">
  WELCOME TO 16BITFIT
</PixelText>

<PixelText variant="body" color={tokens.text.secondary}>
  Your fitness journey starts here.
</PixelText>
```

---

## 3. PixelSprite

### Purpose
Container for pixel art images, icons, and character sprites with proper scaling and rendering.

### Variants

```javascript
pixelSpriteVariants: {
  tiny:   { size: 16, use: 'Small icons, list bullets' },
  small:  { size: 24, use: 'UI icons, navigation' },
  medium: { size: 32, use: 'Feature icons, button icons' },
  large:  { size: 48, use: 'Large icons, empty states' },
  xl:     { size: 64, use: 'Large features' },
  xxl:    { size: 80, use: 'Archetype avatars (Story 1.4)' },
  hero:   { size: 96, use: 'Splash screens' },
}
```

### Visual Specifications

```javascript
pixelSprite: {
  // Dimensions (always square)
  width: [size],
  height: [size],

  // Image rendering (crisp pixel art)
  resizeMode: 'pixelated',  // Nearest-neighbor scaling
  imageRendering: 'pixelated',  // CSS for web

  // No smoothing/interpolation
  interpolationQuality: 'none',

  // Border (optional, for framed sprites)
  borderWidth: 0,
  borderColor: 'transparent',

  // Background (optional)
  backgroundColor: 'transparent',
}
```

### React Native Implementation

```tsx
import React from 'react';
import { Image, ImageProps, View, StyleSheet } from 'react-native';

interface PixelSpriteProps extends Omit<ImageProps, 'style'> {
  source: any;
  size?: 16 | 24 | 32 | 48 | 64 | 80 | 96;
  bordered?: boolean;
  borderColor?: string;
}

export const PixelSprite: React.FC<PixelSpriteProps> = ({
  source,
  size = 32,
  bordered = false,
  borderColor = tokens.border.default,
  ...props
}) => {
  return (
    <View
      style={[
        styles.container,
        { width: size, height: size },
        bordered && { borderWidth: 3, borderColor },
      ]}
    >
      <Image
        source={source}
        style={[styles.image, { width: size, height: size }]}
        resizeMode="pixelated"  // iOS: Nearest-neighbor scaling
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    // Crisp pixel rendering
    imageRendering: 'pixelated',  // Web
  },
});
```

### Pixel Art Export Requirements

```javascript
spriteExportSpecs: {
  format: 'PNG-8',  // 8-bit PNG for retro palette
  colorDepth: 8,    // 256 colors maximum
  transparency: true,
  compression: 'lossless',

  // Size requirements (exact dimensions)
  dimensions: {
    tiny:   '16×16px',
    small:  '24×24px',
    medium: '32×32px',
    large:  '48×48px',
    xl:     '64×64px',
    xxl:    '80×80px',
    hero:   '96×96px',
  },

  // DPI
  resolution: 72,  // Standard screen resolution

  // No smoothing in export
  interpolation: 'nearest-neighbor',
}
```

---

## 4. PixelBorder

### Purpose
Reusable border wrapper that adds retro pixel-perfect borders around content.

### Visual Specifications

```javascript
pixelBorder: {
  // Border
  borderWidth: 3,  // Default retro border
  borderRadius: 0,
  borderColor: tokens.border.default,
  borderStyle: 'solid',

  // Padding (creates space inside border)
  padding: 16,  // tokens.spacing[2]

  // Background
  backgroundColor: tokens.background.elevated,

  // Optional shadow
  shadowOffset: { x: 4, y: 4 },
  shadowColor: tokens.background.primary,
  shadowOpacity: 1,
  shadowRadius: 0,
}
```

### React Native Implementation

```tsx
import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { tokens } from '@/design-system';

interface PixelBorderProps extends ViewProps {
  children: React.ReactNode;
  borderWidth?: 2 | 3 | 4 | 6;
  borderColor?: string;
  padding?: number;
  shadow?: boolean;
}

export const PixelBorder: React.FC<PixelBorderProps> = ({
  children,
  borderWidth = 3,
  borderColor = tokens.border.default,
  padding = 16,
  shadow = true,
  style,
  ...props
}) => {
  return (
    <View
      style={[
        styles.border,
        {
          borderWidth,
          borderColor,
          padding,
        },
        shadow && styles.shadow,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  border: {
    borderRadius: 0,
    borderStyle: 'solid',
    backgroundColor: tokens.background.elevated,
  },
  shadow: {
    shadowOffset: { width: 4, height: 4 },
    shadowColor: tokens.background.primary,
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,  // Android: disable soft shadow
  },
});
```

### Usage Example
```tsx
<PixelBorder borderWidth={4} borderColor={tokens.border.highlight}>
  <PixelText variant="body">Content inside retro border</PixelText>
</PixelBorder>
```

---

## 5. PixelInput

### Purpose
Text input field with retro terminal styling for forms.

### Visual Specifications

```javascript
pixelInput: {
  // Dimensions
  minHeight: 48,
  paddingX: 16,
  paddingY: 16,

  // Border
  borderWidth: 3,
  borderRadius: 0,
  borderColor: tokens.border.default,

  // Background
  backgroundColor: tokens.background.primary,

  // Text
  fontFamily: typography.inputText.fontFamily,  // Montserrat
  fontSize: 16,
  lineHeight: 24,
  color: tokens.text.primary,

  // Placeholder
  placeholderTextColor: tokens.text.tertiary,

  // No shadow (flat input style)
  shadowOpacity: 0,
}
```

### States

```javascript
inputStates: {
  // Default
  default: {
    borderWidth: 3,
    borderColor: tokens.border.default,
  },

  // Focused
  focused: {
    borderWidth: 4,
    borderColor: tokens.border.focus,
    shadowOffset: { x: 0, y: 0 },
    shadowColor: tokens.border.focus,
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  // Error
  error: {
    borderWidth: 3,
    borderColor: tokens.feedback.error,
    // Shake animation on error trigger
  },

  // Success
  success: {
    borderWidth: 3,
    borderColor: tokens.feedback.success,
  },

  // Disabled
  disabled: {
    borderColor: tokens.border.default,
    backgroundColor: tokens.background.elevated,
    opacity: 0.5,
  },
}
```

### React Native Implementation

```tsx
import React, { useState, useRef } from 'react';
import { TextInput, View, Animated, StyleSheet, TextInputProps } from 'react-native';
import { tokens, typography } from '@/design-system';
import { PixelText } from './PixelText';

interface PixelInputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  successText?: string;
  error?: boolean;
  success?: boolean;
}

export const PixelInput: React.FC<PixelInputProps> = ({
  label,
  helperText,
  errorText,
  successText,
  error = false,
  success = false,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    triggerLightHaptic();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // Trigger shake animation when error prop changes to true
  React.useEffect(() => {
    if (error) {
      triggerErrorShake();
    }
  }, [error]);

  const triggerErrorShake = () => {
    triggerErrorHaptic();
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const getBorderColor = () => {
    if (error) return tokens.feedback.error;
    if (success) return tokens.feedback.success;
    if (isFocused) return tokens.border.focus;
    return tokens.border.default;
  };

  const getBorderWidth = () => {
    return isFocused ? 4 : 3;
  };

  return (
    <View style={styles.container}>
      {label && (
        <PixelText variant="label" style={styles.label}>
          {label}
        </PixelText>
      )}

      <Animated.View
        style={[
          styles.inputWrapper,
          {
            borderColor: getBorderColor(),
            borderWidth: getBorderWidth(),
            transform: [{ translateX: shakeAnim }],
          },
        ]}
      >
        <TextInput
          style={[styles.input, typography.inputText, style]}
          placeholderTextColor={tokens.text.tertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </Animated.View>

      {error && errorText && (
        <PixelText variant="caption" color={tokens.feedback.error} style={styles.helperText}>
          {errorText}
        </PixelText>
      )}

      {success && successText && (
        <PixelText variant="caption" color={tokens.feedback.success} style={styles.helperText}>
          {successText}
        </PixelText>
      )}

      {!error && !success && helperText && (
        <PixelText variant="caption" color={tokens.text.secondary} style={styles.helperText}>
          {helperText}
        </PixelText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  inputWrapper: {
    borderRadius: 0,
    backgroundColor: tokens.background.primary,
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  helperText: {
    marginTop: 8,
  },
});
```

---

## 6. PixelIcon

### Purpose
Small UI icons (navigation, actions, status indicators).

### Variants

```javascript
pixelIconSizes: {
  xs:     16,  // Inline icons
  sm:     20,  // Small UI icons
  md:     24,  // Standard icons (default)
  lg:     32,  // Large icons
}
```

### Implementation Options

**Option A: SVG Icons (Scalable)**
```tsx
import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface PixelIconProps {
  name: 'heart' | 'star' | 'arrow' | 'check' | 'close';
  size?: 16 | 20 | 24 | 32;
  color?: string;
}

export const PixelIcon: React.FC<PixelIconProps> = ({
  name,
  size = 24,
  color = tokens.text.primary,
}) => {
  const icons = {
    heart: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    // ... other icon paths
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={icons[name]} fill={color} />
    </Svg>
  );
};
```

**Option B: Pixel Art PNG Icons (Authentic)**
```tsx
import React from 'react';
import { Image } from 'react-native';

interface PixelIconProps {
  name: string;
  size?: 16 | 20 | 24 | 32;
  tintColor?: string;
}

export const PixelIcon: React.FC<PixelIconProps> = ({
  name,
  size = 24,
  tintColor,
}) => {
  const iconSource = require(`@/assets/icons/pixel-${name}.png`);

  return (
    <Image
      source={iconSource}
      style={{ width: size, height: size, tintColor }}
      resizeMode="pixelated"
    />
  );
};
```

### Icon Library (Minimum Set for Story 1.4)
```javascript
requiredIcons: [
  'arrow-right',    // Navigation
  'arrow-left',     // Back button
  'check',          // Success, validation
  'close',          // Close modal, dismiss
  'error',          // Error state
  'info',           // Information
  'user',           // Profile
  'heart',          // Health/fitness
  'star',           // Achievement
  'settings',       // Settings
]
```

---

## 7. PixelDivider

### Purpose
Visual separator between content sections.

### Visual Specifications

```javascript
pixelDivider: {
  // Dimensions
  height: 3,  // Chunky retro line
  width: '100%',

  // Color
  backgroundColor: tokens.border.default,

  // Spacing
  marginVertical: 24,  // tokens.spacing[3]

  // No border, no shadow
  borderWidth: 0,
  shadowOpacity: 0,
}
```

### React Native Implementation

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { tokens } from '@/design-system';

interface PixelDividerProps {
  color?: string;
  thickness?: 2 | 3 | 4;
  marginVertical?: number;
}

export const PixelDivider: React.FC<PixelDividerProps> = ({
  color = tokens.border.default,
  thickness = 3,
  marginVertical = 24,
}) => {
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: color,
          height: thickness,
          marginVertical,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});
```

---

## 8. PixelBadge

### Purpose
Notification indicator, count badges, status labels.

### Visual Specifications

```javascript
pixelBadge: {
  // Dimensions
  minWidth: 20,
  minHeight: 20,
  paddingX: 6,
  paddingY: 2,

  // Border
  borderWidth: 2,
  borderRadius: 0,  // or 10 for rounded badge (non-retro)
  borderColor: tokens.feedback.error,  // Or success, info, etc.

  // Background
  backgroundColor: tokens.feedback.error,

  // Text
  fontFamily: typography.caption.fontFamily,  // Montserrat
  fontSize: 10,
  fontWeight: '700',
  color: tokens.text.inverse,
  textAlign: 'center',

  // Position (when overlay on icon)
  position: 'absolute',
  top: -8,
  right: -8,
}
```

### React Native Implementation

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { tokens } from '@/design-system';
import { PixelText } from './PixelText';

interface PixelBadgeProps {
  count?: number;
  variant?: 'error' | 'success' | 'warning' | 'info';
  dot?: boolean;  // Just a dot, no number
}

export const PixelBadge: React.FC<PixelBadgeProps> = ({
  count = 0,
  variant = 'error',
  dot = false,
}) => {
  const getColor = () => {
    switch (variant) {
      case 'success': return tokens.feedback.success;
      case 'warning': return tokens.feedback.warning;
      case 'info': return tokens.feedback.info;
      default: return tokens.feedback.error;
    }
  };

  if (count === 0 && !dot) return null;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: getColor(), borderColor: getColor() },
        dot && styles.dot,
      ]}
    >
      {!dot && (
        <PixelText
          variant="caption"
          style={styles.text}
          color={tokens.text.inverse}
        >
          {count > 99 ? '99+' : count.toString()}
        </PixelText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    minWidth: 20,
    minHeight: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    minWidth: 12,
    minHeight: 12,
    padding: 0,
    borderRadius: 6,  // Circular dot
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
  },
});
```

---

## 9. PixelProgressBar

### Purpose
Linear progress indicator (health bars, XP bars, loading progress).

### Visual Specifications

```javascript
pixelProgressBar: {
  // Container
  container: {
    width: '100%',
    height: 24,  // Chunky retro bar
    borderWidth: 3,
    borderRadius: 0,
    borderColor: tokens.border.default,
    backgroundColor: tokens.background.primary,
    overflow: 'hidden',
  },

  // Fill bar
  fill: {
    height: '100%',
    backgroundColor: tokens.interactive.primary,
    // Width is dynamic based on progress %
  },

  // Segmented style (optional - classic game health bar)
  segments: {
    count: 8,  // 8 segments
    gap: 2,    // 2px gap between segments
  },
}
```

### React Native Implementation

```tsx
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { tokens } from '@/design-system';

interface PixelProgressBarProps {
  progress: number;  // 0 to 100
  height?: number;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
  segmented?: boolean;
  segments?: number;
}

export const PixelProgressBar: React.FC<PixelProgressBarProps> = ({
  progress,
  height = 24,
  color = tokens.interactive.primary,
  backgroundColor = tokens.background.primary,
  animated = true,
  segmented = false,
  segments = 8,
}) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(widthAnim, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,  // Width doesn't support native driver
      }).start();
    } else {
      widthAnim.setValue(progress);
    }
  }, [progress]);

  const fillWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  if (segmented) {
    // Render segmented bar (classic game health bar)
    const filledSegments = Math.floor((progress / 100) * segments);
    return (
      <View style={[styles.container, { height, backgroundColor }]}>
        {Array.from({ length: segments }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.segment,
              {
                backgroundColor: i < filledSegments ? color : 'transparent',
              },
            ]}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={[styles.container, { height, backgroundColor }]}>
      <Animated.View
        style={[
          styles.fill,
          {
            width: fillWidth,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 3,
    borderRadius: 0,
    borderColor: tokens.border.default,
    overflow: 'hidden',
    flexDirection: 'row',
    gap: 2,
  },
  fill: {
    height: '100%',
  },
  segment: {
    flex: 1,
    height: '100%',
  },
});
```

---

## 10. PixelCheckbox

### Purpose
Toggle/selection control for forms and settings.

### Visual Specifications

```javascript
pixelCheckbox: {
  // Dimensions
  size: 24,
  touchTarget: 44,  // Larger invisible touch area

  // Border
  borderWidth: 3,
  borderRadius: 0,
  borderColor: tokens.border.default,

  // Background
  unchecked: {
    backgroundColor: tokens.background.primary,
  },
  checked: {
    backgroundColor: tokens.interactive.primary,
  },

  // Checkmark icon
  checkmark: {
    size: 16,
    color: tokens.text.inverse,
  },
}
```

### React Native Implementation

```tsx
import React, { useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { tokens } from '@/design-system';
import { PixelIcon } from './PixelIcon';

interface PixelCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const PixelCheckbox: React.FC<PixelCheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    if (disabled) return;

    // Bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    triggerLightHaptic();
    onChange(!checked);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={1}
      style={styles.touchArea}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
    >
      <Animated.View
        style={[
          styles.checkbox,
          checked && styles.checked,
          disabled && styles.disabled,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {checked && (
          <PixelIcon
            name="check"
            size={16}
            color={tokens.text.inverse}
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchArea: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 3,
    borderRadius: 0,
    borderColor: tokens.border.default,
    backgroundColor: tokens.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: tokens.interactive.primary,
    borderColor: tokens.interactive.primary,
  },
  disabled: {
    opacity: 0.4,
  },
});
```

---

## Component Usage Matrix

| Component | Story 1.4 Usage | Screen |
|-----------|----------------|--------|
| PixelButton (Primary) | "Get Started", "Create Account", "Continue" | Welcome, Profile, Archetype |
| PixelButton (Secondary) | "Skip for now", "Back" | Profile Setup |
| PixelText | All text content | All screens |
| PixelSprite | Archetype avatars (80×80px) | Archetype Selection |
| PixelBorder | Archetype cards, profile form | Profile, Archetype |
| PixelInput | Username, display name | Profile Setup |
| PixelIcon | Checkmarks, navigation arrows | Profile, Archetype |
| PixelDivider | Section separators | Profile Setup |
| PixelBadge | (Future: notifications) | N/A for 1.4 |
| PixelProgressBar | (Future: onboarding progress) | Optional enhancement |
| PixelCheckbox | (Future: preferences) | N/A for 1.4 |

---

## Accessibility Summary

All atomic components MUST meet:
- ✅ **Touch targets**: Minimum 44×44px (Apple HIG)
- ✅ **Contrast ratios**: 4.5:1 for text, 3:1 for UI elements (WCAG AA)
- ✅ **Screen reader support**: Proper accessibility labels, roles, hints
- ✅ **Focus indicators**: Visible focus states for keyboard navigation
- ✅ **Haptic feedback**: Appropriate vibration for interactions
- ✅ **Animation**: Respect `prefers-reduced-motion` preference

---

## Next Steps

1. ✅ **Design Tokens Complete**
2. ✅ **Typography System Complete**
3. ✅ **Animation Specifications Complete**
4. ✅ **Atomic Components Spec Complete** (This Document)
5. ⏭️ **Molecular Components Spec** (Cards, form groups, progress indicators)
6. ⏭️ **Organism Components Spec** (Screen layouts, navigation)

---

## Version History
- **v1.0** (2025-10-31): Initial atomic components specification - 10 core components with React Native implementations, MagicPath.ai and 21st.dev/magic prompts, accessibility guidelines.

---

**Document Owner:** UI/UX Specialist (Sally)
**Approved By:** Architect (Pending)
**Last Updated:** 2025-10-31
