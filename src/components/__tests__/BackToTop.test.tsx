import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import BackToTop from '../BackToTop';

describe('BackToTop', () => {
  const scrollToMock = vi.fn();

  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = scrollToMock;
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0,
    });
  });

  afterEach(() => {
    scrollToMock.mockClear();
  });

  it('should not render when page is not scrolled', () => {
    render(<BackToTop isLight={false} />);
    const button = screen.queryByLabelText('Back to top');
    expect(button).not.toBeInTheDocument();
  });

  it('should render when scrolled down 400px', () => {
    render(<BackToTop isLight={false} />);

    // Simulate scrolling down
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 500,
    });
    fireEvent.scroll(window);

    const button = screen.getByLabelText('Back to top');
    expect(button).toBeInTheDocument();
  });

  it('should scroll to top when clicked', () => {
    // Start with page scrolled
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 500,
    });

    render(<BackToTop isLight={false} />);
    fireEvent.scroll(window);

    const button = screen.getByLabelText('Back to top');
    fireEvent.click(button);

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('should apply light theme styles when isLight is true', () => {
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 500,
    });

    render(<BackToTop isLight={true} />);
    fireEvent.scroll(window);

    const button = screen.getByLabelText('Back to top');
    expect(button).toHaveClass('bg-white');
    expect(button).toHaveClass('border-gray-200');
  });

  it('should apply dark theme styles when isLight is false', () => {
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 500,
    });

    render(<BackToTop isLight={false} />);
    fireEvent.scroll(window);

    const button = screen.getByLabelText('Back to top');
    expect(button).toHaveClass('bg-[#1f1f1f]');
    expect(button).toHaveClass('border-[#2a2a2a]');
  });

  it('should have proper accessibility attributes', () => {
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 500,
    });

    render(<BackToTop isLight={false} />);
    fireEvent.scroll(window);

    const button = screen.getByLabelText('Back to top');
    expect(button).toHaveAttribute('aria-label', 'Back to top');
    expect(button.tagName).toBe('BUTTON');
  });
});
