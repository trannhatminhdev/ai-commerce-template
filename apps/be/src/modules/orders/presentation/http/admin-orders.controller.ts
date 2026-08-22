import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { OrdersService } from '../../application/services/orders.service';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';

@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getAllOrders(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ) {
    return this.ordersService.getAllOrders(
      skip ? parseInt(skip, 10) : undefined,
      take ? parseInt(take, 10) : undefined,
      search,
    );
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
