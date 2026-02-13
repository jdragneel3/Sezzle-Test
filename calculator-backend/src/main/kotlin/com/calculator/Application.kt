package com.calculator

import io.micronaut.runtime.Micronaut.run
import io.swagger.v3.oas.annotations.OpenAPIDefinition
import io.swagger.v3.oas.annotations.info.Info

@OpenAPIDefinition(
    info = Info(
        title = "Calculator API",
        version = "1.0",
        description = "REST API for calculator operations: addition, subtraction, multiplication, division, power, square root, and percentage"
    )
)
class Application

fun main(args: Array<String>) {
    run(Application::class.java, *args)
}
