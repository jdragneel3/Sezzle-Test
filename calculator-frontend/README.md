# Calculator Frontend

React + TypeScript single-page application for the calculator. Consumes the backend REST API (Kotlin/Micronaut), with an iOS-style keypad UI, full keyboard support, structured error handling, and responsive layout.

---

## Contents

- [Tech stack](#tech-stack)
- [Setup instructions](#setup-instructions)
- [How to run](#how-to-run)
- [Environment](#environment)
- [Scripts](#scripts)
- [Testing](#testing)
- [API integration and examples](#api-integration-and-examples)
- [Design decisions and assumptions](#design-decisions-and-assumptions)
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

## Setup instructions

- **Node.js** 20+ (LTS recommended) and **npm**.
- For full-stack use and E2E tests, the **backend** must be running at `http://localhost:8080` (see [calculator-backend](../calculator-backend)).

From the repository root, open a terminal in `calculator-frontend/`.

---

## How to run

```bash
npm install
npm run dev
```

The app runs at **http://localhost:3000**. With the backend on port 8080, Vite’s proxy forwards `/api` to the backend so the same origin is used in development. To run backend and frontend together via Docker, see the [root README](../README.md).

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

## API integration and examples

The frontend calls the backend REST API. Base URL is set via `VITE_API_URL` (default `http://localhost:8080/api/v1`). When using Vite’s dev proxy, requests to `/api` are forwarded to the backend.

- **Docs (when backend is running):** http://localhost:8080/swagger-ui/ and http://localhost:8080/calculator-api-1.0
- **Endpoints used:** `POST /api/v1/add`, `/subtract`, `/multiply`, `/divide`, `/power`, `/percentage`, `/sqrt` with JSON bodies.
- **Success response:** `{ result, operation, timestamp }`.
- **Error response:** `{ errorCode, message, details?, timestamp }` with codes CALC_001–CALC_006 (see [calculator-backend](../calculator-backend)).

**Example (conceptually):** A user taps “5”, “+”, “3”, “=”. The app sends `POST /api/v1/add` with `{"operand1": 5, "operand2": 3}` and displays the returned `result` (8.0). On error (e.g. division by zero), the app maps `errorCode` (e.g. CALC_001) to a user-facing message (“Cannot divide by zero”); network errors show a generic “Unable to connect” message.

---

## Design decisions and assumptions

- **Architecture:** `Calculator` composes `Display`, `Keypad` (reusable `Button`), `Spinner`, and error area. State is in `useCalculator` (reducer); API calls and error handling are in `useApi`. The API client (`calculatorApi` in `services/`) uses Axios with base URL from env. Types live in `types/`; formatting and validation helpers in `utils/`.
- **Why backend for operations:** All calculations and validation live on the backend so logic is in one place, testable via the API, and the frontend stays a thin UI layer.
- **State and API:** The reducer holds display value, pending operation, and operands; `useApi` performs the HTTP call and maps backend errors to user-facing strings. This keeps UI and network concerns separated.
- **Assumptions:** The app is used with the companion backend. API base URL is configurable for local vs Docker/production. We assume a modern browser (ES modules, fetch).

---

## Accessibility

- ARIA labels on interactive elements; display uses `aria-live="polite"` for result updates.
- Keyboard: digits `0–9`, `.`, `+`, `-`, `*`, `/`, `Enter` (=), `Escape` (clear).
