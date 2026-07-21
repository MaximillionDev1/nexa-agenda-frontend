import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { FileText, Phone, User } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Schema que aceita formatação
const personalDataSchema = z.object({
  customerName: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  customerPhone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .transform((val) => val.replace(/\D/g, "")) // Remove formatting
    .refine((val) => /^\d{10,11}$/.test(val), "Telefone inválido (10 ou 11 dígitos)"),
  notes: z
    .string()
    .max(500, "Observação deve ter no máximo 500 caracteres")
    .optional()
    .or(z.literal("")),
});

type PersonalDataFormData = z.infer<typeof personalDataSchema>;

interface Step4PersonalDataProps {
  initialData?: Partial<PersonalDataFormData>;
  onSubmit: (data: PersonalDataFormData) => void;
}

// Função para formatar telefone na exibição - fora do componente
const formatPhoneDisplay = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");

  if (cleaned.length <= 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  }

  return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
};

export function Step4PersonalData({ initialData, onSubmit }: Step4PersonalDataProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PersonalDataFormData>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: initialData,
  });

  const phoneValue = watch("customerPhone");

  // Aplicar máscara de telefone
  useEffect(() => {
    if (phoneValue) {
      const cleaned = phoneValue.replace(/\D/g, "");
      const formatted = formatPhoneDisplay(cleaned);

      // Só atualizar se realmente mudou
      if (formatted !== phoneValue) {
        setValue("customerPhone", formatted, { shouldValidate: false });
      }
    }
  }, [phoneValue, setValue]);

  const handleSubmitForm = (data: PersonalDataFormData) => {
    // Garantir que o telefone será enviado sem formatação
    const cleanedData = {
      ...data,
      customerPhone: data.customerPhone.replace(/\D/g, ""),
    };

    onSubmit(cleanedData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold">Seus dados</h2>

      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
        {/* Nome */}
        <div className="space-y-2">
          <label
            htmlFor="customerName"
            className="flex items-center gap-2 text-sm font-medium text-text"
          >
            <User className="w-4 h-4" />
            Nome completo <span className="text-red-500">*</span>
          </label>
          <Input
            id="customerName"
            {...register("customerName")}
            type="text"
            placeholder="João Silva"
            error={errors.customerName?.message}
            disabled={false}
          />
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <label
            htmlFor="customerPhone"
            className="flex items-center gap-2 text-sm font-medium text-text"
          >
            <Phone className="w-4 h-4" />
            Telefone <span className="text-red-500">*</span>
          </label>
          <Input
            id="customerPhone"
            {...register("customerPhone")}
            type="tel"
            placeholder="(11) 99999-9999"
            error={errors.customerPhone?.message}
            maxLength={15}
          />
          <p className="text-xs text-text-secondary">Formato: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX</p>
        </div>

        {/* Observação */}
        <div className="space-y-2">
          <label htmlFor="notes" className="flex items-center gap-2 text-sm font-medium text-text">
            <FileText className="w-4 h-4" />
            Observação (opcional)
          </label>
          <textarea
            id="notes"
            {...register("notes")}
            placeholder="Deixe aqui alguma observação ou preferência..."
            className="w-full px-4 py-2 bg-background border border-card rounded-lg text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            rows={4}
            maxLength={500}
          />
          {errors.notes && <p className="text-sm text-red-500">{errors.notes.message}</p>}
          <p className="text-xs text-text-secondary">Máximo de 500 caracteres</p>
        </div>

        {/* Botão Enviar */}
        <Button type="submit" variant="primary" className="w-full mt-6 min-h-[44px]">
          Continuar para revisão
        </Button>
      </form>
    </motion.div>
  );
}
