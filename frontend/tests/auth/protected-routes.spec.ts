import { test, expect } from '@playwright/test';

/**
 * Protected route tests
 * Verify that unauthenticated users are redirected to login
 */

test.describe('Protected Routes', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state by navigating first
    await page.goto('/');
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  });

  test('dashboard redirects to login when not authenticated', async ({ page }) => {
    // Page already navigated in beforeEach, just verify the redirect

    // Should redirect to login
    await page.waitForURL(/\/login/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('recipes page redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/recipes');

    // Should redirect to login
    await page.waitForURL(/\/login/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('shopping list redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/shopping-list');

    // Should redirect to login
    await page.waitForURL(/\/login/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('new recipe page redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/recipes/new');

    // Should redirect to login
    await page.waitForURL(/\/login/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/login/);
  });
});
