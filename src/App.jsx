import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { useStore } from './context/store';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import POS from './pages/POS';
import Debt from './pages/Debt';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { user } = useStore();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  const { user } = useStore();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/inventory" element={
        <ProtectedRoute>
          <Inventory />
        </ProtectedRoute>
      } />
      
      <Route path="/pos" element={
        <ProtectedRoute>
          <POS />
        </ProtectedRoute>
      } />
      
      <Route path="/debt" element={
        <ProtectedRoute>
          <Debt />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </StoreProvider>
  );
};

export default App;
