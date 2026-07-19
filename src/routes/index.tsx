import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth'


// Componente temporário
function Placeholder() {
  return <div className="p-4">Página em desenvolvimento...</div>
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Placeholder />} />
        <Route path="/scheduling" element={<Placeholder />} />
        <Route path="/lookup" element={<Placeholder />} />

        {/* Rotas Admin */}
        <Route path="/admin/login" element={<Placeholder />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Placeholder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute>
              <Placeholder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute>
              <Placeholder />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}