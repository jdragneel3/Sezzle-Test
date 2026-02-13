# Calculator Backend Microservice

REST API microservice for calculator operations built with Micronaut 4.x, Kotlin, and MVC architecture.

## Prerequisites

- JDK 17+
- Gradle 8.5 (wrapper included)

## Build and Run

```bash
# Build
./gradlew build

# Run
./gradlew run

# Test coverage report
./gradlew jacocoTestReport
# Report: build/reports/jacoco/test/html/index.html
```

## API Endpoints

Base URL: `http://localhost:8080/api/v1`

### Binary Operations (POST)

Request body:
```json
{"operand1": 10, "operand2": 5}
```

| Endpoint | Operation | Example |
|----------|-----------|---------|
| POST /add | Addition | 10 + 5 = 15 |
| POST /subtract | Subtraction | 10 - 5 = 5 |
| POST /multiply | Multiplication | 10 * 5 = 50 |
| POST /divide | Division | 10 / 5 = 2 |
| POST /power | Exponentiation | 2^3 = 8 |
| POST /percentage | Percentage | 100 * 25% = 25 |

### Unary Operation (POST)

Request body for `/sqrt`:
```json
{"operand": 25}
```

### Health Check (GET)

```
GET /health
```

Returns: `{"status": "UP"}`

## Swagger UI

Documentación interactiva disponible en:

- **Swagger UI:** http://localhost:8080/swagger-ui/
- **OpenAPI YAML:** http://localhost:8080/swagger/calculator-api-1.0.yml

## cURL Examples

```bash
# Addition
curl -X POST http://localhost:8080/api/v1/add \
  -H "Content-Type: application/json" \
  -d '{"operand1": 10, "operand2": 5}'
# Response: {"result":15.0,"operation":"ADD","timestamp":"..."}

# Division by zero (error)
curl -X POST http://localhost:8080/api/v1/divide \
  -H "Content-Type: application/json" \
  -d '{"operand1": 10, "operand2": 0}'
# Response 400: {"errorCode":"CALC_001","message":"Division by zero",...}

# Square root
curl -X POST http://localhost:8080/api/v1/sqrt \
  -H "Content-Type: application/json" \
  -d '{"operand": 25}'
# Response: {"result":5.0,"operation":"SQRT","timestamp":"..."}

# Health check
curl http://localhost:8080/api/v1/health
```

## Error Codes

| Code | Scenario |
|------|----------|
| CALC_001 | Division by zero |
| CALC_002 | Invalid operand (NaN, Infinity, or wrong type e.g. string instead of number) |
| CALC_003 | Negative number for square root |
| CALC_004 | Numerical overflow/underflow |
| CALC_005 | Invalid percentage (not 0-100) |
| CALC_006 | Validation error (null/missing operands) |

## Architecture

- **MVC**: Model (DTOs), View (JSON serialization), Controller (thin HTTP layer)
- **TDD**: Service and controller developed with test-first approach
- **Logging**: SLF4J with MDC for request ID traceability

## CORS

Configured for `http://localhost:3000` (React frontend).
