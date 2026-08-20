import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IOrderRepository } from '../interfaces/order-repository.interface';
import { CreateOrderDto } from '../../presentation/http/dtos/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    return this.orderRepository.createWithItems(dto);
  }

  async getAllOrders() {
    return this.orderRepository.findAll();
  }

  async getMyOrders(userId: number) {
    return this.orderRepository.findAll({ userId });
  }

  async getOrderById(id: number) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updateOrderStatus(id: number, status: string) {
    await this.getOrderById(id); // Ensure exists
    return this.orderRepository.updateStatus(id, status);
  }
}
