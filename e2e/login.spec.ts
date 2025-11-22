import { expect, test } from '@playwright/test';

import { LoginPage } from './pages/LoginPage';

test.describe('Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });
  test('should display login form', async () => {
    await expect(loginPage.heading).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('should show password toggle button', async ({ page }) => {
    await expect(loginPage.passwordToggleButton).toBeVisible();
    expect(await loginPage.isPasswordHidden()).toBe(true);

    await loginPage.togglePasswordVisibility();
    expect(await loginPage.isPasswordVisible()).toBe(true);
    await expect(page.getByRole('button', { name: /hide password/i })).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await loginPage.login('investor@vega.app', 'portfolio');

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(/welcome back/i)).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await loginPage.fillEmail('wrong@example.com');
    await loginPage.fillPassword('wrongpassword');
    await loginPage.submit();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect authenticated users from login page', async ({ page }) => {
    await loginPage.login('investor@vega.app', 'portfolio');

    await page.goto('/login');
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
