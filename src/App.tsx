import React from 'react';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './context/AuthContext';
import { AccountProvider } from './context/AccountContext';

// Add animation keyframes to CSS
import './styles/animations.css';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Dashboard /> : <Login />;
}

function App() {
  return (
    <AuthProvider>
      <AccountProvider>
        <AppContent />
      </AccountProvider>
    </AuthProvider>
  );
}

export default App;