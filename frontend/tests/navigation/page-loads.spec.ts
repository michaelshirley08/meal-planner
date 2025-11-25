import { test, expect } from '@playwright/test';

/**
 * Basic page load tests
 * These tests verify that pages load correctly without authentication
 */

test.describe('Public Pages', () => {
  test('registration page loads', async ({ page }) => {
    await page.goto('/register');

    // Verify page loaded
    await expect(page).toHaveURL(/\/register/);

    // Check for registration form elements
    await expect(page.locator('input[name="username"], input[type="text"]')).toBeVisible();
    await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"], input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"], button:has-text("Register"), button:has-text("Sign Up")')).toBeVisible();
  });

  test('login page loads', async ({ page }) => {
    await page.goto('/login');

    // Verify page loaded
    await expect(page).toHaveURL(/\/login/);

    // Check for login form elements
    await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"], input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")')).toBeVisible();
  });
});

test.describe('Recipe Pages', () => {
  test('recipe list page loads (may redirect to login)', async ({ page }) => {
    await page.goto('/recipes');

    // This is a protected route, so it may redirect to login
    // We'll just verify the page loaded without errors
    await page.waitForLoadState('networkidle');

    // Should either show recipes or redirect to login
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(recipes|login)/);
  });
});
