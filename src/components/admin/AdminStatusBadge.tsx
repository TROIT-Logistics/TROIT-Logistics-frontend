import React from 'react';

export type StatusBadgeType =
  | 'product_verification'
  | 'product_authenticity'
  | 'order'
  | 'payment'
  | 'delivery'
  | 'seller_verification'
  | 'seller_grade'
  | 'general';

interface AdminStatusBadgeProps {
  status: string;
  type?: StatusBadgeType;
  size?: 'sm' | 'md' | 'lg';
}

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({
  status,
  type = 'general',
  size = 'md',
}) => {
  const normalized = status.toUpperCase().trim();

  let bg = '#F3F4F6';
  let color = '#374151';
  let border = '#E5E7EB';

  switch (type) {
    case 'product_verification':
    case 'product_authenticity':
    case 'seller_verification':
      if (['VERIFIED', 'PASSED', 'GRADE A', 'LV5', 'LV4'].includes(normalized)) {
        bg = 'rgba(16, 185, 129, 0.1)';
        color = '#059669';
        border = 'rgba(16, 185, 129, 0.2)';
      } else if (['PENDING', 'UNDER_REVIEW', 'UNINSPECTED', 'GRADE B', 'LV3', 'LV2'].includes(normalized)) {
        bg = 'rgba(245, 184, 66, 0.15)';
        color = '#D97706';
        border = 'rgba(245, 184, 66, 0.3)';
      } else if (['REJECTED', 'FAILED', 'GRADE C', 'LV1'].includes(normalized)) {
        bg = 'rgba(239, 68, 68, 0.1)';
        color = '#DC2626';
        border = 'rgba(239, 68, 68, 0.2)';
      }
      break;

    case 'payment':
      if (['RELEASED'].includes(normalized)) {
        bg = 'rgba(16, 185, 129, 0.1)';
        color = '#059669';
        border = 'rgba(16, 185, 129, 0.2)';
      } else if (['PROTECTED', 'HELD'].includes(normalized)) {
        bg = 'rgba(59, 130, 246, 0.1)';
        color = '#2563EB';
        border = 'rgba(59, 130, 246, 0.2)';
      } else if (['PENDING'].includes(normalized)) {
        bg = 'rgba(245, 184, 66, 0.15)';
        color = '#D97706';
        border = 'rgba(245, 184, 66, 0.3)';
      }
      break;

    case 'order':
    case 'delivery':
      if (['DELIVERED', 'COMPLETED'].includes(normalized)) {
        bg = 'rgba(16, 185, 129, 0.1)';
        color = '#059669';
        border = 'rgba(16, 185, 129, 0.2)';
      } else if (['OUT_FOR_DELIVERY', 'IN_TRANSIT', 'READY_FOR_PICKUP', 'CONFIRMED'].includes(normalized)) {
        bg = 'rgba(59, 130, 246, 0.1)';
        color = '#2563EB';
        border = 'rgba(59, 130, 246, 0.2)';
      } else if (['PENDING', 'PICKUP_PENDING'].includes(normalized)) {
        bg = 'rgba(245, 184, 66, 0.15)';
        color = '#D97706';
        border = 'rgba(245, 184, 66, 0.3)';
      } else if (['CANCELLED', 'DISPUTED', 'REFUNDED'].includes(normalized)) {
        bg = 'rgba(239, 68, 68, 0.1)';
        color = '#DC2626';
        border = 'rgba(239, 68, 68, 0.2)';
      }
      break;

    default:
      break;
  }

  const padding = size === 'sm' ? '2px 8px' : size === 'lg' ? '6px 14px' : '4px 10px';
  const fontSize = size === 'sm' ? '11px' : size === 'lg' ? '13px' : '12px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding,
        fontSize,
        fontWeight: 600,
        borderRadius: 'var(--radius-pill)',
        backgroundColor: bg,
        color: color,
        border: `1px solid ${border}`,
        whiteSpace: 'nowrap',
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
      }}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
};
