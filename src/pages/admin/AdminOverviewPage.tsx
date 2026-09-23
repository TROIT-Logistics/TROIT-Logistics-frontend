import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminDataTable, Column } from '@/components/admin/AdminDataTable';
import { fetchAdminProducts, fetchAdminOrders, checkBackendHealth, HealthStatus } from '@/lib/api/admin';
import { Product, Order } from '@/lib/api/types';
import { Package, ShoppingBag, ShieldAlert, CheckCircle2, Clock, Activity, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminOverviewPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [prodsRes, ordersRes, healthRes] = await Promise.allSettled([
        fetchAdminProducts(),
        fetchAdminOrders(),
        checkBackendHealth(),
      ]);

      if (prodsRes.status === 'fulfilled') setProducts(prodsRes.value);
      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value);
      if (healthRes.status === 'fulfilled') setHealth(healthRes.value);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load operational overview data';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute live KPIs strictly from real backend payloads
  const totalProducts = products.length;
  const pendingProductVerifications = products.filter(
    (p) => p.verification_status === 'PENDING' || p.authenticity_status === 'UNINSPECTED'
  ).length;

  const totalOrders = orders.length;
  const protectedEscrowOrders = orders.filter((o) => o.payment_status === 'PROTECTED').length;
  const disputedOrders = orders.filter(
    (o) => o.status === 'CANCELLED' || String(o.status).toUpperCase().includes('DISPUTE')
  ).length;

  const recentOrders = orders.slice(0, 5);

  const orderColumns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Order ID',
      render: (o) => (
        <code style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 600 }}>
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
      header: 'Seller ID (Admin Internal)',
      render: (o) => (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          {o.seller_id.substring(0, 8)}...
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (o) => (
        <span style={{ fontWeight: 700 }}>
          ${o.amount?.toLocaleString() || '0'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Order Status',
      render: (o) => <AdminStatusBadge status={o.status} type="order" size="sm" />,
    },
    {
      key: 'payment_status',
      header: 'Escrow Status',
      render: (o) => <AdminStatusBadge status={o.payment_status} type="payment" size="sm" />,
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
    <AdminLayout title="Operational Overview" subtitle="Real-time control center for TROIT Logistics platform">
      {error && (
        <div
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-sm)',
            color: '#DC2626',
            marginBottom: '1.25rem',
            fontSize: '0.875rem',
          }}
        >
          <strong>API Connection Error:</strong> {error}
        </div>
      )}

      {/* KPI Section */}
      <div
        className="admin-kpi-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <AdminStatCard
          title="Total Products"
          value={totalProducts}
          subtitle="Live listings"
          icon={Package}
          loading={loading}
          badge={{ text: 'LIVE', variant: 'success' }}
        />

        <AdminStatCard
          title="Total Orders"
          value={totalOrders}
          subtitle="All transactions"
          icon={ShoppingBag}
          loading={loading}
          badge={{ text: 'LIVE', variant: 'success' }}
        />

        <AdminStatCard
          title="Protected Escrow"
          value={protectedEscrowOrders}
          subtitle="Escrow held"
          icon={CheckCircle2}
          loading={loading}
          badge={{ text: 'ACTIVE', variant: 'info' }}
        />

        <AdminStatCard
          title="Pending Inspections"
          value={pendingProductVerifications}
          subtitle="Awaiting verify"
          icon={Clock}
          loading={loading}
          badge={{
            text: pendingProductVerifications > 0 ? 'ATTENTION' : 'CLEAR',
            variant: pendingProductVerifications > 0 ? 'warning' : 'success',
          }}
        />

        <AdminStatCard
          title="Backend Health"
          value={health ? 'ONLINE' : 'CHECKING'}
          subtitle={health ? `v${health.version}` : 'Connecting...'}
          icon={Activity}
          loading={loading}
          badge={{ text: health?.status === 'ok' ? 'HEALTHY' : 'PENDING', variant: 'success' }}
        />
      </div>

      {/* Operational Attention Section */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
              Pending Operations Queue
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
              Items requiring administrator evaluation and verification
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '0.875rem',
          }}
        >
          {/* Action item 1 */}
          <div
            onClick={() => navigate('/admin/products')}
            style={{
              padding: '0.875rem 1rem',
              backgroundColor: 'var(--color-surface-card)',
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              minHeight: '44px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
              <div style={{ padding: '0.5rem', backgroundColor: 'rgba(245, 184, 66, 0.15)', color: '#D97706', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}>
                <Clock size={18} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Product Verifications
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {pendingProductVerifications} items pending physical inspection
                </div>
              </div>
            </div>
            <ArrowUpRight size={18} color="var(--color-text-light)" style={{ flexShrink: 0 }} />
          </div>

          {/* Action item 2 */}
          <div
            onClick={() => navigate('/admin/disputes')}
            style={{
              padding: '0.875rem 1rem',
              backgroundColor: 'var(--color-surface-card)',
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
              <div style={{ padding: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#DC2626', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}>
                <ShieldAlert size={18} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Open Order Disputes
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {disputedOrders} orders requiring admin resolution
                </div>
              </div>
            </div>
            <ArrowUpRight size={18} color="var(--color-text-light)" style={{ flexShrink: 0 }} />
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
            Recent Platform Orders
          </h3>
          <button
            onClick={() => navigate('/admin/orders')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-orange-primary)',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              minHeight: '36px',
            }}
          >
            View All Orders <ArrowUpRight size={16} />
          </button>
        </div>

        <AdminDataTable
          columns={orderColumns}
          data={recentOrders}
          keyExtractor={(o) => o.id}
          loading={loading}
          emptyTitle="No Orders Executed"
          emptyDescription="No customer orders have been placed on the system yet."
          onRowClick={(o) => navigate(`/admin/orders?orderId=${o.id}`)}
        />
      </div>
    </AdminLayout>
  );
};
