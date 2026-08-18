---
name: create-nest-module
description: >-
  Quy trình tạo một NestJS feature module mới theo kiến trúc Hexagonal Architecture
  (Ports & Adapters) đúng chuẩn dự án ai-commerce-template. Kích hoạt khi người dùng
  yêu cầu tạo module, feature, hoặc CRUD mới cho Backend.
---

# Tạo NestJS Feature Module (Hexagonal Architecture)

Dự án Backend (`apps/be`) tuân theo kiến trúc **Hexagonal Architecture (Ports & Adapters)**
kết hợp với **NestJS Module System**. Khi tạo một module mới, PHẢI tuân thủ cấu trúc sau.

## Cấu trúc thư mục bắt buộc

Mỗi feature module đặt tại `apps/be/src/modules/<tên-module>/` với cấu trúc:

```
apps/be/src/modules/<tên-module>/
├── <tên-module>.module.ts              # NestJS Module definition
├── application/
│   ├── interfaces/
│   │   └── <tên>-repository.interface.ts  # Port (Interface) cho DI
│   └── services/
│       └── <tên>.service.ts              # Business logic (Application Layer)
├── domain/
│   └── entities/                         # Domain entities / value objects
├── infrastructure/
│   └── repositories/
│       └── <tên>.repository.ts           # Adapter (Database implementation)
└── presentation/
    └── http/
        ├── <tên>.controller.ts           # HTTP Controller
        └── dtos/
            └── <tên>.dto.ts              # Request/Response DTOs
```

## Quy tắc triển khai

### 1. Repository Interface (Port)
- Tạo file `application/interfaces/<tên>-repository.interface.ts`
- Export cả **Symbol** (dùng cho DI token) và **interface** (dùng cho type)
- Ví dụ tham khảo:

```typescript
export const IProductRepository = Symbol('IProductRepository');

export interface IProductRepository {
  findById(id: string): Promise<any>;
  findAll(): Promise<any[]>;
  save(data: any): Promise<any>;
  delete(id: string): Promise<void>;
}
```

### 2. Service (Application Layer)
- Tạo file `application/services/<tên>.service.ts`
- Inject repository thông qua **Interface (Port)** bằng decorator `@Inject()`, KHÔNG inject trực tiếp class Repository
- Toàn bộ business logic PHẢI nằm ở đây, KHÔNG đặt ở Controller

```typescript
@Injectable()
export class ProductService {
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}
}
```

### 3. Repository (Infrastructure / Adapter)
- Tạo file `infrastructure/repositories/<tên>.repository.ts`
- `implements` interface đã định nghĩa ở Port
- Đây là nơi duy nhất tương tác trực tiếp với Database (Prisma, TypeORM, ...)

### 4. Controller (Presentation Layer)
- Tạo file `presentation/http/<tên>.controller.ts`
- Controller chỉ làm 3 việc: nhận HTTP request, gọi Service, trả response
- KHÔNG chứa business logic
- Mọi request body / query params PHẢI qua DTO

### 5. DTO (Data Transfer Object)
- Tạo file `presentation/http/dtos/<tên>.dto.ts`
- PHẢI sử dụng decorators từ `class-validator` (`@IsNotEmpty`, `@IsEmail`, `@IsString`, ...)
- Global `ValidationPipe` trong `main.ts` sẽ tự động validate

### 6. Module Registration
- Tạo file `<tên-module>.module.ts` 
- Binding DI: map Interface (Port) → Class Repository (Adapter)
- **PHẢI** import module mới vào `apps/be/src/app.module.ts` trong section `// Feature Modules`

```typescript
@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: IProductRepository,
      useClass: ProductRepository,
    },
  ],
  exports: [ProductService],
})
export class ProductModule {}
```

## Checklist sau khi tạo module

- [ ] Tất cả các file theo cấu trúc thư mục ở trên đã được tạo
- [ ] Repository Interface có cả `Symbol` export và `interface` export
- [ ] Service inject qua Interface, không inject trực tiếp Repository class
- [ ] Controller không chứa business logic
- [ ] DTOs sử dụng `class-validator` decorators
- [ ] Module mới đã được import vào `app.module.ts`
- [ ] Code biên dịch thành công (không có TypeScript errors)
