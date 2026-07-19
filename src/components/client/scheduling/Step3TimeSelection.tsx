import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock } from "lucide-react";
import { apiService } from "@/services/api";

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
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
        <div className="p-6 bg-warning/10 border border-warning/30 rounded-lg text-center">
          <p className="text-warning font-medium mb-2">Nenhum horário disponível</p>
          <p className="text-text-secondary text-sm">
            Não há horários disponíveis para esta data. Tente selecionar outro dia.
          </p>
        </div>
      </div>
    );
  }

  const formattedDate = format(new Date(appointmentDate), "dd/MM/yyyy", {
    locale: ptBR,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Selecione o horário</h2>

      {/* Informações da Data */}
      <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <p className="text-sm text-text-secondary mb-1">Data selecionada:</p>
        <p className="text-lg font-semibold text-primary">{formattedDate}</p>
        {durationMinutes > 0 && (
          <p className="text-sm text-text-secondary mt-2">
            Duração do serviço: {durationMinutes} minutos
          </p>
        )}
      </div>

      {/* Grid de Horários */}
      <div className="space-y-3">
        <p className="text-sm text-text-secondary">Horários disponíveis:</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {slots.map((slot) => (
            <motion.button
              key={`slot-${slot}`}
              type="button"
              onClick={() => onSelectTime(slot)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                selectedTime === slot
                  ? "bg-primary text-white border-primary"
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
          className="p-4 bg-success/10 border border-success/30 rounded-lg"
        >
          <p className="text-sm text-text-secondary mb-1">Horário selecionado:</p>
          <p className="text-lg font-semibold text-success">
            {selectedTime} ({durationMinutes} minutos)
          </p>
        </motion.div>
      )}
    </div>
  );
}
