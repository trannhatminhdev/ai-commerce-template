import { useRuntimeConfig, useCookie } from '#app';
import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack';
import type { ApiErrorResponse } from '#fe/core/types/api.types';

export type RequestBody = BodyInit | Record<string, unknown> | null | undefined;

export interface ApiClientOptions<
  R extends NitroFetchRequest = NitroFetchRequest,
> extends NitroFetchOptions<R> {
  token?: string | null;
  _retry?: boolean;
}

interface FetchErrorShape {
  response?: {
    status?: number;
    _data?: ApiErrorResponse;
  };
  statusCode?: number;
  data?: ApiErrorResponse;
  message?: string;
}

export class ApiService {
  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;
  private isAlertShown = false;

  private async handleTokenRefresh(): Promise<string | null> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const adminRefresh = useCookie<string | null>('admin_refresh_token');
        const userRefresh = useCookie<string | null>('refresh_token');

        let currentRefreshToken = adminRefresh.value;
        let tokenType = 'admin';

        if (!currentRefreshToken) {
          currentRefreshToken = userRefresh.value;
          tokenType = 'user';
        }

        if (!currentRefreshToken) return null;

        const baseUrl = this.getBaseUrl();
        const response = await $fetch<{
          accessToken: string;
          refreshToken: string;
        }>('/auth/refresh', {
          baseURL: baseUrl,
          method: 'POST',
          body: { refreshToken: currentRefreshToken },
        });

        if (response && response.accessToken) {
          if (tokenType === 'admin') {
            const adminAccess = useCookie<string | null>('admin_access_token');
            adminAccess.value = response.accessToken;
            adminRefresh.value = response.refreshToken;
          } else {
            const userAccess = useCookie<string | null>('access_token');
            userAccess.value = response.accessToken;
            userRefresh.value = response.refreshToken;
          }
          return response.accessToken;
        }
        return null;
      } catch {
        try {
          const adminAccess = useCookie<string | null>('admin_access_token');
          const adminRefresh = useCookie<string | null>('admin_refresh_token');
          if (adminAccess.value) adminAccess.value = null;
          if (adminRefresh.value) adminRefresh.value = null;

          const userAccess = useCookie<string | null>('access_token');
          const userRefresh = useCookie<string | null>('refresh_token');
          if (userAccess.value) userAccess.value = null;
          if (userRefresh.value) userRefresh.value = null;
        } catch {
          // Ignore errors
        }
        return null;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private getBaseUrl(): string {
    try {
      const config = useRuntimeConfig();
      return (
        (config.public?.apiBase as string | undefined) ||
        'http://localhost:3000/api/v1'
      );
    } catch {
      return 'http://localhost:3000/api/v1';
    }
  }

  async request<T>(
    endpoint: string,
    options: ApiClientOptions = {},
  ): Promise<T> {
    const baseUrl = this.getBaseUrl();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (options.token) {
      headers.Authorization = `Bearer ${options.token}`;
    }

    try {
      return await $fetch<T>(endpoint, {
        baseURL: baseUrl,
        ...options,
        headers,
      });
    } catch (error: unknown) {
      const fetchError = error as FetchErrorShape;
      const status =
        fetchError?.response?.status || fetchError?.statusCode || 500;

      if (status === 401 && !options._retry) {
        const newAccessToken = await this.handleTokenRefresh();

        if (newAccessToken) {
          return this.request<T>(endpoint, {
            ...options,
            token: newAccessToken,
            _retry: true,
          });
        }
      }

      if (status === 401) {
        if (import.meta.client && !this.isAlertShown) {
          const isLoginPage =
            window.location.pathname === '/login' ||
            window.location.pathname === '/admin/login';

          if (!isLoginPage) {
            this.isAlertShown = true;
            window.alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            try {
              const { navigateTo } = await import('#app');
              if (window.location.pathname.startsWith('/admin')) {
                await navigateTo('/admin/login');
              } else {
                await navigateTo('/login');
              }
            } catch {
              // Ignore error outside Nuxt context
            }
            setTimeout(() => {
              this.isAlertShown = false;
            }, 5000);
          }
        }
      }

      const message = this.extractErrorMessage(error);
      const customError = new Error(message);

      (
        customError as Error & { status?: number; data?: ApiErrorResponse }
      ).status = status;
      (
        customError as Error & { status?: number; data?: ApiErrorResponse }
      ).data = fetchError?.data || fetchError?.response?._data;

      throw customError;
    }
  }

  get<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(
    endpoint: string,
    body?: ApiClientOptions['body'],
    options: ApiClientOptions = {},
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  put<T>(
    endpoint: string,
    body?: ApiClientOptions['body'],
    options: ApiClientOptions = {},
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  patch<T>(
    endpoint: string,
    body?: ApiClientOptions['body'],
    options: ApiClientOptions = {},
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  delete<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  private extractErrorMessage(error: unknown): string {
    if (!error) return 'Đã có lỗi không xác định xảy ra.';

    const fetchError = error as FetchErrorShape;
    const errorData = fetchError.data || fetchError.response?._data;

    if (errorData) {
      if (Array.isArray(errorData.message)) {
        return errorData.message.join(', ');
      }
      if (typeof errorData.message === 'string') {
        return errorData.message;
      }
    }

    if (fetchError.message) {
      if (
        fetchError.message.includes('Failed to fetch') ||
        fetchError.message.includes('ECONNREFUSED')
      ) {
        return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.';
      }
      return fetchError.message;
    }

    return 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
  }
}

export const apiService = new ApiService();
