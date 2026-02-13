import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Keypad } from './Keypad'

describe('Keypad', () => {
  const defaultProps = {
    onDigit: vi.fn(),
    onDecimal: vi.fn(),
    onClear: vi.fn(),
    onToggleSign: vi.fn(),
    onPercentage: vi.fn(),
    onOperation: vi.fn(),
    onEquals: vi.fn(),
  }

  it('renders digit buttons', () => {
    render(<Keypad {...defaultProps} />)
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '0' })).toBeInTheDocument()
  })

  it('calls onDigit when number clicked', async () => {
    render(<Keypad {...defaultProps} />)
    await userEvent.click(screen.getByRole('button', { name: '7' }))
    expect(defaultProps.onDigit).toHaveBeenCalledWith('7')
  })

  it('calls onClear when AC clicked', async () => {
    render(<Keypad {...defaultProps} />)
    await userEvent.click(screen.getByRole('button', { name: 'AC' }))
    expect(defaultProps.onClear).toHaveBeenCalled()
  })

  it('calls onOperation when operator clicked', async () => {
    render(<Keypad {...defaultProps} />)
    await userEvent.click(screen.getByRole('button', { name: '+' }))
    expect(defaultProps.onOperation).toHaveBeenCalledWith('add')
  })

  it('calls onEquals when = clicked', async () => {
    render(<Keypad {...defaultProps} />)
    await userEvent.click(screen.getByRole('button', { name: '=' }))
    expect(defaultProps.onEquals).toHaveBeenCalled()
  })

  it('renders sqrt and power when onSqrt and showExtraRow', async () => {
    const onSqrt = vi.fn()
    render(<Keypad {...defaultProps} onSqrt={onSqrt} showExtraRow />)
    expect(screen.getByRole('button', { name: '√' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'xʸ' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '√' }))
    expect(onSqrt).toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name: 'xʸ' }))
    expect(defaultProps.onOperation).toHaveBeenCalledWith('power')
  })

  it('calls correct handlers for all buttons', async () => {
    render(<Keypad {...defaultProps} />)
    await userEvent.click(screen.getByRole('button', { name: '÷' }))
    expect(defaultProps.onOperation).toHaveBeenCalledWith('divide')
    await userEvent.click(screen.getByRole('button', { name: '×' }))
    expect(defaultProps.onOperation).toHaveBeenCalledWith('multiply')
    await userEvent.click(screen.getByRole('button', { name: '−' }))
    expect(defaultProps.onOperation).toHaveBeenCalledWith('subtract')
    await userEvent.click(screen.getByRole('button', { name: '+' }))
    expect(defaultProps.onOperation).toHaveBeenCalledWith('add')
    await userEvent.click(screen.getByRole('button', { name: '.' }))
    expect(defaultProps.onDecimal).toHaveBeenCalled()
  })
})
