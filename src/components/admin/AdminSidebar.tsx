import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/ui/Logo';
import {
  LayoutDashboard,
  Package,
  Store,
  Users,
  ShoppingBag,
  ClipboardCheck,
  ShieldAlert,
  ShieldCheck,
  BarChart3,
  Settings,
  X,
  LogOut,
  LucideIcon,
} from 'lucide-react';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
}

interface NavGroup {
  groupLabel?: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    items: [
      {
        label: 'Overview',
        path: '/admin/overview',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    groupLabel: 'Marketplace',
    items: [
      {
        label: 'Products',
        path: '/admin/products',
        icon: Package,
      },
      {
        label: 'Sellers',
        path: '/admin/sellers',
        icon: Store,
      },
      {
        label: 'Users',
        path: '/admin/users',
        icon: Users,
      },
    ],
  },
  {
    groupLabel: 'Operations',
    items: [
      {
        label: 'Orders',
        path: '/admin/orders',
        icon: ShoppingBag,
      },
      {
        label: 'Inspections',
        path: '/admin/inspections',
        icon: ClipboardCheck,
      },
      {
        label: 'Disputes',
        path: '/admin/disputes',
        icon: ShieldAlert,
      },
    ],
  },
  {
    groupLabel: 'Trust & Risk',
    items: [
      {
        label: 'Trust Management',
        path: '/admin/trust',
        icon: ShieldCheck,
      },
    ],
  },
  {
    groupLabel: 'System',
    items: [
      {
        label: 'Analytics',
        path: '/admin/analytics',
        icon: BarChart3,
      },
      {
        label: 'Settings',
        path: '/admin/settings',
        icon: Settings,
      },
    ],
  },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen = false, onCloseMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    if (onCloseMobile) onCloseMobile();
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border-light)',
        width: '270px',
        userSelect: 'none',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '1.25rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--color-border-light)',
        }}
      >
        <Logo variant="admin" size="md" to="/admin/overview" />

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '44px',
              minHeight: '44px',
              borderRadius: 'var(--radius-sm)',
            }}
            aria-label="Close admin navigation menu"
          >
            <X size={22} />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.75rem' }}>
        {navGroups.map((group, idx) => (
          <div key={idx} style={{ marginBottom: '1.25rem' }}>
            {group.groupLabel && (
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-text-light)',
                  padding: '0 0.75rem 0.5rem 0.75rem',
                }}
              >
                {group.groupLabel}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {group.items.map((item) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.875rem',
                      minHeight: '44px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--color-orange-primary)' : 'var(--color-text-muted)',
                      backgroundColor: isActive ? 'rgba(255, 77, 0, 0.08)' : 'transparent',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Icon size={18} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          backgroundColor: 'var(--color-orange-primary)',
                          color: '#FFFFFF',
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-pill)',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Identity & Sign Out */}
      <div
        style={{
          padding: '1rem 0.875rem',
          borderTop: '1px solid var(--color-border-light)',
          backgroundColor: 'var(--color-surface-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 77, 0, 0.15)',
              color: 'var(--color-orange-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.875rem',
            }}
          >
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: '0.84rem',
                fontWeight: 700,
                color: 'var(--color-text-main)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user?.full_name || 'System Admin'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Administrator
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%',
            minHeight: '44px',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border-light)',
            backgroundColor: 'var(--color-surface)',
            color: '#DC2626',
            fontWeight: 700,
            fontSize: '0.84rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          aria-label="Sign out of admin account"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside style={{ display: 'none', minHeight: '100vh' }} className="admin-desktop-sidebar">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
          }}
        />
      )}

      {/* Mobile Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: mobileOpen ? 0 : '-300px',
          width: '270px',
          zIndex: 999,
          transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: mobileOpen ? 'var(--shadow-lg)' : 'none',
        }}
      >
        {sidebarContent}
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .admin-desktop-sidebar {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};
