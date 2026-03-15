import React from 'react';

// Auth is removed — all routes are publicly accessible.
// This component is kept as a passthrough to avoid breaking any imports.
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
