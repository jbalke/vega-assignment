import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordToggleButton: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly languageSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByRole('textbox', { name: /password/i });
    this.passwordToggleButton = page.getByRole('button', { name: /show password|hide password/i });
    this.submitButton = page.getByRole('button', {
      name: /access portfolio|accéder au portefeuille|portfolio öffnen/i,
    });
    this.errorMessage = page.getByText(
      /invalid email or password|e-mail ou mot de passe invalide|ungültige e-mail oder ungültiges passwort/i
    );
    this.languageSelect = page.getByTestId('language-select');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async togglePasswordVisibility() {
    await this.passwordToggleButton.click();
  }

  async submit() {
    await this.submitButton.click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await Promise.all([this.page.waitForURL(/\/dashboard/), this.submit()]);
  }

  async loginWithDefaultCredentials() {
    await this.login('investor@vega.app', 'portfolio');
  }

  async isPasswordVisible(): Promise<boolean> {
    const type = await this.passwordInput.getAttribute('type');
    return type === 'text';
  }

  async isPasswordHidden(): Promise<boolean> {
    const type = await this.passwordInput.getAttribute('type');
    return type === 'password';
  }

  async selectLanguage(language: 'en-GB' | 'fr-FR' | 'de-DE') {
    await this.languageSelect.selectOption(language);
  }

  async getSelectedLanguage(): Promise<string> {
    return this.languageSelect.inputValue();
  }
}
