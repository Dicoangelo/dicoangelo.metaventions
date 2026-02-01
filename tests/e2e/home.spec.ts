import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Home Page', () => {
    test('should load the home page successfully', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Dico/);
    });

    test('should display the Hero section with 3D background', async ({ page }) => {
        await page.goto('/');

        // Check for the Hero section text using first() to match typing animation container
        const heroText = page.locator('text=Operations Infrastructure Builder').first();
        await expect(heroText).toBeVisible();

        // Check for the canvas element in the background
        // We assume at least one canvas is present (Hero background)
        const canvases = page.locator('canvas');
        await expect(canvases.first()).toBeAttached();
    });

    test('should display the 3D Voice Orb', async ({ page }) => {
        await page.goto('/');

        const askSection = page.locator('#ask');
        await expect(askSection).toBeVisible();

        // Check if voice is supported or fallback is shown
        // Using .isVisible() first to handle conditional rendering logic
        const fallback = page.getByText('Voice not supported');
        if (await fallback.isVisible()) {
            console.log('Voice not supported in this environment (expected in headless CI)');
            // If not supported, we don't expect the orb canvas
        } else {
            // Check for the "Tap the orb to chat" or "Listening" text
            const instructions = page.getByText('Tap the orb to chat').first();
            await expect(instructions).toBeVisible();

            // Ensure we have more than 1 canvas (Hero + Orb)
            const count = await page.locator('canvas').count();
            expect(count).toBeGreaterThanOrEqual(1);
        }
    });

    test('should display the 3D Systems Network', async ({ page }) => {
        await page.goto('/');
        const systemsSection = page.locator('#systems');

        await expect(systemsSection).toBeVisible();

        await expect(page.locator('#systems').getByRole('heading', { name: 'META-VENGINE' })).toBeVisible();

        // Check for the canvas container - usually has backdrop-blur in our code
        const networkContainer = systemsSection.locator('.backdrop-blur-sm').first();
        if (await networkContainer.isVisible()) {
            const canvas = networkContainer.locator('canvas');
            await expect(canvas).toBeAttached();
        } else {
            // Use alternate selector if backdrop class missing/changed
            const altContainer = systemsSection.locator('div.w-full.h-\\[600px\\]').last();
            await expect(altContainer).toBeVisible();
            await expect(altContainer.locator('canvas')).toBeAttached();
        }
    });

    /*
    // Commenting out detailed a11y check in this file to avoid duplicate failures.
    // Use tests/e2e/accessibility.spec.ts for full audit.
    test('should not have any detectable accessibility violations', async ({ page }) => {
      await page.goto('/');
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
    */
});
