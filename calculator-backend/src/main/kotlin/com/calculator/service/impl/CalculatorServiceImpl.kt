package com.calculator.service.impl

import com.calculator.exception.DivisionByZeroException
import com.calculator.exception.InvalidOperandException
import com.calculator.exception.OverflowException
import com.calculator.service.CalculatorService
import jakarta.inject.Singleton
import org.slf4j.LoggerFactory
import org.slf4j.MDC
import kotlin.math.abs
import kotlin.math.pow

@Singleton
class CalculatorServiceImpl : CalculatorService {

    private val log = LoggerFactory.getLogger(CalculatorServiceImpl::class.java)

    override fun add(operand1: Double, operand2: Double): Double {
        validateOperands(operand1, operand2, "ADD")
        val result = operand1 + operand2
        checkOverflow(result, "ADD")
        logSuccess("ADD", result)
        return result
    }

    override fun subtract(operand1: Double, operand2: Double): Double {
        validateOperands(operand1, operand2, "SUBTRACT")
        val result = operand1 - operand2
        checkOverflow(result, "SUBTRACT")
        logSuccess("SUBTRACT", result)
        return result
    }

    override fun multiply(operand1: Double, operand2: Double): Double {
        validateOperands(operand1, operand2, "MULTIPLY")
        val result = operand1 * operand2
        checkOverflow(result, "MULTIPLY")
        logSuccess("MULTIPLY", result)
        return result
    }

    override fun divide(operand1: Double, operand2: Double): Double {
        validateOperands(operand1, operand2, "DIVIDE")
        validateForDivision(operand2)
        val result = operand1 / operand2
        checkOverflow(result, "DIVIDE")
        logSuccess("DIVIDE", result)
        return result
    }

    override fun power(base: Double, exponent: Double): Double {
        validateOperands(base, exponent, "POWER")
        val result = base.pow(exponent)
        checkOverflow(result, "POWER")
        logSuccess("POWER", result)
        return result
    }

    override fun sqrt(operand: Double): Double {
        validateOperands(operand, operand, "SQRT")
        validateForSqrt(operand)
        val result = kotlin.math.sqrt(operand)
        checkOverflow(result, "SQRT")
        logSuccess("SQRT", result)
        return result
    }

    override fun percentage(value: Double, percentage: Double): Double {
        validateOperands(value, percentage, "PERCENTAGE")
        validatePercentage(percentage)
        val result = (value * percentage) / 100.0
        checkOverflow(result, "PERCENTAGE")
        logSuccess("PERCENTAGE", result)
        return result
    }

    private fun validateOperands(op1: Double, op2: Double, operation: String) {
        if (op1.isNaN() || op2.isNaN()) {
            logError(operation, "CALC_002", "Invalid operand: NaN")
            throw InvalidOperandException("CALC_002", "Invalid operand (NaN)", "Operands cannot be NaN")
        }
        if (op1.isInfinite() || op2.isInfinite()) {
            logError(operation, "CALC_002", "Invalid operand: Infinity")
            throw InvalidOperandException("CALC_002", "Invalid operand (Infinity)", "Operands cannot be Infinity")
        }
    }

    private fun validateForDivision(divisor: Double) {
        if (divisor == 0.0) {
            logError("DIVIDE", "CALC_001", "Division by zero")
            throw DivisionByZeroException("Division by zero", "Second operand cannot be zero")
        }
    }

    private fun validateForSqrt(operand: Double) {
        if (operand < 0) {
            logError("SQRT", "CALC_003", "Negative number for square root")
            throw InvalidOperandException(
                "CALC_003",
                "Negative number for square root",
                "Operand must be >= 0"
            )
        }
    }

    private fun validatePercentage(percentage: Double) {
        if (percentage < 0 || percentage > 100) {
            logError("PERCENTAGE", "CALC_005", "Invalid percentage value")
            throw InvalidOperandException(
                "CALC_005",
                "Invalid percentage value",
                "Percentage must be between 0 and 100"
            )
        }
    }

    private fun checkOverflow(result: Double, operation: String) {
        if (result.isNaN() || result.isInfinite()) {
            logError(operation, "CALC_004", "Numerical overflow/underflow")
            throw OverflowException("Numerical overflow or underflow", "Result exceeds Double limits")
        }
        if (abs(result) > Double.MAX_VALUE) {
            logError(operation, "CALC_004", "Numerical overflow")
            throw OverflowException("Numerical overflow or underflow", "Result exceeds Double.MAX_VALUE")
        }
    }

    private fun logSuccess(operation: String, result: Double) {
        val requestId = MDC.get("requestId") ?: "unknown"
        log.info("[requestId={}] Operation={} completed successfully, result={}", requestId, operation, result)
    }

    private fun logError(operation: String, errorCode: String, reason: String) {
        val requestId = MDC.get("requestId") ?: "unknown"
        log.error("[requestId={}] Operation={} failed, errorCode={}, reason={}", requestId, operation, errorCode, reason)
    }
}
