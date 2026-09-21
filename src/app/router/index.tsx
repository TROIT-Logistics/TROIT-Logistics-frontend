import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import VerificationCentrePage from '@/pages/VerificationCentrePage';
import GradeExplanationPage from '@/pages/GradeExplanationPage';
import BuyerPage from '@/pages/buyer/BuyerPage';
import ProductDetailsPage from '@/pages/buyer/ProductDetailsPage';
import BuyerOrdersPage from '@/pages/buyer/BuyerOrdersPage';
import OrderDetailsPage from '@/pages/buyer/OrderDetailsPage';
import SellerDashboardPage from '@/pages/seller/SellerDashboardPage';
import SellerProfilePage from '@/pages/seller/SellerProfilePage';
import SellerCreateProductPage from '@/pages/seller/SellerCreateProductPage';
import SellerVerificationPage from '@/pages/seller/SellerVerificationPage';
import SellerVerificationStatusPage from '@/pages/seller/SellerVerificationStatusPage';

// Admin Pages
import { AdminOverviewPage } from '@/pages/admin/AdminOverviewPage';
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage';
import { AdminSellersPage } from '@/pages/admin/AdminSellersPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminInspectionsPage } from '@/pages/admin/AdminInspectionsPage';
import { AdminTrustPage } from '@/pages/admin/AdminTrustPage';
import { AdminDisputesPage } from '@/pages/admin/AdminDisputesPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';

import { useAuth } from '@/context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole?: string }> = ({
  children,
  allowedRole,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'var(--color-text-muted)' }}>
        Authenticating session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole && user?.role !== 'admin') {
    return <Navigate to={user?.role === 'seller' ? '/seller' : '/buyer'} replace />;
  }

  return <>{children}</>;
};

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'var(--color-text-muted)' }}>
        Verifying administrator credentials...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to={user?.role === 'seller' ? '/seller' : '/buyer'} replace />;
  }

  return <>{children}</>;
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verification" element={<VerificationCentrePage />} />
      <Route path="/grade-explanation" element={<GradeExplanationPage />} />
      <Route path="/seller/profile/:id" element={<SellerProfilePage />} />

      {/* Buyer Marketplace & Orders */}
      <Route path="/buyer" element={<BuyerPage />} />
      <Route path="/buyer/products/:id" element={<ProductDetailsPage />} />
      <Route
        path="/buyer/orders"
        element={
          <ProtectedRoute>
            <BuyerOrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/buyer/orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetailsPage />
          </ProtectedRoute>
        }
      />

      {/* Seller Verification Onboarding */}
      <Route
        path="/seller/verification"
        element={
          <ProtectedRoute allowedRole="seller">
            <SellerVerificationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/verification/status"
        element={
          <ProtectedRoute allowedRole="seller">
            <SellerVerificationStatusPage />
          </ProtectedRoute>
        }
      />

      {/* Seller Portal */}
      <Route
        path="/seller"
        element={
          <ProtectedRoute allowedRole="seller">
            <SellerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products/new"
        element={
          <ProtectedRoute allowedRole="seller">
            <SellerCreateProductPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard Operations Center */}
      <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
      <Route
        path="/admin/overview"
        element={
          <AdminProtectedRoute>
            <AdminOverviewPage />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminProtectedRoute>
            <AdminProductsPage />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/sellers"
        element={
          <AdminProtectedRoute>
            <AdminSellersPage />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminProtectedRoute>
            <AdminOrdersPage />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/inspections"
        element={
          <AdminProtectedRoute>
            <AdminInspectionsPage />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/trust"
        element={
          <AdminProtectedRoute>
            <AdminTrustPage />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/disputes"
        element={
          <AdminProtectedRoute>
            <AdminDisputesPage />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminProtectedRoute>
            <AdminUsersPage />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <AdminProtectedRoute>
            <AdminAnalyticsPage />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <AdminProtectedRoute>
            <AdminSettingsPage />
          </AdminProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
