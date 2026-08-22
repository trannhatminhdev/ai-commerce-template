import {
  apiService,
  type ApiService,
} from '../../../core/services/api.service';
import type {
  Voucher,
  CreateVoucherInput,
  PaginatedVoucherResponse,
} from '../types/voucher.types';

export class AdminVouchersService {
  constructor(private readonly api: ApiService = apiService) {}

  /**
   * Lấy danh sách tất cả voucher
   * Endpoint BE: GET /api/v1/admin/vouchers
   */
  async getVouchers(
    params?: { skip?: number; take?: number; search?: string },
    token?: string,
  ): Promise<PaginatedVoucherResponse> {
    const query = new URLSearchParams();
    if (params?.skip !== undefined)
      query.append('skip', params.skip.toString());
    if (params?.take !== undefined)
      query.append('take', params.take.toString());
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString() ? `?${query.toString()}` : '';

    return this.api.get<PaginatedVoucherResponse>(
      `/admin/vouchers${queryString}`,
      {
        token,
      },
    );
  }

  /**
   * Lấy chi tiết voucher theo ID
   * Endpoint BE: GET /api/v1/admin/vouchers/:id
   */
  async getVoucherById(id: number, token?: string): Promise<Voucher> {
    return this.api.get<Voucher>(`/admin/vouchers/${id}`, {
      token,
    });
  }

  /**
   * Tạo voucher mới (Admin)
   * Endpoint BE: POST /api/v1/admin/vouchers
   */
  async createVoucher(
    data: CreateVoucherInput,
    token?: string,
  ): Promise<Voucher> {
    return this.api.post<Voucher>('/admin/vouchers', data, {
      token,
    });
  }

  /**
   * Xóa voucher (Admin)
   * Endpoint BE: DELETE /api/v1/admin/vouchers/:id
   */
  async deleteVoucher(id: number, token?: string): Promise<void> {
    await this.api.delete(`/admin/vouchers/${id}`, {
      token,
    });
  }
}

export const adminVouchersService = new AdminVouchersService();
