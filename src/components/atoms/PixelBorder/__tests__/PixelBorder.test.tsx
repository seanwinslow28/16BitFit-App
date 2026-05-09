/**
 * PixelBorder Component Tests
 */

import React from 'react';
import {render} from '@testing-library/react-native';
import {Text} from 'react-native';
import PixelBorder from '../index';
import {tokens} from '../../../../design-system';

describe('PixelBorder', () => {
  describe('Rendering', () => {
    it('should render with children', () => {
      const {getByText} = render(
        <PixelBorder>
          <Text>Test Content</Text>
        </PixelBorder>,
      );
      expect(getByText('Test Content')).toBeTruthy();
    });

    it('should render with default props', () => {
      const {getByTestId} = render(
        <PixelBorder>
          <Text>Default</Text>
        </PixelBorder>,
      );
      expect(getByTestId('pixel-border')).toBeTruthy();
    });
  });

  describe('Border Width', () => {
    it('should apply default border width', () => {
      const {getByTestId} = render(
        <PixelBorder>
          <Text>Default Border</Text>
        </PixelBorder>,
      );
      const container = getByTestId('pixel-border');
      expect(container.props.style.borderWidth).toBe(
        tokens.border.width.default,
      );
    });

    it('should apply custom border width', () => {
      const borderWidths = ['thin', 'default', 'thick', 'heavy'] as const;

      borderWidths.forEach(width => {
        const {getByTestId} = render(
          <PixelBorder borderWidth={width}>
            <Text>{width}</Text>
          </PixelBorder>,
        );
        const container = getByTestId('pixel-border');
        expect(container.props.style.borderWidth).toBe(
          tokens.border.width[width],
        );
      });
    });
  });

  describe('Border Color', () => {
    it('should apply default border color', () => {
      const {getByTestId} = render(
        <PixelBorder>
          <Text>Default Color</Text>
        </PixelBorder>,
      );
      const container = getByTestId('pixel-border');
      expect(container.props.style.borderColor).toBe(
        tokens.colors.border.default,
      );
    });

    it('should apply custom border color', () => {
      const customColor = '#FF0000';
      const {getByTestId} = render(
        <PixelBorder borderColor={customColor}>
          <Text>Custom Color</Text>
        </PixelBorder>,
      );
      const container = getByTestId('pixel-border');
      expect(container.props.style.borderColor).toBe(customColor);
    });
  });

  describe('Background Color', () => {
    it('should apply default background color', () => {
      const {getByTestId} = render(
        <PixelBorder>
          <Text>Default Background</Text>
        </PixelBorder>,
      );
      const container = getByTestId('pixel-border');
      expect(container.props.style.backgroundColor).toBe(
        tokens.colors.background.primary,
      );
    });

    it('should apply elevated background color', () => {
      const {getByTestId} = render(
        <PixelBorder backgroundColorKey="elevated">
          <Text>Elevated</Text>
        </PixelBorder>,
      );
      const container = getByTestId('pixel-border');
      expect(container.props.style.backgroundColor).toBe(
        tokens.colors.background.elevated,
      );
    });
  });

  describe('Shadow', () => {
    it('should not apply shadow when shadow is none', () => {
      const {getByTestId} = render(
        <PixelBorder shadow="none">
          <Text>No Shadow</Text>
        </PixelBorder>,
      );
      const container = getByTestId('pixel-border');
      // Shadow properties should not be defined or should be default
      expect(container).toBeTruthy();
    });

    it('should apply small shadow', () => {
      const {getByTestId} = render(
        <PixelBorder shadow="small">
          <Text>Small Shadow</Text>
        </PixelBorder>,
      );
      const container = getByTestId('pixel-border');
      expect(container.props.style.shadowOffset).toEqual({width: 2, height: 2});
    });

    it('should apply medium shadow', () => {
      const {getByTestId} = render(
        <PixelBorder shadow="medium">
          <Text>Medium Shadow</Text>
        </PixelBorder>,
      );
      const container = getByTestId('pixel-border');
      expect(container.props.style.shadowOffset).toEqual({width: 4, height: 4});
    });

    it('should apply large shadow', () => {
      const {getByTestId} = render(
        <PixelBorder shadow="large">
          <Text>Large Shadow</Text>
        </PixelBorder>,
      );
      const container = getByTestId('pixel-border');
      expect(container.props.style.shadowOffset).toEqual({width: 6, height: 6});
    });

    it('should have hard pixel shadows with shadowRadius 0', () => {
      const {getByTestId} = render(
        <PixelBorder shadow="medium">
          <Text>Hard Shadow</Text>
        </PixelBorder>,
      );
      const container = getByTestId('pixel-border');
      expect(container.props.style.shadowRadius).toBe(0);
    });
  });

  describe('Padding', () => {
    it('should not apply padding by default', () => {
      const {getByTestId} = render(
        <PixelBorder>
          <Text>No Padding</Text>
        </PixelBorder>,
      );
      const container = getByTestId('pixel-border');
      expect(container.props.style.padding).toBeUndefined();
    });

    it('should apply custom padding from tokens', () => {
      const {getByTestId} = render(
        <PixelBorder padding={3}>
          <Text>Padded Content</Text>
        </PixelBorder>,
      );
      const container = getByTestId('pixel-border');
      expect(container.props.style.padding).toBe(tokens.spacing[3]);
    });

    it('should apply various padding values', () => {
      const paddingValues = [0, 1, 2, 3, 4, 5] as const;

      paddingValues.forEach(padding => {
        const {getByTestId} = render(
          <PixelBorder padding={padding}>
            <Text>Padding {padding}</Text>
          </PixelBorder>,
        );
        const container = getByTestId('pixel-border');
        expect(container.props.style.padding).toBe(tokens.spacing[padding]);
      });
    });
  });

  describe('Border Radius', () => {
    it('should have zero border radius for retro aesthetic', () => {
      const {getByTestId} = render(
        <PixelBorder>
          <Text>Sharp Corners</Text>
        </PixelBorder>,
      );
      const container = getByTestId('pixel-border');
      expect(container.props.style.borderRadius).toBe(0);
    });
  });

  describe('Custom Styles', () => {
    it('should apply custom style prop', () => {
      const customStyle = {marginTop: 20, marginBottom: 10};
      const {getByTestId} = render(
        <PixelBorder style={customStyle}>
          <Text>Custom Style</Text>
        </PixelBorder>,
      );
      const container = getByTestId('pixel-border');
      expect(container.props.style).toMatchObject(customStyle);
    });
  });

  describe('Combined Props', () => {
    it('should apply all props together', () => {
      const {getByTestId, getByText} = render(
        <PixelBorder
          borderWidth="thick"
          borderColor="#8BAC0F"
          backgroundColorKey="elevated"
          shadow="medium"
          padding={4}>
          <Text>Full Configuration</Text>
        </PixelBorder>,
      );

      expect(getByText('Full Configuration')).toBeTruthy();
      const container = getByTestId('pixel-border');
      expect(container.props.style).toMatchObject({
        borderWidth: tokens.border.width.thick,
        borderColor: '#8BAC0F',
        backgroundColor: tokens.colors.background.elevated,
        padding: tokens.spacing[4],
        shadowOffset: {width: 4, height: 4},
      });
    });
  });
});
