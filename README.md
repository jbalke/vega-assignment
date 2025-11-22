## Vega Portfolio Frontend

A Vite + React + TypeScript single-page application that visualises a mock investor portfolio with login, donut balance breakdown, responsive positions table, and historical performance charting. All data is sourced from a local mock API layer that mirrors the provided REST contract.

### 🧱 Tech Stack

- React 19 with TypeScript, React Router, TanStack Query
- Recharts for visualisations, Tailwind CSS v4 for themeable styling
- React Icons for UI icons
- Vite + Vitest + Testing Library for unit tests
- Playwright for E2E and accessibility testing (with Page Object Model)
- MSW (Mock Service Worker) for API mocking
- i18next + react-i18next for localization (en-GB, fr-FR, de-DE)
- ESLint + Prettier for code quality

### 🚀 Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` and authenticate with the demo credentials:

- Email: `investor@vega.app`
- Password: `portfolio`

### 📊 Available Scripts

| Command                  | Description                                |
| ------------------------ | ------------------------------------------ |
| `npm run dev`            | Start the Vite dev server                  |
| `npm run build`          | Type-check and build the production bundle |
| `npm run preview`        | Preview the production build locally       |
| `npm run test`           | Run unit and component tests via Vitest    |
| `npm run test:e2e`       | Run Playwright E2E tests                   |
| `npm run test:e2e:ui`    | Run Playwright tests with UI mode          |
| `npm run test:e2e:debug` | Run Playwright tests in debug mode         |
| `npm run test:a11y`      | Run accessibility tests only               |
| `npm run test:report`    | View Playwright test report                |
| `npm run lint`           | Check code with ESLint                     |
| `npm run lint:fix`       | Auto-fix ESLint issues                     |
| `npm run format`         | Check code formatting                      |
| `npm run format:fix`     | Auto-format code with Prettier             |
| `npm run format:lint`    | Check both formatting and linting          |

### 🧪 Testing

#### Unit Tests

```bash
npm run test
```

#### E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run with UI mode
npm run test:e2e:ui

# Run accessibility tests
npm run test:a11y
```

E2E tests use the Page Object Model (POM) pattern for maintainability. Page objects are located in `e2e/pages/` and include:

- `LoginPage.ts` - Login page interactions
- `DashboardPage.ts` - Dashboard page interactions

Tests cover:

- Login flow and authentication
- Dashboard functionality
- Accessibility (WCAG 2.1 AA compliance)
- Mobile responsive design (iPhone SE viewport)
- Localisation (language switching and persistence)

### 🧠 Architecture Notes

- `src/services/Api.ts` makes `fetch` calls to `/api/*` endpoints that are intercepted by MSW in development.
- `src/mocks/handlers.ts` defines MSW request handlers for `/api/assets`, `/api/portfolios`, and `/api/prices` using mock data from `src/data/mockData.ts`.
- `src/mocks/browser.ts` configures and starts the MSW browser worker (only in development mode).
- `AuthProvider` stores user session in `localStorage` for the demo login flow.
- `usePortfolioOverview` composes assets, positions, and prices via TanStack Query and feeds both the donut and positions table.
- `usePriceHistory` hydrates the historical chart with time-range aware price slices; selections in the donut chart automatically refilter both the table and historical chart.
- Tailwind theme uses CSS `@theme` directive in `src/index.css` for white-label customization.
- `src/i18n.ts` wires i18next + react-i18next with en-GB, fr-FR, and de-DE translations and persists the selected language (`vega-language`) to `localStorage`. The global footer exposes the language selector so users can switch locales at runtime.

### ✅ Testing & Quality

```bash
npm run test        # unit + component specs
npm run test:e2e    # E2E automation tests
npm run test:a11y   # accessibility tests
npm run build       # ensures type safety and production build success
npm run lint        # ESLint checks
npm run format      # Prettier formatting checks
```

### 📂 Project Layout

```
.
  e2e/              # Playwright E2E and a11y tests
    pages/          # Page Object Model classes
  src/
    components/     # charts, tables, reusable UI
      charts/       # PortfolioDonut, HistoricalPerformance
      common/       # AppFooter, ErrorState, LoadingState
      tables/       # PositionsTable
    data/           # deterministic asset & price fixtures
    features/       # portfolio hooks + range helpers
    i18n/           # i18next configuration
      translations/ # en-GB.json, fr-FR.json, de-DE.json
    mocks/          # MSW handlers and browser setup
    pages/          # login + dashboard routes
    providers/      # auth + react-query setup
    services/       # API service layer (fetch calls)
    types/          # TypeScript type definitions
    utils/          # formatting + aggregation helpers
```

### 🔒 Accessibility

The application includes comprehensive accessibility testing using Playwright and axe-core.

Run accessibility tests with: `npm run test:a11y`

### 🌐 Localization

- English (UK), French, and German translations ship by default via i18next.
- Use the footer language selector to switch locales; your choice is stored in `localStorage`, so refreshes reuse it automatically.
