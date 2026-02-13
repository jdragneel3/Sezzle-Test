# Calculator Frontend

React + TypeScript single-page application for the calculator. Consumes the backend REST API (Kotlin/Micronaut), with an iOS-style keypad UI, full keyboard support, structured error handling, and responsive layout.

---

## Contents

- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation and run](#installation-and-run)
- [Environment](#environment)
- [Scripts](#scripts)
- [Testing](#testing)
- [API integration](#api-integration)
- [Architecture](#architecture)
- [Accessibility](#accessibility)

---

## Tech stack

| Area        | Technology |
|------------|------------|
| UI         | React 19, TypeScript |
| Build      | Vite 7 |
| Styling    | Tailwind CSS |
| HTTP       | Axios |
| Unit tests | Vitest, React Testing Library |
| E2E tests  | Playwright |
| Lint/format| ESLint, Prettier |

---

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **Backend** running at `http://localhost:8080` for full-stack use and E2E tests (see [calculator-backend](../calculator-backend))

---

## Installation and run

```bash
npm install
npm run dev
```

The app runs at **http://localhost:3000**. With the backend on port 8080, Vite’s proxy forwards `/api` to the backend so the same origin is used in development.

---

## Environment

Copy `.env.example` to `.env` and adjust if your backend URL differs:

```bash
cp .env.example .env
```

| Variable           | Description              | Default |
|--------------------|--------------------------|---------|
| `VITE_API_URL`     | Backend API base URL     | `http://localhost:8080/api/v1` |
| `VITE_API_DOCS_URL`| API documentation URL    | `http://localhost:8080/calculator-api-1.0` |

---

## Scripts

| Command              | Description |
|----------------------|-------------|
| `npm run dev`        | Start dev server (port 3000) |
| `npm run build`      | TypeScript check + production build |
| `npm run preview`    | Serve production build locally |
| `npm run test`       | Run unit tests (watch mode) |
| `npm run test:ui`    | Vitest UI |
| `npm run test:coverage` | Unit tests with coverage report |
| `npm run test:e2e`   | Playwright E2E tests |
| `npm run test:e2e:ui`| Playwright E2E in UI mode |
| `npm run lint`       | ESLint |
| `npm run format`     | Prettier (write) |

---

## Testing

- **Unit:** Vitest + React Testing Library. Coverage thresholds are configured in `vite.config.ts`.
- **E2E:** Playwright. Backend must be running for API-dependent flows.

  ```bash
  # Terminal 1 – backend
  cd ../calculator-backend && ./gradlew run

  # Terminal 2 – E2E
  npm run test:e2e
  ```

On Windows use `gradlew.bat run` for the backend.

---

## API integration

- **Docs (when backend is running):** http://localhost:8080/swagger-ui/ and http://localhost:8080/calculator-api-1.0
- **Endpoints used:** `POST /api/v1/add`, `/subtract`, `/multiply`, `/divide`, `/power`, `/percentage`, `/sqrt` with JSON request bodies.
- **Success response:** `{ result, operation, timestamp }`.
- **Error response:** `{ errorCode, message, details?, timestamp }` with codes CALC_001–CALC_006 (see backend README).

Backend error codes are mapped to user-facing messages (e.g. CALC_001 → “Cannot divide by zero”); network failures show a generic connection message.

---

## Architecture

- **UI:** `Calculator` composes `Display`, `Keypad` (with reusable `Button`), `Spinner`, and error message area.
- **State:** `useCalculator` (reducer) holds calculator state; `useApi` encapsulates API calls and error handling.
- **API client:** `calculatorApi` in `services/` (Axios instance, base URL from env).
- **Types:** `types/calculator.types.ts`, `types/api.types.ts`.
- **Utils:** `formatNumber`, `validation`, `errorMessages` for display and validation.

---

## Accessibility

- ARIA labels on interactive elements; display uses `aria-live="polite"` for result updates.
- Keyboard: digits `0–9`, `.`, `+`, `-`, `*`, `/`, `Enter` (=), `Escape` (clear).
