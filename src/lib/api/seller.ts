import apiClient from './client';
import {
  ApiResponse,
  SellerProfile,
  SellerVerificationStatusResponse,
  Subscription,
  TrustHistory,
} from './types';

export interface UpdateSellerProfilePayload {
  store_name?: string;
  store_address?: string;
}

export interface SubmitSellerVerificationPayload {
  store_name: string;
  store_address: string;
  id_type?: string;
  id_number?: string;
}

export interface UpdateSubscriptionPayload {
  plan_tier: string;
  duration_days?: number;
}

export const fetchCurrentSellerProfile = async (): Promise<SellerProfile> => {
  const res = await apiClient.get<ApiResponse<SellerProfile>>('/seller/profile');
  if (!res.data.data) {
    throw new Error('Seller profile not found');
  }
  return res.data.data;
};

export const fetchSellerProfileById = async (sellerId: string): Promise<SellerProfile> => {
  const res = await apiClient.get<ApiResponse<SellerProfile>>(`/seller/profile/${sellerId}`);
  if (!res.data.data) {
    throw new Error('Seller profile not found');
  }
  return res.data.data;
};

export const updateSellerProfile = async (
  payload: UpdateSellerProfilePayload
): Promise<SellerProfile> => {
  const res = await apiClient.patch<ApiResponse<SellerProfile>>('/seller/profile', payload);
  if (!res.data.data) {
    throw new Error('Failed to update seller profile');
  }
  return res.data.data;
};

export const fetchSellerVerification = async (): Promise<SellerVerificationStatusResponse> => {
  const res = await apiClient.get<ApiResponse<SellerVerificationStatusResponse>>(
    '/seller/verification'
  );
  if (!res.data.data) {
    throw new Error('Seller verification state not found');
  }
  return res.data.data;
};

export const submitSellerVerification = async (
  payload: SubmitSellerVerificationPayload
): Promise<SellerVerificationStatusResponse> => {
  const res = await apiClient.post<ApiResponse<SellerVerificationStatusResponse>>(
    '/seller/verification',
    payload
  );
  if (!res.data.data) {
    throw new Error('Failed to submit seller verification');
  }
  return res.data.data;
};

export const fetchTrustHistory = async (): Promise<TrustHistory[]> => {
  const res = await apiClient.get<ApiResponse<TrustHistory[]>>('/seller/trust/history');
  return res.data.data || [];
};

export const fetchTrustHistoryById = async (sellerId: string): Promise<TrustHistory[]> => {
  const res = await apiClient.get<ApiResponse<TrustHistory[]>>(
    `/seller/trust/history/${sellerId}`
  );
  return res.data.data || [];
};

export const fetchSellerSubscription = async (): Promise<Subscription> => {
  const res = await apiClient.get<ApiResponse<Subscription>>('/seller/subscription');
  if (!res.data.data) {
    throw new Error('Seller subscription not found');
  }
  return res.data.data;
};

export const updateSellerSubscription = async (
  payload: UpdateSubscriptionPayload
): Promise<Subscription> => {
  const res = await apiClient.post<ApiResponse<Subscription>>('/seller/subscription', payload);
  if (!res.data.data) {
    throw new Error('Failed to update subscription');
  }
  return res.data.data;
};

// Aliases matching backend API domain terminology
export const getSellerProfile = fetchCurrentSellerProfile;
export const getPublicSellerProfile = fetchSellerProfileById;
export const getSellerVerification = fetchSellerVerification;
export const getSellerTrustHistory = fetchTrustHistory;
export const getPublicSellerTrustHistory = fetchTrustHistoryById;
