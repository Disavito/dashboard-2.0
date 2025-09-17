import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    // Optionally, render a loading spinner or placeholder while user status is being fetched
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text">
        Cargando...
      </div>
    );
  }

  if (!user) {
    // User is not authenticated, redirect to the auth page
    return <Navigate to="/auth" replace />;
  }

  // User is authenticated, render the children components
  return <>{children}</>;
};

export default ProtectedRoute;
