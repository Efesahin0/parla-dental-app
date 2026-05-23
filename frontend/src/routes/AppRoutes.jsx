import { Route, Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage.jsx';
import DoctorsPage from '../pages/DoctorsPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';
import DentistDashboard from '../pages/DentistDashboard.jsx';
import NotFound from '../pages/NotFound.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import DashboardRedirect from './DashboardRedirect.jsx';
import { ROUTES } from './routePaths.js';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<LandingPage />} />
      <Route path={ROUTES.DOCTORS} element={<DoctorsPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.DASHBOARD} element={<DashboardRedirect />} />

      <Route
        path={ROUTES.ADMIN}
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.DENTIST}
        element={
          <ProtectedRoute allowedRoles={['DENTIST']}>
            <DentistDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
