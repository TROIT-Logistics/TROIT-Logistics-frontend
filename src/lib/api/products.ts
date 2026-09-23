import apiClient from './client';
import {
  ApiResponse,
  Product,
  ProductImage,
  ProductVerificationStatus,
  UpdateProductPayload,
} from './types';

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  condition?: string;
  stock?: number;
  is_african_made?: boolean;
  african_made_category?: string;
  warranty_months?: number;
  warranty_terms?: string;
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

export const fetchAllProducts = async (): Promise<Product[]> => {
  const [pending, verified, rejected] = await Promise.all([
    fetchProducts('PENDING').catch(() => []),
    fetchProducts('VERIFIED').catch(() => []),
    fetchProducts('REJECTED').catch(() => []),
  ]);
  const productMap = new Map<string, Product>();
  [...pending, ...verified, ...rejected].forEach((p) => productMap.set(p.id, p));
  return Array.from(productMap.values());
};

export const verifyProduct = async (
  id: string,
  verification_status: ProductVerificationStatus = 'VERIFIED'
): Promise<Product> => {
  const res = await apiClient.patch<ApiResponse<Product>>(`/products/${id}/verify`, { verification_status });
  if (!res.data.data) {
    throw new Error('Failed to update product verification status');
  }
  return res.data.data;
};

export const uploadProductImage = async (id: string, file: File): Promise<ProductImage> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiClient.post<ApiResponse<ProductImage>>(`/products/${id}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (!res.data.data) {
    throw new Error('Failed to upload product image');
  }
  return res.data.data;
};

export const deleteProductImage = async (productId: string, imageId: string): Promise<void> => {
  await apiClient.delete(`/products/${productId}/images/${imageId}`);
};

export const reorderProductImages = async (
  productId: string,
  imageIds: string[]
): Promise<ProductImage[]> => {
  const res = await apiClient.put<ApiResponse<ProductImage[]>>(`/products/${productId}/images/reorder`, {
    image_ids: imageIds,
  });
  return res.data.data || [];
};

export const updateProduct = async (
  id: string,
  payload: UpdateProductPayload
): Promise<Product> => {
  const res = await apiClient.patch<ApiResponse<Product>>(`/products/${id}`, payload);
  if (!res.data.data) {
    throw new Error('Failed to update product details');
  }
  return res.data.data;
};

export const updateProductStock = async (id: string, stock: number): Promise<Product> => {
  const res = await apiClient.patch<ApiResponse<Product>>(`/products/${id}/stock`, { stock });
  if (!res.data.data) {
    throw new Error('Failed to update product stock');
  }
  return res.data.data;
};

export const archiveProduct = async (id: string): Promise<Product> => {
  const res = await apiClient.delete<ApiResponse<Product>>(`/products/${id}`);
  if (!res.data.data) {
    throw new Error('Failed to archive product');
  }
  return res.data.data;
};

export const restoreProduct = async (id: string): Promise<Product> => {
  const res = await apiClient.patch<ApiResponse<Product>>(`/products/${id}/archive`, {
    archived: false,
  });
  if (!res.data.data) {
    throw new Error('Failed to restore product');
  }
  return res.data.data;
};
