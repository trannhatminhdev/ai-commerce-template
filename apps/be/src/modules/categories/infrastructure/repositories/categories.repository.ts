import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service';
import { ICategoryRepository } from '../../application/interfaces/category-repository.interface';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; parentId?: number }): Promise<Category> {
    return this.prisma.category.create({
      data,
    });
  }

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({
      include: { children: true },
    });
  }

  async findById(id: number): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
      include: { children: true },
    });
  }

  async update(id: number, data: { name?: string; parentId?: number }): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }
}
