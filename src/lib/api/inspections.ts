import apiClient from './client';
import { ApiResponse, InspectionReport, ProductVerificationSummary } from './types';

export interface CreateProductInspectionPayload {
  order_id?: string;
  authenticity_verified: boolean;
  physical_condition: string;
  serial_number?: string;
  functional_tests?: Record<string, unknown>;
  photos_json?: Record<string, unknown>;
  notes?: string;
}

export const fetchProductInspection = async (productId: string): Promise<InspectionReport> => {
  const res = await apiClient.get<ApiResponse<InspectionReport>>(`/products/${productId}/inspection`);
  if (!res.data.data) {
    throw new Error('No inspection report found');
  }
  return res.data.data;
};

export const fetchProductVerificationSummary = async (
  productId: string
): Promise<ProductVerificationSummary> => {
  const res = await apiClient.get<ApiResponse<ProductVerificationSummary>>(
    `/products/${productId}/verification`
  );
  if (!res.data.data) {
    throw new Error('Product verification summary not found');
  }
  return res.data.data;
};

export const createProductInspection = async (
  productId: string,
  payload: CreateProductInspectionPayload
): Promise<InspectionReport> => {
  const res = await apiClient.post<ApiResponse<InspectionReport>>(
    `/products/${productId}/inspection`,
    payload
  );
  if (!res.data.data) {
    throw new Error('Failed to create inspection report');
  }
  return res.data.data;
};
