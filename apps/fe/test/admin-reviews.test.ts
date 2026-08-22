import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminReviewsService } from '../src/runtime/admin/reviews/services/admin-reviews.service';
import type { ApiService } from '../src/runtime/core/services/api.service';

vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      apiBase: 'http://localhost:3000/api/v1',
    },
  }),
}));

describe('AdminReviewsService', () => {
  let apiMock: Partial<ApiService>;
  let service: AdminReviewsService;

  beforeEach(() => {
    apiMock = {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
    };
    service = new AdminReviewsService(apiMock as ApiService);
  });

  describe('getReviews', () => {
    it('should call api.get with correct query string', async () => {
      (apiMock.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [] });
      await service.getReviews(
        { page: 2, limit: 10, productId: 1 },
        'token-123',
      );
      expect(apiMock.get).toHaveBeenCalledWith(
        '/admin/reviews?page=2&limit=10&productId=1',
        { token: 'token-123' },
      );
    });

    it('should call api.get without query string if no params', async () => {
      (apiMock.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [] });
      await service.getReviews(undefined, 'token-123');
      expect(apiMock.get).toHaveBeenCalledWith('/admin/reviews', {
        token: 'token-123',
      });
    });
  });

  describe('deleteReview', () => {
    it('should call api.delete with correct id', async () => {
      (apiMock.delete as ReturnType<typeof vi.fn>).mockResolvedValue(null);
      await service.deleteReview(99, 'token-123');
      expect(apiMock.delete).toHaveBeenCalledWith('/admin/reviews/99', {
        token: 'token-123',
      });
    });
  });

  describe('replyToReview', () => {
    it('should call api.post with correct payload', async () => {
      (apiMock.post as ReturnType<typeof vi.fn>).mockResolvedValue(null);
      await service.replyToReview(99, 'Thank you', 'token-123');
      expect(apiMock.post).toHaveBeenCalledWith(
        '/admin/reviews/99/reply',
        { reply: 'Thank you' },
        { token: 'token-123' },
      );
    });
  });
});
