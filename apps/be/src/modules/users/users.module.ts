import { Module } from '@nestjs/common';
import { IUserRepository } from './application/interfaces/user-repository.interface';
import { UserService } from './application/services/user.service';
import { UserRepository } from './infrastructure/repositories/user.repository';
// import { PrismaModule } // Global DatabaseModule is providing PrismaService

@Module({
  providers: [
    UserService,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
  exports: [UserService],
})
export class UsersModule {}
