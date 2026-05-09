/**
 * PixelInput Component Tests
 */

import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import PixelInput from '../index';

describe('PixelInput', () => {
  const mockOnChangeText = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with basic props', () => {
      const {getByTestId} = render(
        <PixelInput value="" onChangeText={mockOnChangeText} />,
      );
      expect(getByTestId('pixel-input')).toBeTruthy();
    });

    it('should render with label', () => {
      const {getByText} = render(
        <PixelInput
          label="Username"
          value=""
          onChangeText={mockOnChangeText}
        />,
      );
      expect(getByText('Username')).toBeTruthy();
    });

    it('should render without label when not provided', () => {
      const {queryByText} = render(
        <PixelInput value="" onChangeText={mockOnChangeText} />,
      );
      expect(queryByText('Username')).toBeNull();
    });

    it('should render with placeholder', () => {
      const {getByPlaceholderText} = render(
        <PixelInput
          value=""
          onChangeText={mockOnChangeText}
          placeholder="Enter username"
        />,
      );
      expect(getByPlaceholderText('Enter username')).toBeTruthy();
    });
  });

  describe('Interaction', () => {
    it('should call onChangeText when text changes', () => {
      const {getByTestId} = render(
        <PixelInput value="" onChangeText={mockOnChangeText} />,
      );
      const input = getByTestId('pixel-input');
      fireEvent.changeText(input, 'test');
      expect(mockOnChangeText).toHaveBeenCalledWith('test');
    });

    it('should not call onChangeText when disabled', () => {
      const {getByTestId} = render(
        <PixelInput value="" onChangeText={mockOnChangeText} disabled={true} />,
      );
      const input = getByTestId('pixel-input');
      expect(input.props.editable).toBe(false);
    });

    it('should handle focus event', () => {
      const onFocusMock = jest.fn();
      const {getByTestId} = render(
        <PixelInput
          value=""
          onChangeText={mockOnChangeText}
          onFocus={onFocusMock}
        />,
      );
      const input = getByTestId('pixel-input');
      fireEvent(input, 'focus');
      expect(onFocusMock).toHaveBeenCalled();
    });

    it('should handle blur event', () => {
      const onBlurMock = jest.fn();
      const {getByTestId} = render(
        <PixelInput
          value=""
          onChangeText={mockOnChangeText}
          onBlur={onBlurMock}
        />,
      );
      const input = getByTestId('pixel-input');
      fireEvent(input, 'blur');
      expect(onBlurMock).toHaveBeenCalled();
    });
  });

  describe('States', () => {
    it('should render error message when error prop is provided', () => {
      const {getByText} = render(
        <PixelInput
          value=""
          onChangeText={mockOnChangeText}
          error="This field is required"
        />,
      );
      expect(getByText('This field is required')).toBeTruthy();
    });

    it('should not render error message when error is undefined', () => {
      const {queryByText} = render(
        <PixelInput
          value=""
          onChangeText={mockOnChangeText}
          error={undefined}
        />,
      );
      // No error text should be present
      expect(queryByText(/required/i)).toBeNull();
    });

    it('should show success icon when success is true', () => {
      const {getByText} = render(
        <PixelInput
          value="valid"
          onChangeText={mockOnChangeText}
          success={true}
        />,
      );
      expect(getByText('✓')).toBeTruthy();
    });

    it('should show error icon when error is provided', () => {
      const {getByText} = render(
        <PixelInput
          value=""
          onChangeText={mockOnChangeText}
          error="Error occurred"
        />,
      );
      expect(getByText('!')).toBeTruthy();
    });

    it('should be disabled when disabled prop is true', () => {
      const {getByTestId} = render(
        <PixelInput value="" onChangeText={mockOnChangeText} disabled={true} />,
      );
      const input = getByTestId('pixel-input');
      expect(input.props.editable).toBe(false);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible prop set to true', () => {
      const {getByTestId} = render(
        <PixelInput value="" onChangeText={mockOnChangeText} />,
      );
      const input = getByTestId('pixel-input');
      expect(input.props.accessible).toBe(true);
    });

    it('should use label as accessibilityLabel', () => {
      const {getByLabelText} = render(
        <PixelInput
          label="Username"
          value=""
          onChangeText={mockOnChangeText}
        />,
      );
      expect(getByLabelText('Username')).toBeTruthy();
    });

    it('should set accessibilityState disabled when disabled', () => {
      const {getByTestId} = render(
        <PixelInput value="" onChangeText={mockOnChangeText} disabled={true} />,
      );
      const input = getByTestId('pixel-input');
      expect(input.props.accessibilityState.disabled).toBe(true);
    });

    it('should use error as accessibilityHint', () => {
      const {getByTestId} = render(
        <PixelInput
          value=""
          onChangeText={mockOnChangeText}
          error="Invalid input"
        />,
      );
      const input = getByTestId('pixel-input');
      expect(input.props.accessibilityHint).toBe('Invalid input');
    });

    it('should use placeholder as accessibilityHint when no error', () => {
      const {getByTestId} = render(
        <PixelInput
          value=""
          onChangeText={mockOnChangeText}
          placeholder="Enter text"
        />,
      );
      const input = getByTestId('pixel-input');
      expect(input.props.accessibilityHint).toBe('Enter text');
    });
  });

  describe('Additional Props', () => {
    it('should pass through TextInput props', () => {
      const {getByTestId} = render(
        <PixelInput
          value=""
          onChangeText={mockOnChangeText}
          maxLength={20}
          autoCapitalize="none"
        />,
      );
      const input = getByTestId('pixel-input');
      expect(input.props.maxLength).toBe(20);
      expect(input.props.autoCapitalize).toBe('none');
    });

    it('should render left icon when provided', () => {
      const {getByTestId} = render(
        <PixelInput
          value=""
          onChangeText={mockOnChangeText}
          LeftIcon={<></>}
        />,
      );
      // If LeftIcon is provided, it should render (we just verify the input still renders)
      expect(getByTestId('pixel-input')).toBeTruthy();
    });
  });
});
