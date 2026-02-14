package com.calculator.config

import com.calculator.model.request.BinaryOperationRequest
import com.calculator.model.response.ErrorResponse
import io.micronaut.http.HttpRequest
import io.micronaut.http.HttpStatus
import io.micronaut.http.client.HttpClient
import io.micronaut.http.client.exceptions.HttpClientResponseException
import io.micronaut.runtime.server.EmbeddedServer
import io.micronaut.test.extensions.junit5.annotation.MicronautTest
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

/**
 * Integration test for rate limit filter.
 * Rate limit logic is covered by [RateLimiterTest].
 */
@MicronautTest
class RateLimitFilterTest(
    private val embeddedServer: EmbeddedServer
) {

    private lateinit var client: HttpClient

    @BeforeEach
    fun setup() {
        client = HttpClient.create(embeddedServer.url)
    }

    @AfterEach
    fun tearDown() {
        client.close()
    }

    @Test
    fun `health endpoint is excluded from rate limiting`() {
        repeat(5) {
            val response = client.toBlocking().exchange("/api/v1/health", Map::class.java)
            assertEquals(HttpStatus.OK, response.status)
        }
    }
}

@MicronautTest(environments = ["ratelimit"])
class RateLimitFilterWithLimitTest(
    private val embeddedServer: EmbeddedServer
) {

    private lateinit var client: HttpClient

    @BeforeEach
    fun setup() {
        client = HttpClient.create(embeddedServer.url)
    }

    @AfterEach
    fun tearDown() {
        client.close()
    }

    @Test
    fun `returns 429 with RATE_001 when rate limit exceeded`() {
        val request = HttpRequest.POST("/api/v1/add", BinaryOperationRequest(1.0, 2.0))
        val first = client.toBlocking().exchange(request, Map::class.java)
        assertEquals(HttpStatus.OK, first.status)
        val exception = assertThrows<HttpClientResponseException> {
            client.toBlocking().exchange(request, ErrorResponse::class.java)
        }
        assertEquals(HttpStatus.TOO_MANY_REQUESTS, exception.response.status)
        val body = exception.response.getBody(ErrorResponse::class.java).orElseThrow()
        assertEquals("RATE_001", body.errorCode)
        assertEquals("Rate limit exceeded", body.message)
        assertNotNull(body.details)
    }

    @Test
    fun `rate limit is per IP - different X-Forwarded-For gets separate quota`() {
        val req1 = HttpRequest.POST("/api/v1/add", BinaryOperationRequest(1.0, 2.0))
            .header("X-Forwarded-For", "192.168.1.1")
        val req2 = HttpRequest.POST("/api/v1/add", BinaryOperationRequest(3.0, 4.0))
            .header("X-Forwarded-For", "192.168.1.2")
        val r1 = client.toBlocking().exchange(req1, Map::class.java)
        val r2 = client.toBlocking().exchange(req2, Map::class.java)
        assertEquals(HttpStatus.OK, r1.status)
        assertEquals(HttpStatus.OK, r2.status)
    }
}
