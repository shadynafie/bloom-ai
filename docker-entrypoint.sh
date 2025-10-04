#!/bin/sh
set -e

echo "🌸 Starting Bloom AI..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL..."
until nc -z -v -w30 $DB_HOST 5432
do
  echo "Waiting for database connection..."
  sleep 2
done
echo "✅ PostgreSQL is ready!"

# Run Prisma migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

echo "🚀 Starting application..."
exec "$@"
