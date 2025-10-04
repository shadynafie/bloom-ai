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

# Push Prisma schema to database (creates tables if they don't exist)
echo "🔄 Pushing database schema..."
npx prisma db push --skip-generate

echo "🚀 Starting application..."
exec "$@"
