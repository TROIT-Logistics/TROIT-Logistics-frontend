import React from 'react';
import { ArrowUpRight, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar-container">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <a href="/" className="navbar-logo">
          TROIT
        </a>

        {/* Central Pill Navigation */}
        <nav className="navbar-menu">
          <a href="#home" className="nav-item active">
            Home
          </a>
          <div className="nav-item dropdown">
            <span>Services</span>
            <ChevronDown size={14} />
          </div>
          <div className="nav-item dropdown">
            <span>Project</span>
            <ChevronDown size={14} />
          </div>
          <a href="#about" className="nav-item">
            About
          </a>
          <a href="#contact" className="nav-item">
            Contact
          </a>
        </nav>

        {/* Actions (Theme Toggle + CTA) */}
        <div className="navbar-actions">
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme} 
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button className="btn btn-orange navbar-cta">
            Get a quote <ArrowUpRight size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .navbar-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          padding: 1.25rem 0;
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
          color: #FFFFFF;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          transition: transform 0.2s ease;
        }

        .navbar-logo:hover {
          transform: scale(1.02);
        }

        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 2rem;
          background-color: var(--nav-menu-bg);
          backdrop-filter: blur(12px);
          padding: 8px 28px;
          border-radius: 9999px;
          border: 1px solid var(--nav-menu-border);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        .nav-item {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--nav-text);
          display: flex;
          align-items: center;
          gap: 4px;
          transition: color 0.2s ease;
          cursor: pointer;
        }

        .nav-item:hover, .nav-item.active {
          color: var(--color-orange-primary);
          font-weight: 600;
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
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--nav-menu-bg);
          border: 1px solid var(--nav-menu-border);
          color: var(--nav-text);
          backdrop-filter: blur(12px);
          transition: all 0.2s ease;
        }

        .theme-toggle-btn:hover {
          transform: scale(1.05);
          color: var(--color-orange-primary);
        }

        .navbar-cta {
          padding: 10px 22px;
          font-size: 0.9rem;
          border-radius: 9999px;
        }

        @media (max-width: 868px) {
          .navbar-menu {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
