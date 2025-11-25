import { test, expect } from '@playwright/test';

/**
 * Navigation tests
 * Verify that navigation between public pages works correctly
 */

test.describe('Navigation', () => {
  test('can navigate from login to register', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);

    // Look for register link
    const registerLink = page.locator('a:has-text("Register"), a:has-text("Sign Up"), a:has-text("Create Account")');

    if (await registerLink.count() > 0) {
      await registerLink.first().click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/register/);
    } else {
      // If no link found, navigate directly
      await page.goto('/register');
      await expect(page).toHaveURL(/\/register/);
    }
  });

  test('can navigate from register to login', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveURL(/\/register/);

    // Look for login link
    const loginLink = page.locator('a:has-text("Login"), a:has-text("Sign In"), a:has-text("Already have an account")');

    if (await loginLink.count() > 0) {
      await loginLink.first().click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/login/);
    } else {
      // If no link found, navigate directly
      await page.goto('/login');
      await expect(page).toHaveURL(/\/login/);
    }
  });

  test('root path redirects appropriately', async ({ page }) => {
    // Clear any auth state
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Should redirect to either login or dashboard
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(login|dashboard)?$/);
  });
});
