import React from 'react';
import App from '@/App';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppWrapper = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWrapper;