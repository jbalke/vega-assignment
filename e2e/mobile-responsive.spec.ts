import { expect, test } from '@playwright/test'

import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'

test.describe('Mobile Responsive Tests', () => {
  test('Login Page Mobile Layout', async ({ page }) => {
    // Resize browser to iPhone SE mobile viewport (375x667) for mobile responsive testing
    await page.setViewportSize({ width: 375, height: 667 })

    const loginPage = new LoginPage(page)
    await loginPage.goto()

    // Verify login page heading is visible on mobile viewport
    await expect(loginPage.heading).toBeVisible()

    // Verify email input is visible on mobile viewport
    await expect(loginPage.emailInput).toBeVisible()

    // Verify password input is visible on mobile viewport
    await expect(loginPage.passwordInput).toBeVisible()

    // Verify password toggle button is visible on mobile viewport
    await expect(loginPage.passwordToggleButton).toBeVisible()

    // Verify submit button is visible on mobile viewport
    await expect(loginPage.submitButton).toBeVisible()

    // Check for horizontal scrolling on mobile viewport
    const scrollCheck = await page.evaluate(() => {
      const body = document.body
      const html = document.documentElement
      const viewportWidth = window.innerWidth
      const bodyWidth = body.scrollWidth
      const htmlWidth = html.scrollWidth
      return {
        viewportWidth,
        bodyWidth,
        htmlWidth,
        hasHorizontalScroll: bodyWidth > viewportWidth || htmlWidth > viewportWidth,
      }
    })
    expect(scrollCheck.hasHorizontalScroll).toBe(false)
  })

  test('Login Form Interaction on Mobile', async ({ page }) => {
    // Resize browser to iPhone SE mobile viewport (375x667) for mobile responsive testing
    await page.setViewportSize({ width: 375, height: 667 })

    const loginPage = new LoginPage(page)
    await loginPage.goto()

    // Click email input field to test mobile interaction
    await loginPage.emailInput.click()

    // Type email address in mobile viewport
    await loginPage.fillEmail('investor@vega.app')

    // Click password input field to test mobile interaction
    await loginPage.passwordInput.click()

    // Type password in mobile viewport
    await loginPage.fillPassword('portfolio')

    // Toggle password visibility on mobile
    await loginPage.togglePasswordVisibility()

    // Submit login form on mobile
    await loginPage.submit()

    // Verify navigation to dashboard
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.getByText('Welcome back')).toBeVisible()
  })

  test('Dashboard Header Mobile Layout', async ({ page }) => {
    // Resize browser to iPhone SE mobile viewport (375x667) for mobile responsive testing
    await page.setViewportSize({ width: 375, height: 667 })

    const loginPage = new LoginPage(page)
    const dashboardPage = new DashboardPage(page)

    await loginPage.goto()
    await loginPage.loginWithDefaultCredentials()
    await dashboardPage.waitForLoad()

    // Verify welcome message is visible on mobile dashboard
    await expect(dashboardPage.welcomeMessage).toBeVisible()

    // Verify refresh button is visible on mobile dashboard
    await expect(dashboardPage.refreshButton).toBeVisible()

    // Verify logout button is visible on mobile dashboard
    await expect(dashboardPage.logoutButton).toBeVisible()
  })

  test('Portfolio Donut Chart Mobile Display', async ({ page }) => {
    // Resize browser to iPhone SE mobile viewport (375x667) for mobile responsive testing
    await page.setViewportSize({ width: 375, height: 667 })

    const loginPage = new LoginPage(page)
    const dashboardPage = new DashboardPage(page)

    await loginPage.goto()
    await loginPage.loginWithDefaultCredentials()
    await dashboardPage.waitForLoad()

    // Verify portfolio value text is visible
    await expect(dashboardPage.portfolioValue).toBeVisible()

    // Verify donut chart is visible
    await expect(dashboardPage.donutChart).toBeVisible()

    // Verify asset/class toggle buttons are visible and accessible
    await expect(dashboardPage.assetButton).toBeVisible()
    await expect(dashboardPage.classButton).toBeVisible()

    // Test toggling between asset and class views
    await dashboardPage.switchToClassView()
    await expect(dashboardPage.classButton).toHaveClass(/bg-accent/)

    await dashboardPage.switchToAssetView()
    await expect(dashboardPage.assetButton).toHaveClass(/bg-accent/)
  })

  test('Historical Performance Chart Mobile Display', async ({ page }) => {
    // Resize browser to iPhone SE mobile viewport (375x667) for mobile responsive testing
    await page.setViewportSize({ width: 375, height: 667 })

    const loginPage = new LoginPage(page)
    const dashboardPage = new DashboardPage(page)

    await loginPage.goto()
    await loginPage.loginWithDefaultCredentials()
    await dashboardPage.waitForLoad()

    // Verify performance section is visible
    await expect(dashboardPage.performanceSection).toBeVisible()

    // Verify historical chart is visible
    await expect(dashboardPage.historicalChart).toBeVisible()

    // Verify time range buttons (1M, 3M, 6M, YTD, 1Y, MAX) are visible
    await expect(dashboardPage.getTimeRangeButton('1M')).toBeVisible()
    await expect(dashboardPage.getTimeRangeButton('3M')).toBeVisible()
    await expect(dashboardPage.getTimeRangeButton('6M')).toBeVisible()
    await expect(dashboardPage.getTimeRangeButton('YTD')).toBeVisible()
    await expect(dashboardPage.getTimeRangeButton('1Y')).toBeVisible()
    await expect(dashboardPage.getTimeRangeButton('MAX')).toBeVisible()

    // Test changing time range
    await dashboardPage.selectTimeRange('1M')
    const oneMonthButton = dashboardPage.getTimeRangeButton('1M')
    await expect(oneMonthButton).toHaveClass(/bg-accent/)
  })

  test('Positions Table Mobile Display', async ({ page }) => {
    // Resize browser to iPhone SE mobile viewport (375x667) for mobile responsive testing
    await page.setViewportSize({ width: 375, height: 667 })

    const loginPage = new LoginPage(page)
    const dashboardPage = new DashboardPage(page)

    await loginPage.goto()
    await loginPage.loginWithDefaultCredentials()
    await dashboardPage.waitForLoad()

    // Verify positions table is visible
    await expect(dashboardPage.positionsTable).toBeVisible()

    // Verify table headers are visible
    const assetHeader = dashboardPage.getTableColumnHeader(/^Asset$/i)
    await expect(assetHeader).toBeVisible()

    // Verify table rows are visible
    const headers = dashboardPage.getTableHeaders()
    await expect(headers.first()).toBeVisible()

    // Check if positions table is horizontally scrollable on mobile
    const tableScrollCheck = await dashboardPage.checkTableHorizontalScroll()
    expect(tableScrollCheck.hasTable).toBe(true)
    expect(tableScrollCheck.hasHorizontalScroll).toBe(true)
  })

  test('Dashboard Full Mobile Flow', async ({ page }) => {
    // Resize browser to iPhone SE mobile viewport (375x667) for mobile responsive testing
    await page.setViewportSize({ width: 375, height: 667 })

    const loginPage = new LoginPage(page)
    const dashboardPage = new DashboardPage(page)

    // Navigate to login on mobile viewport
    await loginPage.goto()

    // Complete login flow
    await loginPage.loginWithDefaultCredentials()

    // Verify dashboard loads
    await expect(page).toHaveURL(/\/dashboard/)
    await dashboardPage.waitForLoad()

    // Verify all major sections are visible
    await expect(dashboardPage.portfolioValue).toBeVisible()
    await expect(dashboardPage.performanceSection).toBeVisible()
    await expect(dashboardPage.positionsTable).toBeVisible()

    // Verify no horizontal scrolling on main page
    const scrollCheck = await dashboardPage.checkHorizontalScroll()
    expect(scrollCheck.hasHorizontalScroll).toBe(false)

    // Test logout from mobile view
    await dashboardPage.logout()
    await expect(page).toHaveURL(/\/login/)
  })
})
