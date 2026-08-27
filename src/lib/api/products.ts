import apiClient from './client';
import { ApiResponse, Product } from './types';

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  condition?: string;
  stock?: number;
}

export const fetchProducts = async (status: string = 'VERIFIED'): Promise<Product[]> => {
  const res = await apiClient.get<ApiResponse<Product[]>>(`/products?status=${status}`);
  return res.data.data || [];
};

export const fetchProductById = async (id: string): Promise<Product> => {
  const res = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
  if (!res.data.data) {
    throw new Error('Product not found');
  }
  return res.data.data;
};

export const createProduct = async (payload: CreateProductPayload): Promise<Product> => {
  const res = await apiClient.post<ApiResponse<Product>>('/products', payload);
  if (!res.data.data) {
    throw new Error('Failed to create product');
  }
  return res.data.data;
};

export const verifyProduct = async (id: string, verification_status: string = 'VERIFIED'): Promise<Product> => {
  const res = await apiClient.patch<ApiResponse<Product>>(`/products/${id}/verify`, { verification_status });
  if (!res.data.data) {
    throw new Error('Failed to verify product');
  }
  return res.data.data;
};
