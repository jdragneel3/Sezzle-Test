package com.calculator.config

import io.micronaut.context.annotation.ConfigurationProperties
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.Positive

/**
 * Configuration for rate limiting at application level.
 * Protects against DoS, API abuse, and excessive resource consumption.
 */
@ConfigurationProperties("ratelimit")
class RateLimitConfig {

    var enabled: Boolean = true

    @setparam:Positive
    @setparam:Max(10000)
    var limit: Int = 100

    /** Window duration in seconds (e.g., 60 = per minute) */
    @setparam:Positive
    @setparam:Min(1)
    @setparam:Max(3600)
    var windowSeconds: Int = 60

    /** Paths to exclude from rate limiting (ant-style, e.g. /api/v1/health) */
    var excludePaths: List<String> = listOf("/api/v1/health")
}
