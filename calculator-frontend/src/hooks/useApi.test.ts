import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useApi } from './useApi'

vi.mock('../services/calculatorApi', () => ({
  calculatorApi: {
    add: vi.fn(),
    subtract: vi.fn(),
    multiply: vi.fn(),
    divide: vi.fn(),
    power: vi.fn(),
    sqrt: vi.fn(),
    percentage: vi.fn(),
  },
}))

describe('useApi', () => {
  beforeEach(async () => {
    const { calculatorApi } = await import('../services/calculatorApi')
    vi.mocked(calculatorApi.add).mockReset()
    vi.mocked(calculatorApi.subtract).mockReset()
    vi.mocked(calculatorApi.multiply).mockReset()
    vi.mocked(calculatorApi.divide).mockReset()
    vi.mocked(calculatorApi.power).mockReset()
    vi.mocked(calculatorApi.sqrt).mockReset()
    vi.mocked(calculatorApi.percentage).mockReset()
  })

  it('executeOperation add returns result', async () => {
    const { calculatorApi } = await import('../services/calculatorApi')
    vi.mocked(calculatorApi.add).mockResolvedValue({
      data: { result: 10, operation: 'ADD', timestamp: '' },
    })
    const { result } = renderHook(() => useApi())
    const res = await result.current.executeOperation('add', {
      operand1: 3,
      operand2: 7,
    })
    expect(res).toBe(10)
    expect(calculatorApi.add).toHaveBeenCalledWith(3, 7)
  })

  it('executeOperation sqrt returns result', async () => {
    const { calculatorApi } = await import('../services/calculatorApi')
    vi.mocked(calculatorApi.sqrt).mockResolvedValue({
      data: { result: 3, operation: 'SQRT', timestamp: '' },
    })
    const { result } = renderHook(() => useApi())
    const res = await result.current.executeOperation('sqrt', { operand: 9 })
    expect(res).toBe(3)
    expect(calculatorApi.sqrt).toHaveBeenCalledWith(9)
  })

  it('executeOperation throws user-friendly message on API error', async () => {
    const { calculatorApi } = await import('../services/calculatorApi')
    vi.mocked(calculatorApi.add).mockRejectedValue({
      response: { data: { errorCode: 'CALC_001', message: 'Division by zero' } },
    })
    const { result } = renderHook(() => useApi())
    await expect(
      result.current.executeOperation('add', { operand1: 1, operand2: 0 })
    ).rejects.toThrow('Cannot divide by zero')
  })

  it('executeOperation multiply', async () => {
    const { calculatorApi } = await import('../services/calculatorApi')
    vi.mocked(calculatorApi.multiply).mockResolvedValue({
      data: { result: 12, operation: 'MULTIPLY', timestamp: '' },
    })
    const { result } = renderHook(() => useApi())
    const res = await result.current.executeOperation('multiply', {
      operand1: 3,
      operand2: 4,
    })
    expect(res).toBe(12)
  })

  it('executeOperation divide', async () => {
    const { calculatorApi } = await import('../services/calculatorApi')
    vi.mocked(calculatorApi.divide).mockResolvedValue({
      data: { result: 2, operation: 'DIVIDE', timestamp: '' },
    })
    const { result } = renderHook(() => useApi())
    const res = await result.current.executeOperation('divide', {
      operand1: 6,
      operand2: 3,
    })
    expect(res).toBe(2)
  })

  it('executeOperation power', async () => {
    const { calculatorApi } = await import('../services/calculatorApi')
    vi.mocked(calculatorApi.power).mockResolvedValue({
      data: { result: 8, operation: 'POWER', timestamp: '' },
    })
    const { result } = renderHook(() => useApi())
    const res = await result.current.executeOperation('power', {
      operand1: 2,
      operand2: 3,
    })
    expect(res).toBe(8)
  })

  it('executeOperation percentage', async () => {
    const { calculatorApi } = await import('../services/calculatorApi')
    vi.mocked(calculatorApi.percentage).mockResolvedValue({
      data: { result: 25, operation: 'PERCENTAGE', timestamp: '' },
    })
    const { result } = renderHook(() => useApi())
    const res = await result.current.executeOperation('percentage', {
      operand1: 100,
      operand2: 25,
    })
    expect(res).toBe(25)
  })
})
