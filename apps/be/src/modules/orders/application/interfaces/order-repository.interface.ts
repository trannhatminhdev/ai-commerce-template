import { Order, OrderItem } from '@prisma/client';

export const IOrderRepository = Symbol('IOrderRepository');

export interface CreateOrderData {
  userId?: number;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  shippingMethod: string;
  paymentMethod: string;
  totalAmount: number;
  items: {
    productId: number;
    quantity: number;
    unitPrice: number;
  }[];
}

export type OrderWithItems = Order & { items: OrderItem[] };

export interface IOrderRepository {
  createWithItems(data: CreateOrderData): Promise<OrderWithItems>;
  findAll(filters?: { userId?: number }): Promise<OrderWithItems[]>;
  findById(id: number): Promise<OrderWithItems | null>;
  updateStatus(id: number, status: string): Promise<OrderWithItems>;
}
