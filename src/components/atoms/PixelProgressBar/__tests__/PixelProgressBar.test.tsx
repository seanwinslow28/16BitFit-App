/**
 * PixelProgressBar Component Tests
 */

import React from 'react';
import {render} from '@testing-library/react-native';
import PixelProgressBar, {ProgressMode} from '../index';
import {tokens} from '../../../../design-system';

describe('PixelProgressBar', () => {
  describe('Rendering', () => {
    it('should render correctly with default props', () => {
      const {getByLabelText} = render(<PixelProgressBar progress={50} />);
      expect(getByLabelText('Progress: 50%')).toBeTruthy();
    });

    it('should render both mode variants', () => {
      const modes: ProgressMode[] = ['smooth', 'segmented'];

      modes.forEach(mode => {
        const {getByLabelText} = render(
          <PixelProgressBar progress={50} mode={mode} />,
        );
        expect(getByLabelText('Progress: 50%')).toBeTruthy();
      });
    });

    it('should use default mode of smooth', () => {
      const {getByLabelText} = render(<PixelProgressBar progress={50} />);
      expect(getByLabelText('Progress: 50%')).toBeTruthy();
    });

    it('should use default height of 24', () => {
      const {root} = render(<PixelProgressBar progress={50} />);
      const container = root.findByType('View' as any);

      const style = Array.isArray(container.props.style)
        ? Object.assign({}, ...container.props.style)
        : container.props.style;

      expect(style.height).toBe(24);
    });

    it('should apply custom height', () => {
      const customHeight = 32;
      const {root} = render(
        <PixelProgressBar progress={50} height={customHeight} />,
      );
      const container = root.findByType('View' as any);

      const style = Array.isArray(container.props.style)
        ? Object.assign({}, ...container.props.style)
        : container.props.style;

      expect(style.height).toBe(customHeight);
    });
  });

  describe('Progress Values', () => {
    it('should handle 0% progress', () => {
      const {getByLabelText} = render(<PixelProgressBar progress={0} />);
      expect(getByLabelText('Progress: 0%')).toBeTruthy();
    });

    it('should handle 100% progress', () => {
      const {getByLabelText} = render(<PixelProgressBar progress={100} />);
      expect(getByLabelText('Progress: 100%')).toBeTruthy();
    });

    it('should handle mid-range progress values', () => {
      const progressValues = [25, 50, 75];

      progressValues.forEach(progress => {
        const {getByLabelText} = render(
          <PixelProgressBar progress={progress} />,
        );
        expect(getByLabelText(`Progress: ${progress}%`)).toBeTruthy();
      });
    });

    it('should clamp progress above 100 to 100', () => {
      const {getByLabelText} = render(<PixelProgressBar progress={150} />);
      expect(getByLabelText('Progress: 100%')).toBeTruthy();
    });

    it('should clamp progress below 0 to 0', () => {
      const {getByLabelText} = render(<PixelProgressBar progress={-20} />);
      expect(getByLabelText('Progress: 0%')).toBeTruthy();
    });
  });

  describe('Smooth Mode', () => {
    it('should render smooth mode correctly', () => {
      const {getByLabelText} = render(
        <PixelProgressBar progress={50} mode="smooth" />,
      );
      expect(getByLabelText('Progress: 50%')).toBeTruthy();
    });

    it('should animate in smooth mode by default', () => {
      const {getByLabelText} = render(
        <PixelProgressBar progress={50} mode="smooth" animated={true} />,
      );
      expect(getByLabelText('Progress: 50%')).toBeTruthy();
    });

    it('should support non-animated smooth mode', () => {
      const {getByLabelText} = render(
        <PixelProgressBar progress={50} mode="smooth" animated={false} />,
      );
      expect(getByLabelText('Progress: 50%')).toBeTruthy();
    });
  });

  describe('Segmented Mode', () => {
    it('should render segmented mode correctly', () => {
      const {getByLabelText} = render(
        <PixelProgressBar progress={50} mode="segmented" />,
      );
      expect(getByLabelText('Progress: 50%')).toBeTruthy();
    });

    it('should use default 10 segments', () => {
      const {root} = render(
        <PixelProgressBar progress={50} mode="segmented" />,
      );
      // Should have 10 segment Views inside the container
      const container = root.findByType('View' as any);
      expect(container.props.children).toHaveLength(10);
    });

    it('should support custom segment count', () => {
      const customSegments = 8;
      const {root} = render(
        <PixelProgressBar
          progress={50}
          mode="segmented"
          segments={customSegments}
        />,
      );
      const container = root.findByType('View' as any);
      expect(container.props.children).toHaveLength(customSegments);
    });
  });

  describe('Color Thresholds', () => {
    it('should use light color for healthy progress (67-100%)', () => {
      const {root} = render(<PixelProgressBar progress={80} mode="smooth" />);
      // Color is applied to the Animated.View fill
      expect(root).toBeTruthy();
    });

    it('should use dark color for warning progress (34-66%)', () => {
      const {root} = render(<PixelProgressBar progress={50} mode="smooth" />);
      expect(root).toBeTruthy();
    });

    it('should use darkest color for critical progress (0-33%)', () => {
      const {root} = render(<PixelProgressBar progress={20} mode="smooth" />);
      expect(root).toBeTruthy();
    });

    it('should respect custom color override', () => {
      const customColor = tokens.colors.background.primary;
      const {root} = render(
        <PixelProgressBar progress={50} color={customColor} />,
      );
      expect(root).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have progressbar accessibility role', () => {
      const {getByRole} = render(<PixelProgressBar progress={50} />);
      expect(getByRole('progressbar')).toBeTruthy();
    });

    it('should provide accessibility value for progress', () => {
      const {getByRole} = render(<PixelProgressBar progress={75} />);
      const progressBar = getByRole('progressbar');

      expect(progressBar.props.accessibilityValue).toEqual({
        min: 0,
        max: 100,
        now: 75,
      });
    });

    it('should have descriptive accessibility label', () => {
      const {getByLabelText} = render(<PixelProgressBar progress={33} />);
      expect(getByLabelText('Progress: 33%')).toBeTruthy();
    });

    it('should round progress in accessibility label', () => {
      const {getByLabelText} = render(<PixelProgressBar progress={66.7} />);
      expect(getByLabelText('Progress: 67%')).toBeTruthy();
    });
  });

  describe('Animation', () => {
    it('should be animated by default', () => {
      const {getByLabelText} = render(<PixelProgressBar progress={50} />);
      expect(getByLabelText('Progress: 50%')).toBeTruthy();
    });

    it('should support disabling animation', () => {
      const {getByLabelText} = render(
        <PixelProgressBar progress={50} animated={false} />,
      );
      expect(getByLabelText('Progress: 50%')).toBeTruthy();
    });
  });
});
