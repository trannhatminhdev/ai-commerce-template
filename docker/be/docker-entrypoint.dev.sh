#!/bin/sh
set -e

echo "🚀 [Dev Entrypoint] Initializing Backend development environment..."

# Nếu có Prisma schema, tiến hành generate client và apply migration
if [ -f "prisma/schema.prisma" ]; then
  echo "📦 Generating Prisma Client..."
  npx prisma generate || true

  echo "🔄 Applying Prisma migrations..."
  npx prisma migrate deploy || true
elif [ -f "apps/be/prisma/schema.prisma" ]; then
  echo "📦 Generating Prisma Client..."
  npx prisma generate || true

  echo "🔄 Applying Prisma migrations..."
  npx prisma migrate deploy || true
fi

echo "✨ Starting Backend in development mode with watch..."
exec "$@"
