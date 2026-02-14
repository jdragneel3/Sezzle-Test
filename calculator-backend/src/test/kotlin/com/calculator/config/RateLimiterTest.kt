package com.calculator.config

import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

class RateLimiterTest {

    @Test
    fun `rejects request when limit exceeded`() {
        val config = RateLimitConfig().apply {
            enabled = true
            limit = 2
            windowSeconds = 60
        }
        val limiter = RateLimiter(config)
        assertTrue(limiter.tryConsume("ip1"))
        assertTrue(limiter.tryConsume("ip1"))
        assertFalse(limiter.tryConsume("ip1"))
    }

    @Test
    fun `allows when disabled`() {
        val config = RateLimitConfig().apply {
            enabled = false
            limit = 1
            windowSeconds = 60
        }
        val limiter = RateLimiter(config)
        repeat(5) {
            assertTrue(limiter.tryConsume("ip1"))
        }
    }
}
