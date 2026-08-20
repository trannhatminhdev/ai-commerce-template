import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { OrdersService } from '../../application/services/orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';

@Controller('orders')
export class UserOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  @Get('my-orders')
  getMyOrders(@Query('userId', ParseIntPipe) userId: number) {
    // Note: In a real app, userId should come from JWT token via a decorator like @CurrentUser()
    return this.ordersService.getMyOrders(userId);
  }

  @Get(':id')
  getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getOrderById(id);
  }
}
