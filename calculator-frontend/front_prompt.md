PROJECT CONTEXT
Full-stack calculator application with separated architecture: React (TypeScript) frontend consuming a REST API backend (Kotlin/Micronaut microservice). The frontend provides an intuitive, modern calculator interface styled after iOS/macOS calculators, handling all user interactions and API communication.
Backend API Documentation: Available at http://localhost:8080/calculator-api-1.0
ROLE AND RESPONSIBILITY
You are acting as: Frontend Developer (React/TypeScript)
Technical stack:

React 18+ with TypeScript
Vite as build tool
Tailwind CSS for styling
Built-in React hooks (useState, useReducer, useEffect, useCallback)
Axios for HTTP requests
Vitest + React Testing Library for unit/integration tests
Playwright for end-to-end tests

PRIMARY OBJECTIVE
Build a responsive, accessible calculator UI in React + TypeScript that consumes the backend API (http://localhost:8080/api/v1/*) to perform arithmetic operations. The interface should mirror iOS/macOS calculator design with smooth animations, input validation, error handling, and comprehensive test coverage.
TECHNICAL SPECIFICATIONS
Backend API Integration (Already Built)
API Documentation: http://localhost:8080/calculator-api-1.0
The backend exposes these endpoints:
POST /api/v1/add         - { operand1: number, operand2: number }
POST /api/v1/subtract    - { operand1: number, operand2: number }
POST /api/v1/multiply    - { operand1: number, operand2: number }
POST /api/v1/divide      - { operand1: number, operand2: number }
POST /api/v1/power       - { operand1: number, operand2: number }
POST /api/v1/sqrt        - { operand: number }
POST /api/v1/percentage  - { operand1: number, operand2: number }
Success Response: { result: number, operation: string, timestamp: string }
Error Response: { errorCode: string, message: string, details?: string, timestamp: string }
Error Codes to Handle:

CALC_001: Division by zero
CALC_002: Invalid operand (NaN, Infinity)
CALC_003: Negative number for square root
CALC_004: Numerical overflow/underflow
CALC_005: Invalid percentage value
CALC_006: Validation error

Note: For detailed API specifications, schema definitions, and examples, refer to the interactive documentation at http://localhost:8080/calculator-api-1.0 once the backend service is running.
Component Architecture
src/
├── components/
│   ├── Calculator/
│   │   ├── Calculator.tsx          // Main container component
│   │   ├── Calculator.test.tsx
│   │   ├── Display.tsx             // Result display
│   │   ├── Display.test.tsx
│   │   ├── Keypad.tsx              // Button grid
│   │   ├── Keypad.test.tsx
│   │   ├── Button.tsx              // Individual button
│   │   └── Button.test.tsx
│   ├── ErrorBoundary/
│   │   └── ErrorBoundary.tsx       // Global error handling
│   └── Loading/
│       └── Spinner.tsx             // Loading state
├── hooks/
│   ├── useCalculator.ts            // Main calculator logic hook
│   ├── useCalculator.test.ts
│   └── useApi.ts                   // API communication hook
├── services/
│   ├── calculatorApi.ts            // Axios API client
│   └── calculatorApi.test.ts
├── types/
│   ├── calculator.types.ts         // TypeScript interfaces
│   └── api.types.ts
├── utils/
│   ├── formatNumber.ts             // Number formatting utilities
│   ├── formatNumber.test.ts
│   └── validation.ts               // Input validation
├── App.tsx
├── App.test.tsx
├── main.tsx
└── index.css                       // Tailwind imports
TypeScript Interfaces
typescript// types/calculator.types.ts
export type Operation = 
  | 'add' 
  | 'subtract' 
  | 'multiply' 
  | 'divide' 
  | 'power' 
  | 'sqrt' 
  | 'percentage';

export type ButtonType = 
  | 'number' 
  | 'operator' 
  | 'function' 
  | 'clear' 
  | 'equals';

export interface CalculatorState {
  display: string;
  currentValue: number | null;
  previousValue: number | null;
  operation: Operation | null;
  waitingForOperand: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ButtonConfig {
  label: string;
  value: string;
  type: ButtonType;
  gridColumn?: string;
  className?: string;
}

// types/api.types.ts
export interface BinaryOperationRequest {
  operand1: number;
  operand2: number;
}

export interface UnaryOperationRequest {
  operand: number;
}

export interface CalculationResponse {
  result: number;
  operation: string;
  timestamp: string;
}

export interface ErrorResponse {
  errorCode: string;
  message: string;
  details?: string;
  timestamp: string;
}
State Management with useReducer
typescript// hooks/useCalculator.ts
type CalculatorAction =
  | { type: 'INPUT_DIGIT'; payload: string }
  | { type: 'INPUT_DECIMAL' }
  | { type: 'SET_OPERATION'; payload: Operation }
  | { type: 'CALCULATE_RESULT' }
  | { type: 'CLEAR' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_RESULT'; payload: number }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'PERCENTAGE' }
  | { type: 'TOGGLE_SIGN' };

function calculatorReducer(
  state: CalculatorState, 
  action: CalculatorAction
): CalculatorState {
  // Implement state transitions
}

export function useCalculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);
  const { executeOperation } = useApi();

  const handleCalculate = useCallback(async () => {
    // Call API and update state
  }, [state, executeOperation]);

  return { state, dispatch, handleCalculate };
}
API Service Layer
typescript// services/calculatorApi.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
});

export const calculatorApi = {
  add: (operand1: number, operand2: number) => 
    apiClient.post<CalculationResponse>('/add', { operand1, operand2 }),
  
  subtract: (operand1: number, operand2: number) =>
    apiClient.post<CalculationResponse>('/subtract', { operand1, operand2 }),
  
  multiply: (operand1: number, operand2: number) =>
    apiClient.post<CalculationResponse>('/multiply', { operand1, operand2 }),
  
  divide: (operand1: number, operand2: number) =>
    apiClient.post<CalculationResponse>('/divide', { operand1, operand2 }),
  
  power: (operand1: number, operand2: number) =>
    apiClient.post<CalculationResponse>('/power', { operand1, operand2 }),
  
  sqrt: (operand: number) =>
    apiClient.post<CalculationResponse>('/sqrt', { operand }),
  
  percentage: (operand1: number, operand2: number) =>
    apiClient.post<CalculationResponse>('/percentage', { operand1, operand2 }),
};
```

#### UI Design Specifications (iOS/macOS Style)

**Color Palette** (Tailwind classes):
- Background: `bg-gray-900` (dark mode) / `bg-gray-100` (light mode)
- Display: `bg-gray-800 text-white text-right` (dark) / `bg-white text-gray-900` (light)
- Number buttons: `bg-gray-700 hover:bg-gray-600` (dark) / `bg-gray-200 hover:bg-gray-300` (light)
- Operator buttons: `bg-orange-500 hover:bg-orange-600 text-white`
- Function buttons: `bg-gray-500 hover:bg-gray-400`
- Equals button: `bg-orange-500 hover:bg-orange-600` with emphasis

**Layout**:
- Grid layout: 4 columns × 5 rows for standard buttons
- Display at top with large text (text-5xl for result, text-xl for operation)
- Rounded buttons with shadow: `rounded-full shadow-lg`
- Button size: `h-20 w-20` on desktop, `h-16 w-16` on mobile
- Spacing: `gap-3` between buttons
- Responsive: Stack vertically on mobile (<640px), centered on desktop

**Button Layout** (iOS style):
```
[  Display showing result (right-aligned)  ]
[  Previous operation (small, gray)        ]

[ AC ] [ +/- ] [  %  ] [  ÷  ]
[  7 ] [  8  ] [  9  ] [  ×  ]
[  4 ] [  5  ] [  6  ] [  −  ]
[  1 ] [  2  ] [  3  ] [  +  ]
[     0      ] [  .  ] [  =  ]
```

Additional advanced buttons row (optional):
```
[ x² ] [ √  ] [ xʸ ]
Animations (Tailwind):

Button press: active:scale-95 transition-transform duration-75
Loading state: Spinning indicator over display
Error shake: animate-shake (custom animation)
Result fade-in: animate-fadeIn (custom animation)

Input Validation Rules
Client-side validation before API call:

Maximum 15 digits in display
Only one decimal point allowed
Prevent multiple consecutive operators
Validate division by zero before API call (show error immediately)
Validate negative sqrt before API call
Sanitize input: strip non-numeric characters except decimal

Error Display:

Show error message in red text below display
Auto-clear error after 3 seconds or on next input
Map backend error codes to user-friendly messages:

CALC_001: "Cannot divide by zero"
CALC_002: "Invalid number"
CALC_003: "Cannot calculate square root of negative number"
CALC_004: "Number too large"
CALC_005: "Invalid percentage"
CALC_006: "Invalid input"
Network errors: "Unable to connect to server"



ACCEPTANCE CRITERIA

✅ All 7 operations (add, subtract, multiply, divide, power, sqrt, percentage) work correctly
✅ Display updates in real-time as user types
✅ Calculator handles decimal numbers correctly
✅ Division by zero shows error message without crashing
✅ Square root of negative number shows error message
✅ Loading spinner displays during API calls
✅ Responsive layout works on mobile (320px) to desktop (1920px)
✅ Keyboard input supported (numbers, operators, Enter for equals, Escape for clear)
✅ Error messages are user-friendly and auto-dismiss
✅ Unit tests achieve minimum 80% code coverage
✅ E2E tests cover critical user flows
✅ Accessibility: ARIA labels, keyboard navigation, screen reader support

CRITICAL TEST CASES
Unit Tests (Vitest + React Testing Library)
useCalculator hook tests:
typescriptdescribe('useCalculator', () => {
  it('should initialize with correct default state', () => {});
  it('should handle digit input correctly', () => {});
  it('should handle decimal point input', () => {});
  it('should prevent multiple decimal points', () => {});
  it('should handle clear (AC) correctly', () => {});
  it('should handle sign toggle (+/-)', () => {});
  it('should set operation correctly', () => {});
  it('should calculate addition via API', async () => {});
  it('should handle division by zero error', async () => {});
  it('should handle API network errors', async () => {});
});
Calculator component tests:
typescriptdescribe('Calculator', () => {
  it('renders without crashing', () => {});
  it('displays initial value of 0', () => {});
  it('updates display when number buttons clicked', () => {});
  it('performs addition correctly', async () => {});
  it('performs subtraction correctly', async () => {});
  it('performs multiplication correctly', async () => {});
  it('performs division correctly', async () => {});
  it('shows error for division by zero', async () => {});
  it('clears display when AC pressed', () => {});
  it('supports keyboard input', () => {});
});
API service tests:
typescriptdescribe('calculatorApi', () => {
  it('should call /add endpoint with correct payload', async () => {});
  it('should handle successful response', async () => {});
  it('should handle 400 error response', async () => {});
  it('should handle network timeout', async () => {});
});
E2E Tests (Playwright)
typescripttest.describe('Calculator E2E', () => {
  test('should perform basic addition', async ({ page }) => {
    // 5 + 3 = 8
  });
  
  test('should handle decimal numbers', async ({ page }) => {
    // 3.14 + 2.86 = 6
  });
  
  test('should show error for division by zero', async ({ page }) => {
    // 10 ÷ 0 = Error
  });
  
  test('should clear calculator with AC', async ({ page }) => {});
  
  test('should support keyboard input', async ({ page }) => {});
  
  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });
});
IMPLEMENTATION STEPS
Step 1: Project Setup

Initialize Vite project: npm create vite@latest calculator-frontend -- --template react-ts
Install dependencies:

bash   npm install axios
   npm install -D tailwindcss postcss autoprefixer
   npm install -D vitest @vitest/ui jsdom
   npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
   npm install -D @playwright/test

Configure Tailwind CSS (tailwind.config.js, postcss.config.js)
Configure Vitest (vitest.config.ts)
Configure Playwright (playwright.config.ts)
Set up environment variables (.env, .env.local)

Step 2: Type Definitions

Create types/calculator.types.ts with all calculator-related types
Create types/api.types.ts with API request/response types
Ensure strict TypeScript configuration (strict: true in tsconfig.json)

Step 3: API Service Layer

Implement services/calculatorApi.ts with Axios client
Add request/response interceptors for error handling
Write unit tests for API service
Add environment variable for API base URL

Step 4: Custom Hooks

Implement useApi hook for API calls with loading/error states
Implement useCalculator hook with useReducer for state management
Write comprehensive unit tests for both hooks
Add error handling and edge case coverage

Step 5: UI Components

Create Button component with Tailwind styling and types
Create Display component with number formatting
Create Keypad component with button grid layout
Create Calculator main component connecting all pieces
Create ErrorBoundary for React error handling
Add Spinner loading component

Step 6: Styling and Responsiveness

Implement iOS-style design with Tailwind utilities
Add custom animations in index.css:

css   @keyframes shake {
     0%, 100% { transform: translateX(0); }
     25% { transform: translateX(-10px); }
     75% { transform: translateX(10px); }
   }

Test responsive breakpoints (mobile, tablet, desktop)
Add dark mode support (optional but recommended)

Step 7: Keyboard Support

Add useEffect in Calculator component for keyboard listeners
Map keys: 0-9, +, -, *, /, Enter (=), Escape (AC), . (decimal)
Test keyboard navigation and accessibility

Step 8: Testing

Write unit tests for all components (80%+ coverage)
Write unit tests for hooks and utilities
Write E2E tests for critical user flows
Generate coverage report: npm run test:coverage
Run E2E tests: npm run test:e2e

Step 9: Documentation

Create comprehensive README with:

Prerequisites (Node.js version, backend running)
Installation steps
Running the app (npm run dev)
Running tests (npm test, npm run test:e2e)
Environment variables
Backend API documentation link: http://localhost:8080/calculator-api-1.0
Architecture overview
Component hierarchy diagram
API integration details


Add JSDoc comments to complex functions
Include screenshots of calculator UI

CONFIGURATION EXAMPLES
vite.config.ts:
typescriptimport { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
});
tailwind.config.js:
javascriptexport default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        shake: 'shake 0.3s ease-in-out',
        fadeIn: 'fadeIn 0.2s ease-in',
      },
    },
  },
  plugins: [],
};
```

**.env.example**:
```
VITE_API_URL=http://localhost:8080/api/v1
VITE_API_DOCS_URL=http://localhost:8080/calculator-api-1.0
package.json scripts:
json{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "lint": "eslint src --ext ts,tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx}\""
  }
}
DELIVERABLES CHECKLIST

 React + TypeScript calculator app with iOS-style UI
 Full API integration with all 7 backend endpoints
 State management using useReducer hook
 Tailwind CSS styling with responsive design
 Comprehensive error handling and user feedback
 Loading states during API calls
 Keyboard navigation support
 Unit tests with 80%+ coverage (Vitest + RTL)
 E2E tests covering critical flows (Playwright)
 README with setup instructions, architecture docs, and API documentation link
 Environment configuration for different API URLs
 Accessibility features (ARIA labels, keyboard support)

SUCCESS VALIDATION
Run these commands to verify completion:
bash# Install dependencies
npm install

# Run development server
npm run dev
# App should open at http://localhost:3000

# Run unit tests with coverage
npm run test:coverage
# Coverage should be 80%+

# Run E2E tests
npm run test:e2e
# All tests should pass

# Build for production
npm run build
# Should create optimized build in dist/

# Manual testing checklist:
# ✅ Click 5 + 3 = → Shows 8
# ✅ Click 10 ÷ 0 = → Shows error "Cannot divide by zero"
# ✅ Click √ then -4 → Shows error "Cannot calculate square root..."
# ✅ Type "9*9=" on keyboard → Shows 81
# ✅ Resize browser to 375px → Layout adapts to mobile
# ✅ Press AC → Clears display
# ✅ Network disconnect → Shows "Unable to connect to server"
INTEGRATION WITH BACKEND
Ensure the backend is running:
bash# In backend directory
./gradlew run
# Should start on http://localhost:8080

# Verify API documentation is accessible
# Open http://localhost:8080/calculator-api-1.0 in browser
Test full-stack integration:
bash# In frontend directory
npm run dev

# Open http://localhost:3000
# Perform calculations - should hit backend API
# Check browser DevTools Network tab - should see POST requests to localhost:8080
# Reference API docs at http://localhost:8080/calculator-api-1.0 for troubleshooting
REFERENCES

Backend API Documentation: http://localhost:8080/calculator-api-1.0 (interactive Swagger/OpenAPI docs)
Backend Source: Refer to backend repository for detailed implementation
API Base URL: http://localhost:8080/api/v1