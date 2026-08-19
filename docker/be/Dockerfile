# =============================================================
# Base Stage: Cài đặt Node.js & pnpm
# =============================================================
FROM node:26-alpine AS base

# Cài đặt libc6-compat & openssl cho Prisma engine và native dependencies
RUN apk add --no-cache libc6-compat openssl

# Cài đặt pnpm
RUN npm install -g pnpm@11.22.0

WORKDIR /app

# =============================================================
# Dependencies Stage: Cài đặt dependencies cho riêng Backend
# =============================================================
FROM base AS dependencies

COPY apps/be/package.json ./package.json

# Cài đặt tất cả dependencies của Backend
RUN pnpm install --ignore-scripts && pnpm rebuild

# =============================================================
# Development Stage: Chạy NestJS backend với hot-reload
# =============================================================
FROM base AS dev

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY apps/be/ .

# Cài đặt entrypoint script dev
COPY docker/be/docker-entrypoint.dev.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENV NODE_ENV=development
ENV PORT=3000

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pnpm", "start:dev"]

# =============================================================
# Builder Stage: Build NestJS backend cho Production
# =============================================================
FROM base AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY apps/be/ .

# Generate Prisma Client nếu có schema
RUN if [ -f prisma/schema.prisma ]; then npx prisma generate; fi

# Build Backend
RUN pnpm build

# Loại bỏ devDependencies để tối ưu kích thước image
RUN pnpm prune --prod

# =============================================================
# Production Runner Stage: Minimal runtime image
# =============================================================
FROM node:26-alpine AS runner

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Tạo non-root user vì mục đích bảo mật
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

# Cài đặt entrypoint script prod
COPY docker/be/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER nestjs

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]
