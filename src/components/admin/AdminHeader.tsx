import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Logo } from '@/components/ui/Logo';
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
        padding: '0.875rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Left side: Hamburger, Logo on Mobile, Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
        <button
          onClick={onOpenMobileSidebar}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '42px',
            minHeight: '42px',
            padding: '0.4rem',
            background: 'none',
            border: '1px solid var(--color-border-light)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-text-main)',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          className="admin-mobile-menu-btn"
          aria-label="Open Navigation Menu"
        >
          <Menu size={22} />
        </button>

        {/* Mobile Header Logo */}
        <div className="admin-mobile-header-logo">
          <Logo variant="admin" size="sm" to="/admin/overview" />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <h1
            style={{
              fontSize: '1.125rem',
              fontWeight: 800,
              color: 'var(--color-text-main)',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              className="admin-header-subtitle"
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right side: Search, Theme Toggle, Notifications, User Identity, Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
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
                width: '180px',
              }}
            />
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            minWidth: '40px',
            minHeight: '40px',
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
          aria-label="Toggle color theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications Indicator */}
        <button
          style={{
            minWidth: '40px',
            minHeight: '40px',
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
          aria-label="System Notifications"
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-orange-primary)',
            }}
          />
        </button>

        {/* Admin User Identity Pill & Exit */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            paddingLeft: '0.375rem',
            borderLeft: '1px solid var(--color-border-light)',
          }}
        >
          <div
            style={{
              width: '2.125rem',
              height: '2.125rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 77, 0, 0.12)',
              color: 'var(--color-orange-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.84rem',
              flexShrink: 0,
            }}
            title={user?.full_name || 'Admin'}
          >
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
          </div>

          <div style={{ display: 'none' }} className="admin-user-info">
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-main)', lineHeight: 1.2 }}>
              {user?.full_name?.split(' ')[0] || 'Admin'}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ShieldCheck size={11} color="var(--color-orange-primary)" />
              <span style={{ textTransform: 'uppercase', fontWeight: 700 }}>ADMIN</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              minWidth: '40px',
              minHeight: '40px',
              padding: '0.4rem 0.625rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-light)',
              backgroundColor: 'transparent',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
            }}
            title="Sign out of Admin Session"
            aria-label="Sign out"
          >
            <LogOut size={16} />
            <span style={{ display: 'none' }} className="admin-logout-text">Exit</span>
          </button>
        </div>
      </div>

      <style>{`
        .admin-mobile-header-logo {
          display: block;
        }

        @media (min-width: 1024px) {
          .admin-mobile-menu-btn,
          .admin-mobile-header-logo {
            display: none !important;
          }
          .admin-header-search, .admin-user-info, .admin-logout-text {
            display: flex !important;
          }
          .admin-header-subtitle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};
