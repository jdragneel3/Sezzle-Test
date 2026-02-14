plugins {
    kotlin("jvm") version "1.9.24"
    id("io.micronaut.application") version "4.3.5"
    id("org.jetbrains.kotlin.plugin.allopen") version "1.9.24"
    id("org.jetbrains.kotlin.kapt") version "1.9.24"
    id("com.github.johnrengelman.shadow") version "8.1.1"
    id("jacoco")
}

version = "0.1"
group = "com.calculator"

tasks.processResources {
    filesMatching("application.yml") {
        expand("projectVersion" to version)
    }
}

val kotlinVersion = project.properties["kotlinVersion"] as String

repositories {
    mavenCentral()
}

dependencies {
    implementation("io.micronaut:micronaut-http-server-netty")
    implementation("io.micronaut.reactor:micronaut-reactor")
    implementation("io.micronaut:micronaut-jackson-databind")
    implementation("io.micronaut.validation:micronaut-validation:4.3.5")
    implementation("io.micronaut.openapi:micronaut-openapi")
    implementation("io.micronaut.views:micronaut-views-core")
    implementation("io.swagger.core.v3:swagger-annotations")
    implementation("io.micronaut.kotlin:micronaut-kotlin-runtime")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("ch.qos.logback:logback-classic")
    implementation("org.jetbrains.kotlin:kotlin-reflect:$kotlinVersion")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8:$kotlinVersion")
    runtimeOnly("ch.qos.logback:logback-classic")
    runtimeOnly("org.yaml:snakeyaml")

    testImplementation("io.micronaut:micronaut-http-client")
    testImplementation("io.micronaut.test:micronaut-test-junit5")
    kapt("io.micronaut.openapi:micronaut-openapi")
    kaptTest("io.micronaut:micronaut-inject-java")
    testImplementation("org.junit.jupiter:junit-jupiter")
    testImplementation("org.mockito.kotlin:mockito-kotlin:5.1.0")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

application {
    mainClass.set("com.calculator.ApplicationKt")
}

tasks.shadowJar {
    archiveBaseName.set("calculator-backend")
    archiveClassifier.set("all")
    mergeServiceFiles()
    manifest {
        attributes("Main-Class" to application.mainClass.get())
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

allOpen {
    annotation("io.micronaut.aop.Around")
    annotation("io.micronaut.http.annotation.Controller")
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjavac-arguments=-Dmicronaut.openapi.views.spec=swagger-ui.enabled=true,swagger-ui.theme=flattop")
    }
}

micronaut {
    version(project.properties["micronautVersion"] as String)
    testRuntime("junit5")
    processing {
        incremental(true)
        annotations("com.calculator.*")
    }
}

tasks.jacocoTestReport {
    dependsOn(tasks.test)
    classDirectories.setFrom(
        fileTree("$buildDir/classes/kotlin/main") {
            exclude(
                "com/calculator/Application.class",
                "com/calculator/ApplicationKt.class"
            )
        }
    )
    reports {
        xml.required.set(true)
        html.required.set(true)
    }
}
