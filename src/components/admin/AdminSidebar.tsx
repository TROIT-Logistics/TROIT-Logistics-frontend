import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  Shield,
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

  const sidebarContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border-light)',
        width: '260px',
        userSelect: 'none',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--color-border-light)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-orange-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <Shield size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', color: 'var(--color-text-main)' }}>
              TROIT ADMIN
            </div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-orange-primary)', letterSpacing: '0.05em' }}>
              OPERATIONS CENTER
            </div>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '0.25rem',
            }}
            aria-label="Close sidebar"
          >
            <X size={20} />
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
                      padding: '0.625rem 0.875rem',
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
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
          left: mobileOpen ? 0 : '-280px',
          width: '260px',
          zIndex: 999,
          transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
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
