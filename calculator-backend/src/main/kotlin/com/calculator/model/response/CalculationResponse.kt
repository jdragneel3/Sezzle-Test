package com.calculator.model.response

import io.micronaut.core.annotation.Introspected
import java.time.Instant

@Introspected
data class CalculationResponse(
    val result: Double,
    val operation: String,
    val timestamp: Instant
)
