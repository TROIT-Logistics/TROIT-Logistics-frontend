import iphoneImg from '@/assets/images/product_iphone14pro.png';
import samsungImg from '@/assets/images/product_samsung23ultra.png';
import hpSpectreImg from '@/assets/images/product_hpspectre.png';

/**
 * Utility to resolve high-resolution product images based on product title
 */
export const getProductImage = (productName: string): string => {
  const name = productName.toLowerCase();

  if (name.includes('iphone')) {
    return iphoneImg;
  }
  if (name.includes('samsung') || name.includes('galaxy') || name.includes('s23')) {
    return samsungImg;
  }
  if (name.includes('spectre') || name.includes('hp') || name.includes('laptop')) {
    return hpSpectreImg;
  }

  // Fallback high quality tech placeholder
  return iphoneImg;
};

export const getProductImagesList = (productName: string): string[] => {
  const primary = getProductImage(productName);
  const name = productName.toLowerCase();

  if (name.includes('iphone')) {
    return [iphoneImg, samsungImg, hpSpectreImg];
  }
  if (name.includes('samsung')) {
    return [samsungImg, iphoneImg, hpSpectreImg];
  }

  return [primary, iphoneImg, samsungImg];
};
