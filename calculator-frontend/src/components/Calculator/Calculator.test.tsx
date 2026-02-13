import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Calculator } from './Calculator'

const mockDispatch = vi.fn()
const mockHandleCalculate = vi.fn()
const mockHandleSqrt = vi.fn()

const initialState = {
  display: '0',
  currentValue: null as number | null,
  previousValue: null as number | null,
  operation: null as string | null,
  waitingForOperand: false,
  isLoading: false,
  error: null as string | null,
}
let mockState = { ...initialState }

vi.mock('../../hooks/useCalculator', () => ({
  useCalculator: () => ({
    state: mockState,
    dispatch: mockDispatch,
    handleCalculate: mockHandleCalculate,
    handleSqrt: mockHandleSqrt,
  }),
}))

describe('Calculator', () => {
  beforeEach(() => {
    mockState = { ...initialState }
    mockDispatch.mockClear()
    mockHandleCalculate.mockClear()
    mockHandleSqrt.mockClear()
  })

  it('renders without crashing', () => {
    render(<Calculator />)
    expect(screen.getByRole('application', { name: 'Calculator' })).toBeInTheDocument()
  })

  it('displays initial value of 0', () => {
    render(<Calculator />)
    expect(screen.getByLabelText(/display: 0/i)).toBeInTheDocument()
  })

  it('dispatches INPUT_DIGIT when number button clicked', async () => {
    render(<Calculator />)
    await userEvent.click(screen.getByRole('button', { name: '5' }))
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'INPUT_DIGIT', payload: '5' })
  })

  it('dispatches CLEAR when AC pressed', async () => {
    render(<Calculator />)
    await userEvent.click(screen.getByRole('button', { name: 'AC' }))
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CLEAR' })
  })

  it('dispatches INPUT_DIGIT on keyboard number', async () => {
    render(<Calculator />)
    await userEvent.keyboard('5')
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'INPUT_DIGIT', payload: '5' })
  })

  it('dispatches CLEAR on Escape key', () => {
    render(<Calculator />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CLEAR' })
  })

  it('shows Spinner when isLoading', () => {
    mockState.isLoading = true
    render(<Calculator />)
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })

  it('shows error when state has error', async () => {
    function Wrapper() {
      const [, setR] = useState(0)
      return (
        <>
          <button type="button" onClick={() => { mockState.error = 'Cannot divide by zero'; setR((r) => r + 1) }}>
            set error
          </button>
          <Calculator />
        </>
      )
    }
    render(<Wrapper />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'set error' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Cannot divide by zero')
  })
})
