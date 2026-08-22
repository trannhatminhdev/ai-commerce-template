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

export interface FindAllOrdersParams {
  userId?: number;
  skip?: number;
  take?: number;
  search?: string;
}

export interface IOrderRepository {
  createWithItems(data: CreateOrderData): Promise<OrderWithItems>;
  findAll(
    params?: FindAllOrdersParams,
  ): Promise<{ data: OrderWithItems[]; total: number }>;
  findById(id: number): Promise<OrderWithItems | null>;
  updateStatus(id: number, status: string): Promise<OrderWithItems>;
  hasUserPurchasedProduct(userId: number, productId: number): Promise<boolean>;
}
