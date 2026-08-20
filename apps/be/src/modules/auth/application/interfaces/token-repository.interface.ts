import { UserToken, Prisma } from '@prisma/client';

export const ITokenRepository = Symbol('ITokenRepository');

export interface ITokenRepository {
  create(data: Prisma.UserTokenCreateInput): Promise<UserToken>;
  findByToken(token: string): Promise<UserToken | null>;
  revokeToken(id: number): Promise<void>;
  revokeTokensByUser(userId: number): Promise<void>;
}
