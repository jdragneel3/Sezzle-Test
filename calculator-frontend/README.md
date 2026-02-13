# Calculator Frontend

React + TypeScript calculator UI that consumes the Kotlin/Micronaut backend API. iOS/macOS-style design with full keyboard support, error handling, and responsive layout.

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **Backend** running at `http://localhost:8080` for full-stack use (see [calculator-backend](../calculator-backend))

## Installation

```bash
npm install
```

## Environment

Copy `.env.example` to `.env` and adjust if needed:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080/api/v1` |
| `VITE_API_DOCS_URL` | API documentation URL | `http://localhost:8080/calculator-api-1.0` |

## Running the app

```bash
npm run dev
```

App runs at **http://localhost:3000**. Use the proxy so `/api` requests go to the backend when both run locally.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build |
| `npm test` | Run unit tests (watch) |
| `npm run test:ui` | Vitest UI |
| `npm run test:coverage` | Unit tests with coverage report |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run lint` | ESLint |
| `npm run format` | Prettier format |

## Testing

- **Unit:** Vitest + React Testing Library. Target ≥70% coverage (thresholds in `vite.config.ts`).
- **E2E:** Playwright. Start backend for API-dependent tests:
  ```bash
  # Terminal 1 – backend
  cd ../calculator-backend && ./gradlew run
  # Terminal 2 – E2E
  npm run test:e2e
  ```

## API integration

- **Docs:** [http://localhost:8080/calculator-api-1.0](http://localhost:8080/calculator-api-1.0) when backend is running.
- **Endpoints:** `POST /api/v1/add`, `/subtract`, `/multiply`, `/divide`, `/power`, `/percentage`, `/sqrt` with JSON bodies; success `{ result, operation, timestamp }`; errors `{ errorCode, message, details?, timestamp }` (CALC_001–CALC_006).

## Architecture

- **UI:** `Calculator` → `Display`, `Keypad` (→ `Button`), `Spinner`, error message.
- **State:** `useCalculator` (useReducer) + `useApi` for API calls.
- **API:** `calculatorApi` (Axios) in `services/`.
- **Types:** `types/calculator.types.ts`, `types/api.types.ts`.
- **Utils:** `formatNumber`, `validation`, `errorMessages`.

Error codes are mapped to user-facing messages (e.g. CALC_001 → "Cannot divide by zero"); network errors → "Unable to connect to server".

## Accessibility

- ARIA labels on buttons and display (`aria-live="polite"`).
- Keyboard: 0–9, `.`, `+`, `-`, `*`, `/`, `Enter` (=), `Escape` (AC).

## License

Private / internal use.
