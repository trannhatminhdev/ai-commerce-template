import { describe, it, expect, vi, beforeEach } from 'vitest';

import { AdminVouchersService } from '../src/runtime/admin/vouchers/services/admin-vouchers.service';
import type { ApiService } from '../src/runtime/core/services/api.service';

vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      apiBase: 'http://localhost:3000/api/v1',
    },
  }),
}));

describe('AdminVouchersService', () => {
  let mockApiService: Partial<ApiService>;
  let adminVouchersService: AdminVouchersService;

  beforeEach(() => {
    mockApiService = {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn(),
    };
    adminVouchersService = new AdminVouchersService(
      mockApiService as ApiService,
    );
  });

  it('should call getVouchers endpoint with pagination and search', async () => {
    const mockResponse = {
      data: [
        {
          id: 1,
          code: 'TEST10',
          discountValue: 10,
          discountType: 'PERCENTAGE',
          isActive: true,
        },
      ],
      total: 1,
    };

    (mockApiService.get as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockResponse,
    );

    const result = await adminVouchersService.getVouchers(
      { skip: 0, take: 10, search: 'TEST' },
      'test-token',
    );

    expect(mockApiService.get).toHaveBeenCalledWith(
      '/admin/vouchers?skip=0&take=10&search=TEST',
      {
        token: 'test-token',
      },
    );
    expect(result).toEqual(mockResponse);
  });

  it('should call getVoucherById endpoint with id', async () => {
    const mockVoucher = {
      id: 1,
      code: 'TEST10',
      discountValue: 10,
      discountType: 'PERCENTAGE',
      isActive: true,
    };

    (mockApiService.get as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockVoucher,
    );

    const result = await adminVouchersService.getVoucherById(1, 'test-token');

    expect(mockApiService.get).toHaveBeenCalledWith('/admin/vouchers/1', {
      token: 'test-token',
    });
    expect(result).toEqual(mockVoucher);
  });

  it('should call createVoucher endpoint with data and token', async () => {
    const createData = {
      code: 'NEW10',
      discountValue: 10,
      discountType: 'PERCENTAGE' as const,
    };
    const createdVoucher = { id: 2, ...createData, isActive: true };

    (mockApiService.post as ReturnType<typeof vi.fn>).mockResolvedValue(
      createdVoucher,
    );

    const result = await adminVouchersService.createVoucher(
      createData,
      'test-token',
    );

    expect(mockApiService.post).toHaveBeenCalledWith(
      '/admin/vouchers',
      createData,
      { token: 'test-token' },
    );
    expect(result).toEqual(createdVoucher);
  });

  it('should call deleteVoucher endpoint with id and token', async () => {
    (mockApiService.delete as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined,
    );

    await adminVouchersService.deleteVoucher(1, 'test-token');

    expect(mockApiService.delete).toHaveBeenCalledWith('/admin/vouchers/1', {
      token: 'test-token',
    });
  });
});
