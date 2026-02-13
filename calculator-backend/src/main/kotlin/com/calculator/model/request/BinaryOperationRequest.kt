package com.calculator.model.request

import io.micronaut.core.annotation.Introspected
import jakarta.validation.constraints.NotNull

@Introspected
data class BinaryOperationRequest(
    @field:NotNull(message = "operand1 is required")
    val operand1: Double?,

    @field:NotNull(message = "operand2 is required")
    val operand2: Double?
)
