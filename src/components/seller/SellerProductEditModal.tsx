import React, { useState } from 'react';
import { Product, UpdateProductPayload } from '@/lib/api/types';
import { updateProduct } from '@/lib/api/products';
import { X, Edit3, AlertCircle } from 'lucide-react';

interface SellerProductEditModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: (updatedProduct: Product) => void;
}

export const SellerProductEditModal: React.FC<SellerProductEditModalProps> = ({
  product,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || '');
  const [price, setPrice] = useState(product.price.toString());
  const [condition, setCondition] = useState(product.condition || 'Grade A - Like New');
  const [isAfricanMade, setIsAfricanMade] = useState(product.is_african_made || false);
  const [africanMadeCategory, setAfricanMadeCategory] = useState(
    product.african_made_category || 'ELECTRONICS'
  );
  const [warrantyMonths, setWarrantyMonths] = useState(product.warranty_months?.toString() || '0');
  const [warrantyTerms, setWarrantyTerms] = useState(product.warranty_terms || '');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const priceNum = parseFloat(price);
    const warrantyNum = parseInt(warrantyMonths, 10) || 0;

    if (!name.trim()) {
      setError('Product name cannot be empty');
      return;
    }

    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid price greater than zero');
      return;
    }

    setIsLoading(true);

    try {
      const payload: UpdateProductPayload = {
        name: name.trim(),
        description: description.trim(),
        price: priceNum,
        condition,
        is_african_made: isAfricanMade,
        african_made_category: isAfricanMade ? africanMadeCategory : null,
        warranty_months: warrantyNum,
        warranty_terms: warrantyTerms.trim() || null,
      };

      const updated = await updateProduct(product.id, payload);
      onSuccess(updated);
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Failed to update product details');
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
          maxWidth: '540px',
          maxHeight: '90vh',
          overflowY: 'auto',
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
            <Edit3 size={20} style={{ color: 'var(--color-orange-primary)' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Edit Product Details</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
          >
            <X size={20} />
          </button>
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
              Product Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
              Price (₦) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
              Condition Grade
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="input-field"
            >
              <option value="Grade A - Like New">Grade A - Like New</option>
              <option value="Grade B - Very Good">Grade B - Very Good</option>
              <option value="Grade C - Good">Grade C - Good</option>
              <option value="Refurbished">Refurbished</option>
              <option value="Brand New">Brand New</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="editIsAfricanMade"
              checked={isAfricanMade}
              onChange={(e) => setIsAfricanMade(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-orange-primary)' }}
            />
            <label htmlFor="editIsAfricanMade" style={{ fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
              Made in Africa (Authentic Local Manufacture)
            </label>
          </div>

          {isAfricanMade && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                African Made Category
              </label>
              <select
                value={africanMadeCategory}
                onChange={(e) => setAfricanMadeCategory(e.target.value)}
                className="input-field"
              >
                <option value="ELECTRONICS">ELECTRONICS</option>
                <option value="HOME_APPLIANCES">HOME_APPLIANCES</option>
                <option value="FURNITURE">FURNITURE</option>
              </select>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                Warranty (Months)
              </label>
              <input
                type="number"
                min="0"
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                Warranty Terms
              </label>
              <input
                type="text"
                placeholder="e.g. Repair only"
                value={warrantyTerms}
                onChange={(e) => setWarrantyTerms(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
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
              {isLoading ? 'Saving Changes...' : 'Save Product Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerProductEditModal;
