import { Voucher } from '@prisma/client';

export const IVoucherRepository = Symbol('IVoucherRepository');

export interface IVoucherRepository {
  findById(id: number): Promise<Voucher | null>;
  findByCode(code: string): Promise<Voucher | null>;
  findAll(): Promise<Voucher[]>;
  create(
    data: Omit<Voucher, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Voucher>;
  update(id: number, data: Partial<Voucher>): Promise<Voucher>;
  delete(id: number): Promise<void>;
}
