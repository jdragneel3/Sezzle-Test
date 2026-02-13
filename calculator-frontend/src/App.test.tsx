import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

vi.mock('./components/Calculator/Calculator', () => ({
  Calculator: () => <div data-testid="calculator">Calculator</div>,
}))

describe('App', () => {
  it('renders Calculator', () => {
    render(<App />)
    expect(screen.getByTestId('calculator')).toBeInTheDocument()
  })
})
