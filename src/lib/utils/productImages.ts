import { Product, ProductImage } from '@/lib/api/types';

/**
 * Clean SVG fallback placeholder for products without uploaded photos.
 */
export const TROIT_FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="none">
      <rect width="400" height="300" fill="#1E293B"/>
      <rect x="1" y="1" width="398" height="298" rx="8" stroke="#334155" stroke-dasharray="4 4" fill="none"/>
      <path d="M200 100L235 155H165L200 100Z" fill="#FF4D00" opacity="0.35"/>
      <path d="M225 125L250 155H200L225 125Z" fill="#FF4D00" opacity="0.65"/>
      <circle cx="170" cy="115" r="10" fill="#FF4D00" opacity="0.5"/>
      <text x="200" y="195" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" fill="#94A3B8" text-anchor="middle">TROIT Verified Listing</text>
      <text x="200" y="215" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#64748B" text-anchor="middle">No photo uploaded by seller</text>
    </svg>
  `);

/**
 * Resolves the primary product image URL from real backend product images.
 * Priority:
 * 1. Image where sort_order === 0
 * 2. First image when sorted by sort_order ASC
 * 3. Clean TROIT fallback SVG if no images exist
 */
export const getPrimaryProductImage = (
  product?: { name?: string; images?: ProductImage[] } | Partial<Product> | null
): string => {
  if (!product || !product.images || product.images.length === 0) {
    return TROIT_FALLBACK_IMAGE;
  }

  const sorted = [...product.images].sort((a, b) => a.sort_order - b.sort_order);
  const primary = sorted.find((img) => img.sort_order === 0) || sorted[0];

  return primary?.url || TROIT_FALLBACK_IMAGE;
};

/**
 * Returns all image URLs from real backend product images sorted by sort_order ASC.
 * Returns empty array if product has no images (does not fabricate fake images).
 */
export const getProductGalleryImages = (
  product?: { name?: string; images?: ProductImage[] } | Partial<Product> | null
): string[] => {
  if (!product || !product.images || product.images.length === 0) {
    return [];
  }

  return [...product.images]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => img.url);
};

/**
 * Legacy compatibility fallback returning TROIT fallback image
 */
export const getProductImage = (_productName?: string): string => {
  return TROIT_FALLBACK_IMAGE;
};

/**
 * Legacy compatibility fallback returning empty array
 */
export const getProductImagesList = (_productName?: string): string[] => {
  return [];
};
