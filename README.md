## Vega Portfolio Frontend

A Vite + React + TypeScript single-page application that visualises a mock investor portfolio with login, donut balance breakdown, responsive positions table, and historical performance charting. All data is sourced from a local mock API layer that mirrors the provided REST contract.

### 🧱 Tech Stack

- React 19 with TypeScript, React Router, TanStack Query
- Recharts for visualisations, Tailwind CSS v4 for themeable styling
- Vite + Vitest + Testing Library for unit tests
- Playwright for E2E and accessibility testing
- MSW (Mock Service Worker) for API mocking
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

### 🧠 Architecture Notes

- `src/services/mockApi.ts` exposes `/assets`, `/portfolios`, and `/prices` equivalents backed by deterministic mock data in `src/data/mockData.ts`.
- `AuthProvider` stores a session token in `localStorage` for the demo login flow.
- `usePortfolioOverview` composes assets, positions, and prices via TanStack Query and feeds both the donut and positions table.
- `usePriceHistory` hydrates the historical chart with time-range aware price slices; selections in the donut chart automatically refilter both the table and historical chart.
- MSW intercepts all API requests in development mode.
- Tailwind theme uses CSS `@theme` directive for white-label customization.

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
frontend/
  e2e/              # Playwright E2E and a11y tests
  src/
    components/     # charts, tables, reusable UI
    data/           # deterministic asset & price fixtures
    features/       # portfolio hooks + range helpers
    pages/          # login + dashboard routes
    providers/      # auth + react-query setup
    services/       # mock API contract
    utils/          # formatting + aggregation helpers
```

### 🔒 Accessibility

The application includes comprehensive accessibility testing using Playwright and axe-core:

- WCAG 2.1 AA compliance checks
- Keyboard navigation testing
- Screen reader compatibility
- Proper ARIA labels and roles

Run accessibility tests with: `npm run test:a11y`

Feel free to adapt the mock API or styles to point at a real backend—only `services/mockApi.ts` would need to be replaced.
