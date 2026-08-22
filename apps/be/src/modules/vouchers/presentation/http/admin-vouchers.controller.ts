import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
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
  getAllVouchers(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ) {
    return this.vouchersService.getAllVouchers({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      search,
    });
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
