import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from '../../application/services/reviews.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { CurrentUser } from '../../../auth/presentation/http/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../auth/presentation/http/guards/jwt-auth.guard';
import type { User } from '@prisma/client';

@Controller('reviews')
export class UserReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createReview(@Body() dto: CreateReviewDto, @CurrentUser() user: User) {
    return this.reviewsService.createReview(
      user.id,
      dto.productId,
      dto.rating,
      dto.comment,
    );
  }

  @Get('product/:productId')
  async getProductReviews(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewsService.getProductReviews(productId);
  }
}
