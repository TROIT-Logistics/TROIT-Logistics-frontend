import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { AdminEmptyState } from './AdminEmptyState';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  isBackendDependency?: boolean;
  requiredEndpoint?: string;
  pageSize?: number;
  onRowClick?: (item: T) => void;

  // Controlled Server-Side Props
  isServerSide?: boolean;
  page?: number;
  totalPages?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  filterElement?: React.ReactNode;
  error?: string | null;
}

export function AdminDataTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyTitle = 'No Records Found',
  emptyDescription = 'There are no items to display at this time.',
  isBackendDependency = false,
  requiredEndpoint,
  pageSize = 10,
  onRowClick,
  isServerSide = false,
  page: serverPage = 1,
  totalPages: serverTotalPages = 1,
  totalRecords,
  onPageChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filterElement,
  error,
}: AdminDataTableProps<T>) {
  const [internalSearch, setInternalSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [internalPage, setInternalPage] = useState(1);

  const search = isServerSide ? (searchValue ?? '') : internalSearch;
  const currentPage = isServerSide ? serverPage : internalPage;

  const handleSearchChange = (val: string) => {
    if (isServerSide) {
      onSearchChange?.(val);
    } else {
      setInternalSearch(val);
      setInternalPage(1);
    }
  };

  // Client-side Filter
  const filteredData = useMemo(() => {
    if (isServerSide || !search.trim()) return data;
    const term = search.toLowerCase();
    return data.filter((item) =>
      Object.values(item as Record<string, unknown>).some((val) =>
        String(val ?? '').toLowerCase().includes(term)
      )
    );
  }, [data, search, isServerSide]);

  // Sort
  const sortedData = useMemo(() => {
    if (isServerSide || !sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = (a as Record<string, unknown>)[sortKey];
      const valB = (b as Record<string, unknown>)[sortKey];
      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      const comp = String(valA).localeCompare(String(valB), undefined, { numeric: true });
      return sortOrder === 'asc' ? comp : -comp;
    });
  }, [filteredData, sortKey, sortOrder, isServerSide]);

  // Paginate
  const clientTotalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const totalPages = isServerSide ? serverTotalPages : clientTotalPages;
  const displayCount = isServerSide ? (totalRecords ?? data.length) : sortedData.length;

  const displayData = useMemo(() => {
    if (isServerSide) return data;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [data, sortedData, currentPage, pageSize, isServerSide]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else {
        setSortKey(null);
        setSortOrder('asc');
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const changePage = (newPage: number) => {
    if (isServerSide) {
      onPageChange?.(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border-light)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}
    >
      {/* Table Header Filter Toolbar */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--color-border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '360px' }}>
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
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              style={{
                width: '100%',
                paddingLeft: '2.25rem',
                paddingRight: '0.875rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                fontSize: '0.84rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-light)',
                backgroundColor: 'var(--color-surface-card)',
                color: 'var(--color-text-main)',
                outline: 'none',
              }}
            />
          </div>

          {filterElement}
        </div>

        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
          Showing {displayCount} total records
        </div>
      </div>

      {/* Error Alert if provided */}
      {error && (
        <div
          style={{
            padding: '0.875rem 1.25rem',
            backgroundColor: 'rgba(220, 38, 38, 0.08)',
            borderBottom: '1px solid rgba(220, 38, 38, 0.2)',
            color: '#DC2626',
            fontSize: '0.84rem',
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      )}

      {/* Table Container */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-surface-card)', borderBottom: '1px solid var(--color-border-light)' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--color-text-muted)',
                    cursor: col.sortable !== false ? 'pointer' : 'default',
                    textAlign: col.align || 'left',
                    width: col.width || 'auto',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                    <span>{col.header}</span>
                    {col.sortable !== false && (
                      <ArrowUpDown
                        size={12}
                        color={sortKey === col.key ? 'var(--color-orange-primary)' : 'var(--color-text-light)'}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                  {columns.map((col) => (
                    <td key={col.key} style={{ padding: '1rem 1.25rem' }}>
                      <div
                        style={{
                          height: '1rem',
                          backgroundColor: 'var(--color-border-light)',
                          borderRadius: '4px',
                          width: '70%',
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : displayData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: '0' }}>
                  <AdminEmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    isBackendDependency={isBackendDependency}
                    requiredEndpoint={requiredEndpoint}
                  />
                </td>
              </tr>
            ) : (
              displayData.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  onClick={() => onRowClick && onRowClick(item)}
                  style={{
                    borderBottom: '1px solid var(--color-border-light)',
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: '1rem 1.25rem',
                        color: 'var(--color-text-main)',
                        textAlign: col.align || 'left',
                        verticalAlign: 'middle',
                      }}
                    >
                      {col.render
                        ? col.render(item)
                        : (item as Record<string, unknown>)[col.key] !== undefined
                        ? String((item as Record<string, unknown>)[col.key] ?? '-')
                        : '-'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!loading && (totalPages > 1 || (isServerSide && totalRecords !== undefined)) && (
        <div
          style={{
            padding: '0.875rem 1.25rem',
            borderTop: '1px solid var(--color-border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted)',
          }}
        >
          <div>
            Page {currentPage} of {totalPages}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => changePage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.375rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-light)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-main)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1,
              }}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <button
              onClick={() => changePage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.375rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-light)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-main)',
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage >= totalPages ? 0.5 : 1,
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

