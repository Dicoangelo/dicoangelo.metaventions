import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('should not have any automatically detectable accessibility issues on homepage', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Get all headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();

    // Should have at least one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // h1 should be unique (or at most 2 for logo + hero)
    expect(h1Count).toBeLessThanOrEqual(2);
  });

  test('should have alt text for all images', async ({ page }) => {
    await page.goto('/');

    // Get all images
    const images = await page.locator('img').all();

    for (const img of images) {
      const alt = await img.getAttribute('alt');
      // Alt attribute should exist (even if empty for decorative images)
      expect(alt).not.toBeNull();
    }
  });

  test('should have proper ARIA labels for interactive elements', async ({ page }) => {
    await page.goto('/');

    // Check buttons have accessible names
    const buttons = await page.getByRole('button').all();

    for (const button of buttons) {
      const name = await button.getAttribute('aria-label');
      const textContent = await button.textContent();

      // Button should have either aria-label or text content
      expect(name || textContent).toBeTruthy();
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .disableRules(['color-contrast']) // Will check manually with specific rules
      .analyze();

    // Check for color-contrast violations specifically
    const contrastResults = await new AxeBuilder({ page })
      .include('body')
      .withRules(['color-contrast'])
      .analyze();

    expect(contrastResults.violations).toEqual([]);
  });

  test('should have skip navigation link for keyboard users', async ({ page }) => {
    await page.goto('/');

    // Look for skip to content link
    const skipLink = page.getByRole('link', { name: /skip to (main )?content/i });

    // Should exist
    expect(await skipLink.count()).toBeGreaterThan(0);

    // Should be the first focusable element
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    const focusedText = await focusedElement.textContent();

    expect(focusedText?.toLowerCase()).toContain('skip');
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/');

    // Get all form inputs
    const inputs = await page.locator('input, textarea, select').all();

    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');

      // Check if has associated label
      let hasLabel = false;

      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count();
        hasLabel = label > 0;
      }

      // Input should have label, aria-label, or aria-labelledby
      expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');

    // Tab through focusable elements
    let tabCount = 0;
    const maxTabs = 20;

    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab');
      tabCount++;

      // Get focused element
      const focusedElement = page.locator(':focus');
      const tagName = await focusedElement.evaluate((el) => el.tagName);

      // Should be a focusable element
      expect(['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT']).toContain(tagName);
    }
  });

  test('should have lang attribute on html element', async ({ page }) => {
    await page.goto('/');

    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('en');
  });

  test('should have proper document title', async ({ page }) => {
    await page.goto('/');

    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });
});
