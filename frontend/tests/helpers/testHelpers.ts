import { Page, expect } from '@playwright/test';

/**
 * Helper functions for common test operations
 */

/**
 * Navigate to a specific path
 * @param page - Playwright page object
 * @param path - Relative path (e.g., '/login', '/recipes')
 */
export async function navigateTo(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
}

/**
 * Register a new user
 * @param page - Playwright page object
 * @param username - Username for new account
 * @param email - Email for new account
 * @param password - Password for new account
 * @returns Promise that resolves when registration is complete
 */
export async function registerUser(
  page: Page,
  username: string,
  email: string,
  password: string
): Promise<void> {
  await navigateTo(page, '/register');

  // Fill in registration form
  await page.fill('input[name="username"], input[type="text"][placeholder*="username" i]', username);
  await page.fill('input[name="email"], input[type="email"]', email);
  await page.fill('input[name="password"], input[type="password"]', password);

  // Check if there's a confirm password field
  const confirmPasswordField = page.locator('input[name="confirmPassword"], input[placeholder*="confirm" i]');
  if (await confirmPasswordField.count() > 0) {
    await confirmPasswordField.fill(password);
  }

  // Submit form
  await page.click('button[type="submit"], button:has-text("Register"), button:has-text("Sign Up")');

  // Wait for navigation or response
  await page.waitForLoadState('networkidle');
}

/**
 * Login an existing user
 * @param page - Playwright page object
 * @param email - User email
 * @param password - User password
 * @returns Promise that resolves when login is complete
 */
export async function loginUser(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await navigateTo(page, '/login');

  // Fill in login form
  await page.fill('input[name="email"], input[type="email"]', email);
  await page.fill('input[name="password"], input[type="password"]', password);

  // Submit form
  await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');

  // Wait for navigation or response
  await page.waitForLoadState('networkidle');
}

/**
 * Logout the current user
 * @param page - Playwright page object
 */
export async function logoutUser(page: Page): Promise<void> {
  // Look for logout button (could be in nav, menu, etc.)
  const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout")');

  if (await logoutButton.count() > 0) {
    await logoutButton.first().click();
    await page.waitForLoadState('networkidle');
  } else {
    // If no logout button, clear storage and reload
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  }
}

/**
 * Check if user is logged in by looking for auth indicators
 * @param page - Playwright page object
 * @returns True if user appears to be logged in
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  // Check for common auth indicators
  const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout")');
  const loginButton = page.locator('button:has-text("Login"), a:has-text("Login")');

  const hasLogout = await logoutButton.count() > 0;
  const hasLogin = await loginButton.count() > 0;

  // If logout is visible and login is not, user is logged in
  return hasLogout && !hasLogin;
}

/**
 * Expect an element to contain specific text
 * @param page - Playwright page object
 * @param selector - CSS selector or text selector
 * @param expectedText - Text that should be present
 */
export async function expectElementText(
  page: Page,
  selector: string,
  expectedText: string
): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toContainText(expectedText);
}

/**
 * Expect an error message to be displayed
 * @param page - Playwright page object
 * @param errorMessage - Expected error message (partial match)
 */
export async function expectErrorMessage(
  page: Page,
  errorMessage: string
): Promise<void> {
  // Look for common error message containers
  const errorElement = page.locator(
    '.error, .error-message, [role="alert"], .alert-error, .text-red-500, .text-danger'
  );

  await expect(errorElement.first()).toBeVisible();
  await expect(errorElement.first()).toContainText(errorMessage);
}

/**
 * Expect to be on a specific page by checking URL
 * @param page - Playwright page object
 * @param path - Expected path (e.g., '/dashboard', '/login')
 */
export async function expectCurrentPath(
  page: Page,
  path: string
): Promise<void> {
  await expect(page).toHaveURL(new RegExp(path));
}

/**
 * Wait for a specific amount of time (use sparingly!)
 * @param ms - Milliseconds to wait
 */
export async function wait(ms: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fill a form field by label text
 * @param page - Playwright page object
 * @param labelText - The text of the label
 * @param value - Value to fill
 */
export async function fillFieldByLabel(
  page: Page,
  labelText: string,
  value: string
): Promise<void> {
  const field = page.locator(`label:has-text("${labelText}") + input, label:has-text("${labelText}") input`);
  await field.fill(value);
}

/**
 * Click a button by text
 * @param page - Playwright page object
 * @param buttonText - Text on the button
 */
export async function clickButton(
  page: Page,
  buttonText: string
): Promise<void> {
  await page.click(`button:has-text("${buttonText}"), input[type="submit"][value="${buttonText}"]`);
}
