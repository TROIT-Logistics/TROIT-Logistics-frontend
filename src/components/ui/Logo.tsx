import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'full' | 'admin' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  to?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  to = '/',
  className = '',
}) => {
  const iconDimensions = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 44, height: 44 },
  }[size];

  const fontSize = {
    sm: '1.125rem',
    md: '1.35rem',
    lg: '1.75rem',
  }[size];

  const subfontSize = {
    sm: '0.625rem',
    md: '0.6875rem',
    lg: '0.75rem',
  }[size];

  const logoContent = (
    <div
      className={`troit-logo-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? '0.5rem' : '0.625rem',
        userSelect: 'none',
        textDecoration: 'none',
      }}
    >
      <img
        src="/favicon.svg"
        alt="TROIT Logistics Logo"
        style={{
          width: `${iconDimensions.width}px`,
          height: `${iconDimensions.height}px`,
          objectFit: 'contain',
          borderRadius: '8px',
          flexShrink: 0,
        }}
      />

      {variant !== 'icon-only' && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.1 }}>
          <span
            style={{
              fontWeight: 900,
              fontSize,
              letterSpacing: '-0.03em',
              color: 'var(--nav-logo, var(--color-text-main))',
            }}
          >
            TROIT
          </span>
          {variant === 'admin' ? (
            <span
              style={{
                fontSize: subfontSize,
                fontWeight: 800,
                color: 'var(--color-orange-primary)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              ADMIN
            </span>
          ) : (
            <span
              style={{
                fontSize: '0.625rem',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              LOGISTICS
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: 'none', display: 'inline-block' }} aria-label="TROIT Logo Link">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

export default Logo;
