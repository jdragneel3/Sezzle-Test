package com.calculator.exception

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class ExceptionTest {

    @Test
    fun `CalculatorException has correct properties`() {
        val ex = CalculatorException("CALC_001", "Test message", "details")
        assertEquals("CALC_001", ex.errorCode)
        assertEquals("Test message", ex.message)
        assertEquals("details", ex.details)
    }

    @Test
    fun `CalculatorException with null details`() {
        val ex = CalculatorException("CALC_002", "Msg")
        assertEquals("CALC_002", ex.errorCode)
        assertEquals(null, ex.details)
    }

    @Test
    fun `ValidationException has CALC_006`() {
        val ex = ValidationException("Custom validation", "field error")
        assertEquals("CALC_006", ex.errorCode)
        assertEquals("Custom validation", ex.message)
        assertEquals("field error", ex.details)
    }

    @Test
    fun `ValidationException default constructor`() {
        val ex = ValidationException()
        assertEquals("CALC_006", ex.errorCode)
        assertEquals("Validation error", ex.message)
    }

    @Test
    fun `DivisionByZeroException has CALC_001`() {
        val ex = DivisionByZeroException("Division by zero", "operand2 is 0")
        assertEquals("CALC_001", ex.errorCode)
        assertEquals("Division by zero", ex.message)
    }

    @Test
    fun `OverflowException has CALC_004`() {
        val ex = OverflowException("Overflow", "result too large")
        assertEquals("CALC_004", ex.errorCode)
    }

    @Test
    fun `InvalidOperandException has custom errorCode`() {
        val ex = InvalidOperandException("CALC_002", "Invalid operand", "NaN")
        assertEquals("CALC_002", ex.errorCode)
        assertEquals("Invalid operand", ex.message)
        assertEquals("NaN", ex.details)
    }
}
