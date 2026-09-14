/**
 * Centralized API Configuration for Hackodessey 4.0
 * Reads strictly from VITE_API_URL / VITE_API_BASE_URL
 * Defaults securely to production Render backend when deployed
 */

export const getApiBaseUrl = (): string => {
  // 1. Explicitly configured Vite environment variable
  const envUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL) as string | undefined;
  if (typeof envUrl === 'string' && envUrl.trim() !== '') {
    const trimmed = envUrl.trim();
    return trimmed.endsWith('/api/v1')
      ? trimmed
      : trimmed.endsWith('/')
      ? `${trimmed}api/v1`
      : `${trimmed}/api/v1`;
  }

  // 2. Browser runtime in production or production build -> Render production URL
  if (
    import.meta.env.PROD ||
    (typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1' &&
      !window.location.hostname.endsWith('.local'))
  ) {
    return 'https://gfg-hackodessey-api.onrender.com/api/v1';
  }

  // 3. Local development fallback
  return 'http://localhost:8000/api/v1';
};

export const API_BASE_URL: string = getApiBaseUrl();

export const getApiUrl = (endpoint: string): string => {
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${base}/${cleanEndpoint}`;
};

