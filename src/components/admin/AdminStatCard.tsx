import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: {
    text: string;
    variant?: 'success' | 'warning' | 'info' | 'neutral';
  };
  loading?: boolean;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  loading = false,
}) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem 1.5rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255, 77, 0, 0.08)',
              color: 'var(--color-orange-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
        {loading ? (
          <div style={{ height: '2rem', width: '5rem', backgroundColor: 'var(--color-border-light)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
        ) : (
          <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>
            {value}
          </span>
        )}

        {badge && !loading && (
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '2px 6px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor:
                badge.variant === 'warning'
                  ? 'rgba(245, 184, 66, 0.15)'
                  : badge.variant === 'info'
                  ? 'rgba(59, 130, 246, 0.1)'
                  : badge.variant === 'success'
                  ? 'rgba(16, 185, 129, 0.1)'
                  : 'var(--color-border-light)',
              color:
                badge.variant === 'warning'
                  ? '#D97706'
                  : badge.variant === 'info'
                  ? '#2563EB'
                  : badge.variant === 'success'
                  ? '#059669'
                  : 'var(--color-text-muted)',
            }}
          >
            {badge.text}
          </span>
        )}
      </div>

      {subtitle && (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '0.5rem' }}>
          {subtitle}
        </span>
      )}
    </div>
  );
};
