# ========== Stage 1: Build Backend (Kotlin/Micronaut) ==========
FROM gradle:8.5-jdk17 AS backend-builder
WORKDIR /app/backend

COPY calculator-backend/gradle ./gradle
COPY calculator-backend/build.gradle.kts calculator-backend/settings.gradle.kts calculator-backend/gradle.properties ./
COPY calculator-backend/openapi.properties ./
COPY calculator-backend/src ./src

RUN gradle build --no-daemon -x test shadowJar && \
    cp /app/backend/build/libs/calculator-backend-*-all.jar /app/backend/build/libs/backend-fat.jar

# ========== Stage 2: Build Frontend (React/Vite) ==========
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# API en producción: mismo origen vía proxy nginx
ENV VITE_API_URL=/api/v1

COPY calculator-frontend/package.json calculator-frontend/package-lock.json ./
RUN npm ci

COPY calculator-frontend/ ./
RUN npm run build

# ========== Stage 3: Runtime (Backend + Nginx sirviendo frontend) ==========
FROM eclipse-temurin:17-jre-jammy
RUN apt-get update && apt-get install -y --no-install-recommends nginx && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Backend (fat JAR with Kotlin + all dependencies)
COPY --from=backend-builder /app/backend/build/libs/backend-fat.jar ./backend.jar

# Frontend estático
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Nginx: servir frontend y hacer proxy /api -> backend:8080
RUN echo 'server { \
    listen 80 default_server; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /api/ { \
        proxy_pass http://127.0.0.1:8080/api/; \
        proxy_http_version 1.1; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
}' > /etc/nginx/sites-available/default

# Script that starts backend then nginx (foreground). Use printf so newlines are written correctly.
RUN printf '%s\n' \
    '#!/bin/sh' \
    'set -e' \
    'export MICRONAUT_SERVER_CORS_CONFIGURATIONS_WEB_ALLOWED_ORIGINS="*"' \
    'java -jar /app/backend.jar &' \
    'exec nginx -g "daemon off;"' > /entrypoint.sh && chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
