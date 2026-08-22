import { apiService, type ApiService } from '#fe/core/services/api.service';
import type {
  AdminAuthTokens,
  AdminLoginCredentials,
  AdminLoginResponse,
  AdminLogoutResponse,
} from '#fe/admin/auth/types/auth.types';

export class AdminAuthService {
  constructor(private readonly api: ApiService = apiService) {}

  /**
   * Đăng nhập admin
   * Endpoint BE: POST /api/v1/admin/auth/login
   */
  async login(credentials: AdminLoginCredentials): Promise<AdminLoginResponse> {
    return this.api.post<AdminLoginResponse>('/admin/auth/login', credentials);
  }

  /**
   * Đăng xuất admin
   * Endpoint BE: POST /api/v1/admin/auth/logout
   */
  async logout(
    refreshToken: string,
    accessToken?: string,
  ): Promise<AdminLogoutResponse> {
    return this.api.post<AdminLogoutResponse>(
      '/admin/auth/logout',
      { refreshToken },
      { token: accessToken },
    );
  }

  /**
   * Làm mới token
   * Endpoint BE: POST /api/v1/auth/refresh
   */
  async refreshToken(refreshToken: string): Promise<AdminAuthTokens> {
    return this.api.post<AdminAuthTokens>('/auth/refresh', {
      refreshToken,
    });
  }
}

export const adminAuthService = new AdminAuthService();
