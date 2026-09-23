import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { checkBackendHealth, HealthStatus } from '@/lib/api/admin';
import { envConfig } from '@/app/config/env';
import { Server, Shield, CheckCircle2, RefreshCw } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const verifyBackend = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await checkBackendHealth();
      setHealth(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to reach backend health endpoint');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyBackend();
  }, []);

  return (
    <AdminLayout title="Operations & System Settings" subtitle="Infrastructure environment parameters and API connection status">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '800px', width: '100%' }}>
        {/* Connection Diagnostics Card */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Server size={20} color="var(--color-orange-primary)" style={{ flexShrink: 0 }} /> Backend Infrastructure Health
            </h3>

            <button
              onClick={verifyBackend}
              disabled={loading}
              style={{
                padding: '0.4375rem 0.875rem',
                minHeight: '40px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-light)',
                backgroundColor: 'var(--color-surface-card)',
                color: 'var(--color-text-main)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              <RefreshCw size={14} /> Ping Health
            </button>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-surface-card)',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              fontSize: '0.875rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>API Base URL</span>
              <code style={{ fontSize: '0.84rem', fontFamily: 'monospace', fontWeight: 700, wordBreak: 'break-all' }}>
                {envConfig.apiBaseUrl}
              </code>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Health Status</span>
              {loading ? (
                <span>Testing connection...</span>
              ) : error ? (
                <span style={{ color: '#DC2626', fontWeight: 700, wordBreak: 'break-word' }}>{error}</span>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: 700, flexWrap: 'wrap' }}>
                  <CheckCircle2 size={16} style={{ flexShrink: 0 }} /> Service: {health?.service} (v{health?.version}) — STATUS OK
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security & Authorization Policy Card */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} color="var(--color-orange-primary)" style={{ flexShrink: 0 }} /> Security & Route Authorization
          </h3>
          <ul style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, paddingLeft: '1.25rem' }}>
            <li>Frontend admin routes (<code style={{ fontSize: '0.75rem' }}>/admin/*</code>) are protected by <code style={{ fontSize: '0.75rem' }}>AdminProtectedRoute</code>, enforcing <code style={{ fontSize: '0.75rem' }}>user.role === 'admin'</code>.</li>
            <li>Backend endpoints verify JWT token claims server-side for role authorization.</li>
            <li>Seller identity is visible internally to authorized administrators on order and inspection views.</li>
            <li>Buyer-facing pages never expose internal seller identities.</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};
