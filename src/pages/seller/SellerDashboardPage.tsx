import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '@/lib/api/products';
import { fetchOrders } from '@/lib/api/orders';
import {
  fetchCurrentSellerProfile,
  fetchSellerVerification,
  fetchSellerSubscription,
  fetchTrustHistory,
} from '@/lib/api/seller';
import { Product, Order, SellerProfile, SellerVerificationStatusResponse, Subscription, TrustHistory } from '@/lib/api/types';
import { getProductImage } from '@/lib/utils/productImages';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Plus,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Award,
  CreditCard,
  CheckCircle,
  Info,
  History,
  Calendar,
} from 'lucide-react';

export const SellerDashboardPage: React.FC = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [verificationState, setVerificationState] = useState<SellerVerificationStatusResponse | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [trustHistory, setTrustHistory] = useState<TrustHistory[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [pendingProds, verifiedProds, userOrders, profileData, verificationData, subData, historyData] =
        await Promise.all([
          fetchProducts('PENDING').catch(() => []),
          fetchProducts('VERIFIED').catch(() => []),
          fetchOrders().catch(() => []),
          fetchCurrentSellerProfile().catch(() => null),
          fetchSellerVerification().catch(() => null),
          fetchSellerSubscription().catch(() => null),
          fetchTrustHistory().catch(() => []),
        ]);

      setProducts([...pendingProds, ...verifiedProds]);
      setOrders(userOrders);
      setSellerProfile(profileData);
      setVerificationState(verificationData);
      setSubscription(subData);
      setTrustHistory(historyData);
    } catch (err) {
      setError((err as Error).message || 'Failed to load seller dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sales & Earnings calculated strictly from real completed orders
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');
  const totalProductsSold = completedOrders.reduce((sum, o) => sum + o.quantity, 0);
  const releasedEarnings = completedOrders.reduce((sum, o) => sum + o.amount, 0);

  // Inspection inventory breakdown
  const verifiedInventoryCount = products.filter((p) => p.verification_status === 'VERIFIED').length;
  const awaitingInspectionCount = products.filter((p) => p.verification_status === 'PENDING').length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '110px 20px 60px' }} className="container">
        {/* Header with VERIFIED SELLER badge */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Seller Portal & Dashboard</h1>
              {verificationState?.verification_status === 'VERIFIED' && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#10B981',
                    border: '1px solid #10B981',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <ShieldCheck size={14} /> VERIFIED SELLER
                </span>
              )}
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Real-time store metrics, trust progression, inventory verification, and escrow settlement
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/seller/verification" className="btn btn-dark" style={{ fontSize: '0.85rem' }}>
              Verification Status: {verificationState?.verification_status || 'PENDING'}
            </Link>
            <Link to="/seller/products/new" className="btn btn-orange" style={{ fontSize: '0.85rem' }}>
              <Plus size={18} /> Add New Product
            </Link>
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
              marginBottom: '24px',
            }}
          >
            {error}
          </div>
        )}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
            Loading seller metrics & dashboard analytics...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Overview Metrics Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '16px',
              }}
            >
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Seller Trust Level</span>
                  <Award size={20} style={{ color: 'var(--color-orange-primary)' }} />
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-orange-primary)' }}>
                  {sellerProfile?.trust_level || 'LV1'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Grade: {sellerProfile?.seller_grade || 'Grade C'}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Total Released Earnings</span>
                  <TrendingUp size={20} style={{ color: '#10B981' }} />
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#10B981' }}>
                  ₦{releasedEarnings.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  From {completedOrders.length} completed transactions
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Products Sold</span>
                  <ShoppingBag size={20} style={{ color: '#3B82F6' }} />
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{totalProductsSold}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Fulfillment Rate: {sellerProfile?.fulfillment_rate || 100}%
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Inventory Inspection</span>
                  <CheckCircle size={20} style={{ color: '#F59E0B' }} />
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  {verifiedInventoryCount} Verified / {awaitingInspectionCount} Pending
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Total Listings: {products.length}
                </div>
              </div>
            </div>

            {/* Mandatory Seller Grade Explanation Box */}
            <div
              style={{
                backgroundColor: 'rgba(255, 107, 0, 0.06)',
                border: '1px solid rgba(255, 107, 0, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.875rem',
                color: 'var(--color-text-main)',
              }}
            >
              <Info size={20} style={{ color: 'var(--color-orange-primary)', flexShrink: 0 }} />
              <div>
                <strong>Grade Explanation:</strong> Grade represents the level of trust the supplier has built with TROIT. It does not represent product physical quality.
              </div>
            </div>

            {/* Subscription & VIP Entitlements Section */}
            {subscription && (
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <CreditCard size={22} style={{ color: 'var(--color-orange-primary)' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Seller VIP Plan & Entitlements</h3>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>
                      Current Tier: <span style={{ color: 'var(--color-orange-primary)' }}>{subscription.plan_tier}</span> ({subscription.status})
                    </div>
                    {subscription.expires_at && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        Expires on: {new Date(subscription.expires_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {subscription.entitlements && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-surface-card)', border: '1px solid var(--color-border-light)', padding: '6px 12px', borderRadius: '6px', fontWeight: 700 }}>
                        Listings Space: {subscription.entitlements.max_active_listings ?? 'Unlimited'}
                      </span>
                      <span style={{ fontSize: '0.75rem', backgroundColor: subscription.entitlements.advanced_analytics_enabled ? 'rgba(16, 185, 129, 0.15)' : 'var(--color-surface-card)', color: subscription.entitlements.advanced_analytics_enabled ? '#10B981' : 'var(--color-text-muted)', border: '1px solid var(--color-border-light)', padding: '6px 12px', borderRadius: '6px', fontWeight: 700 }}>
                        Analytics: {subscription.entitlements.advanced_analytics_enabled ? 'Enabled' : 'Standard'}
                      </span>
                      <span style={{ fontSize: '0.75rem', backgroundColor: subscription.entitlements.priority_verification_enabled ? 'rgba(59, 130, 246, 0.15)' : 'var(--color-surface-card)', color: subscription.entitlements.priority_verification_enabled ? '#3B82F6' : 'var(--color-text-muted)', border: '1px solid var(--color-border-light)', padding: '6px 12px', borderRadius: '6px', fontWeight: 700 }}>
                        Priority Verification: {subscription.entitlements.priority_verification_enabled ? 'Active' : 'Standard'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Seller Trust Progression History Card */}
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <History size={22} style={{ color: 'var(--color-orange-primary)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Seller Trust Progression History</h3>
              </div>

              {trustHistory.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '24px 16px',
                    backgroundColor: 'var(--color-surface-card)',
                    borderRadius: '8px',
                    border: '1px dashed var(--color-border-light)',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.85rem',
                  }}
                >
                  No trust progression updates recorded yet. Operating at initial level {sellerProfile?.trust_level || 'LV1'}.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {trustHistory.map((h) => (
                    <div
                      key={h.id}
                      style={{
                        backgroundColor: 'var(--color-surface-card)',
                        border: '1px solid var(--color-border-light)',
                        borderRadius: '8px',
                        padding: '14px 18px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 800, color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{h.old_level}</span>
                          <span style={{ fontWeight: 800, color: 'var(--color-orange-primary)' }}>→</span>
                          <span style={{ fontWeight: 900, color: '#10B981', fontSize: '1rem' }}>{h.new_level}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                          {h.reason}
                        </div>
                        {h.trigger_transaction_id && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            Tx Ref: {h.trigger_transaction_id}
                          </div>
                        )}
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} /> {new Date(h.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Listed Products Catalogue */}
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
                Store Inventory & Verification State ({products.length})
              </h2>

              {products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                  No products listed yet. Click "Add New Product" to list an item for field inspection.
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
                              backgroundColor:
                                prod.verification_status === 'VERIFIED'
                                  ? 'rgba(16, 185, 129, 0.95)'
                                  : 'rgba(245, 184, 66, 0.95)',
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
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                              Physical Condition: {prod.condition} | Stock: {prod.stock}
                            </div>
                          </div>
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
                  No incoming orders for your products yet.
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
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
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
