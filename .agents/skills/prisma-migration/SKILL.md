---
name: prisma-migration
description: >-
  Quy trình cập nhật Database Schema và chạy migration với Prisma cho Backend.
  Kích hoạt khi người dùng yêu cầu thay đổi database, thêm/sửa/xoá bảng, cột,
  hoặc quan hệ giữa các bảng.
---

# Quy trình Prisma Migration

Backend sử dụng **Prisma ORM** (`@prisma/client`) để tương tác với database.
Khi cần thay đổi database schema, PHẢI tuân theo quy trình sau.

## Vị trí file

- Schema: `apps/be/prisma/schema.prisma`
- Migrations: `apps/be/prisma/migrations/`
- Working directory cho các lệnh Prisma: `apps/be/`

## Quy trình từng bước

### Bước 1: Chỉnh sửa Schema

Mở file `apps/be/prisma/schema.prisma` và thêm/sửa model:

```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  price       Float
  description String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  @@map("products")
}
```

**Quy tắc đặt tên:**
- Model name: PascalCase (VD: `Product`, `OrderItem`)
- Field name: camelCase (VD: `createdAt`, `userId`)
- Dùng `@map()` để map field sang snake_case trong DB
- Dùng `@@map()` để map table name sang snake_case / plural

### Bước 2: Format Schema

```bash
cd apps/be && npx prisma format
```

### Bước 3: Tạo Migration

```bash
cd apps/be && npx prisma migrate dev --name <tên_mô_tả_ngắn_gọn>
```

**Quy tắc đặt tên migration:**
- Dùng snake_case, viết thường
- Mô tả ngắn gọn thay đổi: `add_products_table`, `add_category_to_product`, `remove_legacy_fields`

### Bước 4: Generate Prisma Client

```bash
cd apps/be && npx prisma generate
```

Lệnh này cập nhật TypeScript types cho `@prisma/client` để code nhận được types mới.

### Bước 5: Cập nhật Repository

Sau khi schema thay đổi, cập nhật các Repository (Adapter) tương ứng trong
`apps/be/src/modules/<module>/infrastructure/repositories/` để sử dụng Prisma Client
với model mới.

## Các lệnh Prisma hữu ích

| Lệnh | Mô tả |
|-------|--------|
| `npx prisma studio` | Mở GUI quản lý data trong browser |
| `npx prisma db push` | Push schema trực tiếp (KHÔNG tạo migration, dùng cho prototyping) |
| `npx prisma migrate reset` | Reset toàn bộ DB và chạy lại tất cả migrations |
| `npx prisma migrate status` | Kiểm tra trạng thái migration |

## Lưu ý quan trọng

1. **LUÔN** chạy lệnh Prisma từ thư mục `apps/be/` (nơi chứa `prisma/schema.prisma`)
2. **KHÔNG** dùng `db push` cho production, chỉ dùng `migrate dev`
3. Sau khi tạo migration, **PHẢI** chạy `prisma generate` để cập nhật client
4. Khi thêm model mới, nhớ tạo luôn module NestJS tương ứng (xem skill `create-nest-module`)
