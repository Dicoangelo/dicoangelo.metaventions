# E2E Testing Suite

This directory contains end-to-end (E2E) tests using Playwright to ensure critical user journeys work correctly across the portfolio.

## 📋 Test Coverage

### Test Suites (5)

| Suite | Tests | Coverage |
|-------|-------|----------|
| **navigation.spec.ts** | 5 | Page load, section navigation, scroll behavior |
| **theme-toggle.spec.ts** | 4 | Light/dark theme switching and persistence |
| **keyboard-shortcuts.spec.ts** | 8 | Keyboard navigation and shortcuts |
| **accessibility.spec.ts** | 10 | WCAG 2.1 AA compliance with axe-core |
| **responsive.spec.ts** | 12+ | Mobile, tablet, desktop viewports |
| **Total** | **31+** | **Comprehensive user journey coverage** |

## 🚀 Running Tests

### Quick Start

```bash
# Run all E2E tests
npm run test:e2e

# Run with interactive UI
npm run test:e2e:ui

# Run in headed mode (watch execution)
npm run test:e2e:headed

# Run in debug mode
npm run test:e2e:debug
```

### Run Specific Test File

```bash
# Run navigation tests only
npx playwright test navigation.spec.ts

# Run accessibility tests only
npx playwright test accessibility.spec.ts

# Run tests matching a pattern
npx playwright test -g "theme"
```

### View Reports

```bash
# View HTML report (after tests run)
npx playwright show-report
```

## 📁 Test Files

### navigation.spec.ts

Tests core navigation functionality:
- ✅ Homepage loads successfully
- ✅ Navigate to sections via nav links
- ✅ Navigate via keyboard shortcuts
- ✅ Back to top button appears after scrolling
- ✅ Scroll progress indicator updates

**User Journey**: Page load → Section navigation → Scroll interactions

### theme-toggle.spec.ts

Tests theme switching and persistence:
- ✅ Toggle between light and dark themes
- ✅ Persist theme preference on reload
- ✅ Update theme via keyboard shortcut ('t')
- ✅ Apply correct CSS classes for each theme

**User Journey**: Theme toggle → Persistence → Keyboard control

### keyboard-shortcuts.spec.ts

Tests keyboard navigation:
- ✅ Open shortcuts help with '?'
- ✅ Close shortcuts help with Escape
- ✅ Navigate to sections (1, 2, 3)
- ✅ Scroll to top (g+t)
- ✅ Scroll to bottom (g+b)
- ✅ Toggle theme ('t')
- ✅ Show shortcuts in help modal
- ✅ Don't trigger shortcuts in input fields

**User Journey**: Keyboard-first navigation → Power user workflows

### accessibility.spec.ts

Tests WCAG 2.1 AA compliance:
- ✅ No auto-detectable a11y issues (axe-core)
- ✅ Proper heading hierarchy (h1-h6)
- ✅ Alt text for all images
- ✅ ARIA labels for interactive elements
- ✅ Sufficient color contrast (≥4.5:1)
- ✅ Skip navigation link
- ✅ Proper form labels
- ✅ Keyboard navigable
- ✅ Lang attribute on HTML
- ✅ Proper document title

**Standards**: WCAG 2.0 A/AA, WCAG 2.1 A/AA

### responsive.spec.ts

Tests responsive design across viewports:
- ✅ Mobile rendering (375x667)
- ✅ Tablet rendering (768x1024)
- ✅ Desktop rendering (1920x1080)
- ✅ Touch-friendly tap targets (≥40x40px)
- ✅ Element visibility based on viewport
- ✅ Readability on all screen sizes

**Viewports**: iPhone, iPad, Full HD Desktop

## 🛠️ Configuration

### playwright.config.ts

Located in the project root, configures:
- **Test Directory**: `./tests/e2e`
- **Base URL**: `http://localhost:3000`
- **Browser**: Chromium (Desktop Chrome)
- **Web Server**: Auto-starts dev server before tests
- **Retries**: 2 on CI, 0 locally
- **Reporter**: HTML report
- **Screenshots**: On failure
- **Trace**: On first retry

## 📊 Test Patterns

### Page Object Model

Tests use direct selectors for simplicity:

```typescript
// Good: Semantic selectors
await page.getByRole('button', { name: /theme/i });
await page.getByRole('link', { name: /projects/i });

// Better: User-facing text
await expect(page.locator('text=Full-Stack Engineer')).toBeVisible();
```

### Waiting Strategies

Tests use explicit waits for reliability:

```typescript
// Wait for navigation
await page.waitForTimeout(500);

// Wait for visibility
await expect(element).toBeVisible();

// Wait for viewport
await expect(section).toBeInViewport();
```

### Assertions

Clear, meaningful assertions:

```typescript
// Verify state
expect(scrollY).toBeLessThan(100);

// Verify visibility
await expect(modal).toBeVisible();

// Verify content
await expect(page).toContainText(/keyboard shortcuts/i);
```

## 🎯 Writing New Tests

### Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something specific', async ({ page }) => {
    // Arrange
    const button = page.getByRole('button', { name: /click me/i });

    // Act
    await button.click();

    // Assert
    await expect(page.locator('.result')).toBeVisible();
  });
});
```

### Best Practices

1. **Use Semantic Selectors**
   ```typescript
   // ✅ Good
   page.getByRole('button', { name: /submit/i })

   // ❌ Avoid
   page.locator('#submit-btn')
   ```

2. **Test User Journeys, Not Implementation**
   ```typescript
   // ✅ Good
   test('user can submit contact form', ...)

   // ❌ Avoid
   test('form validation state updates', ...)
   ```

3. **Use Descriptive Test Names**
   ```typescript
   // ✅ Good
   test('should persist theme preference on page reload', ...)

   // ❌ Avoid
   test('theme test', ...)
   ```

4. **Group Related Tests**
   ```typescript
   test.describe('Theme Toggle', () => {
     test('should toggle themes', ...)
     test('should persist preference', ...)
   });
   ```

## 🔍 Debugging Tests

### Visual Debugging

```bash
# Run with headed browser
npm run test:e2e:headed

# Run in debug mode (step through)
npm run test:e2e:debug

# Run with UI mode (interactive)
npm run test:e2e:ui
```

### Trace Viewer

```bash
# Traces are captured on first retry
# View trace for failed test
npx playwright show-trace trace.zip
```

### Screenshots

Screenshots are automatically captured on failure and saved to `test-results/`.

## 📈 CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 🎨 Accessibility Testing

### axe-core Integration

The `accessibility.spec.ts` suite uses axe-core for automated a11y testing:

```typescript
import AxeBuilder from '@axe-core/playwright';

const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  .analyze();

expect(results.violations).toEqual([]);
```

### Manual Testing Checklist

Beyond automated tests, manually verify:
- [ ] Screen reader navigation (VoiceOver, NVDA, JAWS)
- [ ] Keyboard-only navigation
- [ ] High contrast mode
- [ ] Text zoom to 200%
- [ ] Voice control (Dragon)

## 🚦 Performance

### Test Execution Time

- **All tests**: ~3-5 minutes
- **Single suite**: ~30-60 seconds
- **Parallel**: Enabled (multiple workers)

### Optimization Tips

1. **Reuse Browser Context**
   - Tests in same file share browser context
   - Faster than creating new context per test

2. **Use Fixtures**
   - Set up common state in `beforeEach`
   - Avoid repetitive code

3. **Run Targeted Tests**
   - Run specific files during development
   - Run all tests in CI

## 📝 Test Maintenance

### Updating Tests

When UI changes:
1. Run tests to identify failures
2. Update selectors if structure changed
3. Update assertions if behavior changed
4. Re-run to verify fixes

### Flaky Tests

If tests are flaky:
1. Add explicit waits (`waitForSelector`, `waitForLoadState`)
2. Increase timeout for slow operations
3. Use `toBeVisible()` instead of checking existence
4. Avoid hard-coded timeouts when possible

### Selectors

Prefer stable selectors:
1. **Best**: `getByRole`, `getByLabel`, `getByText`
2. **Good**: `data-testid` attributes
3. **Avoid**: Class names, IDs (change frequently)

## 🔗 Related Documentation

- **[Playwright Docs](https://playwright.dev/)** - Official documentation
- **[PHASE_4.2_E2E_TESTING.md](../PHASE_4.2_E2E_TESTING.md)** - Implementation details
- **[DEPLOYMENT_CHECKLIST.md](../DEPLOYMENT_CHECKLIST.md)** - Deployment guide
- **[README.md](../README.md)** - Main project README

## 🎓 Learning Resources

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Web Accessibility Testing](https://www.w3.org/WAI/test-evaluate/)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Maintained by**: Dico Angelo
**Last Updated**: 2026-01-31
**Test Count**: 31+ tests across 5 suites
**Status**: ✅ Production Ready
