import { describe, it, expect, vi, beforeEach } from 'vitest';

import { AdminProductsService } from '../src/runtime/admin/products/services/admin-products.service';
import type { ApiService } from '../src/runtime/core/services/api.service';

vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      apiBase: 'http://localhost:3000/api/v1',
    },
  }),
}));

describe('AdminProductsService', () => {
  let mockApiService: Partial<ApiService>;
  let adminProductsService: AdminProductsService;

  beforeEach(() => {
    mockApiService = {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };
    adminProductsService = new AdminProductsService(
      mockApiService as ApiService,
    );
  });

  it('should call getProducts endpoint with pagination', async () => {
    const mockResponse = {
      data: [{ id: 1, name: 'Phone' }],
      total: 1,
    };

    (mockApiService.get as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockResponse,
    );

    const result = await adminProductsService.getProducts(
      'test-token',
      0,
      10,
      'Phone',
    );

    expect(mockApiService.get).toHaveBeenCalledWith(
      '/products?skip=0&take=10&search=Phone',
      {
        token: 'test-token',
      },
    );
    expect(result).toEqual(mockResponse);
  });

  it('should call getProductById endpoint with id', async () => {
    const mockProduct = { id: 1, name: 'Phone' };

    (mockApiService.get as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockProduct,
    );

    const result = await adminProductsService.getProductById(1, 'test-token');

    expect(mockApiService.get).toHaveBeenCalledWith('/products/1', {
      token: 'test-token',
    });
    expect(result).toEqual(mockProduct);
  });

  it('should call createProduct endpoint with data and token', async () => {
    const createData = { name: 'Tablet', price: 500, categoryId: 1, stock: 10 };
    const createdProduct = { id: 2, ...createData };

    (mockApiService.post as ReturnType<typeof vi.fn>).mockResolvedValue(
      createdProduct,
    );

    const result = await adminProductsService.createProduct(
      createData,
      'test-token',
    );

    expect(mockApiService.post).toHaveBeenCalledWith(
      '/admin/products',
      createData,
      { token: 'test-token' },
    );
    expect(result).toEqual(createdProduct);
  });

  it('should call updateProduct endpoint with id, data and token', async () => {
    const updateData = { name: 'Smartphone' };
    const updatedProduct = { id: 1, ...updateData };

    (mockApiService.patch as ReturnType<typeof vi.fn>).mockResolvedValue(
      updatedProduct,
    );

    const result = await adminProductsService.updateProduct(
      1,
      updateData,
      'test-token',
    );

    expect(mockApiService.patch).toHaveBeenCalledWith(
      '/admin/products/1',
      updateData,
      { token: 'test-token' },
    );
    expect(result).toEqual(updatedProduct);
  });

  it('should call deleteProduct endpoint with id and token', async () => {
    (mockApiService.delete as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined,
    );

    await adminProductsService.deleteProduct(1, 'test-token');

    expect(mockApiService.delete).toHaveBeenCalledWith('/admin/products/1', {
      token: 'test-token',
    });
  });

  it('should call addSpecification endpoint', async () => {
    const specData = { specName: 'Color', specValue: 'Red' };
    (mockApiService.post as ReturnType<typeof vi.fn>).mockResolvedValue(
      undefined,
    );
    await adminProductsService.addSpecification(1, specData, 'test-token');
    expect(mockApiService.post).toHaveBeenCalledWith(
      '/admin/products/1/specifications',
      specData,
      { token: 'test-token' },
    );
  });
});
