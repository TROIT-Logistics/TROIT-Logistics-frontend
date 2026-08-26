import React from 'react';
import { AppProvider } from '@/app/providers';
import { AppRouter } from '@/app/router';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
};

export default App;
