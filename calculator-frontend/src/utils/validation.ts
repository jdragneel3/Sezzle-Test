export function isDivisionByZero(operand2: number): boolean {
  return operand2 === 0
}

export function isNegativeForSqrt(operand: number): boolean {
  return operand < 0
}

export function isPercentageOutOfRange(percentage: number): boolean {
  return percentage < 0 || percentage > 100
}
