import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AdminAuthController } from '../../src/modules/auth/presentation/http/admin-auth.controller';
import { AuthService } from '../../src/modules/auth/application/services/auth.service';
import { JwtAuthGuard } from '../../src/modules/auth/presentation/http/guards/jwt-auth.guard';
import { RolesGuard } from '../../src/modules/auth/presentation/http/guards/roles.guard';
import { Role } from '../../src/shared/constants/role.enum';

describe('AdminAuthController', () => {
  let controller: AdminAuthController;
  let authService: Partial<Record<keyof AuthService, jest.Mock>>;

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
      logout: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminAuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AdminAuthController>(AdminAuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user is not admin', async () => {
      const dto = { email: 'user@test.com', password: 'password' };
      const loginResult = {
        accessToken: 'access',
        refreshToken: 'refresh',
        user: {
          id: 1,
          email: 'user@test.com',
          fullName: 'User',
          role: Role.USER,
        },
      };

      authService.login!.mockResolvedValue(loginResult);

      await expect(controller.login(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return login result if user is admin', async () => {
      const dto = { email: 'admin@test.com', password: 'password' };
      const loginResult = {
        accessToken: 'access',
        refreshToken: 'refresh',
        user: {
          id: 1,
          email: 'admin@test.com',
          fullName: 'Admin',
          role: Role.ADMIN,
        },
      };

      authService.login!.mockResolvedValue(loginResult);

      const result = await controller.login(dto);

      expect(result).toEqual(loginResult);
    });
  });

  describe('logout', () => {
    it('should logout admin', async () => {
      const expectedResult = { success: true };
      authService.logout!.mockResolvedValue(expectedResult);

      const result = await controller.logout('some_token');

      expect(authService.logout).toHaveBeenCalledWith('some_token');
      expect(result).toEqual(expectedResult);
    });
  });
});
