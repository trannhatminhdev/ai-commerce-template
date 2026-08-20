import { Module } from '@nestjs/common';
import { AdminReviewsController } from './presentation/http/admin-reviews.controller';
import { UserReviewsController } from './presentation/http/user-reviews.controller';
import { ReviewsService } from './application/services/reviews.service';
import { IReviewRepository } from './application/interfaces/review-repository.interface';
import { ReviewRepository } from './infrastructure/repositories/review.repository';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [OrdersModule],
  controllers: [AdminReviewsController, UserReviewsController],
  providers: [
    ReviewsService,
    {
      provide: IReviewRepository,
      useClass: ReviewRepository,
    },
  ],
  exports: [ReviewsService],
})
export class ReviewsModule {}
