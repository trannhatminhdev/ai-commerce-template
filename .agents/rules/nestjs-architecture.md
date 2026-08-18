# Quy tắc Kiến trúc Backend (NestJS + Hexagonal Architecture)

Dự án Backend (`apps/be`) tuân theo **Hexagonal Architecture (Ports & Adapters)**.
Agent PHẢI tuân thủ các quy tắc sau khi viết code Backend.

## Cấu trúc dự án

```
apps/be/src/
├── core/           # Infrastructure cốt lõi (config, database, filters, interceptors)
├── shared/         # Utilities, decorators, helpers dùng chung (@Global module)
├── modules/        # Feature modules (mỗi module = 1 bounded context)
└── main.ts         # Entry point
```

## Quy tắc bắt buộc

### 1. Phân tầng nghiêm ngặt

| Layer | Thư mục | Trách nhiệm | KHÔNG được làm |
|-------|---------|-------------|----------------|
| **Presentation** | `presentation/http/` | Nhận request, validate DTO, trả response | Chứa business logic |
| **Application** | `application/services/` | Xử lý business logic, orchestrate | Import trực tiếp ORM/DB |
| **Domain** | `domain/entities/` | Entities, value objects, domain rules | Phụ thuộc framework |
| **Infrastructure** | `infrastructure/repositories/` | Tương tác DB, external APIs | Chứa business logic |

### 2. Dependency Injection qua Interface

- Service PHẢI inject Repository qua **Interface (Port)** sử dụng Symbol token
- KHÔNG inject trực tiếp class Repository vào Service
- Trong Module, binding DI: `{ provide: IXxxRepository, useClass: XxxRepository }`

### 3. DTO & Validation

- Mọi request body PHẢI sử dụng DTO class
- DTO PHẢI dùng decorators từ `class-validator` (`@IsNotEmpty`, `@IsEmail`, `@IsString`, ...)
- Global `ValidationPipe` đã được cấu hình với `whitelist: true`, `transform: true`, `forbidNonWhitelisted: true`

### 4. Error Handling

- Sử dụng NestJS built-in exceptions (`NotFoundException`, `BadRequestException`, `UnauthorizedException`, ...)
- KHÔNG dùng `throw new Error()` trực tiếp trong Controller/Service (trừ domain logic thuần)
- Custom exceptions đặt trong `core/filters/`

### 5. Module Organization

- Mỗi feature là 1 module độc lập trong `modules/`
- Infrastructure dùng chung (config, database connection) đặt trong `core/`
- Utilities, decorators dùng chung đặt trong `shared/` (`@Global()` module)
- Feature module mới PHẢI được import vào `app.module.ts`

### 6. API Convention

- Global prefix: `api/v1` (đã cấu hình trong `main.ts`)
- CORS đã được bật
- Route naming: kebab-case (VD: `/api/v1/order-items`)

### 7. Event-Driven Communication

- Dự án đã cấu hình `@nestjs/event-emitter` cho giao tiếp bất đồng bộ giữa các modules
- Ưu tiên dùng Event thay vì gọi trực tiếp Service của module khác khi có thể
- Điều này giúp dễ dàng tách microservices sau này
