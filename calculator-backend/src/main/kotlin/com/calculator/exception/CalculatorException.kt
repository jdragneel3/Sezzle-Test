package com.calculator.exception

open class CalculatorException(
    val errorCode: String,
    override val message: String,
    val details: String? = null
) : RuntimeException(message)
