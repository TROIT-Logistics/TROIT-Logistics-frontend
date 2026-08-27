import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from './QueryProvider';
import { AuthProvider } from '@/context/AuthContext';

export interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * Global Application Provider Composition.
 * Composes QueryProvider, AuthProvider, and BrowserRouter.
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <QueryProvider>
      <AuthProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </AuthProvider>
    </QueryProvider>
  );
};
