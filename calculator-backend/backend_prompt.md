PROJECT CONTEXT
Full-stack calculator application with separated architecture: React (TypeScript) frontend and Kotlin/Micronaut microservice backend. The backend exposes a REST API for basic and advanced arithmetic operations, consumed by the frontend.
ROLE AND RESPONSIBILITY
You are acting as: Backend Developer (Kotlin/Micronaut)
Technical stack:

Kotlin 1.9+
Micronaut Framework 4.x
Gradle (Kotlin DSL)
JUnit 5 + Mockito for testing
SLF4J + Logback for structured logging

PRIMARY OBJECTIVE
Build a REST API microservice in Micronaut that exposes specific endpoints for calculator operations (addition, subtraction, multiplication, division, exponentiation, square root, percentage), with advanced input validation, robust error handling with custom error codes, structured logging, and unit test coverage.
TECHNICAL SPECIFICATIONS
Required Endpoints
POST /api/v1/add         - Addition of two numbers
POST /api/v1/subtract    - Subtraction of two numbers
POST /api/v1/multiply    - Multiplication of two numbers
POST /api/v1/divide      - Division of two numbers
POST /api/v1/power       - Exponentiation (base^exponent)
POST /api/v1/sqrt        - Square root of a number
POST /api/v1/percentage  - Percentage calculation (value, percentage)
GET  /api/v1/health      - Health check endpoint
Request/Response Contracts
Binary Operations Request (add, subtract, multiply, divide, power, percentage):
kotlindata class BinaryOperationRequest(
    @field:NotNull
    val operand1: Double,
    
    @field:NotNull
    val operand2: Double
)
Unary Operation Request (sqrt):
kotlindata class UnaryOperationRequest(
    @field:NotNull
    val operand: Double
)
Success Response:
kotlindata class CalculationResponse(
    val result: Double,
    val operation: String,
    val timestamp: Instant
)
Error Response:
kotlindata class ErrorResponse(
    val errorCode: String,
    val message: String,
    val details: String?,
    val timestamp: Instant
)
```

#### Custom Error Codes
- `CALC_001`: Division by zero
- `CALC_002`: Invalid operand (NaN, Infinity)
- `CALC_003`: Negative number for square root
- `CALC_004`: Numerical overflow/underflow
- `CALC_005`: Invalid percentage value (< 0 or > 100)
- `CALC_006`: Validation error (missing/null operands)

#### Input Validation Rules
1. **All operations**: Reject `NaN`, `Infinity`, `-Infinity`
2. **Division**: Second operand cannot be 0
3. **Square root**: Operand must be >= 0
4. **Percentage**: Second operand must be between 0 and 100
5. **Overflow detection**: Check if result exceeds `Double.MAX_VALUE` or goes below `Double.MIN_VALUE`

#### Structured Logging Requirements
Use SLF4J with MDC (Mapped Diagnostic Context) for:
- **INFO**: Successful operation completion with operation type and execution time
- **WARN**: Edge cases (very large numbers, near-zero divisions)
- **ERROR**: Validation failures and calculation errors with error codes
- Include request ID in MDC for traceability

Example log format:
```
[requestId=abc123] INFO  - Operation=ADD completed successfully in 2ms, result=15.5
[requestId=abc123] ERROR - Operation=DIVIDE failed, errorCode=CALC_001, reason=Division by zero
```

### ARCHITECTURE AND CODE ORGANIZATION

#### Project Structure
```
calculator-backend/
├── src/main/kotlin/com/calculator/
│   ├── controller/
│   │   └── CalculatorController.kt
│   ├── service/
│   │   ├── CalculatorService.kt
│   │   └── impl/CalculatorServiceImpl.kt
│   ├── model/
│   │   ├── request/
│   │   │   ├── BinaryOperationRequest.kt
│   │   │   └── UnaryOperationRequest.kt
│   │   └── response/
│   │       ├── CalculationResponse.kt
│   │       └── ErrorResponse.kt
│   ├── exception/
│   │   ├── CalculatorException.kt
│   │   ├── DivisionByZeroException.kt
│   │   ├── InvalidOperandException.kt
│   │   └── GlobalExceptionHandler.kt
│   └── config/
│       └── LoggingConfig.kt
├── src/main/resources/
│   ├── application.yml
│   └── logback.xml
├── src/test/kotlin/com/calculator/
│   ├── controller/
│   │   └── CalculatorControllerTest.kt
│   └── service/
│       └── CalculatorServiceTest.kt
├── build.gradle.kts
└── README.md
Design Patterns to Apply

Controller-Service pattern: Thin controllers, business logic in service layer
Dependency Injection: Use Micronaut's @Inject and @Singleton
Exception Hierarchy: Custom exceptions extending base CalculatorException
Global Exception Handler: @Error annotated methods in controller advice

ACCEPTANCE CRITERIA

✅ All 7 endpoints respond correctly to valid requests
✅ Division by zero returns HTTP 400 with error code CALC_001
✅ Square root of negative number returns HTTP 400 with error code CALC_003
✅ Invalid input (null, NaN, Infinity) returns HTTP 400 with error code CALC_002
✅ All operations log structured entries with request ID
✅ Unit tests achieve minimum 80% code coverage
✅ Service layer is fully mocked in controller tests
✅ Health endpoint returns HTTP 200 with service status
✅ CORS enabled for React frontend (port 3000)
✅ README includes API examples with curl commands

CRITICAL TEST CASES
Service Layer Tests (CalculatorServiceTest.kt)
kotlin// Happy Path
@Test fun `addition of positive numbers returns correct result`
@Test fun `subtraction returns correct result`
@Test fun `multiplication returns correct result`
@Test fun `division returns correct result`
@Test fun `power calculation returns correct result`
@Test fun `square root returns correct result`
@Test fun `percentage calculation returns correct result`

// Edge Cases
@Test fun `addition of very large numbers detects overflow`
@Test fun `division by very small number (close to zero) works`
@Test fun `square root of zero returns zero`
@Test fun `power of zero returns one`

// Error Cases
@Test fun `division by zero throws DivisionByZeroException`
@Test fun `square root of negative throws InvalidOperandException`
@Test fun `NaN operand throws InvalidOperandException`
@Test fun `Infinity operand throws InvalidOperandException`
@Test fun `percentage over 100 throws InvalidOperandException`
Controller Layer Tests (CalculatorControllerTest.kt)
kotlin@Test fun `POST add with valid input returns 200 and correct result`
@Test fun `POST divide with zero divisor returns 400 with CALC_001`
@Test fun `POST sqrt with negative returns 400 with CALC_003`
@Test fun `POST with null operand returns 400 with CALC_006`
@Test fun `GET health returns 200 with UP status`
Use @MockBean to mock CalculatorService in controller tests.
IMPLEMENTATION STEPS
Step 1: Project Setup

Initialize Micronaut project with Gradle Kotlin DSL
Add dependencies: micronaut-validation, logback-classic, junit-jupiter, mockito-kotlin
Configure application.yml with server port 8080, CORS settings
Configure logback.xml with JSON format for structured logs

Step 2: Core Business Logic

Implement CalculatorService interface with all 7 operation methods
Implement CalculatorServiceImpl with validation logic
Create custom exception hierarchy
Add input validation for each operation type

Step 3: REST Controllers

Create CalculatorController with @Controller("/api/v1")
Implement all 7 POST endpoints with @Body annotations
Implement health check endpoint
Create GlobalExceptionHandler with @Error methods for custom exceptions

Step 4: Logging Integration

Add SLF4J logger to service implementation
Implement MDC filter for request ID generation
Log INFO on successful operations with execution time
Log ERROR on failures with error codes

Step 5: Testing

Write service layer unit tests (15+ test cases)
Write controller integration tests with mocked service (10+ test cases)
Run tests and generate coverage report with JaCoCo
Ensure minimum 80% coverage

Step 6: Documentation

Create comprehensive README with:

Setup instructions (prerequisites, build, run)
API documentation with curl examples for each endpoint
Error code reference table
Design decisions rationale


Add OpenAPI/Swagger annotations (optional but recommended)
Include Docker instructions if containerization is added

CONFIGURATION EXAMPLES
application.yml:
yamlmicronaut:
  application:
    name: calculator-service
  server:
    port: 8080
    cors:
      enabled: true
      configurations:
        web:
          allowed-origins:
            - http://localhost:3000
          allowed-methods:
            - POST
            - GET
            - OPTIONS

logger:
  levels:
    com.calculator: INFO
build.gradle.kts (key dependencies):
kotlindependencies {
    implementation("io.micronaut:micronaut-validation")
    implementation("io.micronaut:micronaut-jackson-databind")
    implementation("ch.qos.logback:logback-classic")
    
    testImplementation("io.micronaut.test:micronaut-test-junit5")
    testImplementation("org.mockito.kotlin:mockito-kotlin:5.1.0")
    testImplementation("org.junit.jupiter:junit-jupiter")
}
DELIVERABLES CHECKLIST

 Fully functional Micronaut microservice with 7 calculator endpoints
 Global exception handler with custom error codes
 Structured logging with MDC and request IDs
 Service layer with business logic and validation
 Unit tests with 80%+ coverage (JaCoCo report)
 README with setup, API examples, and design rationale
 Health check endpoint for monitoring
 CORS configuration for React frontend integration
 Gradle build working with ./gradlew build

SUCCESS VALIDATION
Run these commands to verify completion:
bash# Build and test
./gradlew clean build

# Check test coverage (should show 80%+)
./gradlew jacocoTestReport
open build/reports/jacoco/test/html/index.html

# Run the service
./gradlew run

# Test endpoints
curl -X POST http://localhost:8080/api/v1/add \
  -H "Content-Type: application/json" \
  -d '{"operand1": 10, "operand2": 5}'

# Should return: {"result":15.0,"operation":"ADD","timestamp":"..."}

curl -X POST http://localhost:8080/api/v1/divide \
  -H "Content-Type: application/json" \
  -d '{"operand1": 10, "operand2": 0}'

# Should return 400: {"errorCode":"CALC_001","message":"Division by zero",...}