## Vega Portfolio Frontend

A Vite + React + TypeScript single-page application that visualises a mock investor portfolio with login, donut balance breakdown, responsive positions table, and historical performance charting. All data is sourced from a local mock API layer that mirrors the provided REST contract.

### 🧱 Tech Stack

- React 18 with TypeScript, React Router, TanStack Query
- Recharts for visualisations, Tailwind CSS for themeable styling
- Vite + Vitest + Testing Library

### 🚀 Getting Started

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` and authenticate with the demo credentials:

- Email: `investor@vega.app`
- Password: `portfolio`

### 📊 Available Scripts

| Command           | Description                                |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Start the Vite dev server                  |
| `npm run build`   | Type-check and build the production bundle |
| `npm run preview` | Preview the production build locally       |
| `npm run test`    | Run unit and component tests via Vitest    |

### 🧠 Architecture Notes

- `src/services/mockApi.ts` exposes `/assets`, `/portfolios`, and `/prices` equivalents backed by deterministic mock data in `src/data/mockData.ts`.
- `AuthProvider` stores a session token in `localStorage` for the demo login flow.
- `usePortfolioOverview` composes assets, positions, and prices via TanStack Query and feeds both the donut and positions table.
- `usePriceHistory` hydrates the historical chart with time-range aware price slices; selections in the donut chart automatically refilter both the table and historical chart.
- Tailwind tokens live in the `@theme` block inside `src/index.css`, so you can adjust brand colors, shadows, and typography there for white-labeling.

### ✅ Testing & Quality

```bash
npm run test   # unit + component specs
npm run build  # ensures type safety and production build success
```

### 📂 Project Layout

```
frontend/
  src/
    components/   // charts, tables, reusable UI
    data/         // deterministic asset & price fixtures
    features/     // portfolio hooks + range helpers
    pages/        // login + dashboard routes
    providers/    // auth + react-query setup
    services/     // mock API contract
    utils/        // formatting + aggregation helpers
```

Feel free to adapt the mock API or styles to point at a real backend—only `services/mockApi.ts` would need to be replaced.
