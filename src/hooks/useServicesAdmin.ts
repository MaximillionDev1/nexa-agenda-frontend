import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { toast } from "sonner";
import type { IService } from "@/types";

export interface ServiceFormData {
  name: string;
  description?: string;
  duration: number;
  price: string; // Manter como string para compatibilidade com API
  icon: string;
}

function parseServicesResponse(response: unknown): IService[] {
  // Se for um array direto
  if (Array.isArray(response)) {
    return response as IService[];
  }

  // Se for um objeto com data
  if (response && typeof response === "object" && "data" in response) {
    const data = (response as { data: unknown }).data;
    if (Array.isArray(data)) {
      return data as IService[];
    }
  }

  // Fallback
  return [];
}

export function useServicesAdmin() {
  const queryClient = useQueryClient();

  // Fetch services
  const servicesQuery = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await apiService.getServices();
      return parseServicesResponse(response);
    },
    staleTime: 30 * 1000,
  });

  // Create service
  const createMutation = useMutation({
    mutationFn: (data: ServiceFormData) => apiService.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service created successfully");
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      const message = apiError?.response?.data?.message || "Error creating service";
      toast.error(message);
    },
  });

  // Update service
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ServiceFormData }) =>
      apiService.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service updated successfully");
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      const message = apiError?.response?.data?.message || "Error updating service";
      toast.error(message);
    },
  });

  // Toggle service status
  const toggleMutation = useMutation({
    mutationFn: (id: string) => apiService.toggleServiceStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service updated successfully");
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      const message = apiError?.response?.data?.message || "Error updating service";
      toast.error(message);
    },
  });

  // Delete service
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service deleted successfully");
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      const message = apiError?.response?.data?.message || "Error deleting service";
      toast.error(message);
    },
  });

  return {
    servicesQuery,
    createMutation,
    updateMutation,
    toggleMutation,
    deleteMutation,
  };
}
