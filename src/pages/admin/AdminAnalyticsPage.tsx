import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';

export const AdminAnalyticsPage: React.FC = () => {
  return (
    <AdminLayout title="Platform Analytics" subtitle="Marketplace metrics and volume analytics">
      <AdminEmptyState
        title="Analytics Engine Pending"
        description="Analytics metrics and time-series visual charts will be available when the dedicated backend analytics API is implemented."
        isBackendDependency={true}
        requiredEndpoint="/api/v1/admin/analytics"
        httpMethod="GET"
      />
    </AdminLayout>
  );
};
