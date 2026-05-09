// REWORK-V4: expo-av not installed in V4 — sound pool fully stubbed.
// Original impl pre-loaded a pool of Audio.Sound instances for rapid-fire blink audio
// (50ms intervals). Restore once V4 audio stack is chosen.
/**
 * useSoundPool - Pre-loaded sound pool for rapid audio playback (STUB)
 *
 * @see docs/plans/winston-evolution-ceremony-architecture-validation.md (ADR-004)
 */

import {useCallback} from 'react';

interface UseSoundPoolReturn {
  isLoaded: boolean;
  play: () => void;
}

/**
 * Hook to manage a pool of sound instances for rapid playback.
 * REWORK-V4: returns a no-op while expo-av is unavailable.
 *
 * @param soundAsset - The require() audio asset (or null to disable)
 * @param poolSize - Number of concurrent sound instances (default: 4)
 */
export const useSoundPool = (
  _soundAsset: number | null,
  _poolSize: number = 4,
): UseSoundPoolReturn => {
  const play = useCallback(() => {
    // REWORK-V4: no-op until V4 audio stack lands.
  }, []);

  return {isLoaded: false, play};
};

export default useSoundPool;
