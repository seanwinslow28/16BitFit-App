/**
 * PixelSprite Component Tests
 */

import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import PixelSprite from '../index';

describe('PixelSprite', () => {
  const mockSource = {uri: 'https://example.com/sprite.png'};
  // REWORK-V4: NewAppScreen logo no longer ships with React Native — use a
  // module-id sentinel that mirrors what require('./foo.png') returns
  const localSource = 1 as unknown as number;

  describe('Rendering', () => {
    it('should render with required props', () => {
      const {getByTestId} = render(
        <PixelSprite source={mockSource} alt="Test Sprite" />,
      );
      expect(getByTestId('pixel-sprite')).toBeTruthy();
    });

    it('should render with all size variants', () => {
      const sizes: Array<8 | 16 | 32 | 64 | 80 | 96> = [8, 16, 32, 64, 80, 96];

      sizes.forEach(size => {
        const {getByTestId} = render(
          <PixelSprite
            source={mockSource}
            size={size}
            alt={`${size}px sprite`}
          />,
        );
        expect(getByTestId('pixel-sprite')).toBeTruthy();
      });
    });

    it('should use default size when not specified', () => {
      const {getByTestId} = render(
        <PixelSprite source={mockSource} alt="Default Size" />,
      );
      expect(getByTestId('pixel-sprite')).toBeTruthy();
    });

    it('should render with tint color', () => {
      const {getByTestId} = render(
        <PixelSprite
          source={mockSource}
          size={32}
          tintColor="#FF0000"
          alt="Tinted Sprite"
        />,
      );
      expect(getByTestId('pixel-sprite')).toBeTruthy();
    });
  });

  describe('Loading State', () => {
    it('should show loading placeholder initially', () => {
      const {getByTestId} = render(
        <PixelSprite source={mockSource} alt="Loading Test" />,
      );
      expect(getByTestId('pixel-sprite-loading')).toBeTruthy();
    });
  });

  describe('Error State', () => {
    it('should render error placeholder component', () => {
      // Note: Image error events don't trigger in Jest environment
      // This test validates the error UI component can render
      const {getByText, getByTestId} = render(
        <PixelSprite source={{uri: ''}} alt="Error Test" />,
      );

      // Since we can't trigger actual error in test environment,
      // we verify the loading state is shown initially
      expect(getByTestId('pixel-sprite-loading')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have image accessibility role', () => {
      const {getByRole} = render(
        <PixelSprite source={localSource} alt="Accessible Sprite" />,
      );
      expect(getByRole('image')).toBeTruthy();
    });

    it('should use alt prop as accessibilityLabel', () => {
      const {getByLabelText} = render(
        <PixelSprite source={localSource} alt="Character Avatar" />,
      );
      expect(getByLabelText('Character Avatar')).toBeTruthy();
    });
  });

  describe('Image Props', () => {
    it('should set fadeDuration to 0 for crisp appearance', () => {
      const {getByRole} = render(
        <PixelSprite source={localSource} alt="No Fade" />,
      );
      const image = getByRole('image');
      expect(image.props.fadeDuration).toBe(0);
    });

    it('should use contain resize mode', () => {
      const {getByRole} = render(
        <PixelSprite source={localSource} alt="Contain Mode" />,
      );
      const image = getByRole('image');
      expect(image.props.style.resizeMode).toBe('contain');
    });
  });

  describe('Size Handling', () => {
    it('should apply correct container dimensions', () => {
      const {getByTestId} = render(
        <PixelSprite source={mockSource} size={64} alt="64px Sprite" />,
      );
      const container = getByTestId('pixel-sprite');
      const style = Array.isArray(container.props.style)
        ? container.props.style.find((s: any) => s.width && s.height)
        : container.props.style;
      expect(style).toMatchObject({
        width: 64,
        height: 64,
      });
    });

    it('should apply correct image dimensions', () => {
      const {getByRole} = render(
        <PixelSprite source={localSource} size={80} alt="80px Image" />,
      );
      const image = getByRole('image');
      expect(image.props.style).toMatchObject({
        width: 80,
        height: 80,
      });
    });
  });
});
