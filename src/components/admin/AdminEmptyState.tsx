import React from 'react';
import { AlertCircle, ServerOff, Database } from 'lucide-react';

interface AdminEmptyStateProps {
  title?: string;
  description?: string;
  isBackendDependency?: boolean;
  requiredEndpoint?: string;
  httpMethod?: string;
  actionButton?: React.ReactNode;
}

export const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  title = 'No Data Available',
  description = 'There are currently no records matching this query.',
  isBackendDependency = false,
  requiredEndpoint,
  httpMethod = 'GET',
  actionButton,
}) => {
  return (
    <div
      style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border-light)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
      }}
    >
      <div
        style={{
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          backgroundColor: isBackendDependency ? 'rgba(245, 184, 66, 0.15)' : 'rgba(0, 0, 0, 0.04)',
          color: isBackendDependency ? '#D97706' : 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isBackendDependency ? <ServerOff size={28} /> : <Database size={28} />}
      </div>

      <div style={{ maxWidth: '480px' }}>
        <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.375rem' }}>
          {title}
        </h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
          {description}
        </p>

        {isBackendDependency && requiredEndpoint && (
          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(245, 184, 66, 0.08)',
              border: '1px dashed rgba(245, 184, 66, 0.4)',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'left',
              fontSize: '0.8125rem',
              color: 'var(--color-text-main)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#B45309', marginBottom: '0.25rem' }}>
              <AlertCircle size={14} />
              <span>Backend Dependency Required</span>
            </div>
            <div>
              <code style={{ backgroundColor: 'rgba(0,0,0,0.06)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                {httpMethod} {requiredEndpoint}
              </code>
            </div>
          </div>
        )}
      </div>

      {actionButton && <div style={{ marginTop: '0.5rem' }}>{actionButton}</div>}
    </div>
  );
};
