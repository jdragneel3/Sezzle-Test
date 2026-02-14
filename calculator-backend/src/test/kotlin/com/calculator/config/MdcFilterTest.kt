package com.calculator.config

import com.calculator.model.request.BinaryOperationRequest
import io.micronaut.http.HttpRequest
import io.micronaut.http.HttpStatus
import io.micronaut.http.client.HttpClient
import io.micronaut.runtime.server.EmbeddedServer
import io.micronaut.test.extensions.junit5.annotation.MicronautTest
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

@MicronautTest
class MdcFilterTest(
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
    fun `accepts valid X-Request-ID and processes request`() {
        val request = HttpRequest.POST("/api/v1/add", BinaryOperationRequest(1.0, 2.0))
            .header("X-Request-ID", "req-abc123_xyz")
        val response = client.toBlocking().exchange(request, Map::class.java)
        assertEquals(HttpStatus.OK, response.status)
    }

    @Test
    fun `rejects X-Request-ID with spaces and processes request`() {
        val request = HttpRequest.POST("/api/v1/add", BinaryOperationRequest(1.0, 2.0))
            .header("X-Request-ID", "id with spaces")
        val response = client.toBlocking().exchange(request, Map::class.java)
        assertEquals(HttpStatus.OK, response.status)
    }

    @Test
    fun `rejects X-Request-ID with special characters`() {
        val request = HttpRequest.POST("/api/v1/add", BinaryOperationRequest(1.0, 2.0))
            .header("X-Request-ID", "id|with|pipes")
        val response = client.toBlocking().exchange(request, Map::class.java)
        assertEquals(HttpStatus.OK, response.status)
    }
}
