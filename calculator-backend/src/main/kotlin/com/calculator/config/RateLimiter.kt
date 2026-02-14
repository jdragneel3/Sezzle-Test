package com.calculator.config

import jakarta.inject.Singleton
import java.util.concurrent.ConcurrentHashMap

/**
 * In-memory rate limiter using fixed-window counters per bucket (e.g., IP).
 * Thread-safe; suitable for single-instance deployments.
 * For multi-instance, consider Redis-based rate limiting.
 */
@Singleton
class RateLimiter(private val config: RateLimitConfig) {

    private data class Window(val startMillis: Long, val count: Int)

    private val windows = ConcurrentHashMap<String, Window>()
    private val windowDurationMillis = config.windowSeconds * 1000L

    /**
     * Attempts to consume one request for the given bucket key (e.g., client IP).
     * @return true if allowed, false if rate limit exceeded
     */
    fun tryConsume(bucketKey: String): Boolean {
        if (!config.enabled) return true
        val now = System.currentTimeMillis()
        val allowed = BooleanArray(1) { true }
        windows.compute(bucketKey) { _, existing ->
            when {
                existing == null || now - existing.startMillis >= windowDurationMillis ->
                    Window(now, 1)
                existing.count >= config.limit -> {
                    allowed[0] = false
                    existing
                }
                else ->
                    Window(existing.startMillis, existing.count + 1)
            }
        }
        return allowed[0]
    }
}
