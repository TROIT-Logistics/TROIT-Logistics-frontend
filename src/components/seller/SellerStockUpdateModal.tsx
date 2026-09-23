import React, { useState } from 'react';
import { Product } from '@/lib/api/types';
import { updateProductStock } from '@/lib/api/products';
import { X, RefreshCw, AlertCircle } from 'lucide-react';

interface SellerStockUpdateModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: (updatedProduct: Product) => void;
}

export const SellerStockUpdateModal: React.FC<SellerStockUpdateModalProps> = ({
  product,
  onClose,
  onSuccess,
}) => {
  const [stock, setStock] = useState(product.stock.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const stockNum = parseInt(stock, 10);

    if (isNaN(stockNum) || stockNum < 0) {
      setError('Stock quantity must be a non-negative integer (0 or greater).');
      return;
    }

    setIsLoading(true);

    try {
      const updated = await updateProductStock(product.id, stockNum);
      onSuccess(updated);
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Failed to update product stock');
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
          maxWidth: '420px',
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
            <RefreshCw size={20} style={{ color: 'var(--color-orange-primary)' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Update Inventory Stock</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Update stock units for <strong>{product.name}</strong>. Current stock: <strong>{product.stock}</strong>.
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
              Available Stock Quantity *
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
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
              type="submit"
              className="btn btn-orange"
              disabled={isLoading}
              style={{ fontSize: '0.85rem' }}
            >
              {isLoading ? 'Updating Stock...' : 'Update Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerStockUpdateModal;
