import { Module } from '@nestjs/common';
import { AuthController } from './presentation/http/auth.controller';
import { AuthService } from './application/services/auth.service';
import { IAuthRepository } from './application/interfaces/auth-repository.interface';
import { AuthRepository } from './infrastructure/repositories/auth.repository';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    // Binding (Provider) cho Dependency Injection: Khi Service cần IAuthRepository, 
    // NestJS sẽ tự động inject instance của AuthRepository. 
    // Điều này giúp dễ dàng swap Repository (VD: đổi từ Postgres sang MongoDB)
    {
      provide: IAuthRepository,
      useClass: AuthRepository,
    },
  ],
  exports: [AuthService], // Export nếu các module khác cần sử dụng
})
export class AuthModule {}
