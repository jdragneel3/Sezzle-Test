export type Operation =
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide'
  | 'power'
  | 'sqrt'
  | 'percentage'

export type ButtonType =
  | 'number'
  | 'operator'
  | 'function'
  | 'clear'
  | 'equals'

export interface CalculatorState {
  display: string
  currentValue: number | null
  previousValue: number | null
  operation: Operation | null
  waitingForOperand: boolean
  isLoading: boolean
  error: string | null
}

export interface ButtonConfig {
  label: string
  value: string
  type: ButtonType
  gridColumn?: string
  className?: string
}
