# AI Commerce Template

Monorepo template thương mại điện tử tích hợp AI, sử dụng **pnpm workspace** và **Turborepo**.

## 🏗️ Cấu trúc dự án

```
ai-commerce-template/
├── apps/
│   ├── be/                     # NestJS Backend (Hexagonal Architecture)
│   └── fe/                     # Nuxt Module Frontend & Playground
├── docker/                     # Cấu hình Docker & Docker Compose
│   ├── be/
│   │   ├── Dockerfile          # Production Dockerfile cho Backend
│   │   ├── Dockerfile.dev      # Development Dockerfile cho Backend
│   │   ├── docker-entrypoint.sh    # Production entrypoint script
│   │   └── docker-entrypoint.dev.sh# Development entrypoint script
│   ├── fe/
│   │   ├── Dockerfile          # Production Dockerfile cho Frontend
│   │   └── Dockerfile.dev      # Development Dockerfile cho Frontend
│   ├── docker-compose.yml      # Compose Production
│   ├── docker-compose.dev.yml  # Compose Development (Hot-reload)
│   └── README.md
├── .dockerignore               # Bỏ qua file khi build Docker image
├── .env.example                # Cấu hình biến môi trường mẫu
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── turbo.json
└── package.json
```

## 🚀 Khởi chạy nhanh với Docker

```bash
# 1. Tạo file biến môi trường từ mẫu
cp .env.example .env

# 2. Khởi chạy toàn bộ hệ thống ở chế độ Development (Hot reload)
docker compose -f docker/docker-compose.dev.yml up --build

# Hoặc khởi chạy chế độ Production
docker compose -f docker/docker-compose.yml up --build -d
```

### Các cổng dịch vụ mặc định:
- **Backend API**: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
- **Frontend App**: [http://localhost:3001](http://localhost:3001)
- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`

Chi tiết xem tại [`docker/README.md`](file:///home/minh/Code/ai-commerce-template/docker/README.md).


