/**
 * Centralized API Configuration for Hackodessey 4.0
 * Strictly points to deployed Render backend: https://gfg-euphoria.onrender.com/api/v1
 */

export const getApiBaseUrl = (): string => {
  const envUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL) as string | undefined;
  if (typeof envUrl === 'string' && envUrl.trim().startsWith('http')) {
    const trimmed = envUrl.trim().replace(/\/+$/, '');
    return trimmed.endsWith('/api/v1') ? trimmed : `${trimmed}/api/v1`;
  }

  // Guaranteed absolute URL to production Render backend (never relative to prevent 308/405)
  return 'https://gfg-euphoria.onrender.com/api/v1';
};

export const API_BASE_URL: string = getApiBaseUrl();

export const getApiUrl = (endpoint: string): string => {
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${base}/${cleanEndpoint}`;
};


