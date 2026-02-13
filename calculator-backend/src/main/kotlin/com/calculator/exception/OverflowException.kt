package com.calculator.exception

class OverflowException(
    message: String = "Numerical overflow or underflow",
    details: String? = null
) : CalculatorException("CALC_004", message, details)
