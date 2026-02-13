import { describe, it, expect } from 'vitest'
import {
  isDivisionByZero,
  isNegativeForSqrt,
  isPercentageOutOfRange,
} from './validation'

describe('validation', () => {
  describe('isDivisionByZero', () => {
    it('returns true for 0', () => {
      expect(isDivisionByZero(0)).toBe(true)
    })
    it('returns false for non-zero', () => {
      expect(isDivisionByZero(1)).toBe(false)
    })
  })

  describe('isNegativeForSqrt', () => {
    it('returns true for negative', () => {
      expect(isNegativeForSqrt(-1)).toBe(true)
    })
    it('returns false for zero or positive', () => {
      expect(isNegativeForSqrt(0)).toBe(false)
      expect(isNegativeForSqrt(4)).toBe(false)
    })
  })

  describe('isPercentageOutOfRange', () => {
    it('returns true for out of range', () => {
      expect(isPercentageOutOfRange(-1)).toBe(true)
      expect(isPercentageOutOfRange(101)).toBe(true)
    })
    it('returns false for 0-100', () => {
      expect(isPercentageOutOfRange(0)).toBe(false)
      expect(isPercentageOutOfRange(50)).toBe(false)
      expect(isPercentageOutOfRange(100)).toBe(false)
    })
  })
})
