import apiClient from './client';
import { ApiResponse, Wishlist } from './types';

export const fetchWishlist = async (): Promise<Wishlist[]> => {
  const res = await apiClient.get<ApiResponse<Wishlist[]>>('/wishlist');
  return res.data.data || [];
};

export const addToWishlist = async (productId: string): Promise<Wishlist> => {
  const res = await apiClient.post<ApiResponse<Wishlist>>(`/wishlist/${productId}`);
  if (!res.data.data) {
    throw new Error('Failed to add product to wishlist');
  }
  return res.data.data;
};

export const removeFromWishlist = async (productId: string): Promise<void> => {
  await apiClient.delete<ApiResponse<void>>(`/wishlist/${productId}`);
};
