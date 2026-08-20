import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { VouchersService } from '../../application/services/vouchers.service';
import { CreateVoucherDto } from './dtos/create-voucher.dto';

@Controller('admin/vouchers')
export class AdminVouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post()
  createVoucher(@Body() dto: CreateVoucherDto) {
    return this.vouchersService.createVoucher(dto);
  }

  @Get()
  getAllVouchers() {
    return this.vouchersService.getAllVouchers();
  }

  @Get(':id')
  getVoucherById(@Param('id', ParseIntPipe) id: number) {
    return this.vouchersService.getVoucherById(id);
  }

  @Delete(':id')
  deleteVoucher(@Param('id', ParseIntPipe) id: number) {
    return this.vouchersService.deleteVoucher(id);
  }
}
