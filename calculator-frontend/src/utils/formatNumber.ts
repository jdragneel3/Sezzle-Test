const MAX_DISPLAY_LENGTH = 18

/**
 * Format a number or display string for calculator display.
 * Strips trailing zeros after decimal, keeps at most MAX_DISPLAY_LENGTH chars.
 */
export function formatNumber(value: string | number): string {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return '0'
    if (Number.isInteger(value) && Math.abs(value) < 1e15) {
      return String(value)
    }
    return String(value)
  }
  const trimmed = value.replace(/,/g, '').trim()
  if (!trimmed || trimmed === '-' || trimmed === '.') return '0'
  const n = parseFloat(trimmed)
  if (Number.isNaN(n)) return '0'
  let out: string
  if (Number.isInteger(n) && Math.abs(n) < 1e15) {
    out = String(n)
  } else {
    out = String(n)
    if (out.includes('.')) {
      out = out.replace(/\.?0+$/, '')
    }
  }
  if (out.length > MAX_DISPLAY_LENGTH) {
    const num = parseFloat(out)
    out = num >= 1e15 || num <= -1e15 ? num.toExponential(6) : out.slice(0, MAX_DISPLAY_LENGTH)
  }
  return out
}
