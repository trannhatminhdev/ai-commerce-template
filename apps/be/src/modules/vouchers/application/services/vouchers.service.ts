import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IVoucherRepository } from '../interfaces/voucher-repository.interface';
import { CreateVoucherDto } from '../../presentation/http/dtos/create-voucher.dto';

@Injectable()
export class VouchersService {
  constructor(
    @Inject(IVoucherRepository)
    private readonly voucherRepository: IVoucherRepository,
  ) {}

  async createVoucher(dto: CreateVoucherDto) {
    const existing = await this.voucherRepository.findByCode(dto.code);
    if (existing) {
      throw new BadRequestException('Voucher code already exists');
    }
    return this.voucherRepository.create(dto);
  }

  async getAllVouchers() {
    return this.voucherRepository.findAll();
  }

  async getVoucherById(id: number) {
    const voucher = await this.voucherRepository.findById(id);
    if (!voucher) {
      throw new NotFoundException('Voucher not found');
    }
    return voucher;
  }

  async deleteVoucher(id: number) {
    await this.getVoucherById(id);
    return this.voucherRepository.delete(id);
  }

  async applyVoucher(code: string) {
    const voucher = await this.voucherRepository.findByCode(code);
    if (!voucher) {
      throw new NotFoundException('Voucher not found or invalid');
    }
    return voucher;
  }
}
