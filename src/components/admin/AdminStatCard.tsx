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
        padding: '1rem 1.125rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              padding: '0.4rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255, 77, 0, 0.08)',
              color: 'var(--color-orange-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={16} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem', flexWrap: 'wrap' }}>
        {loading ? (
          <div style={{ height: '1.75rem', width: '4.5rem', backgroundColor: 'var(--color-border-light)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
        ) : (
          <span style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.75rem)', fontWeight: 800, color: 'var(--color-text-main)', letterSpacing: '-0.02em', wordBreak: 'break-word' }}>
            {value}
          </span>
        )}

        {badge && !loading && (
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
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
              whiteSpace: 'nowrap',
            }}
          >
            {badge.text}
          </span>
        )}
      </div>

      {subtitle && (
        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-light)', marginTop: '0.375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {subtitle}
        </span>
      )}
    </div>
  );
};
