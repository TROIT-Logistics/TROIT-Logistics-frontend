import axios, { AxiosInstance } from 'axios';
import { envConfig } from '@/app/config/env';

export const TOKEN_STORAGE_KEY = 'troit_auth_token';

/**
 * Centralized Axios HTTP client for TROIT Logistics.
 * Attaches JWT authorization header when available.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: envConfig.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let friendlyMessage = 'An unexpected error occurred. Please try again.';

    if (error.response?.data?.message) {
      friendlyMessage = error.response.data.message;
    } else if (error.message === 'Network Error') {
      friendlyMessage = 'Unable to connect to the TROIT backend server. Ensure backend is running at http://localhost:8000.';
    }

    return Promise.reject(new Error(friendlyMessage));
  }
);

export default apiClient;
