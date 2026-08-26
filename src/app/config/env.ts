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

export const envConfig: AppEnvConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  appName: import.meta.env.VITE_APP_NAME || 'TROIT Logistics',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
