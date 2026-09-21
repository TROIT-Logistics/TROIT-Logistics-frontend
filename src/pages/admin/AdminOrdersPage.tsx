import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDataTable, Column } from '@/components/admin/AdminDataTable';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminDetailModal } from '@/components/admin/AdminDetailModal';
import { fetchAdminOrders, updateOrderStatusAdmin, refundOrderAdmin } from '@/lib/api/admin';
import { Order, OrderStatus } from '@/lib/api/types';
import { AlertTriangle } from 'lucide-react';

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'READY_FOR_PICKUP',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'COMPLETED',
  'CANCELLED',
];

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('PENDING');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    try {
      setIsUpdating(true);
      const updated = await updateOrderStatusAdmin(selectedOrder.id, newStatus);
      setSelectedOrder(updated);
      setActionSuccess(`Order status updated to ${newStatus}`);
      loadOrders();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Status update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRefund = async () => {
    if (!selectedOrder) return;
    if (!window.confirm('Are you sure you want to execute an escrow refund for this order?')) return;
    try {
      setIsUpdating(true);
      const updated = await refundOrderAdmin(selectedOrder.id);
      setSelectedOrder(updated);
      setActionSuccess('Escrow refund processed successfully');
      loadOrders();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Refund execution failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Order ID',
      render: (o) => (
        <code style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700 }}>
          {o.id.substring(0, 8)}...
        </code>
      ),
    },
    {
      key: 'product_id',
      header: 'Product ID',
      render: (o) => (
        <code style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
          {o.product_id.substring(0, 8)}...
        </code>
      ),
    },
    {
      key: 'buyer_id',
      header: 'Buyer ID',
      render: (o) => (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          {o.buyer_id.substring(0, 8)}...
        </span>
      ),
    },
    {
      key: 'seller_id',
      header: 'Seller ID (Internal)',
      render: (o) => (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          {o.seller_id.substring(0, 8)}...
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (o) => <span style={{ fontWeight: 700 }}>${o.amount?.toLocaleString() || '0'}</span>,
    },
    {
      key: 'status',
      header: 'Order Status',
      render: (o) => <AdminStatusBadge status={o.status} type="order" />,
    },
    {
      key: 'payment_status',
      header: 'Escrow State',
      render: (o) => <AdminStatusBadge status={o.payment_status} type="payment" />,
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (o) => (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          {new Date(o.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout title="Order & Escrow Management" subtitle="Monitor global transactions, delivery status, and protected escrow funds">
      <AdminDataTable
        columns={columns}
        data={orders}
        keyExtractor={(o) => o.id}
        loading={loading}
        emptyTitle="No Platform Orders"
        emptyDescription="No customer orders found in the backend database."
        onRowClick={(o) => {
          setSelectedOrder(o);
          setNewStatus(o.status);
          setActionSuccess(null);
        }}
      />

      {/* Order Details & Actions Modal */}
      {selectedOrder && (
        <AdminDetailModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder.id.substring(0, 8)}`}
          subtitle={`Created on ${new Date(selectedOrder.created_at).toLocaleString()}`}
        >
          {actionSuccess && (
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-sm)',
                color: '#059669',
                marginBottom: '1rem',
                fontSize: '0.84rem',
                fontWeight: 600,
              }}
            >
              {actionSuccess}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                backgroundColor: 'var(--color-surface-card)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Order Amount</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>${selectedOrder.amount?.toLocaleString()}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Quantity</span>
                <span style={{ fontWeight: 700 }}>{selectedOrder.quantity} item(s)</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Order Status</span>
                <AdminStatusBadge status={selectedOrder.status} type="order" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Escrow Payment</span>
                <AdminStatusBadge status={selectedOrder.payment_status} type="payment" />
              </div>
            </div>

            {/* Admin Internal Identity View */}
            <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '1rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Counterparty Identity (Admin Internal)
              </h4>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div>Buyer UUID: <code style={{ color: 'var(--color-text-main)' }}>{selectedOrder.buyer_id}</code></div>
                <div>Seller UUID: <code style={{ color: 'var(--color-text-main)' }}>{selectedOrder.seller_id}</code></div>
                <div>Product UUID: <code style={{ color: 'var(--color-text-main)' }}>{selectedOrder.product_id}</code></div>
                {selectedOrder.blockchain_tx_hash && (
                  <div>Blockchain Tx: <code style={{ fontSize: '0.75rem' }}>{selectedOrder.blockchain_tx_hash}</code></div>
                )}
              </div>
            </div>

            {/* Status Update Control */}
            <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '1rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Admin Order Status Override
              </h4>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border-light)',
                    backgroundColor: 'var(--color-surface-card)',
                    color: 'var(--color-text-main)',
                    fontSize: '0.875rem',
                  }}
                >
                  {ORDER_STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating || newStatus === selectedOrder.status}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: 'var(--color-orange-primary)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Update Status
                </button>
              </div>
            </div>

            {/* Escrow Refund Execution */}
            {selectedOrder.payment_status === 'PROTECTED' && (
              <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#DC2626', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <AlertTriangle size={16} /> Escrow Refund Action
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                  Refunding will return protected escrow funds to the buyer and cancel the order transaction.
                </p>
                <button
                  onClick={handleRefund}
                  disabled={isUpdating}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Execute Escrow Refund
                </button>
              </div>
            )}
          </div>
        </AdminDetailModal>
      )}
    </AdminLayout>
  );
};
