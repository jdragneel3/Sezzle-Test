const MAX_DISPLAY_LENGTH = 18
const LARGE_NUMBER_THRESHOLD = 1e15

/**
 * Format a calculation result for display, avoiding scientific notation when possible.
 * For |value| >= 1e15, uses toLocaleString to show full digits up to ~1e21.
 */
export function formatResultForDisplay(value: number): string {
  if (!Number.isFinite(value)) return '0'
  const abs = Math.abs(value)
  if (abs < LARGE_NUMBER_THRESHOLD) {
    return Number.isInteger(value) ? String(value) : trimTrailingZeros(String(value))
  }
  const formatted = value.toLocaleString('en-US', {
    useGrouping: false,
    maximumFractionDigits: 10,
    minimumFractionDigits: 0,
  })
  if (formatted.includes('e') || formatted.includes('E')) {
    return value.toExponential(4)
  }
  return formatted.length > MAX_DISPLAY_LENGTH
    ? value.toExponential(4)
    : formatted
}

function trimTrailingZeros(s: string): string {
  if (s.includes('.')) {
    return s.replace(/\.?0+$/, '')
  }
  return s
}

/**
 * Format a number or display string for calculator display.
 * Strips trailing zeros after decimal, keeps at most MAX_DISPLAY_LENGTH chars.
 */
export function formatNumber(value: string | number): string {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return '0'
    return formatResultForDisplay(value)
  }
  const trimmed = value.replace(/,/g, '').trim()
  if (!trimmed || trimmed === '-' || trimmed === '.') return '0'
  const n = parseFloat(trimmed)
  if (Number.isNaN(n)) return '0'
  return formatResultForDisplay(n)
}
