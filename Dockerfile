# syntax=docker/dockerfile:1
# Enable BuildKit for cache mounts and faster builds: DOCKER_BUILDKIT=1

# ========== Stage 1: Build Backend (Kotlin/Micronaut) ==========
FROM gradle:8.5-jdk17-alpine AS backend-builder
WORKDIR /app/backend

COPY calculator-backend/gradle ./gradle
COPY calculator-backend/build.gradle.kts calculator-backend/settings.gradle.kts calculator-backend/gradle.properties ./
COPY calculator-backend/openapi.properties ./
COPY calculator-backend/src ./src

RUN --mount=type=cache,target=/home/gradle/.gradle \
    gradle build --no-daemon -x test shadowJar && \
    cp /app/backend/build/libs/calculator-backend-*-all.jar /app/backend/build/libs/backend-fat.jar

# ========== Stage 2: Build Frontend (React/Vite) ==========
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

ENV VITE_API_URL=/api/v1

COPY calculator-frontend/package.json calculator-frontend/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY calculator-frontend/ ./
RUN npm run build

# ========== Stage 3: Runtime (Alpine: JRE + Nginx) ==========
FROM eclipse-temurin:17-jre-alpine
RUN apk add --no-cache nginx && mkdir -p /etc/nginx/http.d

WORKDIR /app

COPY --from=backend-builder /app/backend/build/libs/backend-fat.jar ./backend.jar
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Nginx: Alpine includes http.d inside http block (conf.d is root-level)
RUN echo 'server { \
    listen 80 default_server; \
    root /usr/share/nginx/html; \
    index index.html; \
    add_header X-Content-Type-Options "nosniff" always; \
    add_header X-Frame-Options "DENY" always; \
    add_header Content-Security-Policy "default-src '\''self'\''; script-src '\''self'\''; style-src '\''self'\'' '\''unsafe-inline'\''; img-src '\''self'\'' data:; font-src '\''self'\'';" always; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location = /swagger-ui { return 301 /swagger-ui/; } \
    location = /swagger { return 301 /swagger/; } \
    location /api/ { \
        proxy_pass http://127.0.0.1:8080/api/; \
        proxy_http_version 1.1; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
    location /swagger-ui/ { \
        add_header X-Content-Type-Options "nosniff" always; \
        add_header X-Frame-Options "DENY" always; \
        add_header Content-Security-Policy "default-src '\''self'\''; script-src '\''self'\'' '\''unsafe-inline'\'' '\''unsafe-eval'\''; style-src '\''self'\'' '\''unsafe-inline'\''; img-src '\''self'\'' data:; font-src '\''self'\''; connect-src '\''self'\'';" always; \
        proxy_pass http://127.0.0.1:8080/swagger-ui/; \
        proxy_http_version 1.1; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
    location /swagger/ { \
        add_header X-Content-Type-Options "nosniff" always; \
        add_header X-Frame-Options "DENY" always; \
        add_header Content-Security-Policy "default-src '\''self'\''; script-src '\''self'\'' '\''unsafe-inline'\'' '\''unsafe-eval'\''; style-src '\''self'\'' '\''unsafe-inline'\''; img-src '\''self'\'' data:; font-src '\''self'\''; connect-src '\''self'\'';" always; \
        proxy_pass http://127.0.0.1:8080/swagger/; \
        proxy_http_version 1.1; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
}' > /etc/nginx/http.d/default.conf

RUN printf '%s\n' \
    '#!/bin/sh' \
    'set -e' \
    'if [ -n "$CORS_ALLOWED_ORIGINS" ]; then export MICRONAUT_SERVER_CORS_CONFIGURATIONS_WEB_ALLOWED_ORIGINS="$CORS_ALLOWED_ORIGINS"; fi' \
    'java -jar /app/backend.jar &' \
    'exec nginx -g "daemon off;"' > /entrypoint.sh && chmod +x /entrypoint.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget -q -O- http://127.0.0.1:80/api/v1/health || exit 1

ENTRYPOINT ["/entrypoint.sh"]
