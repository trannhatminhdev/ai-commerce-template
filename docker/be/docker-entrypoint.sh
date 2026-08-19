#!/bin/sh
set -e

echo "🚀 [Prod Entrypoint] Initializing Backend..."

# Chạy Prisma migration nếu có schema trong production package
if [ -f "apps/be/prisma/schema.prisma" ]; then
  echo "📦 Running Prisma migrations..."
  npx prisma migrate deploy || true
elif [ -f "prisma/schema.prisma" ]; then
  echo "📦 Running Prisma migrations..."
  npx prisma migrate deploy || true
fi

echo "✨ Starting Backend application..."
exec "$@"
