import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth'
import { LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'Agendamentos', path: '/admin/appointments', icon: '📅' },
    { label: 'Serviços', path: '/admin/services', icon: '✂️' },
  ]

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Header */}
      <header className="border-b border-card bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-card rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-primary">Nexa</div>
              <div className="text-sm text-text-secondary">Admin</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">{admin?.name}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 hover:bg-card rounded-lg transition-colors text-error"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } border-r border-card bg-card/30 transition-all duration-300 overflow-hidden lg:w-64`}
        >
          <nav className="p-6 space-y-4">
            {menuItems.map((item) => (
              <button
                type="button"
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                  setSidebarOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-card transition-colors text-left"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}