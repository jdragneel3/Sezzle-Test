package com.calculator.controller

import com.calculator.model.request.BinaryOperationRequest
import com.calculator.model.request.UnaryOperationRequest
import com.calculator.model.response.ErrorResponse
import io.micronaut.http.HttpRequest
import io.micronaut.http.HttpStatus
import io.micronaut.http.client.HttpClient
import io.micronaut.http.client.exceptions.HttpClientResponseException
import io.micronaut.runtime.server.EmbeddedServer
import io.micronaut.test.extensions.junit5.annotation.MicronautTest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

@MicronautTest
class CalculatorControllerTest(
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
    fun `POST add with valid input returns 200 and correct result`() {
        val request = HttpRequest.POST("/api/v1/add", BinaryOperationRequest(10.0, 5.0))
        val response = client.toBlocking().exchange(request, Map::class.java)

        assertEquals(HttpStatus.OK, response.status)
        val body = response.body()
        assertNotNull(body)
        assertEquals(15.0, (body as Map<*, *>)["result"])
        assertEquals("ADD", body["operation"])
    }

    @Test
    fun `POST divide with zero divisor returns 400 with CALC_001`() {
        val request = HttpRequest.POST("/api/v1/divide", BinaryOperationRequest(10.0, 0.0))

        val exception = assertThrows<HttpClientResponseException> {
            client.toBlocking().exchange(request, ErrorResponse::class.java)
        }
        assertEquals(HttpStatus.BAD_REQUEST, exception.response.status)
        val body = exception.response.getBody(ErrorResponse::class.java).orElseThrow()
        assertEquals("CALC_001", body.errorCode)
        assertEquals("Division by zero", body.message)
    }

    @Test
    fun `POST sqrt with negative returns 400 with CALC_003`() {
        val request = HttpRequest.POST("/api/v1/sqrt", UnaryOperationRequest(-1.0))

        val exception = assertThrows<HttpClientResponseException> {
            client.toBlocking().exchange(request, ErrorResponse::class.java)
        }
        assertEquals(HttpStatus.BAD_REQUEST, exception.response.status)
        val body = exception.response.getBody(ErrorResponse::class.java).orElseThrow()
        assertEquals("CALC_003", body.errorCode)
    }

    @Test
    fun `POST with null operand returns 400 with CALC_006`() {
        val request = HttpRequest.POST("/api/v1/add", mapOf("operand1" to null, "operand2" to 5))

        val exception = assertThrows<HttpClientResponseException> {
            client.toBlocking().exchange(request, ErrorResponse::class.java)
        }
        assertEquals(HttpStatus.BAD_REQUEST, exception.response.status)
        val body = exception.response.getBody(ErrorResponse::class.java).orElseThrow()
        assertEquals("CALC_006", body.errorCode)
    }

    @Test
    fun `GET health returns 200 with UP status`() {
        val response = client.toBlocking().exchange("/api/v1/health", Map::class.java)
        assertEquals(HttpStatus.OK, response.status)
        val body = response.body()
        assertNotNull(body)
        assertEquals("UP", (body as Map<*, *>)["status"])
    }

    @Test
    fun `POST subtract with valid input returns 200`() {
        val request = HttpRequest.POST("/api/v1/subtract", BinaryOperationRequest(10.0, 5.0))
        val response = client.toBlocking().exchange(request, Map::class.java)
        assertEquals(HttpStatus.OK, response.status)
        assertEquals(5.0, (response.body() as Map<*, *>)["result"])
    }

    @Test
    fun `POST multiply with valid input returns 200`() {
        val request = HttpRequest.POST("/api/v1/multiply", BinaryOperationRequest(10.0, 5.0))
        val response = client.toBlocking().exchange(request, Map::class.java)
        assertEquals(HttpStatus.OK, response.status)
        assertEquals(50.0, (response.body() as Map<*, *>)["result"])
    }

    @Test
    fun `POST power with valid input returns 200`() {
        val request = HttpRequest.POST("/api/v1/power", BinaryOperationRequest(2.0, 3.0))
        val response = client.toBlocking().exchange(request, Map::class.java)
        assertEquals(HttpStatus.OK, response.status)
        assertEquals(8.0, (response.body() as Map<*, *>)["result"])
    }

    @Test
    fun `POST percentage with valid input returns 200`() {
        val request = HttpRequest.POST("/api/v1/percentage", BinaryOperationRequest(100.0, 25.0))
        val response = client.toBlocking().exchange(request, Map::class.java)
        assertEquals(HttpStatus.OK, response.status)
        assertEquals(25.0, (response.body() as Map<*, *>)["result"])
    }
}
