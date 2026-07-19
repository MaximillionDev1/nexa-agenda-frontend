import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { apiService } from "@/services/api";
import type { IAppointment } from "@/types";
import { AppointmentsFilters, type FilterValues } from "@/components/admin/AppointmentsFilters";
import { AppointmentsTable } from "@/components/admin/AppointmentsTable";
import { Pagination } from "@/components/admin/Pagination";
import {
  useAppointmentsAdmin,
  type AppointmentsFilters as AppointmentsFiltersType,
} from "@/hooks/useAppointmentsAdmin";

const ITEMS_PER_PAGE = 10;

export default function AppointmentsPage() {
  const [filters, setFilters] = useState<FilterValues>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  // Fetch services para os filtros
  const servicesQuery = useQuery({
    queryKey: ["services"],
    queryFn: () => apiService.getServices(),
  });

  // Calcular offset baseado na página atual
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Preparar filtros para a API (sem campos vazios)
  const apiFilters = useMemo<AppointmentsFiltersType>(() => {
    return {
      date: filters.date || undefined,
      status: filters.status || undefined,
      serviceId: filters.serviceId || undefined,
      customerName: filters.customerName || undefined,
      customerPhone: filters.customerPhone || undefined,
      limit: ITEMS_PER_PAGE,
      offset,
    };
  }, [filters, offset]);

  // Fetch appointments com filtros e paginação
  const { appointmentsQuery, updateStatusMutation, cancelMutation, deleteMutation } =
    useAppointmentsAdmin(apiFilters);

  // Dados da resposta
  const appointments = useMemo(() => {
    return appointmentsQuery.data?.appointments || [];
  }, [appointmentsQuery.data]);

  const totalAppointments = useMemo(() => {
    return appointmentsQuery.data?.total || 0;
  }, [appointmentsQuery.data]);

  const totalPages = Math.ceil(totalAppointments / ITEMS_PER_PAGE) || 1;

  // Handler para filtros
  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset para primeira página ao filtrar
  }, []);

  // Handler para mudança de status
  const handleStatusChange = useCallback(
    (id: string, status: IAppointment["status"]) => {
      setLoadingActionId(id);
      updateStatusMutation.mutate(
        { id, status },
        {
          onSuccess: () => setLoadingActionId(null),
          onError: () => setLoadingActionId(null),
        },
      );
    },
    [updateStatusMutation],
  );

  // Handler para cancelar
  const handleCancel = useCallback(
    (id: string) => {
      setLoadingActionId(id);
      cancelMutation.mutate(id, {
        onSuccess: () => setLoadingActionId(null),
        onError: () => setLoadingActionId(null),
      });
    },
    [cancelMutation],
  );

  // Handler para deletar
  const handleDelete = useCallback(
    (id: string) => {
      if (
        window.confirm(
          "Tem certeza que deseja deletar este agendamento? Esta ação não pode ser desfeita.",
        )
      ) {
        setLoadingActionId(id);
        deleteMutation.mutate(id, {
          onSuccess: () => setLoadingActionId(null),
          onError: () => setLoadingActionId(null),
        });
      }
    },
    [deleteMutation],
  );

  const isLoading =
    appointmentsQuery.isLoading ||
    updateStatusMutation.isPending ||
    cancelMutation.isPending ||
    deleteMutation.isPending;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Gerenciar Agendamentos</h1>
          <p className="text-text-secondary mt-1">
            Total de agendamentos: <span className="font-semibold">{totalAppointments}</span>
          </p>
        </div>
      </div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card/50 border border-card rounded-lg p-4"
      >
        <AppointmentsFilters
          services={servicesQuery.data || []}
          onFilterChange={handleFilterChange}
          loading={isLoading}
        />
      </motion.div>

      {/* Tabela */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card/50 border border-card rounded-lg overflow-hidden"
      >
        <AppointmentsTable
          appointments={appointments}
          onStatusChange={handleStatusChange}
          onCancel={handleCancel}
          onDelete={handleDelete}
          loading={appointmentsQuery.isLoading}
          loadingActionId={loadingActionId}
        />
      </motion.div>

      {/* Paginação */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            loading={isLoading}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
