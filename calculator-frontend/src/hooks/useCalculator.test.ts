import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCalculator } from './useCalculator'

const mockExecuteOperation = vi.fn()

vi.mock('./useApi', () => ({
  useApi: () => ({
    executeOperation: mockExecuteOperation,
  }),
}))

describe('useCalculator', () => {
  beforeEach(() => {
    mockExecuteOperation.mockReset()
  })

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useCalculator())
    expect(result.current.state).toMatchObject({
      display: '0',
      currentValue: null,
      previousValue: null,
      operation: null,
      waitingForOperand: false,
      isLoading: false,
      error: null,
    })
  })

  it('should handle digit input correctly', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => {
      result.current.dispatch({ type: 'INPUT_DIGIT', payload: '5' })
    })
    expect(result.current.state.display).toBe('5')
    act(() => {
      result.current.dispatch({ type: 'INPUT_DIGIT', payload: '3' })
    })
    expect(result.current.state.display).toBe('53')
  })

  it('should handle decimal point input', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => {
      result.current.dispatch({ type: 'INPUT_DIGIT', payload: '3' })
    })
    act(() => {
      result.current.dispatch({ type: 'INPUT_DECIMAL' })
    })
    expect(result.current.state.display).toBe('3.')
    act(() => {
      result.current.dispatch({ type: 'INPUT_DIGIT', payload: '1' })
    })
    expect(result.current.state.display).toBe('3.1')
  })

  it('should prevent multiple decimal points', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => {
      result.current.dispatch({ type: 'INPUT_DIGIT', payload: '1' })
    })
    act(() => {
      result.current.dispatch({ type: 'INPUT_DECIMAL' })
    })
    act(() => {
      result.current.dispatch({ type: 'INPUT_DECIMAL' })
    })
    expect(result.current.state.display).toBe('1.')
  })

  it('should handle clear (AC) correctly', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => {
      result.current.dispatch({ type: 'INPUT_DIGIT', payload: '5' })
    })
    act(() => {
      result.current.dispatch({ type: 'CLEAR' })
    })
    expect(result.current.state).toMatchObject({
      display: '0',
      currentValue: null,
      previousValue: null,
      operation: null,
    })
  })

  it('should handle sign toggle (+/-)', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => {
      result.current.dispatch({ type: 'INPUT_DIGIT', payload: '5' })
    })
    act(() => {
      result.current.dispatch({ type: 'TOGGLE_SIGN' })
    })
    expect(result.current.state.display).toBe('-5')
  })

  it('should set operation correctly', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => {
      result.current.dispatch({ type: 'INPUT_DIGIT', payload: '5' })
    })
    act(() => {
      result.current.dispatch({ type: 'SET_OPERATION', payload: 'add' })
    })
    expect(result.current.state.operation).toBe('add')
    expect(result.current.state.waitingForOperand).toBe(true)
  })

  it('should calculate addition via API', async () => {
    mockExecuteOperation.mockResolvedValue(8)
    const { result } = renderHook(() => useCalculator())
    act(() => {
      result.current.dispatch({ type: 'INPUT_DIGIT', payload: '5' })
    })
    act(() => {
      result.current.dispatch({ type: 'SET_OPERATION', payload: 'add' })
    })
    act(() => {
      result.current.dispatch({ type: 'INPUT_DIGIT', payload: '3' })
    })
    await act(async () => {
      await result.current.handleCalculate()
    })
    expect(result.current.state.display).toBe('8')
    expect(result.current.state.isLoading).toBe(false)
  })

  it('should handle division by zero error', async () => {
    const { result } = renderHook(() => useCalculator())
    act(() => {
      result.current.dispatch({ type: 'INPUT_DIGIT', payload: '1' })
    })
    act(() => {
      result.current.dispatch({ type: 'SET_OPERATION', payload: 'divide' })
    })
    act(() => {
      result.current.dispatch({ type: 'INPUT_DIGIT', payload: '0' })
    })
    await act(async () => {
      await result.current.handleCalculate()
    })
    expect(result.current.state.error).toBe('Cannot divide by zero')
    expect(result.current.state.isLoading).toBe(false)
  })

  it('should handle API network errors', async () => {
    mockExecuteOperation.mockRejectedValue(new Error('Unable to connect to server'))
    const { result } = renderHook(() => useCalculator())
    act(() => {
      result.current.dispatch({ type: 'INPUT_DIGIT', payload: '1' })
    })
    act(() => {
      result.current.dispatch({ type: 'SET_OPERATION', payload: 'add' })
    })
    act(() => {
      result.current.dispatch({ type: 'INPUT_DIGIT', payload: '2' })
    })
    await act(async () => {
      await result.current.handleCalculate()
    })
    expect(result.current.state.error).toBe('Unable to connect to server')
  })

  it('should handle sqrt via handleSqrt', async () => {
    mockExecuteOperation.mockResolvedValue(3)
    const { result } = renderHook(() => useCalculator())
    act(() => {
      result.current.dispatch({ type: 'INPUT_DIGIT', payload: '9' })
    })
    await act(async () => {
      await result.current.handleSqrt!()
    })
    expect(result.current.state.display).toBe('3')
  })
})
