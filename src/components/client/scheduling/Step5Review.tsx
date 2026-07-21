import { Button } from "@/components/ui/Button";
import { apiService } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Phone,
  User,
} from "lucide-react";

interface Step5ReviewProps {
  serviceId: string;
  appointmentDate: string;
  startTime: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function Step5Review({
  serviceId,
  appointmentDate,
  startTime,
  customerName,
  customerPhone,
  notes,
  onConfirm,
  onBack,
  isSubmitting,
}: Step5ReviewProps) {
  const { data: service, isLoading } = useQuery({
    queryKey: ["service", serviceId],
    queryFn: () => apiService.getServiceById(serviceId),
  });

  if (isLoading || !service) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-primary" />
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

  // CORREÇÃO: Calcular endTime sem timezone shift
  const calculateEndTime = (startTimeStr: string, durationMinutes: number): string => {
    const [hours, minutes] = startTimeStr.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
  };

  const endTime = calculateEndTime(startTime, service.duration);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">Revise seus dados</h2>

      {/* Service Card */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-text">{service.name}</h3>
            {service.description && (
              <p className="text-text-secondary text-sm mt-1">{service.description}</p>
            )}
          </div>
        </div>

        <div className="border-t border-primary/20 pt-4 space-y-4">
          {/* Data */}
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-text-secondary">Data</p>
              <p className="font-semibold text-text text-base sm:text-lg">{formattedDate}</p>
            </div>
          </div>

          {/* Horário */}
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-text-secondary">Horário</p>
              <p className="font-semibold text-text text-base sm:text-lg">
                {startTime} às {endTime}
              </p>
            </div>
          </div>

          {/* Duração e Preço */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-primary/20">
            <div>
              <p className="text-xs sm:text-sm text-text-secondary">Duração</p>
              <p className="font-semibold text-text">{service.duration} minutos</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-text-secondary">Preço</p>
              <p className="font-semibold text-primary text-base sm:text-lg">
                R${" "}
                {typeof service.price === "string"
                  ? Number.parseFloat(service.price).toFixed(2)
                  : typeof service.price === "number"
                    ? (service.price as number).toFixed(2)
                    : "0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Data Card */}
      <div className="bg-card/50 border border-card rounded-xl p-6 sm:p-8 space-y-4">
        <h3 className="font-semibold text-lg text-text">Dados pessoais</h3>

        <div className="space-y-4">
          {/* Nome */}
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-text-secondary">Nome</p>
              <p className="font-semibold text-text truncate">{customerName}</p>
            </div>
          </div>

          {/* Telefone */}
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-text-secondary">Telefone</p>
              <p className="font-semibold text-text">{customerPhone}</p>
            </div>
          </div>

          {/* Observação */}
          {notes && (
            <div className="flex items-start gap-3 pt-2 border-t border-card">
              <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-text-secondary">Observação</p>
                <p className="text-sm text-text break-words">{notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Terms Card */}
      <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-xl p-4">
        <p className="text-xs sm:text-sm text-text-secondary mb-1">
          Ao continuar, você concorda com
        </p>
        <p className="text-xs sm:text-sm font-medium text-text">
          nossa{" "}
          <span className="text-green-700 dark:text-green-400 font-semibold">
            política de privacidade
          </span>{" "}
          e{" "}
          <span className="text-green-700 dark:text-green-400 font-semibold">
            termos de serviço
          </span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={onConfirm}
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 min-h-[44px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Confirmando...</span>
            </>
          ) : (
            <span>Confirmar agendamento</span>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
