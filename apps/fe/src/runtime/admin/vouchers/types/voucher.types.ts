export interface Voucher {
  id: number;
  code: string;
  discountValue: number;
  discountType: 'PERCENT' | 'FIXED';
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateVoucherInput {
  code: string;
  discountValue: number;
  discountType: 'PERCENT' | 'FIXED';
}

export interface PaginatedVoucherResponse {
  data: Voucher[];
  total: number;
}
