import axios from 'axios'
import type { CalculationResponse } from '../types/api.types'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
})

export const calculatorApi = {
  add: (operand1: number, operand2: number) =>
    apiClient.post<CalculationResponse>('/add', { operand1, operand2 }),

  subtract: (operand1: number, operand2: number) =>
    apiClient.post<CalculationResponse>('/subtract', { operand1, operand2 }),

  multiply: (operand1: number, operand2: number) =>
    apiClient.post<CalculationResponse>('/multiply', { operand1, operand2 }),

  divide: (operand1: number, operand2: number) =>
    apiClient.post<CalculationResponse>('/divide', { operand1, operand2 }),

  power: (operand1: number, operand2: number) =>
    apiClient.post<CalculationResponse>('/power', { operand1, operand2 }),

  sqrt: (operand: number) =>
    apiClient.post<CalculationResponse>('/sqrt', { operand }),

  percentage: (operand1: number, operand2: number) =>
    apiClient.post<CalculationResponse>('/percentage', {
      operand1,
      operand2,
    }),
}
