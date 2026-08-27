import apiClient from './client';
import { VisualSearchResponse } from './types';

export class VisualSearchApiError extends Error {
  public statusCode?: number;
  public isEndpointUnavailable: boolean;

  constructor(message: string, statusCode?: number, isEndpointUnavailable: boolean = false) {
    super(message);
    this.name = 'VisualSearchApiError';
    this.statusCode = statusCode;
    this.isEndpointUnavailable = isEndpointUnavailable;
  }
}

/**
 * Sends a product image to the backend visual search endpoint:
 * POST /api/v1/products/visual-search
 */
export const postVisualSearch = async (imageFile: File | Blob): Promise<VisualSearchResponse> => {
  const formData = new FormData();
  formData.append('image', imageFile, imageFile instanceof File ? imageFile.name : 'camera_search.jpg');

  try {
    const response = await apiClient.post<VisualSearchResponse>(
      '/products/visual-search',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    const errObj = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
    const statusCode = errObj.response?.status;
    
    // Check if endpoint is not implemented or unavailable on the Rust backend
    const isUnavailable =
      statusCode === 404 ||
      statusCode === 501 ||
      statusCode === 405 ||
      errObj.message?.includes('Unable to connect') ||
      errObj.message?.includes('Network Error');

    const message = isUnavailable
      ? 'The AI Visual Search backend endpoint (POST /api/v1/products/visual-search) is currently unavailable or under maintenance on the TROIT server.'
      : errObj.response?.data?.message || errObj.message || 'Failed to process visual search request.';

    throw new VisualSearchApiError(message, statusCode, isUnavailable);
  }
};

