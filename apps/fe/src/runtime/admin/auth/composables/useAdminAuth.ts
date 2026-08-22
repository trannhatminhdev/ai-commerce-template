import { navigateTo, useCookie, useState } from '#app';
import { computed, ref } from 'vue';
import { useToast } from '#fe/core/composables/useToast';
import { ADMIN_LOGIN_ROUTE_PATH } from '#fe/admin/auth/constants';
import { adminAuthService } from '#fe/admin/auth/services/admin-auth.service';
import type {
  AdminLoginCredentials,
  AdminLoginResponse,
  AdminUser,
} from '#fe/admin/auth/types/auth.types';

export function useAdminAuth() {
  const user = useState<AdminUser | null>('admin_auth_user', () => null);
  const accessToken = useCookie<string | null>('admin_access_token', {
    default: () => null,
    maxAge: 60 * 15, // 15 minutes
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
    const toast = useToast();
    if (!credentials.email || !credentials.password) {
      toast.error('Vui lòng nhập đầy đủ email và mật khẩu.');
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

      toast.success('Đăng nhập thành công!');

      if (redirectTo) {
        await navigateTo(redirectTo);
      }

      return response;
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Đăng nhập thất bại. Vui lòng thử lại.');
      }
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Đăng xuất admin
   */
  const logout = async (
    redirectTo: string = ADMIN_LOGIN_ROUTE_PATH,
  ): Promise<void> => {
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
