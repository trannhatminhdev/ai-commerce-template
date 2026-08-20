import { describe, it, expect, vi, beforeEach } from 'vitest';

import { AdminAuthService } from '../src/runtime/admin/auth/services/admin-auth.service';
import type { ApiService } from '../src/runtime/core/services/api.service';

vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      apiBase: 'http://localhost:3000/api/v1',
    },
  }),
}));

describe('AdminAuthService', () => {
  let mockApiService: Partial<ApiService>;
  let adminAuthService: AdminAuthService;

  beforeEach(() => {
    mockApiService = {
      post: vi.fn(),
    };
    adminAuthService = new AdminAuthService(mockApiService as ApiService);
  });

  it('should call login endpoint with credentials', async () => {
    const mockCredentials = {
      email: 'admin@ai-commerce.com',
      password: 'admin123',
    };
    const mockResponse = {
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
      user: {
        id: 1,
        email: 'admin@ai-commerce.com',
        fullName: 'System Admin',
        role: 'ADMIN',
      },
    };

    (mockApiService.post as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockResponse,
    );

    const result = await adminAuthService.login(mockCredentials);

    expect(mockApiService.post).toHaveBeenCalledWith(
      '/admin/auth/login',
      mockCredentials,
    );
    expect(result).toEqual(mockResponse);
  });

  it('should call logout endpoint with refreshToken and accessToken', async () => {
    (mockApiService.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
    });

    const result = await adminAuthService.logout('ref-token', 'acc-token');

    expect(mockApiService.post).toHaveBeenCalledWith(
      '/admin/auth/logout',
      { refreshToken: 'ref-token' },
      { token: 'acc-token' },
    );
    expect(result).toEqual({ success: true });
  });

  it('should call refresh token endpoint', async () => {
    const mockTokens = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    };

    (mockApiService.post as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockTokens,
    );

    const result = await adminAuthService.refreshToken('old-refresh-token');

    expect(mockApiService.post).toHaveBeenCalledWith('/auth/refresh', {
      refreshToken: 'old-refresh-token',
    });
    expect(result).toEqual(mockTokens);
  });
});
