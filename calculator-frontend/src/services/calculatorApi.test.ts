import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('axios', async (importOriginal) => {
  const postMock = vi.fn()
  const actual = await importOriginal<typeof import('axios')>()
  return {
    default: {
      ...actual,
      create: () => ({
        post: postMock,
      }),
    },
    __postMock: postMock,
  }
})

const getCalculatorApi = () => import('./calculatorApi').then((m) => m.calculatorApi)
const getPostMock = (): Promise<ReturnType<typeof vi.fn> | undefined> =>
  import('axios').then((m: unknown) => (m as { __postMock?: ReturnType<typeof vi.fn> }).__postMock)

describe('calculatorApi', () => {
  beforeEach(async () => {
    const mock = await getPostMock()
    mock?.mockReset()
  })

  it('should call /add endpoint with correct payload', async () => {
    const postMock = await getPostMock()
    postMock?.mockResolvedValue({
      data: { result: 3, operation: 'ADD', timestamp: '2024-01-01T00:00:00Z' },
    })
    const calculatorApi = await getCalculatorApi()
    await calculatorApi.add(1, 2)
    expect(postMock).toHaveBeenCalledWith('/add', { operand1: 1, operand2: 2 })
  })

  it('should handle successful response', async () => {
    const postMock = await getPostMock()
    postMock?.mockResolvedValue({
      data: { result: 5, operation: 'ADD', timestamp: '2024-01-01T00:00:00Z' },
    })
    const calculatorApi = await getCalculatorApi()
    const response = await calculatorApi.add(2, 3)
    expect(response.data).toEqual({
      result: 5,
      operation: 'ADD',
      timestamp: '2024-01-01T00:00:00Z',
    })
  })

  it('should handle 400 error response', async () => {
    const postMock = await getPostMock()
    postMock?.mockRejectedValue({
      response: {
        status: 400,
        data: {
          errorCode: 'CALC_001',
          message: 'Division by zero',
          timestamp: '2024-01-01T00:00:00Z',
        },
      },
    })
    const calculatorApi = await getCalculatorApi()
    await expect(calculatorApi.divide(1, 0)).rejects.toMatchObject({
      response: {
        status: 400,
        data: { errorCode: 'CALC_001', message: 'Division by zero' },
      },
    })
  })

  it('should handle network timeout', async () => {
    const postMock = await getPostMock()
    postMock?.mockRejectedValue(new Error('timeout of 5000ms exceeded'))
    const calculatorApi = await getCalculatorApi()
    await expect(calculatorApi.add(1, 2)).rejects.toThrow('timeout')
  })

  it('should call subtract with correct payload', async () => {
    const postMock = await getPostMock()
    postMock?.mockResolvedValue({
      data: { result: 2, operation: 'SUBTRACT', timestamp: '2024-01-01T00:00:00Z' },
    })
    const api = await getCalculatorApi()
    await api.subtract(5, 3)
    expect(postMock).toHaveBeenCalledWith('/subtract', { operand1: 5, operand2: 3 })
  })

  it('should call multiply and sqrt', async () => {
    const postMock = await getPostMock()
    postMock?.mockResolvedValue({
      data: { result: 1, operation: 'MULTIPLY', timestamp: '' },
    })
    const api = await getCalculatorApi()
    await api.multiply(1, 1)
    expect(postMock).toHaveBeenCalledWith('/multiply', { operand1: 1, operand2: 1 })
    postMock?.mockResolvedValue({ data: { result: 2, operation: 'SQRT', timestamp: '' } })
    await api.sqrt(4)
    expect(postMock).toHaveBeenCalledWith('/sqrt', { operand: 4 })
  })

  it('should call power and percentage', async () => {
    const postMock = await getPostMock()
    postMock?.mockResolvedValue({
      data: { result: 1, operation: 'POWER', timestamp: '' },
    })
    const api = await getCalculatorApi()
    await api.power(2, 0)
    expect(postMock).toHaveBeenCalledWith('/power', { operand1: 2, operand2: 0 })
    postMock?.mockResolvedValue({ data: { result: 50, operation: 'PERCENTAGE', timestamp: '' } })
    await api.percentage(200, 25)
    expect(postMock).toHaveBeenCalledWith('/percentage', { operand1: 200, operand2: 25 })
  })
})
