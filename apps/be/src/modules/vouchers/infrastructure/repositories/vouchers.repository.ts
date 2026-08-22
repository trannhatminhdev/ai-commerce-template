import { Injectable } from '@nestjs/common';
import { IVoucherRepository } from '../../application/interfaces/voucher-repository.interface';
import { PrismaService } from '../../../../core/database/prisma.service';
import { Voucher } from '@prisma/client';

@Injectable()
export class VouchersRepository implements IVoucherRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Voucher | null> {
    return this.prisma.voucher.findUnique({ where: { id } });
  }

  async findByCode(code: string): Promise<Voucher | null> {
    return this.prisma.voucher.findUnique({ where: { code } });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    search?: string;
  }): Promise<{ data: Voucher[]; total: number }> {
    const { skip, take, search } = params || {};

    const where = {
      ...(search ? { code: { contains: search } } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.voucher.findMany({
        skip,
        take,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.voucher.count({ where }),
    ]);

    return { data, total };
  }

  async create(
    data: Omit<Voucher, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Voucher> {
    return this.prisma.voucher.create({ data });
  }

  async update(id: number, data: Partial<Voucher>): Promise<Voucher> {
    return this.prisma.voucher.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.voucher.delete({ where: { id } });
  }
}
