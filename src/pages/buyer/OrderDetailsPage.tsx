import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderById, updateOrderStatus, createPickupInspection, confirmDelivery } from '@/lib/api/orders';
import { Order, OrderStatus } from '@/lib/api/types';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ShieldCheck, ArrowLeft, CheckCircle2, Truck, Package, Clock, Sparkles, AlertCircle } from 'lucide-react';

export const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadOrder = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchOrderById(id);
      setOrder(data);
    } catch (err) {
      setError((err as Error).message || 'Order not found');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handlePickupInspection = async () => {
    if (!id) return;
    setIsUpdating(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await createPickupInspection(id, {
        condition: 'Physical condition verified Grade A by Port Harcourt Rider.',
        notes: 'Packaging sealed with TROIT security tape.',
        inspection_status: 'PASSED',
      });
      setSuccessMsg('Pickup inspection PASSED! Order is now READY_FOR_PICKUP.');
      await loadOrder();
    } catch (err) {
      setError((err as Error).message || 'Failed to record pickup inspection');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusTransition = async (nextStatus: OrderStatus) => {
    if (!id) return;
    setIsUpdating(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await updateOrderStatus(id, nextStatus);
      setSuccessMsg(`Order status updated to ${nextStatus}`);
      await loadOrder();
    } catch (err) {
      setError((err as Error).message || 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!id) return;
    setIsUpdating(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const updated = await confirmDelivery(id);
      setOrder(updated);
      setSuccessMsg('Delivery confirmed! Order is now COMPLETED and protected payment is RELEASED to seller.');
    } catch (err) {
      setError((err as Error).message || 'Failed to confirm delivery');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'CONFIRMED':
        return 1;
      case 'READY_FOR_PICKUP':
        return 2;
      case 'OUT_FOR_DELIVERY':
        return 3;
      case 'DELIVERED':
        return 4;
      case 'COMPLETED':
        return 5;
      default:
        return 1;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 1;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '110px 20px 60px' }} className="container">
        <Link
          to="/buyer/orders"
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
          <ArrowLeft size={18} /> My Orders List
        </Link>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)' }}>
            Loading order status tracker...
          </div>
        ) : error || !order ? (
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
            {error || 'Order not found'}
          </div>
        ) : (
          <div>
            {/* Header */}
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                marginBottom: '24px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                    ORDER ID: {order.id}
                  </span>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-main)', marginTop: '4px' }}>
                    Order Status: <span style={{ color: 'var(--color-orange-primary)' }}>{order.status}</span>
                  </h1>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: order.payment_status === 'RELEASED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 184, 66, 0.15)',
                      color: order.payment_status === 'RELEASED' ? '#10B981' : '#D97706',
                      border: `1px solid ${order.payment_status === 'RELEASED' ? '#10B981' : '#F5B842'}`,
                      fontWeight: 700,
                      fontSize: '0.85rem',
                    }}
                  >
                    <ShieldCheck size={18} /> Payment Status: {order.payment_status}
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Step Progress Tracker */}
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px 24px',
                marginBottom: '24px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '24px', textAlign: 'center' }}>
                TROIT Delivery Progress Timeline
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '16px',
                  position: 'relative',
                }}
              >
                {[
                  { step: 1, label: 'Order Confirmed', icon: CheckCircle2, statusKey: 'CONFIRMED' },
                  { step: 2, label: 'Ready For Pickup', icon: Package, statusKey: 'READY_FOR_PICKUP' },
                  { step: 3, label: 'Out For Delivery', icon: Truck, statusKey: 'OUT_FOR_DELIVERY' },
                  { step: 4, label: 'Delivered', icon: Clock, statusKey: 'DELIVERED' },
                  { step: 5, label: 'Order Completed', icon: ShieldCheck, statusKey: 'COMPLETED' },
                ].map((item) => {
                  const isActive = currentStep >= item.step;
                  const isCurrent = currentStep === item.step;
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.step}
                      style={{
                        textAlign: 'center',
                        padding: '16px 12px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isCurrent
                          ? 'rgba(255, 77, 0, 0.1)'
                          : isActive
                          ? 'var(--color-surface-card)'
                          : 'var(--color-bg-page)',
                        border: isCurrent
                          ? '2px solid var(--color-orange-primary)'
                          : isActive
                          ? '1px solid var(--color-border-light)'
                          : '1px border var(--color-border-light)',
                        opacity: isActive ? 1 : 0.45,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: isActive ? 'var(--color-orange-primary)' : 'var(--color-text-light)',
                          color: '#FFFFFF',
                          marginBottom: '8px',
                        }}
                      >
                        <Icon size={20} />
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: isCurrent ? 800 : 600, color: isActive ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>
                        {item.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* System Notifications */}
            {successMsg && (
              <div
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid #10B981',
                  color: '#10B981',
                  borderRadius: '8px',
                  padding: '14px 18px',
                  marginBottom: '24px',
                  fontSize: '0.9rem',
                }}
              >
                {successMsg}
              </div>
            )}

            {error && (
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid #EF4444',
                  color: '#EF4444',
                  borderRadius: '8px',
                  padding: '14px 18px',
                  marginBottom: '24px',
                  fontSize: '0.9rem',
                }}
              >
                {error}
              </div>
            )}

            {/* Buyer Delivery Confirmation Banner */}
            {order.status === 'DELIVERED' && user?.id === order.buyer_id && (
              <div
                style={{
                  backgroundColor: 'rgba(245, 184, 66, 0.12)',
                  border: '2px solid var(--color-yellow-accent)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  marginBottom: '24px',
                  textAlign: 'center',
                }}
              >
                <AlertCircle size={32} style={{ color: '#D97706', marginBottom: '8px' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>
                  Item Delivered! Please Confirm Receipt
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '16px', maxWidth: '540px', margin: '0 auto 16px' }}>
                  Have you inspected your delivered item? Confirming delivery releases the protected payment to the seller.
                </p>
                <button
                  onClick={handleConfirmDelivery}
                  disabled={isUpdating}
                  className="btn btn-yellow"
                  style={{ padding: '12px 28px', fontSize: '1rem', fontWeight: 800 }}
                >
                  <ShieldCheck size={20} /> {isUpdating ? 'Confirming...' : 'Confirm Delivery & Complete Order'}
                </button>
              </div>
            )}

            {/* Demo Presentation Control Panel */}
            <div
              style={{
                backgroundColor: 'var(--color-surface-card)',
                border: '1px dashed var(--color-border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-orange-primary)', marginBottom: '12px' }}>
                <Sparkles size={16} /> DEMO PRESENTATION LIFECYCLE CONTROLS
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                Use these buttons to step through the TROIT delivery flow during presentation:
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <button
                  onClick={handlePickupInspection}
                  disabled={isUpdating || order.status === 'COMPLETED'}
                  className="btn btn-dark"
                  style={{ fontSize: '0.8rem' }}
                >
                  1. Record Pickup Inspection (PASSED)
                </button>

                <button
                  onClick={() => handleStatusTransition('OUT_FOR_DELIVERY')}
                  disabled={isUpdating || order.status === 'COMPLETED'}
                  className="btn btn-dark"
                  style={{ fontSize: '0.8rem' }}
                >
                  2. Move to Out For Delivery
                </button>

                <button
                  onClick={() => handleStatusTransition('DELIVERED')}
                  disabled={isUpdating || order.status === 'COMPLETED'}
                  className="btn btn-dark"
                  style={{ fontSize: '0.8rem' }}
                >
                  3. Mark Delivered
                </button>
              </div>
            </div>

            {/* Order Details Card */}
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Order Financial & Summary Details</h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Product ID</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{order.product_id}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Quantity</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{order.quantity} unit(s)</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Total Amount</div>
                  <div style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--color-orange-primary)' }}>
                    ₦{order.amount.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Order Placed Date</div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {new Date(order.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetailsPage;
