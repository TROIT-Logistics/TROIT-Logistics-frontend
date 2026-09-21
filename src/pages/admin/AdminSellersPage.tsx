import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDataTable, Column } from '@/components/admin/AdminDataTable';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { fetchAdminSellers, fetchSellerTrustHistoryByIdAdmin } from '@/lib/api/admin';
import { AdminSellerItem, TrustHistory } from '@/lib/api/types';
import { Store, ShieldCheck, X, Phone, Mail, Package, ShoppingBag } from 'lucide-react';

export const AdminSellersPage: React.FC = () => {
  const [sellers, setSellers] = useState<AdminSellerItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detail Modal State
  const [selectedSeller, setSelectedSeller] = useState<AdminSellerItem | null>(null);
  const [trustHistory, setTrustHistory] = useState<TrustHistory[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadSellers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetchAdminSellers({
        page,
        limit: 10,
        search: search.trim() || undefined,
        verification_status: verificationStatus === 'ALL' ? undefined : verificationStatus,
      });

      setSellers(res.items || []);
      setTotalPages(res.total_pages || 1);
      setTotalRecords(res.total || 0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load seller directory from server');
    } finally {
      setLoading(false);
    }
  }, [page, search, verificationStatus]);

  useEffect(() => {
    loadSellers();
  }, [loadSellers]);

  const handleRowClick = async (seller: AdminSellerItem) => {
    setSelectedSeller(seller);
    setTrustHistory([]);
    try {
      setDetailLoading(true);
      const history = await fetchSellerTrustHistoryByIdAdmin(seller.seller_id);
      setTrustHistory(history);
    } catch {
      // Trust history fetch optional fallback
    } finally {
      setDetailLoading(false);
    }
  };

  const columns: Column<AdminSellerItem>[] = [
    {
      key: 'store_name',
      header: 'Merchant Store',
      render: (item) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>
            {item.store_name || 'Unnamed Store'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {item.store_address || 'No physical address provided'}
          </div>
        </div>
      ),
    },
    {
      key: 'user_full_name',
      header: 'Seller Account',
      render: (item) => (
        <div>
          <div style={{ fontWeight: 600 }}>{item.user_full_name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.user_email}</div>
        </div>
      ),
    },
    {
      key: 'verification_status',
      header: 'Verification Status',
      render: (item) => (
        <AdminStatusBadge status={item.verification_status} type="seller_verification" />
      ),
    },
    {
      key: 'trust_level',
      header: 'Trust Metrics',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
          <AdminStatusBadge status={item.seller_grade} type="seller_grade" />
          <AdminStatusBadge status={item.trust_level} type="seller_verification" />
        </div>
      ),
    },
    {
      key: 'successful_transactions',
      header: 'Fulfillment Rate',
      render: (item) => (
        <div>
          <span style={{ fontWeight: 700, color: '#059669' }}>{item.fulfillment_rate}%</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
            {item.successful_transactions} txns
          </span>
        </div>
      ),
    },
    {
      key: 'total_products',
      header: 'Activity',
      render: (item) => (
        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
          <div>{item.total_products} products</div>
          <div>{item.total_orders} orders</div>
        </div>
      ),
    },
  ];

  const filterElement = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
        Status:
      </label>
      <select
        value={verificationStatus}
        onChange={(e) => {
          setVerificationStatus(e.target.value);
          setPage(1);
        }}
        style={{
          padding: '0.5rem 0.75rem',
          fontSize: '0.84rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border-light)',
          backgroundColor: 'var(--color-surface-card)',
          color: 'var(--color-text-main)',
          outline: 'none',
          cursor: 'pointer',
        }}
      >
        <option value="ALL">All Statuses</option>
        <option value="PENDING">PENDING</option>
        <option value="UNDER_REVIEW">UNDER_REVIEW</option>
        <option value="VERIFIED">VERIFIED</option>
        <option value="REJECTED">REJECTED</option>
      </select>
    </div>
  );

  return (
    <AdminLayout
      title="Seller Directory & Verification"
      subtitle="Inspect merchant store profiles, trust scores, and verification status"
    >
      <AdminDataTable
        columns={columns}
        data={sellers}
        keyExtractor={(item) => item.seller_id}
        loading={loading}
        error={error}
        emptyTitle="No Merchant Sellers Found"
        emptyDescription="No seller profiles matched the selected verification status or search query."
        isServerSide
        page={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={(p) => setPage(p)}
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder="Search store name, seller name, email..."
        filterElement={filterElement}
        onRowClick={handleRowClick}
      />

      {/* Seller Detail Modal */}
      {selectedSeller && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setSelectedSeller(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--radius-md)',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)',
              padding: '1.75rem',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                borderBottom: '1px solid var(--color-border-light)',
                paddingBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div
                  style={{
                    width: '3.25rem',
                    height: '3.25rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(255, 77, 0, 0.12)',
                    color: 'var(--color-orange-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Store size={26} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: 'var(--color-text-main)',
                      margin: 0,
                    }}
                  >
                    {selectedSeller.store_name || 'Unnamed Merchant Store'}
                  </h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {selectedSeller.store_address || 'No physical store address recorded'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedSeller(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Badges & Trust Summary */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <AdminStatusBadge status={selectedSeller.verification_status} type="seller_verification" size="lg" />
              <AdminStatusBadge status={selectedSeller.seller_grade} type="seller_grade" size="lg" />
              <AdminStatusBadge status={selectedSeller.trust_level} type="seller_verification" size="lg" />
            </div>

            {/* Contact Details Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                backgroundColor: 'var(--color-surface-card)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
                  Merchant Full Name
                </span>
                <strong>{selectedSeller.user_full_name}</strong>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={12} /> Email Address
                </span>
                <span style={{ fontSize: '0.84rem' }}>{selectedSeller.user_email}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={12} /> Phone Number
                </span>
                <span style={{ fontSize: '0.84rem' }}>{selectedSeller.user_phone || 'Not provided'}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
                  Successful Transactions
                </span>
                <span style={{ fontSize: '1.125rem', fontWeight: 800 }}>{selectedSeller.successful_transactions}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
                  Fulfillment Rate
                </span>
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#059669' }}>
                  {selectedSeller.fulfillment_rate}%
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Package size={12} /> Total Products Listed
                </span>
                <span style={{ fontSize: '1.125rem', fontWeight: 800 }}>{selectedSeller.total_products}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShoppingBag size={12} /> Total Orders Received
                </span>
                <span style={{ fontSize: '1.125rem', fontWeight: 800 }}>{selectedSeller.total_orders}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
                  Registered Date
                </span>
                <span>{new Date(selectedSeller.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Trust Audit History */}
            <div>
              <h4
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 800,
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--color-text-main)',
                }}
              >
                <ShieldCheck size={18} color="var(--color-orange-primary)" /> Trust Audit Trail
              </h4>

              {detailLoading ? (
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', padding: '0.5rem 0' }}>
                  Loading trust audit log...
                </div>
              ) : trustHistory.length === 0 ? (
                <div
                  style={{
                    fontSize: '0.84rem',
                    color: 'var(--color-text-muted)',
                    backgroundColor: 'var(--color-surface-card)',
                    padding: '0.875rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border-light)',
                  }}
                >
                  No recorded trust level transitions for this merchant.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {trustHistory.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: 'var(--color-surface-card)',
                        border: '1px solid var(--color-border-light)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.84rem',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700 }}>
                          {item.old_level} → <span style={{ color: 'var(--color-orange-primary)' }}>{item.new_level}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                          Reason: {item.reason}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                        {new Date(item.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
