import { Injectable, BadRequestException } from '@nestjs/common';
import {
  IOrderRepository,
  CreateOrderData,
} from '../../application/interfaces/order-repository.interface';
import { PrismaService } from '../../../../core/database/prisma.service';

@Injectable()
export class OrdersRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createWithItems(data: CreateOrderData) {
    return this.prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          userId: data.userId,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          shippingAddress: data.shippingAddress,
          shippingMethod: data.shippingMethod,
          paymentMethod: data.paymentMethod,
          totalAmount: data.totalAmount,
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Update product stock
      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || product.stock < item.quantity) {
          throw new BadRequestException(
            `Product with ID ${item.productId} does not have enough stock.`,
          );
        }

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.quantity },
        });
      }

      return order;
    });
  }

  async findAll(filters?: { userId?: number }) {
    return this.prisma.order.findMany({
      where: filters?.userId ? { userId: filters.userId } : undefined,
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
  }

  async updateStatus(id: number, status: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
  }

  async hasUserPurchasedProduct(
    userId: number,
    productId: number,
  ): Promise<boolean> {
    const count = await this.prisma.order.count({
      where: {
        userId,
        status: { in: ['COMPLETED', 'DELIVERED'] },
        items: {
          some: { productId },
        },
      },
    });
    return count > 0;
  }
}
