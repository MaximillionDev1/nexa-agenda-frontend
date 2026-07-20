import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  XCircle,
  DollarSign,
  TrendingUp,
  Loader2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { apiService } from "@/services/api";
import type { IDashboardData } from "@/types";

function formatCurrency(value: number | string) {
  const numValue = typeof value === "string" ? Number.parseFloat(value) : Number(value);
  return Number.isNaN(numValue) ? "R$ 0,00" : `R$ ${numValue.toFixed(2)}`;
}

export default function DashboardPage() {
  const {
    data: dashboard,
    isLoading,
    isError,
  } = useQuery<IDashboardData>({
    queryKey: ["dashboard"],
    queryFn: () => apiService.getDashboard(),
    staleTime: 60 * 1000,
  });

  const statCards = dashboard
    ? [
        {
          label: "Total de Agendamentos",
          value: dashboard.stats.total,
          icon: CalendarCheck,
          color: "text-primary",
        },
        {
          label: "Agendados",
          value: dashboard.stats.scheduled,
          icon: CalendarClock,
          color: "text-blue-500",
        },
        {
          label: "Confirmados",
          value: dashboard.stats.confirmed,
          icon: CheckCircle2,
          color: "text-success",
        },
        {
          label: "Concluídos",
          value: dashboard.stats.completed,
          icon: CheckCircle2,
          color: "text-primary-light",
        },
        {
          label: "Cancelados",
          value: dashboard.stats.canceled,
          icon: XCircle,
          color: "text-red-500",
        },
      ]
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full min-h-screen bg-background"
    >
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-text">Dashboard</h1>
          <p className="text-sm sm:text-base text-text-secondary">
            {dashboard?.date
              ? format(new Date(dashboard.date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })
              : "Visão geral de hoje"}
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={40} className="animate-spin text-primary" />
            <p className="text-text-secondary">Carregando dados do dashboard...</p>
          </div>
        )}

        {/* Erro */}
        {isError && (
          <div className="bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-lg p-6 flex items-start gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-1">
                Não foi possível carregar o dashboard
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                Verifique sua conexão com o servidor e tente novamente.
              </p>
            </div>
          </div>
        )}

        {dashboard && !isLoading && (
          <>
            {/* Cards de estatísticas */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className="bg-card/50 border border-card rounded-lg p-4 sm:p-6"
                >
                  <card.icon className={`${card.color} mb-2`} size={22} />
                  <p className="text-xs sm:text-sm text-text-secondary mb-1">{card.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-text">{card.value}</p>
                </div>
              ))}
            </div>

            {/* Faturamento */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-card/50 border border-card rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-success" size={20} />
                  <p className="text-xs sm:text-sm text-text-secondary">Faturamento Concluído</p>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-success">
                  {formatCurrency(dashboard.revenue.completed)}
                </p>
              </div>

              <div className="bg-card/50 border border-card rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-primary" size={20} />
                  <p className="text-xs sm:text-sm text-text-secondary">Faturamento Projetado</p>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-primary">
                  {formatCurrency(dashboard.revenue.projected)}
                </p>
              </div>

              <div className="bg-card/50 border border-card rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-text-secondary" size={20} />
                  <p className="text-xs sm:text-sm text-text-secondary">Total do Dia</p>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-text">
                  {formatCurrency(dashboard.revenue.total)}
                </p>
              </div>
            </div>

            {/* Próximo agendamento */}
            <div className="bg-card/50 border border-card rounded-lg p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="text-primary" size={20} />
                <h2 className="text-lg font-semibold text-text">Próximo Agendamento</h2>
              </div>

              {dashboard.nextAppointment ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{dashboard.nextAppointment.service.icon}</span>
                    <div>
                      <p className="font-semibold text-text">
                        {dashboard.nextAppointment.service.name}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {dashboard.nextAppointment.customerName} ·{" "}
                        {dashboard.nextAppointment.customerPhone}
                      </p>
                    </div>
                  </div>
                  <div className="sm:ml-auto">
                    <p className="text-xl font-bold text-primary">
                      {format(new Date(dashboard.nextAppointment.startTime), "HH:mm")}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {format(new Date(dashboard.nextAppointment.appointmentDate), "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-text-secondary text-sm">
                  Nenhum agendamento futuro encontrado.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
