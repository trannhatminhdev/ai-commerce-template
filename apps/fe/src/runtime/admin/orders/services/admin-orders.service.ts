import { apiService, type ApiService } from '#fe/core/services/api.service';
import type { Order } from '#fe/admin/orders/types/order.types';

export class AdminOrdersService {
  constructor(private readonly api: ApiService = apiService) {}

  async getOrders(
    token?: string,
    skip?: number,
    take?: number,
    search?: string,
  ): Promise<{ data: Order[]; total: number }> {
    const params = new URLSearchParams();
    if (skip !== undefined) params.append('skip', String(skip));
    if (take !== undefined) params.append('take', String(take));
    if (search) params.append('search', search);

    const query = params.toString();
    const endpoint = query ? `/admin/orders?${query}` : '/admin/orders';
    return this.api.get<{ data: Order[]; total: number }>(endpoint, {
      token,
    });
  }

  async getOrderById(id: number, token?: string): Promise<Order> {
    return this.api.get<Order>(`/admin/orders/${id}`, { token });
  }

  async updateOrderStatus(
    id: number,
    status: string,
    token?: string,
  ): Promise<Order> {
    return this.api.patch<Order>(
      `/admin/orders/${id}/status`,
      { status },
      { token },
    );
  }
}

export const adminOrdersService = new AdminOrdersService();
