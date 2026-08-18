import { Injectable } from '@nestjs/common';
import { IAuthRepository } from '../../application/interfaces/auth-repository.interface';

@Injectable()
export class AuthRepository implements IAuthRepository {
  // Adapter thực tế tương tác với Database (Prisma/TypeORM/...)
  
  async findByEmail(email: string): Promise<any> {
    // Gọi Database thật ở đây
    return { id: 1, email };
  }

  async save(user: any): Promise<any> {
    // Gọi Database thật ở đây
    return user;
  }
}
