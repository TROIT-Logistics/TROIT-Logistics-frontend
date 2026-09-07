import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  fetchOrderById,
  updateOrderStatus,
  createPickupInspection,
  confirmDelivery,
  fetchOrderHistory,
  OrderStatusHistoryItem,
} from '@/lib/api/orders';
import { Order, OrderStatus } from '@/lib/api/types';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Truck,
  Package,
  Clock,
  Sparkles,
  AlertCircle,
  Link as LinkIcon,
  FileCode,
  History,
} from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Order Placed (Awaiting Funding)',
  CONFIRMED: 'Payment Protected / Order Confirmed',
  READY_FOR_PICKUP: 'Product Inspected & Ready for Pickup',
  OUT_FOR_DELIVERY: 'On the Way (Out for Delivery)',
  DELIVERED: 'Delivered (Awaiting Confirmation)',
  COMPLETED: 'Order Completed & Escrow Released',
  CANCELLED: 'Order Cancelled',
};

export const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [historyItems, setHistoryItems] = useState<OrderStatusHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadOrder = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const [orderData, historyData] = await Promise.all([
        fetchOrderById(id),
        fetchOrderHistory(id).catch(() => []),
      ]);
      setOrder(orderData);
      setHistoryItems(historyData);
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
        condition: 'Physical condition verified Grade A by Port Harcourt Field Agent.',
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
      setSuccessMsg(`Order status updated to ${STATUS_LABELS[nextStatus] || nextStatus}`);
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
      setSuccessMsg('Delivery confirmed! Order is now COMPLETED and protected payment is RELEASED on-chain.');
      await loadOrder();
    } catch (err) {
      setError((err as Error).message || 'Failed to confirm delivery');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'PENDING':
        return 1;
      case 'CONFIRMED':
        return 2;
      case 'READY_FOR_PICKUP':
        return 3;
      case 'OUT_FOR_DELIVERY':
        return 4;
      case 'DELIVERED':
        return 5;
      case 'COMPLETED':
        return 6;
      default:
        return 1;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 1;

  // Helper to find timestamp for a specific status from backend history
  const getTimestampForStatus = (statusName: string): string | null => {
    const item = historyItems.find(
      (h) => h.status.toUpperCase() === statusName.toUpperCase()
    );
    return item ? new Date(item.created_at).toLocaleString() : null;
  };

  const getRealTxHash = (hash?: string | null): string | null => {
    if (!hash || hash.startsWith('tx-') || hash.trim().length < 32) return null;
    return hash;
  };

  const activeTxHash =
    getRealTxHash(order?.blockchain_tx_hash) ||
    getRealTxHash(order?.release_tx_hash) ||
    getRealTxHash(order?.funding_tx_hash) ||
    getRealTxHash(order?.refund_tx_hash);

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
            Loading real-time order tracking timeline...
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
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                    ORDER ID: {order.id}
                  </span>
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-main)', marginTop: '4px' }}>
                    Order Status:{' '}
                    <span style={{ color: 'var(--color-orange-primary)' }}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
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
                      backgroundColor:
                        order.payment_status === 'RELEASED'
                          ? 'rgba(16, 185, 129, 0.15)'
                          : order.payment_status === 'PROTECTED'
                          ? 'rgba(59, 130, 246, 0.15)'
                          : 'rgba(245, 184, 66, 0.15)',
                      color:
                        order.payment_status === 'RELEASED'
                          ? '#10B981'
                          : order.payment_status === 'PROTECTED'
                          ? '#3B82F6'
                          : '#D97706',
                      border: `1px solid ${
                        order.payment_status === 'RELEASED'
                          ? '#10B981'
                          : order.payment_status === 'PROTECTED'
                          ? '#3B82F6'
                          : '#F5B842'
                      }`,
                      fontWeight: 700,
                      fontSize: '0.85rem',
                    }}
                  >
                    <ShieldCheck size={18} /> Escrow State: {order.payment_status}
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Step Progress Tracker Timeline */}
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
                TROIT Verified Delivery Progress Timeline
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '16px',
                }}
              >
                {[
                  { step: 1, label: 'Order Placed', icon: CheckCircle2, statusKey: 'ORDER_CREATED' },
                  { step: 2, label: 'Payment Protected', icon: ShieldCheck, statusKey: 'PAYMENT_PROTECTED' },
                  { step: 3, label: 'Product Inspected', icon: Package, statusKey: 'READY_FOR_PICKUP' },
                  { step: 4, label: 'On the Way', icon: Truck, statusKey: 'OUT_FOR_DELIVERY' },
                  { step: 5, label: 'Delivered', icon: Clock, statusKey: 'DELIVERED' },
                  { step: 6, label: 'Completed', icon: CheckCircle2, statusKey: 'COMPLETED' },
                ].map((item) => {
                  const isActive = currentStep >= item.step;
                  const isCurrent = currentStep === item.step;
                  const Icon = item.icon;
                  const timestamp = getTimestampForStatus(item.statusKey);

                  return (
                    <div
                      key={item.step}
                      style={{
                        textAlign: 'center',
                        padding: '16px 10px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isCurrent
                          ? 'rgba(255, 107, 0, 0.1)'
                          : isActive
                          ? 'var(--color-surface-card)'
                          : 'var(--color-bg-page)',
                        border: isCurrent
                          ? '2px solid var(--color-orange-primary)'
                          : isActive
                          ? '1px solid var(--color-border-light)'
                          : '1px solid var(--color-border-light)',
                        opacity: isActive ? 1 : 0.45,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          backgroundColor: isActive ? 'var(--color-orange-primary)' : 'var(--color-text-light)',
                          color: '#FFFFFF',
                          marginBottom: '8px',
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: isCurrent ? 800 : 600,
                          color: isActive ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                          marginBottom: '4px',
                        }}
                      >
                        {item.label}
                      </div>

                      {/* Display actual backend timestamp when available */}
                      {timestamp ? (
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                          {timestamp}
                        </div>
                      ) : isActive ? (
                        <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700 }}>
                          Completed
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                          Upcoming
                        </div>
                      )}
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

            {/* Buyer Payment Protection Action Card */}
            {order.payment_status === 'PENDING' && user?.id === order.buyer_id && (
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <ShieldCheck size={28} style={{ color: 'var(--color-orange-primary)' }} />
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
                      Payment Integration Coming Soon
                    </h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Payment Status: <strong style={{ color: '#F59E0B' }}>Pending Funding</strong>
                    </span>
                  </div>
                </div>

                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '20px' }}>
                  Live Soroban on-chain escrow funding is undergoing security integration and wallet pairing. Payment processing for your order total of <strong style={{ color: 'var(--color-orange-primary)', fontSize: '1.15rem' }}>₦{order.amount.toLocaleString()}</strong> is currently unavailable until wallet connection is active.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    disabled
                    className="btn btn-secondary"
                    style={{ padding: '14px 32px', fontSize: '1rem', fontWeight: 800, opacity: 0.6, cursor: 'not-allowed' }}
                  >
                    <ShieldCheck size={20} /> Payment Integration Coming Soon
                  </button>

                  <span style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)' }}>
                    🔒 On-Chain Escrow Security Integration In Progress
                  </span>
                </div>
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
                <p
                  style={{
                    color: 'var(--color-text-muted)',
                    fontSize: '0.9rem',
                    marginBottom: '16px',
                    maxWidth: '540px',
                    margin: '0 auto 16px',
                  }}
                >
                  Have you inspected your delivered item? Confirming delivery releases the protected payment to the seller.
                </p>
                <button
                  onClick={handleConfirmDelivery}
                  disabled={isUpdating}
                  className="btn btn-yellow"
                  style={{ padding: '12px 28px', fontSize: '1rem', fontWeight: 800 }}
                >
                  <ShieldCheck size={20} /> {isUpdating ? 'Confirming Release...' : 'Confirm Delivery & Release Payment'}
                </button>
              </div>
            )}

            {/* Payment & Blockchain Information Section */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <FileCode size={22} style={{ color: 'var(--color-orange-primary)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Escrow & Settlement Information</h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '20px',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Escrow Mapping ID</div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                    {order.escrow_id ? `#${order.escrow_id}` : 'Pending Escrow Sequence'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Escrow Payment State</div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: order.payment_status === 'RELEASED' ? '#10B981' : order.payment_status === 'PROTECTED' ? '#3B82F6' : '#D97706' }}>
                    {order.payment_status}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Blockchain Transaction Hash</div>
                  {activeTxHash ? (
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${activeTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--color-orange-primary)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        wordBreak: 'break-all',
                      }}
                    >
                      <LinkIcon size={14} /> View On-Chain ({activeTxHash.slice(0, 10)}...)
                    </a>
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                      Transaction record pending.
                    </div>
                  )}
                </div>
              </div>

              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--color-surface-card)',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border-light)',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-muted)',
                }}
              >
                <strong>Payment Protection Notice: </strong>
                {order.payment_status === 'PROTECTED'
                  ? 'Escrow status marked as protected.'
                  : order.payment_status === 'RELEASED'
                  ? 'Escrow status marked as released.'
                  : 'Payment integration is coming soon. Escrow payment cannot be processed via mock transactions.'}
              </div>
            </div>

            {/* Lifecycle History Audit Timeline */}
            {historyItems.length > 0 && (
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <History size={22} style={{ color: 'var(--color-orange-primary)' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Audit Trail Lifecycle Log</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {historyItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 14px',
                        backgroundColor: 'var(--color-surface-card)',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                      }}
                    >
                      <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>
                        {STATUS_LABELS[item.status] || item.status}
                      </span>
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Presentation Controls */}
            <div
              style={{
                backgroundColor: 'var(--color-surface-card)',
                border: '1px dashed var(--color-border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: 'var(--color-orange-primary)',
                  marginBottom: '12px',
                }}
              >
                <Sparkles size={16} /> DEMO PRESENTATION LIFECYCLE CONTROLS
              </div>

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
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetailsPage;
