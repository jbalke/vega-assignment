import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';

const tags = ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'];

test.describe('Accessibility Tests', () => {
  test('login page should have no accessibility violations', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

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
