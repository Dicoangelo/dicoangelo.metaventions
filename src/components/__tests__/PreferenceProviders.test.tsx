import { useEffect } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeProvider';
import { ReadingDepthProvider, useReadingDepth } from '../ReadingDepthProvider';

function Preferences() {
  const { theme, toggleTheme } = useTheme();
  const { depth, setDepth } = useReadingDepth();
  return <>
    <button onClick={() => toggleTheme()}>Theme: {theme}</button>
    <button onClick={() => setDepth('deep')}>Depth: {depth}</button>
  </>;
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  localStorage.clear();
});

describe('Preference providers', () => {
  it('keeps the page mounted while loading saved preferences', () => {
    const mounted = vi.fn();
    function Page() {
      useEffect(() => { mounted(); }, []);
      return <input aria-label="Draft" defaultValue="Keep this draft" />;
    }
    render(<ThemeProvider><Page /></ThemeProvider>);
    expect(mounted).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('Draft')).toHaveValue('Keep this draft');
  });

  it('keeps controls working when browser storage is blocked', () => {
    vi.useFakeTimers();
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new DOMException('Blocked', 'SecurityError'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Blocked', 'SecurityError'); });
    render(<ThemeProvider><ReadingDepthProvider><Preferences /></ReadingDepthProvider></ThemeProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Theme: dark' }));
    act(() => { vi.advanceTimersByTime(650); });
    expect(screen.getByRole('button', { name: 'Theme: light' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Depth: standard' }));
    expect(screen.getByRole('button', { name: 'Depth: deep' })).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute('data-reading-depth', 'deep');
  });

  it('ignores malformed stored preferences', () => {
    localStorage.setItem('theme', 'invalid');
    localStorage.setItem('reading-depth', 'invalid');
    render(<ThemeProvider><ReadingDepthProvider><Preferences /></ReadingDepthProvider></ThemeProvider>);
    expect(screen.getByRole('button', { name: 'Theme: dark' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Depth: standard' })).toBeInTheDocument();
  });
});
