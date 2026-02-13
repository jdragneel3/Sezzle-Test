package com.calculator.exception

class ValidationException(
    message: String = "Validation error",
    details: String? = null
) : CalculatorException("CALC_006", message, details)
