import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import KeyboardShortcutsHelp from '../KeyboardShortcutsHelp';

describe('KeyboardShortcutsHelp', () => {
  beforeEach(() => {
    // Reset DOM between tests
    document.body.innerHTML = '';
  });

  it('should not render initially', () => {
    render(<KeyboardShortcutsHelp isLight={false} />);
    expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument();
  });

  it('should open when ? key is pressed', async () => {
    render(<KeyboardShortcutsHelp isLight={false} />);

    // Press '?' key
    fireEvent.keyDown(window, { key: '?' });

    // Modal should be visible
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
  });

  it('should close when Escape key is pressed', async () => {
    render(<KeyboardShortcutsHelp isLight={false} />);

    // Open modal
    fireEvent.keyDown(window, { key: '?' });
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();

    // Press Escape (focus trap listens on document)
    fireEvent.keyDown(document, { key: 'Escape' });

    // Modal should be closed
    expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument();
  });

  it('should close when close button is clicked', () => {
    render(<KeyboardShortcutsHelp isLight={false} />);

    // Open modal
    fireEvent.keyDown(window, { key: '?' });

    // Click close button
    const closeButton = screen.getByLabelText('Close keyboard shortcuts dialog');
    fireEvent.click(closeButton);

    // Modal should be closed
    expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument();
  });

  it('should close when backdrop is clicked', () => {
    render(<KeyboardShortcutsHelp isLight={false} />);

    // Open modal
    fireEvent.keyDown(window, { key: '?' });

    // Click backdrop
    const backdrop = document.querySelector('.fixed.inset-0');
    fireEvent.click(backdrop!);

    // Modal should be closed
    expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument();
  });

  it('should display all shortcuts', () => {
    render(<KeyboardShortcutsHelp isLight={false} />);

    // Open modal
    fireEvent.keyDown(window, { key: '?' });

    // Check all shortcuts are displayed
    expect(screen.getByText('Show keyboard shortcuts')).toBeInTheDocument();
    expect(screen.getByText('Go to top')).toBeInTheDocument();
    expect(screen.getByText('Jump to Ask Me Anything')).toBeInTheDocument();
    expect(screen.getByText('Jump to Proof Section')).toBeInTheDocument();
    expect(screen.getByText('Jump to Projects')).toBeInTheDocument();
    expect(screen.getByText('Jump to Timeline')).toBeInTheDocument();
    expect(screen.getByText('Close dialog')).toBeInTheDocument();
  });

  it('should apply light theme styles when isLight is true', () => {
    render(<KeyboardShortcutsHelp isLight={true} />);

    // Open modal
    fireEvent.keyDown(window, { key: '?' });

    // Find modal by its parent div with fixed positioning
    const modal = document.querySelector('.fixed.top-1\\/2');
    expect(modal).toHaveClass('bg-white');
    expect(modal).toHaveClass('border-gray-200');
  });

  it('should apply dark theme styles when isLight is false', () => {
    render(<KeyboardShortcutsHelp isLight={false} />);

    // Open modal
    fireEvent.keyDown(window, { key: '?' });

    // Find modal by its parent div with fixed positioning
    const modal = document.querySelector('.fixed.top-1\\/2');
    expect(modal).toHaveClass('bg-[#1f1f1f]');
    expect(modal).toHaveClass('border-[#262626]');
  });

  it('should have proper accessibility attributes', () => {
    render(<KeyboardShortcutsHelp isLight={false} />);

    // Open modal
    fireEvent.keyDown(window, { key: '?' });

    // Check close button has aria-label
    const closeButton = screen.getByLabelText('Close keyboard shortcuts dialog');
    expect(closeButton).toBeInTheDocument();
    expect(closeButton.tagName).toBe('BUTTON');

    // Check kbd elements are present
    const kbdElements = screen.getAllByText('?');
    expect(kbdElements.length).toBeGreaterThan(0);
  });

  it('should not open when ? is pressed while already open', () => {
    const preventDefault = vi.fn();
    render(<KeyboardShortcutsHelp isLight={false} />);

    // Open modal
    fireEvent.keyDown(window, { key: '?' });
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();

    // Try to open again
    fireEvent.keyDown(window, {
      key: '?',
      preventDefault
    });

    // Should still only have one modal
    const modals = screen.getAllByText('Keyboard Shortcuts');
    expect(modals).toHaveLength(1);
  });
});
