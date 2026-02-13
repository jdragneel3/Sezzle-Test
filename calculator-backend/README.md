# Calculator Backend

REST API microservice for calculator operations. Built with **Micronaut 4.x**, **Kotlin**, and a clear MVC-style structure. Exposes binary operations (add, subtract, multiply, divide, power, percentage), unary operation (square root), validation, structured error responses, and OpenAPI documentation.

---

## Contents

- [Tech stack](#tech-stack)
- [Setup instructions](#setup-instructions)
- [How to run](#how-to-run)
- [API overview and examples](#api-overview-and-examples)
- [Error codes](#error-codes)
- [Design decisions and assumptions](#design-decisions-and-assumptions)
- [CORS](#cors)

---

## Tech stack

| Area        | Technology |
|------------|------------|
| Runtime    | Java 17, Kotlin 1.9 |
| Framework  | Micronaut 4.x (Netty, Jackson, Validation, OpenAPI) |
| Build      | Gradle 8.5 (wrapper included) |
| Tests      | JUnit 5, Mockito Kotlin |
| Coverage   | JaCoCo |

---

## Setup instructions

- **JDK 17+** (OpenJDK or Oracle JDK).
- **Gradle 8.5** — the project includes the Gradle wrapper; use `./gradlew` on Unix/macOS or `gradlew.bat` on Windows. No need to install Gradle globally.

From the repository root, open a terminal in `calculator-backend/`.

---

## How to run

```bash
# Build (including tests)
./gradlew build

# Run the application
./gradlew run
```

On Windows: `gradlew.bat build` and `gradlew.bat run`.

The API is available at **http://localhost:8080**. Health: `GET http://localhost:8080/api/v1/health`.

### Test coverage report

```bash
./gradlew jacocoTestReport
```

HTML report: `build/reports/jacoco/test/html/index.html`.

### Fat JAR (for Docker / standalone run)

```bash
./gradlew shadowJar
```

Output: `build/libs/calculator-backend-0.1-all.jar`. Run with: `java -jar build/libs/calculator-backend-0.1-all.jar`.

---

## API overview and examples

**Base URL:** `http://localhost:8080/api/v1`

All operation endpoints expect `Content-Type: application/json`.

### Binary operations (POST)

Request body: `{"operand1": <number>, "operand2": <number>}`

| Endpoint         | Operation     | Example        |
|------------------|---------------|----------------|
| POST /add        | Addition      | 10 + 5 → 15    |
| POST /subtract   | Subtraction   | 10 - 5 → 5     |
| POST /multiply   | Multiplication| 10 × 5 → 50    |
| POST /divide     | Division      | 10 / 5 → 2     |
| POST /power      | Exponentiation| 2^3 → 8        |
| POST /percentage | Percentage    | 100 × 25% → 25 |

### Unary operation (POST)

**POST /sqrt** — request body: `{"operand": <number>}`  
Example: `{"operand": 25}` → `{"result": 5.0, "operation": "SQRT", "timestamp": "..."}`

### Health (GET)

**GET /health** — returns `{"status": "UP"}`.

**Interactive documentation (when the app is running):** Swagger UI at http://localhost:8080/swagger-ui/ and OpenAPI YAML at http://localhost:8080/swagger/calculator-api-1.0.yml.

### Example API calls (cURL)

```bash
# Addition
curl -X POST http://localhost:8080/api/v1/add \
  -H "Content-Type: application/json" \
  -d '{"operand1": 10, "operand2": 5}'
# → {"result":15.0,"operation":"ADD","timestamp":"..."}

# Division by zero (4xx error)
curl -X POST http://localhost:8080/api/v1/divide \
  -H "Content-Type: application/json" \
  -d '{"operand1": 10, "operand2": 0}'
# → 400 {"errorCode":"CALC_001","message":"Division by zero",...}

# Square root
curl -X POST http://localhost:8080/api/v1/sqrt \
  -H "Content-Type: application/json" \
  -d '{"operand": 25}'
# → {"result":5.0,"operation":"SQRT","timestamp":"..."}

# Health check
curl http://localhost:8080/api/v1/health
```

---

## Error codes

The API returns JSON error bodies with a stable `errorCode` and a `message`. Use these for client-side handling and user-facing messages.

| Code    | Scenario |
|---------|----------|
| CALC_001 | Division by zero |
| CALC_002 | Invalid operand (NaN, Infinity, or wrong type) |
| CALC_003 | Negative number for square root |
| CALC_004 | Numerical overflow or underflow |
| CALC_005 | Invalid percentage (must be 0–100) |
| CALC_006 | Validation error (null or missing operands) |

---

## Design decisions and assumptions

- **Architecture:** MVC-style: thin controllers (HTTP only), service layer for all calculator logic and validation, DTOs for request/response. A global exception handler and an optional response filter ensure a consistent JSON error shape (`errorCode`, `message`, `timestamp`).
- **API design:** REST over JSON. OpenAPI 3 spec is generated from code; Swagger UI is served for interactive docs. All operations are POST (except health) with JSON bodies to keep the API uniform and easy to document.
- **Validation and errors:** Operands are validated (NaN, Infinity, division by zero, negative sqrt, percentage range, overflow). Stable error codes (CALC_001–CALC_006) allow the frontend to show user-friendly messages without parsing free text.
- **Testing:** JUnit 5 and Mockito for unit and integration tests; test-first where applicable. JaCoCo for coverage.
- **Assumptions:** The API is used only by the companion React frontend (and optionally Swagger). Numbers are `Double`; we rely on the JVM and explicit checks for edge cases. CORS is configured for the frontend origin(s).

---

## CORS

CORS is enabled for the React frontend. Default allowed origin for local development: `http://localhost:3000`. For other origins or Docker (same-origin behind a reverse proxy), the backend can be configured via environment (e.g. `MICRONAUT_SERVER_CORS_CONFIGURATIONS_WEB_ALLOWED_ORIGINS`).
