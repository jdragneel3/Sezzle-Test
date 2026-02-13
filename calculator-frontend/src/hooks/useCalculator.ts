import { useReducer, useCallback } from 'react'
import type { CalculatorState, Operation } from '../types/calculator.types'
import { useApi } from './useApi'
import {
  isDivisionByZero,
  isNegativeForSqrt,
} from '../utils/validation'

const MAX_DIGITS = 15

export type CalculatorAction =
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
  | { type: 'TOGGLE_SIGN' }
  | { type: 'BACKSPACE' }

function digitCount(display: string): number {
  return display.replace(/[^0-9]/g, '').length
}

function parseDisplay(display: string): number {
  const n = parseFloat(display.replace(/,/g, ''))
  return Number.isNaN(n) ? 0 : n
}

const initialState: CalculatorState = {
  display: '0',
  currentValue: null,
  previousValue: null,
  operation: null,
  waitingForOperand: false,
  isLoading: false,
  error: null,
}

export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState {
  switch (action.type) {
    case 'CLEAR_ERROR':
      return { ...state, error: null }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }
    case 'SET_RESULT': {
      const result = action.payload
      const display =
        Number.isInteger(result) && Math.abs(result) < 1e15
          ? String(result)
          : String(result)
      return {
        ...state,
        display,
        currentValue: result,
        previousValue: null,
        operation: null,
        waitingForOperand: true,
        isLoading: false,
        error: null,
      }
    }
    case 'CLEAR':
      return initialState

    case 'INPUT_DIGIT': {
      if (state.error) {
        return calculatorReducer(
          { ...state, error: null },
          { type: 'INPUT_DIGIT', payload: action.payload }
        )
      }
      const digit = action.payload
      let newDisplay: string
      if (state.waitingForOperand) {
        newDisplay = digit === '0' ? '0' : digit
      } else {
        if (state.display === '0' && digit !== '0') {
          newDisplay = digit
        } else if (state.display === '0' && digit === '0') {
          newDisplay = '0'
        } else {
          newDisplay = state.display + digit
        }
      }
      if (digitCount(newDisplay) > MAX_DIGITS) return state
      return {
        ...state,
        display: newDisplay,
        waitingForOperand: false,
        currentValue: parseDisplay(newDisplay),
      }
    }

    case 'INPUT_DECIMAL': {
      if (state.error) {
        return calculatorReducer(
          { ...state, error: null },
          { type: 'INPUT_DECIMAL' }
        )
      }
      let newDisplay: string
      if (state.waitingForOperand) {
        newDisplay = '0.'
      } else if (state.display.includes('.')) {
        return state
      } else {
        newDisplay = state.display + '.'
      }
      return {
        ...state,
        display: newDisplay,
        waitingForOperand: false,
        currentValue: parseDisplay(newDisplay),
      }
    }

    case 'TOGGLE_SIGN': {
      if (state.error) return state
      const n = parseDisplay(state.display)
      const newDisplay = n === 0 ? '0' : String(-n)
      return {
        ...state,
        display: newDisplay,
        currentValue: -n,
      }
    }

    case 'BACKSPACE': {
      if (state.error) return state
      if (state.display === '0' || state.display.length <= 1) {
        return { ...state, display: '0', currentValue: 0 }
      }
      const next = state.display.slice(0, -1)
      const newDisplay = next === '' || next === '-' ? '0' : next
      return {
        ...state,
        display: newDisplay,
        currentValue: parseDisplay(newDisplay),
      }
    }

    case 'SET_OPERATION':
    case 'PERCENTAGE': {
      if (state.error) return state
      const op: Operation =
        action.type === 'PERCENTAGE' ? 'percentage' : action.payload
      const current = parseDisplay(state.display)
      if (
        state.operation !== null &&
        state.previousValue !== null &&
        !state.waitingForOperand
      ) {
        return {
          ...state,
          previousValue: current,
          operation: op,
          waitingForOperand: true,
        }
      }
      return {
        ...state,
        previousValue:
          state.waitingForOperand && state.previousValue !== null
            ? state.previousValue
            : current,
        operation: op,
        waitingForOperand: true,
      }
    }

    case 'CALCULATE_RESULT':
      return state

    default:
      return state
  }
}

export function useCalculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState)
  const { executeOperation } = useApi()

  const handleCalculate = useCallback(async () => {
    const op = state.operation
    if (!op) return
    dispatch({ type: 'CLEAR_ERROR' })
    const current = parseDisplay(state.display)
    if (op === 'sqrt') {
      if (isNegativeForSqrt(current)) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Cannot calculate square root of negative number',
        })
        return
      }
      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        const result = await executeOperation(op, { operand: current })
        dispatch({ type: 'SET_RESULT', payload: result })
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          payload: err instanceof Error ? err.message : 'Something went wrong',
        })
      }
      return
    }
    const prev = state.previousValue ?? current
    if (op === 'divide' && isDivisionByZero(current)) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Cannot divide by zero',
      })
      return
    }
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const result = await executeOperation(op, {
        operand1: prev,
        operand2: current,
      })
      dispatch({ type: 'SET_RESULT', payload: result })
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err instanceof Error ? err.message : 'Something went wrong',
      })
    }
  }, [state.operation, state.display, state.previousValue, executeOperation])

  const handleSqrt = useCallback(async () => {
    dispatch({ type: 'CLEAR_ERROR' })
    const current = parseDisplay(state.display)
    if (isNegativeForSqrt(current)) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Cannot calculate square root of negative number',
      })
      return
    }
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const result = await executeOperation('sqrt', { operand: current })
      dispatch({ type: 'SET_RESULT', payload: result })
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err instanceof Error ? err.message : 'Something went wrong',
      })
    }
  }, [state.display, executeOperation])

  return { state, dispatch, handleCalculate, handleSqrt }
}
