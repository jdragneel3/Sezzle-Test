package com.calculator.config

import io.micronaut.http.HttpRequest
import io.micronaut.http.MutableHttpResponse
import io.micronaut.http.annotation.Filter
import io.micronaut.http.filter.HttpServerFilter
import io.micronaut.http.filter.ServerFilterChain
import org.reactivestreams.Publisher
import org.slf4j.MDC
import reactor.core.publisher.Flux
import java.util.UUID

/** Safe pattern: alphanumeric, hyphen, underscore; max 64 chars. Prevents log injection. */
private val SAFE_REQUEST_ID = Regex("^[a-zA-Z0-9\\-_]{1,64}$")

@Filter("/api/**")
class MdcFilter : HttpServerFilter {

    override fun doFilter(
        request: HttpRequest<*>,
        chain: ServerFilterChain
    ): Publisher<MutableHttpResponse<*>> {
        val headerValue = request.headers.get("X-Request-ID")
        val requestId = when {
            headerValue == null || headerValue.isBlank() -> UUID.randomUUID().toString()
            headerValue.matches(SAFE_REQUEST_ID) -> headerValue.trim()
            else -> UUID.randomUUID().toString()
        }
        MDC.put("requestId", requestId)
        return Flux.from(chain.proceed(request))
            .doFinally { MDC.clear() }
    }
}
