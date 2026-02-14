package com.calculator.service

import com.calculator.config.AppConfig
import jakarta.inject.Singleton
import java.lang.management.ManagementFactory
import java.lang.management.MemoryMXBean
import java.lang.management.RuntimeMXBean
import java.lang.management.ThreadMXBean

/**
 * Provides detailed health information for monitoring and orchestration.
 * Includes JVM metrics (memory, threads) and application version.
 */
@Singleton
class HealthService(private val appConfig: AppConfig) {

    fun getHealth(): Map<String, Any> {
        val jvm = buildJvmInfo()
        return mapOf(
            "status" to "UP",
            "version" to appConfig.version,
            "jvm" to jvm
        )
    }

    private fun buildJvmInfo(): Map<String, Any> {
        val memory: MemoryMXBean = ManagementFactory.getMemoryMXBean()
        val heap = memory.heapMemoryUsage
        val nonHeap = memory.nonHeapMemoryUsage
        val runtime: RuntimeMXBean = ManagementFactory.getRuntimeMXBean()
        val threads: ThreadMXBean = ManagementFactory.getThreadMXBean()

        return mapOf(
            "memory" to mapOf(
                "heap" to mapOf(
                    "used" to heap.used,
                    "max" to (heap.max.takeIf { it >= 0 } ?: -1),
                    "committed" to heap.committed
                ),
                "nonHeap" to mapOf(
                    "used" to nonHeap.used,
                    "committed" to nonHeap.committed
                )
            ),
            "threads" to mapOf(
                "count" to threads.threadCount,
                "daemon" to threads.daemonThreadCount,
                "peak" to threads.peakThreadCount
            ),
            "uptimeSeconds" to (runtime.uptime / 1000)
        )
    }
}
