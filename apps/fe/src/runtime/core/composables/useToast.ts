import { useState } from '#app';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

export function useToast() {
  const toasts = useState<ToastMessage[]>('core_toasts', () => []);

  const addToast = (
    message: string,
    type: ToastType = 'info',
    duration = 3000,
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    toasts.value.push({ id, type, message });
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };

  const success = (message: string, duration?: number) =>
    addToast(message, 'success', duration);
  const error = (message: string, duration?: number) =>
    addToast(message, 'error', duration);
  const warning = (message: string, duration?: number) =>
    addToast(message, 'warning', duration);
  const info = (message: string, duration?: number) =>
    addToast(message, 'info', duration);

  return {
    toasts,
    success,
    error,
    warning,
    info,
    removeToast,
  };
}
