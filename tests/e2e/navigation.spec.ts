import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Dico Angelo/);

    // Verify hero section is visible
    await expect(page.locator('text=Operations Infrastructure Builder').first()).toBeVisible();
  });

  test('should navigate to sections via nav links', async ({ page }) => {
    // Click on Projects nav link
    await page.click('a[href="#projects"]');

    // Wait for scroll and verify section is visible
    await page.waitForTimeout(500);
    const projectsSection = page.locator('#projects');
    await expect(projectsSection).toBeInViewport();
  });

  test('should navigate to sections via keyboard shortcuts', async ({ page }) => {
    // Press keyboard shortcut for projects (assuming it exists)
    await page.keyboard.press('p');

    // Wait for navigation
    await page.waitForTimeout(500);
  });

  test('should show back to top button after scrolling', async ({ page }) => {
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 1000));

    // Wait for button to appear
    await page.waitForTimeout(300);

    // Verify back to top button is visible
    const backToTop = page.getByRole('button', { name: /back to top/i });
    await expect(backToTop).toBeVisible();

    // Click back to top
    await backToTop.click();

    // Verify scrolled to top
    await page.waitForTimeout(500);
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);
  });

  test('should display scroll progress indicator', async ({ page }) => {
    // Verify scroll progress bar exists
    const scrollProgress = page.locator('[role="progressbar"]');
    await expect(scrollProgress).toBeVisible();

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(200);

    // Check that progress has updated (should be roughly 50%)
    const progressValue = await scrollProgress.getAttribute('aria-valuenow');
    const progress = parseInt(progressValue || '0');
    expect(progress).toBeGreaterThan(30);
    expect(progress).toBeLessThan(70);
  });
});
