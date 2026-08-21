import { useRuntimeConfig } from '#app';
import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack';
import type { ApiErrorResponse } from '../types/api.types';

export type RequestBody = BodyInit | Record<string, unknown> | null | undefined;

export interface ApiClientOptions<
  R extends NitroFetchRequest = NitroFetchRequest,
> extends NitroFetchOptions<R> {
  token?: string | null;
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
      const message = this.extractErrorMessage(error);
      const customError = new Error(message);
      const fetchError = error as FetchErrorShape;

      (
        customError as Error & { status?: number; data?: ApiErrorResponse }
      ).status = fetchError?.response?.status || fetchError?.statusCode || 500;
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
