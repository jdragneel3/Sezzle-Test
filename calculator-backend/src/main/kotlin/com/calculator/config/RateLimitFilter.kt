package com.calculator.config

import com.calculator.model.response.ErrorResponse
import io.micronaut.core.order.Ordered
import io.micronaut.http.HttpRequest
import io.micronaut.http.HttpResponse
import io.micronaut.http.HttpStatus
import io.micronaut.http.MutableHttpResponse
import io.micronaut.http.annotation.Filter
import io.micronaut.http.filter.HttpServerFilter
import io.micronaut.http.filter.ServerFilterChain
import org.reactivestreams.Publisher
import reactor.core.publisher.Flux
import java.time.Instant

/**
 * Rate limiting filter using Micronaut's HttpServerFilter.
 * Limits requests per client IP to protect against DoS and API abuse.
 * Returns 429 Too Many Requests with RATE_001 when limit exceeded.
 */
@Filter("/api/**")
class RateLimitFilter(
    private val rateLimiter: RateLimiter,
    private val config: RateLimitConfig
) : HttpServerFilter, Ordered {

    override fun getOrder(): Int = Ordered.HIGHEST_PRECEDENCE

    override fun doFilter(
        request: HttpRequest<*>,
        chain: ServerFilterChain
    ): Publisher<MutableHttpResponse<*>> {
        if (!config.enabled) {
            return chain.proceed(request)
        }
        val path = request.path ?: ""
        if (config.excludePaths.any { excludePath ->
            path == excludePath || (excludePath.endsWith("/**") && path.startsWith(excludePath.removeSuffix("/**")))
        }) {
            return chain.proceed(request)
        }
        val clientIp = resolveClientIp(request)
        if (!rateLimiter.tryConsume(clientIp)) {
            val errorResponse = ErrorResponse(
                errorCode = "RATE_001",
                message = "Rate limit exceeded",
                details = "Too many requests. Please try again later.",
                timestamp = Instant.now()
            )
            val response = HttpResponse.status<ErrorResponse>(HttpStatus.TOO_MANY_REQUESTS).body(errorResponse)
            @Suppress("UNCHECKED_CAST")
            return Flux.just(response as MutableHttpResponse<*>)
        }
        return chain.proceed(request)
    }

    private fun resolveClientIp(request: HttpRequest<*>): String {
        request.headers.get("X-Forwarded-For")?.split(",")?.firstOrNull()?.trim()?.let { return it }
        request.headers.get("X-Real-IP")?.trim()?.let { return it }
        val addr = request.remoteAddress
        return addr.hostString ?: addr.address?.hostAddress ?: addr.toString()
    }
}
