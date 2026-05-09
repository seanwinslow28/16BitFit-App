/**
 * ArchetypeCard Component Tests
 */

import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import ArchetypeCard from '../index';

const mockArchetype = {
  id: 'trainer',
  name: 'Trainer',
  description: 'Balanced fitness with variety',
  avatarSource: {uri: 'mock://avatar.png'},
};

describe('ArchetypeCard', () => {
  describe('Rendering', () => {
    it('should render correctly with archetype data', () => {
      const {getByText} = render(
        <ArchetypeCard
          archetype={mockArchetype}
          selected={false}
          onSelect={() => {}}
        />,
      );
      expect(getByText('TRAINER')).toBeTruthy();
      expect(getByText('Balanced fitness with variety')).toBeTruthy();
    });

    it('should render in selected state', () => {
      const {getByRole} = render(
        <ArchetypeCard
          archetype={mockArchetype}
          selected={true}
          onSelect={() => {}}
        />,
      );
      const card = getByRole('button');
      expect(card.props.accessibilityState.selected).toBe(true);
    });

    it('should render in unselected state', () => {
      const {getByRole} = render(
        <ArchetypeCard
          archetype={mockArchetype}
          selected={false}
          onSelect={() => {}}
        />,
      );
      const card = getByRole('button');
      expect(card.props.accessibilityState.selected).toBe(false);
    });
  });

  describe('Interaction', () => {
    it('should call onSelect when pressed', () => {
      const onSelectMock = jest.fn();
      const {getByRole} = render(
        <ArchetypeCard
          archetype={mockArchetype}
          selected={false}
          onSelect={onSelectMock}
        />,
      );

      fireEvent.press(getByRole('button'));
      expect(onSelectMock).toHaveBeenCalledTimes(1);
    });

    it('should not call onSelect when disabled', () => {
      const onSelectMock = jest.fn();
      const {getByRole} = render(
        <ArchetypeCard
          archetype={mockArchetype}
          selected={false}
          onSelect={onSelectMock}
          disabled={true}
        />,
      );

      fireEvent.press(getByRole('button'));
      expect(onSelectMock).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have button accessibility role', () => {
      const {getByRole} = render(
        <ArchetypeCard
          archetype={mockArchetype}
          selected={false}
          onSelect={() => {}}
        />,
      );
      expect(getByRole('button')).toBeTruthy();
    });

    it('should have descriptive accessibility label', () => {
      const {getByLabelText} = render(
        <ArchetypeCard
          archetype={mockArchetype}
          selected={false}
          onSelect={() => {}}
        />,
      );
      expect(getByLabelText('Select Trainer archetype')).toBeTruthy();
    });

    it('should use description as accessibility hint', () => {
      const {getByRole} = render(
        <ArchetypeCard
          archetype={mockArchetype}
          selected={false}
          onSelect={() => {}}
        />,
      );
      const card = getByRole('button');
      expect(card.props.accessibilityHint).toBe(
        'Balanced fitness with variety',
      );
    });
  });
});
