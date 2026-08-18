# Quy tắc Monorepo (pnpm Workspace + Turborepo)

Dự án sử dụng **pnpm workspace** + **Turborepo** để quản lý monorepo.
Agent PHẢI tuân thủ các quy tắc sau.

## Cấu trúc Monorepo

```
/ (root)
├── apps/
│   ├── be/          # NestJS Backend
│   └── fe/          # Nuxt Module Frontend
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── turbo.json
└── package.json
```

## Quy tắc bắt buộc

### 1. Quản lý Dependencies

- **LUÔN** chạy `pnpm install` từ **thư mục root** của monorepo
- Để thêm dependency cho workspace cụ thể, dùng filter:
  ```bash
  # Thêm dependency cho Backend
  pnpm --filter be add <package-name>
  
  # Thêm devDependency cho Frontend
  pnpm --filter @ai-commerce/fe add -D <package-name>
  ```
- **KHÔNG BAO GIỜ** chạy `npm install` hoặc `yarn add` — dự án dùng **pnpm**
- **KHÔNG** xoá hoặc sửa trực tiếp file `pnpm-lock.yaml`

### 2. Chạy Scripts

- Dùng Turborepo để chạy scripts song song:
  ```bash
  pnpm turbo dev        # Chạy dev cho tất cả workspaces
  pnpm turbo build      # Build tất cả workspaces
  ```
- Hoặc chạy cho workspace cụ thể:
  ```bash
  pnpm --filter be dev           # Dev Backend
  pnpm --filter @ai-commerce/fe dev   # Dev Frontend
  ```

### 3. Workspace Names

| Workspace | Package Name | Thư mục |
|-----------|-------------|---------|
| Backend | `be` | `apps/be` |
| Frontend | `@ai-commerce/fe` | `apps/fe` |

### 4. Docker

- Thư mục `docker/` chứa cấu hình Docker cho dự án
- Khi thêm service mới (Redis, Elasticsearch, ...), cập nhật docker-compose tương ứng

### 5. Shared Code

- Nếu cần chia sẻ code giữa BE và FE (types, constants), tạo thêm package trong `packages/`
- Đăng ký package mới trong `pnpm-workspace.yaml`
