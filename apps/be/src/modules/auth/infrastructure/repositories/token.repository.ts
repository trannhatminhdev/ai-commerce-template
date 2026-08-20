import { Injectable } from '@nestjs/common';
import { Prisma, UserToken } from '@prisma/client';
import { PrismaService } from '../../../../core/database/prisma.service';
import { ITokenRepository } from '../../application/interfaces/token-repository.interface';

@Injectable()
export class TokenRepository implements ITokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserTokenCreateInput): Promise<UserToken> {
    return this.prisma.userToken.create({ data });
  }

  async findByToken(token: string): Promise<UserToken | null> {
    return this.prisma.userToken.findFirst({
      where: { refreshToken: token },
    });
  }

  async revokeToken(id: number): Promise<void> {
    await this.prisma.userToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  async revokeTokensByUser(userId: number): Promise<void> {
    await this.prisma.userToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
