package com.calculator.config

import io.micronaut.context.annotation.ConfigurationProperties

/**
 * Application metadata used by health endpoint.
 * Version is injected at build time via Gradle processResources.
 */
@ConfigurationProperties("app")
class AppConfig {
    var version: String = "unknown"
}
