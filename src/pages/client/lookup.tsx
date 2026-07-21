import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, AlertCircle, CheckCircle2, Clock, DollarSign, Loader2, Phone } from "lucide-react";
import { apiService } from "@/services/api";
import { PublicLayout } from "@/layouts/PublicLayout";
import type { IAppointment } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const lookupSchema = z.object({
  publicCode: z
    .string()
    .min(1, "Código do agendamento é obrigatório")
    .min(6, "Código deve ter pelo menos 6 caracteres"),
  customerPhone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .regex(/^\d{10,11}$/, "Telefone inválido (10 ou 11 dígitos)"),
});

type LookupFormInputs = z.infer<typeof lookupSchema>;

const statusConfig = {
  SCHEDULED: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-400",
    label: "Agendado",
    icon: Clock,
  },
  CONFIRMED: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-400",
    label: "Confirmado",
    icon: CheckCircle2,
  },
  COMPLETED: {
    bg: "bg-slate-100 dark:bg-slate-900/30",
    text: "text-slate-700 dark:text-slate-400",
    label: "Concluído",
    icon: CheckCircle2,
  },
  CANCELED: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-400",
    label: "Cancelado",
    icon: AlertCircle,
  },
};

export default function LookupPage() {
  const [lookupParams, setLookupParams] = useState<{
    publicCode: string;
    customerPhone: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LookupFormInputs>({
    resolver: zodResolver(lookupSchema),
  });

  const phoneValue = watch("customerPhone");

  // Aplicar máscara de telefone (mesmo padrão usado no Step4PersonalData)
  useEffect(() => {
    if (phoneValue) {
      const cleaned = phoneValue.replace(/\D/g, "");
      if (cleaned !== phoneValue) {
        setValue("customerPhone", cleaned);
      }
    }
  }, [phoneValue, setValue]);

  const lookupQuery = useQuery({
    queryKey: ['appointment-lookup', lookupParams?.publicCode, lookupParams?.customerPhone],
    queryFn: async () => {
      if (!lookupParams) throw new Error('Código e telefone são obrigatórios');
      return apiService.lookupAppointment(lookupParams);
    },
    enabled: !!lookupParams,
    staleTime: 30 * 1000,
    retry: false,
  });

  const appointment = lookupQuery.data as IAppointment | undefined;
  const statusInfo = appointment ? statusConfig[appointment.status] : null;
  const StatusIcon = statusInfo ? statusInfo.icon : AlertCircle;

  const onSubmit = (data: LookupFormInputs) => {
    if (data.publicCode.trim() && data.customerPhone.trim()) {
      setLookupParams({
        publicCode: data.publicCode.trim().toUpperCase(),
        customerPhone: data.customerPhone.trim(),
      });
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen py-8 sm:py-16 lg:py-20">
        <div className="container-app">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-2 sm:mb-4">
              Consultar Agendamento
            </h1>
            <p className="text-base sm:text-lg text-text-secondary">
              Digite o código do seu agendamento para verificar o status
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto mb-8 sm:mb-12"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="publicCode"
                  className="block text-sm sm:text-base font-medium text-text-secondary mb-2"
                >
                  Código do Agendamento <span aria-label="obrigatório">*</span>
                </label>
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                    aria-hidden="true"
                  />
                  <input
                    id="publicCode"
                    type="text"
                    placeholder="Ex: ABC123XYZ"
                    {...register("publicCode")}
                    aria-invalid={Boolean(errors.publicCode)}
                    aria-describedby={errors.publicCode ? "code-error" : undefined}
                    className="w-full pl-10 pr-4 py-3 sm:py-4 bg-background border-2 border-card rounded-lg text-base sm:text-lg text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
                {errors.publicCode && (
                  <p
                    id="code-error"
                    role="alert"
                    className="text-sm text-red-500 mt-2 flex items-center gap-1"
                  >
                    <AlertCircle size={16} />
                    {errors.publicCode.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="customerPhone"
                  className="block text-sm sm:text-base font-medium text-text-secondary mb-2"
                >
                  Telefone usado no agendamento <span aria-label="obrigatório">*</span>
                </label>
                <div className="relative">
                  <Phone
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                    aria-hidden="true"
                  />
                  <input
                    id="customerPhone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    maxLength={11}
                    {...register("customerPhone")}
                    aria-invalid={Boolean(errors.customerPhone)}
                    aria-describedby={errors.customerPhone ? "phone-error" : undefined}
                    className="w-full pl-10 pr-4 py-3 sm:py-4 bg-background border-2 border-card rounded-lg text-base sm:text-lg text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
                {errors.customerPhone && (
                  <p
                    id="phone-error"
                    role="alert"
                    className="text-sm text-red-500 mt-2 flex items-center gap-1"
                  >
                    <AlertCircle size={16} />
                    {errors.customerPhone.message}
                  </p>
                )}
                <p className="text-xs text-text-secondary mt-1">
                  Usado para confirmar que o agendamento é seu (somente números)
                </p>
              </div>

              <button
                type="submit"
                disabled={lookupQuery.isLoading}
                className="w-full py-3 sm:py-4 bg-primary text-white font-medium text-base sm:text-lg rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px]"
              >
                {lookupQuery.isLoading && <Loader2 size={20} className="animate-spin" />}
                {lookupQuery.isLoading ? "Buscando..." : "Consultar"}
              </button>
            </form>
          </motion.div>

          {/* Results */}
          {lookupParams && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              {lookupQuery.isLoading && (
                <div className="text-center py-12">
                  <Loader2 size={48} className="animate-spin text-primary mx-auto mb-4" />
                  <p className="text-text-secondary">Buscando agendamento...</p>
                </div>
              )}

              {lookupQuery.isError && (
                <div className="bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-lg p-6 sm:p-8">
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      size={24}
                      className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-1">
                        Agendamento não encontrado
                      </h3>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        O código "{lookupParams?.publicCode}" e o telefone informado não correspondem a
                        nenhum agendamento. Verifique os dados e tente novamente.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLookupParams(null)}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Tentar Novamente
                  </button>
                </div>
              )}

              {appointment && statusInfo && (
                <div className="space-y-6">
                  {/* Status Card */}
                  <div
                    className={`${statusInfo.bg} border-2 ${statusInfo.text.replace("text-", "border-")} rounded-lg p-6 sm:p-8`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <StatusIcon size={28} />
                      <div>
                        <p className="text-xs sm:text-sm font-medium opacity-75">Status Atual</p>
                        <p className="text-xl sm:text-2xl font-bold">{statusInfo.label}</p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="bg-card/50 border border-card rounded-lg p-6 sm:p-8 space-y-6">
                    {/* Cliente */}
                    <div className="border-b border-card pb-4">
                      <p className="text-xs sm:text-sm font-medium text-text-secondary mb-1">
                        Nome do Cliente
                      </p>
                      <p className="text-lg sm:text-xl font-semibold text-text">
                        {appointment.customerName}
                      </p>
                    </div>

                    {/* Serviço */}
                    <div className="border-b border-card pb-4">
                      <p className="text-xs sm:text-sm font-medium text-text-secondary mb-2">
                        Serviço
                      </p>
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{appointment.service.icon}</span>
                        <div>
                          <p className="font-semibold text-text text-base sm:text-lg">
                            {appointment.service.name}
                          </p>
                          {appointment.service.description && (
                            <p className="text-sm text-text-secondary mt-1">
                              {appointment.service.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Data e Hora */}
                    <div className="border-b border-card pb-4">
                      <p className="text-xs sm:text-sm font-medium text-text-secondary mb-1">
                        Data e Hora
                      </p>
                      <div className="space-y-1">
                        <p className="text-base sm:text-lg font-semibold text-text">
                          {format(
                            new Date(appointment.appointmentDate),
                            "EEEE, dd 'de' MMMM 'de' yyyy",
                            {
                              locale: ptBR,
                            },
                          )}
                        </p>
                        <p className="text-lg sm:text-xl font-bold text-primary">
                          {format(new Date(appointment.appointmentDate), "HH:mm")}
                        </p>
                      </div>
                    </div>

                    {/* Duração e Preço */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-text-secondary mb-1">
                          Duração
                        </p>
                        <p className="text-base sm:text-lg font-semibold text-text">
                          {appointment.service.duration} minutos
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-text-secondary mb-1 flex items-center gap-1">
                          <DollarSign size={14} />
                          Valor
                        </p>
                        <p className="text-base sm:text-lg font-semibold text-text">
                          R$ {(() => {
                            const price = appointment.service.price;
                            const numPrice =
                              typeof price === "string" ? Number.parseFloat(price) : Number(price);
                            return Number.isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
                          })()}
                        </p>
                      </div>
                    </div>

                    {/* Contato */}
                    <div className="border-t border-card pt-4">
                      <p className="text-xs sm:text-sm font-medium text-text-secondary mb-3">
                        Informações de Contato
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm sm:text-base text-text">
                          <span className="font-medium">Telefone:</span> {appointment.customerPhone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Info Message */}
                  <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg p-4">
                    <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                      ℹ️ Este código é pessoal e intransferível. Você pode usar este código para
                      consultar seu agendamento a qualquer momento.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setLookupParams(null)}
                      className="flex-1 py-3 px-4 bg-background border border-card text-text font-medium rounded-lg hover:bg-background/80 transition-colors text-sm sm:text-base min-h-[44px] flex items-center justify-center"
                    >
                      Nova Consulta
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Info Section */}
          {!lookupParams && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto mt-12"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-card/50 border border-card rounded-lg p-6">
                  <div className="text-3xl mb-3">📧</div>
                  <h3 className="font-semibold text-text mb-2">Código por Email</h3>
                  <p className="text-sm text-text-secondary">
                    Você recebeu um código por email quando fez seu agendamento.
                  </p>
                </div>

                <div className="bg-card/50 border border-card rounded-lg p-6">
                  <div className="text-3xl mb-3">📱</div>
                  <h3 className="font-semibold text-text mb-2">Código por SMS</h3>
                  <p className="text-sm text-text-secondary">
                    Um código também foi enviado para seu telefone via SMS.
                  </p>
                </div>

                <div className="bg-card/50 border border-card rounded-lg p-6">
                  <div className="text-3xl mb-3">🔐</div>
                  <h3 className="font-semibold text-text mb-2">Privado e Seguro</h3>
                  <p className="text-sm text-text-secondary">
                    Seu código é pessoal e intransferível. Não compartilhe com terceiros.
                  </p>
                </div>

                <div className="bg-card/50 border border-card rounded-lg p-6">
                  <div className="text-3xl mb-3">⏱️</div>
                  <h3 className="font-semibold text-text mb-2">Sempre Disponível</h3>
                  <p className="text-sm text-text-secondary">
                    Consulte seu agendamento a qualquer hora do dia, 24/7.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
