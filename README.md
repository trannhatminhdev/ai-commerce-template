# AI Commerce Template

Monorepo template thương mại điện tử tích hợp AI, sử dụng **pnpm workspace** và **Turborepo**.

## 🏗️ Cấu trúc dự án

```
ai-commerce-template/
├── apps/
│   ├── be/                     # NestJS Backend (Hexagonal Architecture)
│   └── fe/                     # Nuxt Module Frontend & Playground
├── .env.example                # Cấu hình biến môi trường mẫu
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── turbo.json
└── package.json
```

## 🚀 Khởi chạy dự án

```bash
# 1. Cài đặt dependencies
pnpm install

# 2. Tạo file biến môi trường từ mẫu
cp .env.example .env

# 3. Khởi chạy toàn bộ hệ thống ở chế độ Development
pnpm dev

# Hoặc khởi chạy riêng lẻ từng app
pnpm --filter be dev          # Backend (http://localhost:3000/api/v1)
pnpm --filter @ai-commerce/fe dev  # Frontend (http://localhost:3001)
```

### Các cổng dịch vụ mặc định:
- **Backend API**: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
- **Frontend App**: [http://localhost:3001](http://localhost:3001)



