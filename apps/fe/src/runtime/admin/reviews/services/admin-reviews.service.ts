import { apiService, type ApiService } from '#fe/core/services/api.service';
import type { PaginatedReviewResponse } from '../types/review.types';

export class AdminReviewsService {
  constructor(private readonly api: ApiService = apiService) {}

  async getReviews(
    params?: {
      page?: number;
      limit?: number;
      productId?: number;
      userId?: number;
    },
    token?: string,
  ): Promise<PaginatedReviewResponse> {
    const query = new URLSearchParams();
    if (params?.page !== undefined)
      query.append('page', params.page.toString());
    if (params?.limit !== undefined)
      query.append('limit', params.limit.toString());
    if (params?.productId)
      query.append('productId', params.productId.toString());
    if (params?.userId) query.append('userId', params.userId.toString());

    const queryString = query.toString() ? `?${query.toString()}` : '';

    return this.api.get<PaginatedReviewResponse>(
      `/admin/reviews${queryString}`,
      { token },
    );
  }

  async deleteReview(id: number, token?: string): Promise<void> {
    await this.api.delete(`/admin/reviews/${id}`, { token });
  }

  async replyToReview(
    id: number,
    reply: string,
    token?: string,
  ): Promise<void> {
    await this.api.post(`/admin/reviews/${id}/reply`, { reply }, { token });
  }
}

export const adminReviewsService = new AdminReviewsService();
