package com.calculator.exception

class DivisionByZeroException(
    message: String = "Division by zero",
    details: String? = null
) : CalculatorException("CALC_001", message, details)
