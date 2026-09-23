import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { fetchSellerTrustHistoryByIdAdmin } from '@/lib/api/admin';
import { TrustHistory } from '@/lib/api/types';
import { ShieldCheck, Search, Info } from 'lucide-react';

export const AdminTrustPage: React.FC = () => {
  const [sellerId, setSellerId] = useState('');
  const [history, setHistory] = useState<TrustHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerId.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setSearched(true);
      const res = await fetchSellerTrustHistoryByIdAdmin(sellerId.trim());
      setHistory(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve seller trust history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Trust Management Center" subtitle="Supplier Trust Grade and Trust Level Audit Console">
      {/* Core TROIT Rule Banner */}
      <div
        style={{
          padding: '1.25rem 1.25rem',
          backgroundColor: 'rgba(255, 77, 0, 0.08)',
          border: '1px solid rgba(255, 77, 0, 0.25)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.875rem',
        }}
      >
        <Info size={24} color="var(--color-orange-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-orange-primary)', margin: 0 }}>
            CRITICAL TROIT LOGISTICS RULE
          </h4>
          <p style={{ fontSize: '0.84rem', color: 'var(--color-text-main)', margin: '0.25rem 0 0 0', lineHeight: 1.5 }}>
            <strong>Grade does not represent product quality.</strong> It represents the level of trust the supplier has built with TROIT through verified fulfillment performance, successful escrows, and operational compliance. Physical product condition is evaluated separately during physical inspection.
          </p>
        </div>
      </div>

      {/* Trust Audit Search */}
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
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.375rem' }}>
          Seller Trust History Audit
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          Query live trust level transitions and reason audit logs by Seller UUID.
        </p>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', maxWidth: '600px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '0.875rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-light)',
              }}
            />
            <input
              type="text"
              value={sellerId}
              onChange={(e) => setSellerId(e.target.value)}
              placeholder="Enter Seller UUID..."
              required
              style={{
                width: '100%',
                paddingLeft: '2.5rem',
                paddingRight: '1rem',
                paddingTop: '0.5625rem',
                paddingBottom: '0.5625rem',
                minHeight: '40px',
                fontSize: '0.875rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-light)',
                backgroundColor: 'var(--color-surface-card)',
                color: 'var(--color-text-main)',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.5625rem 1.25rem',
              minHeight: '40px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: 'var(--color-orange-primary)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? 'Searching...' : 'Audit Trust Log'}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '1rem', color: '#DC2626', fontSize: '0.84rem', fontWeight: 600 }}>
            {error}
          </div>
        )}
      </div>

      {/* Audit History Log */}
      {searched && !loading && (
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', wordBreak: 'break-all' }}>
            <ShieldCheck size={20} color="var(--color-orange-primary)" style={{ flexShrink: 0 }} /> Trust Log Audit Trail for Seller {sellerId}
          </h4>

          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              No trust transitions recorded for this seller yet. The backend history log is empty.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {history.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '0.875rem 1rem',
                    backgroundColor: 'var(--color-surface-card)',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                      Level Transition: {item.old_level} → <span style={{ color: 'var(--color-orange-primary)' }}>{item.new_level}</span>
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', wordBreak: 'break-word' }}>
                      Reason: {item.reason}
                    </div>
                    {item.trigger_transaction_id && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '2px', wordBreak: 'break-all' }}>
                        Transaction ID: <code style={{ fontFamily: 'monospace' }}>{item.trigger_transaction_id}</code>
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', fontWeight: 600 }}>
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};
