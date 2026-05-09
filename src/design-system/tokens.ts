/**
 * 16BitFit V4 Design Tokens
 *
 * Palette is intentionally placeholder — the user is doing a separate design
 * brainstorm pass to define the V4 16-bit color system. Until then, every
 * color is a single placeholder so components compile and render visibly.
 *
 * DO NOT add real color values here without a corresponding decision in
 * docs/design-decisions/ (or whatever the brainstorm output produces).
 */

import {ViewStyle} from 'react-native';

const PLACEHOLDER = '#FF00FF'; // Magenta — visible while unset, easy to grep.

export const tokens = {
  colors: {
    background: {
      primary: PLACEHOLDER,
      secondary: PLACEHOLDER,
      elevated: PLACEHOLDER,
      overlay: PLACEHOLDER,
      highlight: PLACEHOLDER,
    },
    text: {
      primary: PLACEHOLDER,
      secondary: PLACEHOLDER,
      muted: PLACEHOLDER,
      inverse: PLACEHOLDER,
    },
    border: {
      default: PLACEHOLDER,
      highlight: PLACEHOLDER,
      focus: PLACEHOLDER,
    },
    button: {
      primary: PLACEHOLDER,
      primaryText: PLACEHOLDER,
      secondary: PLACEHOLDER,
      secondaryText: PLACEHOLDER,
    },
    input: {
      background: PLACEHOLDER,
      border: PLACEHOLDER,
      text: PLACEHOLDER,
      placeholder: PLACEHOLDER,
      focus: PLACEHOLDER,
    },
    states: {
      active: PLACEHOLDER,
      inactive: PLACEHOLDER,
      disabled: PLACEHOLDER,
      hover: PLACEHOLDER,
    },
    feedback: {
      success: PLACEHOLDER,
      warning: PLACEHOLDER,
      error: PLACEHOLDER,
      errorText: PLACEHOLDER,
      info: PLACEHOLDER,
    },
  },

  spacing: {
    0: 0, 1: 4, 2: 8, 3: 16, 4: 24, 5: 32, 6: 40, 7: 48, 8: 64, 9: 80, 10: 96,
  },

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
      shadowColor: '#000000',
      elevation: 2,
    } as ViewStyle,
    medium: {
      shadowOffset: {width: 4, height: 4},
      shadowOpacity: 1,
      shadowRadius: 0,
      shadowColor: '#000000',
      elevation: 4,
    } as ViewStyle,
    large: {
      shadowOffset: {width: 6, height: 6},
      shadowOpacity: 1,
      shadowRadius: 0,
      shadowColor: '#000000',
      elevation: 6,
    } as ViewStyle,
  },

  opacity: {
    invisible: 0, faint: 0.1, light: 0.2, muted: 0.4,
    medium: 0.6, visible: 0.8, opaque: 0.9, solid: 1,
  },

  zIndex: {
    base: 0, dropdown: 1000, sticky: 1100, modal: 1200,
    popover: 1300, toast: 1400, tooltip: 1500,
  },

  iconSize: {xs: 16, sm: 24, md: 32, lg: 48, xl: 64, xxl: 80, hero: 96},

  touchTarget: {minimum: 44, comfortable: 48, optimal: 60, large: 80},
};
