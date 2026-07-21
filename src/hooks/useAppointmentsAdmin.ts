import { apiService } from "@/services/api";
import type { IAppointment } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface AppointmentsFilters {
  date?: string;
  status?: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELED";
  serviceId?: string;
  customerName?: string;
  customerPhone?: string;
  limit?: number;
  offset?: number;
}

export interface AppointmentsResponse {
  appointments: IAppointment[];
  total: number;
}

function parseAppointmentsResponse(response: unknown): AppointmentsResponse {
  // Se for um array direto
  if (Array.isArray(response)) {
    return {
      appointments: response as IAppointment[],
      total: response.length,
    };
  }

  // Se for um objeto com data
  if (
    response &&
    typeof response === "object" &&
    "appointments" in response &&
    "total" in response
  ) {
    return response as AppointmentsResponse;
  }

  // Se for um objeto com data array
  if (response && typeof response === "object" && "data" in response) {
    const data = (response as { data: unknown }).data;
    if (Array.isArray(data)) {
      return {
        appointments: data as IAppointment[],
        total: data.length,
      };
    }
  }

  // Fallback
  return {
    appointments: [],
    total: 0,
  };
}

export function useAppointmentsAdmin(filters: AppointmentsFilters = {}) {
  const queryClient = useQueryClient();

  // Fetch appointments
  const appointmentsQuery = useQuery({
    queryKey: ["appointments", filters],
    queryFn: async () => {
      const response = await apiService.getAppointments(filters);
      return parseAppointmentsResponse(response);
    },
    staleTime: 30 * 1000, // 30s
  });

  // Update status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: IAppointment["status"] }) =>
      apiService.updateAppointmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Status atualizado com sucesso");
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      const message = apiError?.response?.data?.message || "Erro ao atualizar status";
      toast.error(message);
    },
  });

  // Cancel appointment
  const cancelMutation = useMutation({
    mutationFn: (id: string) => apiService.cancelAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Agendamento cancelado com sucesso");
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      const message = apiError?.response?.data?.message || "Erro ao cancelar agendamento";
      toast.error(message);
    },
  });

  // Delete appointment
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Agendamento deletado com sucesso");
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      const message = apiError?.response?.data?.message || "Erro ao deletar agendamento";
      toast.error(message);
    },
  });

  return {
    appointmentsQuery,
    updateStatusMutation,
    cancelMutation,
    deleteMutation,
  };
}
