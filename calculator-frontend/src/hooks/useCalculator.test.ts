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

  it('TOGGLE_SIGN when display is 0 leaves display as 0', () => {
    const { result } = renderHook(() => useCalculator())
    expect(result.current.state.display).toBe('0')
    act(() => result.current.dispatch({ type: 'TOGGLE_SIGN' }))
    expect(result.current.state.display).toBe('0')
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

  it('PERCENTAGE action sets operation to percentage', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.dispatch({ type: 'INPUT_DIGIT', payload: '5' }))
    act(() => result.current.dispatch({ type: 'PERCENTAGE' }))
    expect(result.current.state.operation).toBe('percentage')
    expect(result.current.state.previousValue).toBe(5)
    expect(result.current.state.waitingForOperand).toBe(true)
  })

  it('CALCULATE_RESULT returns state unchanged (no-op)', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.dispatch({ type: 'INPUT_DIGIT', payload: '7' }))
    const before = result.current.state
    act(() => result.current.dispatch({ type: 'CALCULATE_RESULT' }))
    expect(result.current.state).toEqual(before)
  })

  it('TOGGLE_SIGN when error is set returns state unchanged', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.dispatch({ type: 'SET_ERROR', payload: 'Some error' }))
    const before = result.current.state
    act(() => result.current.dispatch({ type: 'TOGGLE_SIGN' }))
    expect(result.current.state).toEqual(before)
  })

  it('BACKSPACE when error is set (not digit limit) returns state unchanged', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.dispatch({ type: 'INPUT_DIGIT', payload: '5' }))
    act(() => result.current.dispatch({ type: 'SET_ERROR', payload: 'Division by zero' }))
    const before = result.current.state
    act(() => result.current.dispatch({ type: 'BACKSPACE' }))
    expect(result.current.state).toEqual(before)
  })

  it('percentage calculation via API', async () => {
    mockExecuteOperation.mockResolvedValue(25)
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.dispatch({ type: 'INPUT_DIGIT', payload: '1' }))
    act(() => result.current.dispatch({ type: 'INPUT_DIGIT', payload: '0' }))
    act(() => result.current.dispatch({ type: 'INPUT_DIGIT', payload: '0' }))
    act(() => result.current.dispatch({ type: 'SET_OPERATION', payload: 'divide' }))
    act(() => result.current.dispatch({ type: 'INPUT_DIGIT', payload: '2' }))
    act(() => result.current.dispatch({ type: 'INPUT_DIGIT', payload: '5' }))
    act(() => result.current.dispatch({ type: 'PERCENTAGE' }))
    expect(result.current.state.operation).toBe('percentage')
    await act(async () => {
      await result.current.handleCalculate()
    })
    expect(mockExecuteOperation).toHaveBeenCalledWith('percentage', expect.any(Object))
    expect(result.current.state.display).toBe('25')
    expect(result.current.state.isLoading).toBe(false)
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

  describe('MAX_DIGITS (15) limit', () => {
    it('blocks 16th digit and shows error message', () => {
      const { result } = renderHook(() => useCalculator())
      const fifteenDigits = '123456789012345'
      fifteenDigits.split('').forEach((d) => {
        act(() => result.current.dispatch({ type: 'INPUT_DIGIT', payload: d }))
      })
      expect(result.current.state.display).toBe(fifteenDigits)
      act(() => result.current.dispatch({ type: 'INPUT_DIGIT', payload: '6' }))
      expect(result.current.state.display).toBe(fifteenDigits)
      expect(result.current.state.error).toBe('Maximum 15 digits allowed')
    })

    it('blocks decimal point when already at 15 digits', () => {
      const { result } = renderHook(() => useCalculator())
      const fifteenDigits = '123456789012345'
      fifteenDigits.split('').forEach((d) => {
        act(() => result.current.dispatch({ type: 'INPUT_DIGIT', payload: d }))
      })
      act(() => result.current.dispatch({ type: 'INPUT_DECIMAL' }))
      expect(result.current.state.display).toBe(fifteenDigits)
      expect(result.current.state.error).toBe('Maximum 15 digits allowed')
    })

    it('counts digits after decimal toward limit', () => {
      const { result } = renderHook(() => useCalculator())
      ;'12345678901234.'.split('').forEach((c) => {
        if (c === '.') {
          act(() => result.current.dispatch({ type: 'INPUT_DECIMAL' }))
        } else {
          act(() => result.current.dispatch({ type: 'INPUT_DIGIT', payload: c }))
        }
      })
      expect(result.current.state.display).toBe('12345678901234.')
      act(() => result.current.dispatch({ type: 'INPUT_DIGIT', payload: '5' }))
      expect(result.current.state.display).toBe('12345678901234.5')
      act(() => result.current.dispatch({ type: 'INPUT_DIGIT', payload: '6' }))
      expect(result.current.state.display).toBe('12345678901234.5')
      expect(result.current.state.error).toBe('Maximum 15 digits allowed')
    })

    it('backspace clears digit limit error and allows editing', () => {
      const { result } = renderHook(() => useCalculator())
      '123456789012345'.split('').forEach((d) => {
        act(() => result.current.dispatch({ type: 'INPUT_DIGIT', payload: d }))
      })
      act(() => result.current.dispatch({ type: 'INPUT_DIGIT', payload: '6' }))
      expect(result.current.state.error).toBe('Maximum 15 digits allowed')
      act(() => result.current.dispatch({ type: 'BACKSPACE' }))
      expect(result.current.state.display).toBe('12345678901234')
      expect(result.current.state.error).toBeNull()
    })
  })
})
