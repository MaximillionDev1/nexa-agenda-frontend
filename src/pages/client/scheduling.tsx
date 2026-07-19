import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { PublicLayout } from "@/layouts/PublicLayout";
import { useSchedulingForm } from "@/hooks/useSchedulingForm";
import { Step1ServiceSelection } from "@/components/client/scheduling/Step1ServiceSelection";
import { Step2DateSelection } from "@/components/client/scheduling/Step2DateSelection";
import { Step3TimeSelection } from "@/components/client/scheduling/Step3TimeSelection";
import { Step4PersonalData } from "@/components/client/scheduling/Step4PersonalData";
import { Step5Review } from "@/components/client/scheduling/Step5Review";
import { apiService } from "@/services/api";
import { schedulingSteps } from "@/schemas/scheduling";
import { CheckCircle2 } from "lucide-react";

interface ErrorResponse {
  message?: string;
  code?: string;
}

export default function SchedulingPage() {
  const navigate = useNavigate();
  const { currentStep, formData, updateFormData, nextStep, prevStep } = useSchedulingForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createAppointmentMutation = useMutation<
    { publicCode: string },
    AxiosError<ErrorResponse>,
    {
      serviceId: string;
      appointmentDate: string;
      startTime: string;
      customerName: string;
      customerPhone: string;
      notes?: string;
    }
  >({
    mutationFn: async (data) => {
      return apiService.createAppointment(data);
    },
    onSuccess: (data) => {
      toast.success("Agendamento realizado com sucesso!");
      navigate(`/scheduling/confirmation/${data.publicCode}`);
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
    await createAppointmentMutation.mutateAsync({
      serviceId: formData.serviceId,
      appointmentDate: formData.appointmentDate,
      startTime: formData.startTime,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      notes: formData.notes,
    });
    setIsSubmitting(false);
  };

  return (
    <PublicLayout>
      <div className="py-12 md:py-20">
        <div className="container-app max-w-2xl">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-3">Agende seu serviço</h1>
            <p className="text-text-secondary">
              Preencha os campos abaixo para confirmar seu agendamento
            </p>
          </div>

          <div className="mb-12">
            <div className="flex items-center justify-between relative mb-8">
              {schedulingSteps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <motion.button
                    type="button"
                    onClick={() => {}}
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
          </div>

          <div className="bg-card/50 border border-card rounded-xl p-8 backdrop-blur-sm">
            <AnimatePresence mode="wait">
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
                      className="px-6 py-2 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
                    >
                      Próximo
                    </button>
                  </div>
                </motion.div>
              )}

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
                  <div className="flex justify-between gap-3 mt-8">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-2 bg-card hover:bg-card border border-card hover:border-primary text-text font-semibold rounded-lg transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      type="button"
                      onClick={handleStep2Submit}
                      className="px-6 py-2 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
                    >
                      Próximo
                    </button>
                  </div>
                </motion.div>
              )}

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
                  <div className="flex justify-between gap-3 mt-8">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-2 bg-card hover:bg-card border border-card hover:border-primary text-text font-semibold rounded-lg transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      type="button"
                      onClick={handleStep3Submit}
                      className="px-6 py-2 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
                    >
                      Próximo
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Step4PersonalData initialData={formData} onSubmit={handleStep4Submit} />
                  <div className="flex justify-between gap-3 mt-8">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-2 bg-card hover:bg-card border border-card hover:border-primary text-text font-semibold rounded-lg transition-colors"
                    >
                      Voltar
                    </button>
                  </div>
                </motion.div>
              )}

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
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
