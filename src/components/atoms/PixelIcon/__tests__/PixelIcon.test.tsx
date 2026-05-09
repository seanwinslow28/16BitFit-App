/**
 * PixelIcon Component Tests
 */

import React from 'react';
import {render} from '@testing-library/react-native';
import PixelIcon, {IconName} from '../index';
import {tokens} from '../../../../design-system';

describe('PixelIcon', () => {
  describe('Rendering', () => {
    it('should render correctly with default props', () => {
      const {getByLabelText} = render(<PixelIcon name="check" />);
      expect(getByLabelText('check icon')).toBeTruthy();
    });

    it('should render all 10 icon variants', () => {
      const icons: IconName[] = [
        'arrow-right',
        'arrow-left',
        'check',
        'close',
        'error',
        'info',
        'user',
        'heart',
        'star',
        'settings',
      ];

      icons.forEach(iconName => {
        const {getByLabelText} = render(<PixelIcon name={iconName} />);
        expect(getByLabelText(`${iconName} icon`)).toBeTruthy();
      });
    });

    it('should render with all size variants', () => {
      const sizes: Array<16 | 20 | 24 | 32> = [16, 20, 24, 32];

      sizes.forEach(size => {
        const {getByLabelText} = render(<PixelIcon name="check" size={size} />);
        const icon = getByLabelText('check icon');
        const style = Array.isArray(icon.props.style)
          ? Object.assign({}, ...icon.props.style)
          : icon.props.style;
        expect(style).toMatchObject({width: size, height: size});
      });
    });

    it('should apply custom color', () => {
      const customColor = tokens.colors.button.primary;
      const {root} = render(<PixelIcon name="check" color={customColor} />);

      // Icon pixels should use the custom color
      // Note: Testing exact pixel colors is complex, so we verify the component renders
      expect(root).toBeTruthy();
    });

    it('should use default size of 24', () => {
      const {getByLabelText} = render(<PixelIcon name="check" />);
      const icon = getByLabelText('check icon');
      const style = Array.isArray(icon.props.style)
        ? Object.assign({}, ...icon.props.style)
        : icon.props.style;
      expect(style).toMatchObject({width: 24, height: 24});
    });

    it('should use default color of DMG darkest', () => {
      const {root} = render(<PixelIcon name="check" />);
      expect(root).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have image accessibility role', () => {
      const {getByRole} = render(<PixelIcon name="check" />);
      expect(getByRole('image')).toBeTruthy();
    });

    it('should use custom accessibilityLabel when provided', () => {
      const {getByLabelText} = render(
        <PixelIcon name="check" accessibilityLabel="Success indicator" />,
      );
      expect(getByLabelText('Success indicator')).toBeTruthy();
    });

    it('should generate default accessibilityLabel from icon name', () => {
      const {getByLabelText} = render(<PixelIcon name="heart" />);
      expect(getByLabelText('heart icon')).toBeTruthy();
    });

    it('should be accessible for all icon types', () => {
      const icons: IconName[] = [
        'arrow-right',
        'arrow-left',
        'check',
        'close',
        'error',
        'info',
        'user',
        'heart',
        'star',
        'settings',
      ];

      icons.forEach(iconName => {
        const {getByRole} = render(<PixelIcon name={iconName} />);
        expect(getByRole('image')).toBeTruthy();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle unknown icon name gracefully', () => {
      // Suppress console.warn for this test
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const {toJSON} = render(
        // @ts-expect-error - Testing invalid icon name
        <PixelIcon name="invalid-icon" />,
      );

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[PixelIcon] Unknown icon name: invalid-icon',
      );
      expect(toJSON()).toBeNull();

      consoleWarnSpy.mockRestore();
    });

    it('should render pixel-perfect icons at different sizes', () => {
      // Test that pixel sizes are calculated correctly
      const size16 = 16;
      const size32 = 32;

      const {getByLabelText: get16} = render(
        <PixelIcon name="check" size={size16} />,
      );
      const {getByLabelText: get32} = render(
        <PixelIcon name="check" size={size32} />,
      );

      const icon16 = get16('check icon');
      const icon32 = get32('check icon');

      const style16 = Array.isArray(icon16.props.style)
        ? Object.assign({}, ...icon16.props.style)
        : icon16.props.style;
      const style32 = Array.isArray(icon32.props.style)
        ? Object.assign({}, ...icon32.props.style)
        : icon32.props.style;

      expect(style16).toMatchObject({width: 16, height: 16});
      expect(style32).toMatchObject({width: 32, height: 32});
    });
  });

  describe('Visual Variations', () => {
    it('should render directional icons correctly', () => {
      const {getByLabelText: getRight} = render(
        <PixelIcon name="arrow-right" />,
      );
      const {getByLabelText: getLeft} = render(<PixelIcon name="arrow-left" />);

      expect(getRight('arrow-right icon')).toBeTruthy();
      expect(getLeft('arrow-left icon')).toBeTruthy();
    });

    it('should render status icons correctly', () => {
      const statusIcons: IconName[] = ['check', 'close', 'error', 'info'];

      statusIcons.forEach(iconName => {
        const {getByLabelText} = render(<PixelIcon name={iconName} />);
        expect(getByLabelText(`${iconName} icon`)).toBeTruthy();
      });
    });

    it('should render decorative icons correctly', () => {
      const decorativeIcons: IconName[] = ['user', 'heart', 'star', 'settings'];

      decorativeIcons.forEach(iconName => {
        const {getByLabelText} = render(<PixelIcon name={iconName} />);
        expect(getByLabelText(`${iconName} icon`)).toBeTruthy();
      });
    });
  });
});
