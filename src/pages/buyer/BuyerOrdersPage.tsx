import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders } from '@/lib/api/orders';
import { Order } from '@/lib/api/types';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ShoppingBag, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export const BuyerOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchOrders()
      .then((data) => setOrders(data))
      .catch((err) => setError(err.message || 'Failed to load orders'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '110px 20px 60px' }} className="container">
        <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Orders</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Track your active delivery lifecycle & protected payment statuses
            </p>
          </div>
          <Link to="/buyer" className="btn btn-orange" style={{ fontSize: '0.85rem' }}>
            <ShoppingBag size={16} /> Browse Verified Marketplace
          </Link>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #EF4444',
              color: '#EF4444',
              borderRadius: '8px',
              padding: '14px 18px',
              marginBottom: '24px',
            }}
          >
            {error}
          </div>
        )}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: 'var(--color-surface)',
              border: '1px dashed var(--color-border-light)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <ShoppingBag size={48} style={{ color: 'var(--color-orange-primary)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>No Active Orders</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              Browse Port Harcourt verified items and place your first order.
            </p>
            <Link to="/buyer" className="btn btn-orange">
              Explore Verified Marketplace <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px 24px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                    ORDER ID: {order.id.slice(0, 8)}... | {new Date(order.created_at).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                    Total: ₦{order.amount.toLocaleString()} ({order.quantity} item)
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: order.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 77, 0, 0.15)',
                        color: order.status === 'COMPLETED' ? '#10B981' : 'var(--color-orange-primary)',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        marginBottom: '4px',
                      }}
                    >
                      {order.status === 'COMPLETED' ? <ShieldCheck size={14} /> : <Clock size={14} />} {order.status}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      Payment: {order.payment_status}
                    </div>
                  </div>

                  <Link
                    to={`/buyer/orders/${order.id}`}
                    className="btn btn-dark"
                    style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                  >
                    Track <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BuyerOrdersPage;
