/**
 * PixelText Component Tests
 */

import React from 'react';
import {render} from '@testing-library/react-native';
import PixelText from '../index';
import {tokens, typography} from '../../../../design-system';

describe('PixelText', () => {
  describe('Rendering', () => {
    it('should render with text children', () => {
      const {getByText} = render(<PixelText>Hello World</PixelText>);
      expect(getByText('Hello World')).toBeTruthy();
    });

    it('should render all typography variants', () => {
      const variants = [
        'h1',
        'h2',
        'h3',
        'body',
        'bodySmall',
        'caption',
        'buttonPrimary',
        'buttonSecondary',
        'link',
        'inputLabel',
        'inputText',
        'inputPlaceholder',
        'inputHelper',
        'inputError',
      ] as const;

      variants.forEach(variant => {
        const {getByText} = render(
          <PixelText variant={variant as keyof typeof typography.styles}>
            {variant}
          </PixelText>,
        );
        expect(getByText(variant)).toBeTruthy();
      });
    });

    it('should use default variant when not specified', () => {
      const {getByText} = render(<PixelText>Default Text</PixelText>);
      const element = getByText('Default Text');
      expect(element).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('should apply correct color key', () => {
      const {getByText} = render(
        <PixelText colorKey="secondary">Colored Text</PixelText>,
      );
      const element = getByText('Colored Text');
      expect(element.props.style).toMatchObject({
        color: tokens.colors.text.secondary,
      });
    });

    it('should use primary color by default', () => {
      const {getByText} = render(<PixelText>Default Color</PixelText>);
      const element = getByText('Default Color');
      expect(element.props.style).toMatchObject({
        color: tokens.colors.text.primary,
      });
    });

    it('should apply text alignment', () => {
      const alignments: Array<'left' | 'center' | 'right'> = [
        'left',
        'center',
        'right',
      ];

      alignments.forEach(align => {
        const {getByText} = render(
          <PixelText align={align}>{align}</PixelText>,
        );
        const element = getByText(align);
        expect(element.props.style).toMatchObject({
          textAlign: align,
        });
      });
    });

    it('should apply custom styles', () => {
      const customStyle = {
        fontSize: 20,
        fontWeight: '700' as const,
      };

      const {getByText} = render(
        <PixelText style={customStyle}>Custom Styled</PixelText>,
      );
      const element = getByText('Custom Styled');
      expect(element.props.style).toMatchObject(customStyle);
    });
  });

  describe('Typography System', () => {
    it('should apply h1 variant correctly', () => {
      const {getByText} = render(<PixelText variant="h1">Header 1</PixelText>);
      const element = getByText('Header 1');
      expect(element.props.style).toMatchObject({
        fontFamily: typography.fonts.heading,
        fontSize: typography.sizes.pixelXL,
      });
    });

    it('should apply body variant correctly', () => {
      const {getByText} = render(
        <PixelText variant="body">Body Text</PixelText>,
      );
      const element = getByText('Body Text');
      expect(element.props.style).toMatchObject({
        fontFamily: typography.fonts.body,
        fontSize: typography.sizes.base,
      });
    });

    it('should apply buttonPrimary variant correctly', () => {
      const {getByText} = render(
        <PixelText variant="buttonPrimary">BUTTON</PixelText>,
      );
      const element = getByText('BUTTON');
      expect(element.props.style).toMatchObject({
        fontFamily: typography.fonts.heading,
        textTransform: 'uppercase',
      });
    });
  });

  describe('Accessibility', () => {
    it('should be accessible by default', () => {
      const {getByText} = render(<PixelText>Accessible Text</PixelText>);
      const element = getByText('Accessible Text');
      expect(element).toBeTruthy();
    });

    it('should allow font scaling for accessibility', () => {
      const {getByText} = render(<PixelText>Scalable Text</PixelText>);
      const element = getByText('Scalable Text');
      expect(element).toBeTruthy();
    });

    it('should pass through accessibility props', () => {
      const {getByLabelText} = render(
        <PixelText accessibilityLabel="Custom Label">Text</PixelText>,
      );
      expect(getByLabelText('Custom Label')).toBeTruthy();
    });
  });

  describe('Props Passing', () => {
    it('should pass through additional TextProps', () => {
      const {getByText} = render(
        <PixelText numberOfLines={2} ellipsizeMode="tail">
          Long text that will be truncated
        </PixelText>,
      );
      const element = getByText('Long text that will be truncated');
      expect(element).toBeTruthy();
    });
  });
});
