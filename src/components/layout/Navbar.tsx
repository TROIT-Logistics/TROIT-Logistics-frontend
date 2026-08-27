import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, LogOut, User as UserIcon, ShoppingBag, Store, Menu, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = (anchorId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname === '/') {
      const element = document.getElementById(anchorId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${anchorId}`);
      setTimeout(() => {
        const element = document.getElementById(anchorId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <header className="navbar-container">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" aria-label="TROIT Logistics Home">
          TROIT
        </Link>

        {/* Desktop Central Navigation */}
        <nav className="navbar-menu" aria-label="Primary Navigation">
          <a href="#services" onClick={handleNavClick('services')} className="nav-item">
            Services
          </a>
          <a href="#project" onClick={handleNavClick('project')} className="nav-item">
            Project
          </a>
          <a href="#about" onClick={handleNavClick('about')} className="nav-item">
            About
          </a>
          <a href="#contact" onClick={handleNavClick('contact')} className="nav-item">
            Contact
          </a>

          <span style={{ color: 'var(--nav-menu-border)', fontSize: '0.9rem' }}>|</span>

          <Link to="/buyer" className="nav-item" style={{ fontSize: '0.8rem' }}>
            <ShoppingBag size={14} /> Marketplace
          </Link>
          <Link to="/seller" className="nav-item" style={{ fontSize: '0.8rem' }}>
            <Store size={14} /> Seller Hub
          </Link>
        </nav>

        {/* Actions (Theme Toggle + Auth state + Mobile Toggle) */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
            <div className="auth-buttons-desktop" style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login" className="btn btn-dark" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-orange navbar-cta">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-dropdown">
          <a href="#services" onClick={handleNavClick('services')} className="mobile-nav-item">
            Services
          </a>
          <a href="#project" onClick={handleNavClick('project')} className="mobile-nav-item">
            Project
          </a>
          <a href="#about" onClick={handleNavClick('about')} className="mobile-nav-item">
            About
          </a>
          <a href="#contact" onClick={handleNavClick('contact')} className="mobile-nav-item">
            Contact
          </a>

          <div style={{ height: '1px', backgroundColor: 'var(--nav-menu-border)', margin: '8px 0' }} />

          <Link to="/buyer" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-item">
            <ShoppingBag size={16} /> Buyer Marketplace
          </Link>
          <Link to="/seller" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-item">
            <Store size={16} /> Seller Hub
          </Link>

          {!isAuthenticated && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-dark"
                style={{ justifyContent: 'center', width: '100%' }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-orange"
                style={{ justifyContent: 'center', width: '100%' }}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        .navbar-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 0.85rem 0;
          background-color: var(--nav-menu-bg);
          backdrop-filter: blur(14px);
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
          gap: 1.5rem;
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
          cursor: pointer;
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

        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--nav-text);
          cursor: pointer;
          padding: 4px;
        }

        .mobile-nav-dropdown {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px 20px;
          background-color: var(--color-surface);
          border-bottom: 1px solid var(--nav-menu-border);
          margin-top: 12px;
        }

        .mobile-nav-item {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--nav-text);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @media (max-width: 868px) {
          .navbar-menu {
            display: none;
          }
          .auth-buttons-desktop {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: block;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
