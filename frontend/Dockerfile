# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy and Install dependencies
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit --no-fund --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies AFTER build
RUN npm prune --omit=dev

# Production stage
FROM nginx:1.25-alpine-slim AS production

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/* \
    && rm -rf /var/cache/apk/* \
    && rm -rf /var/log/nginx/* \
    && rm -rf /tmp/* \
    && rm -rf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]