# Calculator — Full-Stack App (Sezzle)

Full-stack calculator application: REST API in Kotlin/Micronaut and web client in React. Includes binary operations (add, subtract, multiply, divide, power, percentage), unary operation (square root), validation, error handling, and tests.

---

## Contents

- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Requirements](#requirements)
- [Quick start with Docker](#quick-start-with-docker)
- [Local development](#local-development)
- [Tests](#tests)
- [API documentation](#api-documentation)
- [Error codes](#error-codes)

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

## Requirements

- **Docker:** Docker and Docker Desktop running.
- **Local run:**
  - **Backend:** JDK 17+, Gradle 8.5 (wrapper included in repo).
  - **Frontend:** Node.js 20+ and npm.

---

## Quick start with Docker

Easiest way to run the full app (backend + frontend in one container):

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

---

## Local development

### 1. Backend (port 8080)

```bash
cd calculator-backend
./gradlew run
```

On Windows: `gradlew.bat run`

API is available at `http://localhost:8080`. Swagger UI: http://localhost:8080/swagger-ui/

### 2. Frontend (port 3000)

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

## API documentation

With the backend running (local or Docker with frontend on same origin):

- **Swagger UI:** http://localhost:8080/swagger-ui/
- **OpenAPI YAML:** http://localhost:8080/swagger/calculator-api-1.0.yml

**API base URL:** `http://localhost:8080/api/v1`

Endpoint examples (POST, `Content-Type: application/json`):

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

For more backend detail (architecture, CORS, cURL examples), see `calculator-backend/README.md`.
