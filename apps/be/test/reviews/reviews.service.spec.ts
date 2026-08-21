/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from '../../src/modules/reviews/application/services/reviews.service';
import { IReviewRepository } from '../../src/modules/reviews/application/interfaces/review-repository.interface';
import { OrdersService } from '../../src/modules/orders/application/services/orders.service';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let repository: jest.Mocked<IReviewRepository>;
  let ordersService: Partial<Record<keyof OrdersService, jest.Mock>>;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findByProductId: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
      updateReply: jest.fn(),
    };

    ordersService = {
      hasUserPurchasedProduct: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: IReviewRepository, useValue: repository },
        { provide: OrdersService, useValue: ordersService },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createReview', () => {
    it('should throw BadRequestException if rating is less than 1', async () => {
      await expect(service.createReview(1, 1, 0)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if rating is greater than 5', async () => {
      await expect(service.createReview(1, 1, 6)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ForbiddenException if user has not purchased the product', async () => {
      ordersService.hasUserPurchasedProduct!.mockResolvedValue(false);
      await expect(service.createReview(1, 1, 5)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should create review successfully', async () => {
      ordersService.hasUserPurchasedProduct!.mockResolvedValue(true);
      const created = {
        id: 1,
        productId: 1,
        userId: 1,
        rating: 5,
        comment: 'Great',
      };
      repository.create.mockResolvedValue(created as any);

      const result = await service.createReview(1, 1, 5, 'Great');
      expect(result).toEqual(created);
      expect(repository.create).toHaveBeenCalledWith({
        productId: 1,
        userId: 1,
        rating: 5,
        comment: 'Great',
      });
    });
  });

  describe('getProductReviews', () => {
    it('should return reviews for a product', async () => {
      const reviews = [{ id: 1 }] as any[];
      repository.findByProductId.mockResolvedValue(reviews);

      const result = await service.getProductReviews(1);
      expect(result).toEqual(reviews);
      expect(repository.findByProductId).toHaveBeenCalledWith(1);
    });
  });

  describe('deleteReviewAsAdmin', () => {
    it('should throw NotFoundException if review not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.deleteReviewAsAdmin(99)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should delete review successfully', async () => {
      repository.findById.mockResolvedValue({ id: 1 } as any);
      repository.delete.mockResolvedValue();

      await service.deleteReviewAsAdmin(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('replyToReview', () => {
    it('should throw NotFoundException if review not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.replyToReview(99, 'Thanks')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update review reply successfully', async () => {
      repository.findById.mockResolvedValue({ id: 1 } as any);
      const updated = { id: 1, adminReply: 'Thanks' };
      repository.updateReply.mockResolvedValue(updated as any);

      const result = await service.replyToReview(1, 'Thanks');
      expect(result).toEqual(updated);
      expect(repository.updateReply).toHaveBeenCalledWith(1, 'Thanks');
    });
  });
});
