import React from 'react';
import { AppProvider } from '@/app/providers';
import { AppRouter } from '@/app/router';
import { ThemeProvider } from '@/context/ThemeContext';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </AppProvider>
  );
};

export default App;
