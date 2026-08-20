import { Prisma, User } from '@prisma/client';

export const IUserRepository = Symbol('IUserRepository');

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: Prisma.UserCreateInput): Promise<User>;
}
