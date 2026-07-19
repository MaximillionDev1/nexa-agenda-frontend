import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { apiService } from "@/services/api";
import { CheckCircle, Calendar, Clock, User, Phone, FileText, ArrowLeft } from "lucide-react";

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
  const { data: service } = useQuery({
    queryKey: ["service", serviceId],
    queryFn: () => apiService.getServiceById(serviceId),
  });

  if (!service) {
    return <div>Carregando...</div>;
  }

  const formattedDate = format(new Date(appointmentDate), "dd/MM/yyyy", {
    locale: ptBR,
  });

  const dateTime = new Date(`${appointmentDate}T${startTime}`);
  const endTime = new Date(dateTime.getTime() + service.duration * 60000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">Revise seus dados</h2>

      <div className="bg-gradient-to-br from-primary/10 to-primary-light/5 border border-primary/30 rounded-xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
            <p className="text-text-secondary text-sm">{service.description}</p>
          </div>
        </div>

        <div className="border-t border-primary/20 pt-4 space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-text-secondary">Data</p>
              <p className="font-semibold">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-text-secondary">Horário</p>
              <p className="font-semibold">
                {startTime} às {format(endTime, "HH:mm")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-primary/20">
            <div>
              <p className="text-sm text-text-secondary">Duração</p>
              <p className="font-semibold">{service.duration} minutos</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Preço</p>
              <p className="font-semibold text-primary">
                R$ {Number.parseFloat(service.price).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card/50 border border-card rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-lg">Dados pessoais</h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-text-secondary">Nome</p>
              <p className="font-semibold">{customerName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-text-secondary">Telefone</p>
              <p className="font-semibold">{customerPhone}</p>
            </div>
          </div>

          {notes && (
            <div className="flex items-start gap-3 pt-2 border-t border-card">
              <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-text-secondary">Observação</p>
                <p className="font-medium text-sm">{notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-success/10 border border-success/30 rounded-xl p-4">
        <p className="text-sm text-text-secondary mb-1">Ao continuar, você concorda com</p>
        <p className="text-sm font-medium">
          nossa <span className="text-success">política de privacidade</span> e{" "}
          <span className="text-success">termos de serviço</span>
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={onConfirm}
          isLoading={isSubmitting}
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? "Confirmando..." : "Confirmar agendamento"}
        </Button>
      </div>
    </motion.div>
  );
}
