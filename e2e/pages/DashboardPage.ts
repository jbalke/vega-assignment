import type { Locator, Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly welcomeMessage: Locator;
  readonly userName: Locator;
  readonly refreshButton: Locator;
  readonly logoutButton: Locator;
  readonly portfolioValue: Locator;
  readonly performanceSection: Locator;
  readonly assetButton: Locator;
  readonly classButton: Locator;
  readonly positionsTable: Locator;
  readonly donutChart: Locator;
  readonly historicalChart: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.getByText(/welcome back/i);
    this.userName = page.getByRole('heading', { name: /ava patel/i });
    this.refreshButton = page.getByRole('button', { name: /refresh/i });
    this.logoutButton = page.getByRole('button', { name: /logout/i });
    this.portfolioValue = page.getByText(/portfolio value/i);
    this.performanceSection = page.getByText(/performance/i);
    this.assetButton = page
      .locator('button')
      .filter({ hasText: /^asset$/i })
      .first();
    this.classButton = page
      .locator('button')
      .filter({ hasText: /^class$/i })
      .first();
    this.positionsTable = page.getByRole('table', { name: 'Positions' });
    this.donutChart = page.getByTestId('portfolio-donut-chart-container').locator('svg').first();
    this.historicalChart = page
      .getByTestId('historical-performance-chart-container')
      .locator('svg')
      .first();
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async waitForLoad() {
    await this.welcomeMessage.waitFor({ state: 'visible' });
  }

  async logout() {
    await this.logoutButton.click();
    await this.page.waitForURL(/\/login/);
  }

  async refresh() {
    await this.refreshButton.click();
  }

  async switchToClassView() {
    await this.classButton.click();
  }

  async switchToAssetView() {
    await this.assetButton.click();
  }

  getTimeRangeButton(range: '1M' | '3M' | '6M' | 'YTD' | '1Y' | 'MAX'): Locator {
    return this.page.getByRole('button', { name: range });
  }

  async selectTimeRange(range: '1M' | '3M' | '6M' | 'YTD' | '1Y' | 'MAX') {
    const button = this.getTimeRangeButton(range);
    await button.click();
  }

  getTableHeaders(): Locator {
    return this.positionsTable.locator('th');
  }

  getTableColumnHeader(name: string | RegExp): Locator {
    return this.positionsTable.getByRole('columnheader', { name });
  }

  async checkHorizontalScroll(): Promise<{
    viewportWidth: number;
    bodyWidth: number;
    htmlWidth: number;
    hasHorizontalScroll: boolean;
  }> {
    return await this.page.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;
      const viewportWidth = window.innerWidth;
      const bodyWidth = body.scrollWidth;
      const htmlWidth = html.scrollWidth;
      return {
        viewportWidth,
        bodyWidth,
        htmlWidth,
        hasHorizontalScroll: bodyWidth > viewportWidth || htmlWidth > viewportWidth,
      };
    });
  }

  async checkTableHorizontalScroll(): Promise<{
    hasTable: boolean;
    tableWidth: number;
    containerWidth: number;
    hasHorizontalScroll: boolean;
    viewportWidth: number;
  }> {
    return await this.page.evaluate(() => {
      const table = document.querySelector(
        'table[aria-label="Positions"]'
      ) as HTMLTableElement | null;
      if (!table)
        return {
          hasTable: false,
          tableWidth: 0,
          containerWidth: 0,
          hasHorizontalScroll: false,
          viewportWidth: 0,
        };
      const tableContainer =
        (table.closest('[class*="overflow"]') as HTMLElement | null) ||
        (table.parentElement as HTMLElement | null);
      const hasHorizontalScroll =
        tableContainer && tableContainer.scrollWidth > tableContainer.clientWidth;
      return {
        hasTable: true,
        tableWidth: table.offsetWidth,
        containerWidth: tableContainer ? tableContainer.clientWidth : 0,
        hasHorizontalScroll: Boolean(hasHorizontalScroll),
        viewportWidth: window.innerWidth,
      };
    });
  }
}
