import { describe, it, expect } from 'vitest'
import { getUserFriendlyErrorMessage } from './errorMessages'

describe('getUserFriendlyErrorMessage', () => {
  it('maps CALC_001 to Cannot divide by zero', () => {
    const err = { response: { data: { errorCode: 'CALC_001', message: 'x' } } }
    expect(getUserFriendlyErrorMessage(err)).toBe('Cannot divide by zero')
  })

  it('maps CALC_003 to sqrt message', () => {
    const err = { response: { data: { errorCode: 'CALC_003' } } }
    expect(getUserFriendlyErrorMessage(err)).toBe(
      'Cannot calculate square root of negative number'
    )
  })

  it('returns network message for Network Error', () => {
    expect(getUserFriendlyErrorMessage(new Error('Network Error'))).toBe(
      'Unable to connect to server'
    )
  })

  it('returns default for unknown', () => {
    expect(getUserFriendlyErrorMessage({})).toBe('Something went wrong')
  })
})
