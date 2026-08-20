import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './presentation/http/auth.controller';
import { AuthService } from './application/services/auth.service';
import { ITokenRepository } from './application/interfaces/token-repository.interface';
import { TokenRepository } from './infrastructure/repositories/token.repository';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './application/strategies/jwt.strategy';

import { AdminAuthController } from './presentation/http/admin-auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is missing in environment variables');
        }
        return {
          secret,
          signOptions: { expiresIn: '15m' }, // Access Token ngắn hạn
        };
      },
    }),
  ],
  controllers: [AuthController, AdminAuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: ITokenRepository,
      useClass: TokenRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
