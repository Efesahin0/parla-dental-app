import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROUTES } from './routePaths.js';

export default function DashboardRedirect() {
  const { user } = useAuth();

  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  if (user.role === 'ADMIN') return <Navigate to={ROUTES.ADMIN} replace />;
  if (user.role === 'DENTIST') return <Navigate to={ROUTES.DENTIST} replace />;

  return <Navigate to={ROUTES.HOME} replace />;
}
