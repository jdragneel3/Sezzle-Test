package com.calculator.exception

import com.calculator.model.response.ErrorResponse
import io.micronaut.context.annotation.Requires
import io.micronaut.http.HttpRequest
import io.micronaut.http.HttpResponse
import io.micronaut.http.HttpStatus
import io.micronaut.http.annotation.Produces
import io.micronaut.http.server.exceptions.ExceptionHandler
import jakarta.inject.Singleton
import jakarta.validation.ConstraintViolationException
import java.time.Instant

@Produces
@Singleton
@Requires(classes = [CalculatorException::class, ExceptionHandler::class])
class CalculatorExceptionHandler : ExceptionHandler<CalculatorException, HttpResponse<ErrorResponse>> {

    override fun handle(request: HttpRequest<*>, exception: CalculatorException): HttpResponse<ErrorResponse> {
        val errorResponse = ErrorResponse(
            errorCode = exception.errorCode,
            message = exception.message,
            details = exception.details,
            timestamp = Instant.now()
        )
        return HttpResponse.status<ErrorResponse>(HttpStatus.BAD_REQUEST).body(errorResponse)
    }
}

@Produces
@Singleton
@Requires(classes = [ConstraintViolationException::class, ExceptionHandler::class])
@io.micronaut.context.annotation.Replaces(io.micronaut.validation.exceptions.ConstraintExceptionHandler::class)
class ConstraintViolationExceptionHandler :
    ExceptionHandler<ConstraintViolationException, HttpResponse<ErrorResponse>> {

    override fun handle(
        request: HttpRequest<*>,
        exception: ConstraintViolationException
    ): HttpResponse<ErrorResponse> {
        val details = exception.constraintViolations.joinToString { it.message }
        val errorResponse = ErrorResponse(
            errorCode = "CALC_006",
            message = "Validation error",
            details = details,
            timestamp = Instant.now()
        )
        return HttpResponse.status<ErrorResponse>(HttpStatus.BAD_REQUEST).body(errorResponse)
    }
}
