package com.calculator.config

import io.micronaut.http.HttpRequest
import io.micronaut.http.MutableHttpResponse
import io.micronaut.http.annotation.Filter
import io.micronaut.http.filter.HttpServerFilter
import io.micronaut.http.filter.ServerFilterChain
import org.reactivestreams.Publisher
import reactor.core.publisher.Flux

/**
 * Adds standard HTTP security headers to all responses.
 * In Docker, Nginx also adds these; this covers standalone Micronaut (e.g. dev).
 */
@Filter("/api/**", "/swagger/**", "/swagger-ui/**")
class SecurityHeadersFilter : HttpServerFilter {

    override fun doFilter(
        request: HttpRequest<*>,
        chain: ServerFilterChain
    ): Publisher<MutableHttpResponse<*>> {
        return Flux.from(chain.proceed(request))
            .map { response ->
                response.headers
                    .add("X-Content-Type-Options", "nosniff")
                    .add("X-Frame-Options", "DENY")
                val path = request.path
                val csp = if (path.startsWith("/swagger-ui") || path.startsWith("/swagger")) {
                    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self';"
                } else {
                    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';"
                }
                response.headers.add("Content-Security-Policy", csp)
                if (request.isSecure || request.headers.get("X-Forwarded-Proto") == "https") {
                    response.headers.add(
                        "Strict-Transport-Security",
                        "max-age=31536000; includeSubDomains"
                    )
                }
                response
            }
    }
}
