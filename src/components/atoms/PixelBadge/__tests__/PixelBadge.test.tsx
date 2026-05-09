/**
 * PixelBadge Component Tests
 */

import React from 'react';
import {render} from '@testing-library/react-native';
import PixelBadge, {BadgeVariant} from '../index';

describe('PixelBadge', () => {
  describe('Rendering', () => {
    it('should render correctly with count', () => {
      const {getByText} = render(<PixelBadge count={5} />);
      expect(getByText('5')).toBeTruthy();
    });

    it('should not render when count is 0 and not in dot mode', () => {
      const {toJSON} = render(<PixelBadge count={0} />);
      expect(toJSON()).toBeNull();
    });

    it('should render all variant types', () => {
      const variants: BadgeVariant[] = [
        'success',
        'error',
        'warning',
        'info',
        'neutral',
      ];

      variants.forEach(variant => {
        const {getByText} = render(<PixelBadge count={1} variant={variant} />);
        expect(getByText('1')).toBeTruthy();
      });
    });

    it('should render dot mode', () => {
      const {getByLabelText} = render(<PixelBadge dot variant="error" />);
      expect(getByLabelText('error indicator')).toBeTruthy();
    });

    it('should show "99+" for counts over 99', () => {
      const {getByText} = render(<PixelBadge count={150} />);
      expect(getByText('99+')).toBeTruthy();
    });

    it('should show exact count for counts under 100', () => {
      const {getByText} = render(<PixelBadge count={99} />);
      expect(getByText('99')).toBeTruthy();
    });
  });

  describe('Dot Mode', () => {
    it('should render dot instead of count when dot is true', () => {
      const {getByLabelText, queryByText} = render(
        <PixelBadge count={5} dot variant="success" />,
      );

      expect(getByLabelText('success indicator')).toBeTruthy();
      expect(queryByText('5')).toBeNull();
    });

    it('should render dot for all variants', () => {
      const variants: BadgeVariant[] = [
        'success',
        'error',
        'warning',
        'info',
        'neutral',
      ];

      variants.forEach(variant => {
        const {getByLabelText} = render(<PixelBadge dot variant={variant} />);
        expect(getByLabelText(`${variant} indicator`)).toBeTruthy();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have text accessibility role for count mode', () => {
      const {getAllByRole} = render(<PixelBadge count={5} />);
      const textElements = getAllByRole('text');
      expect(textElements.length).toBeGreaterThan(0);
    });

    it('should have text accessibility role for dot mode', () => {
      const {getByRole} = render(<PixelBadge dot />);
      expect(getByRole('text')).toBeTruthy();
    });

    it('should have descriptive accessibility label in count mode', () => {
      const {getByLabelText} = render(
        <PixelBadge count={10} variant="error" />,
      );
      expect(getByLabelText('10 error notifications')).toBeTruthy();
    });

    it('should have descriptive accessibility label in dot mode', () => {
      const {getByLabelText} = render(<PixelBadge dot variant="success" />);
      expect(getByLabelText('success indicator')).toBeTruthy();
    });
  });

  describe('Count Formatting', () => {
    it('should display single digit counts', () => {
      const {getByText} = render(<PixelBadge count={7} />);
      expect(getByText('7')).toBeTruthy();
    });

    it('should display double digit counts', () => {
      const {getByText} = render(<PixelBadge count={42} />);
      expect(getByText('42')).toBeTruthy();
    });

    it('should display "99+" for count of 100', () => {
      const {getByText} = render(<PixelBadge count={100} />);
      expect(getByText('99+')).toBeTruthy();
    });

    it('should display "99+" for counts over 1000', () => {
      const {getByText} = render(<PixelBadge count={1500} />);
      expect(getByText('99+')).toBeTruthy();
    });

    it('should display edge case of 99 correctly', () => {
      const {getByText} = render(<PixelBadge count={99} />);
      expect(getByText('99')).toBeTruthy();
    });
  });

  describe('Variants', () => {
    it('should render success variant', () => {
      const {getByText} = render(<PixelBadge count={1} variant="success" />);
      expect(getByText('1')).toBeTruthy();
    });

    it('should render error variant', () => {
      const {getByText} = render(<PixelBadge count={1} variant="error" />);
      expect(getByText('1')).toBeTruthy();
    });

    it('should render warning variant', () => {
      const {getByText} = render(<PixelBadge count={1} variant="warning" />);
      expect(getByText('1')).toBeTruthy();
    });

    it('should render info variant', () => {
      const {getByText} = render(<PixelBadge count={1} variant="info" />);
      expect(getByText('1')).toBeTruthy();
    });

    it('should render neutral variant', () => {
      const {getByText} = render(<PixelBadge count={1} variant="neutral" />);
      expect(getByText('1')).toBeTruthy();
    });
  });

  describe('Size Customization', () => {
    it('should apply default size of 20', () => {
      const {root} = render(<PixelBadge count={5} />);
      const badge = root.findByType('View' as any);

      const style = Array.isArray(badge.props.style)
        ? Object.assign({}, ...badge.props.style)
        : badge.props.style;

      expect(style.minWidth).toBe(20);
      expect(style.minHeight).toBe(20);
    });

    it('should apply custom size', () => {
      const customSize = 32;
      const {root} = render(<PixelBadge count={5} size={customSize} />);
      const badge = root.findByType('View' as any);

      const style = Array.isArray(badge.props.style)
        ? Object.assign({}, ...badge.props.style)
        : badge.props.style;

      expect(style.minWidth).toBe(customSize);
      expect(style.minHeight).toBe(customSize);
    });
  });
});
