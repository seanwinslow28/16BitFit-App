import {useState, useEffect} from 'react';
import {AccessibilityInfo} from 'react-native';

/**
 * Hook to detect if the user has enabled "Reduce Motion" in system accessibility settings.
 * Used to disable or simplify animations for accessibility.
 *
 * @returns {boolean} true if reduced motion is enabled
 */
export const useReducedMotion = (): boolean => {
  const [isReducedMotionEnabled, setIsReducedMotionEnabled] = useState(false);

  useEffect(() => {
    const checkMotion = async () => {
      const isEnabled = await AccessibilityInfo.isReduceMotionEnabled();
      setIsReducedMotionEnabled(isEnabled);
    };

    checkMotion();

    // Event listener for changes
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setIsReducedMotionEnabled,
    );

    return () => {
      // Modern RN (0.65+) - subscription object has remove() method
      subscription.remove();
    };
  }, []);

  return isReducedMotionEnabled;
};
