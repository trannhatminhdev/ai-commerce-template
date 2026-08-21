import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiService } from '../src/runtime/core/services/api.service';

vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      apiBase: 'http://localhost:3000/api/v1',
    },
  }),
}));

// Mock global $fetch
const mockFetch = vi.fn();
// @ts-expect-error global $fetch mock
globalThis.$fetch = mockFetch;

describe('ApiService', () => {
  let apiService: ApiService;

  beforeEach(() => {
    apiService = new ApiService();
    mockFetch.mockReset();
  });

  it('should make GET request correctly', async () => {
    mockFetch.mockResolvedValue({ success: true });

    const result = await apiService.get('/test');

    expect(mockFetch).toHaveBeenCalledWith('/test', {
      baseURL: 'http://localhost:3000/api/v1',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    expect(result).toEqual({ success: true });
  });

  it('should make POST request with body and token', async () => {
    mockFetch.mockResolvedValue({ id: 1 });

    const result = await apiService.post(
      '/test',
      { name: 'item' },
      { token: 'secret-token' },
    );

    expect(mockFetch).toHaveBeenCalledWith('/test', {
      baseURL: 'http://localhost:3000/api/v1',
      body: { name: 'item' },
      headers: {
        Authorization: 'Bearer secret-token',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      token: 'secret-token',
    });
    expect(result).toEqual({ id: 1 });
  });

  it('should make PATCH request with body and token', async () => {
    mockFetch.mockResolvedValue({ id: 1, name: 'updated' });

    const result = await apiService.patch(
      '/test/1',
      { name: 'updated' },
      { token: 'secret-token' },
    );

    expect(mockFetch).toHaveBeenCalledWith('/test/1', {
      baseURL: 'http://localhost:3000/api/v1',
      body: { name: 'updated' },
      headers: {
        Authorization: 'Bearer secret-token',
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      token: 'secret-token',
    });
    expect(result).toEqual({ id: 1, name: 'updated' });
  });

  it('should make DELETE request with token', async () => {
    mockFetch.mockResolvedValue(undefined);

    await apiService.delete('/test/1', { token: 'secret-token' });

    expect(mockFetch).toHaveBeenCalledWith('/test/1', {
      baseURL: 'http://localhost:3000/api/v1',
      headers: {
        Authorization: 'Bearer secret-token',
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
      token: 'secret-token',
    });
  });
});
