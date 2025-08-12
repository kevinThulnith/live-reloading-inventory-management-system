#!/bin/sh

# Exit on any error
set -e

echo "Starting Django application..."

# Debug information
echo "Current directory: $(pwd)"
echo "Directory listing:"
ls -la

# Create database directory with maximum permissions
echo "Setting up database directory with proper permissions..."
mkdir -p /app/db
chmod 755 /app/db

# Ensure the database file exists and has proper permissions
if [ ! -f /app/db/db.sqlite3 ]; then
    echo "Creating database file..."
    touch /app/db/db.sqlite3
fi
chmod 644 /app/db/db.sqlite3

echo "Database directory permissions:"
ls -la /app/db

# Run database migrations
echo "Running database migrations..."
python manage.py migrate --noinput

# Create superuser if specified
if [ -n "$DJANGO_SUPERUSER_EMAIL" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
    echo "Creating superuser..."
    python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
email = '$DJANGO_SUPERUSER_EMAIL'
password = '$DJANGO_SUPERUSER_PASSWORD'
if not User.objects.filter(email=email).exists():
    User.objects.create_superuser(
        username=email,  # Use email as username
        email=email,
        password=password
    )
    print('Superuser created successfully')
else:
    print('Superuser already exists')
"
fi

# Execute the main command
echo "Starting application with command: $@"
exec "$@"