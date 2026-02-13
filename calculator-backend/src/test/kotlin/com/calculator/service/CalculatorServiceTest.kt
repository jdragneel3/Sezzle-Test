package com.calculator.service

import com.calculator.exception.DivisionByZeroException
import com.calculator.service.impl.CalculatorServiceImpl
import com.calculator.exception.InvalidOperandException
import com.calculator.exception.OverflowException
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow

class CalculatorServiceTest {

    private val calculatorService: CalculatorService = CalculatorServiceImpl()

    // Happy Path
    @Test
    fun `addition of positive numbers returns correct result`() {
        assertEquals(15.0, calculatorService.add(10.0, 5.0))
    }

    @Test
    fun `subtraction returns correct result`() {
        assertEquals(5.0, calculatorService.subtract(10.0, 5.0))
    }

    @Test
    fun `multiplication returns correct result`() {
        assertEquals(50.0, calculatorService.multiply(10.0, 5.0))
    }

    @Test
    fun `division returns correct result`() {
        assertEquals(2.0, calculatorService.divide(10.0, 5.0))
    }

    @Test
    fun `power calculation returns correct result`() {
        assertEquals(8.0, calculatorService.power(2.0, 3.0))
    }

    @Test
    fun `square root returns correct result`() {
        assertEquals(5.0, calculatorService.sqrt(25.0))
    }

    @Test
    fun `percentage calculation returns correct result`() {
        assertEquals(25.0, calculatorService.percentage(100.0, 25.0))
    }

    // Edge Cases
    @Test
    fun `addition of very large numbers detects overflow`() {
        assertThrows(OverflowException::class.java) {
            calculatorService.add(Double.MAX_VALUE, Double.MAX_VALUE)
        }
    }

    @Test
    fun `division by very small number close to zero works`() {
        assertDoesNotThrow {
            val result = calculatorService.divide(1.0, 1e-10)
            assertEquals(1e10, result, 1e5)
        }
    }

    @Test
    fun `square root of zero returns zero`() {
        assertEquals(0.0, calculatorService.sqrt(0.0))
    }

    @Test
    fun `power of zero returns one`() {
        assertEquals(1.0, calculatorService.power(5.0, 0.0))
    }

    @Test
    fun `addition with negative numbers`() {
        assertEquals(-5.0, calculatorService.add(-10.0, 5.0))
    }

    // Error Cases
    @Test
    fun `division by zero throws DivisionByZeroException`() {
        val exception = assertThrows(DivisionByZeroException::class.java) {
            calculatorService.divide(10.0, 0.0)
        }
        assertEquals("CALC_001", exception.errorCode)
    }

    @Test
    fun `square root of negative throws InvalidOperandException`() {
        val exception = assertThrows(InvalidOperandException::class.java) {
            calculatorService.sqrt(-1.0)
        }
        assertEquals("CALC_003", exception.errorCode)
    }

    @Test
    fun `NaN operand throws InvalidOperandException`() {
        assertThrows(InvalidOperandException::class.java) {
            calculatorService.add(Double.NaN, 5.0)
        }
        assertThrows(InvalidOperandException::class.java) {
            calculatorService.add(5.0, Double.NaN)
        }
    }

    @Test
    fun `Infinity operand throws InvalidOperandException`() {
        assertThrows(InvalidOperandException::class.java) {
            calculatorService.add(Double.POSITIVE_INFINITY, 5.0)
        }
        assertThrows(InvalidOperandException::class.java) {
            calculatorService.add(5.0, Double.NEGATIVE_INFINITY)
        }
    }

    @Test
    fun `percentage over 100 throws InvalidOperandException`() {
        val exception = assertThrows(InvalidOperandException::class.java) {
            calculatorService.percentage(100.0, 101.0)
        }
        assertEquals("CALC_005", exception.errorCode)
    }

    @Test
    fun `percentage under 0 throws InvalidOperandException`() {
        val exception = assertThrows(InvalidOperandException::class.java) {
            calculatorService.percentage(100.0, -1.0)
        }
        assertEquals("CALC_005", exception.errorCode)
    }

    @Test
    fun `percentage at boundary 0 works`() {
        assertEquals(0.0, calculatorService.percentage(100.0, 0.0))
    }

    @Test
    fun `percentage at boundary 100 works`() {
        assertEquals(100.0, calculatorService.percentage(100.0, 100.0))
    }
}
