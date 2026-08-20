/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/modules/auth/presentation/http/auth.controller';
import { AuthService } from '../../src/modules/auth/application/services/auth.service';
import { JwtAuthGuard } from '../../src/modules/auth/presentation/http/guards/jwt-auth.guard';
import { Role } from '../../src/shared/constants/role.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Partial<Record<keyof AuthService, jest.Mock>>;

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
      refreshToken: jest.fn(),
      logout: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register user', async () => {
      const dto = {
        email: 'test@test.com',
        password: 'password',
        fullName: 'Test',
        phoneNumber: '123',
      };
      const expectedResult = {
        message: 'success',
        user: { id: 1, email: 'test@test.com', fullName: 'Test' },
      };
      authService.register!.mockResolvedValue(expectedResult);

      const result = await controller.register(dto);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should login user', async () => {
      const dto = { email: 'test@test.com', password: 'password' };
      const expectedResult = {
        accessToken: 'access',
        refreshToken: 'refresh',
        user: {
          id: 1,
          email: 'test@test.com',
          fullName: 'Test',
          role: Role.USER,
        },
      };
      authService.login!.mockResolvedValue(expectedResult);

      const result = await controller.login(dto);

      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('refresh', () => {
    it('should refresh token', async () => {
      const expectedResult = {
        accessToken: 'new_access',
        refreshToken: 'new_refresh',
      };
      authService.refreshToken!.mockResolvedValue(expectedResult);

      const result = await controller.refresh('some_token');

      expect(authService.refreshToken).toHaveBeenCalledWith('some_token');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('logout', () => {
    it('should logout user', async () => {
      const expectedResult = { success: true };
      authService.logout!.mockResolvedValue(expectedResult);

      const result = await controller.logout('some_token');

      expect(authService.logout).toHaveBeenCalledWith('some_token');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getProfile', () => {
    it('should return user without passwordHash', () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        passwordHash: 'hash',
      } as any;
      const expectedResult = { id: 1, email: 'test@test.com' };

      const result = controller.getProfile(user);

      expect(result).toEqual(expectedResult);
    });
  });
});
