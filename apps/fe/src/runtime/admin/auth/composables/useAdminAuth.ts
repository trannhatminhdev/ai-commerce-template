import { computed, ref } from 'vue';
import { useCookie, useState, navigateTo } from '#app';
import { adminAuthService } from '../services/admin-auth.service';
import type {
  AdminLoginCredentials,
  AdminLoginResponse,
  AdminUser,
} from '../types/auth.types';

export function useAdminAuth() {
  const user = useState<AdminUser | null>('admin_auth_user', () => null);
  const accessToken = useCookie<string | null>('admin_access_token', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    path: '/',
  });
  const refreshToken = useCookie<string | null>('admin_refresh_token', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    path: '/',
  });

  const isLoading = ref(false);
  const errorMessage = ref<string | null>(null);

  const isAuthenticated = computed(() => {
    return !!accessToken.value;
  });

  /**
   * Đăng nhập admin
   */
  const login = async (
    credentials: AdminLoginCredentials,
    redirectTo: string = '/admin',
  ): Promise<AdminLoginResponse | null> => {
    if (!credentials.email || !credentials.password) {
      errorMessage.value = 'Vui lòng nhập đầy đủ email và mật khẩu.';
      return null;
    }

    isLoading.value = true;
    errorMessage.value = null;

    try {
      const response = await adminAuthService.login(credentials);

      // Lưu token vào cookies
      accessToken.value = response.accessToken;
      refreshToken.value = response.refreshToken;
      user.value = response.user;

      if (redirectTo) {
        await navigateTo(redirectTo);
      }

      return response;
    } catch (err: unknown) {
      if (err instanceof Error) {
        errorMessage.value = err.message;
      } else {
        errorMessage.value = 'Đăng nhập thất bại. Vui lòng thử lại.';
      }
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Đăng xuất admin
   */
  const logout = async (redirectTo: string = '/admin/login'): Promise<void> => {
    isLoading.value = true;
    try {
      if (refreshToken.value) {
        await adminAuthService.logout(
          refreshToken.value,
          accessToken.value || undefined,
        );
      }
    } catch (err: unknown) {
      console.warn('Lỗi khi đăng xuất trên server:', err);
    } finally {
      // Xoá cookie và trạng thái
      accessToken.value = null;
      refreshToken.value = null;
      user.value = null;
      errorMessage.value = null;
      isLoading.value = false;

      if (redirectTo) {
        await navigateTo(redirectTo);
      }
    }
  };

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    errorMessage,
    login,
    logout,
  };
}
