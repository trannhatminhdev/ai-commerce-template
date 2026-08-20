import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { ITokenRepository } from './application/interfaces/token-repository.interface';
import { AuthService } from './application/services/auth.service';
import { JwtStrategy } from './application/strategies/jwt.strategy';
import { TokenRepository } from './infrastructure/repositories/token.repository';
import { AdminAuthController } from './presentation/http/admin-auth.controller';
import { AuthController } from './presentation/http/auth.controller';

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
        const expiresIn =
          configService.get<JwtSignOptions['expiresIn']>(
            'JWT_ACCESS_EXPIRES_IN',
          ) || '15m';
        return {
          secret,
          signOptions: { expiresIn },
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
