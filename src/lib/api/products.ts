import apiClient from './client';
import { ApiResponse, Product, ProductVerificationStatus } from './types';

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  condition?: string;
  stock?: number;
}

const PRODUCTS_STORAGE_KEY = 'troit_demo_products_v2';

export const DEMO_VERIFIED_PRODUCTS: Product[] = [
  {
    id: 'prod-iphone14pro',
    seller_id: 'seller-demo-1',
    name: 'Apple iPhone 14 Pro (128GB) - Deep Purple [Verified]',
    description: 'Factory unlocked, pristine condition, 98% battery health. Thoroughly tested and physically inspected by a TROIT Port Harcourt field agent.',
    price: 680000,
    verification_status: 'VERIFIED',
    condition: 'Like New',
    stock: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-s23ultra',
    seller_id: 'seller-demo-1',
    name: 'Samsung Galaxy S23 Ultra (256GB) - Phantom Black',
    description: 'Original screen and camera modules verified. Includes S-Pen and original box accessories. Port Harcourt verified stock.',
    price: 720000,
    verification_status: 'VERIFIED',
    condition: 'Like New',
    stock: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-hpspectre',
    seller_id: 'seller-demo-2',
    name: 'HP Spectre x360 Convertible Laptop (16GB RAM, 512GB SSD)',
    description: 'Intel Core i7 12th Gen, touch screen 4K OLED display. GRA Phase 2 physical inspection passed with warranty badge.',
    price: 850000,
    verification_status: 'VERIFIED',
    condition: 'Excellent',
    stock: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const getStoredProducts = (): Product[] => {
  const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(DEMO_VERIFIED_PRODUCTS));
  return DEMO_VERIFIED_PRODUCTS;
};

export const fetchProducts = async (status: string = 'VERIFIED'): Promise<Product[]> => {
  try {
    const res = await apiClient.get<ApiResponse<Product[]>>(`/products?status=${status}`);
    if (res.data.data && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch {
    // API server unreachable - fallback to presentation mock products
  }
  const localList = getStoredProducts();
  return status ? localList.filter((p) => p.verification_status === status || status === 'ALL') : localList;
};

export const fetchProductById = async (id: string): Promise<Product> => {
  try {
    const res = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    if (res.data.data) {
      return res.data.data;
    }
  } catch {
    // API server unreachable - fallback to local product search
  }
  const localList = getStoredProducts();
  const match = localList.find((p) => p.id === id);
  if (match) return match;
  return (localList[0] || DEMO_VERIFIED_PRODUCTS[0])!;
};

export const createProduct = async (payload: CreateProductPayload): Promise<Product> => {
  const newProd: Product = {
    id: `prod-${Date.now()}`,
    seller_id: 'seller-current',
    name: payload.name,
    description: payload.description,
    price: payload.price,
    condition: payload.condition || 'New',
    stock: payload.stock || 1,
    verification_status: 'VERIFIED',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    const res = await apiClient.post<ApiResponse<Product>>('/products', payload);
    if (res.data.data) {
      const list = getStoredProducts();
      list.unshift(res.data.data);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(list));
      return res.data.data;
    }
  } catch {
    // API server unreachable - perform instant local creation
  }

  const list = getStoredProducts();
  list.unshift(newProd);
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(list));
  return newProd;
};

export const verifyProduct = async (id: string, verification_status: ProductVerificationStatus = 'VERIFIED'): Promise<Product> => {
  try {
    const res = await apiClient.patch<ApiResponse<Product>>(`/products/${id}/verify`, { verification_status });
    if (res.data.data) {
      return res.data.data;
    }
  } catch {
    // ignore
  }
  const list = getStoredProducts();
  const idx = list.findIndex((p) => p.id === id);
  if (idx !== -1 && list[idx]) {
    list[idx].verification_status = verification_status;
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(list));
    return list[idx];
  }
  return DEMO_VERIFIED_PRODUCTS[0]!;
};
