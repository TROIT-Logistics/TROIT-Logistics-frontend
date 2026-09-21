import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDataTable, Column } from '@/components/admin/AdminDataTable';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { fetchAdminUsers } from '@/lib/api/admin';
import { AdminUserItem, UserRole } from '@/lib/api/types';
import { UserCheck, UserX } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetchAdminUsers({
        page,
        limit: 10,
        search: search.trim() || undefined,
        role: roleFilter === 'ALL' ? undefined : (roleFilter as UserRole),
      });

      setUsers(res.items || []);
      setTotalPages(res.total_pages || 1);
      setTotalRecords(res.total || 0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load user directory from server');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const columns: Column<AdminUserItem>[] = [
    {
      key: 'full_name',
      header: 'Platform User',
      render: (item) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{item.full_name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.email}</div>
        </div>
      ),
    },
    {
      key: 'phone_number',
      header: 'Phone Number',
      render: (item) => (
        <span style={{ fontSize: '0.84rem' }}>{item.phone_number || 'Not recorded'}</span>
      ),
    },
    {
      key: 'role',
      header: 'System Role',
      render: (item) => (
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '3px 10px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor:
              item.role === 'admin'
                ? 'rgba(255, 77, 0, 0.12)'
                : item.role === 'seller'
                ? 'rgba(37, 99, 235, 0.12)'
                : 'rgba(107, 114, 128, 0.12)',
            color:
              item.role === 'admin'
                ? 'var(--color-orange-primary)'
                : item.role === 'seller'
                ? '#2563EB'
                : 'var(--color-text-main)',
            display: 'inline-block',
          }}
        >
          {item.role}
        </span>
      ),
    },
    {
      key: 'is_active',
      header: 'Account Status',
      render: (item) => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
          {item.is_active ? (
            <>
              <UserCheck size={14} color="#059669" />
              <AdminStatusBadge status="ACTIVE" type="general" />
            </>
          ) : (
            <>
              <UserX size={14} color="#DC2626" />
              <AdminStatusBadge status="INACTIVE" type="general" />
            </>
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Registered Date',
      render: (item) => (
        <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const filterElement = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
        Role:
      </label>
      <select
        value={roleFilter}
        onChange={(e) => {
          setRoleFilter(e.target.value);
          setPage(1);
        }}
        style={{
          padding: '0.5rem 0.75rem',
          fontSize: '0.84rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border-light)',
          backgroundColor: 'var(--color-surface-card)',
          color: 'var(--color-text-main)',
          outline: 'none',
          cursor: 'pointer',
        }}
      >
        <option value="ALL">All Roles</option>
        <option value="buyer">buyer</option>
        <option value="seller">seller</option>
        <option value="rider">rider</option>
        <option value="field_agent">field_agent</option>
        <option value="admin">admin</option>
      </select>
    </div>
  );

  return (
    <AdminLayout
      title="User Directory & Access Control"
      subtitle="Inspect platform user accounts, security roles, and active status"
    >
      <AdminDataTable
        columns={columns}
        data={users}
        keyExtractor={(item) => item.id}
        loading={loading}
        error={error}
        emptyTitle="No Platform Users Found"
        emptyDescription="No user accounts matched the selected role filter or search term."
        isServerSide
        page={page}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={(p) => setPage(p)}
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder="Search user name or email address..."
        filterElement={filterElement}
      />
    </AdminLayout>
  );
};
