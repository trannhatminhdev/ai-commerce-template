import { Injectable } from '@nestjs/common';
import {
  IReviewRepository,
  CreateReviewData,
} from '../../application/interfaces/review-repository.interface';
import { PrismaService } from '../../../../core/database/prisma.service';

@Injectable()
export class ReviewRepository implements IReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReviewData) {
    return this.prisma.review.create({
      data: {
        productId: data.productId,
        userId: data.userId,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });
  }

  async findByProductId(productId: number) {
    return this.prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    return this.prisma.review.findUnique({
      where: { id },
    });
  }

  async delete(id: number) {
    await this.prisma.review.delete({
      where: { id },
    });
  }

  async updateReply(id: number, adminReply: string) {
    return this.prisma.review.update({
      where: { id },
      data: { adminReply },
    });
  }
}
