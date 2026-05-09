# 16BitFit Molecular Components Specification
## Version 1.0 | Component Library - Molecules

This document defines the molecular-level components for 16BitFit. Molecules are functional groups of atoms that work together as a cohesive unit.

**Atomic Design Principle:** Molecules combine multiple atoms (buttons, text, borders, sprites) into reusable UI patterns. They have a specific purpose and internal logic but are still relatively simple compared to organisms.

---

## Component Index

1. [ArchetypeCard](#archetypecard) - Selectable fitness archetype card
2. [FormField](#formfield) - Complete form input with label and validation
3. [ProgressIndicator](#progressindicator) - Step-based progress dots
4. [ToastNotification](#toastnotification) - Temporary message overlay
5. [ProfileHeader](#profileheader) - User avatar and metadata
6. [StatBar](#statbar) - Labeled progress bar (for stats like strength, endurance)
7. [ActionSheet](#actionsheet) - Bottom sheet menu
8. [EmptyState](#emptystate) - Placeholder for empty content
9. [LoadingSpinner](#loadingspinner) - Loading indicator with text
10. [ConfirmDialog](#confirmdialog) - Simple confirmation modal

---

## 1. ArchetypeCard

### Purpose
Selectable card displaying fitness archetype (avatar, name, description) for onboarding (Story 1.4).

### Visual Specifications

```javascript
archetypeCard: {
  // Container
  container: {
    width: 160,  // Fixed width for grid layout
    minHeight: 200,
    padding: 16,
    borderWidth: 3,
    borderRadius: 0,
    borderColor: tokens.border.default,
    backgroundColor: tokens.background.elevated,
    alignItems: 'center',
    gap: 12,  // Space between elements
  },

  // Selected state
  selected: {
    borderWidth: 4,
    borderColor: tokens.border.highlight,
    backgroundColor: tokens.background.elevated,
    scale: 1.05,
    shadowOffset: { x: 0, y: 0 },
    shadowColor: tokens.border.highlight,
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },

  // Avatar (PixelSprite)
  avatar: {
    size: 80,  // 80×80px (Story 1.4 requirement)
    marginBottom: 8,
  },

  // Name (PixelText h3)
  name: {
    fontSize: 16,
    fontFamily: 'Press Start 2P',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: tokens.text.primary,
    marginBottom: 4,
  },

  // Description (PixelText bodySmall)
  description: {
    fontSize: 12,
    fontFamily: 'Montserrat',
    textAlign: 'center',
    color: tokens.text.secondary,
    numberOfLines: 2,
  },
}
```

### Composition
- **PixelBorder** (container with shadow)
- **PixelSprite** (80×80px archetype avatar)
- **PixelText** (h3 variant for name)
- **PixelText** (bodySmall variant for description)

### React Native Implementation

```tsx
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { PixelBorder, PixelSprite, PixelText } from '@/components/atoms';
import { tokens, animations } from '@/design-system';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

interface ArchetypeCardProps {
  id: string;
  name: string;
  description: string;
  avatarSource: any;
  selected: boolean;
  onSelect: (id: string) => void;
}

export const ArchetypeCard: React.FC<ArchetypeCardProps> = ({
  id,
  name,
  description,
  avatarSource,
  selected,
  onSelect,
}) => {
  const scale = useSharedValue(1);
  const borderWidth = useSharedValue(3);

  React.useEffect(() => {
    scale.value = withSpring(selected ? 1.05 : 1, {
      damping: 12,
      stiffness: 150,
    });
    borderWidth.value = withTiming(selected ? 4 : 3, {
      duration: 150,
    });
  }, [selected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    triggerMediumHaptic();
    onSelect(id);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`Select ${name} archetype`}
      accessibilityHint={description}
      accessibilityState={{ selected }}
    >
      <Animated.View style={animatedStyle}>
        <View
          style={[
            styles.container,
            selected && styles.selected,
          ]}
        >
          {/* Avatar */}
          <PixelSprite
            source={avatarSource}
            size={80}
            bordered={false}
          />

          {/* Name */}
          <PixelText
            variant="h3"
            align="center"
            style={styles.name}
          >
            {name}
          </PixelText>

          {/* Description */}
          <PixelText
            variant="bodySmall"
            align="center"
            color={tokens.text.secondary}
            numberOfLines={2}
            style={styles.description}
          >
            {description}
          </PixelText>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    minHeight: 200,
    padding: 16,
    borderWidth: 3,
    borderRadius: 0,
    borderColor: tokens.border.default,
    backgroundColor: tokens.background.elevated,
    alignItems: 'center',
    gap: 12,
  },
  selected: {
    borderWidth: 4,
    borderColor: tokens.border.highlight,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: tokens.border.highlight,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  name: {
    marginBottom: 4,
  },
  description: {
    flex: 1,
  },
});
```

### Usage Example (Story 1.4)

```tsx
const archetypes = [
  {
    id: 'trainer',
    name: 'TRAINER',
    description: 'Balanced fitness with variety of exercises',
    avatar: require('@/assets/sprites/trainer-80.png'),
  },
  {
    id: 'runner',
    name: 'RUNNER',
    description: 'Built for endurance and speed',
    avatar: require('@/assets/sprites/runner-80.png'),
  },
  // ... other archetypes
];

<View style={styles.grid}>
  {archetypes.map((archetype) => (
    <ArchetypeCard
      key={archetype.id}
      {...archetype}
      selected={selectedArchetype === archetype.id}
      onSelect={setSelectedArchetype}
    />
  ))}
</View>
```

### MagicPath.ai Prompt
```
Archetype selection card for retro fitness app.
Rectangular card, 160px wide, 200px tall.
4px border (3px default, 4px when selected), zero border-radius.
Selected state: glowing border with cyan (#00D0FF) highlight, subtle scale (1.05x).
80×80px pixel art character avatar centered at top.
Character name below avatar in Press Start 2P font, 16px, uppercase.
2-line description below name in Montserrat, 12px, gray text, center-aligned.
Grid layout: 2 columns on mobile, 3-4 on tablet.
Tap to select, entire card is tappable.
```

### 21st.dev/magic Prompt
```
/ui Archetype selection card for fitness app
160×200px card with 80×80px sprite avatar at top
3px border (4px when selected), highlight color on selection
Scale animation on select (1 → 1.05, spring easing)
Press Start 2P font for name (16px, uppercase)
Montserrat font for description (12px, 2 lines max)
Center-aligned content with 16px internal padding
Entire card tappable, medium haptic feedback on select
Support selected/unselected states with border color change
```

---

## 2. FormField

### Purpose
Complete form input with label, validation, helper text, and error messages.

### Visual Specifications

```javascript
formField: {
  // Container
  container: {
    width: '100%',
    marginBottom: 24,
    gap: 8,
  },

  // Label (PixelText label variant)
  label: {
    fontSize: 14,
    fontFamily: 'Montserrat SemiBold',
    fontWeight: '600',
    color: tokens.text.primary,
    marginBottom: 8,
  },

  // Input (PixelInput)
  input: {
    minHeight: 48,
    borderWidth: 3,
    // States handled by PixelInput
  },

  // Helper text (PixelText caption)
  helperText: {
    fontSize: 12,
    fontFamily: 'Montserrat',
    color: tokens.text.secondary,
    marginTop: 8,
  },

  // Error text (PixelText caption)
  errorText: {
    fontSize: 12,
    fontFamily: 'Montserrat Medium',
    fontWeight: '500',
    color: tokens.feedback.error,
    marginTop: 8,
  },

  // Success icon (PixelIcon)
  successIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    size: 20,
    color: tokens.feedback.success,
  },
}
```

### Composition
- **PixelText** (label variant)
- **PixelInput** (with states)
- **PixelText** (caption for helper/error text)
- **PixelIcon** (optional success checkmark)

### React Native Implementation

```tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { PixelText, PixelInput, PixelIcon } from '@/components/atoms';
import { tokens } from '@/design-system';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  successText?: string;
  error?: boolean;
  success?: boolean;
  required?: boolean;
  validate?: (value: string) => { valid: boolean; message?: string };
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  maxLength?: number;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  helperText,
  errorText,
  successText,
  error = false,
  success = false,
  required = false,
  validate,
  ...inputProps
}) => {
  const [touched, setTouched] = useState(false);
  const [validationError, setValidationError] = useState<string | undefined>();

  const handleBlur = () => {
    setTouched(true);
    if (validate) {
      const result = validate(value);
      if (!result.valid) {
        setValidationError(result.message);
      } else {
        setValidationError(undefined);
      }
    }
  };

  const handleChangeText = (text: string) => {
    onChangeText(text);
    // Clear validation error on typing
    if (validationError) {
      setValidationError(undefined);
    }
  };

  const showError = (error || (touched && validationError)) && !success;
  const showSuccess = success && !showError && value.length > 0;
  const displayErrorText = errorText || validationError;

  return (
    <View style={styles.container}>
      {/* Label */}
      <PixelText variant="label">
        {label}
        {required && (
          <PixelText variant="label" color={tokens.feedback.error}>
            {' *'}
          </PixelText>
        )}
      </PixelText>

      {/* Input with optional success icon */}
      <View style={styles.inputWrapper}>
        <PixelInput
          value={value}
          onChangeText={handleChangeText}
          onBlur={handleBlur}
          placeholder={placeholder}
          error={showError}
          success={showSuccess}
          {...inputProps}
        />
        {showSuccess && (
          <View style={styles.successIcon}>
            <PixelIcon
              name="check"
              size={20}
              color={tokens.feedback.success}
            />
          </View>
        )}
      </View>

      {/* Helper/Error/Success Text */}
      {showError && displayErrorText && (
        <PixelText variant="caption" color={tokens.feedback.error}>
          {displayErrorText}
        </PixelText>
      )}

      {showSuccess && successText && (
        <PixelText variant="caption" color={tokens.feedback.success}>
          {successText}
        </PixelText>
      )}

      {!showError && !showSuccess && helperText && (
        <PixelText variant="caption" color={tokens.text.secondary}>
          {helperText}
        </PixelText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24,
  },
  inputWrapper: {
    position: 'relative',
  },
  successIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,  // Half of icon size for centering
  },
});
```

### Usage Example (Story 1.4 - Profile Setup)

```tsx
const [username, setUsername] = useState('');
const [displayName, setDisplayName] = useState('');

const validateUsername = (text: string) => {
  if (text.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters' };
  }
  if (text.length > 20) {
    return { valid: false, message: 'Username must be less than 20 characters' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(text)) {
    return { valid: false, message: 'Only letters, numbers, and underscores allowed' };
  }
  return { valid: true };
};

<FormField
  label="Username"
  value={username}
  onChangeText={setUsername}
  placeholder="Enter username..."
  helperText="3-20 characters (letters, numbers, underscore)"
  validate={validateUsername}
  required
  autoCapitalize="none"
  maxLength={20}
/>

<FormField
  label="Display Name"
  value={displayName}
  onChangeText={setDisplayName}
  placeholder="Optional display name..."
  helperText="This is how others will see you"
  autoCapitalize="words"
/>
```

---

## 3. ProgressIndicator

### Purpose
Step-based progress dots for multi-step flows (onboarding, forms).

### Visual Specifications

```javascript
progressIndicator: {
  // Container
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  // Dot (inactive)
  dot: {
    width: 12,
    height: 12,
    borderRadius: 0,  // Square pixel dots
    backgroundColor: tokens.border.default,
    opacity: 0.4,
  },

  // Dot (active/completed)
  activeDot: {
    width: 12,
    height: 12,
    borderRadius: 0,
    backgroundColor: tokens.interactive.primary,
    opacity: 1,
    scale: 1.2,  // Slightly larger
  },

  // Optional label
  label: {
    fontSize: 12,
    fontFamily: 'Montserrat',
    color: tokens.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
}
```

### Composition
- Multiple **View** elements (dots)
- Optional **PixelText** (label)

### React Native Implementation

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PixelText } from '@/components/atoms';
import { tokens } from '@/design-system';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface ProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
  showLabel?: boolean;
  dotShape?: 'square' | 'circle';
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  totalSteps,
  currentStep,
  showLabel = true,
  dotShape = 'square',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.dots}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index < currentStep;
          const isCurrent = index === currentStep - 1;

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                dotShape === 'circle' && styles.circleDot,
                isActive && styles.activeDot,
                isCurrent && styles.currentDot,
              ]}
            />
          );
        })}
      </View>

      {showLabel && (
        <PixelText
          variant="caption"
          color={tokens.text.secondary}
          align="center"
          style={styles.label}
        >
          Step {currentStep} of {totalSteps}
        </PixelText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    backgroundColor: tokens.border.default,
    opacity: 0.4,
  },
  circleDot: {
    borderRadius: 6,
  },
  activeDot: {
    backgroundColor: tokens.interactive.primary,
    opacity: 1,
  },
  currentDot: {
    width: 16,
    height: 16,
    backgroundColor: tokens.interactive.primary,
    opacity: 1,
  },
  label: {
    marginTop: 8,
  },
});
```

### Usage Example (Story 1.4)
```tsx
// Welcome Screen = Step 1
<ProgressIndicator totalSteps={3} currentStep={1} />

// Profile Setup = Step 2
<ProgressIndicator totalSteps={3} currentStep={2} />

// Archetype Selection = Step 3
<ProgressIndicator totalSteps={3} currentStep={3} />
```

---

## 4. ToastNotification

### Purpose
Temporary message overlay for success, error, info, or warning feedback.

### Visual Specifications

```javascript
toastNotification: {
  // Container
  container: {
    position: 'absolute',
    top: 60,  // Below status bar
    left: 24,
    right: 24,
    zIndex: 1000,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 3,
    borderRadius: 0,
    backgroundColor: tokens.background.elevated,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowOffset: { x: 4, y: 4 },
    shadowColor: tokens.background.primary,
    shadowOpacity: 1,
    shadowRadius: 0,
  },

  // Variants
  success: {
    borderColor: tokens.feedback.success,
  },
  error: {
    borderColor: tokens.feedback.error,
  },
  warning: {
    borderColor: tokens.feedback.warning,
  },
  info: {
    borderColor: tokens.feedback.info,
  },

  // Icon
  icon: {
    size: 20,
  },

  // Message text
  message: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Montserrat Medium',
    fontWeight: '500',
    color: tokens.text.primary,
  },
}
```

### Composition
- **PixelBorder** (container with shadow)
- **PixelIcon** (status icon)
- **PixelText** (message)

### React Native Implementation

```tsx
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { PixelText, PixelIcon } from '@/components/atoms';
import { tokens } from '@/design-system';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

interface ToastNotificationProps {
  message: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onDismiss?: () => void;
  visible: boolean;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  variant = 'info',
  duration = 3000,
  onDismiss,
  visible,
}) => {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Slide in
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });
      opacity.value = withTiming(1, { duration: 200 });

      // Auto-dismiss after duration
      const timeout = setTimeout(() => {
        translateY.value = withTiming(-100, { duration: 200 });
        opacity.value = withTiming(0, { duration: 150 }, () => {
          if (onDismiss) {
            runOnJS(onDismiss)();
          }
        });
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const getIconName = () => {
    switch (variant) {
      case 'success': return 'check';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
    }
  };

  const getBorderColor = () => {
    switch (variant) {
      case 'success': return tokens.feedback.success;
      case 'error': return tokens.feedback.error;
      case 'warning': return tokens.feedback.warning;
      case 'info': return tokens.feedback.info;
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { borderColor: getBorderColor() },
        animatedStyle,
      ]}
    >
      <PixelIcon
        name={getIconName()}
        size={20}
        color={getBorderColor()}
      />
      <PixelText
        variant="bodySmall"
        style={styles.message}
        numberOfLines={2}
      >
        {message}
      </PixelText>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 24,
    right: 24,
    zIndex: 1000,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 3,
    borderRadius: 0,
    backgroundColor: tokens.background.elevated,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowOffset: { width: 4, height: 4 },
    shadowColor: tokens.background.primary,
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  message: {
    flex: 1,
  },
});
```

### Usage Example
```tsx
const [toastVisible, setToastVisible] = useState(false);
const [toastMessage, setToastMessage] = useState('');
const [toastVariant, setToastVariant] = useState('success');

const showToast = (message: string, variant = 'success') => {
  setToastMessage(message);
  setToastVariant(variant);
  setToastVisible(true);
};

// In component
<ToastNotification
  message={toastMessage}
  variant={toastVariant}
  visible={toastVisible}
  onDismiss={() => setToastVisible(false)}
/>

// Trigger toast
showToast('Profile created successfully!', 'success');
showToast('Username already taken', 'error');
```

---

## 5. ProfileHeader

### Purpose
User avatar and metadata display (username, display name, stats).

### Visual Specifications

```javascript
profileHeader: {
  // Container
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
    borderWidth: 3,
    borderRadius: 0,
    borderColor: tokens.border.default,
    backgroundColor: tokens.background.elevated,
  },

  // Avatar (PixelSprite)
  avatar: {
    size: 64,
    borderWidth: 3,
    borderColor: tokens.border.default,
  },

  // Info section
  info: {
    flex: 1,
    gap: 4,
  },

  // Username (PixelText h3)
  username: {
    fontSize: 16,
    fontFamily: 'Press Start 2P',
    textTransform: 'uppercase',
    color: tokens.text.primary,
  },

  // Display name (PixelText bodySmall)
  displayName: {
    fontSize: 14,
    fontFamily: 'Montserrat',
    color: tokens.text.secondary,
  },

  // Meta text (PixelText caption)
  meta: {
    fontSize: 12,
    fontFamily: 'Montserrat',
    color: tokens.text.tertiary,
  },
}
```

### Composition
- **PixelBorder** (container)
- **PixelSprite** (avatar with border)
- **PixelText** (username, display name, metadata)

### React Native Implementation

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PixelSprite, PixelText } from '@/components/atoms';
import { tokens } from '@/design-system';

interface ProfileHeaderProps {
  avatarSource: any;
  username: string;
  displayName?: string;
  meta?: string;
  size?: 'small' | 'medium' | 'large';
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatarSource,
  username,
  displayName,
  meta,
  size = 'medium',
}) => {
  const avatarSize = size === 'small' ? 48 : size === 'large' ? 80 : 64;

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <PixelSprite
        source={avatarSource}
        size={avatarSize}
        bordered
        borderColor={tokens.border.default}
      />

      {/* Info */}
      <View style={styles.info}>
        <PixelText variant="h3" style={styles.username}>
          {username}
        </PixelText>

        {displayName && (
          <PixelText
            variant="bodySmall"
            color={tokens.text.secondary}
          >
            {displayName}
          </PixelText>
        )}

        {meta && (
          <PixelText
            variant="caption"
            color={tokens.text.tertiary}
          >
            {meta}
          </PixelText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
    borderWidth: 3,
    borderRadius: 0,
    borderColor: tokens.border.default,
    backgroundColor: tokens.background.elevated,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  username: {
    marginBottom: 0,
  },
});
```

---

## 6. StatBar

### Purpose
Labeled progress bar for displaying stats (strength, endurance, flexibility).

### Visual Specifications

```javascript
statBar: {
  // Container
  container: {
    width: '100%',
    marginBottom: 16,
    gap: 8,
  },

  // Header (label + value)
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Label
  label: {
    fontSize: 14,
    fontFamily: 'Montserrat SemiBold',
    fontWeight: '600',
    color: tokens.text.primary,
  },

  // Value
  value: {
    fontSize: 14,
    fontFamily: 'Press Start 2P',
    color: tokens.interactive.primary,
  },

  // Progress bar (PixelProgressBar)
  progressBar: {
    height: 20,
  },
}
```

### Composition
- **PixelText** (label and value)
- **PixelProgressBar** (visual progress)

### React Native Implementation

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PixelText, PixelProgressBar } from '@/components/atoms';
import { tokens } from '@/design-system';

interface StatBarProps {
  label: string;
  value: number;
  maxValue: number;
  color?: string;
  showValue?: boolean;
  animated?: boolean;
}

export const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  maxValue,
  color = tokens.interactive.primary,
  showValue = true,
  animated = true,
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <PixelText variant="label">
          {label}
        </PixelText>

        {showValue && (
          <PixelText
            variant="bodySmall"
            color={color}
            style={styles.value}
          >
            {value}/{maxValue}
          </PixelText>
        )}
      </View>

      {/* Progress Bar */}
      <PixelProgressBar
        progress={percentage}
        height={20}
        color={color}
        animated={animated}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  value: {
    fontFamily: 'Press Start 2P',
  },
});
```

### Usage Example
```tsx
<StatBar
  label="Strength"
  value={75}
  maxValue={100}
  color={tokens.pulse.power}  // Orange
/>

<StatBar
  label="Endurance"
  value={60}
  maxValue={100}
  color={tokens.pulse.endurance}  // Green
/>

<StatBar
  label="Flexibility"
  value={45}
  maxValue={100}
  color={tokens.pulse.recovery}  // Purple
/>
```

---

## 7. ActionSheet

### Purpose
Bottom sheet menu for contextual actions.

### Visual Specifications

```javascript
actionSheet: {
  // Backdrop overlay
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 999,
  },

  // Sheet container
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: tokens.background.elevated,
    borderTopWidth: 4,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopColor: tokens.border.highlight,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,  // Extra padding for safe area
    gap: 16,
  },

  // Handle (drag indicator)
  handle: {
    width: 40,
    height: 4,
    backgroundColor: tokens.border.default,
    alignSelf: 'center',
    marginBottom: 16,
  },

  // Action button
  actionButton: {
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 3,
    borderRadius: 0,
    borderColor: tokens.border.default,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  // Destructive action (red)
  destructiveAction: {
    borderColor: tokens.feedback.error,
  },
}
```

### React Native Implementation

```tsx
import React from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import { PixelText, PixelIcon } from '@/components/atoms';
import { tokens } from '@/design-system';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface Action {
  label: string;
  icon?: string;
  onPress: () => void;
  destructive?: boolean;
}

interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  actions: Action[];
  title?: string;
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
  visible,
  onClose,
  actions,
  title,
}) => {
  const translateY = useSharedValue(500);
  const backdropOpacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 150,
      });
      backdropOpacity.value = withTiming(1, { duration: 200 });
    } else {
      translateY.value = withTiming(500, { duration: 200 });
      backdropOpacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable onPress={onClose} style={StyleSheet.absoluteFill}>
        <Animated.View style={[styles.backdrop, backdropStyle]} />
      </Pressable>

      {/* Sheet */}
      <Animated.View style={[styles.container, sheetStyle]}>
        {/* Drag Handle */}
        <View style={styles.handle} />

        {/* Title */}
        {title && (
          <PixelText variant="h3" align="center" style={styles.title}>
            {title}
          </PixelText>
        )}

        {/* Actions */}
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.actionButton,
              action.destructive && styles.destructiveAction,
            ]}
            onPress={() => {
              action.onPress();
              onClose();
            }}
          >
            {action.icon && (
              <PixelIcon
                name={action.icon}
                size={20}
                color={
                  action.destructive
                    ? tokens.feedback.error
                    : tokens.text.primary
                }
              />
            )}
            <PixelText
              variant="body"
              color={
                action.destructive
                  ? tokens.feedback.error
                  : tokens.text.primary
              }
            >
              {action.label}
            </PixelText>
          </TouchableOpacity>
        ))}

        {/* Cancel Button */}
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={onClose}
        >
          <PixelText variant="body" color={tokens.text.secondary}>
            Cancel
          </PixelText>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: tokens.background.elevated,
    borderTopWidth: 4,
    borderTopColor: tokens.border.highlight,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: tokens.border.default,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  actionButton: {
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 3,
    borderRadius: 0,
    borderColor: tokens.border.default,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  destructiveAction: {
    borderColor: tokens.feedback.error,
  },
  cancelButton: {
    marginTop: 8,
  },
});
```

---

## 8. EmptyState

### Purpose
Placeholder for empty content areas (no data, no results).

### Visual Specifications

```javascript
emptyState: {
  // Container
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },

  // Icon/illustration (PixelSprite)
  icon: {
    size: 96,
    opacity: 0.5,
  },

  // Title (PixelText h2)
  title: {
    fontSize: 24,
    fontFamily: 'Press Start 2P',
    textAlign: 'center',
    color: tokens.text.primary,
  },

  // Description (PixelText body)
  description: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    textAlign: 'center',
    color: tokens.text.secondary,
    maxWidth: 300,
  },

  // Optional action button
  action: {
    marginTop: 16,
  },
}
```

### React Native Implementation

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PixelSprite, PixelText, PixelButton } from '@/components/atoms';
import { tokens } from '@/design-system';

interface EmptyStateProps {
  iconSource?: any;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  iconSource,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      {iconSource && (
        <View style={styles.iconContainer}>
          <PixelSprite
            source={iconSource}
            size={96}
          />
        </View>
      )}

      <PixelText variant="h2" align="center">
        {title}
      </PixelText>

      <PixelText
        variant="body"
        align="center"
        color={tokens.text.secondary}
        style={styles.description}
      >
        {description}
      </PixelText>

      {actionLabel && onAction && (
        <View style={styles.action}>
          <PixelButton
            onPress={onAction}
            variant="primary"
          >
            {actionLabel}
          </PixelButton>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  iconContainer: {
    opacity: 0.5,
    marginBottom: 8,
  },
  description: {
    maxWidth: 300,
  },
  action: {
    marginTop: 16,
  },
});
```

---

## 9. LoadingSpinner

### Purpose
Loading indicator with optional text message.

### Composition
- **PixelIcon** (spinning icon)
- **PixelText** (loading message)

### React Native Implementation

```tsx
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { PixelIcon, PixelText } from '@/components/atoms';
import { tokens } from '@/design-system';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  size = 'medium',
}) => {
  const rotation = useSharedValue(0);

  const iconSize = size === 'small' ? 24 : size === 'large' ? 48 : 32;

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 800,
        easing: Easing.linear,
      }),
      -1  // Infinite loop
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <PixelIcon
          name="spinner"
          size={iconSize}
          color={tokens.interactive.primary}
        />
      </Animated.View>

      {message && (
        <PixelText
          variant="body"
          align="center"
          color={tokens.text.secondary}
          style={styles.message}
        >
          {message}
        </PixelText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
  message: {
    marginTop: 8,
  },
});
```

---

## 10. ConfirmDialog

### Purpose
Simple modal for confirmations (destructive actions, important decisions).

### Visual Specifications

```javascript
confirmDialog: {
  // Backdrop
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },

  // Modal container
  container: {
    width: '85%',
    maxWidth: 400,
    padding: 24,
    borderWidth: 4,
    borderRadius: 0,
    borderColor: tokens.border.highlight,
    backgroundColor: tokens.background.elevated,
    gap: 16,
  },

  // Title
  title: {
    fontSize: 20,
    fontFamily: 'Press Start 2P',
    textAlign: 'center',
    color: tokens.text.primary,
  },

  // Message
  message: {
    fontSize: 14,
    fontFamily: 'Montserrat',
    textAlign: 'center',
    color: tokens.text.secondary,
  },

  // Buttons
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
}
```

### React Native Implementation

```tsx
import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { PixelText, PixelButton } from '@/components/atoms';
import { tokens } from '@/design-system';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {/* Title */}
          <PixelText variant="h3" align="center">
            {title}
          </PixelText>

          {/* Message */}
          <PixelText
            variant="body"
            align="center"
            color={tokens.text.secondary}
          >
            {message}
          </PixelText>

          {/* Buttons */}
          <View style={styles.buttons}>
            <View style={styles.buttonWrapper}>
              <PixelButton
                onPress={onCancel}
                variant="secondary"
                fullWidth
              >
                {cancelLabel}
              </PixelButton>
            </View>

            <View style={styles.buttonWrapper}>
              <PixelButton
                onPress={onConfirm}
                variant="primary"
                fullWidth
              >
                {confirmLabel}
              </PixelButton>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderWidth: 4,
    borderRadius: 0,
    borderColor: tokens.border.highlight,
    backgroundColor: tokens.background.elevated,
    gap: 16,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  buttonWrapper: {
    flex: 1,
  },
});
```

---

## Component Usage Matrix (Story 1.4)

| Component | Screen | Usage |
|-----------|--------|-------|
| **ArchetypeCard** | Archetype Selection | Display 5 fitness archetypes, handle selection |
| **FormField** | Profile Setup | Username input, display name input with validation |
| **ProgressIndicator** | All 3 screens | Show "Step X of 3" at top/bottom |
| **ToastNotification** | Profile Setup, Archetype | Success: "Profile created!", Error: "Username taken" |
| **ProfileHeader** | (Future: Dashboard) | Not needed for Story 1.4 |
| **StatBar** | (Future: Stats screen) | Not needed for Story 1.4 |
| **ActionSheet** | (Future: Settings) | Not needed for Story 1.4 |
| **EmptyState** | (Future: No workouts) | Not needed for Story 1.4 |
| **LoadingSpinner** | All screens | Show during profile creation, archetype save |
| **ConfirmDialog** | Profile Setup | "Skip account creation?" confirmation |

---

## Accessibility Summary

All molecular components MUST:
- ✅ **Compose accessible atoms** (inherit accessibility from PixelButton, PixelText, etc.)
- ✅ **Provide semantic labels** for complex interactions
- ✅ **Support screen readers** with proper accessibility hints
- ✅ **Maintain touch targets** ≥44px through composition
- ✅ **Animate accessibly** (respect reduced motion preference)
- ✅ **Provide haptic feedback** for important interactions

---

## Next Steps

1. ✅ **Design Tokens Complete**
2. ✅ **Typography System Complete**
3. ✅ **Animation Specifications Complete**
4. ✅ **Atomic Components Spec Complete**
5. ✅ **Molecular Components Spec Complete** (This Document)
6. ⏭️ **Organism Components Spec** (Full screen layouts, navigation patterns)
7. ⏭️ **User Flow Diagram** (Story 1.4 onboarding journey)
8. ⏭️ **Screen Specifications** (Detailed specs for each of 3 screens)

---

## Version History
- **v1.0** (2025-10-31): Initial molecular components specification - 10 composite components with React Native implementations, Story 1.4 usage matrix, accessibility guidelines.

---

**Document Owner:** UI/UX Specialist (Sally)
**Approved By:** Architect (Pending)
**Last Updated:** 2025-10-31
