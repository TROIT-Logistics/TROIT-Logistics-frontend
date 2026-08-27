import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import BuyerPage from '@/pages/buyer/BuyerPage';
import ProductDetailsPage from '@/pages/buyer/ProductDetailsPage';
import BuyerOrdersPage from '@/pages/buyer/BuyerOrdersPage';
import OrderDetailsPage from '@/pages/buyer/OrderDetailsPage';
import SellerDashboardPage from '@/pages/seller/SellerDashboardPage';
import SellerCreateProductPage from '@/pages/seller/SellerCreateProductPage';
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

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

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

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
