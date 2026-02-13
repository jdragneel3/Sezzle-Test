# Calculator Backend

REST API microservice for calculator operations. Built with **Micronaut 4.x**, **Kotlin**, and a clear MVC-style structure. Exposes binary operations (add, subtract, multiply, divide, power, percentage), unary operation (square root), validation, structured error responses, and OpenAPI documentation.

---

## Contents

- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Build and run](#build-and-run)
- [API overview](#api-overview)
- [Interactive documentation](#interactive-documentation)
- [Error codes](#error-codes)
- [Architecture and practices](#architecture-and-practices)
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

## Prerequisites

- **JDK 17+**
- **Gradle 8.5** (wrapper is included; use `./gradlew` on Unix/macOS or `gradlew.bat` on Windows)

---

## Build and run

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

## API overview

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

---

## Interactive documentation

When the application is running:

- **Swagger UI:** http://localhost:8080/swagger-ui/
- **OpenAPI spec (YAML):** http://localhost:8080/swagger/calculator-api-1.0.yml

Use Swagger UI to explore and call endpoints interactively.

---

## cURL examples

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

## Architecture and practices

- **Structure:** Thin controllers, service layer for business logic, DTOs for requests/responses. Global exception handler and optional filter for consistent error JSON.
- **API design:** REST over JSON, OpenAPI 3 spec and Swagger UI for documentation.
- **Testing:** Unit and integration tests (JUnit 5, Mockito). Test-first approach where applicable.
- **Logging:** SLF4J with MDC for request correlation where needed.

---

## CORS

CORS is enabled for the React frontend. Default allowed origin for local development: `http://localhost:3000`. For other origins or Docker (same-origin behind a reverse proxy), the backend can be configured via environment (e.g. `MICRONAUT_SERVER_CORS_CONFIGURATIONS_WEB_ALLOWED_ORIGINS`).
