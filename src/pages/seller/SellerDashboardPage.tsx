import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, verifyProduct } from '@/lib/api/products';
import { fetchOrders } from '@/lib/api/orders';
import { Product, Order } from '@/lib/api/types';
import { getProductImage } from '@/lib/utils/productImages';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Plus, Sparkles } from 'lucide-react';

export const SellerDashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [pendingProds, verifiedProds, userOrders] = await Promise.all([
        fetchProducts('PENDING').catch(() => []),
        fetchProducts('VERIFIED').catch(() => []),
        fetchOrders().catch(() => []),
      ]);
      setProducts([...pendingProds, ...verifiedProds]);
      setOrders(userOrders);
    } catch (err) {
      setError((err as Error).message || 'Failed to load seller dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDemoVerify = async (productId: string) => {
    setActionMsg(null);
    try {
      await verifyProduct(productId, 'VERIFIED');
      setActionMsg('Product verified successfully for demo presentation!');
      await loadData();
    } catch (err) {
      setError((err as Error).message || 'Failed to verify product');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '110px 20px 60px' }} className="container">
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Seller Dashboard</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Manage products, view verification statuses, and monitor orders
            </p>
          </div>

          <Link to="/seller/products/new" className="btn btn-orange">
            <Plus size={18} /> Add New Product
          </Link>
        </div>

        {actionMsg && (
          <div
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid #10B981',
              color: '#10B981',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '24px',
              fontSize: '0.9rem',
            }}
          >
            {actionMsg}
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #EF4444',
              color: '#EF4444',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '24px',
            }}
          >
            {error}
          </div>
        )}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
            Loading dashboard data...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Products Catalogue */}
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>
                Listed Products ({products.length})
              </h2>

              {products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                  No products listed yet. Click "Add New Product" to list an item.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {products.map((prod) => {
                    const prodImg = getProductImage(prod.name);

                    return (
                      <div
                        key={prod.id}
                        style={{
                          backgroundColor: 'var(--color-surface-card)',
                          border: '1px solid var(--color-border-light)',
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                          <img src={prodImg} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <span
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: 'var(--radius-pill)',
                              backgroundColor: prod.verification_status === 'VERIFIED' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(245, 184, 66, 0.95)',
                              color: '#FFFFFF',
                            }}
                          >
                            {prod.verification_status}
                          </span>
                        </div>

                        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>{prod.name}</h4>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-orange-primary)', marginBottom: '12px' }}>
                              ₦{prod.price.toLocaleString()}
                            </div>
                          </div>

                          {prod.verification_status === 'PENDING' && (
                            <button
                              onClick={() => handleDemoVerify(prod.id)}
                              className="btn btn-dark"
                              style={{ width: '100%', fontSize: '0.75rem', padding: '8px' }}
                            >
                              <Sparkles size={14} /> Demo Action: Mark Verified
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Orders Summary */}
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>
                Seller Incoming Orders ({orders.length})
              </h2>

              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                  No active orders for your products yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      style={{
                        padding: '16px 20px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-surface-card)',
                        border: '1px solid var(--color-border-light)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Order #{ord.id.slice(0, 8)}...</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          Quantity: {ord.quantity} | Total: ₦{ord.amount.toLocaleString()}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-orange-primary)' }}>
                          Status: {ord.status}
                        </span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Payment: {ord.payment_status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SellerDashboardPage;
