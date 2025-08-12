# Multi-stage build for smallest possible Django container
FROM python:3.13-alpine AS builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies for building Python packages
RUN apk add --no-cache \
    gcc \
    musl-dev \
    jpeg-dev \
    zlib-dev \
    libffi-dev \
    cairo-dev \
    pango-dev \
    gdk-pixbuf-dev

# Create and set work directory
WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install dependencies in a virtual environment
RUN python -m venv /opt/venv && \
    /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install -r requirements.txt

# Copy project files
COPY . .

# Collect static files
RUN /opt/venv/bin/python manage.py collectstatic --noinput

# Production stage
FROM python:3.13-alpine AS production

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=backend.settings \
    PATH="/opt/venv/bin:$PATH"

# Install runtime dependencies only
RUN apk add --no-cache \
    jpeg \
    zlib \
    libffi \
    cairo \
    pango \
    gdk-pixbuf \
    sqlite \
    && addgroup -g 1000 -S appgroup \
    && adduser -u 1000 -S appuser -G appgroup

# Set work directory
WORKDIR /app

# Copy the entire virtual environment
COPY --from=builder /opt/venv /opt/venv

# Copy application code
COPY --from=builder /app/manage.py /app/
COPY --from=builder /app/backend /app/backend
COPY --from=builder /app/api /app/api
COPY --from=builder /app/staticfiles /app/staticfiles
# Copy any other necessary application directories here

# Copy entrypoint script
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

# Create directories for media and database
# IMPORTANT: No longer setting up permissions here - we'll use root
RUN mkdir -p /app/media /app/db

# NOTE: We're no longer switching to non-root user for better database access
# Instead, we'll run as root for now to debug the issue

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/admin/', timeout=10)" || exit 1

# Set entrypoint
ENTRYPOINT ["/app/docker-entrypoint.sh"]

# Default command
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "backend.asgi:application"]