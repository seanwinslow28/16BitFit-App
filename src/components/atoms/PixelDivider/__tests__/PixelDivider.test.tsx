/**
 * PixelDivider Component Tests
 */

import React from 'react';
import {render} from '@testing-library/react-native';
import PixelDivider, {DividerThickness} from '../index';
import {tokens} from '../../../../design-system';

describe('PixelDivider', () => {
  describe('Rendering', () => {
    it('should render correctly with default props', () => {
      const {toJSON} = render(<PixelDivider />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render all thickness variants', () => {
      const thicknesses: DividerThickness[] = ['thin', 'medium', 'thick'];

      thicknesses.forEach(thickness => {
        const {toJSON} = render(<PixelDivider thickness={thickness} />);
        expect(toJSON()).toBeTruthy();
      });
    });

    it('should apply default thickness of medium (3px)', () => {
      const {root} = render(<PixelDivider />);
      const divider = root.findByType('View' as any);

      const style = Array.isArray(divider.props.style)
        ? Object.assign({}, ...divider.props.style)
        : divider.props.style;

      expect(style.height).toBe(tokens.border.width.default); // 3px
    });

    it('should apply thin thickness (2px)', () => {
      const {root} = render(<PixelDivider thickness="thin" />);
      const divider = root.findByType('View' as any);

      const style = Array.isArray(divider.props.style)
        ? Object.assign({}, ...divider.props.style)
        : divider.props.style;

      expect(style.height).toBe(tokens.border.width.thin); // 2px
    });

    it('should apply thick thickness (4px)', () => {
      const {root} = render(<PixelDivider thickness="thick" />);
      const divider = root.findByType('View' as any);

      const style = Array.isArray(divider.props.style)
        ? Object.assign({}, ...divider.props.style)
        : divider.props.style;

      expect(style.height).toBe(tokens.border.width.thick); // 4px
    });

    it('should use default color of DMG dark', () => {
      const {root} = render(<PixelDivider />);
      const divider = root.findByType('View' as any);

      const style = Array.isArray(divider.props.style)
        ? Object.assign({}, ...divider.props.style)
        : divider.props.style;

      expect(style.backgroundColor).toBe(tokens.colors.text.secondary);
    });

    it('should apply custom color', () => {
      const customColor = tokens.colors.button.primary;
      const {root} = render(<PixelDivider color={customColor} />);
      const divider = root.findByType('View' as any);

      const style = Array.isArray(divider.props.style)
        ? Object.assign({}, ...divider.props.style)
        : divider.props.style;

      expect(style.backgroundColor).toBe(customColor);
    });

    it('should use default marginVertical of 24', () => {
      const {root} = render(<PixelDivider />);
      const divider = root.findByType('View' as any);

      const style = Array.isArray(divider.props.style)
        ? Object.assign({}, ...divider.props.style)
        : divider.props.style;

      expect(style.marginVertical).toBe(24);
    });

    it('should apply custom marginVertical', () => {
      const customMargin = 16;
      const {root} = render(<PixelDivider marginVertical={customMargin} />);
      const divider = root.findByType('View' as any);

      const style = Array.isArray(divider.props.style)
        ? Object.assign({}, ...divider.props.style)
        : divider.props.style;

      expect(style.marginVertical).toBe(customMargin);
    });

    it('should always be full width', () => {
      const {root} = render(<PixelDivider />);
      const divider = root.findByType('View' as any);

      const style = Array.isArray(divider.props.style)
        ? Object.assign({}, ...divider.props.style)
        : divider.props.style;

      expect(style.width).toBe('100%');
    });
  });

  describe('Accessibility', () => {
    it('should not be accessible (decorative element)', () => {
      const {root} = render(<PixelDivider />);
      const divider = root.findByType('View' as any);
      expect(divider.props.accessible).toBe(false);
    });
  });

  describe('Visual Variations', () => {
    it('should render thin divider with custom styling', () => {
      const {root} = render(
        <PixelDivider
          thickness="thin"
          color={tokens.colors.background.primary}
          marginVertical={8}
        />,
      );
      const divider = root.findByType('View' as any);

      const style = Array.isArray(divider.props.style)
        ? Object.assign({}, ...divider.props.style)
        : divider.props.style;

      expect(style.height).toBe(tokens.border.width.thin);
      expect(style.backgroundColor).toBe(tokens.colors.background.primary);
      expect(style.marginVertical).toBe(8);
    });

    it('should render thick divider with custom styling', () => {
      const {root} = render(
        <PixelDivider
          thickness="thick"
          color={tokens.colors.text.primary}
          marginVertical={32}
        />,
      );
      const divider = root.findByType('View' as any);

      const style = Array.isArray(divider.props.style)
        ? Object.assign({}, ...divider.props.style)
        : divider.props.style;

      expect(style.height).toBe(tokens.border.width.thick);
      expect(style.backgroundColor).toBe(tokens.colors.text.primary);
      expect(style.marginVertical).toBe(32);
    });
  });
});
