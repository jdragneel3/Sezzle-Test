package com.calculator.exception

class InvalidOperandException(
    errorCode: String,
    message: String,
    details: String? = null
) : CalculatorException(errorCode, message, details)
