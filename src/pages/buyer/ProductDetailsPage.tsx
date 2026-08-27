import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProductById } from '@/lib/api/products';
import { createOrder } from '@/lib/api/orders';
import { Product } from '@/lib/api/types';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ShieldCheck, ArrowLeft, ShoppingBag, CheckCircle, Package, Lock } from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    fetchProductById(id)
      .then((data) => setProduct(data))
      .catch((err) => setError((err as Error).message || 'Product not found'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!product) return;

    setError(null);
    setIsOrdering(true);

    try {
      const order = await createOrder({
        product_id: product.id,
        quantity,
      });

      // Redirect to order status tracking page
      navigate(`/buyer/orders/${order.id}`);
    } catch (err) {
      setError((err as Error).message || 'Failed to place order');
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '110px 20px 60px' }} className="container">
        <Link
          to="/buyer"
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
          <ArrowLeft size={18} /> Back to Verified Marketplace
        </Link>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
            Loading product inspection record...
          </div>
        ) : error || !product ? (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #EF4444',
              color: '#EF4444',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            {error || 'Product not found'}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '36px',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {/* Product Overview Card */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#10B981',
                    border: '1px solid #10B981',
                    borderRadius: 'var(--radius-pill)',
                    padding: '6px 14px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  <ShieldCheck size={18} /> TROIT AGENT VERIFIED
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  Port Harcourt GRA Phase 2 Hub
                </span>
              </div>

              <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px', color: 'var(--color-text-main)' }}>
                {product.name}
              </h1>

              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--color-orange-primary)', marginBottom: '24px' }}>
                ₦{product.price.toLocaleString()}
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-surface-card)',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  marginBottom: '24px',
                }}
              >
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>Inspection Description & Condition</h4>
                <p style={{ fontSize: '0.925rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '14px' }}>
                  {product.description}
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, backgroundColor: 'var(--color-bg-page)', border: '1px solid var(--color-border-light)', padding: '6px 12px', borderRadius: '6px' }}>
                    Condition: {product.condition}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, backgroundColor: 'var(--color-bg-page)', border: '1px solid var(--color-border-light)', padding: '6px 12px', borderRadius: '6px' }}>
                    Stock Available: {product.stock}
                  </span>
                </div>
              </div>

              {/* Inspection Guarantees */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  <CheckCircle size={16} style={{ color: '#10B981' }} /> Hardware & display physically tested by field agent
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  <Package size={16} style={{ color: 'var(--color-orange-primary)' }} /> Sealed & tagged in TROIT tamper-evident package
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  <Lock size={16} style={{ color: 'var(--color-yellow-accent)' }} /> Payment held in Protected State until buyer delivery confirmation
                </div>
              </div>
            </div>

            {/* Order Action Card */}
            <div
              style={{
                backgroundColor: 'var(--color-surface-card)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Order Verification Summary</h3>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                    Select Quantity
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      type="button"
                      className="btn btn-dark"
                      style={{ padding: '8px 16px', borderRadius: '6px' }}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, width: '32px', textAlign: 'center' }}>{quantity}</span>
                    <button
                      type="button"
                      className="btn btn-dark"
                      style={{ padding: '8px 16px', borderRadius: '6px' }}
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    borderTop: '1px solid var(--color-border-light)',
                    paddingTop: '16px',
                    marginBottom: '24px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span>Unit Price:</span>
                    <span>₦{product.price.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span>Quantity:</span>
                    <span>{quantity}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-orange-primary)', marginTop: '12px' }}>
                    <span>Total Amount:</span>
                    <span>₦{(product.price * quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                {user?.role === 'seller' && user.id === product.seller_id ? (
                  <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', fontSize: '0.85rem' }}>
                    You are the seller of this product.
                  </div>
                ) : (
                  <button
                    onClick={handleOrder}
                    disabled={isOrdering || product.stock <= 0}
                    className="btn btn-orange"
                    style={{ width: '100%', padding: '14px', borderRadius: '8px', fontSize: '1rem', justifyContent: 'center' }}
                  >
                    <ShoppingBag size={20} /> {isOrdering ? 'Processing Order...' : 'Place Order (Protected State)'}
                  </button>
                )}

                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '12px', lineHeight: 1.4 }}>
                  Payment remains in Protected status until rider pickup inspection and buyer delivery confirmation.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
