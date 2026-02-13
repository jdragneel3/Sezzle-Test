package com.calculator.model.request

import io.micronaut.core.annotation.Introspected
import jakarta.validation.constraints.NotNull

@Introspected
data class UnaryOperationRequest(
    @field:NotNull(message = "operand is required")
    val operand: Double?
)
