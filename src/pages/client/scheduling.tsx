import { Step1ServiceSelection } from "@/components/client/scheduling/Step1ServiceSelection";
import { Step2DateSelection } from "@/components/client/scheduling/Step2DateSelection";
import { Step3TimeSelection } from "@/components/client/scheduling/Step3TimeSelection";
import { Step4PersonalData } from "@/components/client/scheduling/Step4PersonalData";
import { Step5Review } from "@/components/client/scheduling/Step5Review";
import { useSchedulingForm } from "@/hooks/useSchedulingForm";
import { PublicLayout } from "@/layouts/PublicLayout";
import { schedulingSteps } from "@/schemas/scheduling";
import { apiService } from "@/services/api";
import type { IAppointment } from "@/types";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ErrorResponse {
  message?: string;
  code?: string;
}

interface CreateAppointmentPayload {
  serviceId: string;
  appointmentDate: string;
  startTime: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
}

export default function SchedulingPage() {
  const navigate = useNavigate();
  const { currentStep, formData, updateFormData, nextStep, prevStep } = useSchedulingForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createAppointmentMutation = useMutation<
    IAppointment,
    AxiosError<ErrorResponse>,
    CreateAppointmentPayload
  >({
    mutationFn: async (data) => {
      // data.appointmentDate já vem no formato "yyyy-MM-dd" (gerado por
      // date-fns no Step2DateSelection, sem componente de horário/timezone).
      // NÃO reprocessar via `new Date(...)` aqui: strings de data "YYYY-MM-DD"
      // são interpretadas pelo JS como UTC meia-noite, e usar getters locais
      // (getFullYear/getMonth/getDate) sobre esse instante pode devolver o dia
      // anterior em timezones atrás do UTC (ex: Brasil), deslocando a data
      // enviada ao backend em relação à data que o usuário realmente selecionou.
      const response = await apiService.createAppointment(data);

      // Retornar o appointment, não a resposta inteira
      if (!response.data) {
        throw new Error("Resposta inválida do servidor");
      }

      return response.data;
    },
    onSuccess: (appointment) => {
      toast.success("Agendamento realizado com sucesso!");
      // Navega já levando os dados do agendamento recém-criado, evitando
      // uma nova busca (que exigiria telefone via lookup) só para exibir
      // a confirmação.
      navigate(`/scheduling/confirmation/${appointment.publicCode}`, {
        state: { appointment },
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message = error.response?.data?.message || "Erro ao realizar agendamento";
      toast.error(message);
    },
  });

  const handleStep1Submit = () => {
    if (!formData.serviceId) {
      toast.error("Selecione um serviço");
      return;
    }
    nextStep();
  };

  const handleStep2Submit = () => {
    if (!formData.appointmentDate) {
      toast.error("Selecione uma data");
      return;
    }
    nextStep();
  };

  const handleStep3Submit = () => {
    if (!formData.startTime) {
      toast.error("Selecione um horário");
      return;
    }
    nextStep();
  };

  const handleStep4Submit = (data: Record<string, unknown>) => {
    updateFormData(data);
    nextStep();
  };

  const handleConfirmScheduling = async () => {
    if (
      !formData.serviceId ||
      !formData.appointmentDate ||
      !formData.startTime ||
      !formData.customerName ||
      !formData.customerPhone
    ) {
      toast.error("Dados incompletos");
      return;
    }

    setIsSubmitting(true);

    try {
      await createAppointmentMutation.mutateAsync({
        serviceId: formData.serviceId,
        appointmentDate: formData.appointmentDate,
        startTime: formData.startTime,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        notes: formData.notes,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="py-8 sm:py-12 lg:py-20">
        <div className="container-app max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 sm:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-2 sm:mb-3">
              Agende seu serviço
            </h1>
            <p className="text-sm sm:text-base text-text-secondary">
              Preencha os campos abaixo para confirmar seu agendamento
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8 sm:mb-12"
          >
            <div className="flex items-center justify-between relative mb-8">
              {schedulingSteps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <motion.button
                    type="button"
                    onClick={() => {}}
                    disabled
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-all ${
                      step.id <= currentStep
                        ? "bg-primary text-white"
                        : "bg-card text-text-secondary"
                    }`}
                  >
                    {step.id < currentStep ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                  </motion.button>
                  <p className="text-xs text-center text-text-secondary">{step.title}</p>
                  {index < schedulingSteps.length - 1 && (
                    <div
                      className={`absolute top-5 left-1/2 w-12 h-1 transition-colors ${
                        step.id < currentStep ? "bg-primary" : "bg-card"
                      }`}
                      style={{ transform: "translateX(-50%)" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card/50 border border-card rounded-xl p-6 sm:p-8 backdrop-blur-sm"
          >
            <AnimatePresence mode="wait">
              {/* Step 1: Service Selection */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Step1ServiceSelection
                    selectedServiceId={formData.serviceId}
                    onSelectService={(serviceId) => {
                      updateFormData({ serviceId });
                    }}
                  />
                  <div className="flex justify-end gap-3 mt-8">
                    <button
                      type="button"
                      onClick={handleStep1Submit}
                      className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-h-[44px] flex items-center justify-center text-sm sm:text-base"
                    >
                      Próximo
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Date Selection */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Step2DateSelection
                    selectedDate={formData.appointmentDate}
                    onSelectDate={(date) => {
                      updateFormData({ appointmentDate: date });
                    }}
                  />
                  <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 bg-background border border-card hover:bg-background/80 text-text font-semibold rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-h-[44px] flex items-center justify-center text-sm sm:text-base"
                    >
                      Voltar
                    </button>
                    <button
                      type="button"
                      onClick={handleStep2Submit}
                      className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-h-[44px] flex items-center justify-center text-sm sm:text-base"
                    >
                      Próximo
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Time Selection */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Step3TimeSelection
                    serviceId={formData.serviceId}
                    appointmentDate={formData.appointmentDate}
                    selectedTime={formData.startTime}
                    onSelectTime={(time) => {
                      updateFormData({ startTime: time });
                    }}
                  />
                  <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 bg-background border border-card hover:bg-background/80 text-text font-semibold rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-h-[44px] flex items-center justify-center text-sm sm:text-base"
                    >
                      Voltar
                    </button>
                    <button
                      type="button"
                      onClick={handleStep3Submit}
                      className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-h-[44px] flex items-center justify-center text-sm sm:text-base"
                    >
                      Próximo
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Personal Data */}
              {currentStep === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Step4PersonalData initialData={formData} onSubmit={handleStep4Submit} />
                  <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 bg-background border border-card hover:bg-background/80 text-text font-semibold rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-h-[44px] flex items-center justify-center text-sm sm:text-base"
                    >
                      Voltar
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <motion.div
                  key="step-5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Step5Review
                    serviceId={formData.serviceId || ""}
                    appointmentDate={formData.appointmentDate || ""}
                    startTime={formData.startTime || ""}
                    customerName={formData.customerName || ""}
                    customerPhone={formData.customerPhone || ""}
                    notes={formData.notes}
                    onConfirm={handleConfirmScheduling}
                    onBack={prevStep}
                    isSubmitting={isSubmitting}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
}
