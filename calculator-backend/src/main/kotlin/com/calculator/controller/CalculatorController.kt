package com.calculator.controller

import com.calculator.model.request.BinaryOperationRequest
import com.calculator.model.request.UnaryOperationRequest
import com.calculator.model.response.CalculationResponse
import com.calculator.service.CalculatorService
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Post
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import java.time.Instant

@Controller("/api/v1")
@Tag(name = "Calculator", description = "Arithmetic operations API")
class CalculatorController(private val calculatorService: CalculatorService) {

    @Post("/add", consumes = [MediaType.APPLICATION_JSON], produces = [MediaType.APPLICATION_JSON])
    @Operation(summary = "Addition", description = "Adds two numbers")
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "Successful calculation"),
        ApiResponse(responseCode = "400", description = "Invalid input or validation error")
    )
    fun add(@Body @Valid request: BinaryOperationRequest): CalculationResponse {
        val result = calculatorService.add(request.operand1!!, request.operand2!!)
        return CalculationResponse(result, "ADD", Instant.now())
    }

    @Post("/subtract", consumes = [MediaType.APPLICATION_JSON], produces = [MediaType.APPLICATION_JSON])
    @Operation(summary = "Subtraction", description = "Subtracts operand2 from operand1")
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "Successful calculation"),
        ApiResponse(responseCode = "400", description = "Invalid input or validation error")
    )
    fun subtract(@Body @Valid request: BinaryOperationRequest): CalculationResponse {
        val result = calculatorService.subtract(request.operand1!!, request.operand2!!)
        return CalculationResponse(result, "SUBTRACT", Instant.now())
    }

    @Post("/multiply", consumes = [MediaType.APPLICATION_JSON], produces = [MediaType.APPLICATION_JSON])
    @Operation(summary = "Multiplication", description = "Multiplies two numbers")
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "Successful calculation"),
        ApiResponse(responseCode = "400", description = "Invalid input or validation error")
    )
    fun multiply(@Body @Valid request: BinaryOperationRequest): CalculationResponse {
        val result = calculatorService.multiply(request.operand1!!, request.operand2!!)
        return CalculationResponse(result, "MULTIPLY", Instant.now())
    }

    @Post("/divide", consumes = [MediaType.APPLICATION_JSON], produces = [MediaType.APPLICATION_JSON])
    @Operation(summary = "Division", description = "Divides operand1 by operand2. Returns CALC_001 if divisor is zero.")
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "Successful calculation"),
        ApiResponse(responseCode = "400", description = "Division by zero (CALC_001) or invalid input")
    )
    fun divide(@Body @Valid request: BinaryOperationRequest): CalculationResponse {
        val result = calculatorService.divide(request.operand1!!, request.operand2!!)
        return CalculationResponse(result, "DIVIDE", Instant.now())
    }

    @Post("/power", consumes = [MediaType.APPLICATION_JSON], produces = [MediaType.APPLICATION_JSON])
    @Operation(summary = "Exponentiation", description = "Raises operand1 to the power of operand2")
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "Successful calculation"),
        ApiResponse(responseCode = "400", description = "Invalid input or overflow (CALC_004)")
    )
    fun power(@Body @Valid request: BinaryOperationRequest): CalculationResponse {
        val result = calculatorService.power(request.operand1!!, request.operand2!!)
        return CalculationResponse(result, "POWER", Instant.now())
    }

    @Post("/percentage", consumes = [MediaType.APPLICATION_JSON], produces = [MediaType.APPLICATION_JSON])
    @Operation(summary = "Percentage", description = "Calculates operand2% of operand1. operand2 must be 0-100.")
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "Successful calculation"),
        ApiResponse(responseCode = "400", description = "Invalid percentage (CALC_005) or invalid input")
    )
    fun percentage(@Body @Valid request: BinaryOperationRequest): CalculationResponse {
        val result = calculatorService.percentage(request.operand1!!, request.operand2!!)
        return CalculationResponse(result, "PERCENTAGE", Instant.now())
    }

    @Post("/sqrt", consumes = [MediaType.APPLICATION_JSON], produces = [MediaType.APPLICATION_JSON])
    @Operation(summary = "Square root", description = "Returns the square root of the operand. Operand must be >= 0.")
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "Successful calculation"),
        ApiResponse(responseCode = "400", description = "Negative operand (CALC_003) or invalid input")
    )
    fun sqrt(@Body @Valid request: UnaryOperationRequest): CalculationResponse {
        val result = calculatorService.sqrt(request.operand!!)
        return CalculationResponse(result, "SQRT", Instant.now())
    }

    @Get("/health", produces = [MediaType.APPLICATION_JSON])
    @Operation(summary = "Health check", description = "Returns service status")
    fun health(): Map<String, Any> {
        return mapOf("status" to "UP")
    }
}
