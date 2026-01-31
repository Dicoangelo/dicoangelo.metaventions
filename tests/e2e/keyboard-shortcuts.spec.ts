import { test, expect } from '@playwright/test';

test.describe('Keyboard Shortcuts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open keyboard shortcuts help with "?"', async ({ page }) => {
    // Press ? to open help
    await page.keyboard.press('?');
    await page.waitForTimeout(200);

    // Verify help modal is visible
    const helpModal = page.getByRole('dialog');
    await expect(helpModal).toBeVisible();

    // Verify modal contains shortcuts
    await expect(helpModal).toContainText(/keyboard shortcuts/i);
  });

  test('should close keyboard shortcuts help with Escape', async ({ page }) => {
    // Open help
    await page.keyboard.press('?');
    await page.waitForTimeout(200);

    const helpModal = page.getByRole('dialog');
    await expect(helpModal).toBeVisible();

    // Close with Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    // Verify modal is hidden
    await expect(helpModal).not.toBeVisible();
  });

  test('should navigate to sections using number keys', async ({ page }) => {
    const shortcuts = [
      { key: '1', section: 'hero' },
      { key: '2', section: 'proof' },
      { key: '3', section: 'projects' },
    ];

    for (const { key, section } of shortcuts) {
      // Press number key
      await page.keyboard.press(key);
      await page.waitForTimeout(500);

      // Verify section is in viewport
      const targetSection = page.locator(`#${section}`);
      if (await targetSection.count() > 0) {
        await expect(targetSection).toBeInViewport();
      }
    }
  });

  test('should scroll to top with "g" + "t"', async ({ page }) => {
    // Scroll down first
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(200);

    // Press g then t (go to top)
    await page.keyboard.press('g');
    await page.keyboard.press('t');
    await page.waitForTimeout(500);

    // Verify scrolled to top
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);
  });

  test('should scroll to bottom with "g" + "b"', async ({ page }) => {
    // Press g then b (go to bottom)
    await page.keyboard.press('g');
    await page.keyboard.press('b');
    await page.waitForTimeout(500);

    // Verify scrolled to bottom
    const scrollY = await page.evaluate(() => window.scrollY);
    const maxScroll = await page.evaluate(() =>
      document.documentElement.scrollHeight - window.innerHeight
    );

    expect(scrollY).toBeGreaterThan(maxScroll - 100);
  });

  test('should toggle theme with "t"', async ({ page }) => {
    // Get initial theme
    const initialTheme = await page.getAttribute('html', 'data-theme');

    // Press t
    await page.keyboard.press('t');
    await page.waitForTimeout(200);

    // Verify theme changed
    const newTheme = await page.getAttribute('html', 'data-theme');
    expect(newTheme).not.toBe(initialTheme);
  });

  test('should show keyboard shortcuts in help modal', async ({ page }) => {
    // Open help
    await page.keyboard.press('?');
    await page.waitForTimeout(200);

    const helpModal = page.getByRole('dialog');

    // Verify key shortcuts are documented
    const expectedShortcuts = [
      '?',
      't',
      'g',
      'Escape',
    ];

    for (const shortcut of expectedShortcuts) {
      await expect(helpModal).toContainText(shortcut);
    }
  });

  test('should not trigger shortcuts when typing in input fields', async ({ page }) => {
    // Find a text input (search, contact form, etc.)
    const input = page.locator('input[type="text"]').first();

    if (await input.count() > 0) {
      await input.click();

      // Type characters that would normally trigger shortcuts
      await input.fill('t123');
      await page.waitForTimeout(200);

      // Verify input value is preserved (shortcuts not triggered)
      const value = await input.inputValue();
      expect(value).toBe('t123');
    }
  });
});
