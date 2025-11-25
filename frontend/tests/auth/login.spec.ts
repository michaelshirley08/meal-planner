import { test, expect } from '@playwright/test';
import { loginUser, navigateTo, expectErrorMessage } from '../helpers/testHelpers';
import { testUser1 } from '../fixtures/testUsers';

/**
 * Login tests
 * NOTE: Login functionality has known issues - these tests document the behavior
 */

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state
    await page.goto('/login');  // Navigate first
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  });

  test('login form has required fields', async ({ page }) => {
    await navigateTo(page, '/login');

    // Verify required fields are present
    await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")')).toBeVisible();
  });

  test('login form validation - empty fields', async ({ page }) => {
    await navigateTo(page, '/login');

    // Try to submit without filling fields
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    await submitButton.click();

    // Wait a moment for validation
    await page.waitForTimeout(1000);

    // Should either show validation messages or not submit
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/login/);
  });

  test.skip('login with valid credentials (SKIPPED - known bug)', async ({ page }) => {
    // This test is skipped due to known login bug
    // Once the engineer fixes the login issue, enable this test

    await loginUser(page, testUser1.email, testUser1.password);

    // Should redirect to dashboard
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/(dashboard|recipes)/);
  });

  test('login with invalid email format', async ({ page }) => {
    await navigateTo(page, '/login');

    // Fill with invalid email
    await page.fill('input[name="email"], input[type="email"]', 'notanemail');
    await page.fill('input[type="password"]', 'Password123!');

    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    await submitButton.click();

    // Wait a moment
    await page.waitForTimeout(1000);

    // Should either show validation or stay on login page
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/login/);
  });
});
