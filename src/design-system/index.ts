/**
 * 16BitFit Design System
 *
 * Central export for design tokens, typography, animations, and types.
 * Used by all components via: import { tokens, typography, durations, easings } from '@/design-system';
 */

import {tokens} from './tokens';

export {tokens};
export const {colors, spacing} = tokens;
export {typography} from './typography';
export {durations, easings} from './animations';
export * from './types';
