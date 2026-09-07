import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '@/lib/api/products';
import { fetchOrders } from '@/lib/api/orders';
import { fetchWishlist, removeFromWishlist } from '@/lib/api/wishlist';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '@/lib/api/notifications';
import { seedDemoData } from '@/lib/api/seed';
import { Product, Order, Wishlist, Notification } from '@/lib/api/types';
import { getProductImage } from '@/lib/utils/productImages';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  ShieldCheck,
  Search,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Heart,
  Bell,
  User,
  CheckCircle,
  Trash2,
  CheckCheck,
  CreditCard,
} from 'lucide-react';
import { VisualSearchButton, VisualSearchModal } from '@/features/buyer/components';

export const BuyerPage: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'marketplace' | 'orders' | 'wishlist' | 'notifications' | 'profile'>(
    'marketplace'
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Wishlist[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [prodsData, ordersData, wishlistData, notifsData] = await Promise.all([
        fetchProducts('VERIFIED'),
        fetchOrders().catch(() => []),
        fetchWishlist().catch(() => []),
        fetchNotifications().catch(() => []),
      ]);

      setProducts(prodsData);
      setOrders(ordersData);
      setWishlistItems(wishlistData);
      setNotifications(notifsData);
    } catch (err) {
      setError((err as Error).message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedDemoData();
      await loadDashboardData();
    } catch (err) {
      setError((err as Error).message || 'Failed to seed demo data');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleRemoveWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      setWishlistItems((prev) => prev.filter((item) => item.product_id !== productId));
    } catch (err) {
      setError((err as Error).message || 'Failed to remove item from wishlist');
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch {
      // ignore
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {
      // ignore
    }
  };

  const activeOrdersCount = orders.filter((o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'COMPLETED').length;
  const unreadNotifsCount = notifications.filter((n) => !n.is_read).length;

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '110px 20px 60px' }} className="container">
        {/* Marketplace / Dashboard Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <div>
              <div
                className="pill-badge"
                style={{
                  marginBottom: '8px',
                  background: 'rgba(255,77,0,0.1)',
                  color: 'var(--color-orange-primary)',
                  border: '1px solid rgba(255,77,0,0.2)',
                }}
              >
                <ShieldCheck size={16} /> TROIT VERIFIED MARKETPLACE & BUYER PORTAL
              </div>
              <h1 className="section-title" style={{ fontSize: '1.75rem' }}>
                Welcome back, {user?.full_name || 'Buyer'}
              </h1>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleSeed} disabled={isSeeding} className="btn btn-dark" style={{ fontSize: '0.85rem' }}>
                <Sparkles size={16} /> {isSeeding ? 'Seeding...' : 'Seed Demo Data'}
              </button>
            </div>
          </div>

          {/* Overview Summary Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginTop: '20px',
            }}
          >
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 107, 0, 0.12)',
                  color: 'var(--color-orange-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShoppingBag size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Active Orders</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{activeOrdersCount}</div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Completed Tx</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{completedOrdersCount}</div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(236, 72, 153, 0.12)',
                  color: '#EC4899',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Heart size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Saved Products</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{wishlistItems.length}</div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  color: '#3B82F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CreditCard size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Escrow Payment Protection</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#3B82F6' }}>ACTIVE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            borderBottom: '1px solid var(--color-border-light)',
            marginBottom: '24px',
            overflowX: 'auto',
            paddingBottom: '2px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('marketplace')}
            style={{
              padding: '10px 18px',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'marketplace' ? '3px solid var(--color-orange-primary)' : '3px solid transparent',
              color: activeTab === 'marketplace' ? 'var(--color-orange-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
            }}
          >
            Verified Marketplace
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '10px 18px',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'orders' ? '3px solid var(--color-orange-primary)' : '3px solid transparent',
              color: activeTab === 'orders' ? 'var(--color-orange-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            My Orders ({orders.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wishlist')}
            style={{
              padding: '10px 18px',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'wishlist' ? '3px solid var(--color-orange-primary)' : '3px solid transparent',
              color: activeTab === 'wishlist' ? 'var(--color-orange-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Saved Wishlist ({wishlistItems.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            style={{
              padding: '10px 18px',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'notifications' ? '3px solid var(--color-orange-primary)' : '3px solid transparent',
              color: activeTab === 'notifications' ? 'var(--color-orange-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Notifications {unreadNotifsCount > 0 && <span style={{ backgroundColor: '#EF4444', color: '#FFF', padding: '2px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>{unreadNotifsCount}</span>}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '10px 18px',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'profile' ? '3px solid var(--color-orange-primary)' : '3px solid transparent',
              color: activeTab === 'profile' ? 'var(--color-orange-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Profile & Verification
          </button>
        </div>

        {/* Error Banner */}
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

        {/* TAB 1: VERIFIED MARKETPLACE */}
        {activeTab === 'marketplace' && (
          <div>
            {/* Search Controls */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
                backgroundColor: 'var(--color-surface-card)',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-light)',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', flex: '1 1 400px', maxWidth: '680px', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: '1 1 240px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                  <input
                    type="text"
                    placeholder="Search verified smartphones, laptops, electronics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: 'var(--radius-pill)',
                      border: '1px solid var(--color-border-light)',
                      backgroundColor: 'var(--color-bg-page)',
                      color: 'var(--color-text-main)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <VisualSearchButton onClick={() => setIsVisualSearchOpen(true)} />
              </div>
            </div>

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
                Loading verified inventory...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px dashed var(--color-border-light)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <ShieldCheck size={48} style={{ color: 'var(--color-orange-primary)', marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>No Verified Products Found</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                  Click below to instantly populate demo verified products for Port Harcourt.
                </p>
                <button onClick={handleSeed} disabled={isSeeding} className="btn btn-orange">
                  <Sparkles size={18} /> {isSeeding ? 'Seeding Demo Products...' : 'Seed Verified Products'}
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '28px',
                }}
              >
                {filteredProducts.map((product) => {
                  const prodImg = getProductImage(product.name);

                  return (
                    <div
                      key={product.id}
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border-light)',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <div
                        style={{
                          height: '220px',
                          backgroundColor: 'var(--color-surface-card)',
                          position: 'relative',
                          overflow: 'hidden',
                          borderBottom: '1px solid var(--color-border-light)',
                        }}
                      >
                        <img
                          src={prodImg}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />

                        <div
                          style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            backgroundColor: 'rgba(16, 185, 129, 0.95)',
                            color: '#FFFFFF',
                            borderRadius: 'var(--radius-pill)',
                            padding: '4px 12px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          ✓ VERIFIED
                        </div>

                        <div
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            color: '#FFFFFF',
                            borderRadius: 'var(--radius-pill)',
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          Stock: {product.stock}
                        </div>
                      </div>

                      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                            {product.name}
                          </h3>

                          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '14px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {product.description}
                          </p>

                          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-surface-card)', border: '1px solid var(--color-border-light)', padding: '4px 10px', borderRadius: '6px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                              Condition: {product.condition}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-orange-primary)', marginBottom: '14px' }}>
                            ₦{product.price.toLocaleString()}
                          </div>

                          <Link
                            to={`/buyer/products/${product.id}`}
                            className="btn btn-orange"
                            style={{ width: '100%', borderRadius: '8px', fontSize: '0.875rem', justifyContent: 'center' }}
                          >
                            View Details & Order <ArrowRight size={16} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY ORDERS */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>My Orders</h2>
            </div>

            {orders.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '50px 20px',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px dashed var(--color-border-light)',
                }}
              >
                <ShoppingBag size={40} style={{ color: 'var(--color-text-muted)', marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>No Orders Placed Yet</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                  Browse the verified marketplace to place your first order protected by Soroban Escrow.
                </p>
                <button onClick={() => setActiveTab('marketplace')} className="btn btn-orange">
                  Explore Verified Marketplace
                </button>
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
                      padding: '20px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '16px',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                        ORDER #{order.id}
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>
                        ₦{order.amount.toLocaleString()} (Quantity: {order.quantity})
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        style={{
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-pill)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          backgroundColor:
                            order.status === 'COMPLETED'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : 'rgba(255, 107, 0, 0.15)',
                          color: order.status === 'COMPLETED' ? '#10B981' : 'var(--color-orange-primary)',
                        }}
                      >
                        {order.status}
                      </span>

                      <Link
                        to={`/buyer/orders/${order.id}`}
                        className="btn btn-dark"
                        style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                      >
                        Track Order →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SAVED WISHLIST */}
        {activeTab === 'wishlist' && (
          <div>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Saved Products Wishlist</h2>
            </div>

            {wishlistItems.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '50px 20px',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px dashed var(--color-border-light)',
                }}
              >
                <Heart size={40} style={{ color: 'var(--color-text-muted)', marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>No Saved Products</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                  Save products from the marketplace to keep track of items for future orders.
                </p>
                <button onClick={() => setActiveTab('marketplace')} className="btn btn-orange">
                  Explore Products
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {wishlistItems.map((item) => {
                  const product = item.product;
                  return (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border-light)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>
                          {product?.name || `Product ${item.product_id.slice(0, 8)}`}
                        </div>
                        {product && (
                          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-orange-primary)', marginBottom: '12px' }}>
                            ₦{product.price.toLocaleString()}
                          </div>
                        )}
                        <div style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                          Saved on {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Link
                          to={`/buyer/products/${item.product_id}`}
                          className="btn btn-orange"
                          style={{ flex: 1, fontSize: '0.8rem', justifyContent: 'center' }}
                        >
                          View Item
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRemoveWishlist(item.product_id)}
                          className="btn btn-dark"
                          style={{ padding: '8px 12px' }}
                          title="Remove from Wishlist"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Account & Order Notifications</h2>
              {notifications.some((n) => !n.is_read) && (
                <button
                  onClick={handleMarkAllNotificationsRead}
                  className="btn btn-dark"
                  style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                >
                  <CheckCheck size={16} /> Mark All as Read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '50px 20px',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px dashed var(--color-border-light)',
                }}
              >
                <Bell size={40} style={{ color: 'var(--color-text-muted)', marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>No Notifications Yet</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  Updates about your orders, payment escrow status, and delivery milestones will appear here.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    style={{
                      backgroundColor: notif.is_read ? 'var(--color-surface)' : 'rgba(255, 107, 0, 0.06)',
                      border: notif.is_read ? '1px solid var(--color-border-light)' : '1px solid rgba(255, 107, 0, 0.25)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{notif.title}</span>
                        {!notif.is_read && (
                          <span style={{ backgroundColor: 'var(--color-orange-primary)', color: '#FFF', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                            NEW
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '6px' }}>
                        {notif.message}
                      </p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {new Date(notif.created_at).toLocaleString()}
                      </span>
                    </div>

                    {!notif.is_read && (
                      <button
                        onClick={() => handleMarkNotificationRead(notif.id)}
                        className="btn btn-dark"
                        style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PROFILE / KYC */}
        {activeTab === 'profile' && (
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <User size={28} style={{ color: 'var(--color-orange-primary)' }} />
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Account & Verification Profile</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Authenticated Buyer Credentials
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Full Name</div>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>{user?.full_name || 'N/A'}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Email Address</div>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>{user?.email || 'N/A'}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Account Role</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase', color: 'var(--color-orange-primary)' }}>
                  {user?.role || 'buyer'}
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-surface-card)',
                border: '1px dashed var(--color-border-light)',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <ShieldCheck size={20} style={{ color: '#10B981' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Buyer Account Protection Status</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Your account is active. All marketplace orders placed through your profile are automatically protected under TROIT Soroban Smart Contract Escrow settlement rules.
              </p>
            </div>
          </div>
        )}
      </main>

      <VisualSearchModal isOpen={isVisualSearchOpen} onClose={() => setIsVisualSearchOpen(false)} />

      <Footer />
    </div>
  );
};

export default BuyerPage;
