import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';

const tags = ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'];

test.describe('Accessibility Tests', () => {
  test('login page should have no accessibility violations', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.waitForLoad();

    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(tags).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('login page validation errors should remain accessible', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.waitForLoad();

    await loginPage.emailInput.fill('not-an-email');
    await loginPage.passwordInput.fill('');
    await loginPage.submitButton.click();

    await expect(loginPage.emailError).toBeVisible();
    await expect(loginPage.passwordError).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(tags).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('dashboard page should have no accessibility violations', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.loginWithDefaultCredentials();
    await dashboardPage.waitForLoad();

    const accessibilityScanResults = await new AxeBuilder({ page }).withTags(tags).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
