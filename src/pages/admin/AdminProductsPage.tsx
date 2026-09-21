import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDataTable, Column } from '@/components/admin/AdminDataTable';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminDetailModal } from '@/components/admin/AdminDetailModal';
import { fetchAdminProducts, verifyProductAdmin, createProductInspectionAdmin } from '@/lib/api/admin';
import { Product, ProductVerificationStatus } from '@/lib/api/types';
import { CheckCircle2, XCircle, ClipboardCheck, Shield } from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form state for creating physical inspection report
  const [showInspectionForm, setShowInspectionForm] = useState(false);
  const [physicalCondition, setPhysicalCondition] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [authenticityVerified, setAuthenticityVerified] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (filterStatus === 'ALL') return true;
    return p.verification_status === filterStatus;
  });

  const handleVerifyProduct = async (status: ProductVerificationStatus) => {
    if (!selectedProduct) return;
    try {
      setIsUpdating(true);
      const updated = await verifyProductAdmin(selectedProduct.id, status, status === 'VERIFIED' ? 'VERIFIED' : 'REJECTED');
      setSelectedProduct(updated);
      setActionSuccess(`Product status updated to ${status}`);
      loadProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (!physicalCondition.trim()) {
      alert('Physical condition description is required');
      return;
    }

    try {
      setIsUpdating(true);
      await createProductInspectionAdmin(selectedProduct.id, {
        authenticity_verified: authenticityVerified,
        physical_condition: physicalCondition,
        serial_number: serialNumber || null,
        notes: inspectionNotes || null,
      });

      setActionSuccess('Formal product inspection report created successfully');
      setShowInspectionForm(false);
      setPhysicalCondition('');
      setSerialNumber('');
      setInspectionNotes('');
      loadProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to submit inspection report');
    } finally {
      setIsUpdating(false);
    }
  };

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Product Name',
      render: (p) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{p.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Condition: {p.condition} | Stock: {p.stock}
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (p) => <span style={{ fontWeight: 700 }}>${p.price.toLocaleString()}</span>,
    },
    {
      key: 'verification_status',
      header: 'Verification Status',
      render: (p) => <AdminStatusBadge status={p.verification_status} type="product_verification" />,
    },
    {
      key: 'authenticity_status',
      header: 'Authenticity',
      render: (p) => <AdminStatusBadge status={p.authenticity_status || 'UNINSPECTED'} type="product_authenticity" size="sm" />,
    },
    {
      key: 'seller_id',
      header: 'Seller ID (Admin Internal)',
      render: (p) => (
        <code style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>
          {p.seller_id.substring(0, 8)}...
        </code>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (p) => (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          {new Date(p.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout title="Product Management" subtitle="Review marketplace products and execute physical inspections">
      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {['ALL', 'PENDING', 'VERIFIED', 'REJECTED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--color-border-light)',
              backgroundColor: filterStatus === st ? 'var(--color-orange-primary)' : 'var(--color-surface)',
              color: filterStatus === st ? '#FFFFFF' : 'var(--color-text-main)',
              fontWeight: 600,
              fontSize: '0.8125rem',
              cursor: 'pointer',
            }}
          >
            {st} ({st === 'ALL' ? products.length : products.filter((p) => p.verification_status === st).length})
          </button>
        ))}
      </div>

      <AdminDataTable
        columns={columns}
        data={filteredProducts}
        keyExtractor={(p) => p.id}
        loading={loading}
        emptyTitle="No Products Found"
        emptyDescription="No products match the selected status filter."
        onRowClick={(p) => {
          setSelectedProduct(p);
          setActionSuccess(null);
          setShowInspectionForm(false);
        }}
      />

      {/* Product Detail & Inspection Modal */}
      {selectedProduct && (
        <AdminDetailModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={selectedProduct.name}
          subtitle={`ID: ${selectedProduct.id}`}
          footerActions={
            !showInspectionForm ? (
              <>
                <button
                  onClick={() => setShowInspectionForm(true)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border-light)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-main)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                  }}
                >
                  <ClipboardCheck size={16} /> Record Inspection
                </button>

                {selectedProduct.verification_status !== 'REJECTED' && (
                  <button
                    onClick={() => handleVerifyProduct('REJECTED')}
                    disabled={isUpdating}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                    }}
                  >
                    <XCircle size={16} /> Reject Product
                  </button>
                )}

                {selectedProduct.verification_status !== 'VERIFIED' && (
                  <button
                    onClick={() => handleVerifyProduct('VERIFIED')}
                    disabled={isUpdating}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: '#059669',
                      color: '#FFFFFF',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                    }}
                  >
                    <CheckCircle2 size={16} /> Verify Product
                  </button>
                )}
              </>
            ) : null
          }
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

          {!showInspectionForm ? (
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
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Price</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>${selectedProduct.price.toLocaleString()}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Condition</span>
                  <span style={{ fontWeight: 700 }}>{selectedProduct.condition}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Stock Available</span>
                  <span style={{ fontWeight: 700 }}>{selectedProduct.stock} units</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Verification Status</span>
                  <AdminStatusBadge status={selectedProduct.verification_status} type="product_verification" />
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.375rem' }}>Description</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  {selectedProduct.description || 'No description provided.'}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Shield size={16} color="var(--color-orange-primary)" /> Admin Metadata (Internal Only)
                </h4>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div>Seller ID: <code style={{ color: 'var(--color-text-main)' }}>{selectedProduct.seller_id}</code></div>
                  <div>African Made: <strong>{selectedProduct.is_african_made ? 'Yes' : 'No'}</strong></div>
                  <div>Warranty Months: <strong>{selectedProduct.warranty_months} months</strong></div>
                  <div>Last Inspected: <strong>{selectedProduct.last_inspected_at ? new Date(selectedProduct.last_inspected_at).toLocaleString() : 'Never'}</strong></div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateInspection} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                New Physical Inspection Report
              </h4>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                  Physical Condition Description *
                </label>
                <textarea
                  value={physicalCondition}
                  onChange={(e) => setPhysicalCondition(e.target.value)}
                  placeholder="E.g., Minor scratch on bezel, seal intact, ports fully clean."
                  rows={3}
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

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                  Serial Number (Optional)
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="E.g., SN-8942-X72"
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.625rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border-light)',
                    backgroundColor: 'var(--color-surface-card)',
                    color: 'var(--color-text-main)',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="authCheck"
                  checked={authenticityVerified}
                  onChange={(e) => setAuthenticityVerified(e.target.checked)}
                />
                <label htmlFor="authCheck" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  Authenticity Confirmed & Verified
                </label>
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                  Inspector Notes / Evidence
                </label>
                <textarea
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  placeholder="Additional observations..."
                  rows={2}
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

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowInspectionForm(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border-light)',
                    backgroundColor: 'transparent',
                    color: 'var(--color-text-main)',
                    fontSize: '0.875rem',
                  }}
                >
                  Cancel
                </button>
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
                  }}
                >
                  Submit Inspection Report
                </button>
              </div>
            </form>
          )}
        </AdminDetailModal>
      )}
    </AdminLayout>
  );
};
