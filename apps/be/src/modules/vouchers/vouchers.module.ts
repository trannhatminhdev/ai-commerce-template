import { Module } from '@nestjs/common';
import { AdminVouchersController } from './presentation/http/admin-vouchers.controller';
import { UserVouchersController } from './presentation/http/user-vouchers.controller';
import { VouchersService } from './application/services/vouchers.service';
import { IVoucherRepository } from './application/interfaces/voucher-repository.interface';
import { VouchersRepository } from './infrastructure/repositories/vouchers.repository';

@Module({
  controllers: [AdminVouchersController, UserVouchersController],
  providers: [
    VouchersService,
    {
      provide: IVoucherRepository,
      useClass: VouchersRepository,
    },
  ],
  exports: [VouchersService],
})
export class VouchersModule {}
