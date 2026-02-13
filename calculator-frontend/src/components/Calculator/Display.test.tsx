import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Display } from './Display'

describe('Display', () => {
  it('renders main value', () => {
    render(<Display main="123" />)
    expect(screen.getByText('123')).toBeInTheDocument()
  })

  it('renders secondary when provided', () => {
    render(<Display main="8" secondary="5 + 3" />)
    expect(screen.getByText('5 + 3')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
  })

  it('has aria-live for accessibility', () => {
    render(<Display main="0" />)
    expect(screen.getByLabelText(/display/i)).toHaveAttribute('aria-live', 'polite')
  })
})
