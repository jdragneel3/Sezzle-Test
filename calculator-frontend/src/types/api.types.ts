export interface BinaryOperationRequest {
  operand1: number
  operand2: number
}

export interface UnaryOperationRequest {
  operand: number
}

export interface CalculationResponse {
  result: number
  operation: string
  timestamp: string
}

export interface ErrorResponse {
  errorCode: string
  message: string
  details?: string
  timestamp: string
}
