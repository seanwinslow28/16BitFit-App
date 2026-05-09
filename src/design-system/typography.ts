/**
 * 16BitFit Typography System
 *
 * Font families, sizes, line heights, and pre-composed text styles.
 * Uses Press Start 2P for retro display elements and Montserrat for readable body text.
 */

import {TextStyle} from 'react-native';

// ─────────────────────────────────────────────────────────
// Font Families
// ─────────────────────────────────────────────────────────

const fonts = {
  heading: 'PressStart2P-Regular', // Pixel font for headers/buttons
  body: 'Montserrat-Regular', // Modern sans-serif for body text
};

// ─────────────────────────────────────────────────────────
// Font Sizes (8px base grid)
// ─────────────────────────────────────────────────────────

const sizes = {
  // Pixel font sizes (Press Start 2P)
  pixelXS: 8,
  pixelSM: 12,
  pixelBase: 16,
  pixelLG: 24,
  pixelXL: 32,
  pixelXXL: 40,
  pixelHero: 48,

  // Body font sizes (Montserrat)
  xs: 12, // Captions, fine print
  sm: 14, // Secondary text, helper text
  base: 16, // Body text, standard paragraphs (DEFAULT)
  lg: 18, // Emphasized body text, subheadings
  xl: 20, // Large callouts
  xxl: 24, // Section headers
  xxxl: 32, // Page titles
};

// ─────────────────────────────────────────────────────────
// Line Heights (multipliers)
// ─────────────────────────────────────────────────────────

const lineHeights = {
  // Pixel font line heights
  pixelTight: 1.2,
  pixelNormal: 1.4,
  pixelRelaxed: 1.6,

  // Body font line heights
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 1.75,
};

// ─────────────────────────────────────────────────────────
// Pre-Composed Text Styles
// ─────────────────────────────────────────────────────────

const styles: {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  body: TextStyle;
  bodySmall: TextStyle;
  caption: TextStyle;
  buttonPrimary: TextStyle;
  buttonSecondary: TextStyle;
  link: TextStyle;
  inputLabel: TextStyle;
  inputText: TextStyle;
  inputPlaceholder: TextStyle;
  inputHelper: TextStyle;
  inputError: TextStyle;
} = {
  // Display Headers (Pixel Font)
  h1: {
    fontFamily: fonts.heading,
    fontSize: sizes.pixelXL, // 32
    lineHeight: sizes.pixelXL * lineHeights.pixelNormal, // 44.8
    letterSpacing: 0,
    fontWeight: '400',
    textTransform: 'uppercase' as const,
  },

  h2: {
    fontFamily: fonts.heading,
    fontSize: sizes.pixelLG, // 24
    lineHeight: sizes.pixelLG * lineHeights.pixelNormal, // 33.6
    letterSpacing: 0,
    fontWeight: '400',
    textTransform: 'uppercase' as const,
  },

  h3: {
    fontFamily: fonts.heading,
    fontSize: sizes.pixelBase, // 16
    lineHeight: sizes.pixelBase * lineHeights.pixelNormal, // 22.4
    letterSpacing: 0,
    fontWeight: '400',
    textTransform: 'uppercase' as const,
  },

  // Body Text (Modern Sans-Serif)
  body: {
    fontFamily: fonts.body,
    fontSize: sizes.base, // 16
    lineHeight: sizes.base * lineHeights.normal, // 24
    letterSpacing: 0,
    fontWeight: '400',
  },

  bodySmall: {
    fontFamily: fonts.body,
    fontSize: sizes.sm, // 14
    lineHeight: sizes.sm * lineHeights.normal, // 21
    letterSpacing: 0,
    fontWeight: '400',
  },

  caption: {
    fontFamily: fonts.body,
    fontSize: sizes.xs, // 12
    lineHeight: sizes.xs * lineHeights.snug, // 16.5
    letterSpacing: 0,
    fontWeight: '400',
  },

  // Interactive Text (Buttons, Links)
  buttonPrimary: {
    fontFamily: fonts.heading,
    fontSize: sizes.pixelBase, // 16
    lineHeight: sizes.pixelBase * lineHeights.tight, // 20
    letterSpacing: 0,
    fontWeight: '400',
    textTransform: 'uppercase' as const,
  },

  buttonSecondary: {
    fontFamily: fonts.body,
    fontSize: sizes.base, // 16
    lineHeight: sizes.base * lineHeights.tight, // 20
    letterSpacing: 0.4, // 0.025em * 16px
    fontWeight: '600',
  },

  link: {
    fontFamily: fonts.body,
    fontSize: sizes.sm, // 14
    lineHeight: sizes.sm * lineHeights.snug, // 19.25
    letterSpacing: 0,
    fontWeight: '500',
    textDecorationLine: 'underline' as const,
  },

  // Form Elements
  inputLabel: {
    fontFamily: fonts.body,
    fontSize: sizes.sm, // 14
    lineHeight: sizes.sm * lineHeights.snug, // 19.25
    letterSpacing: 0,
    fontWeight: '600',
  },

  inputText: {
    fontFamily: fonts.body,
    fontSize: sizes.base, // 16
    lineHeight: sizes.base * lineHeights.normal, // 24
    letterSpacing: 0,
    fontWeight: '400',
  },

  inputPlaceholder: {
    fontFamily: fonts.body,
    fontSize: sizes.base, // 16
    lineHeight: sizes.base * lineHeights.normal, // 24
    letterSpacing: 0,
    fontWeight: '400',
  },

  inputHelper: {
    fontFamily: fonts.body,
    fontSize: sizes.xs, // 12
    lineHeight: sizes.xs * lineHeights.snug, // 16.5
    letterSpacing: 0,
    fontWeight: '400',
  },

  inputError: {
    fontFamily: fonts.body,
    fontSize: sizes.xs, // 12
    lineHeight: sizes.xs * lineHeights.snug, // 16.5
    letterSpacing: 0,
    fontWeight: '500',
  },
};

// ─────────────────────────────────────────────────────────
// Export Typography System
// ─────────────────────────────────────────────────────────

export const typography = {
  fonts,
  sizes,
  lineHeights,
  styles,
};
