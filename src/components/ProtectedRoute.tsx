import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, requireAdmin = false }: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
