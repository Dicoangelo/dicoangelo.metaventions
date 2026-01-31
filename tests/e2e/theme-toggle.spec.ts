import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should toggle between light and dark themes', async ({ page }) => {
    // Get the theme toggle button
    const themeToggle = page.getByRole('button', { name: /theme/i });
    await expect(themeToggle).toBeVisible();

    // Get initial theme
    const initialTheme = await page.getAttribute('html', 'data-theme');
    expect(initialTheme).toBeTruthy();

    // Click toggle
    await themeToggle.click();
    await page.waitForTimeout(200);

    // Verify theme changed
    const newTheme = await page.getAttribute('html', 'data-theme');
    expect(newTheme).not.toBe(initialTheme);

    // Toggle back
    await themeToggle.click();
    await page.waitForTimeout(200);

    // Verify theme returned to original
    const finalTheme = await page.getAttribute('html', 'data-theme');
    expect(finalTheme).toBe(initialTheme);
  });

  test('should persist theme preference on page reload', async ({ page }) => {
    // Get theme toggle
    const themeToggle = page.getByRole('button', { name: /theme/i });

    // Toggle to light theme
    await themeToggle.click();
    await page.waitForTimeout(200);
    const selectedTheme = await page.getAttribute('html', 'data-theme');

    // Reload page
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    // Verify theme persisted
    const persistedTheme = await page.getAttribute('html', 'data-theme');
    expect(persistedTheme).toBe(selectedTheme);
  });

  test('should update theme via keyboard shortcut', async ({ page }) => {
    // Get initial theme
    const initialTheme = await page.getAttribute('html', 'data-theme');

    // Press 't' for theme toggle (if supported)
    await page.keyboard.press('t');
    await page.waitForTimeout(200);

    // Verify theme changed
    const newTheme = await page.getAttribute('html', 'data-theme');
    expect(newTheme).not.toBe(initialTheme);
  });

  test('should apply correct CSS classes for light/dark themes', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /theme/i });

    // Toggle to light theme
    await themeToggle.click();
    await page.waitForTimeout(200);

    const lightTheme = await page.getAttribute('html', 'data-theme');
    if (lightTheme === 'light') {
      // Verify light theme classes are applied
      const bgColor = await page.evaluate(() => {
        return window.getComputedStyle(document.body).backgroundColor;
      });
      // Light theme should have lighter background
      expect(bgColor).toContain('255'); // Contains white RGB values
    }

    // Toggle to dark theme
    await themeToggle.click();
    await page.waitForTimeout(200);

    const darkTheme = await page.getAttribute('html', 'data-theme');
    if (darkTheme === 'dark') {
      // Verify dark theme classes are applied
      const bgColor = await page.evaluate(() => {
        return window.getComputedStyle(document.body).backgroundColor;
      });
      // Dark theme should have darker background
      expect(bgColor).toContain('0, 0, 0'); // Contains black RGB values
    }
  });
});
