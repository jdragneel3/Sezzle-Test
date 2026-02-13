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

@Filter("/api/**")
class MdcFilter : HttpServerFilter {

    override fun doFilter(
        request: HttpRequest<*>,
        chain: ServerFilterChain
    ): Publisher<MutableHttpResponse<*>> {
        val requestId = request.headers.get("X-Request-ID") ?: UUID.randomUUID().toString()
        MDC.put("requestId", requestId)
        return Flux.from(chain.proceed(request))
            .doFinally { MDC.clear() }
    }
}
