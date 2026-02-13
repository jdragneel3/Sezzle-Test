# Calculator — Full-Stack App (Sezzle)

Full-stack calculator application: REST API in Kotlin/Micronaut and web client in React. Includes binary operations (add, subtract, multiply, divide, power, percentage), unary operation (square root), validation, error handling, and tests.

---

## Contents

- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Setup instructions](#setup-instructions)
- [How to run the frontend and backend](#how-to-run-the-frontend-and-backend)
- [Tests](#tests)
- [API documentation and examples](#api-documentation-and-examples)
- [Error codes](#error-codes)
- [Design decisions and assumptions](#design-decisions-and-assumptions)

---

## Tech stack

| Layer      | Technology |
|-----------|------------|
| **Backend** | Kotlin 1.9, Micronaut 4, Java 17, Gradle 8.5 |
| **Frontend** | React 19, TypeScript, Vite 7, Tailwind CSS, Axios |
| **Tests**   | JUnit 5, Mockito (backend); Vitest, Testing Library, Playwright (frontend) |
| **API**     | REST JSON, OpenAPI 3, Swagger UI |

---

## Project structure

```
sezzle/
├── calculator-backend/     # REST API (Micronaut + Kotlin)
│   ├── src/main/kotlin/    # Logic, controllers, services, DTOs
│   └── src/test/           # Unit and integration tests
├── calculator-frontend/    # React SPA (Vite + TypeScript)
│   ├── src/                # Components, hooks, services, tests
│   └── e2e/                # E2E tests with Playwright
├── Dockerfile              # Single image: backend + frontend + Nginx
└── README.md
```

---

## Setup instructions

- **Option A – Docker (recommended):** Install [Docker](https://docs.docker.com/get-docker/) and ensure Docker Desktop (or the Docker daemon) is running. No need to install JDK or Node locally.
- **Option B – Local:**
  - **Backend:** JDK 17+, Gradle 8.5 (wrapper included in this repo; use `./gradlew` or `gradlew.bat` on Windows).
  - **Frontend:** Node.js 20+ and npm.

Clone the repository (if needed) and open a terminal in the project root.

---

## How to run the frontend and backend

### Option 1: Single container (Docker)

Easiest way to run both backend and frontend together:

```bash
# From the repository root
docker build -t sezzle-calculator .
docker run -p 80:80 sezzle-calculator
```

Open in browser: **http://localhost**

If port 80 is already in use, run with another port (e.g. `docker run -p 3000:80 sezzle-calculator`) and open http://localhost:3000.

- Frontend is served on port 80 (or the host port you mapped).
- Requests to `/api` are proxied to the backend inside the same container.
- No need to start backend or frontend separately.

### Option 2: Backend and frontend separately (local)

**Step 1 – Backend (port 8080)**

```bash
cd calculator-backend
./gradlew run
```

On Windows: `gradlew.bat run`

API is available at `http://localhost:8080`. Swagger UI: http://localhost:8080/swagger-ui/

**Step 2 – Frontend (port 3000)**

In a **separate terminal**:

```bash
cd calculator-frontend
npm install
npm run dev
```

Open **http://localhost:3000**. Vite’s proxy forwards `/api` calls to the backend on port 8080.

Optional: create `calculator-frontend/.env` with `VITE_API_URL=http://localhost:8080/api/v1` to override the API base URL.

---

## Tests

### Backend

```bash
cd calculator-backend
./gradlew test
./gradlew jacocoTestReport   # Coverage report at build/reports/jacoco/test/html/index.html
```

### Frontend

```bash
cd calculator-frontend
npm run test                 # Vitest (unit tests)
npm run test:coverage        # Coverage
npm run test:e2e             # E2E with Playwright (requires backend on 8080 and frontend on 3000)
```

---

## API documentation and examples

The backend exposes a REST API. Base URL (when running locally or when using the Docker app’s proxy): **`http://localhost:8080/api/v1`**.

- **Swagger UI (interactive):** http://localhost:8080/swagger-ui/
- **OpenAPI YAML:** http://localhost:8080/swagger/calculator-api-1.0.yml

### Example API calls

All operation endpoints use `Content-Type: application/json`. Success responses include `result`, `operation`, and `timestamp`; errors include `errorCode`, `message`, and `timestamp`.

**Addition (POST /add)**

```bash
curl -X POST http://localhost:8080/api/v1/add \
  -H "Content-Type: application/json" \
  -d '{"operand1": 10, "operand2": 5}'
```

Response: `{"result":15.0,"operation":"ADD","timestamp":"2025-02-13T..."}`

**Division by zero (error)**

```bash
curl -X POST http://localhost:8080/api/v1/divide \
  -H "Content-Type: application/json" \
  -d '{"operand1": 10, "operand2": 0}'
```

Response (400): `{"errorCode":"CALC_001","message":"Division by zero",...}`

**Square root (POST /sqrt)**

```bash
curl -X POST http://localhost:8080/api/v1/sqrt \
  -H "Content-Type: application/json" \
  -d '{"operand": 25}'
```

Response: `{"result":5.0,"operation":"SQRT","timestamp":"..."}`

### Endpoint summary

| Operation   | Endpoint      | Body (example)              |
|------------|---------------|-----------------------------|
| Add        | POST /add     | `{"operand1": 10, "operand2": 5}` |
| Subtract   | POST /subtract| `{"operand1": 10, "operand2": 5}` |
| Multiply   | POST /multiply| `{"operand1": 10, "operand2": 5}` |
| Divide     | POST /divide  | `{"operand1": 10, "operand2": 5}` |
| Power      | POST /power   | `{"operand1": 2, "operand2": 3}`  |
| Percentage | POST /percentage | `{"operand1": 100, "operand2": 25}` |
| Square root| POST /sqrt    | `{"operand": 25}`            |
| Health     | GET /health   | —                            |

---

## Design decisions and assumptions

- **Backend:** REST over JSON with a thin controller layer and a dedicated service for business logic. Validation and errors are centralized (global exception handler) with stable error codes (CALC_001–CALC_006) for client handling. OpenAPI/Swagger is used for documentation. Micronaut was chosen for a lightweight JVM API with good Kotlin support.
- **Frontend:** Single-page app (React + TypeScript) with a reducer-based state for the calculator and a separate hook for API calls. The UI mimics a simple calculator keypad; backend performs all operations to keep logic and validation in one place. API base URL is configurable via env for local vs Docker/production.
- **Docker:** One image runs both backend (fat JAR) and frontend (static files served by Nginx). Nginx proxies `/api` to the backend so the browser talks to a single origin; no CORS issues in that setup. Port 80 is used by default; another host port can be mapped if 80 is in use.
- **Assumptions:** Backend and frontend are developed and versioned together. The API is internal to this app (no public multi-tenant API). Numbers are handled as doubles; edge cases (overflow, NaN, division by zero) are validated and return structured errors.

---

## Error codes

The API returns error responses with a code and message:

| Code   | Scenario |
|--------|----------|
| CALC_001 | Division by zero |
| CALC_002 | Invalid operand (NaN, Infinity, or wrong type) |
| CALC_003 | Negative number for square root |
| CALC_004 | Numerical overflow/underflow |
| CALC_005 | Percentage out of range (must be 0–100) |
| CALC_006 | Validation error (null or missing operands) |

---

For more detail (backend architecture, CORS, extra cURL examples), see `calculator-backend/README.md`. For frontend structure and scripts, see `calculator-frontend/README.md`.
