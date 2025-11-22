import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'

test.describe('Accessibility Tests', () => {
  test('login page should have no accessibility violations', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('dashboard page should have no accessibility violations', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const dashboardPage = new DashboardPage(page)

    await loginPage.goto()
    await loginPage.loginWithDefaultCredentials()
    await dashboardPage.waitForLoad()

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('login form should have proper labels', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    await expect(loginPage.emailInput).toBeVisible()
    await expect(loginPage.passwordInput).toBeVisible()
    await expect(loginPage.emailInput).toHaveAttribute('type', 'email')
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password')
  })

  test('password toggle should have accessible label', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    await expect(loginPage.passwordToggleButton).toHaveAttribute('aria-label', /show password|hide password/i)
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    await expect(loginPage.heading).toBeVisible()
    const tagName = await loginPage.heading.evaluate(el => el.tagName)
    expect(tagName).toBe('H1')
  })

  test('error messages should be accessible', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    await loginPage.fillEmail('wrong@example.com')
    await loginPage.fillPassword('wrong')
    await loginPage.submit()

    await expect(loginPage.errorMessage).toBeVisible()
    const className = await loginPage.errorMessage.getAttribute('class')
    expect(className).toContain('text-danger')
  })

  test('interactive elements should be keyboard accessible', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    await page.keyboard.press('Tab')
    await expect(loginPage.emailInput).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(loginPage.passwordInput).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(loginPage.passwordToggleButton).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(loginPage.submitButton).toBeFocused()
  })

  test('charts should have accessible alternatives', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const dashboardPage = new DashboardPage(page)

    await loginPage.goto()
    await loginPage.loginWithDefaultCredentials()
    await dashboardPage.waitForLoad()

    await expect(dashboardPage.portfolioValue).toBeVisible()
    await expect(dashboardPage.positionsTable).toBeVisible()
    const assetHeader = dashboardPage.getTableColumnHeader(/^Asset$/i)
    await expect(assetHeader).toBeVisible()
  })
})

