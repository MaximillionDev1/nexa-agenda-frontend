import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Button } from "@/components/ui/Button";
import { CheckCircle, Copy, MessageCircle, Home, Calendar, Clock, DollarSign} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { IAppointment } from "@/types";

interface LocationState {
  appointment?: IAppointment;
}

export default function SchedulingConfirmationPage() {
  const { publicCode } = useParams<{ publicCode: string }>();
  const navigate = useNavigate();
  const location = useLocation() as { state?: LocationState };
  
  const appointment = location.state?.appointment;

  if (!publicCode) {
    return (
      <PublicLayout>
        <div className="py-20 container-app max-w-md mx-auto">
          <div className="text-center">
            <p className="text-text-secondary mb-4">Código não fornecido</p>
            <Button type="button" onClick={() => navigate("/")}>
              Voltar ao início
            </Button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!appointment) {
    return (
      <PublicLayout>
        <div className="py-20 container-app max-w-md mx-auto">
          <div className="text-center">
            <p className="text-text-secondary mb-4">Agendamento não encontrado</p>
            <Button type="button" onClick={() => navigate("/")}>
              Voltar ao início
            </Button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(appointment.publicCode);
    toast.success("Código copiado!");
  };

  const handleShareWhatsApp = () => {
    const priceNumber = Number(appointment.service.price ?? 0);
    const formattedPrice = priceNumber.toFixed(2);

    const message = `Olá! Meu agendamento foi confirmado!\n\n📅 ${format(
      new Date(appointment.appointmentDate),
      "dd/MM/yyyy",
      { locale: ptBR }
    )}\n🕐 ${format(
      new Date(appointment.startTime),
      "HH:mm"
    )}\n💇 ${appointment.service.name}\n💰 R$ ${formattedPrice}\n\nCódigo: ${appointment.publicCode}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // CORREÇÃO: Usar startTime e endTime já salvos no banco
  const formattedDate = format(
    new Date(appointment.appointmentDate),
    "dd/MM/yyyy",
    { locale: ptBR }
  );

  const formattedStartTime = format(
    new Date(appointment.startTime),
    "HH:mm"
  );

  const formattedEndTime = format(
    new Date(appointment.endTime),
    "HH:mm"
  );

  return (
    <PublicLayout>
      <div className="py-8 sm:py-20">
        <div className="container-app max-w-2xl">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
              }}
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6"
            >
              <CheckCircle className="w-full h-full text-green-500" />
            </motion.div>
            <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-text">
              Agendamento confirmado!
            </h1>
            <p className="text-sm sm:text-lg text-text-secondary">
              Tudo pronto. Visualize os detalhes abaixo.
            </p>
          </motion.div>

          {/* Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-100/50 to-green-50/30 dark:from-green-900/20 dark:to-green-900/10 border border-green-300/50 dark:border-green-700/30 rounded-xl p-6 sm:p-8 mb-6 sm:mb-8 space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-text">
                {appointment.service.name}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-y border-green-200/50 dark:border-green-700/30">
                {/* Data */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm text-text-secondary">Data</p>
                    <p className="font-semibold text-text">{formattedDate}</p>
                  </div>
                </div>

                {/* Horário */}
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm text-text-secondary">Horário</p>
                    <p className="font-semibold text-text">
                      {formattedStartTime} às {formattedEndTime}
                    </p>
                  </div>
                </div>

                {/* Duração */}
                <div className="flex items-start gap-3">
                  <span className="text-lg">⏱️</span>
                  <div>
                    <p className="text-xs sm:text-sm text-text-secondary">Duração</p>
                    <p className="font-semibold text-text">{appointment.service.duration} minutos</p>
                  </div>
                </div>

                {/* Valor */}
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm text-text-secondary">Valor</p>
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      R${' '}
                      {typeof appointment.service.price === 'string'
                        ? Number.parseFloat(appointment.service.price).toFixed(2)
                        : (appointment.service.price as number).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Public Code */}
              <div className="space-y-2">
                <p className="text-sm text-text-secondary">Código do agendamento</p>
                <div className="flex items-center gap-3 bg-background/50 border border-green-200/50 dark:border-green-700/30 rounded-lg p-4">
                  <code className="font-mono font-bold text-base sm:text-lg text-text">
                    {appointment.publicCode}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="ml-auto p-2 hover:bg-green-500/10 rounded-lg transition-colors text-green-600 dark:text-green-400"
                    aria-label="Copiar código"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-text-secondary">
                  Guarde este código. Você precisará dele para consultar seu agendamento.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Notes */}
          {appointment.notes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card/50 border border-card rounded-xl p-4 sm:p-6 mb-6 sm:mb-8"
            >
              <p className="text-xs sm:text-sm text-text-secondary mb-2">Sua observação</p>
              <p className="text-sm text-text">{appointment.notes}</p>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handleShareWhatsApp}
                className="flex items-center justify-center gap-2 min-h-[44px]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Compartilhar no WhatsApp</span>
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Home className="w-5 h-5" />
                <span>Voltar ao Início</span>
              </Button>
            </div>
          </motion.div>

          {/* Lookup Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 sm:mt-12 p-4 sm:p-6 bg-primary/5 border border-primary/20 rounded-xl text-center"
          >
            <p className="text-xs sm:text-sm text-text-secondary mb-3">
              Quer consultar seu agendamento depois?
            </p>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/lookup")}
            >
              Acessar página de consulta
            </Button>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
}