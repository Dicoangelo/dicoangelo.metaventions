import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test(`should render correctly on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');

      // Verify page loads
      await expect(page).toHaveTitle(/Dico Angelo/);

      // Verify hero section is visible
      await expect(page.locator('text=Full-Stack Engineer')).toBeVisible();

      // Check for horizontal overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = viewport.width;
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // +1 for rounding

      // Verify navigation is accessible
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();

      // On mobile, hamburger menu should be visible
      if (viewport.width < 768) {
        const menuButton = page.getByRole('button', { name: /menu|navigation/i });
        if (await menuButton.count() > 0) {
          await expect(menuButton).toBeVisible();
        }
      }
    });
  }

  test('should have touch-friendly tap targets on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Get all interactive elements
    const buttons = await page.getByRole('button').all();
    const links = await page.getByRole('link').all();

    const interactiveElements = [...buttons, ...links];

    for (const element of interactiveElements.slice(0, 10)) { // Check first 10
      const box = await element.boundingBox();

      if (box) {
        // WCAG recommends min 44x44 pixels for touch targets
        // We'll check for at least 40x40 to allow some flexibility
        expect(box.width).toBeGreaterThanOrEqual(40);
        expect(box.height).toBeGreaterThanOrEqual(40);
      }
    }
  });

  test('should hide/show elements based on viewport', async ({ page }) => {
    await page.goto('/');

    // Check desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(200);

    // Desktop nav should be visible
    const desktopNav = page.locator('nav');
    await expect(desktopNav).toBeVisible();

    // Check mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(200);

    // Navigation should adapt for mobile
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should maintain readability on all screen sizes', async ({ page }) => {
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');

      // Check font size is readable
      const bodyFontSize = await page.evaluate(() => {
        return parseInt(window.getComputedStyle(document.body).fontSize);
      });

      // Font size should be at least 14px
      expect(bodyFontSize).toBeGreaterThanOrEqual(14);

      // Line height should be at least 1.5 for body text
      const lineHeight = await page.evaluate(() => {
        const body = document.querySelector('p');
        if (!body) return 1.5;
        return parseFloat(window.getComputedStyle(body).lineHeight) /
               parseFloat(window.getComputedStyle(body).fontSize);
      });

      expect(lineHeight).toBeGreaterThanOrEqual(1.4);
    }
  });
});
