import { Module } from '@nestjs/common';
import { AdminOrdersController } from './presentation/http/admin-orders.controller';
import { UserOrdersController } from './presentation/http/user-orders.controller';
import { OrdersService } from './application/services/orders.service';
import { IOrderRepository } from './application/interfaces/order-repository.interface';
import { OrdersRepository } from './infrastructure/repositories/orders.repository';

@Module({
  controllers: [AdminOrdersController, UserOrdersController],
  providers: [
    OrdersService,
    {
      provide: IOrderRepository,
      useClass: OrdersRepository,
    },
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
