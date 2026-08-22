import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminOrdersService } from '../src/runtime/admin/orders/services/admin-orders.service';
import type { ApiService } from '../src/runtime/core/services/api.service';

vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      apiBase: 'http://localhost:3000/api/v1',
    },
  }),
}));

describe('AdminOrdersService', () => {
  let mockApiService: Partial<ApiService>;
  let adminOrdersService: AdminOrdersService;

  beforeEach(() => {
    mockApiService = {
      get: vi.fn(),
      patch: vi.fn(),
    };
    adminOrdersService = new AdminOrdersService(mockApiService as ApiService);
  });

  it('should call getOrders endpoint with pagination and search', async () => {
    const mockResponse = {
      data: [{ id: 1, status: 'PENDING' }],
      total: 1,
    };

    (mockApiService.get as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockResponse,
    );

    const result = await adminOrdersService.getOrders(
      'test-token',
      0,
      10,
      'search',
    );

    expect(mockApiService.get).toHaveBeenCalledWith(
      '/admin/orders?skip=0&take=10&search=search',
      { token: 'test-token' },
    );
    expect(result).toEqual(mockResponse);
  });

  it('should call getOrderById endpoint with id', async () => {
    const mockOrder = { id: 1, status: 'PENDING' };

    (mockApiService.get as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockOrder,
    );

    const result = await adminOrdersService.getOrderById(1, 'test-token');

    expect(mockApiService.get).toHaveBeenCalledWith('/admin/orders/1', {
      token: 'test-token',
    });
    expect(result).toEqual(mockOrder);
  });

  it('should call updateOrderStatus endpoint', async () => {
    const mockUpdatedOrder = { id: 1, status: 'SHIPPED' };

    (mockApiService.patch as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockUpdatedOrder,
    );

    const result = await adminOrdersService.updateOrderStatus(
      1,
      'SHIPPED',
      'test-token',
    );

    expect(mockApiService.patch).toHaveBeenCalledWith(
      '/admin/orders/1/status',
      { status: 'SHIPPED' },
      { token: 'test-token' },
    );
    expect(result).toEqual(mockUpdatedOrder);
  });
});
