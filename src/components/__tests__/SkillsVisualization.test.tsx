import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SkillsVisualization from '../SkillsVisualization';
import { ReadingDepthProvider } from '../ReadingDepthProvider';

let desktop = false;
let reducedMotion = false;
let intersectionCallback: IntersectionObserverCallback;

function advanceRotation() {
  act(() => vi.advanceTimersByTime(10000));
}

beforeEach(() => {
  desktop = false;
  reducedMotion = false;
  localStorage.clear();
  vi.useFakeTimers();
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
    matches: query === '(min-width: 768px)' ? desktop : reducedMotion,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: IntersectionObserverCallback) {
      intersectionCallback = callback;
    }
    observe() {
      intersectionCallback([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
    }
    disconnect() {}
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe('SkillsVisualization carousel', () => {
  it('shows one practice area on phones and keeps all six reachable in a loop', () => {
    render(<SkillsVisualization isLight={false} />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'AI & Agentic Systems' })).toBeVisible();
    const next = screen.getByRole('button', { name: 'Next practice areas' });
    for (const name of [
      'Operations & Infrastructure',
      'AI-Assisted Development (Code in English)',
      'Enterprise Tools',
      'Research & Knowledge Systems',
      'Leadership & Community',
      'AI & Agentic Systems',
    ]) {
      fireEvent.click(next);
      expect(screen.getByRole('heading', { name })).toBeVisible();
    }
    fireEvent.click(screen.getByRole('button', { name: 'Previous practice areas' }));
    expect(screen.getByRole('heading', { name: 'Leadership & Community' })).toBeVisible();
  });

  it('shows two panels and three navigation pages on desktop', () => {
    desktop = true;
    render(<SkillsVisualization isLight />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: /^Show / })).toHaveLength(3);
    fireEvent.click(screen.getByRole('button', { name: 'Next practice areas' }));
    expect(screen.getByRole('heading', { name: 'AI-Assisted Development (Code in English)' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Enterprise Tools' })).toBeVisible();
    expect(screen.getAllByRole('progressbar')).toHaveLength(11);
  });

  it('rotates automatically, pauses on hover and focus, and resumes afterward', () => {
    render(<SkillsVisualization isLight={false} />);
    const carousel = screen.getByRole('region', { name: 'Areas of practice' });
    advanceRotation();
    expect(screen.getByRole('heading', { name: 'Operations & Infrastructure' })).toBeVisible();
    fireEvent.mouseEnter(carousel);
    advanceRotation();
    expect(screen.getByRole('heading', { name: 'Operations & Infrastructure' })).toBeVisible();
    fireEvent.mouseLeave(carousel);
    const next = screen.getByRole('button', { name: 'Next practice areas' });
    fireEvent.focus(next);
    advanceRotation();
    expect(screen.getByRole('heading', { name: 'Operations & Infrastructure' })).toBeVisible();
    fireEvent.blur(next, { relatedTarget: null });
    advanceRotation();
    expect(screen.getByRole('heading', { name: 'AI-Assisted Development (Code in English)' })).toBeVisible();
  });

  it('lets visitors pause rotation and leaves manual navigation paused', () => {
    render(<SkillsVisualization isLight={false} />);
    fireEvent.click(screen.getByRole('button', { name: 'Pause practice area rotation' }));
    advanceRotation();
    expect(screen.getByRole('heading', { name: 'AI & Agentic Systems' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Resume practice area rotation' }));
    advanceRotation();
    expect(screen.getByRole('heading', { name: 'Operations & Infrastructure' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Show Leadership & Community' }));
    advanceRotation();
    expect(screen.getByRole('heading', { name: 'Leadership & Community' })).toBeVisible();
  });

  it('does not rotate outside the viewport', () => {
    render(<SkillsVisualization isLight={false} />);
    act(() => intersectionCallback([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    advanceRotation();
    expect(screen.getByRole('heading', { name: 'AI & Agentic Systems' })).toBeVisible();
  });

  it.each(['system', 'saved'])('respects the %s reduced-motion preference while retaining navigation', (preference) => {
    if (preference === 'system') reducedMotion = true;
    else localStorage.setItem('reduced-motion-preference', 'on');
    render(<SkillsVisualization isLight={false} />);
    advanceRotation();
    expect(screen.getByRole('heading', { name: 'AI & Agentic Systems' })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Pause practice area rotation' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next practice areas' }));
    expect(screen.getByRole('heading', { name: 'Operations & Infrastructure' })).toBeVisible();
  });

  it('identifies the accepted research as an LP4FM workshop poster in achievements', () => {
    localStorage.setItem('reading-depth', 'deep');
    render(<ReadingDepthProvider><SkillsVisualization isLight={false} /></ReadingDepthProvider>);
    expect(screen.getByRole('link', { name: /NeurIPS 2026 · LP4FM Workshop · Accepted Poster · Co-author/ }))
      .toHaveAttribute('href', 'https://openreview.net/forum?id=1E20ig92Zi');
  });
});
