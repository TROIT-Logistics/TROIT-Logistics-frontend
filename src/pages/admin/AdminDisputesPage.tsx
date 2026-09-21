import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDataTable, Column } from '@/components/admin/AdminDataTable';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminDetailModal } from '@/components/admin/AdminDetailModal';
import { fetchAdminOrders, resolveDisputeAdmin, refundOrderAdmin } from '@/lib/api/admin';
import { Order } from '@/lib/api/types';

export const AdminDisputesPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadDisputedOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminOrders();
      // Filter orders requiring dispute arbitration or in cancelled/disputed state
      setOrders(data);
    } catch (err) {
      console.error('Failed to load disputes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisputedOrders();
  }, []);

  const disputedOrdersList = orders.filter(
    (o) => o.status === 'CANCELLED' || String(o.status).toUpperCase().includes('DISPUTE')
  );

  const handleResolveDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    if (!resolutionNotes.trim()) {
      alert('Resolution notes are required');
      return;
    }

    try {
      setIsUpdating(true);
      const updated = await resolveDisputeAdmin(selectedOrder.id, resolutionNotes.trim());
      setSelectedOrder(updated);
      setActionSuccess('Order dispute resolved successfully in backend');
      setResolutionNotes('');
      loadDisputedOrders();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Dispute resolution failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRefundDispute = async () => {
    if (!selectedOrder) return;
    if (!window.confirm('Execute escrow refund to buyer as part of dispute resolution?')) return;

    try {
      setIsUpdating(true);
      const updated = await refundOrderAdmin(selectedOrder.id);
      setSelectedOrder(updated);
      setActionSuccess('Escrow refunded to buyer and dispute closed');
      loadDisputedOrders();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Refund execution failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Dispute / Order ID',
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
      header: 'Disputed Amount',
      render: (o) => <span style={{ fontWeight: 700 }}>${o.amount?.toLocaleString()}</span>,
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
  ];

  return (
    <AdminLayout title="Order Dispute Center" subtitle="Review and resolve buyer-seller transaction disputes">
      <AdminDataTable
        columns={columns}
        data={disputedOrdersList.length > 0 ? disputedOrdersList : orders}
        keyExtractor={(o) => o.id}
        loading={loading}
        emptyTitle="No Active Disputes"
        emptyDescription="There are currently no open buyer-seller disputes requiring admin arbitration."
        onRowClick={(o) => {
          setSelectedOrder(o);
          setResolutionNotes('');
          setActionSuccess(null);
        }}
      />

      {/* Resolve Dispute Modal */}
      {selectedOrder && (
        <AdminDetailModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Dispute Arbitration: Order #${selectedOrder.id.substring(0, 8)}`}
          subtitle={`Disputed Amount: $${selectedOrder.amount?.toLocaleString()}`}
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
                backgroundColor: 'var(--color-surface-card)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
                fontSize: '0.8125rem',
              }}
            >
              <div>Buyer UUID: <code>{selectedOrder.buyer_id}</code></div>
              <div>Seller UUID: <code>{selectedOrder.seller_id}</code></div>
              <div>Order Status: <strong>{selectedOrder.status}</strong></div>
              <div>Escrow State: <strong>{selectedOrder.payment_status}</strong></div>
            </div>

            <form onSubmit={handleResolveDispute} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                  Admin Resolution Notes & Finding *
                </label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="State the arbitration findings, evidence reviewed, and resolution terms..."
                  rows={4}
                  required
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border-light)',
                    backgroundColor: 'var(--color-surface-card)',
                    color: 'var(--color-text-main)',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                {selectedOrder.payment_status === 'PROTECTED' && (
                  <button
                    type="button"
                    onClick={handleRefundDispute}
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
                    Refund Buyer & Close
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isUpdating}
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
                  Save Dispute Resolution
                </button>
              </div>
            </form>
          </div>
        </AdminDetailModal>
      )}
    </AdminLayout>
  );
};
