/* eslint-disable */
import { Injectable, BadRequestException } from '@nestjs/common';
import {
  IOrderRepository,
  CreateOrderData,
  FindAllOrdersParams,
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

  async findAll(params?: FindAllOrdersParams) {
    const where: Prisma.OrderWhereInput = {};
    if (params?.userId) {
      where.userId = params.userId;
    }
    if (params?.search) {
      where.OR = [
        { customerName: { contains: params.search } },
        { customerPhone: { contains: params.search } },
      ];
      // Try to parse search as number for order ID search
      const idSearch = parseInt(params.search, 10);
      if (!isNaN(idSearch)) {
        where.OR.push({ id: idSearch });
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: { include: { product: { include: { images: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip: params?.skip ? Number(params.skip) : undefined,
        take: params?.take ? Number(params.take) : undefined,
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data, total };
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
