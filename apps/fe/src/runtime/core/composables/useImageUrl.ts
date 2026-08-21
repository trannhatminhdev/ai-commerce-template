import { useRuntimeConfig } from '#app';

export const useImageUrl = (path: string | undefined | null): string => {
  if (!path) return '';

  // Return as is if it's already an absolute URL or a data URI
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:')
  ) {
    return path;
  }

  const config = useRuntimeConfig();
  const apiBase =
    (config.public?.apiBase as string) || 'http://localhost:3000/api/v1';

  try {
    const url = new URL(apiBase);
    // return base origin + path
    return `${url.origin}${path.startsWith('/') ? path : '/' + path}`;
  } catch {
    // If apiBase is not a valid absolute URL (e.g., relative path like '/api/v1')
    // and this is running on the client, we just use the current origin
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${path.startsWith('/') ? path : '/' + path}`;
    }
    return path;
  }
};
