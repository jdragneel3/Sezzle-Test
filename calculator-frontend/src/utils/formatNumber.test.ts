import { describe, it, expect } from 'vitest'
import { formatNumber } from './formatNumber'

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
