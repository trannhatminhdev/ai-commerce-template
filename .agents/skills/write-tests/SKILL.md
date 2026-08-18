---
name: write-tests
description: >-
  Hướng dẫn viết unit tests cho Backend (Jest + NestJS Testing) và Frontend (Vitest + @nuxt/test-utils).
  Kích hoạt khi người dùng yêu cầu viết test, kiểm tra, hoặc tăng coverage.
---

# Viết Unit Tests

## Backend Tests (Jest + NestJS Testing)

### Cấu hình
- Framework: **Jest** với **ts-jest**
- Test file pattern: `*.spec.ts`
- Đặt test file cùng thư mục với file cần test

### Quy tắc viết test cho Service

Service inject Repository qua Interface (Port), nên khi test cần **mock** Repository.

```typescript
// auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { IAuthRepository } from '../interfaces/auth-repository.interface';

describe('AuthService', () => {
  let service: AuthService;
  let mockRepository: jest.Mocked<IAuthRepository>;

  beforeEach(async () => {
    // Tạo mock repository
    mockRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: IAuthRepository,  // Provide bằng Symbol token
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access token when user exists', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      mockRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.login('test@example.com');

      expect(result).toHaveProperty('accessToken');
      expect(result.user).toEqual(mockUser);
      expect(mockRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should throw error when user not found', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);

      await expect(service.login('notfound@example.com')).rejects.toThrow('User not found');
    });
  });
});
```

### Quy tắc viết test cho Controller

Controller test nên dùng `@nestjs/testing` để tạo module với Service đã mock.

```typescript
// auth.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../../application/services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let mockService: jest.Mocked<Partial<AuthService>>;

  beforeEach(async () => {
    mockService = {
      ping: jest.fn().mockReturnValue('Auth module is running!'),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  // ... tests
});
```

### Chạy tests

```bash
cd apps/be && pnpm test              # Chạy tất cả tests
cd apps/be && pnpm test:watch        # Chạy watch mode
cd apps/be && pnpm test:cov          # Chạy với coverage report
```

---

## Frontend Tests (Vitest + @nuxt/test-utils)

### Cấu hình
- Framework: **Vitest**
- Test file pattern: `*.spec.ts` hoặc `*.test.ts`

### Quy tắc viết test cho Composable

```typescript
// useCart.spec.ts
import { describe, it, expect } from 'vitest'
import { useCart } from './useCart'

describe('useCart', () => {
  it('should add item to cart', () => {
    const { items, addItem } = useCart()

    addItem({ id: 1, name: 'Product A', price: 100 })

    expect(items.value).toHaveLength(1)
    expect(items.value[0].name).toBe('Product A')
  })
})
```

### Chạy tests

```bash
cd apps/fe && pnpm test              # Chạy tất cả tests
cd apps/fe && pnpm test:watch        # Chạy watch mode
```

## Nguyên tắc chung

1. Mỗi test file đặt **cùng thư mục** với file nguồn, đặt tên `<tên>.spec.ts`
2. Mock tất cả dependencies bên ngoài (database, API calls, ...)
3. Test phải **độc lập**, không phụ thuộc thứ tự chạy
4. Dùng `describe` để nhóm test theo method/function
5. Tên test case phải mô tả rõ ràng hành vi mong đợi: `should <hành_vi> when <điều_kiện>`
