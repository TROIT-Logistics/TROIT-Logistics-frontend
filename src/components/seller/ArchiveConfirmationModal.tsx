import React, { useState } from 'react';
import { Product } from '@/lib/api/types';
import { archiveProduct } from '@/lib/api/products';
import { X, Archive, AlertTriangle, AlertCircle } from 'lucide-react';

interface ArchiveConfirmationModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: (updatedProduct: Product) => void;
}

export const ArchiveConfirmationModal: React.FC<ArchiveConfirmationModalProps> = ({
  product,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleArchive = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const archived = await archiveProduct(product.id);
      onSuccess(archived);
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Failed to archive product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border-light)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '460px',
          padding: '28px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Archive size={22} style={{ color: '#F59E0B' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Archive Product</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: 'var(--color-text-main)',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '0.875rem',
            display: 'flex',
            gap: '12px',
          }}
        >
          <AlertTriangle size={22} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Marketplace Removal Notice:</strong>
            <p style={{ margin: '6px 0 0 0', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              This product will be removed from the active marketplace. Historical orders and product records will be preserved.
            </p>
          </div>
        </div>

        <div style={{ fontSize: '0.9rem' }}>
          Are you sure you want to archive <strong>{product.name}</strong>? You can restore it to active inventory at any time.
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #EF4444',
              color: '#EF4444',
              borderRadius: '6px',
              padding: '10px 14px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '4px' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-dark"
            disabled={isLoading}
            style={{ fontSize: '0.85rem' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleArchive}
            disabled={isLoading}
            style={{
              backgroundColor: '#F59E0B',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              padding: '8px 18px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Archiving Product...' : 'Archive Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveConfirmationModal;
