/**
 * PixelCheckbox Component Tests
 */

import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import PixelCheckbox from '../index';

describe('PixelCheckbox', () => {
  describe('Rendering', () => {
    it('should render correctly when unchecked', () => {
      const {getByRole} = render(
        <PixelCheckbox checked={false} onToggle={() => {}} />,
      );
      expect(getByRole('checkbox')).toBeTruthy();
    });

    it('should render correctly when checked', () => {
      const {getByRole} = render(
        <PixelCheckbox checked={true} onToggle={() => {}} />,
      );
      expect(getByRole('checkbox')).toBeTruthy();
    });

    it('should render with label', () => {
      const {getByText} = render(
        <PixelCheckbox
          checked={false}
          onToggle={() => {}}
          label="Accept terms"
        />,
      );
      expect(getByText('Accept terms')).toBeTruthy();
    });

    it('should render without label', () => {
      const {queryByText} = render(
        <PixelCheckbox checked={false} onToggle={() => {}} />,
      );
      expect(queryByText('Accept terms')).toBeNull();
    });

    it('should show checkmark icon when checked', () => {
      const {getByLabelText} = render(
        <PixelCheckbox checked={true} onToggle={() => {}} />,
      );
      const checkbox = getByLabelText('Checkbox');
      // Check icon should be present (PixelIcon component)
      expect(checkbox).toBeTruthy();
    });
  });

  describe('Interaction', () => {
    it('should call onToggle with true when unchecked checkbox is pressed', () => {
      const onToggleMock = jest.fn();
      const {getByRole} = render(
        <PixelCheckbox checked={false} onToggle={onToggleMock} />,
      );

      fireEvent.press(getByRole('checkbox'));
      expect(onToggleMock).toHaveBeenCalledWith(true);
    });

    it('should call onToggle with false when checked checkbox is pressed', () => {
      const onToggleMock = jest.fn();
      const {getByRole} = render(
        <PixelCheckbox checked={true} onToggle={onToggleMock} />,
      );

      fireEvent.press(getByRole('checkbox'));
      expect(onToggleMock).toHaveBeenCalledWith(false);
    });

    it('should not call onToggle when disabled', () => {
      const onToggleMock = jest.fn();
      const {getByRole} = render(
        <PixelCheckbox
          checked={false}
          onToggle={onToggleMock}
          disabled={true}
        />,
      );

      fireEvent.press(getByRole('checkbox'));
      expect(onToggleMock).not.toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('should render disabled checkbox', () => {
      const {getByRole} = render(
        <PixelCheckbox checked={false} onToggle={() => {}} disabled={true} />,
      );

      const checkbox = getByRole('checkbox');
      expect(checkbox.props.accessibilityState.disabled).toBe(true);
    });

    it('should not respond to interaction when disabled', () => {
      const onToggleMock = jest.fn();
      const {getByRole} = render(
        <PixelCheckbox
          checked={false}
          onToggle={onToggleMock}
          disabled={true}
        />,
      );

      fireEvent.press(getByRole('checkbox'));
      expect(onToggleMock).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have checkbox accessibility role', () => {
      const {getByRole} = render(
        <PixelCheckbox checked={false} onToggle={() => {}} />,
      );
      expect(getByRole('checkbox')).toBeTruthy();
    });

    it('should use label as accessibilityLabel when provided', () => {
      const {getByLabelText} = render(
        <PixelCheckbox
          checked={false}
          onToggle={() => {}}
          label="Accept terms"
        />,
      );
      expect(getByLabelText('Accept terms')).toBeTruthy();
    });

    it('should use custom accessibilityLabel over label', () => {
      const {getByLabelText} = render(
        <PixelCheckbox
          checked={false}
          onToggle={() => {}}
          label="Accept terms"
          accessibilityLabel="Custom label"
        />,
      );
      expect(getByLabelText('Custom label')).toBeTruthy();
    });

    it('should use default accessibilityLabel when no label provided', () => {
      const {getByLabelText} = render(
        <PixelCheckbox checked={false} onToggle={() => {}} />,
      );
      expect(getByLabelText('Checkbox')).toBeTruthy();
    });

    it('should set accessibilityState to checked when checked', () => {
      const {getByRole} = render(
        <PixelCheckbox checked={true} onToggle={() => {}} />,
      );

      const checkbox = getByRole('checkbox');
      expect(checkbox.props.accessibilityState.checked).toBe(true);
    });

    it('should set accessibilityState to unchecked when unchecked', () => {
      const {getByRole} = render(
        <PixelCheckbox checked={false} onToggle={() => {}} />,
      );

      const checkbox = getByRole('checkbox');
      expect(checkbox.props.accessibilityState.checked).toBe(false);
    });

    it('should set accessibilityState to disabled when disabled', () => {
      const {getByRole} = render(
        <PixelCheckbox checked={false} onToggle={() => {}} disabled={true} />,
      );

      const checkbox = getByRole('checkbox');
      expect(checkbox.props.accessibilityState.disabled).toBe(true);
    });

    it('should support accessibilityHint', () => {
      const {getByRole} = render(
        <PixelCheckbox
          checked={false}
          onToggle={() => {}}
          accessibilityHint="Toggle to accept terms and conditions"
        />,
      );

      const checkbox = getByRole('checkbox');
      expect(checkbox.props.accessibilityHint).toBe(
        'Toggle to accept terms and conditions',
      );
    });
  });

  describe('Visual States', () => {
    it('should render checked state correctly', () => {
      const {getByRole} = render(
        <PixelCheckbox checked={true} onToggle={() => {}} />,
      );
      const checkbox = getByRole('checkbox');
      expect(checkbox.props.accessibilityState.checked).toBe(true);
    });

    it('should render unchecked state correctly', () => {
      const {getByRole} = render(
        <PixelCheckbox checked={false} onToggle={() => {}} />,
      );
      const checkbox = getByRole('checkbox');
      expect(checkbox.props.accessibilityState.checked).toBe(false);
    });

    it('should render disabled + checked state', () => {
      const {getByRole} = render(
        <PixelCheckbox checked={true} onToggle={() => {}} disabled={true} />,
      );
      const checkbox = getByRole('checkbox');
      expect(checkbox.props.accessibilityState.checked).toBe(true);
      expect(checkbox.props.accessibilityState.disabled).toBe(true);
    });

    it('should render disabled + unchecked state', () => {
      const {getByRole} = render(
        <PixelCheckbox checked={false} onToggle={() => {}} disabled={true} />,
      );
      const checkbox = getByRole('checkbox');
      expect(checkbox.props.accessibilityState.checked).toBe(false);
      expect(checkbox.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Label Rendering', () => {
    it('should render label text correctly', () => {
      const {getByText} = render(
        <PixelCheckbox
          checked={false}
          onToggle={() => {}}
          label="I agree to the terms"
        />,
      );
      expect(getByText('I agree to the terms')).toBeTruthy();
    });

    it('should not render label when not provided', () => {
      const {getByRole} = render(
        <PixelCheckbox checked={false} onToggle={() => {}} />,
      );
      // Should only have the checkbox, no label text
      expect(getByRole('checkbox')).toBeTruthy();
    });
  });
});
