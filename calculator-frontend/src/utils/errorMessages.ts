import type { ErrorResponse } from '../types/api.types'

const ERROR_CODE_MAP: Record<string, string> = {
  CALC_001: 'Cannot divide by zero',
  CALC_002: 'Invalid number',
  CALC_003: 'Cannot calculate square root of negative number',
  CALC_004: 'Number too large',
  CALC_005: 'Invalid percentage',
  CALC_006: 'Invalid input',
}

export function getUserFriendlyErrorMessage(
  error: unknown,
  defaultMessage = 'Something went wrong'
): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as { response?: { data?: ErrorResponse } }
    const data = axiosError.response?.data
    if (data?.errorCode && ERROR_CODE_MAP[data.errorCode]) {
      return ERROR_CODE_MAP[data.errorCode]
    }
    if (data?.message) {
      return data.message
    }
  }
  if (error instanceof Error) {
    if (error.message.includes('timeout') || error.message.includes('Network')) {
      return 'Unable to connect to server'
    }
    return error.message
  }
  return defaultMessage
}
