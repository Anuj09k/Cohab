import React from 'react';
import { AppProvider } from './AppContext';
import { AppContent } from './AppContent';

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
