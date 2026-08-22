import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { ReviewsService } from '../../application/services/reviews.service';
import { JwtAuthGuard } from '../../../auth/presentation/http/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/http/guards/roles.guard';
import { Roles } from '../../../auth/presentation/http/decorators/roles.decorator';
import { ReplyReviewDto } from './dtos/reply-review.dto';
import { GetReviewsDto } from './dtos/get-reviews.dto';
import { Get, Query } from '@nestjs/common';

@Controller('admin/reviews')
export class AdminReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllReviews(@Query() query: GetReviewsDto) {
    return this.reviewsService.getAllReviews({
      page: query.page,
      limit: query.limit,
      productId: query.productId,
      userId: query.userId,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteReview(@Param('id', ParseIntPipe) id: number) {
    await this.reviewsService.deleteReviewAsAdmin(id);
    return { message: 'Review deleted successfully' };
  }

  @Post(':id/reply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async replyToReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReplyReviewDto,
  ) {
    return this.reviewsService.replyToReview(id, dto.reply);
  }
}
