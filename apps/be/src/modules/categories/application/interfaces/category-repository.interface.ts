import { Category } from '@prisma/client';

export const ICategoryRepository = Symbol('ICategoryRepository');

export interface ICategoryRepository {
  create(data: { name: string; parentId?: number }): Promise<Category>;
  findAll(): Promise<Category[]>;
  findById(id: number): Promise<Category | null>;
  update(
    id: number,
    data: { name?: string; parentId?: number },
  ): Promise<Category>;
  delete(id: number): Promise<void>;
}
