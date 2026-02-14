import { describe, it, expect } from 'vitest'
import { formatNumber, formatResultForDisplay } from './formatNumber'

describe('formatNumber', () => {
  it('formats integer', () => {
    expect(formatNumber(42)).toBe('42')
    expect(formatNumber('42')).toBe('42')
  })

  it('formats zero', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber('0')).toBe('0')
  })

  it('strips trailing zeros after decimal', () => {
    expect(formatNumber('3.140')).toBe('3.14')
    expect(formatNumber(3.14)).toBe('3.14')
  })

  it('handles negative numbers', () => {
    expect(formatNumber(-5)).toBe('-5')
    expect(formatNumber('-5.00')).toBe('-5')
  })

  it('handles invalid input', () => {
    expect(formatNumber('')).toBe('0')
    expect(formatNumber('abc')).toBe('0')
  })

  it('handles decimal point only', () => {
    expect(formatNumber('.')).toBe('0')
  })
})

describe('formatResultForDisplay', () => {
  it('formats large numbers without scientific notation when possible', () => {
    expect(formatResultForDisplay(1e15)).toBe('1000000000000000')
    expect(formatResultForDisplay(1e16)).toBe('10000000000000000')
    expect(formatResultForDisplay(-1e15)).toBe('-1000000000000000')
  })

  it('uses scientific notation for very large numbers', () => {
    const result = formatResultForDisplay(1e25)
    expect(result).toMatch(/^1\.0000e\+25$/)
  })
})
