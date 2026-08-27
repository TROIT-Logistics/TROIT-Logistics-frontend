import { postVisualSearch, VisualSearchApiError } from '@/lib/api/visualSearch';
import { VisualSearchResponse } from '@/lib/api/types';

export interface ImageValidationError {
  code: 'INVALID_TYPE' | 'TOO_LARGE' | 'NO_IMAGE';
  message: string;
}

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Validates image before upload
 */
export const validateSearchImage = (file: File | Blob | null): ImageValidationError | null => {
  if (!file) {
    return {
      code: 'NO_IMAGE',
      message: 'No image provided. Please select or capture a photo first.',
    };
  }

  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      code: 'INVALID_TYPE',
      message: 'Please upload a JPG, PNG, or WEBP image.',
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      code: 'TOO_LARGE',
      message: 'That image is too large. Please choose a smaller image (max 10MB).',
    };
  }

  return null;
};

/**
 * Visual search service:
 * Validates input image and dispatches request to POST /api/v1/products/visual-search
 */
export const visualSearch = async (image: File | Blob): Promise<VisualSearchResponse> => {
  const validationError = validateSearchImage(image);
  if (validationError) {
    throw new Error(validationError.message);
  }

  try {
    return await postVisualSearch(image);
  } catch (err) {
    if (err instanceof VisualSearchApiError) {
      throw err;
    }
    throw new Error((err as Error).message || 'An unexpected error occurred during visual search.');
  }
};
