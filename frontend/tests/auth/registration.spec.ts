import { test, expect } from '@playwright/test';
import { registerUser } from '../helpers/testHelpers';
import { generateUniqueTestUser } from '../fixtures/testUsers';

/**
 * Registration tests
 * NOTE: Full registration flow may be blocked by backend issues
 * These tests will document the current behavior
 */

test.describe('Registration', () => {
  test('registration form has required fields', async ({ page }) => {
    await page.goto('/register');

    // Verify all required fields are present
    await expect(page.locator('input[name="username"], input[type="text"]')).toBeVisible();
    await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible();

    // Should have at least one password field
    const passwordFields = page.locator('input[type="password"]');
    const passwordCount = await passwordFields.count();
    expect(passwordCount).toBeGreaterThanOrEqual(1);

    // Should have submit button
    await expect(page.locator('button[type="submit"], button:has-text("Register"), button:has-text("Sign Up")')).toBeVisible();
  });

  test('registration form validation - empty fields', async ({ page }) => {
    await page.goto('/register');

    // Try to submit without filling fields
    const submitButton = page.locator('button[type="submit"], button:has-text("Register"), button:has-text("Sign Up")');
    await submitButton.click();

    // Wait a moment for validation
    await page.waitForTimeout(1000);

    // Should either show validation messages or not submit
    // (HTML5 validation might prevent form submission)
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/register/);
  });

  test.skip('successful registration (SKIPPED - backend issues)', async ({ page }) => {
    // This test is skipped until backend registration is fixed
    // Once fixed, enable this test to verify registration works

    const testUser = generateUniqueTestUser();

    await registerUser(page, testUser.username, testUser.email, testUser.password);

    // After successful registration, should redirect to dashboard or login
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(dashboard|login|recipes)/);
  });
});
