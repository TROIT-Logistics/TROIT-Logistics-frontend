/**
 * Environment configuration reader for TROIT Logistics.
 * Client-accessible variables MUST be prefixed with VITE_.
 */

export interface AppEnvConfig {
  apiBaseUrl: string;
  appName: string;
  isDev: boolean;
  isProd: boolean;
}

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://troit-logistics-backend-pqnk.onrender.com';
const cleanUrl = rawBaseUrl.replace(/\/$/, '');
const normalizedApiBaseUrl = cleanUrl.endsWith('/api/v1')
  ? cleanUrl
  : cleanUrl.endsWith('/api')
  ? `${cleanUrl}/v1`
  : `${cleanUrl}/api/v1`;

export const envConfig: AppEnvConfig = {
  apiBaseUrl: normalizedApiBaseUrl,
  appName: import.meta.env.VITE_APP_NAME || 'TROIT Logistics',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
