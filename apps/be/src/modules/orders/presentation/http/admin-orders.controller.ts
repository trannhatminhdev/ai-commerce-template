import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from '../../application/services/orders.service';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';

@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Get(':id')
  getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getOrderById(id);
  }

  @Patch(':id/status')
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, dto.status);
  }
}
