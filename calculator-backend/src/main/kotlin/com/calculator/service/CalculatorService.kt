package com.calculator.service

interface CalculatorService {
    fun add(operand1: Double, operand2: Double): Double
    fun subtract(operand1: Double, operand2: Double): Double
    fun multiply(operand1: Double, operand2: Double): Double
    fun divide(operand1: Double, operand2: Double): Double
    fun power(base: Double, exponent: Double): Double
    fun sqrt(operand: Double): Double
    fun percentage(value: Double, percentage: Double): Double
}
