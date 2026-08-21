import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service';
import { IProductRepository } from '../../application/interfaces/product-repository.interface';
import {
  Product,
  ProductImage,
  ProductSpecification,
  Prisma,
} from '@prisma/client';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(
    data: Prisma.ProductUncheckedCreateInput,
  ): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }

  async findAllProducts(params?: {
    skip?: number;
    take?: number;
    search?: string;
    categoryId?: number;
  }): Promise<{ data: Product[]; total: number }> {
    const { skip, take, search, categoryId } = params || {};

    const where = {
      ...(categoryId ? { categoryId } : {}),
      ...(search ? { name: { contains: search } } : {}), // Dùng contains cho SQLite
    };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take,
        where,
        include: {
          category: true,
          images: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, total };
  }

  async findProductById(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        specifications: true,
      },
    });
  }

  async updateProduct(
    id: number,
    data: Prisma.ProductUncheckedUpdateInput,
  ): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: number): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async addImage(
    productId: number,
    data: { imageUrl: string; isThumbnail?: boolean },
  ): Promise<ProductImage> {
    return this.prisma.productImage.create({
      data: {
        productId,
        imageUrl: data.imageUrl,
        isThumbnail: data.isThumbnail || false,
      },
    });
  }

  async deleteImage(imageId: number): Promise<void> {
    await this.prisma.productImage.delete({
      where: { id: imageId },
    });
  }

  async setThumbnail(productId: number, imageId: number): Promise<void> {
    // 1. Reset all thumbnails for this product to false
    await this.prisma.productImage.updateMany({
      where: { productId },
      data: { isThumbnail: false },
    });

    // 2. Set the target image to true
    await this.prisma.productImage.update({
      where: { id: imageId },
      data: { isThumbnail: true },
    });
  }

  async findImagesByProductId(productId: number): Promise<ProductImage[]> {
    return this.prisma.productImage.findMany({
      where: { productId },
    });
  }

  async addSpecification(
    productId: number,
    data: { specName: string; specValue: string },
  ): Promise<ProductSpecification> {
    return this.prisma.productSpecification.create({
      data: {
        productId,
        specName: data.specName,
        specValue: data.specValue,
      },
    });
  }

  async deleteSpecification(specId: number): Promise<void> {
    await this.prisma.productSpecification.delete({
      where: { id: specId },
    });
  }
}
