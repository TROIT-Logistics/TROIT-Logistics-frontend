import apiClient from './client';
import {
  ApiResponse,
  Product,
  ProductVerificationStatus,
  Order,
  OrderStatus,
  InspectionReport,
  ProductVerificationSummary,
  SellerProfile,
  TrustHistory,
  AdminSellerListResponse,
  AdminSellerQueryParams,
  AdminUserListResponse,
  AdminUserQueryParams,
} from './types';

export interface CreateInspectionPayload {
  order_id?: string | null;
  authenticity_verified: boolean;
  physical_condition: string;
  serial_number?: string | null;
  functional_tests?: Record<string, unknown> | null;
  photos_json?: Record<string, unknown> | null;
  notes?: string | null;
}

export interface ResolveDisputePayload {
  resolution_notes: string;
  refund_approved?: boolean;
}

/**
 * Admin API service interfacing with live TROIT Logistics backend endpoints.
 */

// 1. Products
export const fetchAdminProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<ApiResponse<Product[]>>('/products');
  return response.data.data || [];
};

export const verifyProductAdmin = async (
  productId: string,
  verification_status: ProductVerificationStatus,
  authenticity_status?: string
): Promise<Product> => {
  const response = await apiClient.patch<ApiResponse<Product>>(`/products/${productId}/verify`, {
    verification_status,
    authenticity_status,
  });
  return response.data.data!;
};

export const createProductInspectionAdmin = async (
  productId: string,
  payload: CreateInspectionPayload
): Promise<InspectionReport> => {
  const response = await apiClient.post<ApiResponse<InspectionReport>>(
    `/products/${productId}/inspection`,
    payload
  );
  return response.data.data!;
};

export const fetchProductVerificationSummaryAdmin = async (
  productId: string
): Promise<ProductVerificationSummary> => {
  const response = await apiClient.get<ApiResponse<ProductVerificationSummary>>(
    `/products/${productId}/verification`
  );
  return response.data.data!;
};

// 2. Orders & Escrow
export const fetchAdminOrders = async (): Promise<Order[]> => {
  const response = await apiClient.get<ApiResponse<Order[]>>('/orders');
  return response.data.data || [];
};

export const fetchOrderDetailsAdmin = async (orderId: string): Promise<Order> => {
  const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
  return response.data.data!;
};

export const updateOrderStatusAdmin = async (
  orderId: string,
  status: OrderStatus
): Promise<Order> => {
  const response = await apiClient.patch<ApiResponse<Order>>(`/orders/${orderId}/status`, {
    status,
  });
  return response.data.data!;
};

export const refundOrderAdmin = async (
  orderId: string,
  tx_hash?: string
): Promise<Order> => {
  const response = await apiClient.post<ApiResponse<Order>>(`/orders/${orderId}/refund`, {
    tx_hash: tx_hash || null,
  });
  return response.data.data!;
};

export const resolveDisputeAdmin = async (
  orderId: string,
  resolution_notes: string
): Promise<Order> => {
  const response = await apiClient.post<ApiResponse<Order>>(
    `/orders/${orderId}/resolve-dispute`,
    { resolution_notes }
  );
  return response.data.data!;
};

// 3. Admin Seller Directory
export const fetchAdminSellers = async (
  params?: AdminSellerQueryParams
): Promise<AdminSellerListResponse> => {
  const response = await apiClient.get<ApiResponse<AdminSellerListResponse>>('/admin/sellers', {
    params,
  });
  return response.data.data!;
};

export const fetchSellerProfileByIdAdmin = async (sellerId: string): Promise<SellerProfile> => {
  const response = await apiClient.get<ApiResponse<SellerProfile>>(
    `/seller/profile/${sellerId}`
  );
  return response.data.data!;
};

export const fetchSellerTrustHistoryByIdAdmin = async (
  sellerId: string
): Promise<TrustHistory[]> => {
  const response = await apiClient.get<ApiResponse<TrustHistory[]>>(
    `/seller/trust/history/${sellerId}`
  );
  return response.data.data || [];
};

// 4. Admin User Directory
export const fetchAdminUsers = async (
  params?: AdminUserQueryParams
): Promise<AdminUserListResponse> => {
  const response = await apiClient.get<ApiResponse<AdminUserListResponse>>('/admin/users', {
    params,
  });
  return response.data.data!;
};

// 5. Infrastructure Health Check
export interface HealthStatus {
  status: string;
  service: string;
  version: string;
}

export const checkBackendHealth = async (): Promise<HealthStatus> => {
  const rootUrl = (apiClient.defaults.baseURL || '').replace(/\/api\/v1\/?$/, '');
  const targetUrl = `${rootUrl}/health`;
  const response = await apiClient.get<HealthStatus>(targetUrl);
  return response.data;
};

