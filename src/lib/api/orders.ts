import apiClient from './client';
import { ApiResponse, ConfirmDeliveryRequest, FundOrderRequest, Order, OrderStatus, PickupInspection } from './types';

export interface CreateOrderPayload {
  product_id: string;
  quantity?: number;
}

export interface CreatePickupInspectionPayload {
  condition: string;
  notes?: string;
  inspection_status?: string;
}

export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
  const res = await apiClient.post<ApiResponse<Order>>('/orders', payload);
  if (!res.data.data) {
    throw new Error('Failed to create order');
  }
  return res.data.data;
};

export const fetchOrders = async (): Promise<Order[]> => {
  const res = await apiClient.get<ApiResponse<Order[]>>('/orders');
  return res.data.data || [];
};

export const fetchOrderById = async (id: string): Promise<Order> => {
  const res = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
  if (!res.data.data) {
    throw new Error('Order not found');
  }
  return res.data.data;
};

export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
  const res = await apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status });
  if (!res.data.data) {
    throw new Error('Failed to update order status');
  }
  return res.data.data;
};

export const createPickupInspection = async (
  id: string,
  payload: CreatePickupInspectionPayload
): Promise<PickupInspection> => {
  const res = await apiClient.post<ApiResponse<PickupInspection>>(`/orders/${id}/pickup-inspection`, payload);
  if (!res.data.data) {
    throw new Error('Failed to record pickup inspection');
  }
  return res.data.data;
};

export const fundOrder = async (id: string, payload?: FundOrderRequest): Promise<Order> => {
  const res = await apiClient.post<ApiResponse<Order>>(`/orders/${id}/fund`, payload || {});
  if (!res.data.data) {
    throw new Error('Failed to fund order');
  }
  return res.data.data;
};

export interface OrderStatusHistoryItem {
  id: string;
  order_id: string;
  status: string;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}

export const fetchOrderHistory = async (id: string): Promise<OrderStatusHistoryItem[]> => {
  const res = await apiClient.get<ApiResponse<OrderStatusHistoryItem[]>>(`/orders/${id}/history`);
  return res.data.data || [];
};

export const confirmDelivery = async (id: string, payload?: ConfirmDeliveryRequest): Promise<Order> => {
  const res = await apiClient.post<ApiResponse<Order>>(`/orders/${id}/confirm-delivery`, payload || {});
  if (!res.data.data) {
    throw new Error('Failed to confirm delivery');
  }
  return res.data.data;
};


