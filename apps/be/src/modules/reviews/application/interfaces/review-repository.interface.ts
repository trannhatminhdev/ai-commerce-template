import { Review } from '@prisma/client';

export const IReviewRepository = Symbol('IReviewRepository');

export interface CreateReviewData {
  productId: number;
  userId: number;
  rating: number;
  comment?: string;
}

export interface IReviewRepository {
  create(data: CreateReviewData): Promise<Review>;
  findByProductId(productId: number): Promise<Review[]>;
  findById(id: number): Promise<Review | null>;
  delete(id: number): Promise<void>;
  updateReply(id: number, adminReply: string): Promise<Review>;
}
