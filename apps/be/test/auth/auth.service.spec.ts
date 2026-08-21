/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { AuthService } from '../../src/modules/auth/application/services/auth.service';
import { ITokenRepository } from '../../src/modules/auth/application/interfaces/token-repository.interface';
import { UserService } from '../../src/modules/users/application/services/user.service';
import { Role } from '../../src/shared/constants/role.enum';

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let tokenRepository: jest.Mocked<ITokenRepository>;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    // Create mocks
    tokenRepository = {
      create: jest.fn(),
      findByToken: jest.fn(),
      revokeToken: jest.fn(),
      revokeTokensByUser: jest.fn(),
    };

    userService = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    configService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ITokenRepository, useValue: tokenRepository },
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should create a root admin if it does not exist', async () => {
      userService.findByEmail.mockResolvedValue(null);
      configService.get.mockImplementation((key: string) => {
        if (key === 'ADMIN_ROOT_EMAIL') return 'admin@gmail.com';
        if (key === 'ADMIN_ROOT_PASSWORD') return 'admin123';
        return undefined;
      });
      userService.create.mockResolvedValue({ id: 1 } as any);

      await service.onModuleInit();

      expect(userService.findByEmail).toHaveBeenCalledWith('admin@gmail.com');
      expect(configService.get).toHaveBeenCalledWith('ADMIN_ROOT_PASSWORD');
      expect(userService.create).toHaveBeenCalledWith({
        email: 'admin@gmail.com',
        passwordHash: 'admin123',
        fullName: 'System Admin',
        role: Role.ADMIN,
      });
    });

    it('should not create a root admin if it already exists', async () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'ADMIN_ROOT_EMAIL') return 'admin@gmail.com';
        return undefined;
      });
      userService.findByEmail.mockResolvedValue({ id: 1 } as any);

      await service.onModuleInit();

      expect(userService.findByEmail).toHaveBeenCalledWith('admin@gmail.com');
      expect(userService.create).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        email: 'test@test.com',
        password: 'password',
        fullName: 'Test',
        phoneNumber: '123',
      };
      const createdUser = { id: 1, ...registerDto };

      userService.create.mockResolvedValue(createdUser as any);

      const result = await service.register(registerDto);

      expect(userService.create).toHaveBeenCalledWith({
        email: registerDto.email,
        passwordHash: registerDto.password,
        fullName: registerDto.fullName,
        phoneNumber: registerDto.phoneNumber,
      });
      expect(result).toEqual({
        message: 'User registered successfully',
        user: { id: 1, email: 'test@test.com', fullName: 'Test' },
      });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      userService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'test@test.com', password: 'password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      userService.findByEmail.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        passwordHash: 'hash',
      } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@test.com', password: 'password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return access and refresh tokens when credentials are valid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        fullName: 'Test',
        passwordHash: 'hash',
        role: Role.USER,
      };
      userService.findByEmail.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      jwtService.sign
        .mockReturnValueOnce('access_token')
        .mockReturnValueOnce('refresh_token');
      tokenRepository.create.mockResolvedValue({ id: 1 } as any);

      const result = await service.login({
        email: 'test@test.com',
        password: 'password',
      });

      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(tokenRepository.create).toHaveBeenCalled();
      expect(result).toEqual({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
        user: {
          id: 1,
          email: 'test@test.com',
          fullName: 'Test',
          role: Role.USER,
        },
      });
    });
  });

  describe('refreshToken', () => {
    it('should throw UnauthorizedException if token record is not found', async () => {
      tokenRepository.findByToken.mockResolvedValue(null);

      await expect(service.refreshToken('some_token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token is revoked', async () => {
      tokenRepository.findByToken.mockResolvedValue({
        id: 1,
        revokedAt: new Date(),
      } as any);

      await expect(service.refreshToken('some_token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token is expired', async () => {
      tokenRepository.findByToken.mockResolvedValue({
        id: 1,
        expiresAt: new Date(Date.now() - 1000),
      } as any);

      await expect(service.refreshToken('some_token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should issue new tokens if refresh token is valid', async () => {
      tokenRepository.findByToken.mockResolvedValue({
        id: 1,
        expiresAt: new Date(Date.now() + 10000),
      } as any);
      jwtService.verify.mockReturnValue({ sub: 1, email: 'test@test.com' });
      userService.findById.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
      } as any);

      jwtService.sign
        .mockReturnValueOnce('new_access')
        .mockReturnValueOnce('new_refresh');
      tokenRepository.revokeToken.mockResolvedValue(undefined);
      tokenRepository.create.mockResolvedValue({ id: 2 } as any);

      const result = await service.refreshToken('valid_token');

      expect(tokenRepository.revokeToken).toHaveBeenCalledWith(1);
      expect(tokenRepository.create).toHaveBeenCalled();
      expect(result).toEqual({
        accessToken: 'new_access',
        refreshToken: 'new_refresh',
      });
    });
  });

  describe('logout', () => {
    it('should revoke token if valid', async () => {
      tokenRepository.findByToken.mockResolvedValue({
        id: 1,
        revokedAt: null,
      } as any);
      tokenRepository.revokeToken.mockResolvedValue(undefined);

      const result = await service.logout('some_token');

      expect(tokenRepository.revokeToken).toHaveBeenCalledWith(1);
      expect(result).toEqual({ success: true });
    });

    it('should do nothing if token already revoked', async () => {
      tokenRepository.findByToken.mockResolvedValue({
        id: 1,
        revokedAt: new Date(),
      } as any);

      const result = await service.logout('some_token');

      expect(tokenRepository.revokeToken).not.toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });
  });
});
