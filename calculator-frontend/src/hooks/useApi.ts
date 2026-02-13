import { useCallback } from 'react'
import type { Operation } from '../types/calculator.types'
import { calculatorApi } from '../services/calculatorApi'
import { getUserFriendlyErrorMessage } from '../utils/errorMessages'

export function useApi() {
  const executeOperation = useCallback(
    async (
      operation: Operation,
      operands: { operand1?: number; operand2?: number; operand?: number }
    ): Promise<number> => {
      try {
        if (operation === 'sqrt') {
          const operand = operands.operand ?? 0
          const { data } = await calculatorApi.sqrt(operand)
          return data.result
        }
        const operand1 = operands.operand1 ?? 0
        const operand2 = operands.operand2 ?? 0
        switch (operation) {
          case 'add': {
            const { data } = await calculatorApi.add(operand1, operand2)
            return data.result
          }
          case 'subtract': {
            const { data } = await calculatorApi.subtract(operand1, operand2)
            return data.result
          }
          case 'multiply': {
            const { data } = await calculatorApi.multiply(operand1, operand2)
            return data.result
          }
          case 'divide': {
            const { data } = await calculatorApi.divide(operand1, operand2)
            return data.result
          }
          case 'power': {
            const { data } = await calculatorApi.power(operand1, operand2)
            return data.result
          }
          case 'percentage': {
            const { data } = await calculatorApi.percentage(operand1, operand2)
            return data.result
          }
          default:
            throw new Error('Unknown operation')
        }
      } catch (error) {
        throw new Error(getUserFriendlyErrorMessage(error))
      }
    },
    []
  )

  return { executeOperation }
}
