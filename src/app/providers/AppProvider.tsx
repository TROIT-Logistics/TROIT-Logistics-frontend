import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from './QueryProvider';
import { AuthProvider } from '@/context/AuthContext';
import { SellerVerificationProvider } from '@/context/SellerVerificationContext';

export interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * Global Application Provider Composition.
 * Composes QueryProvider, AuthProvider, SellerVerificationProvider, and BrowserRouter.
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <QueryProvider>
      <AuthProvider>
        <SellerVerificationProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </SellerVerificationProvider>
      </AuthProvider>
    </QueryProvider>
  );
};
