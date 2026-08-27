import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, User as UserIcon, ShoppingBag, Store } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar-container">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo">
          TROIT
        </Link>

        {/* Central Navigation */}
        <nav className="navbar-menu">
          <Link to="/" className="nav-item">
            Home
          </Link>

          <Link to="/buyer" className="nav-item">
            <ShoppingBag size={15} /> Marketplace
          </Link>

          <Link to="/seller" className="nav-item">
            <Store size={15} /> Seller Hub
          </Link>
        </nav>

        {/* Actions (Theme Toggle + Auth state) */}
        <div className="navbar-actions">
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--nav-menu-bg)',
                  border: '1px solid var(--nav-menu-border)',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: 'var(--nav-text)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <UserIcon size={14} style={{ color: 'var(--color-orange-primary)' }} />
                <span>{user.full_name.split(' ')[0]}</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'capitalize' }}>({user.role})</span>
              </div>

              <button
                onClick={handleLogout}
                className="theme-toggle-btn"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login" className="btn btn-dark" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-orange navbar-cta">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .navbar-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 1rem 0;
          background-color: var(--nav-menu-bg);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--nav-menu-border);
        }

        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-logo {
          font-size: 1.75rem;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: var(--nav-logo);
          transition: transform 0.2s ease;
        }

        .navbar-logo:hover {
          transform: scale(1.02);
        }

        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 1.75rem;
          background-color: var(--color-surface-card);
          padding: 8px 24px;
          border-radius: 9999px;
          border: 1px solid var(--nav-menu-border);
        }

        .nav-item {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--nav-text);
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s ease;
        }

        .nav-item:hover {
          color: var(--color-orange-primary);
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .theme-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: var(--color-surface-card);
          border: 1px solid var(--nav-menu-border);
          color: var(--nav-text);
          transition: all 0.2s ease;
        }

        .theme-toggle-btn:hover {
          transform: scale(1.05);
          color: var(--color-orange-primary);
        }

        .navbar-cta {
          padding: 8px 20px;
          font-size: 0.85rem;
          border-radius: 9999px;
        }

        @media (max-width: 768px) {
          .navbar-menu {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
