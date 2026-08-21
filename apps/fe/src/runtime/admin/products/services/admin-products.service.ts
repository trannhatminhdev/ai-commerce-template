import {
  apiService,
  type ApiService,
} from '../../../core/services/api.service';
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from '../types/product.types';

export class AdminProductsService {
  constructor(private readonly api: ApiService = apiService) {}

  async getProducts(
    token?: string,
    skip?: number,
    take?: number,
    search?: string,
  ): Promise<{ data: Product[]; total: number }> {
    const params = new URLSearchParams();
    if (skip !== undefined) params.append('skip', String(skip));
    if (take !== undefined) params.append('take', String(take));
    if (search) params.append('search', search);

    const query = params.toString();
    const endpoint = query ? `/products?${query}` : '/products';
    return this.api.get<{ data: Product[]; total: number }>(endpoint, {
      token,
    });
  }

  async getProductById(id: number, token?: string): Promise<Product> {
    return this.api.get<Product>(`/products/${id}`, { token });
  }

  async createProduct(
    data: CreateProductInput,
    token?: string,
  ): Promise<Product> {
    return this.api.post<Product>('/admin/products', data, { token });
  }

  async updateProduct(
    id: number,
    data: UpdateProductInput,
    token?: string,
  ): Promise<Product> {
    return this.api.patch<Product>(`/admin/products/${id}`, data, { token });
  }

  async deleteProduct(id: number, token?: string): Promise<void> {
    await this.api.delete(`/admin/products/${id}`, { token });
  }

  async uploadImage(
    id: number,
    file: File,
    isThumbnail: boolean,
    token?: string,
    baseUrl: string = 'http://localhost:3000/api/v1',
  ): Promise<unknown> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isThumbnail', String(isThumbnail));

    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    return globalThis.$fetch(`${baseUrl}/admin/products/${id}/images`, {
      method: 'POST',
      body: formData,
      headers,
    });
  }

  async deleteImage(
    id: number,
    imageId: number,
    token?: string,
  ): Promise<void> {
    await this.api.delete(`/admin/products/${id}/images/${imageId}`, { token });
  }

  async setThumbnail(
    id: number,
    imageId: number,
    token?: string,
  ): Promise<void> {
    await this.api.patch(
      `/admin/products/${id}/images/${imageId}/thumbnail`,
      undefined,
      { token },
    );
  }

  async addSpecification(
    id: number,
    data: { specName: string; specValue: string },
    token?: string,
  ): Promise<unknown> {
    return this.api.post(`/admin/products/${id}/specifications`, data, {
      token,
    });
  }

  async deleteSpecification(
    id: number,
    specId: number,
    token?: string,
  ): Promise<void> {
    await this.api.delete(`/admin/products/${id}/specifications/${specId}`, {
      token,
    });
  }
}

export const adminProductsService = new AdminProductsService();
