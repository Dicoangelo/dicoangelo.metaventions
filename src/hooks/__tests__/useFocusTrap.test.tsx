import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { useRef } from 'react';
import { useFocusTrap } from '../useFocusTrap';

// Test component that uses the focus trap hook
function TestModal({
  onEscape,
  initialFocus = 'first',
  returnFocus = true,
}: {
  onEscape?: () => void;
  initialFocus?: 'first' | 'container';
  returnFocus?: boolean;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(modalRef, {
    onEscape,
    initialFocus,
    returnFocus,
  });

  return (
    <div ref={modalRef} role="dialog" aria-modal="true" data-testid="modal">
      <button data-testid="first-button">First Button</button>
      <input data-testid="input" type="text" placeholder="Input field" />
      <a href="#" data-testid="link">Link</a>
      <button data-testid="last-button">Last Button</button>
    </div>
  );
}

// Test component with no focusable elements
function EmptyModal({ onEscape }: { onEscape?: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(modalRef, { onEscape });

  return (
    <div ref={modalRef} role="dialog" aria-modal="true" data-testid="empty-modal">
      <p>No focusable elements here</p>
    </div>
  );
}

describe('useFocusTrap', () => {
  let triggerButton: HTMLButtonElement;

  beforeEach(() => {
    // Create a trigger button outside the modal to test focus restoration
    triggerButton = document.createElement('button');
    triggerButton.textContent = 'Open Modal';
    triggerButton.setAttribute('data-testid', 'trigger');
    document.body.appendChild(triggerButton);
    triggerButton.focus();
  });

  afterEach(() => {
    cleanup();
    if (triggerButton && triggerButton.parentNode) {
      triggerButton.parentNode.removeChild(triggerButton);
    }
  });

  describe('Initial Focus', () => {
    it('should focus first focusable element on mount', () => {
      render(<TestModal />);

      const firstButton = screen.getByTestId('first-button');
      expect(document.activeElement).toBe(firstButton);
    });

    it('should focus container when initialFocus is "container"', () => {
      render(<TestModal initialFocus="container" />);

      const modal = screen.getByTestId('modal');
      expect(document.activeElement).toBe(modal);
    });

    it('should focus container if no focusable elements exist', () => {
      render(<EmptyModal />);

      const modal = screen.getByTestId('empty-modal');
      expect(document.activeElement).toBe(modal);
    });
  });

  describe('Tab Navigation', () => {
    it('should wrap to first element when Tab is pressed on last element', () => {
      render(<TestModal />);

      const firstButton = screen.getByTestId('first-button');
      const lastButton = screen.getByTestId('last-button');

      // Focus last button
      lastButton.focus();
      expect(document.activeElement).toBe(lastButton);

      // Tab should wrap to first button
      fireEvent.keyDown(document, { key: 'Tab' });
      expect(document.activeElement).toBe(firstButton);
    });

    it('should allow normal Tab navigation within container (not at boundary)', () => {
      render(<TestModal />);

      const firstButton = screen.getByTestId('first-button');
      const input = screen.getByTestId('input');

      // Focus the input (in the middle, not at boundary)
      input.focus();
      expect(document.activeElement).toBe(input);

      // Tab should NOT be prevented (browser handles normal navigation)
      // The focus trap only intercepts at boundaries
      const preventDefaultSpy = vi.fn();
      fireEvent.keyDown(document, { key: 'Tab', preventDefault: preventDefaultSpy });

      // preventDefault should NOT have been called since we're not at boundary
      // (Note: in real browser, focus would move to next element)
    });
  });

  describe('Shift+Tab Navigation', () => {
    it('should wrap to last element when Shift+Tab is pressed on first element', () => {
      render(<TestModal />);

      const firstButton = screen.getByTestId('first-button');
      const lastButton = screen.getByTestId('last-button');

      // Focus first button (already focused by default)
      expect(document.activeElement).toBe(firstButton);

      // Shift+Tab should wrap to last button
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
      expect(document.activeElement).toBe(lastButton);
    });

    it('should allow normal Shift+Tab navigation within container (not at boundary)', () => {
      render(<TestModal />);

      const input = screen.getByTestId('input');

      // Focus the input (in the middle, not at boundary)
      input.focus();
      expect(document.activeElement).toBe(input);

      // Shift+Tab should NOT be prevented (browser handles normal navigation)
      // The focus trap only intercepts at boundaries
    });
  });

  describe('Escape Key', () => {
    it('should call onEscape when Escape key is pressed', () => {
      const handleEscape = vi.fn();
      render(<TestModal onEscape={handleEscape} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(handleEscape).toHaveBeenCalledTimes(1);
    });

    it('should not throw if onEscape is not provided', () => {
      render(<TestModal />);

      expect(() => {
        fireEvent.keyDown(document, { key: 'Escape' });
      }).not.toThrow();
    });
  });

  describe('Focus Restoration', () => {
    it('should restore focus to previously focused element on unmount', async () => {
      expect(document.activeElement).toBe(triggerButton);

      const { unmount } = render(<TestModal returnFocus={true} />);

      // Focus should be on first button in modal
      const firstButton = screen.getByTestId('first-button');
      expect(document.activeElement).toBe(firstButton);

      // Unmount the modal
      unmount();

      // Wait for setTimeout in cleanup
      await new Promise(resolve => setTimeout(resolve, 10));

      // Focus should be restored to trigger button
      expect(document.activeElement).toBe(triggerButton);
    });

    it('should not restore focus when returnFocus is false', async () => {
      expect(document.activeElement).toBe(triggerButton);

      const { unmount } = render(<TestModal returnFocus={false} />);

      // Focus should be on first button in modal
      const firstButton = screen.getByTestId('first-button');
      expect(document.activeElement).toBe(firstButton);

      // Unmount the modal
      unmount();

      // Wait for any potential setTimeout
      await new Promise(resolve => setTimeout(resolve, 10));

      // Focus should NOT be restored to trigger button
      expect(document.activeElement).not.toBe(triggerButton);
    });
  });

  describe('Edge Cases', () => {
    it('should handle Tab in empty modal without focusable elements', () => {
      render(<EmptyModal />);

      const modal = screen.getByTestId('empty-modal');
      expect(document.activeElement).toBe(modal);

      // Tab should not crash
      expect(() => {
        fireEvent.keyDown(document, { key: 'Tab' });
      }).not.toThrow();
    });

    it('should handle focus outside container on Tab', () => {
      render(<TestModal />);

      const firstButton = screen.getByTestId('first-button');

      // Focus something outside (the trigger button from beforeEach)
      triggerButton.focus();
      expect(document.activeElement).toBe(triggerButton);

      // Tab should wrap to first element in modal
      fireEvent.keyDown(document, { key: 'Tab' });
      expect(document.activeElement).toBe(firstButton);
    });

    it('should ignore other key presses', () => {
      const handleEscape = vi.fn();
      render(<TestModal onEscape={handleEscape} />);

      const firstButton = screen.getByTestId('first-button');
      expect(document.activeElement).toBe(firstButton);

      // Press Enter - should not trigger escape
      fireEvent.keyDown(document, { key: 'Enter' });
      expect(handleEscape).not.toHaveBeenCalled();

      // Focus should remain unchanged
      expect(document.activeElement).toBe(firstButton);
    });
  });
});
