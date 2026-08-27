import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

interface VisualSearchButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export const VisualSearchButton: React.FC<VisualSearchButtonProps> = ({
  onClick,
  className = '',
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`btn ${className}`}
      aria-label="Search marketplace with camera or image"
      title="Take a photo or upload an image to search TROIT verified inventory"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'var(--color-dark-btn)',
        color: '#FFFFFF',
        borderRadius: 'var(--radius-pill)',
        padding: '10px 18px',
        fontSize: '0.875rem',
        fontWeight: 600,
        border: '1px solid var(--color-border-light)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'var(--color-orange-primary)';
          e.currentTarget.style.borderColor = 'var(--color-orange-primary)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'var(--color-dark-btn)';
          e.currentTarget.style.borderColor = 'var(--color-border-light)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      <Camera size={18} style={{ color: 'var(--color-yellow-accent)' }} />
      <span>Search with Camera</span>
      <Sparkles size={14} style={{ opacity: 0.8 }} />
    </button>
  );
};

export default VisualSearchButton;
