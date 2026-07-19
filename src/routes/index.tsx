import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth'
import { Suspense, lazy } from 'react'
import { AdminLayout } from '@/layouts/AdminLayout'

// Lazy load pages
const HomePage = lazy(() => import('@/pages/client/home'))
const LoginPage = lazy(() => import('@/pages/admin/login'))
const SchedulingPage = lazy(() => import('@/pages/client/scheduling'))
const LookupPage = lazy(() => import('@/pages/client/lookup'))
const DashboardPage = lazy(() => import('@/pages/admin/dashboard'))
const AppointmentsPage = lazy(() => import('@/pages/admin/appointments'))
const ServicesPage = lazy(() => import('@/pages/admin/services'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-secondary">Carregando...</p>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingFallback />
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* ========== ROTAS PÚBLICAS ========== */}
          <Route path="/" element={<HomePage />} />
          <Route path="/scheduling" element={<SchedulingPage />} />
          <Route path="/lookup" element={<LookupPage />} />

          {/* ========== ROTAS ADMINISTRATIVAS ========== */}
          {/* Login - Sem Layout */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Admin com Layout */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <DashboardPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AppointmentsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ServicesPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* 404 - Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  )
}