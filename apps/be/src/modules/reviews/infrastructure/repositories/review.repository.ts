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

  async findAll(params?: {
    skip?: number;
    take?: number;
    productId?: number;
    userId?: number;
  }) {
    const { skip, take, productId, userId } = params || {};
    const where = {
      ...(productId ? { productId } : {}),
      ...(userId ? { userId } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        skip,
        take,
        where,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              images: {
                where: { isThumbnail: true },
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where }),
    ]);

    return { data, total };
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
