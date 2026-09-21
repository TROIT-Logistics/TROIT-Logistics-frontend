import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Menu, Sun, Moon, Bell, LogOut, ShieldCheck, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileSidebar: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  onOpenMobileSidebar,
  searchQuery,
  onSearchChange,
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border-light)',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Left side: Hamburger & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onOpenMobileSidebar}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            background: 'none',
            border: '1px solid var(--color-border-light)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-text-main)',
            cursor: 'pointer',
          }}
          className="admin-mobile-menu-btn"
          aria-label="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right side: Search, Theme, Notifications, User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        {onSearchChange !== undefined && (
          <div style={{ position: 'relative', display: 'none' }} className="admin-header-search">
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-light)',
              }}
            />
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter records..."
              style={{
                paddingLeft: '2.25rem',
                paddingRight: '0.875rem',
                paddingTop: '0.4375rem',
                paddingBottom: '0.4375rem',
                fontSize: '0.84rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--color-border-light)',
                backgroundColor: 'var(--color-surface-card)',
                color: 'var(--color-text-main)',
                outline: 'none',
                width: '200px',
              }}
            />
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            padding: '0.5rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border-light)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text-main)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications Indicator */}
        <button
          style={{
            padding: '0.5rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border-light)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text-main)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
          title="System Notifications"
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-orange-primary)',
            }}
          />
        </button>

        {/* Admin User Menu */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            paddingLeft: '0.5rem',
            borderLeft: '1px solid var(--color-border-light)',
          }}
        >
          <div
            style={{
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 77, 0, 0.12)',
              color: 'var(--color-orange-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.875rem',
            }}
          >
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
          </div>

          <div style={{ display: 'none' }} className="admin-user-info">
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--color-text-main)', lineHeight: 1.2 }}>
              {user?.full_name || 'System Admin'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <ShieldCheck size={12} color="var(--color-orange-primary)" />
              <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>ADMINISTRATOR</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: '0.4375rem 0.625rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-light)',
              backgroundColor: 'transparent',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
            }}
            title="Sign out of Admin Session"
          >
            <LogOut size={16} />
            <span style={{ display: 'none' }} className="admin-logout-text">Exit</span>
          </button>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .admin-mobile-menu-btn {
            display: none !important;
          }
          .admin-header-search, .admin-user-info, .admin-logout-text {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};
