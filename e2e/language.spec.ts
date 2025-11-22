import { expect, test } from '@playwright/test';

import { LANGUAGE_STORAGE_KEY } from '../src/i18n/i18n';

import { LoginPage } from './pages/LoginPage';

test.describe('Localization', () => {
  test.beforeEach(async ({ page }) => {
    // Clear language preference before each test
    await page.goto('/login');
    await page.evaluate(key => window.localStorage.removeItem(key), LANGUAGE_STORAGE_KEY);
  });

  test('defaults to English when no language preference exists', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Verify English text is displayed
    await expect(loginPage.heading).toHaveText('Investor login');
    await expect(loginPage.submitButton).toHaveText('Access portfolio');
  });

  test('persists selected language across refreshes', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Select French language
    await loginPage.selectLanguage('fr-FR');

    // Verify French text is displayed
    await expect(loginPage.heading).toHaveText('Connexion investisseur');
    await expect(loginPage.submitButton).toHaveText('Accéder au portefeuille');
    const selectedLanguage = await loginPage.getSelectedLanguage();
    expect(selectedLanguage).toBe('fr-FR');

    // Reload the page
    await page.reload();

    // Create new page object after reload and verify French text persists
    const reloadedLoginPage = new LoginPage(page);
    await expect(reloadedLoginPage.heading).toHaveText('Connexion investisseur');
    await expect(reloadedLoginPage.submitButton).toHaveText('Accéder au portefeuille');
    const reloadedLanguage = await reloadedLoginPage.getSelectedLanguage();
    expect(reloadedLanguage).toBe('fr-FR');
  });
});
