/**
 * WorkoutCompleteCeremony Test Suite
 *
 * Tests rendering, navigation, accessibility, haptics, and edge cases.
 * Uses mocks from jest.setup.js - no inline mocks.
 */

import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react-native';
import WorkoutCompleteCeremony from '../index';

// Navigation mock helpers
const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
const mockReset = jest.fn();

// Override useNavigation for this test file
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
      dispatch: mockDispatch,
      reset: mockReset,
      goBack: jest.fn(),
      setOptions: jest.fn(),
      canGoBack: jest.fn(() => true),
    }),
    useRoute: () => ({
      params: {
        stats: {duration: 312, steps: 487, calories: 42},
        rewards: {
          xp: 50,
          hasTicket: true,
          currentLevel: 1,
          currentXp: 30,
          xpToNextLevel: 100,
        },
      },
      key: 'workout-ceremony-key',
      name: 'WorkoutCompleteCeremony',
    }),
    CommonActions: {
      reset: jest.fn(config => ({type: 'RESET', ...config})),
    },
  };
});

// Access haptic mock
const ReactNativeHapticFeedback = require('react-native-haptic-feedback');

describe('WorkoutCompleteCeremony', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────────────────
  // 1. RENDERING TESTS
  // ─────────────────────────────────────────────────────────

  describe('Rendering', () => {
    it('renders "WORKOUT COMPLETE!" header', () => {
      render(<WorkoutCompleteCeremony />);
      expect(screen.getByText('WORKOUT COMPLETE!')).toBeTruthy();
    });

    it('displays XP reward with correct value', () => {
      render(<WorkoutCompleteCeremony />);
      expect(screen.getByText(/\+50 XP/)).toBeTruthy();
    });

    it('displays battle ticket when hasTicket is true', () => {
      render(<WorkoutCompleteCeremony />);
      expect(screen.getByText(/\+1 BATTLE TICKET/)).toBeTruthy();
    });

    it('displays level progress text', () => {
      render(<WorkoutCompleteCeremony />);
      // currentXp (30) + xp (50) = 80, xpToNextLevel = 100
      expect(screen.getByText(/Level 1/)).toBeTruthy();
      expect(screen.getByText(/80\/100/)).toBeTruthy();
    });

    it('displays workout stats with formatted duration', () => {
      render(<WorkoutCompleteCeremony />);
      // 312 seconds = 5:12
      expect(screen.getByText('5:12')).toBeTruthy();
      expect(screen.getByText('487')).toBeTruthy(); // steps
      expect(screen.getByText('42')).toBeTruthy(); // calories
    });

    it('displays CONTINUE button', () => {
      render(<WorkoutCompleteCeremony />);
      expect(screen.getByText('CONTINUE')).toBeTruthy();
    });
  });

  // ─────────────────────────────────────────────────────────
  // 2. CONDITIONAL RENDERING TESTS
  // ─────────────────────────────────────────────────────────

  describe('Conditional Rendering', () => {
    it('hides battle ticket when hasTicket is false', () => {
      // Override useRoute for this specific test
      jest
        .spyOn(require('@react-navigation/native'), 'useRoute')
        .mockReturnValue({
          params: {
            stats: {duration: 312, steps: 487, calories: 42},
            rewards: {
              xp: 50,
              hasTicket: false,
              currentLevel: 1,
              currentXp: 30,
              xpToNextLevel: 100,
            },
          },
          key: 'test-key',
          name: 'WorkoutCompleteCeremony',
        });

      render(<WorkoutCompleteCeremony />);
      expect(screen.queryByText(/BATTLE TICKET/)).toBeNull();
    });

    it('displays "--" for zero steps', () => {
      jest
        .spyOn(require('@react-navigation/native'), 'useRoute')
        .mockReturnValue({
          params: {
            stats: {duration: 300, steps: 0, calories: 0},
            rewards: {
              xp: 50,
              hasTicket: false,
              currentLevel: 1,
              currentXp: 0,
              xpToNextLevel: 100,
            },
          },
          key: 'test-key',
          name: 'WorkoutCompleteCeremony',
        });

      render(<WorkoutCompleteCeremony />);
      // Should show "--" for steps and calories
      const dashes = screen.getAllByText('--');
      expect(dashes.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ─────────────────────────────────────────────────────────
  // 3. NAVIGATION TESTS
  // ─────────────────────────────────────────────────────────

  describe('Navigation', () => {
    it('dispatches reset action on CONTINUE press', () => {
      render(<WorkoutCompleteCeremony />);
      const button = screen.getByText('CONTINUE');
      fireEvent.press(button);

      expect(mockDispatch).toHaveBeenCalled();
      // Verify reset action structure
      const dispatchCall = mockDispatch.mock.calls[0][0];
      expect(dispatchCall).toMatchObject({
        type: 'RESET',
        index: 0,
        routes: [{name: 'Home'}],
      });
    });
  });

  // ─────────────────────────────────────────────────────────
  // 4. ACCESSIBILITY TESTS
  // ─────────────────────────────────────────────────────────

  describe('Accessibility', () => {
    it('has accessible header with correct role', () => {
      render(<WorkoutCompleteCeremony />);
      const header = screen.getByRole('header');
      expect(header).toBeTruthy();
    });

    it('has accessible CONTINUE button', () => {
      render(<WorkoutCompleteCeremony />);
      const button = screen.getByLabelText(/Continue to Home/i);
      expect(button).toBeTruthy();
    });

    it('has accessible progress bar with progressbar role', () => {
      render(<WorkoutCompleteCeremony />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeTruthy();
    });

    it('XP label is accessible', () => {
      render(<WorkoutCompleteCeremony />);
      const xpLabel = screen.getByLabelText(/Plus 50 experience points/i);
      expect(xpLabel).toBeTruthy();
    });
  });

  // ─────────────────────────────────────────────────────────
  // 5. HAPTIC TESTS
  // ─────────────────────────────────────────────────────────

  // REWORK-V4: react-native-haptic-feedback is stubbed in V4; the production stub
  // is a no-op so this assertion can never fire. Will be re-enabled when haptics
  // are wired through expo-haptics or a V4 haptics abstraction.
  describe.skip('Haptics', () => {
    it('triggers haptic on CONTINUE press', () => {
      render(<WorkoutCompleteCeremony />);
      fireEvent.press(screen.getByText('CONTINUE'));

      expect(ReactNativeHapticFeedback.trigger).toHaveBeenCalledWith(
        'impactMedium',
        expect.any(Object),
      );
    });
  });

  // ─────────────────────────────────────────────────────────
  // 6. EDGE CASES
  // ─────────────────────────────────────────────────────────

  describe('Edge Cases', () => {
    it('handles missing route params gracefully', () => {
      jest
        .spyOn(require('@react-navigation/native'), 'useRoute')
        .mockReturnValue({
          params: undefined,
          key: 'test-key',
          name: 'WorkoutCompleteCeremony',
        });

      // Should not crash, should use fallback values
      expect(() => render(<WorkoutCompleteCeremony />)).not.toThrow();
    });

    it('handles partial route params gracefully', () => {
      jest
        .spyOn(require('@react-navigation/native'), 'useRoute')
        .mockReturnValue({
          params: {
            stats: {duration: 100}, // Missing steps/calories
            rewards: {xp: 25, hasTicket: false}, // Missing level info
          },
          key: 'test-key',
          name: 'WorkoutCompleteCeremony',
        });

      expect(() => render(<WorkoutCompleteCeremony />)).not.toThrow();
    });

    it('caps XP display at xpToNextLevel', () => {
      jest
        .spyOn(require('@react-navigation/native'), 'useRoute')
        .mockReturnValue({
          params: {
            stats: {duration: 300},
            rewards: {
              xp: 100, // Would exceed next level
              hasTicket: false,
              currentLevel: 1,
              currentXp: 50, // 50 + 100 = 150 > 100
              xpToNextLevel: 100,
            },
          },
          key: 'test-key',
          name: 'WorkoutCompleteCeremony',
        });

      render(<WorkoutCompleteCeremony />);
      // Should cap at xpToNextLevel (100)
      expect(screen.getByText(/100\/100/)).toBeTruthy();
    });
  });

  // ─────────────────────────────────────────────────────────
  // 7. ANIMATION INTEGRATION TESTS
  // ─────────────────────────────────────────────────────────

  describe('Animation Integration', () => {
    it('renders all animated elements', () => {
      // Reset mock to default params (previous tests may have changed it)
      jest
        .spyOn(require('@react-navigation/native'), 'useRoute')
        .mockReturnValue({
          params: {
            stats: {duration: 312, steps: 487, calories: 42},
            rewards: {
              xp: 50,
              hasTicket: true,
              currentLevel: 1,
              currentXp: 30,
              xpToNextLevel: 100,
            },
          },
          key: 'test-key',
          name: 'WorkoutCompleteCeremony',
        });

      render(<WorkoutCompleteCeremony />);

      // All 5 stages should be rendered
      expect(screen.getByText('WORKOUT COMPLETE!')).toBeTruthy(); // Stage 1
      expect(screen.getByText(/50 XP/)).toBeTruthy(); // Stage 2 (emoji may vary)
      expect(screen.getByText(/BATTLE TICKET/)).toBeTruthy(); // Stage 3
      expect(screen.getByText('WORKOUT STATS')).toBeTruthy(); // Stage 4
      expect(screen.getByText('CONTINUE')).toBeTruthy(); // Stage 5
    });
  });
});
