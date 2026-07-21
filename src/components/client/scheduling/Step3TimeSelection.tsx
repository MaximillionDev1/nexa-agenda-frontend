import { apiService } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { Clock, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Step3TimeSelectionProps {
  serviceId?: string;
  appointmentDate?: string;
  selectedTime?: string;
  onSelectTime: (time: string) => void;
}

export function Step3TimeSelection({
  serviceId,
  appointmentDate,
  selectedTime,
  onSelectTime,
}: Step3TimeSelectionProps) {
  const [durationMinutes, setDurationMinutes] = useState(0);

  // Buscar duração do serviço selecionado
  useEffect(() => {
    if (!serviceId) return;

    const fetchServiceDuration = async () => {
      try {
        const service = await apiService.getServiceById(serviceId);
        setDurationMinutes(service.duration);
      } catch (error) {
        console.error("Erro ao buscar duração do serviço:", error);
      }
    };

    fetchServiceDuration();
  }, [serviceId]);

  // Buscar horários disponíveis
  const { data: availabilityData, isLoading } = useQuery({
    queryKey: ["availability", appointmentDate, serviceId],
    queryFn: () => {
      if (!appointmentDate || !serviceId) {
        return Promise.resolve({ slots: [] });
      }
      return apiService.getAvailability(appointmentDate, serviceId);
    },
    enabled: !!appointmentDate && !!serviceId,
  });

  const slots = availabilityData?.slots || [];

  if (!appointmentDate || !serviceId) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Selecione o horário</h2>
        <div className="p-6 bg-card/50 border border-card rounded-lg text-center">
          <p className="text-text-secondary">
            Selecione um serviço e uma data para ver os horários disponíveis.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Selecione o horário</h2>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 size={32} className="animate-spin text-primary mx-auto mb-4" />
            <p className="text-text-secondary">Carregando horários...</p>
          </div>
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Selecione o horário</h2>
        <div className="p-6 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg text-center">
          <p className="text-yellow-800 dark:text-yellow-200 font-medium mb-2">
            Nenhum horário disponível
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Não há horários disponíveis para esta data. Tente selecionar outro dia.
          </p>
        </div>
      </div>
    );
  }

  // CORREÇÃO: Fazer parse seguro da data sem timezone shift
  const formatDateSafely = (dateString: string): string => {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const formattedDate = formatDateSafely(appointmentDate);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Selecione o horário</h2>

      {/* Informações da Data */}
      <div className="p-4 sm:p-6 bg-primary/10 border border-primary/30 rounded-lg">
        <p className="text-xs sm:text-sm text-text-secondary mb-1">Data selecionada:</p>
        <p className="text-lg sm:text-xl font-semibold text-primary">{formattedDate}</p>
        {durationMinutes > 0 && (
          <p className="text-xs sm:text-sm text-text-secondary mt-2">
            Duração do serviço: {durationMinutes} minutos
          </p>
        )}
      </div>

      {/* Grid de Horários */}
      <div className="space-y-3">
        <p className="text-sm text-text-secondary">Horários disponíveis:</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
          {slots.map((slot) => (
            <motion.button
              key={`slot-${slot}`}
              type="button"
              onClick={() => onSelectTime(slot)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 sm:p-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1 sm:gap-2 min-h-[44px] text-sm sm:text-base ${
                selectedTime === slot
                  ? "bg-primary text-white border border-primary"
                  : "bg-card border border-card hover:border-primary hover:text-primary"
              }`}
              aria-pressed={selectedTime === slot}
            >
              <Clock className="w-4 h-4" />
              <span>{slot}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Resumo da Seleção */}
      {selectedTime && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-6 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg"
        >
          <p className="text-xs sm:text-sm text-text-secondary mb-1">Horário selecionado:</p>
          <p className="text-lg sm:text-xl font-semibold text-green-700 dark:text-green-400">
            {selectedTime} ({durationMinutes} minutos)
          </p>
        </motion.div>
      )}
    </div>
  );
}
