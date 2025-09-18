// En ProtectedRoute.tsx
import { useUser } from '@/context/UserContext';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { roles, loading } = useUser(); // Cambiado de 'role' a 'roles'

  if (loading) {
    return <div>Cargando...</div>; // O un spinner
  }

  // Comprueba si alguno de los roles del usuario está en la lista de roles permitidos
  const isAllowed = roles?.some(role => allowedRoles.includes(role));

  return isAllowed ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;
