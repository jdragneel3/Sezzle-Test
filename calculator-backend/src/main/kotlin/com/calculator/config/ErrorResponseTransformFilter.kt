package com.calculator.config

import com.calculator.model.response.ErrorResponse
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.micronaut.http.HttpRequest
import io.micronaut.http.HttpStatus
import io.micronaut.http.MutableHttpResponse
import io.micronaut.core.order.Ordered
import io.micronaut.http.annotation.Filter
import io.micronaut.http.filter.HttpServerFilter
import io.micronaut.http.filter.ServerFilterChain
import org.reactivestreams.Publisher
import reactor.core.publisher.Flux
import java.time.Instant

/**
 * Transforms default Micronaut error responses (_embedded format) to our ErrorResponse format
 * when the error is due to invalid operand types (e.g., string "a" instead of number).
 */
@Filter("/api/**")
class ErrorResponseTransformFilter(
    private val objectMapper: ObjectMapper = jacksonObjectMapper()
) : HttpServerFilter, Ordered {

    override fun getOrder(): Int = Ordered.LOWEST_PRECEDENCE

    override fun doFilter(
        request: HttpRequest<*>,
        chain: ServerFilterChain
    ): Publisher<MutableHttpResponse<*>> {
        return Flux.from(chain.proceed(request))
            .map { response ->
                if (response.status == HttpStatus.BAD_REQUEST && response.body.isPresent) {
                    val body = response.body.get()
                    val bodyStr = when (body) {
                        is String -> body
                        else -> objectMapper.writeValueAsString(body)
                    }
                    if (bodyStr.contains("_embedded") && bodyStr.contains("errors") ||
                (bodyStr.contains("Failed to convert") && bodyStr.contains("argument"))
            ) {
                        transformToErrorResponse(bodyStr, response)
                    } else {
                        response
                    }
                } else {
                    response
                }
            }
    }

    private fun transformToErrorResponse(
        bodyStr: String,
        response: MutableHttpResponse<*>
    ): MutableHttpResponse<ErrorResponse> {
        val (errorCode, message, details) = extractFromEmbedded(bodyStr)
        val errorResponse = ErrorResponse(
            errorCode = errorCode,
            message = message,
            details = details,
            timestamp = Instant.now()
        )
        @Suppress("UNCHECKED_CAST")
        return response.body(errorResponse) as MutableHttpResponse<ErrorResponse>
    }

    private fun extractFromEmbedded(bodyStr: String): Triple<String, String, String?> {
        return try {
            val node = objectMapper.readTree(bodyStr)
            val errors = node.get("_embedded")?.get("errors")
            val firstError = errors?.get(0)
            val msg = firstError?.get("message")?.asText()
                ?: node.get("message")?.asText()
                ?: bodyStr
            val (errorCode, message) = when {
                bodyStr.contains("Double") || bodyStr.contains("deserialize") ||
                    msg.contains("Double") || msg.contains("Failed to convert") ->
                    "CALC_002" to "Invalid operand type"
                else ->
                    "CALC_006" to "Invalid request body"
            }
            Triple(errorCode, message, msg)
        } catch (e: Exception) {
            Triple("CALC_006", "Invalid request body", bodyStr)
        }
    }
}
