import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface AdminDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footerActions?: React.ReactNode;
}

export const AdminDetailModal: React.FC<AdminDetailModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footerActions,
}) => {
  // Prevent background body scrolling when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.75rem',
      }}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(5px)',
        }}
      />

      {/* Modal Dialog */}
      <div
        style={{
          position: 'relative',
          width: 'calc(100vw - 1.5rem)',
          maxWidth: '640px',
          maxHeight: '88vh',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border-light)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease',
          zIndex: 1001,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--color-border-light)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '0.75rem',
            backgroundColor: 'var(--color-surface-card)',
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0, wordBreak: 'break-word' }}>
              {title}
            </h3>
            {subtitle && (
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0', wordBreak: 'break-word' }}>
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '44px',
              minHeight: '44px',
              flexShrink: 0,
            }}
            aria-label="Close modal dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div
          style={{
            padding: '1.25rem',
            overflowY: 'auto',
            flex: 1,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {children}
        </div>

        {/* Footer Actions */}
        {footerActions && (
          <div
            style={{
              padding: '0.875rem 1.25rem',
              borderTop: '1px solid var(--color-border-light)',
              backgroundColor: 'var(--color-surface-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.625rem',
              flexWrap: 'wrap',
            }}
          >
            {footerActions}
          </div>
        )}
      </div>
    </div>
  );
};
