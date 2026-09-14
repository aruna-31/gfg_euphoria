/**
 * Centralized API Configuration
 * Reads from VITE_API_URL or VITE_API_BASE_URL (configured in Vercel)
 * Defaults to http://localhost:8000/api/v1 for local development
 */

const rawApiUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000') as string;

// Ensure standard /api/v1 prefix format
export const API_BASE_URL: string = rawApiUrl.endsWith('/api/v1')
  ? rawApiUrl
  : rawApiUrl.endsWith('/')
  ? `${rawApiUrl}api/v1`
  : `${rawApiUrl}/api/v1`;

export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};
