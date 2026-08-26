import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from './QueryProvider';

export interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * Global Application Provider Composition.
 * Future providers (e.g. AuthProvider, ThemeProvider) should be composed here.
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <QueryProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryProvider>
  );
};
