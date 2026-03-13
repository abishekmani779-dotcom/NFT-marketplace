import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const { isAuthenticated, isOnboarded, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to auth page, preserving the intended destination
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!isOnboarded) {
    // If logged in but not onboarded, also send to auth page so they finish the flow
    return <Navigate to="/auth" state={{ from: location, step: 'onboarding' }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
     // Optional: Redirect to home or show unauthorized if they aren't admin but try to access admin
     return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
