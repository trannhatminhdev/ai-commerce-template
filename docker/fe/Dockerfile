# =============================================================
# Base Stage: Cài đặt Node.js & pnpm
# =============================================================
FROM node:26-alpine AS base

# Cài đặt pnpm
RUN npm install -g pnpm@11.22.0

WORKDIR /app

# =============================================================
# Dependencies Stage: Cài đặt dependencies cho riêng Frontend
# =============================================================
FROM base AS dependencies

COPY apps/fe/package.json ./package.json
COPY apps/fe/playground/package.json ./playground/package.json

# Cài đặt dependencies cho Frontend
RUN pnpm install --ignore-scripts && pnpm rebuild

# =============================================================
# Development Stage: Chạy Nuxt Playground với hot-reload
# =============================================================
FROM base AS dev

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/playground/node_modules ./playground/node_modules
COPY apps/fe/ .

ENV NODE_ENV=development
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# =============================================================
# Builder Stage: Build Nuxt frontend cho Production
# =============================================================
FROM base AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/playground/node_modules ./playground/node_modules
COPY apps/fe/ .

# Chuẩn bị stub và build module + playground
RUN pnpm dev:prepare
RUN pnpm build

# Chuẩn bị output directory độc lập
RUN mkdir -p /prod/output && \
    if [ -d "/app/playground/.output" ]; then \
      cp -r /app/playground/.output/* /prod/output/; \
    elif [ -d "/app/.output" ]; then \
      cp -r /app/.output/* /prod/output/; \
    fi

# =============================================================
# Production Runner Stage: Minimal runtime image (Nitro engine)
# =============================================================
FROM node:26-alpine AS runner

RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Tạo non-root user vì mục đích bảo mật
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxtjs

COPY --from=builder --chown=nuxtjs:nodejs /prod/output /app/.output

USER nuxtjs

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
