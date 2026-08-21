import {
  apiService,
  type ApiService,
} from '../../../core/services/api.service';
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../types/category.types';

export class AdminCategoriesService {
  constructor(private readonly api: ApiService = apiService) {}

  /**
   * Lấy danh sách tất cả danh mục
   * Endpoint BE: GET /api/v1/categories
   */
  async getCategories(token?: string): Promise<Category[]> {
    return this.api.get<Category[]>('/categories', {
      token,
    });
  }

  /**
   * Lấy chi tiết danh mục theo ID
   * Endpoint BE: GET /api/v1/categories/:id
   */
  async getCategoryById(id: number, token?: string): Promise<Category> {
    return this.api.get<Category>(`/categories/${id}`, {
      token,
    });
  }

  /**
   * Tạo danh mục mới (Admin)
   * Endpoint BE: POST /api/v1/admin/categories
   */
  async createCategory(
    data: CreateCategoryInput,
    token?: string,
  ): Promise<Category> {
    return this.api.post<Category>('/admin/categories', data, {
      token,
    });
  }

  /**
   * Cập nhật danh mục (Admin)
   * Endpoint BE: PATCH /api/v1/admin/categories/:id
   */
  async updateCategory(
    id: number,
    data: UpdateCategoryInput,
    token?: string,
  ): Promise<Category> {
    return this.api.patch<Category>(`/admin/categories/${id}`, data, {
      token,
    });
  }

  /**
   * Xóa danh mục (Admin)
   * Endpoint BE: DELETE /api/v1/admin/categories/:id
   */
  async deleteCategory(id: number, token?: string): Promise<void> {
    await this.api.delete(`/admin/categories/${id}`, {
      token,
    });
  }
}

export const adminCategoriesService = new AdminCategoriesService();
