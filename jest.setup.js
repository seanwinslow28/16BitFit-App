/* global jest */
// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};

  // Add useFrameCallback mock for Evolution Ceremony animation
  Reanimated.useFrameCallback = jest.fn(() => {
    // No-op in tests - frame callbacks don't run
  });

  // Add runOnJS mock (returns the function unchanged for test execution)
  Reanimated.runOnJS = jest.fn(fn => fn);

  // Ensure withSequence works in tests
  if (!Reanimated.withSequence) {
    Reanimated.withSequence = jest.fn((...animations) => animations[0]);
  }

  // Ensure interpolate works in tests
  if (!Reanimated.interpolate) {
    Reanimated.interpolate = jest.fn((value, inputRange, outputRange) => {
      // Simple linear interpolation for tests
      if (typeof value === 'number') {
        const inputStart = inputRange[0];
        const inputEnd = inputRange[inputRange.length - 1];
        const outputStart = outputRange[0];
        const outputEnd = outputRange[outputRange.length - 1];
        const ratio = (value - inputStart) / (inputEnd - inputStart);
        return outputStart + ratio * (outputEnd - outputStart);
      }
      return outputRange[0];
    });
  }

  return Reanimated;
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    GestureHandlerRootView: View, // Used in App.tsx
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
  };
});

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    NavigationContainer: ({children}) => children,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      dispatch: jest.fn(),
      setOptions: jest.fn(),
      canGoBack: jest.fn(() => true),
    }),
    useRoute: () => ({
      params: {},
      key: 'test-route-key',
      name: 'TestScreen',
    }),
    useFocusEffect: jest.fn(),
    useIsFocused: jest.fn(() => true),
    useNavigationState: jest.fn(selector => selector({})),
  };
});

// Silence the warning: Animated: `useNativeDriver` is not supported
// Note: NativeAnimatedHelper mock is handled by react-native preset

// Provide safe defaults for Supabase during Jest runs unless explicitly opted in.
const supabaseIntegrationOptIn = process.env.JEST_ALLOW_SUPABASE === 'true';
if (!supabaseIntegrationOptIn) {
  process.env.EXPO_PUBLIC_SUPABASE_URL =
    process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY =
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'test-anon-key';
  process.env.JEST_SUPABASE_DISABLED = 'true';
} else {
  process.env.JEST_SUPABASE_DISABLED = 'false';
}

// Make Animated APIs synchronous during tests to avoid act() warnings and recursion.
// NOTE: We avoid calling value.setValue() as it can trigger listeners that recursively call start().
const {Animated} = require('react-native');

// Helper to create a mock animation object
const createMockAnimation = () => ({
  start: jest.fn(callback => callback?.({finished: true})),
  stop: jest.fn(),
  reset: jest.fn(),
});

// Mock Animated.timing
Animated.timing = jest.fn(() => createMockAnimation());

// Mock Animated.spring
Animated.spring = jest.fn(() => createMockAnimation());

// Mock Animated.decay
Animated.decay = jest.fn(() => createMockAnimation());

// Mock Animated.sequence - prevents recursive callback chains
Animated.sequence = jest.fn(() => createMockAnimation());

// Mock Animated.parallel - prevents recursive callback chains
Animated.parallel = jest.fn(() => createMockAnimation());

// Mock Animated.stagger
Animated.stagger = jest.fn(() => createMockAnimation());

// Mock Animated.loop - just return a stoppable mock (no iterations)
Animated.loop = jest.fn(() => ({
  start: jest.fn(),
  stop: jest.fn(),
  reset: jest.fn(),
}));

// ─────────────────────────────────────────────────────────
// Mock: react-native-mmkv
// ─────────────────────────────────────────────────────────
jest.mock('react-native-mmkv', () => {
  const store = new Map();
  const createInstance = () => ({
    getString: jest.fn(key => store.get(key)),
    set: jest.fn((key, value) => store.set(key, value)),
    delete: jest.fn(key => store.delete(key)),
    remove: jest.fn(key => store.delete(key)), // Alias for delete (used by combatStore)
    contains: jest.fn(key => store.has(key)),
    clearAll: jest.fn(() => store.clear()),
    getNumber: jest.fn(key => store.get(key)),
    getBoolean: jest.fn(key => store.get(key)),
    getAllKeys: jest.fn(() => Array.from(store.keys())),
  });
  return {
    MMKV: jest.fn().mockImplementation(createInstance),
    createMMKV: jest.fn().mockImplementation(createInstance),
  };
});

// ─────────────────────────────────────────────────────────
// Mock: expo-modules-core (fixes EventEmitter error)
// ─────────────────────────────────────────────────────────
jest.mock('expo-modules-core', () => ({
  EventEmitter: jest.fn(() => ({
    addListener: jest.fn(),
    removeListener: jest.fn(),
    emit: jest.fn(),
  })),
  requireNativeModule: jest.fn(),
  requireNativeViewManager: jest.fn(),
}));

// ─────────────────────────────────────────────────────────
// Mock: expo-image-picker
// ─────────────────────────────────────────────────────────
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest.fn(() =>
    Promise.resolve({status: 'granted'}),
  ),
  requestCameraPermissionsAsync: jest.fn(() =>
    Promise.resolve({status: 'granted'}),
  ),
  MediaTypeOptions: {Images: 'Images'},
}));

// ─────────────────────────────────────────────────────────
// Mock: expo-file-system
// (virtual: true so the mock works even before the module is installed)
// ─────────────────────────────────────────────────────────
jest.mock(
  'expo-file-system',
  () => ({
    documentDirectory: 'file:///mock-document-directory/',
    cacheDirectory: 'file:///mock-cache-directory/',
    readAsStringAsync: jest.fn(() => Promise.resolve('')),
    writeAsStringAsync: jest.fn(() => Promise.resolve()),
    deleteAsync: jest.fn(() => Promise.resolve()),
    getInfoAsync: jest.fn(() =>
      Promise.resolve({exists: false, isDirectory: false}),
    ),
    makeDirectoryAsync: jest.fn(() => Promise.resolve()),
    copyAsync: jest.fn(() => Promise.resolve()),
    moveAsync: jest.fn(() => Promise.resolve()),
    downloadAsync: jest.fn(() =>
      Promise.resolve({uri: 'file:///mock-download'}),
    ),
    EncodingType: {
      UTF8: 'utf8',
      Base64: 'base64',
    },
    FileSystemUploadType: {
      BINARY_CONTENT: 0,
      MULTIPART: 1,
    },
  }),
  {virtual: true},
);

// ─────────────────────────────────────────────────────────
// Mock: @/design-system (complete token structure)
// (virtual: true because this path alias may not be configured yet)
// ─────────────────────────────────────────────────────────
jest.mock('@/design-system', () => {
  const colorsData = {
    text: {
      primary: '#0F380F',
      secondary: '#306230',
      muted: '#8BAC0F',
      inverse: '#9BBC0F',
    },
    background: {
      primary: '#9BBC0F',
      secondary: '#8BAC0F',
      elevated: '#306230',
      highlight: '#8BAC0F',
      overlay: '#0F380Fcc',
    },
    border: {default: '#306230', highlight: '#8BAC0F', focus: '#9BBC0F'},
    button: {
      primary: '#8BAC0F',
      primaryText: '#0F380F',
      secondary: '#306230',
      secondaryText: '#9BBC0F',
      disabled: '#306230',
    },
    input: {
      background: '#9BBC0F',
      border: '#306230',
      text: '#0F380F',
      placeholder: '#8BAC0F',
      focus: '#8BAC0F',
    },
    states: {
      active: '#8BAC0F',
      inactive: '#306230',
      disabled: '#306230',
      hover: '#8BAC0F',
    },
    feedback: {
      success: '#8BAC0F',
      warning: '#9BBC0F',
      error: '#306230',
      errorText: '#9BBC0F',
      info: '#8BAC0F',
    },
    interactive: {
      primary: '#8BAC0F',
      hover: '#9BBC0F',
      active: '#306230',
      disabled: '#306230',
    },
    dmg: {
      lightest: '#9BBC0F',
      light: '#8BAC0F',
      dark: '#306230',
      darkest: '#0F380F',
    },
    hardware: {
      shellBody: '#D7D5CA',
      bezel: '#9A9A9A',
      text: '#1C1C1C',
      shadow: '#6D6D6D',
    },
  };

  const spacingData = {
    0: 0,
    1: 4,
    2: 8,
    3: 16,
    4: 24,
    5: 32,
    6: 40,
    7: 48,
    8: 64,
    9: 80,
    10: 96,
  };

  const typographyData = {
    fonts: {
      heading: 'PressStart2P-Regular',
      body: 'Montserrat-Regular',
      primary: 'PressStart2P-Regular',
    },
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      pixelXS: 8,
      pixelSM: 12,
      pixelBase: 16,
      pixelLG: 24,
      pixelXL: 32,
    },
    lineHeights: {tight: 1.25, snug: 1.375, normal: 1.5, relaxed: 1.625},
    weights: {regular: '400', medium: '500', semibold: '600', bold: '700'},
    styles: {
      h1: {
        fontFamily: 'PressStart2P-Regular',
        fontSize: 32,
        lineHeight: 44.8,
        letterSpacing: 0,
        fontWeight: '400',
        textTransform: 'uppercase',
      },
      h2: {
        fontFamily: 'PressStart2P-Regular',
        fontSize: 24,
        lineHeight: 33.6,
        letterSpacing: 0,
        fontWeight: '400',
        textTransform: 'uppercase',
      },
      h3: {
        fontFamily: 'PressStart2P-Regular',
        fontSize: 16,
        lineHeight: 22.4,
        letterSpacing: 0,
        fontWeight: '400',
        textTransform: 'uppercase',
      },
      body: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0,
        fontWeight: '400',
      },
      bodySmall: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        lineHeight: 21,
        letterSpacing: 0,
        fontWeight: '400',
      },
      caption: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        lineHeight: 16.5,
        letterSpacing: 0,
        fontWeight: '400',
      },
      buttonPrimary: {
        fontFamily: 'PressStart2P-Regular',
        fontSize: 16,
        lineHeight: 20,
        letterSpacing: 0,
        fontWeight: '400',
        textTransform: 'uppercase',
      },
      buttonSecondary: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        lineHeight: 20,
        letterSpacing: 0.4,
        fontWeight: '600',
      },
      link: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        lineHeight: 19.25,
        letterSpacing: 0,
        fontWeight: '500',
        textDecorationLine: 'underline',
      },
      inputLabel: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        lineHeight: 19.25,
        letterSpacing: 0,
        fontWeight: '600',
      },
      inputText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0,
        fontWeight: '400',
      },
      inputPlaceholder: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0,
        fontWeight: '400',
      },
      inputHelper: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        lineHeight: 16.5,
        letterSpacing: 0,
        fontWeight: '400',
      },
      inputError: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        lineHeight: 16.5,
        letterSpacing: 0,
        fontWeight: '500',
      },
    },
  };

  const tokensData = {
    colors: colorsData,
    spacing: spacingData,
    component: {
      buttonPaddingX: 24,
      buttonPaddingY: 16,
      inputPaddingX: 16,
      inputPaddingY: 16,
      cardPadding: 24,
      screenPaddingX: 24,
      screenPaddingY: 32,
      stackGap: 16,
      gridGap: 16,
      sectionGap: 48,
    },
    border: {
      width: {none: 0, thin: 2, default: 3, thick: 4, heavy: 6, pixel: 1},
      radius: 0,
    },
    shadow: {
      small: {
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 1,
        shadowRadius: 0,
        shadowColor: '#0F380F',
        elevation: 2,
      },
      medium: {
        shadowOffset: {width: 4, height: 4},
        shadowOpacity: 1,
        shadowRadius: 0,
        shadowColor: '#0F380F',
        elevation: 4,
      },
      large: {
        shadowOffset: {width: 6, height: 6},
        shadowOpacity: 1,
        shadowRadius: 0,
        shadowColor: '#0F380F',
        elevation: 6,
      },
    },
    opacity: {
      invisible: 0,
      faint: 0.1,
      light: 0.2,
      muted: 0.4,
      medium: 0.6,
      visible: 0.8,
      opaque: 0.9,
      solid: 1,
    },
    zIndex: {
      base: 0,
      dropdown: 1000,
      sticky: 1100,
      modal: 1200,
      popover: 1300,
      toast: 1400,
      tooltip: 1500,
    },
    iconSize: {xs: 16, sm: 24, md: 32, lg: 48, xl: 64, xxl: 80, hero: 96},
    touchTarget: {minimum: 44, comfortable: 48, optimal: 60, large: 80},
  };

  return {
    tokens: tokensData,
    colors: colorsData,
    spacing: spacingData,
    typography: typographyData,
    durations: {
      instant: 0,
      micro: 50,
      fast: 100,
      normal: 200,
      moderate: 300,
      slow: 500,
      epic: 800,
      extended: 1200,
    },
    easings: {
      // Easing functions for Animated.timing (must be functions, not objects)
      linear: t => t,
      easeIn: t => t * t,
      easeOut: t => t * (2 - t),
      easeInOut: t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
      standard: t => t * (2 - t), // Mock bezier as easeOut
      sharp: t => t,
      snappy: t => t,
      spring: t => t,
      springGentle: t => t,
    },
  };
}, {virtual: true});

// ─────────────────────────────────────────────────────────
// Mock: react-native-haptic-feedback
// (virtual: true so the mock works even before the module is installed)
// ─────────────────────────────────────────────────────────
jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}), {virtual: true});

// ─────────────────────────────────────────────────────────
// Mock: react-native-safe-area-context
// ─────────────────────────────────────────────────────────
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const {View} = require('react-native');
  return {
    SafeAreaProvider: ({children}) => children,
    SafeAreaView: ({children, ...props}) =>
      React.createElement(View, props, children),
    useSafeAreaInsets: () => ({top: 0, right: 0, bottom: 0, left: 0}),
    useSafeAreaFrame: () => ({x: 0, y: 0, width: 390, height: 844}),
  };
});

// ─────────────────────────────────────────────────────────
// Mock: expo-av (for Evolution Ceremony sound pool)
// (virtual: true so the mock works even before the module is installed)
// ─────────────────────────────────────────────────────────
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(() =>
        Promise.resolve({
          sound: {
            unloadAsync: jest.fn(() => Promise.resolve()),
            replayAsync: jest.fn(() => Promise.resolve()),
            playAsync: jest.fn(() => Promise.resolve()),
            stopAsync: jest.fn(() => Promise.resolve()),
            setPositionAsync: jest.fn(() => Promise.resolve()),
          },
        }),
      ),
    },
    setAudioModeAsync: jest.fn(() => Promise.resolve()),
  },
}), {virtual: true});
