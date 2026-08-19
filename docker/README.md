# Hướng dẫn sử dụng Docker cho Monorepo (`ai-commerce-template`)

Hệ thống Docker được thiết lập tối ưu cho cấu trúc Monorepo sử dụng **pnpm workspace**, hỗ trợ cả môi trường **Development** (hot-reload) và **Production** (multi-stage build tối ưu dung lượng).

---

## Cấu trúc thư mục Docker

```
ai-commerce-template/
├── .env.example                # File mẫu cấu hình biến môi trường tại root
├── .dockerignore               # Bỏ qua các file không cần thiết khi build image
└── docker/
    ├── be/
    │   ├── Dockerfile              # Production Dockerfile cho Backend (NestJS)
    │   ├── Dockerfile.dev          # Development Dockerfile cho Backend (Hot-reload)
    │   ├── docker-entrypoint.sh    # Production entrypoint (chạy Prisma migration tự động)
    │   └── docker-entrypoint.dev.sh# Dev entrypoint (generate client & apply migration)
    ├── fe/
    │   ├── Dockerfile              # Production Dockerfile cho Frontend (Nuxt)
    │   └── Dockerfile.dev          # Development Dockerfile cho Frontend (Hot-reload)
    ├── docker-compose.yml          # Compose cho môi trường Production / Standard
    ├── docker-compose.dev.yml      # Compose cho môi trường Local Development
    └── README.md                   # Tài liệu hướng dẫn
```

---

## 1. Chuẩn bị môi trường

Tạo file `.env` tại thư mục root từ `.env.example`:

```bash
cp .env.example .env
```

---

## 2. Chạy môi trường Development (Khuyên dùng khi lập trình)

Cấu hình `docker-compose.dev.yml` sử dụng `Dockerfile.dev`, `docker-entrypoint.dev.sh` và gắn source code vào container (Volume Mounts), giúp code tự động reload khi bạn chỉnh sửa:

```bash
# Từ thư mục gốc dự án
docker compose -f docker/docker-compose.dev.yml up --build

# Hoặc chạy dưới dạng background (detached mode)
docker compose -f docker/docker-compose.dev.yml up -d --build
```

### Các dịch vụ sẵn sàng tại:
- **Backend (NestJS API)**: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
- **Frontend (Nuxt Playground)**: [http://localhost:3001](http://localhost:3001)
- **PostgreSQL**: `localhost:5432` (`postgres:postgres`, DB: `ai_commerce`)
- **Redis**: `localhost:6379`

---

## 3. Chạy môi trường Production

Cấu hình `docker-compose.yml` sử dụng `Dockerfile` multi-stage build, `docker-entrypoint.sh`, loại bỏ devDependencies và source code thừa:

```bash
# Build và khởi chạy tất cả services
docker compose -f docker/docker-compose.yml up --build -d
```

---

## 4. Các lệnh quản trị hữu ích

### Xem logs của containers:
```bash
# Xem log toàn bộ services
docker compose -f docker/docker-compose.dev.yml logs -f

# Xem log riêng Backend
docker compose -f docker/docker-compose.dev.yml logs -f backend

# Xem log riêng Frontend
docker compose -f docker/docker-compose.dev.yml logs -f frontend
```

### Dừng các containers:
```bash
# Dừng và giữ lại volumes dữ liệu (Postgres, Redis)
docker compose -f docker/docker-compose.dev.yml down

# Dừng và xoá toàn bộ volumes (Reset DB)
docker compose -f docker/docker-compose.dev.yml down -v
```

### Chạy Prisma Migrations trong Backend container:
```bash
docker compose -f docker/docker-compose.dev.yml exec backend pnpm --filter be prisma migrate dev
```

### Truy cập Database qua PostgreSQL CLI:
```bash
docker compose -f docker/docker-compose.dev.yml exec postgres psql -U postgres -d ai_commerce
```

### Kiểm tra Redis CLI:
```bash
docker compose -f docker/docker-compose.dev.yml exec redis redis-cli ping
```
