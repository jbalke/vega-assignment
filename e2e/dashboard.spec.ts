import { expect, test } from '@playwright/test'

import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'

test.describe('Dashboard Page', () => {
  let dashboardPage: DashboardPage
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    dashboardPage = new DashboardPage(page)

    await loginPage.goto()
    await loginPage.loginWithDefaultCredentials()
    await dashboardPage.waitForLoad()
  })

  test('should display portfolio dashboard', async () => {
    await expect(dashboardPage.welcomeMessage).toBeVisible()
    await expect(dashboardPage.portfolioValue).toBeVisible()
    await expect(dashboardPage.performanceSection).toBeVisible()
  })

  test('should display portfolio donut chart', async () => {
    await expect(dashboardPage.portfolioValue).toBeVisible()
    await expect(dashboardPage.donutChart).toBeVisible()
  })

  test('should toggle between asset and class view', async () => {
    await expect(dashboardPage.assetButton).toBeVisible()
    await expect(dashboardPage.classButton).toBeVisible()

    await dashboardPage.switchToClassView()
    await expect(dashboardPage.classButton).toHaveClass(/bg-accent/)

    await dashboardPage.switchToAssetView()
    await expect(dashboardPage.assetButton).toHaveClass(/bg-accent/)
  })

  test('should display positions table', async () => {
    await expect(dashboardPage.positionsTable).toBeVisible()
    const headers = dashboardPage.getTableHeaders()
    await expect(headers.first()).toBeVisible()
    const assetHeader = dashboardPage.getTableColumnHeader(/^Asset$/i)
    await expect(assetHeader).toBeVisible()
  })

  test('should display historical performance chart', async () => {
    await expect(dashboardPage.performanceSection).toBeVisible()
    await expect(dashboardPage.historicalChart).toBeVisible()
  })

  test('should change time range for historical chart', async () => {
    await expect(dashboardPage.performanceSection).toBeVisible()

    const allButtons = dashboardPage.page.locator('button')
    const rangeButtons = allButtons.filter({ hasText: /^(1M|3M|6M|YTD|1Y|MAX)$/ })
    const count = await rangeButtons.count()

    if (count >= 2) {
      for (let i = 0; i < count; i++) {
        const button = rangeButtons.nth(i)
        const className = await button.getAttribute('class')
        if (className && !className.includes('bg-accent')) {
          await button.click()
          await expect(button).toHaveClass(/bg-accent/)
          break
        }
      }
    }
  })

  test('should logout successfully', async ({ page }) => {
    await dashboardPage.logout()
    await expect(page).toHaveURL(/\/login/)
  })

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await dashboardPage.logout()

    await dashboardPage.goto()
    await expect(page).toHaveURL(/\/login/)
  })
})
