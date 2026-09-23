import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  title: string;
  subtitle?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  title,
  subtitle,
  searchQuery,
  onSearchChange,
  children,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-page)',
        color: 'var(--color-text-main)',
        overflowX: 'hidden',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        <AdminHeader
          title={title}
          subtitle={subtitle}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />

        <main
          className="admin-main-content"
          style={{
            flex: 1,
            padding: '1.25rem',
            overflowY: 'auto',
            overflowX: 'hidden',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .admin-main-content {
            padding: 0.875rem !important;
          }
        }
      `}</style>
    </div>
  );
};
