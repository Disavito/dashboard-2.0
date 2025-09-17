import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { role, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-textSecondary">Verificando acceso...</span>
      </div>
    );
  }

  if (!role || !allowedRoles.includes(role)) {
    // If user is not authenticated or doesn't have the required role, redirect to the dashboard
    return <Navigate to="/" replace />;
  }

  // If user has the required role, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
