import {useEffect, useState} from 'react';
import * as Font from 'expo-font';

/**
 * Custom hook to load custom fonts for 16BitFit
 * Loads Press Start 2P (pixel font) and Montserrat (body font)
 */
export const useCustomFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          // Press Start 2P - Pixel font for headers/buttons
          'PressStart2P-Regular': require('../../assets/fonts/Press_Start_2P/PressStart2P-Regular.ttf'),

          // Montserrat - Body font (various weights)
          'Montserrat-Regular': require('../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf'),
          'Montserrat-Medium': require('../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf'),
          'Montserrat-SemiBold': require('../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf'),
          'Montserrat-Bold': require('../../assets/fonts/Montserrat/static/Montserrat-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (e) {
        console.error('Error loading fonts:', e);
        setError(e as Error);
      }
    }

    loadFonts();
  }, []);

  return {fontsLoaded, error};
};
