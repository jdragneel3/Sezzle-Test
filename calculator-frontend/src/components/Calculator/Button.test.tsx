import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="5" type="number" onClick={() => {}} />)
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button label="AC" type="clear" onClick={onClick} />)
    await userEvent.click(screen.getByRole('button', { name: 'AC' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applies type-based styling', () => {
    render(<Button label="+" type="operator" onClick={() => {}} />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveClass('bg-orange-500')
  })
})
