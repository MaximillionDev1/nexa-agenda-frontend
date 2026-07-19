import { z } from "zod";

export const schedulingSchema = z.object({
  serviceId: z.string().min(1, "Selecione um serviço"),
  appointmentDate: z.string().min(1, "Selecione uma data"),
  startTime: z.string().min(1, "Selecione um horário"),
  customerName: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  customerPhone: z.string().regex(/^\d{10,11}$/, "Telefone inválido"),
  notes: z.string().max(500, "Observação deve ter no máximo 500 caracteres").optional(),
});

export type SchedulingFormData = z.infer<typeof schedulingSchema>;

export const schedulingSteps = [
  { id: 1, title: "Serviço", description: "Escolha o serviço" },
  { id: 2, title: "Data", description: "Selecione a data" },
  { id: 3, title: "Horário", description: "Escolha o horário" },
  { id: 4, title: "Dados", description: "Suas informações" },
  { id: 5, title: "Revisão", description: "Confirme tudo" },
];
