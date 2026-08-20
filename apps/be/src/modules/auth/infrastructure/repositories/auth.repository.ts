import { Injectable } from '@nestjs/common';
import { IAuthRepository } from '../../application/interfaces/auth-repository.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class AuthRepository implements IAuthRepository {
  // Adapter thực tế tương tác với Database (Prisma/TypeORM/...)

  findByEmail(email: string): Promise<User | null> {
    // Gọi Database thật ở đây
    return Promise.resolve({ id: 1, email });
  }

  save(user: User): Promise<User> {
    // Gọi Database thật ở đây
    return Promise.resolve(user);
  }
}
