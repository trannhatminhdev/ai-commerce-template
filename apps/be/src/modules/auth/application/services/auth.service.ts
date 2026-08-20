import { Injectable, Inject } from '@nestjs/common';
import { IAuthRepository } from '../interfaces/auth-repository.interface';
import { LoginResult } from '../../domain/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    // Inject qua Interface (Port), không tiêm trực tiếp class Repository (Adapter)
    // Giúp code loosely coupled, dễ mock khi viết Unit Test.
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
  ) {}

  ping(): string {
    return 'Auth module is running!';
  }

  async login(email: string): Promise<LoginResult> {
    // Xử lý logic nghiệp vụ ở đây (validate password, generate token, v.v...)
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return { accessToken: 'example_jwt_token', user };
  }
}
