import { describe, it, expect, vi, beforeEach } from 'vitest';

import { AdminCategoriesService } from '../src/runtime/admin/categories/services/admin-categories.service';
import type { ApiService } from '../src/runtime/core/services/api.service';

vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      apiBase: 'http://localhost:3000/api/v1',
    },
  }),
}));

describe('AdminCategoriesService', () => {
  let mockApiService: Partial<ApiService>;
  let adminCategoriesService: AdminCategoriesService;

  beforeEach(() => {
    mockApiService = {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };
    adminCategoriesService = new AdminCategoriesService(
      mockApiService as ApiService,
    );
  });

  it('should call getCategories endpoint', async () => {
    const mockCategories = [
      { id: 1, name: 'Điện thoại', parentId: null },
      { id: 2, name: 'Laptop', parentId: null },
    ];

    (mockApiService.get as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockCategories,
    );

    const result = await adminCategoriesService.getCategories('test-token');

    expect(mockApiService.get).toHaveBeenCalledWith('/categories', {
      token: 'test-token',
    });
    expect(result).toEqual(mockCategories);
  });

  it('should call getCategoryById endpoint with id', async () => {
    const mockCategory = { id: 1, name: 'Điện thoại', parentId: null };

    (mockApiService.get as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockCategory,
    );

    const result = await adminCategoriesService.getCategoryById(
      1,
      'test-token',
    );

    expect(mockApiService.get).toHaveBeenCalledWith('/categories/1', {
      token: 'test-token',
    });
    expect(result).toEqual(mockCategory);
  });

  it('should call createCategory endpoint with data and token', async () => {
    const createData = { name: 'Máy tính bảng' };
    const createdCategory = {
      id: 3,
      name: 'Máy tính bảng',
      parentId: null,
      createdAt: '2026-08-22T00:00:00.000Z',
      updatedAt: '2026-08-22T00:00:00.000Z',
    };

    (mockApiService.post as ReturnType<typeof vi.fn>).mockResolvedValue(
      createdCategory,
    );

    const result = await adminCategoriesService.createCategory(
      createData,
      'test-token',
    );

    expect(mockApiService.post).toHaveBeenCalledWith(
      '/admin/categories',
      createData,
      { token: 'test-token' },
    );
    expect(result).toEqual(createdCategory);
  });

  it('should call updateCategory endpoint with id, data and token', async () => {
    const updateData = { name: 'Smartphones' };
    const updatedCategory = {
      id: 1,
      name: 'Smartphones',
      parentId: null,
      updatedAt: '2026-08-22T00:00:00.000Z',
    };

    (mockApiService.patch as ReturnType<typeof vi.fn>).mockResolvedValue(
      updatedCategory,
    );

    const result = await adminCategoriesService.updateCategory(
      1,
      updateData,
      'test-token',
    );

    expect(mockApiService.patch).toHaveBeenCalledWith(
      '/admin/categories/1',
      updateData,
      { token: 'test-token' },
    );
    expect(result).toEqual(updatedCategory);
  });

  it('should call deleteCategory endpoint with id and token', async () => {
    (mockApiService.delete as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined,
    );

    await adminCategoriesService.deleteCategory(1, 'test-token');

    expect(mockApiService.delete).toHaveBeenCalledWith('/admin/categories/1', {
      token: 'test-token',
    });
  });
});
