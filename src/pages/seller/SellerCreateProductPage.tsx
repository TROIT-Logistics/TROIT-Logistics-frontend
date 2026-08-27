import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProduct } from '@/lib/api/products';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, PlusCircle } from 'lucide-react';

export const SellerCreateProductPage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('Grade A - Like New');
  const [stock, setStock] = useState('1');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock, 10);

    if (!name.trim()) {
      setError('Product name cannot be empty');
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid price greater than zero');
      return;
    }
    if (isNaN(stockNum) || stockNum < 1) {
      setError('Stock quantity must be at least 1');
      return;
    }

    setIsLoading(true);

    try {
      await createProduct({
        name: name.trim(),
        description: description.trim(),
        price: priceNum,
        condition,
        stock: stockNum,
      });

      navigate('/seller');
    } catch (err) {
      setError((err as Error).message || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '110px 20px 60px' }} className="container">
        <Link
          to="/seller"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--color-text-muted)',
            fontWeight: 600,
            fontSize: '0.9rem',
            marginBottom: '24px',
          }}
        >
          <ArrowLeft size={18} /> Back to Seller Dashboard
        </Link>

        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '36px',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 77, 0, 0.1)',
                  color: 'var(--color-orange-primary)',
                }}
              >
                <PlusCircle size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>List New Product</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                  Product will be submitted for TROIT agent physical inspection
                </p>
              </div>
            </div>

            {error && (
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid #EF4444',
                  color: '#EF4444',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  fontSize: '0.85rem',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. iPhone 14 Pro Max 256GB"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border-light)',
                    backgroundColor: 'var(--color-bg-page)',
                    color: 'var(--color-text-main)',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Detailed Description & Accessories
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe physical condition, battery health, included accessories..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border-light)',
                    backgroundColor: 'var(--color-bg-page)',
                    color: 'var(--color-text-main)',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Price (₦)
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="650000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border-light)',
                      backgroundColor: 'var(--color-bg-page)',
                      color: 'var(--color-text-main)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border-light)',
                      backgroundColor: 'var(--color-bg-page)',
                      color: 'var(--color-text-main)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Item Condition Grade
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border-light)',
                    backgroundColor: 'var(--color-bg-page)',
                    color: 'var(--color-text-main)',
                    fontSize: '0.9rem',
                  }}
                >
                  <option value="Grade A - Like New">Grade A - Like New</option>
                  <option value="Grade A - Certified">Grade A - Certified</option>
                  <option value="Grade B - Excellent">Grade B - Excellent</option>
                  <option value="Grade C - Good Working Order">Grade C - Good Working Order</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-orange"
                disabled={isLoading}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', justifyContent: 'center' }}
              >
                {isLoading ? 'Submitting Product...' : 'List Product for Verification'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SellerCreateProductPage;
