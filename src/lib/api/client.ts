import axios, { AxiosInstance } from 'axios';
import { envConfig } from '@/app/config/env';

/**
 * Centralized Axios HTTP client for TROIT Logistics.
 * Feature API modules implemented by interns should import and use this client.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: envConfig.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

export default apiClient;
