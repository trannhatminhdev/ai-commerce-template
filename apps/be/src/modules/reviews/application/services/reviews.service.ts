import {
  Injectable,
  Inject,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { IReviewRepository } from '../interfaces/review-repository.interface';
import { OrdersService } from '../../../orders/application/services/orders.service';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject(IReviewRepository)
    private readonly reviewRepository: IReviewRepository,
    private readonly ordersService: OrdersService,
  ) {}

  async createReview(
    userId: number,
    productId: number,
    rating: number,
    comment?: string,
  ) {
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const hasPurchased = await this.ordersService.hasUserPurchasedProduct(
      userId,
      productId,
    );
    if (!hasPurchased) {
      throw new ForbiddenException(
        'You can only review products you have purchased and completed the order.',
      );
    }

    return this.reviewRepository.create({
      productId,
      userId,
      rating,
      comment,
    });
  }

  async getProductReviews(productId: number) {
    return this.reviewRepository.findByProductId(productId);
  }

  async deleteReviewAsAdmin(id: number) {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return this.reviewRepository.delete(id);
  }

  async replyToReview(id: number, reply: string) {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return this.reviewRepository.updateReply(id, reply);
  }
}
