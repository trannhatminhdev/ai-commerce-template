import {
  Inject,
  Injectable,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../../../users/application/services/user.service';
import { LoginDto } from '../../presentation/http/dtos/login.dto';
import { RegisterDto } from '../../presentation/http/dtos/register.dto';
import { ITokenRepository } from '../interfaces/token-repository.interface';
import { Role } from '../../../../shared/constants/role.enum';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject(ITokenRepository)
    private readonly tokenRepository: ITokenRepository,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    // Seed default root admin account
    const rootAdminEmail = 'admin@gmail.com';
    const existingAdmin = await this.userService.findByEmail(rootAdminEmail);
    if (!existingAdmin) {
      await this.userService.create({
        email: rootAdminEmail,
        passwordHash:
          this.configService.get<string>('ADMIN_ROOT_PASSWORD') || 'admin123',
        fullName: 'System Admin',
        role: Role.ADMIN,
      });
    }
  }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.create({
      email: registerDto.email,
      passwordHash: registerDto.password, // UserService will hash this
      fullName: registerDto.fullName,
      phoneNumber: registerDto.phoneNumber,
    });

    // Auto login after register or just return user
    return {
      message: 'User registered successfully',
      user: { id: user.id, email: user.email, fullName: user.fullName },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    // Generate refresh token
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d', // Refresh token lives longer
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Lưu refresh token vào DB
    await this.tokenRepository.create({
      user: { connect: { id: user.id } },
      refreshToken,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role as Role,
      },
    };
  }

  async refreshToken(token: string) {
    const tokenRecord = await this.tokenRepository.findByToken(token);

    if (
      !tokenRecord ||
      tokenRecord.revokedAt ||
      tokenRecord.expiresAt < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    try {
      // Validate token
      const payload = this.jwtService.verify<{ sub: number; email: string }>(
        token,
      );

      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Vô hiệu hóa token cũ
      await this.tokenRepository.revokeToken(tokenRecord.id);

      // Cấp mới
      const newPayload = { sub: user.id, email: user.email };
      const newAccessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: '7d',
      });

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Cập nhật lại
      await this.tokenRepository.create({
        user: { connect: { id: user.id } },
        refreshToken: newRefreshToken,
        expiresAt,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async logout(token: string) {
    const tokenRecord = await this.tokenRepository.findByToken(token);
    if (tokenRecord && !tokenRecord.revokedAt) {
      await this.tokenRepository.revokeToken(tokenRecord.id);
    }
    return { success: true };
  }
}
