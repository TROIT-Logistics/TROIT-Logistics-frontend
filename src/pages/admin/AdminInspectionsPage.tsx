import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDataTable, Column } from '@/components/admin/AdminDataTable';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminDetailModal } from '@/components/admin/AdminDetailModal';
import { fetchAdminProducts, createProductInspectionAdmin } from '@/lib/api/admin';
import { Product } from '@/lib/api/types';
import { ClipboardCheck } from 'lucide-react';

export const AdminInspectionsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Inspection Form
  const [physicalCondition, setPhysicalCondition] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [authenticityVerified, setAuthenticityVerified] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load inspection queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

      setActionSuccess('Formal product physical & authenticity inspection report created');
      setPhysicalCondition('');
      setSerialNumber('');
      setInspectionNotes('');
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Inspection creation failed');
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
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>ID: {p.id.substring(0, 8)}...</div>
        </div>
      ),
    },
    {
      key: 'verification_status',
      header: 'Verification Status',
      render: (p) => <AdminStatusBadge status={p.verification_status} type="product_verification" />,
    },
    {
      key: 'authenticity_status',
      header: 'Authenticity Status',
      render: (p) => <AdminStatusBadge status={p.authenticity_status || 'UNINSPECTED'} type="product_authenticity" />,
    },
    {
      key: 'last_inspected_at',
      header: 'Last Inspected',
      render: (p) => (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          {p.last_inspected_at ? new Date(p.last_inspected_at).toLocaleString() : 'Never Inspected'}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      sortable: false,
      align: 'right',
      render: (p) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProduct(p);
            setActionSuccess(null);
          }}
          style={{
            padding: '0.375rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border-light)',
            backgroundColor: 'var(--color-surface-card)',
            color: 'var(--color-text-main)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <ClipboardCheck size={14} /> Record Inspection
        </button>
      ),
    },
  ];

  return (
    <AdminLayout title="Inspections & Verification Queue" subtitle="Formal quality control and authenticity inspection management">
      <AdminDataTable
        columns={columns}
        data={products}
        keyExtractor={(p) => p.id}
        loading={loading}
        emptyTitle="Inspection Queue Clear"
        emptyDescription="No products are currently awaiting physical inspection."
        onRowClick={(p) => {
          setSelectedProduct(p);
          setActionSuccess(null);
        }}
      />

      {/* Inspection Modal */}
      {selectedProduct && (
        <AdminDetailModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={`Physical Inspection: ${selectedProduct.name}`}
          subtitle={`Product ID: ${selectedProduct.id}`}
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

          <form onSubmit={handleCreateInspection} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                backgroundColor: 'var(--color-surface-card)',
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
              }}
            >
              Current Status: <strong>{selectedProduct.verification_status}</strong> | Authenticity:{' '}
              <strong>{selectedProduct.authenticity_status || 'UNINSPECTED'}</strong>
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                Physical Condition Assessment *
              </label>
              <textarea
                value={physicalCondition}
                onChange={(e) => setPhysicalCondition(e.target.value)}
                placeholder="Describe physical condition, packaging integrity, and hardware verification..."
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
                Serial / IMEI Number (Optional)
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="Enter physical serial or hardware ID..."
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
                id="authConfirm"
                checked={authenticityVerified}
                onChange={(e) => setAuthenticityVerified(e.target.checked)}
              />
              <label htmlFor="authConfirm" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                Authenticity & Genuine Origin Verified
              </label>
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                Inspector Notes & Audit Observations
              </label>
              <textarea
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
                placeholder="Additional inspection details..."
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
                onClick={() => setSelectedProduct(null)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-light)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-main)',
                  fontSize: '0.875rem',
                }}
              >
                Close
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
                  cursor: 'pointer',
                }}
              >
                Submit Inspection Report
              </button>
            </div>
          </form>
        </AdminDetailModal>
      )}
    </AdminLayout>
  );
};
