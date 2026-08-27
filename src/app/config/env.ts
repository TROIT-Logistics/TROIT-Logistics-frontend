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

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
// Ensure apiBaseUrl ends with /v1
const normalizedApiBaseUrl = rawBaseUrl.endsWith('/v1') 
  ? rawBaseUrl 
  : `${rawBaseUrl.replace(/\/$/, '')}/v1`;

export const envConfig: AppEnvConfig = {
  apiBaseUrl: normalizedApiBaseUrl,
  appName: import.meta.env.VITE_APP_NAME || 'TROIT Logistics',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
