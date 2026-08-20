import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICategoryRepository } from '../interfaces/category-repository.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async create(data: { name: string; parentId?: number }) {
    return this.categoryRepository.create(data);
  }

  async findAll() {
    return this.categoryRepository.findAll();
  }

  async findById(id: number) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: number, data: { name?: string; parentId?: number }) {
    await this.findById(id); // Ensure exists
    return this.categoryRepository.update(id, data);
  }

  async delete(id: number) {
    await this.findById(id); // Ensure exists
    return this.categoryRepository.delete(id);
  }
}
