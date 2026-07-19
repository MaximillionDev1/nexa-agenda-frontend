import { useQuery } from '@tanstack/react-query'
import { apiService } from '@/services/api'
import type { IDashboardData } from '@/types'

export default function DashboardPage() {
  const { data: dashboard } = useQuery<IDashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => apiService.getDashboard(),
  })

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card/50 border border-card rounded-lg p-6">
            <p className="text-text-secondary text-sm mb-2">Total de Agendamentos</p>
            <p className="text-3xl font-bold text-primary">{dashboard.stats.total}</p>
          </div>
          <div className="bg-card/50 border border-card rounded-lg p-6">
            <p className="text-text-secondary text-sm mb-2">Confirmados</p>
            <p className="text-3xl font-bold text-success">{dashboard.stats.confirmed}</p>
          </div>
          <div className="bg-card/50 border border-card rounded-lg p-6">
            <p className="text-text-secondary text-sm mb-2">Concluídos</p>
            <p className="text-3xl font-bold text-primary-light">
              {dashboard.stats.completed}
            </p>
          </div>
          <div className="bg-card/50 border border-card rounded-lg p-6">
            <p className="text-text-secondary text-sm mb-2">Faturamento</p>
            <p className="text-3xl font-bold text-success">
              R$ {dashboard.revenue.completed.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}