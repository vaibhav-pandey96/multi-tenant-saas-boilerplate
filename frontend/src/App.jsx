import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import BillingPage from './pages/BillingPage.jsx';
import SuperAdminPage from './pages/SuperAdminPage';
import CompanyDetailsPage from "./pages/CompanyDetailsPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Any logged-in user */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <BillingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/superadmin/company/:id"
            element={
              <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <CompanyDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Tenant Admin Only */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          {/* Platform Owner Only */}
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <SuperAdminPage />
              </ProtectedRoute>
            }
          />

          {/* Default */}
          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;