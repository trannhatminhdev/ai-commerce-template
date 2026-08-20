/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { AdminReviewsController } from '../../src/modules/reviews/presentation/http/admin-reviews.controller';
import { ReviewsService } from '../../src/modules/reviews/application/services/reviews.service';

describe('AdminReviewsController', () => {
  let controller: AdminReviewsController;
  let service: jest.Mocked<Partial<ReviewsService>>;

  beforeEach(async () => {
    service = {
      deleteReviewAsAdmin: jest.fn(),
      replyToReview: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminReviewsController],
      providers: [{ provide: ReviewsService, useValue: service }],
    }).compile();

    controller = module.get<AdminReviewsController>(AdminReviewsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deleteReview', () => {
    it('should delete a review', async () => {
      service.deleteReviewAsAdmin!.mockResolvedValue(undefined as any);

      const result = await controller.deleteReview(1);
      expect(result).toEqual({ message: 'Review deleted successfully' });
      expect(service.deleteReviewAsAdmin).toHaveBeenCalledWith(1);
    });
  });

  describe('replyToReview', () => {
    it('should reply to a review', async () => {
      const dto = { reply: 'Thanks' };
      const updated = { id: 1, adminReply: 'Thanks' };
      service.replyToReview!.mockResolvedValue(updated as any);

      const result = await controller.replyToReview(1, dto);
      expect(result).toEqual(updated);
      expect(service.replyToReview).toHaveBeenCalledWith(1, 'Thanks');
    });
  });
});
