import { ServiceFormModal } from "@/components/admin/ServiceFormModal";
import { ServicesTable } from "@/components/admin/ServicesTable";
import { type ServiceFormData, useServicesAdmin } from "@/hooks/useServicesAdmin";
import type { IService } from "@/types";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  const { servicesQuery, createMutation, updateMutation, toggleMutation, deleteMutation } =
    useServicesAdmin();

  const services = servicesQuery.data || [];

  // Handler para abrir modal de criação
  const handleCreateClick = useCallback(() => {
    setSelectedService(null);
    setIsModalOpen(true);
  }, []);

  // Handler para fechar modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedService(null);
  }, []);

  // Handler para editar serviço
  const handleEdit = useCallback((service: IService) => {
    setSelectedService(service);
    setIsModalOpen(true);
  }, []);

  // Handler para enviar formulário
  const handleFormSubmit = useCallback(
    (data: ServiceFormData) => {
      if (selectedService) {
        // Update
        updateMutation.mutate(
          { id: selectedService.id, data },
          {
            onSuccess: () => {
              handleCloseModal();
            },
          },
        );
      } else {
        // Create
        createMutation.mutate(data, {
          onSuccess: () => {
            handleCloseModal();
          },
        });
      }
    },
    [selectedService, createMutation, updateMutation, handleCloseModal],
  );

  // Handler para toggle status
  const handleToggle = useCallback(
    (id: string) => {
      setLoadingActionId(id);
      toggleMutation.mutate(id, {
        onSuccess: () => setLoadingActionId(null),
        onError: () => setLoadingActionId(null),
      });
    },
    [toggleMutation],
  );

  // Handler para deletar
  const handleDelete = useCallback(
    (id: string) => {
      if (
        window.confirm(
          "Are you sure you want to delete this service? This action cannot be undone.",
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
    servicesQuery.isLoading ||
    createMutation.isPending ||
    updateMutation.isPending ||
    toggleMutation.isPending ||
    deleteMutation.isPending;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full min-h-screen bg-background"
    >
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-text">Manage Services</h1>
            <p className="text-sm sm:text-base text-text-secondary">
              Total services: <span className="font-semibold">{services.length}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreateClick}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto min-h-[44px]"
          >
            <Plus size={20} />
            New Service
          </button>
        </div>

        {/* Tabela */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/50 border border-card rounded-lg overflow-hidden"
        >
          <ServicesTable
            services={services}
            onEdit={handleEdit}
            onToggle={handleToggle}
            onDelete={handleDelete}
            loading={servicesQuery.isLoading}
            loadingActionId={loadingActionId}
          />
        </motion.div>

        {/* Modal */}
        <ServiceFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          loading={createMutation.isPending || updateMutation.isPending}
          service={selectedService}
        />
      </div>
    </motion.div>
  );
}
