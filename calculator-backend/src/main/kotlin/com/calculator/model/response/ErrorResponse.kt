package com.calculator.model.response

import io.micronaut.core.annotation.Introspected
import java.time.Instant

@Introspected
data class ErrorResponse(
    val errorCode: String,
    val message: String,
    val details: String?,
    val timestamp: Instant
)
