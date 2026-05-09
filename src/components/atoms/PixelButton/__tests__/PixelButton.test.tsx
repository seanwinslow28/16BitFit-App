/**
 * PixelButton Component Tests
 */

import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import PixelButton from '../index';

describe('PixelButton', () => {
  describe('Rendering', () => {
    it('should render with text children', () => {
      const {getByText} = render(
        <PixelButton onPress={() => {}}>CLICK ME</PixelButton>,
      );
      expect(getByText('CLICK ME')).toBeTruthy();
    });

    it('should render all 4 variants', () => {
      const {getByText: getText1} = render(
        <PixelButton variant="primary" onPress={() => {}}>
          Primary
        </PixelButton>,
      );
      expect(getText1('Primary')).toBeTruthy();

      const {getByText: getText2} = render(
        <PixelButton variant="secondary" onPress={() => {}}>
          Secondary
        </PixelButton>,
      );
      expect(getText2('Secondary')).toBeTruthy();

      const {getByText: getText3} = render(
        <PixelButton variant="tertiary" onPress={() => {}}>
          Tertiary
        </PixelButton>,
      );
      expect(getText3('Tertiary')).toBeTruthy();

      const {getByText: getText4} = render(
        <PixelButton variant="icon" onPress={() => {}}>
          I
        </PixelButton>,
      );
      expect(getText4('I')).toBeTruthy();
    });

    it('should render loading spinner when isLoading is true', () => {
      const {getByTestId, queryByText} = render(
        <PixelButton onPress={() => {}} isLoading={true}>
          CLICK ME
        </PixelButton>,
      );

      // Text should not be visible
      expect(queryByText('CLICK ME')).toBeNull();

      // ActivityIndicator should be present
      const button = getByTestId('pixel-button');
      expect(button).toBeTruthy();
    });
  });

  describe('Interaction', () => {
    it('should call onPress when pressed', () => {
      const onPressMock = jest.fn();
      const {getByText} = render(
        <PixelButton onPress={onPressMock}>PRESS ME</PixelButton>,
      );

      fireEvent.press(getByText('PRESS ME'));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const onPressMock = jest.fn();
      const {getByText} = render(
        <PixelButton onPress={onPressMock} disabled={true}>
          DISABLED
        </PixelButton>,
      );

      fireEvent.press(getByText('DISABLED'));
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('should not call onPress when loading', () => {
      const onPressMock = jest.fn();
      const {getByTestId} = render(
        <PixelButton onPress={onPressMock} isLoading={true}>
          LOADING
        </PixelButton>,
      );

      const button = getByTestId('pixel-button');
      fireEvent.press(button);
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have button accessibility role', () => {
      const {getByRole} = render(
        <PixelButton onPress={() => {}}>ACCESSIBLE</PixelButton>,
      );

      expect(getByRole('button')).toBeTruthy();
    });

    it('should use custom accessibilityLabel', () => {
      const {getByLabelText} = render(
        <PixelButton onPress={() => {}} accessibilityLabel="Custom Label">
          BUTTON
        </PixelButton>,
      );

      expect(getByLabelText('Custom Label')).toBeTruthy();
    });

    it('should use children as accessibilityLabel if not provided', () => {
      const {getByLabelText} = render(
        <PixelButton onPress={() => {}}>BUTTON TEXT</PixelButton>,
      );

      expect(getByLabelText('BUTTON TEXT')).toBeTruthy();
    });

    it('should set accessibilityState to disabled when disabled', () => {
      const {getByRole} = render(
        <PixelButton onPress={() => {}} disabled={true}>
          DISABLED
        </PixelButton>,
      );

      const button = getByRole('button');
      expect(button.props.accessibilityState.disabled).toBe(true);
    });

    it('should set accessibilityState to busy when loading', () => {
      const {getByRole} = render(
        <PixelButton onPress={() => {}} isLoading={true}>
          LOADING
        </PixelButton>,
      );

      const button = getByRole('button');
      expect(button.props.accessibilityState.busy).toBe(true);
    });
  });

  describe('States', () => {
    it('should render disabled state', () => {
      const {getByText} = render(
        <PixelButton onPress={() => {}} disabled={true}>
          DISABLED
        </PixelButton>,
      );

      expect(getByText('DISABLED')).toBeTruthy();
    });

    it('should render loading state', () => {
      const {queryByText} = render(
        <PixelButton onPress={() => {}} isLoading={true}>
          LOADING
        </PixelButton>,
      );

      // Text should be replaced by spinner
      expect(queryByText('LOADING')).toBeNull();
    });

    it('should disable interaction when loading', () => {
      const onPressMock = jest.fn();
      const {getByTestId} = render(
        <PixelButton onPress={onPressMock} isLoading={true}>
          LOADING
        </PixelButton>,
      );

      const button = getByTestId('pixel-button');
      fireEvent.press(button);
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });
});
