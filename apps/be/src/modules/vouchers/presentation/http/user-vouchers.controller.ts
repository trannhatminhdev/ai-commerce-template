import { Controller, Post, Body } from '@nestjs/common';
import { VouchersService } from '../../application/services/vouchers.service';
import { ApplyVoucherDto } from './dtos/apply-voucher.dto';

@Controller('vouchers')
export class UserVouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post('apply')
  applyVoucher(@Body() dto: ApplyVoucherDto) {
    return this.vouchersService.applyVoucher(dto.code);
  }
}
