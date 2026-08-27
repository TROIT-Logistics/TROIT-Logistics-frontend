import apiClient from './client';
import { AuthResponse, UserRole } from './types';

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  phone_number?: string;
  role?: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const res = await apiClient.post<AuthResponse>('/auth/register', payload);
  return res.data;
};

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const res = await apiClient.post<AuthResponse>('/auth/login', payload);
  return res.data;
};

export const getMe = async (): Promise<AuthResponse> => {
  const res = await apiClient.get<AuthResponse>('/auth/me');
  return res.data;
};

export const logoutUser = async (): Promise<AuthResponse> => {
  const res = await apiClient.post<AuthResponse>('/auth/logout');
  return res.data;
};
